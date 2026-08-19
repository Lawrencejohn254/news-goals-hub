import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { n as Header, t as Footer } from "./Footer-CdYgFB21.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/editorial-policy-Bv1lTi0n.js
var import_jsx_runtime = require_jsx_runtime();
function EditorialPolicyPage() {
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
						children: "Editorial Policy"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "article-prose mt-8",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Editorial independence" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Our reporting and editorial decisions are made independently of advertisers, sponsors, and any business relationships The Dispatch may have. Advertising content is clearly presented as such and never influences our news coverage." }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Source attribution" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Where an article draws on external reporting, data, or statements, we attribute the source and link to it where possible. Original reporting and analysis is credited to the author byline shown on the article." }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Accuracy" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
								"We aim to verify facts before publication. Football predictions are clearly labelled as analysis and opinion, not news reporting, and carry their own disclaimer (see our",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/disclaimer",
									className: "text-[var(--brand)] underline",
									children: "Disclaimer"
								}),
								")."
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Corrections" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
								"When we get something wrong, we correct it. Articles that have been substantively updated after publication show an updated date. For factual errors, we aim to correct the article promptly once verified. To report a possible error, use our",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/contact",
									className: "text-[var(--brand)] underline",
									children: "Contact"
								}),
								" ",
								"page and select \"Corrections.\""
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Conflicts of interest" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Where a writer or editor has a personal or financial interest relevant to a story they're covering, that should be disclosed within the article. If you believe a conflict of interest wasn't disclosed, please let us know via the Contact page." }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Comments moderation" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Reader comments are reviewed before publication. We moderate for abuse, harassment, and unlawful content — not for disagreement with our reporting or opinions expressed." })
						]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {})
		]
	});
}
//#endregion
export { EditorialPolicyPage as component };
