import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { n as Header, t as Footer } from "./Footer-CdYgFB21.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/predictions._slug-D_POBv01.js
var import_jsx_runtime = require_jsx_runtime();
var SplitNotFoundComponent = () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
	className: "min-h-screen",
	children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "container-page py-20 text-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-serif text-5xl font-black",
				children: "Prediction not found"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/predictions",
				className: "mt-4 inline-block text-[var(--brand)] underline",
				children: "All predictions"
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {})
	]
});
//#endregion
export { SplitNotFoundComponent as notFoundComponent };
