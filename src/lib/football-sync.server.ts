import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { slugify } from "@/lib/format";
import { settleTip } from "@/lib/tips";

const BASE = "https://v3.football.api-sports.io";

export type ProviderLeague = {
  external_id: number;
  name: string;
  country: string | null;
  logo_url: string | null;
  season: string | null;
};

export class QuotaError extends Error {
  constructor() {
    super(
      "Football data quota reached for the current API plan. Syncing will resume when the quota resets, or upgrade the plan.",
    );
    this.name = "QuotaError";
  }
}

async function api<T = any>(path: string): Promise<T> {
  const key = process.env["API_FOOTBALL_KEY"];
  if (!key) throw new Error("Football data key is not configured");
  const res = await fetch(BASE + path, { headers: { "x-apisports-key": key } });
  const text = await res.text();
  if (res.status === 429) throw new QuotaError();
  if (!res.ok) throw new Error(`Football API ${res.status}: ${text.slice(0, 300)}`);
  const json = JSON.parse(text);
  const errs = json?.errors;
  if (errs && !Array.isArray(errs) && Object.keys(errs).length) {
    const msg = Object.values(errs).join("; ");
    if (/limit|quota|too many/i.test(msg)) throw new QuotaError();
    if (errs.plan) throw new PlanError(msg);
    throw new Error(`Football API: ${msg}`);
  }
  return json as T;
}

const seasonCache = new Map<number, number | null>();

function pickSeason(seasons: any[]): number | null {
  const cur = (seasons ?? []).find((s) => s.current);
  const last = (seasons ?? [])[(seasons ?? []).length - 1];
  const y = cur?.year ?? last?.year;
  return typeof y === "number" ? y : null;
}

/** Search any competition worldwide by name (optionally filtered by country). */
export async function searchLeagues(query: string, country?: string): Promise<ProviderLeague[]> {
  const q = query.trim();
  if (q.length < 3) return [];
  let path = `/leagues?search=${encodeURIComponent(q)}`;
  if (country?.trim()) path += `&country=${encodeURIComponent(country.trim())}`;
  const json = await api<{ response: any[] }>(path);
  return (json.response ?? []).slice(0, 60).map((r) => {
    const season = pickSeason(r.seasons);
    if (season != null) seasonCache.set(r.league.id, season);
    return {
      external_id: r.league.id as number,
      name: r.league.name as string,
      country: r.country?.name ?? null,
      logo_url: r.league.logo ?? null,
      season: season != null ? String(season) : null,
    };
  });
}

async function currentSeason(leagueId: number): Promise<number | null> {
  if (seasonCache.has(leagueId)) return seasonCache.get(leagueId)!;
  const json = await api<{ response: any[] }>(`/leagues?id=${leagueId}`);
  const season = pickSeason(json.response?.[0]?.seasons ?? []);
  seasonCache.set(leagueId, season);
  return season;
}

export async function trackLeague(l: ProviderLeague) {
  const season = (await currentSeason(l.external_id))?.toString() ?? l.season ?? null;

  const { data: existing } = await supabaseAdmin
    .from("competitions")
    .select("id")
    .eq("external_id", l.external_id)
    .maybeSingle();

  if (existing) {
    const { error } = await supabaseAdmin
      .from("competitions")
      .update({ is_tracked: true, season, logo_url: l.logo_url, country: l.country })
      .eq("id", existing.id);
    if (error) throw new Error(error.message);
    return existing.id;
  }

  const { data, error } = await supabaseAdmin
    .from("competitions")
    .insert({
      name: l.name,
      slug: `${slugify(l.name)}-${l.external_id}`,
      country: l.country,
      logo_url: l.logo_url,
      season,
      external_id: l.external_id,
      is_tracked: true,
      sort_order: 0,
    })
    .select("id")
    .single();
  if (error) throw new Error(error.message);
  return data.id;
}

