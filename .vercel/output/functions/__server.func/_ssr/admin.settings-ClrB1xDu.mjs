import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-CZsxps-O.mjs";
import { s as fetchSettings } from "./site-D9u_L-Ue.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as Input, r as Label } from "./router-C9TCD_gT.mjs";
import { t as Button } from "./button-BLZ6ednA.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.settings-ClrB1xDu.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var empty = {
	site_name: "Dispatch",
	tagline: "",
	description: "",
	logo_url: "",
	twitter_url: "",
	facebook_url: "",
	instagram_url: "",
	youtube_url: "",
	ga_measurement_id: "",
	default_seo_title: "",
	default_seo_description: ""
};
function SettingsAdmin() {
	const [draft, setDraft] = (0, import_react.useState)(empty);
	const [saving, setSaving] = (0, import_react.useState)(false);
	const set = (patch) => setDraft((d) => ({
		...d,
		...patch
	}));
	const q = useQuery({
		queryKey: ["site-settings"],
		queryFn: fetchSettings
	});
	(0, import_react.useEffect)(() => {
		if (!q.data) return;
		const { id: _id, updated_at: _u, ...rest } = q.data;
		setDraft({
			...empty,
			...rest
		});
	}, [q.data]);
	const save = async () => {
		setSaving(true);
		const payload = {
			...draft,
			id: 1,
			updated_at: (/* @__PURE__ */ new Date()).toISOString()
		};
		const { error } = q.data ? await supabase.from("site_settings").update(payload).eq("id", 1) : await supabase.from("site_settings").insert(payload);
		setSaving(false);
		if (error) return toast.error(error.message);
		toast.success("Settings saved");
	};
	const field = (key, label, placeholder = "") => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
		htmlFor: key,
		children: label
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
		id: key,
		value: draft[key] ?? "",
		placeholder,
		onChange: (e) => set({ [key]: e.target.value })
	})] });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "max-w-3xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mb-6 font-serif text-3xl font-black",
				children: "Site settings & SEO"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mb-6 grid gap-4 border border-border bg-background p-5 md:grid-cols-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "md:col-span-2 font-serif text-lg font-bold",
						children: "Identity"
					}),
					field("site_name", "Site name"),
					field("tagline", "Tagline"),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "md:col-span-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "description",
							children: "Description"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							id: "description",
							rows: 3,
							value: draft.description ?? "",
							onChange: (e) => set({ description: e.target.value }),
							className: "w-full border border-input bg-background p-2 text-sm"
						})]
					}),
					field("logo_url", "Logo URL")
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mb-6 grid gap-4 border border-border bg-background p-5 md:grid-cols-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "md:col-span-2 font-serif text-lg font-bold",
						children: "Social"
					}),
					field("twitter_url", "X / Twitter"),
					field("facebook_url", "Facebook"),
					field("instagram_url", "Instagram"),
					field("youtube_url", "YouTube")
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mb-6 grid gap-4 border border-border bg-background p-5 md:grid-cols-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "md:col-span-2 font-serif text-lg font-bold",
						children: "SEO & analytics"
					}),
					field("default_seo_title", "Default SEO title"),
					field("ga_measurement_id", "GA measurement ID", "G-XXXXXXX"),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "md:col-span-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "seo_desc",
							children: "Default SEO description"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							id: "seo_desc",
							rows: 3,
							value: draft.default_seo_description ?? "",
							onChange: (e) => set({ default_seo_description: e.target.value }),
							className: "w-full border border-input bg-background p-2 text-sm"
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				onClick: save,
				disabled: saving,
				className: "bg-[var(--brand)] text-white hover:bg-[var(--brand)]/90",
				children: saving ? "Saving…" : "Save settings"
			})
		]
	});
}
//#endregion
export { SettingsAdmin as component };
