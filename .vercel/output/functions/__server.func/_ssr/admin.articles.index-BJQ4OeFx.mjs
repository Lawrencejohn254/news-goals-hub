import { t as supabase } from "./client-CZsxps-O.mjs";
import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { r as useQueryClient, t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as formatDate } from "./format-CG3FEzEE.mjs";
import { t as Button } from "./button-BLZ6ednA.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.articles.index-BJQ4OeFx.js
var import_jsx_runtime = require_jsx_runtime();
function ArticlesList() {
	const qc = useQueryClient();
	const q = useQuery({
		queryKey: ["admin", "articles"],
		queryFn: async () => {
			const { data, error } = await supabase.from("articles").select("id,title,slug,status,published_at,updated_at,view_count,is_featured").order("updated_at", { ascending: false });
			if (error) throw error;
			return data ?? [];
		}
	});
	const remove = async (id) => {
		if (!confirm("Delete this article?")) return;
		const { error } = await supabase.from("articles").delete().eq("id", id);
		if (error) toast.error(error.message);
		else {
			toast.success("Deleted");
			qc.invalidateQueries({ queryKey: ["admin", "articles"] });
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-6 flex items-center justify-between",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-serif text-3xl font-black",
			children: "Articles"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/admin/articles/new",
			className: "bg-[var(--brand)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--brand)]/90",
			children: "+ New article"
		})]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "border border-border bg-background",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
			className: "w-full text-sm",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
				className: "border-b border-border bg-muted/50 text-xs uppercase tracking-widest text-muted-foreground",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "p-3 text-left",
						children: "Title"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "p-3 text-left",
						children: "Status"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "p-3 text-left",
						children: "Published"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "p-3 text-left",
						children: "Views"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { className: "p-3" })
				] })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", { children: [
				q.isLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
					colSpan: 5,
					className: "p-6 text-center text-muted-foreground",
					children: "Loading…"
				}) }),
				q.data?.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
					colSpan: 5,
					className: "p-6 text-center text-muted-foreground",
					children: "No articles yet."
				}) }),
				(q.data ?? []).map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "border-b border-border last:border-b-0",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
							className: "p-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/admin/articles/$id",
								params: { id: a.id },
								className: "font-medium hover:text-[var(--brand)]",
								children: a.title
							}), a.is_featured && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "ml-2 rounded bg-[var(--brand)]/10 px-2 py-0.5 text-xs text-[var(--brand)]",
								children: "Featured"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "p-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "rounded px-2 py-0.5 text-xs font-semibold uppercase " + (a.status === "published" ? "bg-green-100 text-green-800" : a.status === "draft" ? "bg-muted text-muted-foreground" : "bg-yellow-100 text-yellow-800"),
								children: a.status
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "p-3 text-muted-foreground",
							children: a.published_at ? formatDate(a.published_at) : "—"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "p-3 text-muted-foreground",
							children: a.view_count ?? 0
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "p-3 text-right",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								size: "sm",
								onClick: () => remove(a.id),
								className: "text-destructive hover:text-destructive",
								children: "Delete"
							})
						})
					]
				}, a.id))
			] })]
		})
	})] });
}
//#endregion
export { ArticlesList as component };