export async function setLeagueTracked(competitionId: string, tracked: boolean) {
  const { error } = await supabaseAdmin
    .from("competitions")
    .update({ is_tracked: tracked })
    .eq("id", competitionId);
  if (error) throw new Error(error.message);
}

async function upsertTeams(teams: { id: number; name: string; logo?: string | null }[]) {
  const uniq = teams.filter((t, i) => teams.findIndex((x) => x.id === t.id) === i);
  if (!uniq.length) return new Map<number, string>();
  const { data: existing, error } = await supabaseAdmin
    .from("teams")
    .select("id, external_id")
    .in(
      "external_id",
      uniq.map((t) => t.id),
    );
  if (error) throw new Error(error.message);
  const map = new Map<number, string>();
  for (const t of existing ?? []) if (t.external_id != null) map.set(t.external_id, t.id);

  const missing = uniq.filter((t) => !map.has(t.id));
  if (missing.length) {
    const { data: inserted, error: insErr } = await supabaseAdmin
      .from("teams")
      .insert(
        missing.map((t) => ({
          name: t.name,
          slug: `${slugify(t.name)}-${t.id}`,
          crest_url: t.logo ?? `https://media.api-sports.io/football/teams/${t.id}.png`,
          external_id: t.id,
        })),
      )
      .select("id, external_id");
    if (insErr) throw new Error(insErr.message);
    for (const t of inserted ?? []) if (t.external_id != null) map.set(t.external_id, t.id);
  }
  return map;
}

type LocalStatus = "scheduled" | "live" | "finished" | "postponed" | "cancelled";

function mapStatus(short?: string): LocalStatus {
  switch (short) {
    case "1H":
    case "HT":
    case "2H":
    case "ET":
    case "BT":
    case "P":
    case "LIVE":
    case "INT":
      return "live";
    case "FT":
    case "AET":
    case "PEN":
      return "finished";
    case "PST":
    case "SUSP":
      return "postponed";
    case "CANC":
    case "ABD":
    case "AWD":
    case "WO":
      return "cancelled";
    default:
      return "scheduled";
  }
}

function rowFromFixture(f: any, competitionId: string, teamMap: Map<number, string>) {
  const homeId = teamMap.get(f.teams?.home?.id);
  const awayId = teamMap.get(f.teams?.away?.id);
  if (!homeId || !awayId) return null;
  const status = mapStatus(f.fixture?.status?.short);
  return {
    external_id: f.fixture.id as number,
    competition_id: competitionId,
    home_team_id: homeId,
    away_team_id: awayId,
    kickoff_at: new Date((f.fixture.timestamp as number) * 1000).toISOString(),
    venue: f.fixture?.venue?.name ?? null,
    status,
    home_score: status === "scheduled" ? null : (f.goals?.home ?? null),
    away_score: status === "scheduled" ? null : (f.goals?.away ?? null),
  };
}

async function saveRows(rows: any[]) {
  let created = 0;
  let updated = 0;
  if (!rows.length) return { created, updated };
  const { data: existing } = await supabaseAdmin
    .from("matches")
    .select("id, external_id")
    .in(
      "external_id",
      rows.map((r) => r.external_id),
    );
  const map = new Map<number, string>();
  for (const m of existing ?? []) if (m.external_id != null) map.set(m.external_id, m.id);

  for (const row of rows) {
    const id = map.get(row.external_id);
    if (id) {
      const { external_id: _e, ...rest } = row;
      await supabaseAdmin.from("matches").update(rest).eq("id", id);
      updated++;
    } else {
      await supabaseAdmin.from("matches").insert(row);
      created++;
    }
  }
  return { created, updated };
}

const ymd = (d: Date) => d.toISOString().slice(0, 10);

