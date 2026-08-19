import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { I as isRedirect, x as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as getServerFnById, n as createServerFn, t as TSS_SERVER_FUNCTION } from "./server-aObWHJyE.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-BKjjCxiK.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/football-sync.functions-hK7EWEOG.js
var import_react = /* @__PURE__ */ __toESM(require_react());
function useServerFn(serverFn) {
	const router = useRouter();
	return import_react.useCallback(async (...args) => {
		try {
			const res = await serverFn(...args);
			if (isRedirect(res)) throw res;
			return res;
		} catch (err) {
			if (isRedirect(err)) {
				err.options._fromLocation = router.stores.location.get();
				return router.navigate(router.resolveRedirect(err).options);
			}
			throw err;
		}
	}, [router, serverFn]);
}
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var searchLeaguesFn = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => input).handler(createSsrRpc("58beb3aa1029d1cbea2558f09a40cc2f5534e563a28992562bb8365fbb86c39a"));
var trackLeagueFn = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => input).handler(createSsrRpc("c14f41c0675b1e1b96510ffe43f5dd096d906f4286b5a1a3c86af62460fbd09d"));
var setLeagueTrackedFn = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => input).handler(createSsrRpc("bb8da1886b20fa1fa23ced3458440f21a65e13e3258f39d40ae196827cc8f3b3"));
var syncFixturesFn = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => input).handler(createSsrRpc("757588b243131f20b58f28fef7b2cbef0bf2ade367ea4a07661e4977d37472fa"));
var settleResultsFn = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("d4f5899a6d5d91bef2d1011f72a05c70200c725a4a778f375ac52c545b32827c"));
var setMatchResultFn = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => input).handler(createSsrRpc("f5bd06d75bc7fb58bb204399b240d7a0e682961c0d550b5cb50ed08c5385a7d8"));
//#endregion
export { syncFixturesFn as a, settleResultsFn as i, setLeagueTrackedFn as n, trackLeagueFn as o, setMatchResultFn as r, useServerFn as s, searchLeaguesFn as t };
