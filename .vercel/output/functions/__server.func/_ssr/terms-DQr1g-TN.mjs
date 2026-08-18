import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { n as Header, t as Footer } from "./Footer-CdYgFB21.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/terms-DQr1g-TN.js
var import_jsx_runtime = require_jsx_runtime();
function TermsPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "container-page py-10",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "mx-auto max-w-3xl",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "font-serif text-4xl font-black text-[var(--ink)] md:text-5xl",
							children: "Terms of Use"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-muted-foreground",
							children: "Last updated: 2026"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "article-prose mt-8",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "By using The Dispatch, you agree to these terms. If you don't agree, please don't use the site." }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Using this site" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "You may read, share and link to our content for personal, non-commercial use. Republishing full articles without permission isn't allowed — for licensing or syndication, contact us." }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Accounts" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "If you create an account, you're responsible for keeping access to your email secure, since that's how you sign in. Editorial and admin accounts require approval before they can be used, at our discretion." }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Comments and user content" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "You're responsible for what you post in comments. We may remove or decline to publish comments that are abusive, unlawful, or otherwise inappropriate, without notice." }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Football predictions" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
									"Predictions published on The Dispatch are opinion and analysis, not guarantees. See our",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/disclaimer",
										className: "text-[var(--brand)] underline",
										children: "Disclaimer"
									}),
									" ",
									"for details."
								] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "No warranty" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "The site and its content are provided \"as is.\" We make reasonable efforts to keep information accurate and up to date, but we don't guarantee the site will be error-free or uninterrupted." }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Changes" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "We may update these terms or the site's features from time to time. Continued use after changes means you accept the updated terms." }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Contact" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
									"Questions about these terms can be sent via our",
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
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {})
		]
	});
}
//#endregion
export { TermsPage as component };
