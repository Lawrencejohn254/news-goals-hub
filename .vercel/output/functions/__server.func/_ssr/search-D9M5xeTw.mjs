import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-CZsxps-O.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as Header, t as Footer } from "./Footer-CdYgFB21.mjs";
import { f as Route$30, n as Input } from "./router-C9TCD_gT.mjs";
import { t as ArticleCard } from "./ArticleCard-DkWCkBrt.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/search-D9M5xeTw.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SearchPage() {
	const { q: initial } = Route$30.useSearch();
	const [term, setTerm] = (0, import_react.useState)(initial);
	const navigate = Route$30.useNavigate();
	const results = useQuery({
		queryKey: ["search", initial],
		enabled: initial.trim().length > 1,
		queryFn: async () => {
			const like = `%${initial.trim().slice(0, 100).replace(/[%_,.()]/g, "")}%`;
			const [byTitle, byExcerpt, preds] = await Promise.all([
				supabase.from("articles").select("*, categories(id,name,slug,color), profiles!articles_author_profile_fkey(display_name,avatar_url)").eq("status", "published").ilike("title", like).limit(20),
				supabase.from("articles").select("*, categories(id,name,slug,color), profiles!articles_author_profile_fkey(display_name,avatar_url)").eq("status", "published").ilike("excerpt", like).limit(20),
				supabase.from("predictions").select("id,slug,title,tip").eq("is_published", true).ilike("title", like).limit(10)
			]);
			const seen = /* @__PURE__ */ new Set();
			const articles = [];
			for (const a of [...byTitle.data ?? [], ...byExcerpt.data ?? []]) if (!seen.has(a.id)) {
				seen.add(a.id);
				articles.push(a);
			}
			return {
				articles: articles.slice(0, 20),
				predictions: preds.data ?? []
			};
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "container-page py-10",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-serif text-4xl font-black",
						children: "Search"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						className: "mt-4 flex max-w-xl gap-2",
						onSubmit: (e) => {
							e.preventDefault();
							navigate({ search: { q: term } });
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: term,
							onChange: (e) => setTerm(e.target.value),
							placeholder: "Search stories…",
							maxLength: 100
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "bg-[var(--brand)] px-5 text-sm font-semibold text-white",
							children: "Search"
						})]
					}),
					initial && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-6 text-sm text-muted-foreground",
						children: ["Results for ", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "font-semibold text-foreground",
							children: [
								"\"",
								initial,
								"\""
							]
						})]
					}),
					results.isLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-6 text-muted-foreground",
						children: "Searching…"
					}),
					results.data && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-8 grid gap-8 md:grid-cols-3",
							children: results.data.articles.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArticleCard, { article: a }, a.id))
						}),
						results.data.predictions.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "mt-12",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "mb-4 border-b-2 border-[var(--ink)] pb-2 font-serif text-xl font-bold uppercase tracking-wider",
								children: "Predictions"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "space-y-2 text-sm",
								children: results.data.predictions.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
										href: `/predictions/${p.slug}`,
										className: "font-semibold hover:text-[var(--brand)]",
										children: p.title
									}),
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-muted-foreground",
										children: ["— ", p.tip]
									})
								] }, p.id))
							})]
						}),
						results.data.articles.length === 0 && results.data.predictions.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-8 text-muted-foreground",
							children: "No matches found."
						})
					] })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {})
		]
	});
}
//#endregion
export { SearchPage as component };
