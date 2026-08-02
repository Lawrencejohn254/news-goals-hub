import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { slugify } from "@/lib/format";
import { settleTip } from "@/lib/tips";

const BASE = "https://api-football-v1.p.rapidapi.com/v3";

export type ProviderLeague = {
  external_id: number;
  name: string;
  country: string | null;
  logo_url: string | null;
  season: string | null;
};

async function api<T = any>(path: string, params: Record<string, string | number>): Promise<T> {
  const key = process.env["API_FOOTBALL_KEY"];
  if (!key) throw new Error("Football data key is not configured");
  const url = new URL(BASE + path);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, String(v));
  const res = await fetch(url, {
    headers: {
      "x-rapidapi-key": key,
      "x-rapidapi-host": "api-football-v1.p.rapidapi.com",
    },
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`Football API ${res.status}: ${text.slice(0, 300)}`);
  const json = JSON.parse(text);
  if (json.errors && !Array.isArray(json.errors) && Object.keys(json.errors).length) {
    throw new Error(`Football API: ${JSON.stringify(json.errors).slice(0, 300)}`);
  }
  return json as T;
}

export async function searchLeagues(query: string, country?: string): Promise<ProviderLeague[]> {
  const params: Record<string, string> = {};
  if (query.trim().length >= 3) params["search"] = query.trim();
  if (country?.trim()) params["country"] = country.trim();
  if (!params["search"] && !params["country"]) params["current"] = "true";
  const json = await api<{ response: any[] }>("/leagues", params);
  return (json.response ?? []).slice(0, 60).map((r) => {
    const seasons: any[] = r.seasons ?? [];
    const current = seasons.find((s) => s.current) ?? seasons[seasons.length - 1];
    return {
      external_id: r.league.id as number,
      name: r.league.name as string,
      country: r.country?.name ?? null,
      logo_url: r.league.logo ?? null,
      season: current ? String(current.year) : null,
    };
  });
}

export async function trackLeague(l: ProviderLeague) {
  const { data: existing } = await supabaseAdmin
    .from("competitions")
    .select("id")
    .eq("external_id", l.external_id)
    .maybeSingle();

  if (existing) {
    const { error } = await supabaseAdmin
      .from("competitions")
      .update({ is_tracked: true, season: l.season, logo_url: l.logo_url, country: l.country })
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
      season: l.season,
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

function isoDate(d: Date) {
  return d.toISOString().slice(0, 10);
}

async function upsertTeams(teams: { id: number; name: string; logo: string | null }[]) {
  const ids = [...new Set(teams.map((t) => t.id))];
  if (!ids.length) return new Map<number, string>();
  const { data: existing, error } = await supabaseAdmin
    .from("teams")
    .select("id, external_id")
    .in("external_id", ids);
  if (error) throw new Error(error.message);
  const map = new Map<number, string>();
  for (const t of existing ?? []) if (t.external_id != null) map.set(t.external_id, t.id);

  const missing = teams.filter((t, i) => !map.has(t.id) && teams.findIndex((x) => x.id === t.id) === i);
  if (missing.length) {
    const { data: inserted, error: insErr } = await supabaseAdmin
      .from("teams")
      .insert(
        missing.map((t) => ({
          name: t.name,
          slug: `${slugify(t.name)}-${t.id}`,
          crest_url: t.logo,
          external_id: t.id,
        })),
      )
      .select("id, external_id");
    if (insErr) throw new Error(insErr.message);
    for (const t of inserted ?? []) if (t.external_id != null) map.set(t.external_id, t.id);
  }
  return map;
}

const STATUS_MAP: Record<string, "scheduled" | "live" | "finished" | "postponed" | "cancelled"> = {
  TBD: "scheduled",
  NS: "scheduled",
  "1H": "live",
  HT: "live",
  "2H": "live",
  ET: "live",
  BT: "live",
  P: "live",
  LIVE: "live",
  FT: "finished",
  AET: "finished",
  PEN: "finished",
  PST: "postponed",
  SUSP: "postponed",
  INT: "postponed",
  CANC: "cancelled",
  ABD: "cancelled",
  AWD: "finished",
  WO: "finished",
};

/** Pull fixtures for every tracked competition from today to +days. */
export async function syncFixtures(days = 10) {
  const { data: comps, error } = await supabaseAdmin
    .from("competitions")
    .select("id, external_id, season")
    .eq("is_tracked", true)
    .not("external_id", "is", null);
  if (error) throw new Error(error.message);

  const from = isoDate(new Date());
  const to = isoDate(new Date(Date.now() + days * 86400_000));
  let created = 0;
  let updated = 0;

  for (const c of comps ?? []) {
    const json = await api<{ response: any[] }>("/fixtures", {
      league: c.external_id!,
      season: c.season ?? new Date().getFullYear(),
      from,
      to,
    });
    const fixtures = json.response ?? [];
    if (!fixtures.length) continue;

    const teamMap = await upsertTeams(
      fixtures.flatMap((f) => [
        { id: f.teams.home.id, name: f.teams.home.name, logo: f.teams.home.logo ?? null },
        { id: f.teams.away.id, name: f.teams.away.name, logo: f.teams.away.logo ?? null },
      ]),
    );

    const extIds = fixtures.map((f) => f.fixture.id as number);
    const { data: existing } = await supabaseAdmin
      .from("matches")
      .select("id, external_id")
      .in("external_id", extIds);
    const existingMap = new Map<number, string>();
    for (const m of existing ?? []) if (m.external_id != null) existingMap.set(m.external_id, m.id);

    const rows = fixtures
      .map((f) => {
        const homeId = teamMap.get(f.teams.home.id);
        const awayId = teamMap.get(f.teams.away.id);
        if (!homeId || !awayId) return null;
        return {
          external_id: f.fixture.id as number,
          competition_id: c.id,
          home_team_id: homeId,
          away_team_id: awayId,
          kickoff_at: f.fixture.date as string,
          venue: f.fixture.venue?.name ?? null,
          status: STATUS_MAP[f.fixture.status?.short] ?? "scheduled",
          home_score: f.goals?.home ?? null,
          away_score: f.goals?.away ?? null,
        };
      })
      .filter(Boolean) as any[];

    for (const row of rows) {
      const id = existingMap.get(row.external_id);
      if (id) {
        const { external_id: _e, ...rest } = row;
        await supabaseAdmin.from("matches").update(rest).eq("id", id);
        updated++;
      } else {
        await supabaseAdmin.from("matches").insert(row);
        created++;
      }
    }
  }

  return { competitions: comps?.length ?? 0, created, updated };
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
  if (!pending?.length) return { checked: 0, finished: 0, settled: 0 };

  let finished = 0;
  let settled = 0;

  for (let i = 0; i < pending.length; i += 20) {
    const chunk = pending.slice(i, i + 20);
    const json = await api<{ response: any[] }>("/fixtures", {
      ids: chunk.map((m) => m.external_id).join("-"),
    });
    for (const f of json.response ?? []) {
      const row = chunk.find((m) => m.external_id === f.fixture.id);
      if (!row) continue;
      const status = STATUS_MAP[f.fixture.status?.short] ?? "scheduled";
      const home = f.goals?.home ?? null;
      const away = f.goals?.away ?? null;
      await supabaseAdmin
        .from("matches")
        .update({ status, home_score: home, away_score: away })
        .eq("id", row.id);
      if (status !== "finished" || home == null || away == null) continue;
      finished++;
      settled += await settleMatchPredictions(row.id, home, away);
    }
  }

  return { checked: pending.length, finished, settled };
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