/** Pull upcoming fixtures for every tracked competition, from today to +days. */
export async function syncFixtures(days = 10) {
  const { data: comps, error } = await supabaseAdmin
    .from("competitions")
    .select("id, external_id, season")
    .eq("is_tracked", true)
    .not("external_id", "is", null);
  if (error) throw new Error(error.message);

  const from = ymd(new Date());
  const to = ymd(new Date(Date.now() + days * 86400_000));
  let created = 0;
  let updated = 0;
  let quotaExceeded = false;

  for (const c of comps ?? []) {
    let season: number | null = null;
    try {
      season = await currentSeason(c.external_id!);
    } catch (e) {
      if (e instanceof QuotaError) {
        quotaExceeded = true;
        break;
      }
      continue;
    }
    if (season == null) continue;
    if (String(season) !== c.season) {
      await supabaseAdmin.from("competitions").update({ season: String(season) }).eq("id", c.id);
    }

    let fixtures: any[] = [];
    try {
      const json = await api<{ response: any[] }>(
        `/fixtures?league=${c.external_id}&season=${season}&from=${from}&to=${to}`,
      );
      fixtures = json.response ?? [];
    } catch (e) {
      if (e instanceof QuotaError) {
        quotaExceeded = true;
        break;
      }
      continue;
    }

    if (fixtures.length) {
      const teamMap = await upsertTeams(
        fixtures
          .flatMap((f) => [f.teams?.home, f.teams?.away])
          .filter((t) => t?.id && t?.name)
          .map((t) => ({ id: t.id, name: t.name, logo: t.logo })),
      );
      const rows = fixtures
        .map((f) => rowFromFixture(f, c.id, teamMap))
        .filter(Boolean) as any[];
      const res = await saveRows(rows);
      created += res.created;
      updated += res.updated;
    }
  }

  return { competitions: comps?.length ?? 0, created, updated, quotaExceeded };
}

/** Refresh results for started-but-unfinished matches and settle their tips. */
export async function settleResults() {
  const { data: pending, error } = await supabaseAdmin
    .from("matches")
    .select("id, external_id, status")
    .not("external_id", "is", null)
    .in("status", ["scheduled", "live"])
    .lte("kickoff_at", new Date().toISOString())
    .gte("kickoff_at", new Date(Date.now() - 14 * 86400_000).toISOString());
  if (error) throw new Error(error.message);
  if (!pending?.length) return { checked: 0, finished: 0, settled: 0, quotaExceeded: false };

  let finished = 0;
  let settled = 0;
  let quotaExceeded = false;

  // API-Football allows batching up to 20 fixture ids per request.
  for (let i = 0; i < pending.length; i += 20) {
    const batch = pending.slice(i, i + 20);
    let fixtures: any[] = [];
    try {
      const json = await api<{ response: any[] }>(
        `/fixtures?ids=${batch.map((m) => m.external_id).join("-")}`,
      );
      fixtures = json.response ?? [];
    } catch (err) {
      if (err instanceof QuotaError) {
        quotaExceeded = true;
        break;
      }
      continue;
    }

    for (const f of fixtures) {
      const local = batch.find((m) => m.external_id === f.fixture?.id);
      if (!local) continue;
      const status = mapStatus(f.fixture?.status?.short);
      const home = f.goals?.home ?? null;
      const away = f.goals?.away ?? null;
      await supabaseAdmin
        .from("matches")
        .update({ status, home_score: home, away_score: away })
        .eq("id", local.id);
      if (status !== "finished" || home == null || away == null) continue;
      finished++;
      settled += await settleMatchPredictions(local.id, home, away);
    }
  }

  return { checked: pending.length, finished, settled, quotaExceeded };
}

export async function settleMatchPredictions(matchId: string, home: number, away: number) {
  const { data: preds } = await supabaseAdmin
    .from("predictions")
    .select("id, tip, predicted_home_score, predicted_away_score")
    .eq("match_id", matchId)
    .eq("result", "pending");
  let count = 0;
  for (const p of preds ?? []) {
    const outcome = settleTip(p.tip, home, away, p.predicted_home_score, p.predicted_away_score);
    if (!outcome) continue;
    await supabaseAdmin
      .from("predictions")
      .update({ result: outcome, settled_at: new Date().toISOString() })
      .eq("id", p.id);
    count++;
  }
  return count;
}
