import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { t as Button } from "./button-BLZ6ednA.mjs";
import { n as emptyDraft, r as usePredictionSave, t as PredictionForm } from "./PredictionForm-BqiDD9rP.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.predictions.new-C6IEorys.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function NewPrediction() {
	const [draft, setDraft] = (0, import_react.useState)(emptyDraft);
	const set = (patch) => setDraft((d) => ({
		...d,
		...patch
	}));
	const { saving, create } = usePredictionSave();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "mb-6 font-serif text-3xl font-black",
			children: "New prediction"
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
				onClick: () => create(draft),
				children: "Save"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				disabled: saving,
				onClick: () => create({
					...draft,
					is_published: true
				}),
				className: "bg-[var(--brand)] text-white hover:bg-[var(--brand)]/90",
				children: "Publish"
			})]
		})
	] });
}
//#endregion
export { NewPrediction as component };
