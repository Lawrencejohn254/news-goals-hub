import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { n as Header, t as Footer } from "./Footer-CdYgFB21.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/about-BolZi7Kc.js
var import_jsx_runtime = require_jsx_runtime();
function AboutPage() {
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
						children: "About The Dispatch"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "article-prose mt-8",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "The Dispatch is an independent digital newsroom covering politics, business, technology, sport and international affairs, alongside a dedicated football predictions section offering match analysis and tips." }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "What we cover" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Our newsroom publishes original reporting and analysis across politics, business, finance, technology, health, sport, entertainment, international news and local news. Our football predictions team publishes match previews, form guides and tips based on publicly available fixture and results data." }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Our editorial mission" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
								"We aim to report accurately, correct mistakes openly, and keep a clear line between news reporting and opinion or prediction content. Our full editorial standards are set out in our",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/editorial-policy",
									className: "text-[var(--brand)] underline",
									children: "Editorial Policy"
								}),
								"."
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Who operates The Dispatch" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
								"The Dispatch is an independently operated publication. For questions about ownership, editorial decisions or corrections, see our",
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
export { AboutPage as component };
