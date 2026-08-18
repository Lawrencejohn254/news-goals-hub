import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-CZsxps-O.mjs";
import { n as attachAuthors } from "./site-D9u_L-Ue.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { r as useQueryClient, t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as formatDate } from "./format-CG3FEzEE.mjs";
import { t as Button } from "./button-BLZ6ednA.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.comments-BTePy-dH.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CommentsAdmin() {
	const qc = useQueryClient();
	const [filter, setFilter] = (0, import_react.useState)("pending");
	const q = useQuery({
		queryKey: [
			"admin",
			"comments",
			filter
		],
		queryFn: async () => {
			let query = supabase.from("comments").select("*").order("created_at", { ascending: false }).limit(200);
			if (filter === "pending") query = query.eq("is_approved", false);
			if (filter === "approved") query = query.eq("is_approved", true);
			const { data, error } = await query;
			if (error) throw error;
			const withAuthors = await attachAuthors(data ?? []);
			const ids = [...new Set((data ?? []).map((c) => c.article_id))];
			const { data: arts } = ids.length ? await supabase.from("articles").select("id,title,slug").in("id", ids) : { data: [] };
			const map = new Map((arts ?? []).map((a) => [a.id, a]));
			return withAuthors.map((c) => ({
				...c,
				article: map.get(c.article_id)
			}));
		}
	});
	const refresh = () => qc.invalidateQueries({ queryKey: ["admin", "comments"] });
	const approve = async (id, value) => {
		const { error } = await supabase.from("comments").update({ is_approved: value }).eq("id", id);
		if (error) return toast.error(error.message);
		toast.success(value ? "Approved" : "Unapproved");
		refresh();
	};
	const remove = async (id) => {
		if (!confirm("Delete this comment?")) return;
		const { error } = await supabase.from("comments").delete().eq("id", id);
		if (error) return toast.error(error.message);
		toast.success("Deleted");
		refresh();
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-6 flex items-center justify-between",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-serif text-3xl font-black",
			children: "Comments"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex gap-1 border border-border bg-background p-1 text-sm",
			children: [
				"pending",
				"approved",
				"all"
			].map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: () => setFilter(f),
				className: "px-3 py-1 capitalize " + (filter === f ? "bg-[var(--ink)] text-white" : "hover:bg-muted"),
				children: f
			}, f))
		})]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "border border-border bg-background",
		children: [
			q.isLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "p-6 text-muted-foreground",
				children: "Loading…"
			}),
			q.data?.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "p-6 text-center text-muted-foreground",
				children: "Nothing here."
			}),
			(q.data ?? []).map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "border-b border-border p-4 last:border-b-0",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-2 text-xs text-muted-foreground",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-semibold text-foreground",
								children: c.author_name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "·" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatDate(c.created_at) }),
							c.article && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "·" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "truncate",
								children: [
									"on “",
									c.article.title,
									"”"
								]
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "ml-auto rounded px-2 py-0.5 text-xs font-semibold uppercase " + (c.is_approved ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"),
								children: c.is_approved ? "approved" : "pending"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 whitespace-pre-wrap text-sm",
						children: c.content
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "outline",
							onClick: () => approve(c.id, !c.is_approved),
							children: c.is_approved ? "Unapprove" : "Approve"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "ghost",
							className: "text-destructive hover:text-destructive",
							onClick: () => remove(c.id),
							children: "Delete"
						})]
					})
				]
			}, c.id))
		]
	})] });
}
//#endregion
export { CommentsAdmin as component };
