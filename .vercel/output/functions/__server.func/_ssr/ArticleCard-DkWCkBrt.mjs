import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { t as formatDate } from "./format-CG3FEzEE.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ArticleCard-DkWCkBrt.js
var import_jsx_runtime = require_jsx_runtime();
function ArticleCard({ article, size = "md" }) {
	const cat = article.categories;
	const author = article.profiles?.display_name ?? "Staff";
	if (size === "hero") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to: "/article/$slug",
		params: { slug: article.slug },
		className: "group grid gap-6 md:grid-cols-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "aspect-[16/10] overflow-hidden bg-muted",
			children: article.featured_image ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: article.featured_image,
				alt: article.title,
				className: "h-full w-full object-cover transition-transform group-hover:scale-[1.02]"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex h-full items-center justify-center text-muted-foreground",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-serif text-4xl",
					children: "📰"
				})
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col justify-center",
			children: [
				cat && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "mb-3 inline-block w-fit px-2 py-1 text-xs font-bold uppercase tracking-widest text-white",
					style: { backgroundColor: cat.color },
					children: cat.name
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-serif text-3xl font-black leading-tight text-[var(--ink)] group-hover:text-[var(--brand)] md:text-5xl",
					children: article.title
				}),
				article.excerpt && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 text-base text-muted-foreground md:text-lg",
					children: article.excerpt
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 text-sm text-muted-foreground",
					children: [
						"By ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-semibold text-foreground",
							children: author
						}),
						" ·",
						" ",
						formatDate(article.published_at),
						" · ",
						article.reading_time,
						" min read"
					]
				})
			]
		})]
	});
	if (size === "sm") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to: "/article/$slug",
		params: { slug: article.slug },
		className: "group flex gap-3 border-b border-border pb-3 last:border-b-0",
		children: [article.featured_image && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "h-16 w-20 shrink-0 overflow-hidden bg-muted",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: article.featured_image,
				alt: article.title,
				className: "h-full w-full object-cover"
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-w-0",
			children: [cat && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-[10px] font-bold uppercase tracking-wider",
				style: { color: cat.color },
				children: cat.name
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "font-serif text-sm font-bold leading-snug text-[var(--ink)] group-hover:text-[var(--brand)]",
				children: article.title
			})]
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to: "/article/$slug",
		params: { slug: article.slug },
		className: "group block",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "aspect-[16/10] overflow-hidden bg-muted",
				children: article.featured_image ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: article.featured_image,
					alt: article.title,
					className: "h-full w-full object-cover transition-transform group-hover:scale-[1.02]"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex h-full items-center justify-center text-muted-foreground",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-serif text-2xl",
						children: "📰"
					})
				})
			}),
			cat && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "mt-3 inline-block text-xs font-bold uppercase tracking-widest",
				style: { color: cat.color },
				children: cat.name
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "mt-1 font-serif text-xl font-bold leading-snug text-[var(--ink)] group-hover:text-[var(--brand)]",
				children: article.title
			}),
			article.excerpt && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 line-clamp-2 text-sm text-muted-foreground",
				children: article.excerpt
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-2 text-xs text-muted-foreground",
				children: [
					author,
					" · ",
					formatDate(article.published_at)
				]
			})
		]
	});
}
//#endregion
export { ArticleCard as t };
