import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { n as Header, t as Footer } from "./Footer-CdYgFB21.mjs";
import { l as Route$25 } from "./router-C9TCD_gT.mjs";
import { t as ArticleCard } from "./ArticleCard-DkWCkBrt.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/authors._id-BC-YiL9J.js
var import_jsx_runtime = require_jsx_runtime();
function Avatar({ name, avatarUrl, size = 72 }) {
	if (avatarUrl) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
		src: avatarUrl,
		alt: name,
		style: {
			width: size,
			height: size
		},
		className: "rounded-full object-cover"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		style: {
			width: size,
			height: size
		},
		className: "flex items-center justify-center rounded-full bg-[var(--ink)] text-2xl font-bold text-white",
		children: name.slice(0, 2).toUpperCase()
	});
}
function AuthorPage() {
	const { profile, articles } = Route$25.useLoaderData();
	if (!profile) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "container-page py-20 text-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-serif text-5xl font-black",
					children: "Author not found"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/",
					className: "mt-4 inline-block text-[var(--brand)] underline",
					children: "Back to home"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {})
		]
	});
	const name = profile.display_name ?? "Staff";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "container-page py-10",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "mx-auto flex max-w-3xl items-center gap-5 border-b-2 border-[var(--ink)] pb-8",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, {
						name,
						avatarUrl: profile.avatar_url
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-bold uppercase tracking-widest text-muted-foreground",
							children: "Author"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "mt-1 font-serif text-3xl font-black text-[var(--ink)] md:text-4xl",
							children: name
						}),
						profile.bio && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-muted-foreground",
							children: profile.bio
						})
					] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "mx-auto mt-10 max-w-5xl",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
						className: "mb-6 font-serif text-xl font-bold uppercase tracking-wider",
						children: ["Articles by ", name]
					}), articles.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-muted-foreground",
						children: "No published articles yet."
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid gap-8 md:grid-cols-2 lg:grid-cols-3",
						children: articles.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArticleCard, { article: a }, a.id))
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {})
		]
	});
}
//#endregion
export { AuthorPage as component };
