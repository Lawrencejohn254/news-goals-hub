import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { r as useQueryClient, t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as Input, r as Label } from "./router-C9TCD_gT.mjs";
import { n as fetchCompetitions } from "./football-DKHVh4O4.mjs";
import { t as Button } from "./button-BLZ6ednA.mjs";
import { a as syncFixturesFn, i as settleResultsFn, n as setLeagueTrackedFn, o as trackLeagueFn, s as useServerFn, t as searchLeaguesFn } from "./football-sync.functions-hK7EWEOG.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.leagues-DoOikndV.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function LeaguesAdmin() {
	const qc = useQueryClient();
	const [query, setQuery] = (0, import_react.useState)("");
	const [country, setCountry] = (0, import_react.useState)("");
	const [results, setResults] = (0, import_react.useState)([]);
	const [busy, setBusy] = (0, import_react.useState)(null);
	const search = useServerFn(searchLeaguesFn);
	const track = useServerFn(trackLeagueFn);
	const setTracked = useServerFn(setLeagueTrackedFn);
	const sync = useServerFn(syncFixturesFn);
	const settle = useServerFn(settleResultsFn);
	const comps = useQuery({
		queryKey: ["competitions"],
		queryFn: fetchCompetitions
	});
	const run = async (key, fn) => {
		setBusy(key);
		try {
			return await fn();
		} catch (e) {
			toast.error(e?.message ?? "Something went wrong");
		} finally {
			setBusy(null);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-6 flex flex-wrap items-center justify-between gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-serif text-3xl font-black",
				children: "Leagues & fixture sync"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					disabled: busy !== null,
					onClick: () => run("sync", async () => {
						const r = await sync({ data: { days: 10 } });
						if (r.quotaExceeded) toast.warning(`Daily football data quota reached — saved ${r.created} new and ${r.updated} existing fixtures before stopping.`);
						else if (r.planLimited) toast.success(`Synced ${r.created} new and ${r.updated} existing fixtures (your API plan only covers the next few days).`);
						else toast.success(`Synced ${r.created} new and ${r.updated} existing fixtures`);
						qc.invalidateQueries({ queryKey: ["admin", "matches"] });
					}),
					children: busy === "sync" ? "Syncing…" : "Sync fixtures"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					className: "bg-[var(--brand)] text-white hover:bg-[var(--brand)]/90",
					disabled: busy !== null,
					onClick: () => run("settle", async () => {
						const r = await settle({});
						if (r.quotaExceeded) toast.warning(`Daily football data quota reached — ${r.finished} matches finished, ${r.settled} tips settled before stopping.`);
						else if (r.checked === 0) toast.info("No played fixtures are waiting for a result right now.");
						else if (r.finished === 0 && r.errors?.length) toast.error(`Results provider unavailable: ${r.errors[0]}`, { duration: 8e3 });
						else if (r.finished === 0) toast.info(`Checked ${r.checked} fixtures — the provider has no final scores for them yet. You can enter scores manually in Football data.`);
						else toast.success(`${r.finished} matches finished, ${r.settled} tips settled`);
						qc.invalidateQueries({ queryKey: ["admin", "matches"] });
						qc.invalidateQueries({ queryKey: ["admin", "predictions"] });
					}),
					children: busy === "settle" ? "Checking…" : "Update results & settle tips"
				})]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-8 border border-border bg-background p-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mb-4 font-serif text-xl font-bold",
					children: "Find a league"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-4 md:grid-cols-[1fr_1fr_auto] md:items-end",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "lq",
							children: "League name"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "lq",
							value: query,
							onChange: (e) => setQuery(e.target.value),
							placeholder: "Premier League"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "lc",
							children: "Country (optional)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "lc",
							value: country,
							onChange: (e) => setCountry(e.target.value),
							placeholder: "Kenya"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							disabled: busy !== null,
							onClick: () => run("search", async () => {
								const r = await search({ data: {
									query,
									country
								} });
								setResults(r);
								if (!r.length) toast.info("No leagues matched");
							}),
							children: busy === "search" ? "Searching…" : "Search"
						})
					]
				}),
				results.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-6 divide-y divide-border border border-border",
					children: results.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-center gap-3 p-3",
						children: [
							l.logo_url && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: l.logo_url,
								alt: "",
								className: "h-6 w-6 object-contain"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-semibold",
									children: l.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-muted-foreground",
									children: [
										l.country ?? "International",
										" · season ",
										l.season ?? "—"
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "outline",
								disabled: busy !== null,
								onClick: () => run(`t${l.external_id}`, async () => {
									await track({ data: l });
									toast.success(`${l.name} is now tracked`);
									qc.invalidateQueries({ queryKey: ["competitions"] });
								}),
								children: "Track"
							})
						]
					}, l.external_id))
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "border border-border bg-background",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "border-b border-border p-4 font-serif text-xl font-bold",
				children: "Your competitions"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "divide-y divide-border",
				children: (comps.data ?? []).map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex items-center gap-3 p-3",
					children: [
						c.logo_url && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: c.logo_url,
							alt: "",
							className: "h-6 w-6 object-contain"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-semibold",
								children: c.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-muted-foreground",
								children: [
									c.country ?? "—",
									" · season ",
									c.season ?? "—",
									" ·",
									" ",
									c.external_id ? "auto-synced" : "manual"
								]
							})]
						}),
						c.external_id && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: c.is_tracked ? "outline" : "default",
							disabled: busy !== null,
							onClick: () => run(`u${c.id}`, async () => {
								await setTracked({ data: {
									competitionId: c.id,
									tracked: !c.is_tracked
								} });
								toast.success(c.is_tracked ? "Stopped tracking" : "Tracking");
								qc.invalidateQueries({ queryKey: ["competitions"] });
							}),
							children: c.is_tracked ? "Tracked" : "Track"
						})
					]
				}, c.id))
			})]
		})
	] });
}
//#endregion
export { LeaguesAdmin as component };
