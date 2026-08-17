import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { slugify } from "@/lib/format";
import { settleTip } from "@/lib/tips";

const BASE = "https://api.football-data.org/v4";

export type ProviderLeague = {
  external_id: number | null;
  provider_code: string;
  name: string;
  country: string | null;
  logo_url: string | null;
  season: string | null;
};

/** The API account itself is blocked/suspended by the provider. */
export class AccessError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AccessError";
  }
}

export class QuotaError extends Error {
  constructor() {
    super(
      "Football data quota reached for the current API plan. Syncing will resume when the quota resets, or upgrade the plan.",
    );
    this.name = "QuotaError";
  }
}
/** The current API plan does not cover the requested date/season window. */
export class PlanError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PlanError";
  }
}


async function api<T = any>(path: string): Promise<T> {
  const key = process.env["FOOTBALL_DATA_API_TOKEN"];

if (!key) {
  throw new Error("Football-data.org API token is not configured");
}

const res = await fetch(BASE + path, {
  headers: {
    "X-Auth-Token": key,
  },
});
  const text = await res.text();
  if (res.status === 429) throw new QuotaError();
  if (!res.ok) throw new Error(`Football API ${res.status}: ${text.slice(0, 300)}`);
  const json = JSON.parse(text);
  const errs = json?.errors;
  if (errs && !Array.isArray(errs) && Object.keys(errs).length) {
    const msg = Object.values(errs).join("; ");
    if (/limit|quota|too many/i.test(msg)) throw new QuotaError();
    if (errs.access || /suspend|blocked|not authorized|token/i.test(msg)) throw new AccessError(msg);
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

/** Search football-data.org competitions by name or code. */
export async function searchLeagues(
  query: string,
  country?: string
): Promise<ProviderLeague[]> {
  const q = query.trim().toLowerCase();

  if (q.length < 2) return [];

  const json = await api<{ competitions: any[] }>(
    "/competitions"
  );

  return (json.competitions ?? [])
    .filter((competition) => {
      const name = String(
        competition.name ?? ""
      ).toLowerCase();

      const code = String(
        competition.code ?? ""
      ).toLowerCase();

      const competitionCountry = String(
        competition.area?.name ?? ""
      ).toLowerCase();

      const matchesQuery =
        name.includes(q) || code.includes(q);

      const matchesCountry =
        !country?.trim() ||
        competitionCountry.includes(
          country.trim().toLowerCase()
        );

      return matchesQuery && matchesCountry;
    })
    .slice(0, 60)
    .map((competition) => ({
      external_id:
        typeof competition.id === "number"
          ? competition.id
          : null,

      provider_code:
        competition.code as string,

      name:
        competition.name as string,

      country:
        competition.area?.name ?? null,

      logo_url:
        competition.emblem ?? null,

      season:
        competition.currentSeason?.startDate
          ? String(
              new Date(
                competition.currentSeason.startDate
              ).getFullYear()
            )
          : null,
    }));
}



export async function trackLeague(
  l: ProviderLeague
) {
  const providerCode =
    l.provider_code.trim().toUpperCase();

  if (!providerCode) {
    throw new Error(
      "Football-data.org competition code is required"
    );
  }

  const { data: existing } = await supabaseAdmin
    .from("competitions")
    .select("id")
    .eq("provider_code", providerCode)
    .maybeSingle();

  if (existing) {
    const { error } = await supabaseAdmin
      .from("competitions")
      .update({
        is_tracked: true,
        season: l.season,
        logo_url: l.logo_url,
        country: l.country,
      })
      .eq("id", existing.id);

    if (error) throw new Error(error.message);

    return existing.id;
  }

  const { data, error } = await supabaseAdmin
    .from("competitions")
    .insert({
      name: l.name,
      slug: `${slugify(l.name)}-${providerCode.toLowerCase()}`,
      country: l.country,
      logo_url: l.logo_url,
      season: l.season,

      // Keep this nullable because football-data.org
      // uses provider_code as the primary identifier.
      external_id: l.external_id,

      provider_code: providerCode,
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

function mapStatus(status?: string): LocalStatus {
  switch (status) {
    case "IN_PLAY":
    case "PAUSED":
      return "live";

    case "FINISHED":
    case "AWARDED":
      return "finished";

    case "POSTPONED":
    case "SUSPENDED":
      return "postponed";

    case "CANCELLED":
      return "cancelled";

    case "SCHEDULED":
    case "TIMED":
    default:
      return "scheduled";
  }
}

function rowFromFixture(
  f: any,
  competitionId: string,
  teamMap: Map<number, string>
) {
  const homeId = teamMap.get(f.homeTeam?.id);
  const awayId = teamMap.get(f.awayTeam?.id);

  if (!homeId || !awayId) return null;

  const status = mapStatus(f.status);

  const homeScore = f.score?.fullTime?.home ?? null;
  const awayScore = f.score?.fullTime?.away ?? null;

  return {
    external_id: f.id as number,
    competition_id: competitionId,
    home_team_id: homeId,
    away_team_id: awayId,
    kickoff_at: new Date(f.utcDate).toISOString(),
    venue: f.venue ?? null,
    status,
    home_score: status === "scheduled" ? null : homeScore,
    away_score: status === "scheduled" ? null : awayScore,
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

/** Fetch matches for a competition within a date range. */
async function fixturesForCompetition(
  competitionCode: string,
  dateFrom: string,
  dateTo: string
) {
  const params = new URLSearchParams({
    dateFrom,
    dateTo,
  });

  const json = await api<{ matches: any[] }>(
    `/competitions/${encodeURIComponent(competitionCode)}/matches?${params.toString()}`
  );

  return json.matches ?? [];
}

async function persistFixtures(
  fixtures: any[],
  compByCode: Map<string, string>
) {
  if (!fixtures.length) {
    return { created: 0, updated: 0 };
  }

  const teamMap = await upsertTeams(
    fixtures
      .flatMap((f) => [f.homeTeam, f.awayTeam])
      .filter((t) => t?.id && t?.name)
      .map((t) => ({
        id: t.id,
        name: t.name,
        logo: t.crest ?? null,
      }))
  );

  const rows = fixtures
    .map((f) => {
      const competitionCode = f.competition?.code;
      const competitionId = competitionCode
        ? compByCode.get(competitionCode)
        : undefined;

      return competitionId
        ? rowFromFixture(f, competitionId, teamMap)
        : null;
    })
    .filter(Boolean) as any[];

  return await saveRows(rows);
}

/** Pull fixtures for every tracked competition for the requested date range. */
export async function syncFixtures(days = 30) {
  const { data: comps, error } = await supabaseAdmin
    .from("competitions")
    .select("id, provider_code, season")
    .eq("is_tracked", true)
    .not("provider_code", "is", null);

  if (error) throw new Error(error.message);

  const dateFrom = ymd(new Date());
  const dateTo = ymd(
    new Date(Date.now() + days * 86400_000)
  );

  let created = 0;
  let updated = 0;
  let quotaExceeded = false;
  let planLimited = false;

  for (const competition of comps ?? []) {
    const code = competition.provider_code?.trim();

    if (!code) continue;

    try {
      const fixtures = await fixturesForCompetition(
        code,
        dateFrom,
        dateTo
      );

      const res = await persistFixtures(
        fixtures,
        new Map([[code, competition.id]])
      );

      created += res.created;
      updated += res.updated;
    } catch (e) {
      if (e instanceof QuotaError) {
        quotaExceeded = true;
        break;
      }

      if (e instanceof PlanError) {
        planLimited = true;
        continue;
      }

      console.error(
        `Failed to sync ${code}:`,
        e instanceof Error ? e.message : e
      );
    }
  }

  return {
    competitions: comps?.length ?? 0,
    created,
    updated,
    quotaExceeded,
    planLimited,
    dateFrom,
    dateTo,
  };
}

/** Refresh results for started-but-unfinished matches and settle their tips. */
export async function settleResults() {
  const { data: pending, error } = await supabaseAdmin
    .from("matches")
    .select(`
      id,
      external_id,
      status,
      kickoff_at,
      competition_id,
      competitions!inner(provider_code)
    `)
    .not("external_id", "is", null)
    .in("status", ["scheduled", "live"])
    .lte("kickoff_at", new Date().toISOString())
    .gte(
      "kickoff_at",
      new Date(Date.now() - 14 * 86400_000).toISOString()
    );

  if (error) throw new Error(error.message);

  if (!pending?.length) {
    return {
      checked: 0,
      finished: 0,
      settled: 0,
      quotaExceeded: false,
      planLimited: false,
      errors: [] as string[],
    };
  }

  const byId = new Map<
    number,
    {
      id: string;
    }
  >();

  const byCompetition = new Map<string, Set<number>>();

  for (const match of pending) {
    if (match.external_id == null) continue;

    byId.set(match.external_id, {
      id: match.id,
    });

    const competition = Array.isArray(match.competitions)
      ? match.competitions[0]
      : match.competitions;

    const code = competition?.provider_code;

    if (!code) continue;

    if (!byCompetition.has(code)) {
      byCompetition.set(code, new Set());
    }

    byCompetition.get(code)!.add(match.external_id);
  }

  let finished = 0;
  let settled = 0;
  let quotaExceeded = false;
  let planLimited = false;

  const errors: string[] = [];

  const dateFrom = ymd(
    new Date(Date.now() - 14 * 86400_000)
  );

  const dateTo = ymd(new Date());

  for (const [competitionCode, matchIds] of byCompetition) {
    let fixtures: any[];

    try {
      fixtures = await fixturesForCompetition(
        competitionCode,
        dateFrom,
        dateTo
      );
    } catch (err) {
      if (err instanceof QuotaError) {
        quotaExceeded = true;
        break;
      }

      if (err instanceof PlanError) {
        planLimited = true;
        errors.push(
          `${competitionCode}: ${err.message}`
        );
        continue;
      }

      if (err instanceof AccessError) {
        errors.push(
          `${competitionCode}: ${err.message}`
        );
        break;
      }

      errors.push(
        `${competitionCode}: ${
          err instanceof Error ? err.message : String(err)
        }`
      );

      continue;
    }

    for (const fixture of fixtures) {
      const externalId = fixture.id;

      if (!matchIds.has(externalId)) continue;

      const local = byId.get(externalId);

      if (!local) continue;

      const status = mapStatus(fixture.status);

      const home = fixture.score?.fullTime?.home ?? null;
      const away = fixture.score?.fullTime?.away ?? null;

      await supabaseAdmin
        .from("matches")
        .update({
          status,
          home_score: home,
          away_score: away,
        })
        .eq("id", local.id);

      if (
        status !== "finished" ||
        home == null ||
        away == null
      ) {
        continue;
      }

      finished++;

      settled += await settleMatchPredictions(
        local.id,
        home,
        away
      );
    }
  }

  return {
    checked: pending.length,
    finished,
    settled,
    quotaExceeded,
    planLimited,
    errors,
  };
}

/** Manually record a final score and settle every pending tip on that match. */
export async function setMatchResult(matchId: string, home: number, away: number) {
  const { error } = await supabaseAdmin
    .from("matches")
    .update({ status: "finished", home_score: home, away_score: away })
    .eq("id", matchId);
  if (error) throw new Error(error.message);
  const settled = await settleMatchPredictions(matchId, home, away);
  return { settled };
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
