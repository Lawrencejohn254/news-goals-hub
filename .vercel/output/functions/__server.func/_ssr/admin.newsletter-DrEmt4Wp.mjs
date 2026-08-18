import { t as supabase } from "./client-CZsxps-O.mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { r as useQueryClient, t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as formatDate } from "./format-CG3FEzEE.mjs";
import { t as Button } from "./button-BLZ6ednA.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.newsletter-DrEmt4Wp.js
var import_jsx_runtime = require_jsx_runtime();
function NewsletterAdmin() {
	const qc = useQueryClient();
	const q = useQuery({
		queryKey: ["admin", "subscribers"],
		queryFn: async () => {
			const { data, error } = await supabase.from("newsletter_subscribers").select("*").order("created_at", { ascending: false }).limit(500);
			if (error) throw error;
			return data ?? [];
		}
	});
	const refresh = () => qc.invalidateQueries({ queryKey: ["admin", "subscribers"] });
	const setStatus = async (id, status) => {
		const { error } = await supabase.from("newsletter_subscribers").update({ status }).eq("id", id);
		if (error) return toast.error(error.message);
		refresh();
	};
	const remove = async (id) => {
		if (!confirm("Remove this subscriber?")) return;
		const { error } = await supabase.from("newsletter_subscribers").delete().eq("id", id);
		if (error) return toast.error(error.message);
		toast.success("Removed");
		refresh();
	};
	const exportCsv = () => {
		const csv = ["email,status,source,created_at", ...(q.data ?? []).map((r) => `${r.email},${r.status},${r.source ?? ""},${r.created_at}`)].join("\n");
		const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
		const a = document.createElement("a");
		a.href = url;
		a.download = "subscribers.csv";
		a.click();
		URL.revokeObjectURL(url);
	};
	const active = (q.data ?? []).filter((s) => s.status === "subscribed").length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-6 flex items-center justify-between",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-serif text-3xl font-black",
			children: "Newsletter"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "text-sm text-muted-foreground",
			children: [
				active,
				" active of ",
				q.data?.length ?? 0,
				" subscribers"
			]
		})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			variant: "outline",
			onClick: exportCsv,
			children: "Export CSV"
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
						children: "Email"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "p-3 text-left",
						children: "Status"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "p-3 text-left",
						children: "Source"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "p-3 text-left",
						children: "Joined"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { className: "p-3" })
				] })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", { children: [q.data?.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
				colSpan: 5,
				className: "p-6 text-center text-muted-foreground",
				children: "No subscribers yet."
			}) }), (q.data ?? []).map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
				className: "border-b border-border last:border-b-0",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "p-3 font-medium",
						children: s.email
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "p-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							value: s.status,
							onChange: (e) => setStatus(s.id, e.target.value),
							className: "border border-input bg-background px-2 py-1 text-xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "subscribed",
									children: "subscribed"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "unsubscribed",
									children: "unsubscribed"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "bounced",
									children: "bounced"
								})
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "p-3 text-muted-foreground",
						children: s.source ?? "—"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "p-3 text-muted-foreground",
						children: formatDate(s.created_at)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "p-3 text-right",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							size: "sm",
							className: "text-destructive hover:text-destructive",
							onClick: () => remove(s.id),
							children: "Remove"
						})
					})
				]
			}, s.id))] })]
		})
	})] });
}
//#endregion
export { NewsletterAdmin as component };
