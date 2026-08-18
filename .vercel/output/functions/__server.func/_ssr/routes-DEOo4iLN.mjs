import { a as fetchFeaturedArticles, c as fetchTrending, i as fetchCategories, o as fetchMostRead, s as fetchPublishedArticles } from "./queries-BfatjlGT.mjs";
import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as Header, r as NewsletterForm, t as Footer } from "./Footer-CdYgFB21.mjs";
import { p as Route$38 } from "./router-C9TCD_gT.mjs";
import { t as ArticleCard } from "./ArticleCard-DkWCkBrt.mjs";
import { t as AdSlot } from "./AdSlot-DT4WPkar.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-DEOo4iLN.js
var import_jsx_runtime = require_jsx_runtime();
function HomePage() {
	const loaderData = Route$38.useLoaderData();
	const featured = useQuery({
		queryKey: ["featured"],
		queryFn: () => fetchFeaturedArticles(5),
		initialData: loaderData.featured
	});
	const latest = useQuery({
		queryKey: ["latest"],
		queryFn: () => fetchPublishedArticles(12),
		initialData: loaderData.latest
	});
	const mostRead = useQuery({
		queryKey: ["mostRead"],
		queryFn: () => fetchMostRead(5),
		initialData: loaderData.mostRead
	});
	const trending = useQuery({
		queryKey: ["trending"],
		queryFn: () => fetchTrending(6),
		initialData: loaderData.trending
	});
	const categories = useQuery({
		queryKey: ["categories"],
		queryFn: fetchCategories,
		initialData: loaderData.categories
	});
	const hero = featured.data?.[0] ?? latest.data?.[0];
	const featuredRest = (featured.data ?? []).slice(1, 4);
	const latestList = (latest.data ?? []).slice(hero ? 1 : 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "container-page mt-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-4 border border-border bg-[var(--brand)] px-4 py-2 text-white overflow-hidden",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "shrink-0 bg-[var(--ink)] px-2 py-1 text-xs font-bold uppercase tracking-widest",
						children: "Breaking"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex-1 overflow-hidden whitespace-nowrap",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "marquee inline-block",
							children: [(latest.data ?? []).slice(0, 6).map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/article/$slug",
								params: { slug: a.slug },
								className: "mr-10 text-sm font-medium hover:underline",
								children: ["● ", a.title]
							}, a.id)), (latest.data ?? []).slice(0, 6).map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/article/$slug",
								params: { slug: a.slug },
								className: "mr-10 text-sm font-medium hover:underline",
								children: ["● ", a.title]
							}, `d-${a.id}`))]
						})
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "container-page pb-10 pt-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mb-10 flex justify-center",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdSlot, {
							placement: "home-top",
							className: "w-full max-w-4xl"
						})
					}),
					hero && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "mb-14 grid gap-10 lg:grid-cols-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "lg:col-span-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArticleCard, {
								article: hero,
								size: "hero"
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "border-b-2 border-[var(--ink)] pb-2 font-serif text-lg font-bold uppercase tracking-wider",
								children: "Editor's Picks"
							}), featuredRest.length > 0 ? featuredRest.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArticleCard, {
								article: a,
								size: "sm"
							}, a.id)) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted-foreground",
								children: "No featured stories yet"
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "mb-14",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mb-6 border-b-2 border-[var(--ink)] pb-2 font-serif text-2xl font-bold uppercase tracking-wider",
							children: "Latest News"
						}), latest.isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-muted-foreground",
							children: "Loading…"
						}) : latestList.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "border border-dashed border-border p-8 text-center text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-serif text-xl",
								children: "No stories published yet."
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-2 text-sm",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/auth",
										className: "text-[var(--brand)] underline",
										children: "Sign in"
									}),
									" ",
									"and head to the admin dashboard to publish your first article."
								]
							})]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid gap-8 md:grid-cols-2 lg:grid-cols-3",
							children: latestList.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArticleCard, { article: a }, a.id))
						})]
					}),
					(trending.data ?? []).length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "mb-14",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mb-6 border-b-2 border-[var(--brand)] pb-2 font-serif text-2xl font-bold uppercase tracking-wider",
							children: "🔥 Trending Now"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid gap-6 sm:grid-cols-2 lg:grid-cols-3",
							children: (trending.data ?? []).map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArticleCard, {
								article: a,
								size: "sm"
							}, a.id))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mb-14 flex justify-center",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdSlot, {
							placement: "home-mid",
							className: "w-full max-w-4xl"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "grid gap-10 lg:grid-cols-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "lg:col-span-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "mb-6 border-b-2 border-[var(--ink)] pb-2 font-serif text-2xl font-bold uppercase tracking-wider",
								children: "Sections"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid grid-cols-2 gap-3 sm:grid-cols-3",
								children: (categories.data ?? []).map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/category/$slug",
									params: { slug: c.slug },
									className: "group flex items-center justify-between border border-border bg-background p-4 transition-colors hover:bg-[var(--paper)]",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "mb-1 block h-1 w-8",
										style: { backgroundColor: c.color }
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-serif text-lg font-bold group-hover:text-[var(--brand)]",
										children: c.name
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground group-hover:text-[var(--brand)]",
										children: "→"
									})]
								}, c.id))
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
							className: "space-y-10",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "mb-6 border-b-2 border-[var(--ink)] pb-2 font-serif text-lg font-bold uppercase tracking-wider",
									children: "Most Read"
								}), (mostRead.data ?? []).length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-muted-foreground",
									children: "Views will show up here."
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
									className: "space-y-4",
									children: (mostRead.data ?? []).map((a, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
										className: "flex gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-serif text-3xl font-black text-[var(--brand)]",
											children: i + 1
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
											to: "/article/$slug",
											params: { slug: a.slug },
											className: "font-serif text-sm font-bold leading-snug hover:text-[var(--brand)]",
											children: a.title
										})]
									}, a.id))
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "border border-border bg-[var(--ink)] p-5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
											className: "mb-2 font-serif text-lg font-bold uppercase tracking-wider text-white",
											children: "Daily Brief"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mb-3 text-sm text-white/80",
											children: "Top stories and predictions, straight to your inbox every morning."
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NewsletterForm, {
											source: "homepage",
											variant: "dark"
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdSlot, { placement: "sidebar" })
							]
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {})
		]
	});
}
//#endregion
export { HomePage as component };
