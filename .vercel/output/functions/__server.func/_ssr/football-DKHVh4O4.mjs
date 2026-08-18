import { t as supabase } from "./client-CZsxps-O.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/football-DKHVh4O4.js
var MATCH_SELECT = "*, home_team:teams!matches_home_team_id_fkey(id,name,short_name,slug,crest_url), away_team:teams!matches_away_team_id_fkey(id,name,short_name,slug,crest_url), competitions(id,name,slug,logo_url)";
var PREDICTION_SELECT = `*, matches(${MATCH_SELECT})`;
async function fetchTeams() {
	const { data, error } = await supabase.from("teams").select("*").order("name");
	if (error) throw error;
	return data ?? [];
}
async function fetchCompetitions() {
	const { data, error } = await supabase.from("competitions").select("*").order("sort_order").order("name");
	if (error) throw error;
	return data ?? [];
}
async function fetchMatches(limit = 50) {
	const { data, error } = await supabase.from("matches").select(MATCH_SELECT).order("kickoff_at", { ascending: true }).limit(limit);
	if (error) throw error;
	return data ?? [];
}
async function fetchMatchesBetween(fromISO, toISO) {
	const { data, error } = await supabase.from("matches").select(MATCH_SELECT).gte("kickoff_at", fromISO).lte("kickoff_at", toISO).order("kickoff_at", { ascending: true });
	if (error) throw error;
	return data ?? [];
}
async function fetchPredictionsForMatches(matchIds) {
	if (!matchIds.length) return [];
	const { data, error } = await supabase.from("predictions").select("*").in("match_id", matchIds);
	if (error) throw error;
	return data ?? [];
}
async function fetchPredictions(opts = {}) {
	const { limit = 30, published = true } = opts;
	let q = supabase.from("predictions").select(PREDICTION_SELECT);
	if (published) q = q.eq("is_published", true);
	const { data, error } = await q.order("created_at", { ascending: false }).limit(limit);
	if (error) throw error;
	return data ?? [];
}
async function fetchPredictionBySlug(slug) {
	const { data, error } = await supabase.from("predictions").select(PREDICTION_SELECT).eq("slug", slug).maybeSingle();
	if (error) throw error;
	return data;
}
async function fetchPredictionStats() {
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
		winRate: settled ? Math.round(won / settled * 100) : 0
	};
}
function matchLabel(m) {
	if (!m) return "Match";
	return `${m.home_team?.name ?? "?"} vs ${m.away_team?.name ?? "?"}`;
}
async function fetchTeamBySlug(slug) {
	const { data, error } = await supabase.from("teams").select("*").eq("slug", slug).maybeSingle();
	if (error) throw error;
	return data;
}
async function fetchTeamMatches(teamId, limit = 40) {
	const { data, error } = await supabase.from("matches").select(MATCH_SELECT).or(`home_team_id.eq.${teamId},away_team_id.eq.${teamId}`).order("kickoff_at", { ascending: false }).limit(limit);
	if (error) throw error;
	return data ?? [];
}
/** Derive stats for a team from its finished fixtures (most recent first). */
function computeTeamStats(teamId, matches) {
	const played = matches.filter((m) => m.status === "finished" && m.home_score != null && m.away_score != null);
	let won = 0, drawn = 0, lost = 0, goalsFor = 0, goalsAgainst = 0, cleanSheets = 0, btts = 0, over25 = 0;
	const form = [];
	for (const m of played) {
		const isHome = m.home_team_id === teamId;
		const gf = isHome ? m.home_score : m.away_score;
		const ga = isHome ? m.away_score : m.home_score;
		goalsFor += gf;
		goalsAgainst += ga;
		if (ga === 0) cleanSheets++;
		if (gf > 0 && ga > 0) btts++;
		if (gf + ga > 2.5) over25++;
		if (gf > ga) {
			won++;
			form.push("W");
		} else if (gf === ga) {
			drawn++;
			form.push("D");
		} else {
			lost++;
			form.push("L");
		}
	}
	const n = played.length;
	const pct = (v) => n ? Math.round(v / n * 100) : 0;
	return {
		played: n,
		won,
		drawn,
		lost,
		goalsFor,
		goalsAgainst,
		cleanSheets,
		bttsPct: pct(btts),
		over25Pct: pct(over25),
		form: form.slice(0, 5).reverse().join(""),
		winPct: pct(won),
		avgScored: n ? Math.round(goalsFor / n * 10) / 10 : 0,
		avgConceded: n ? Math.round(goalsAgainst / n * 10) / 10 : 0
	};
}
//#endregion
export { fetchPredictionBySlug as a, fetchPredictionsForMatches as c, fetchTeams as d, matchLabel as f, fetchMatchesBetween as i, fetchTeamBySlug as l, fetchCompetitions as n, fetchPredictionStats as o, fetchMatches as r, fetchPredictions as s, computeTeamStats as t, fetchTeamMatches as u };
