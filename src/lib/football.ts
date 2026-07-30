import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type Team = Database["public"]["Tables"]["teams"]["Row"];
export type Competition = Database["public"]["Tables"]["competitions"]["Row"];
export type Match = Database["public"]["Tables"]["matches"]["Row"];
export type Prediction = Database["public"]["Tables"]["predictions"]["Row"];

export type MatchWithTeams = Match & {
  home_team: Pick<Team, "id" | "name" | "short_name" | "crest_url"> | null;
  away_team: Pick<Team, "id" | "name" | "short_name" | "crest_url"> | null;
  competitions: Pick<Competition, "id" | "name" | "slug" | "logo_url"> | null;
};

export type PredictionWithMatch = Prediction & {
  matches: MatchWithTeams | null;
};

const MATCH_SELECT =
  "*, home_team:teams!matches_home_team_id_fkey(id,name,short_name,crest_url), away_team:teams!matches_away_team_id_fkey(id,name,short_name,crest_url), competitions(id,name,slug,logo_url)";

const PREDICTION_SELECT = `*, matches(${MATCH_SELECT})`;

export async function fetchTeams() {
  const { data, error } = await supabase.from("teams").select("*").order("name");
  if (error) throw error;
  return data ?? [];
}

export async function fetchCompetitions() {
  const { data, error } = await supabase
    .from("competitions")
    .select("*")
    .order("sort_order")
    .order("name");
  if (error) throw error;
  return data ?? [];
}

export async function fetchMatches(limit = 50) {
  const { data, error } = await supabase
    .from("matches")
    .select(MATCH_SELECT)
    .order("kickoff_at", { ascending: true })
    .limit(limit);
  if (error) throw error;
  return (data ?? []) as unknown as MatchWithTeams[];
}

export async function fetchUpcomingMatches(limit = 10) {
  const { data, error } = await supabase
    .from("matches")
    .select(MATCH_SELECT)
    .gte("kickoff_at", new Date(Date.now() - 3 * 3600_000).toISOString())
    .order("kickoff_at", { ascending: true })
    .limit(limit);
  if (error) throw error;
  return (data ?? []) as unknown as MatchWithTeams[];
}

export async function fetchPredictions(opts: { limit?: number; published?: boolean } = {}) {
  const { limit = 30, published = true } = opts;
  let q = supabase.from("predictions").select(PREDICTION_SELECT);
  if (published) q = q.eq("is_published", true);
  const { data, error } = await q.order("created_at", { ascending: false }).limit(limit);
  if (error) throw error;
  return (data ?? []) as unknown as PredictionWithMatch[];
}

export async function fetchPredictionBySlug(slug: string) {
  const { data, error } = await supabase
    .from("predictions")
    .select(PREDICTION_SELECT)
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  return data as unknown as PredictionWithMatch | null;
}

export async function fetchPredictionStats() {
  const { data, error } = await supabase.from("predictions").select("result").eq("is_published", true);
  if (error) throw error;
  const rows = data ?? [];
  const won = rows.filter((r) => r.result === "won").length;
  const lost = rows.filter((r) => r.result === "lost").length;
  const settled = won + lost;
  return {
    total: rows.length,
    won,
    lost,
    pending: rows.filter((r) => r.result === "pending").length,
    winRate: settled ? Math.round((won / settled) * 100) : 0,
  };
}

export function matchLabel(m: MatchWithTeams | null | undefined) {
  if (!m) return "Match";
  return `${m.home_team?.name ?? "?"} vs ${m.away_team?.name ?? "?"}`;
}
