import { n as fetchArticlesByCategory } from "./queries-BfatjlGT.mjs";
import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as Header, t as Footer } from "./Footer-CdYgFB21.mjs";
import { c as Route$24 } from "./router-C9TCD_gT.mjs";
import { t as ArticleCard } from "./ArticleCard-DkWCkBrt.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/category._slug-BmovBIXM.js
var import_jsx_runtime = require_jsx_runtime();
function CategoryPage() {
	const { slug } = Route$24.useParams();
	const loaderData = Route$24.useLoaderData();
	const q = useQuery({
		queryKey: ["category", slug],
		queryFn: () => fetchArticlesByCategory(slug),
		initialData: loaderData
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "container-page py-10",
				children: !q.data?.category ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "py-20 text-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-serif text-4xl font-black",
						children: "Section not found"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "mt-4 inline-block text-[var(--brand)] underline",
						children: "Back to home"
					})]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "mb-10 border-b-2 border-[var(--ink)] pb-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "inline-block h-2 w-16",
							style: { backgroundColor: q.data.category.color }
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "mt-3 font-serif text-5xl font-black text-[var(--ink)]",
							children: q.data.category.name
						}),
						q.data.category.description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 max-w-2xl text-muted-foreground",
							children: q.data.category.description
						})
					]
				}), q.data.articles.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-muted-foreground",
					children: "No stories in this section yet."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-8 md:grid-cols-2 lg:grid-cols-3",
					children: q.data.articles.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArticleCard, { article: a }, a.id))
				})] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {})
		]
	});
}
//#endregion
export { CategoryPage as component };
