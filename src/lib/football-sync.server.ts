import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { slugify } from "@/lib/format";
import { settleTip } from "@/lib/tips";

const HOST = "sportapi7.p.rapidapi.com";
const BASE = `https://${HOST}/api/v1`;
const IMG = "https://img.sofascore.com/api/v1";

export type ProviderLeague = {
  external_id: number;
  name: string;
  country: string | null;
  logo_url: string | null;
  season: string | null;
};

async function api<T = any>(path: string): Promise<T> {
  const key = process.env["API_FOOTBALL_KEY"];
  if (!key) throw new Error("Football data key is not configured");
  const res = await fetch(BASE + path, {
    headers: { "x-rapidapi-key": key, "x-rapidapi-host": HOST },
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`Football API ${res.status}: ${text.slice(0, 300)}`);
  return JSON.parse(text) as T;
}

/** Search any competition worldwide by name (optionally filtered by country). */
export async function searchLeagues(query: string, country?: string): Promise<ProviderLeague[]> {
  const q = query.trim();
  if (q.length < 2) return [];
  const json = await api<{ uniqueTournaments: any[] }>(
    `/search/unique-tournaments/${encodeURIComponent(q)}`,
  );
  const c = country?.trim().toLowerCase();
  return (json.uniqueTournaments ?? [])
    .filter((t) => (t.category?.sport?.slug ?? "football") === "football")
    .filter((t) => !c || (t.category?.name ?? "").toLowerCase().includes(c))
    .slice(0, 60)
    .map((t) => ({
      external_id: t.id as number,
      name: t.name as string,
      country: t.category?.name ?? null,
      logo_url: `${IMG}/unique-tournament/${t.id}/image`,
      season: null,
    }));
}

async function currentSeason(tournamentId: number): Promise<{ id: number; name: string } | null> {
  const json = await api<{ seasons: any[] }>(`/unique-tournament/${tournamentId}/seasons`);
  const s = (json.seasons ?? [])[0];
  return s ? { id: s.id as number, name: String(s.year ?? s.name) } : null;
}

export async function trackLeague(l: ProviderLeague) {
  const season = (await currentSeason(l.external_id))?.name ?? l.season ?? null;

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

async function upsertTeams(teams: { id: number; name: string }[]) {
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
          crest_url: `${IMG}/team/${t.id}/image`,
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

function mapStatus(type?: string): LocalStatus {
  switch (type) {
    case "inprogress":
      return "live";
    case "finished":
      return "finished";
    case "postponed":
    case "delayed":
    case "interrupted":
    case "suspended":
      return "postponed";
    case "canceled":
    case "cancelled":
      return "cancelled";
    default:
      return "scheduled";
  }
}

function rowFromEvent(e: any, competitionId: string, teamMap: Map<number, string>) {
  const homeId = teamMap.get(e.homeTeam?.id);
  const awayId = teamMap.get(e.awayTeam?.id);
  if (!homeId || !awayId) return null;
  const status = mapStatus(e.status?.type);
  return {
    external_id: e.id as number,
    competition_id: competitionId,
    home_team_id: homeId,
    away_team_id: awayId,
    kickoff_at: new Date((e.startTimestamp as number) * 1000).toISOString(),
    venue: e.venue?.stadium?.name ?? e.venue?.name ?? null,
    status,
    home_score: status === "scheduled" ? null : (e.homeScore?.current ?? null),
    away_score: status === "scheduled" ? null : (e.awayScore?.current ?? null),
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

/** Pull upcoming fixtures for every tracked competition, from now to +days. */
export async function syncFixtures(days = 10) {
  const { data: comps, error } = await supabaseAdmin
    .from("competitions")
    .select("id, external_id, season")
    .eq("is_tracked", true)
    .not("external_id", "is", null);
  if (error) throw new Error(error.message);

  const until = Date.now() + days * 86400_000;
  let created = 0;
  let updated = 0;

  for (const c of comps ?? []) {
    const season = await currentSeason(c.external_id!);
    if (!season) continue;
    if (season.name !== c.season) {
      await supabaseAdmin.from("competitions").update({ season: season.name }).eq("id", c.id);
    }

    const events: any[] = [];
    for (let page = 0; page < 3; page++) {
      let json: { events?: any[]; hasNextPage?: boolean };
      try {
        json = await api(
          `/unique-tournament/${c.external_id}/season/${season.id}/events/next/${page}`,
        );
      } catch {
        break;
      }
      const batch = json.events ?? [];
      events.push(...batch);
      const last = batch[batch.length - 1];
      if (!json.hasNextPage || !last || last.startTimestamp * 1000 > until) break;
    }

    const inWindow = events.filter((e) => e.startTimestamp * 1000 <= until);
    if (!inWindow.length) continue;

    const teamMap = await upsertTeams(
      inWindow.flatMap((e) => [
        { id: e.homeTeam?.id, name: e.homeTeam?.name },
        { id: e.awayTeam?.id, name: e.awayTeam?.name },
      ]).filter((t) => t.id && t.name),
    );

    const rows = inWindow
      .map((e) => rowFromEvent(e, c.id, teamMap))
      .filter(Boolean) as any[];
    const res = await saveRows(rows);
    created += res.created;
    updated += res.updated;
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

  for (const m of pending) {
    let json: { event?: any };
    try {
      json = await api(`/event/${m.external_id}`);
    } catch {
      continue;
    }
    const e = json.event;
    if (!e) continue;
    const status = mapStatus(e.status?.type);
    const home = e.homeScore?.current ?? null;
    const away = e.awayScore?.current ?? null;
    await supabaseAdmin
      .from("matches")
      .update({ status, home_score: home, away_score: away })
      .eq("id", m.id);
    if (status !== "finished" || home == null || away == null) continue;
    finished++;
    settled += await settleMatchPredictions(m.id, home, away);
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
