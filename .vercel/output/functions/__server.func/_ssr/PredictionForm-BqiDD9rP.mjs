import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-CZsxps-O.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { i as slugify } from "./format-CG3FEzEE.mjs";
import { h as Textarea, i as RichTextEditor, n as Input, r as Label } from "./router-C9TCD_gT.mjs";
import { f as matchLabel, r as fetchMatches } from "./football-DKHVh4O4.mjs";
import { t as Switch } from "./switch-Cn1w-cIH.mjs";
import { t as TIP_OPTIONS } from "./tips-CHUwHK4U.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/PredictionForm-BqiDD9rP.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var emptyDraft = {
	match_id: "",
	title: "",
	slug: "",
	tip: "",
	confidence: 3,
	odds: "",
	predicted_home_score: "",
	predicted_away_score: "",
	analysis: "",
	home_form: "",
	away_form: "",
	head_to_head: "",
	key_stats: "",
	is_published: false,
	is_featured: false,
	seo_title: "",
	seo_description: ""
};
function toRow(d) {
	return {
		match_id: d.match_id,
		title: d.title.trim(),
		slug: d.slug.trim() || slugify(d.title),
		tip: d.tip.trim(),
		confidence: Math.min(5, Math.max(1, Number(d.confidence) || 3)),
		odds: d.odds ? Number(d.odds) : null,
		predicted_home_score: d.predicted_home_score === "" ? null : Number(d.predicted_home_score),
		predicted_away_score: d.predicted_away_score === "" ? null : Number(d.predicted_away_score),
		analysis: d.analysis,
		home_form: d.home_form || null,
		away_form: d.away_form || null,
		head_to_head: d.head_to_head || null,
		key_stats: d.key_stats || null,
		is_published: d.is_published,
		is_featured: d.is_featured,
		seo_title: d.seo_title || null,
		seo_description: d.seo_description || null
	};
}
function PredictionForm({ draft, set }) {
	const matches = useQuery({
		queryKey: ["admin", "matches"],
		queryFn: () => fetchMatches(200)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4 border border-border bg-background p-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 md:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					htmlFor: "match",
					children: "Match"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
					id: "match",
					value: draft.match_id,
					onChange: (e) => set({ match_id: e.target.value }),
					className: "h-10 w-full border border-input bg-background px-3 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "",
						children: "Select a fixture…"
					}), (matches.data ?? []).map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
						value: m.id,
						children: [
							matchLabel(m),
							" — ",
							new Date(m.kickoff_at).toLocaleDateString()
						]
					}, m.id))]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "tip",
						children: "Tip (auto-settled markets)"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						id: "tip",
						value: draft.tip,
						onChange: (e) => set({ tip: e.target.value }),
						className: "h-10 w-full border border-input bg-background px-3 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "",
							children: "Select a tip…"
						}), TIP_OPTIONS.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: t,
							children: t
						}, t))]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs text-muted-foreground",
						children: "Settled automatically from the final score once the match finishes."
					})
				] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
				htmlFor: "ptitle",
				children: "Title"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				id: "ptitle",
				value: draft.title,
				onChange: (e) => {
					set({ title: e.target.value });
					if (!draft.slug) set({ slug: slugify(e.target.value) });
				},
				className: "text-lg font-semibold",
				placeholder: "Arsenal vs Liverpool prediction, tips and odds"
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 md:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "pslug",
						children: "Slug"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "pslug",
						value: draft.slug,
						onChange: (e) => set({ slug: slugify(e.target.value) })
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "conf",
						children: "Confidence (1–5)"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "conf",
						type: "number",
						min: 1,
						max: 5,
						value: draft.confidence,
						onChange: (e) => set({ confidence: Number(e.target.value) })
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "odds",
						children: "Odds"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "odds",
						value: draft.odds,
						onChange: (e) => set({ odds: e.target.value }),
						placeholder: "2.10"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Correct score" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: draft.predicted_home_score,
								onChange: (e) => set({ predicted_home_score: e.target.value }),
								placeholder: "2"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "–" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: draft.predicted_away_score,
								onChange: (e) => set({ predicted_away_score: e.target.value }),
								placeholder: "1"
							})
						]
					})] })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Analysis" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RichTextEditor, {
				value: draft.analysis,
				onChange: (v) => set({ analysis: v })
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 md:grid-cols-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Home form",
						value: draft.home_form,
						onChange: (v) => set({ home_form: v })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Away form",
						value: draft.away_form,
						onChange: (v) => set({ away_form: v })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Head to head",
						value: draft.head_to_head,
						onChange: (v) => set({ head_to_head: v })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Key stats",
						value: draft.key_stats,
						onChange: (v) => set({ key_stats: v })
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 md:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "SEO title",
					value: draft.seo_title,
					onChange: (v) => set({ seo_title: v }),
					rows: 1
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "SEO description",
					value: draft.seo_description,
					onChange: (v) => set({ seo_description: v })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-6 border-t border-border pt-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
						id: "pub",
						checked: draft.is_published,
						onCheckedChange: (v) => set({ is_published: v })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "pub",
						children: "Published"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
						id: "pfeat",
						checked: draft.is_featured,
						onCheckedChange: (v) => set({ is_featured: v })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "pfeat",
						children: "Featured"
					})]
				})]
			})
		]
	});
}
function Field({ label, value, onChange, rows = 3 }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: label }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
		rows,
		value,
		onChange: (e) => onChange(e.target.value)
	})] });
}
function usePredictionSave() {
	const navigate = useNavigate();
	const [saving, setSaving] = (0, import_react.useState)(false);
	const create = async (draft) => {
		if (!draft.match_id) return toast.error("Pick a fixture");
		if (!draft.title.trim() || !draft.tip.trim()) return toast.error("Title and tip are required");
		setSaving(true);
		const { data: userData } = await supabase.auth.getUser();
		const { data, error } = await supabase.from("predictions").insert({
			...toRow(draft),
			author_id: userData.user.id
		}).select("id").single();
		setSaving(false);
		if (error) return toast.error(error.message);
		toast.success("Prediction created");
		navigate({
			to: "/admin/predictions/$id",
			params: { id: data.id }
		});
	};
	const update = async (id, draft) => {
		setSaving(true);
		const { error } = await supabase.from("predictions").update(toRow(draft)).eq("id", id);
		setSaving(false);
		if (error) return toast.error(error.message);
		toast.success("Saved");
	};
	return {
		saving,
		create,
		update
	};
}
//#endregion
export { emptyDraft as n, usePredictionSave as r, PredictionForm as t };
