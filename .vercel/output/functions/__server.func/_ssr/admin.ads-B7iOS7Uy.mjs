import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-CZsxps-O.mjs";
import { t as AD_PLACEMENTS } from "./site-D9u_L-Ue.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { r as useQueryClient, t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as Input, r as Label } from "./router-C9TCD_gT.mjs";
import { t as Button } from "./button-BLZ6ednA.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.ads-B7iOS7Uy.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var emptyAd = {
	name: "",
	placement: AD_PLACEMENTS[0],
	image_url: "",
	target_url: "",
	html_code: "",
	starts_at: "",
	ends_at: ""
};
function AdsAdmin() {
	const qc = useQueryClient();
	const [form, setForm] = (0, import_react.useState)(emptyAd);
	const set = (patch) => setForm((f) => ({
		...f,
		...patch
	}));
	const q = useQuery({
		queryKey: ["admin", "ads"],
		queryFn: async () => {
			const { data, error } = await supabase.from("ads").select("*").order("created_at", { ascending: false });
			if (error) throw error;
			return data ?? [];
		}
	});
	const refresh = () => qc.invalidateQueries({ queryKey: ["admin", "ads"] });
	const create = async () => {
		if (!form.name.trim()) return toast.error("Give the ad a name");
		const { error } = await supabase.from("ads").insert({
			name: form.name.trim(),
			placement: form.placement,
			image_url: form.image_url.trim() || null,
			target_url: form.target_url.trim() || null,
			html_code: form.html_code.trim() || null,
			starts_at: form.starts_at ? new Date(form.starts_at).toISOString() : null,
			ends_at: form.ends_at ? new Date(form.ends_at).toISOString() : null
		});
		if (error) return toast.error(error.message);
		toast.success("Ad created");
		setForm(emptyAd);
		refresh();
	};
	const toggle = async (ad) => {
		const { error } = await supabase.from("ads").update({ is_active: !ad.is_active }).eq("id", ad.id);
		if (error) return toast.error(error.message);
		refresh();
	};
	const remove = async (id) => {
		if (!confirm("Delete this ad?")) return;
		const { error } = await supabase.from("ads").delete().eq("id", id);
		if (error) return toast.error(error.message);
		toast.success("Deleted");
		refresh();
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "mb-6 font-serif text-3xl font-black",
			children: "Ads"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-8 grid gap-3 border border-border bg-background p-4 md:grid-cols-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Name" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: form.name,
					onChange: (e) => set({ name: e.target.value })
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Placement" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
					value: form.placement,
					onChange: (e) => set({ placement: e.target.value }),
					className: "h-10 w-full border border-input bg-background px-3 text-sm",
					children: AD_PLACEMENTS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: p,
						children: p
					}, p))
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Image URL" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: form.image_url,
					onChange: (e) => set({ image_url: e.target.value })
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Target URL" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: form.target_url,
					onChange: (e) => set({ target_url: e.target.value })
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Starts at" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					type: "datetime-local",
					value: form.starts_at,
					onChange: (e) => set({ starts_at: e.target.value })
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Ends at" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					type: "datetime-local",
					value: form.ends_at,
					onChange: (e) => set({ ends_at: e.target.value })
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "md:col-span-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Or custom HTML" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						value: form.html_code,
						onChange: (e) => set({ html_code: e.target.value }),
						rows: 3,
						className: "w-full border border-input bg-background p-2 font-mono text-xs"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: create,
					className: "bg-[var(--brand)] text-white hover:bg-[var(--brand)]/90",
					children: "Create ad"
				}) })
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "border border-border bg-background",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
					className: "border-b border-border bg-muted/50 text-xs uppercase tracking-widest text-muted-foreground",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "p-3 text-left",
							children: "Name"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "p-3 text-left",
							children: "Placement"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "p-3 text-left",
							children: "Impressions"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "p-3 text-left",
							children: "Clicks"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "p-3 text-left",
							children: "CTR"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { className: "p-3" })
					] })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", { children: [q.data?.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
					colSpan: 6,
					className: "p-6 text-center text-muted-foreground",
					children: "No ads yet."
				}) }), (q.data ?? []).map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "border-b border-border last:border-b-0",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
							className: "p-3 font-medium",
							children: [a.name, !a.is_active && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "ml-2 rounded bg-muted px-2 py-0.5 text-xs",
								children: "paused"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "p-3 text-muted-foreground",
							children: a.placement
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "p-3",
							children: a.impressions
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "p-3",
							children: a.clicks
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "p-3 text-muted-foreground",
							children: a.impressions ? `${(a.clicks / a.impressions * 100).toFixed(1)}%` : "—"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
							className: "p-3 text-right",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								size: "sm",
								onClick: () => toggle(a),
								children: a.is_active ? "Pause" : "Activate"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								size: "sm",
								className: "text-destructive hover:text-destructive",
								onClick: () => remove(a.id),
								children: "Delete"
							})]
						})
					]
				}, a.id))] })]
			})
		})
	] });
}
//#endregion
export { AdsAdmin as component };
