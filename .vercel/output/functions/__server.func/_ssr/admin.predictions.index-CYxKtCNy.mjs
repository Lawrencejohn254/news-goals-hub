import { t as supabase } from "./client-CZsxps-O.mjs";
import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { r as useQueryClient, t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { s as fetchPredictions } from "./football-DKHVh4O4.mjs";
import { t as Button } from "./button-BLZ6ednA.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.predictions.index-CYxKtCNy.js
var import_jsx_runtime = require_jsx_runtime();
function PredictionsAdmin() {
	const qc = useQueryClient();
	const q = useQuery({
		queryKey: ["admin", "predictions"],
		queryFn: () => fetchPredictions({
			published: false,
			limit: 200
		})
	});
	const setResult = async (id, result) => {
		const { error } = await supabase.from("predictions").update({ result }).eq("id", id);
		if (error) return toast.error(error.message);
		toast.success("Result updated");
		qc.invalidateQueries({ queryKey: ["admin", "predictions"] });
	};
	const remove = async (id) => {
		if (!confirm("Delete this prediction?")) return;
		const { error } = await supabase.from("predictions").delete().eq("id", id);
		if (error) return toast.error(error.message);
		toast.success("Deleted");
		qc.invalidateQueries({ queryKey: ["admin", "predictions"] });
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-6 flex items-center justify-between",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-serif text-3xl font-black",
			children: "Predictions"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/admin/predictions/board",
				className: "border border-border px-4 py-2 text-sm font-semibold hover:bg-muted",
				children: "Fixture board"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/admin/predictions/new",
				className: "bg-[var(--brand)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--brand)]/90",
				children: "+ New prediction"
			})]
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
						children: "Tip"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "p-3 text-left",
						children: "State"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "p-3 text-left",
						children: "Result"
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
					children: "No predictions yet."
				}) }),
				(q.data ?? []).map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "border-b border-border last:border-b-0",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
							className: "p-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/admin/predictions/$id",
								params: { id: p.id },
								className: "font-medium hover:text-[var(--brand)]",
								children: p.title
							}), p.is_featured && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "ml-2 rounded bg-[var(--brand)]/10 px-2 py-0.5 text-xs text-[var(--brand)]",
								children: "Featured"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "p-3 text-muted-foreground",
							children: p.tip
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "p-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs font-semibold uppercase",
								children: p.is_published ? "Published" : "Draft"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "p-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								value: p.result,
								onChange: (e) => setResult(p.id, e.target.value),
								className: "border border-input bg-background px-2 py-1 text-xs",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "pending",
										children: "pending"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "won",
										children: "won"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "lost",
										children: "lost"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "void",
										children: "void"
									})
								]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "p-3 text-right",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								size: "sm",
								onClick: () => remove(p.id),
								className: "text-destructive hover:text-destructive",
								children: "Delete"
							})
						})
					]
				}, p.id))
			] })]
		})
	})] });
}
//#endregion
export { PredictionsAdmin as component };
