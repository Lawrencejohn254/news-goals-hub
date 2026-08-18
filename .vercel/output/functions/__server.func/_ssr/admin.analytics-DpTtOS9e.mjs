import { t as supabase } from "./client-CZsxps-O.mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { t as formatDate } from "./format-CG3FEzEE.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.analytics-DpTtOS9e.js
var import_jsx_runtime = require_jsx_runtime();
function AnalyticsAdmin() {
	const q = useQuery({
		queryKey: ["admin", "analytics"],
		queryFn: async () => {
			const since = (/* @__PURE__ */ new Date(Date.now() - 2592e6)).toISOString();
			const { data: views, error } = await supabase.from("page_views").select("path,referrer,created_at").gte("created_at", since).order("created_at", { ascending: false }).limit(5e3);
			if (error) throw error;
			const rows = views ?? [];
			const byDay = /* @__PURE__ */ new Map();
			const byPath = /* @__PURE__ */ new Map();
			const byReferrer = /* @__PURE__ */ new Map();
			for (const v of rows) {
				const day = v.created_at.slice(0, 10);
				byDay.set(day, (byDay.get(day) ?? 0) + 1);
				byPath.set(v.path, (byPath.get(v.path) ?? 0) + 1);
				let ref = "direct";
				if (v.referrer) try {
					ref = new URL(v.referrer).hostname;
				} catch {
					ref = v.referrer.slice(0, 40);
				}
				byReferrer.set(ref, (byReferrer.get(ref) ?? 0) + 1);
			}
			const days = [];
			for (let i = 29; i >= 0; i--) {
				const day = (/* @__PURE__ */ new Date(Date.now() - i * 864e5)).toISOString().slice(0, 10);
				days.push({
					day,
					count: byDay.get(day) ?? 0
				});
			}
			const top = (m) => [...m.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10);
			const last7 = days.slice(-7).reduce((s, d) => s + d.count, 0);
			const prev7 = days.slice(-14, -7).reduce((s, d) => s + d.count, 0);
			const { data: articles } = await supabase.from("articles").select("title,slug,view_count,published_at").eq("status", "published").order("view_count", { ascending: false }).limit(10);
			return {
				total: rows.length,
				last7,
				prev7,
				days,
				topPaths: top(byPath),
				topReferrers: top(byReferrer),
				topArticles: articles ?? []
			};
		}
	});
	const d = q.data;
	const max = Math.max(1, ...(d?.days ?? []).map((x) => x.count));
	const delta = d && d.prev7 ? Math.round((d.last7 - d.prev7) / d.prev7 * 100) : null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "mb-6 font-serif text-3xl font-black",
			children: "Analytics"
		}),
		q.isLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-muted-foreground",
			children: "Loading…"
		}),
		d && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 md:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Views (30 days)",
						value: d.total
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Views (last 7 days)",
						value: d.last7
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "vs previous 7 days",
						value: delta === null ? 0 : delta,
						suffix: delta === null ? "" : "%"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 border border-border bg-background p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mb-4 font-serif text-lg font-bold",
						children: "Daily views"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex h-40 items-end gap-1",
						children: d.days.map((x) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							title: `${x.day}: ${x.count}`,
							style: { height: `${x.count / max * 100}%` },
							className: "flex-1 bg-[var(--brand)]/80 hover:bg-[var(--brand)]"
						}, x.day))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-2 flex justify-between text-xs text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatDate(d.days[0]?.day) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatDate(d.days[d.days.length - 1]?.day) })]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 grid gap-6 md:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListCard, {
					title: "Top pages",
					rows: d.topPaths
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListCard, {
					title: "Top referrers",
					rows: d.topReferrers
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 border border-border bg-background",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "border-b border-border p-4 font-serif text-lg font-bold",
						children: "Most-read articles"
					}),
					d.topArticles.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "p-4 text-sm text-muted-foreground",
						children: "No published articles yet."
					}),
					d.topArticles.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between border-b border-border p-3 text-sm last:border-b-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "truncate",
							children: a.title
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-muted-foreground",
							children: a.view_count ?? 0
						})]
					}, a.slug))
				]
			})
		] })
	] });
}
function Stat({ label, value, suffix = "" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "border border-border bg-background p-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs font-semibold uppercase tracking-widest text-muted-foreground",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "mt-2 font-serif text-3xl font-black",
			children: [value.toLocaleString(), suffix]
		})]
	});
}
function ListCard({ title, rows }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "border border-border bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "border-b border-border p-4 font-serif text-lg font-bold",
				children: title
			}),
			rows.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "p-4 text-sm text-muted-foreground",
				children: "No data yet."
			}),
			rows.map(([k, v]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between border-b border-border p-3 text-sm last:border-b-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "truncate",
					children: k
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-muted-foreground",
					children: v
				})]
			}, k))
		]
	});
}
//#endregion
export { AnalyticsAdmin as component };
