import { t as supabase } from "./client-CZsxps-O.mjs";
import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { A as Eye, c as Tag, p as Newspaper } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.index-CPQHuyKo.js
var import_jsx_runtime = require_jsx_runtime();
function Dashboard() {
	const stats = useQuery({
		queryKey: ["admin", "stats"],
		queryFn: async () => {
			const [articles, categories, comments, views] = await Promise.all([
				supabase.from("articles").select("id,status,view_count"),
				supabase.from("categories").select("id"),
				supabase.from("comments").select("id"),
				supabase.from("articles").select("view_count")
			]);
			const published = (articles.data ?? []).filter((a) => a.status === "published").length;
			const drafts = (articles.data ?? []).filter((a) => a.status === "draft").length;
			const totalViews = (views.data ?? []).reduce((s, r) => s + (r.view_count ?? 0), 0);
			return {
				articles: articles.data?.length ?? 0,
				published,
				drafts,
				categories: categories.data?.length ?? 0,
				comments: comments.data?.length ?? 0,
				totalViews
			};
		}
	});
	const recent = useQuery({
		queryKey: ["admin", "recent-articles"],
		queryFn: async () => {
			const { data } = await supabase.from("articles").select("id,title,status,updated_at").order("updated_at", { ascending: false }).limit(6);
			return data ?? [];
		}
	});
	const s = stats.data;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-6 flex items-center justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-serif text-3xl font-black",
				children: "Dashboard"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Newsroom overview"
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/admin/articles/new",
				className: "bg-[var(--brand)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--brand)]/90",
				children: "+ New article"
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-4 md:grid-cols-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Newspaper, { size: 20 }),
					label: "Published",
					value: s?.published ?? 0
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Newspaper, { size: 20 }),
					label: "Drafts",
					value: s?.drafts ?? 0
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, { size: 20 }),
					label: "Categories",
					value: s?.categories ?? 0
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { size: 20 }),
					label: "Total views",
					value: s?.totalViews ?? 0
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-8",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mb-3 font-serif text-xl font-bold",
				children: "Recently edited"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "border border-border bg-background",
				children: [(recent.data ?? []).length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "p-6 text-sm text-muted-foreground",
					children: "No articles yet."
				}), (recent.data ?? []).map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/admin/articles/$id",
					params: { id: a.id },
					className: "flex items-center justify-between border-b border-border p-4 last:border-b-0 hover:bg-muted",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-medium",
						children: a.title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs uppercase tracking-widest text-muted-foreground",
						children: a.status
					})]
				}, a.id))]
			})]
		})
	] });
}
function StatCard({ icon, label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "border border-border bg-background p-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-2 text-muted-foreground",
			children: [icon, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-xs font-semibold uppercase tracking-widest",
				children: label
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-2 font-serif text-3xl font-black",
			children: value.toLocaleString()
		})]
	});
}
//#endregion
export { Dashboard as component };
