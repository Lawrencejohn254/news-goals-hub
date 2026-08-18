import { t as supabase } from "./client-CZsxps-O.mjs";
import { i as fetchActiveAds } from "./site-D9u_L-Ue.mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { t as useQuery } from "../_libs/tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/AdSlot-DT4WPkar.js
var import_jsx_runtime = require_jsx_runtime();
function AdSlot({ placement, className = "" }) {
	const ad = useQuery({
		queryKey: ["ads", placement],
		queryFn: () => fetchActiveAds(placement),
		staleTime: 3e5
	}).data?.[0];
	if (!ad) return null;
	const track = (field) => {
		const patch = field === "clicks" ? { clicks: (ad.clicks ?? 0) + 1 } : { impressions: (ad.impressions ?? 0) + 1 };
		supabase.from("ads").update(patch).eq("id", ad.id).then(() => {});
	};
	const inner = ad.html_code ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { dangerouslySetInnerHTML: { __html: ad.html_code } }) : ad.image_url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
		src: ad.image_url,
		alt: ad.name,
		className: "mx-auto max-h-[280px] w-full object-contain"
	}) : null;
	if (!inner) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `border border-border bg-muted/30 p-3 ${className}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mb-2 text-center text-[10px] uppercase tracking-[0.2em] text-muted-foreground",
			children: "Advertisement"
		}), ad.target_url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
			href: ad.target_url,
			target: "_blank",
			rel: "noopener noreferrer sponsored",
			onClick: () => track("clicks"),
			onMouseEnter: () => track("impressions"),
			children: inner
		}) : inner]
	});
}
//#endregion
export { AdSlot as t };
