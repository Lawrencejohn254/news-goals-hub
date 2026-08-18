import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-CZsxps-O.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { d as Route$3 } from "./router-C9TCD_gT.mjs";
import { t as Button } from "./button-BLZ6ednA.mjs";
import { n as emptyDraft, r as usePredictionSave, t as PredictionForm } from "./PredictionForm-BqiDD9rP.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.predictions._id-DhMm0cle.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function EditPrediction() {
	const { id } = Route$3.useParams();
	const [draft, setDraft] = (0, import_react.useState)(emptyDraft);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const set = (patch) => setDraft((d) => ({
		...d,
		...patch
	}));
	const { saving, update } = usePredictionSave();
	(0, import_react.useEffect)(() => {
		supabase.from("predictions").select("*").eq("id", id).maybeSingle().then(({ data, error }) => {
			if (error) toast.error(error.message);
			if (data) setDraft({
				match_id: data.match_id,
				title: data.title,
				slug: data.slug,
				tip: data.tip,
				confidence: data.confidence,
				odds: data.odds != null ? String(data.odds) : "",
				predicted_home_score: data.predicted_home_score != null ? String(data.predicted_home_score) : "",
				predicted_away_score: data.predicted_away_score != null ? String(data.predicted_away_score) : "",
				analysis: data.analysis ?? "",
				home_form: data.home_form ?? "",
				away_form: data.away_form ?? "",
				head_to_head: data.head_to_head ?? "",
				key_stats: data.key_stats ?? "",
				is_published: data.is_published,
				is_featured: data.is_featured,
				seo_title: data.seo_title ?? "",
				seo_description: data.seo_description ?? ""
			});
			setLoading(false);
		});
	}, [id]);
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-muted-foreground",
		children: "Loading…"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "mb-6 font-serif text-3xl font-black",
			children: "Edit prediction"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PredictionForm, {
			draft,
			set
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-6 flex gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "outline",
				disabled: saving,
				onClick: () => update(id, draft),
				children: "Save changes"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				disabled: saving,
				onClick: () => {
					set({ is_published: !draft.is_published });
					update(id, {
						...draft,
						is_published: !draft.is_published
					});
				},
				className: "bg-[var(--brand)] text-white hover:bg-[var(--brand)]/90",
				children: draft.is_published ? "Unpublish" : "Publish"
			})]
		})
	] });
}
//#endregion
export { EditPrediction as component };
