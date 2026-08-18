import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { n as Header, t as Footer } from "./Footer-CdYgFB21.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/disclaimer-DurSoI-u.js
var import_jsx_runtime = require_jsx_runtime();
function DisclaimerPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "container-page py-10",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "mx-auto max-w-3xl",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-serif text-4xl font-black text-[var(--ink)] md:text-5xl",
						children: "Disclaimer"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "article-prose mt-8",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "News content" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
								"We aim for accuracy, but news situations can change quickly after publication. Where an article becomes outdated or inaccurate, we correct it — see our",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/editorial-policy",
									className: "text-[var(--brand)] underline",
									children: "Editorial Policy"
								}),
								". Always verify time-sensitive information (such as breaking news) against official sources before acting on it."
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Football predictions" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("blockquote", { children: "18+. Predictions published on The Dispatch are opinion and analysis, not guarantees of any outcome. Past results shown on this site (where available) are historical and do not predict future results. Please gamble responsibly." }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Our football predictions are informational content based on publicly available form, fixture and statistical data. They are not financial advice, and we make no promise — express or implied — about their accuracy or profitability. Any betting or wagering decision you make is entirely your own responsibility. If gambling is stopping being fun, or you feel you're losing control, please seek help from a qualified support service in your area." }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "External links" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Articles may link to external websites for context or sourcing. We aren't responsible for the content or accuracy of external sites we don't control." }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Questions" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
								"If you have concerns about a specific article or prediction, please use our",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/contact",
									className: "text-[var(--brand)] underline",
									children: "Contact"
								}),
								" ",
								"page."
							] })
						]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {})
		]
	});
}
//#endregion
export { DisclaimerPage as component };
