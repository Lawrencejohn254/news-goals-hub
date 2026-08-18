import { n as createServerFn, t as TSS_SERVER_FUNCTION } from "./server-aObWHJyE.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-BKjjCxiK.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/football-sync.functions-CoUqn6kO.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
async function assertStaff(context) {
	const { data, error } = await context.supabase.rpc("is_staff", { _user_id: context.userId });
	if (error) throw new Error(error.message);
	if (!data) throw new Error("Forbidden");
}
var searchLeaguesFn_createServerFn_handler = createServerRpc({
	id: "58beb3aa1029d1cbea2558f09a40cc2f5534e563a28992562bb8365fbb86c39a",
	name: "searchLeaguesFn",
	filename: "src/lib/football-sync.functions.ts"
}, (opts) => searchLeaguesFn.__executeServer(opts));
var searchLeaguesFn = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => input).handler(searchLeaguesFn_createServerFn_handler, async ({ data, context }) => {
	await assertStaff(context);
	const { searchLeagues } = await import("./football-sync.server-CgSCTqRZ.mjs");
	return await searchLeagues(data.query ?? "", data.country);
});
var trackLeagueFn_createServerFn_handler = createServerRpc({
	id: "c14f41c0675b1e1b96510ffe43f5dd096d906f4286b5a1a3c86af62460fbd09d",
	name: "trackLeagueFn",
	filename: "src/lib/football-sync.functions.ts"
}, (opts) => trackLeagueFn.__executeServer(opts));
var trackLeagueFn = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => input).handler(trackLeagueFn_createServerFn_handler, async ({ data, context }) => {
	await assertStaff(context);
	const { trackLeague } = await import("./football-sync.server-CgSCTqRZ.mjs");
	return { id: await trackLeague(data) };
});
var setLeagueTrackedFn_createServerFn_handler = createServerRpc({
	id: "bb8da1886b20fa1fa23ced3458440f21a65e13e3258f39d40ae196827cc8f3b3",
	name: "setLeagueTrackedFn",
	filename: "src/lib/football-sync.functions.ts"
}, (opts) => setLeagueTrackedFn.__executeServer(opts));
var setLeagueTrackedFn = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => input).handler(setLeagueTrackedFn_createServerFn_handler, async ({ data, context }) => {
	await assertStaff(context);
	const { setLeagueTracked } = await import("./football-sync.server-CgSCTqRZ.mjs");
	await setLeagueTracked(data.competitionId, data.tracked);
	return { ok: true };
});
var syncFixturesFn_createServerFn_handler = createServerRpc({
	id: "757588b243131f20b58f28fef7b2cbef0bf2ade367ea4a07661e4977d37472fa",
	name: "syncFixturesFn",
	filename: "src/lib/football-sync.functions.ts"
}, (opts) => syncFixturesFn.__executeServer(opts));
var syncFixturesFn = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => input).handler(syncFixturesFn_createServerFn_handler, async ({ data, context }) => {
	await assertStaff(context);
	const { syncFixtures } = await import("./football-sync.server-CgSCTqRZ.mjs");
	return await syncFixtures(data.days ?? 10);
});
var settleResultsFn_createServerFn_handler = createServerRpc({
	id: "d4f5899a6d5d91bef2d1011f72a05c70200c725a4a778f375ac52c545b32827c",
	name: "settleResultsFn",
	filename: "src/lib/football-sync.functions.ts"
}, (opts) => settleResultsFn.__executeServer(opts));
var settleResultsFn = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(settleResultsFn_createServerFn_handler, async ({ context }) => {
	await assertStaff(context);
	const { settleResults } = await import("./football-sync.server-CgSCTqRZ.mjs");
	return await settleResults();
});
var setMatchResultFn_createServerFn_handler = createServerRpc({
	id: "f5bd06d75bc7fb58bb204399b240d7a0e682961c0d550b5cb50ed08c5385a7d8",
	name: "setMatchResultFn",
	filename: "src/lib/football-sync.functions.ts"
}, (opts) => setMatchResultFn.__executeServer(opts));
var setMatchResultFn = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => input).handler(setMatchResultFn_createServerFn_handler, async ({ data, context }) => {
	await assertStaff(context);
	const { setMatchResult } = await import("./football-sync.server-CgSCTqRZ.mjs");
	return await setMatchResult(data.matchId, data.home, data.away);
});
//#endregion
export { searchLeaguesFn_createServerFn_handler, setLeagueTrackedFn_createServerFn_handler, setMatchResultFn_createServerFn_handler, settleResultsFn_createServerFn_handler, syncFixturesFn_createServerFn_handler, trackLeagueFn_createServerFn_handler };
