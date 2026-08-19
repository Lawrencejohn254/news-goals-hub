import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-CZsxps-O.mjs";
import { s as fetchPublishedArticles, t as fetchArticleBySlug } from "./queries-BfatjlGT.mjs";
import { a as fetchApprovedComments, c as logPageView, l as postComment } from "./site-D9u_L-Ue.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { H as notFound, _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as Header, t as Footer } from "./Footer-CdYgFB21.mjs";
import { r as relativeDate, t as formatDate } from "./format-CG3FEzEE.mjs";
import { _ as absoluteUrl, h as Textarea, u as Route$26 } from "./router-C9TCD_gT.mjs";
import { t as Button } from "./button-BLZ6ednA.mjs";
import { t as ArticleCard } from "./ArticleCard-DkWCkBrt.mjs";
import { t as AdSlot } from "./AdSlot-DT4WPkar.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/article._slug-DEfdEW3U.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Comments({ articleId }) {
	const [user, setUser] = (0, import_react.useState)(null);
	const [body, setBody] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		supabase.auth.getUser().then(({ data }) => setUser(data.user ?? null));
		const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setUser(s?.user ?? null));
		return () => sub.subscription.unsubscribe();
	}, []);
	const q = useQuery({
		queryKey: ["comments", articleId],
		queryFn: () => fetchApprovedComments(articleId)
	});
	const submit = async (e) => {
		e.preventDefault();
		setBusy(true);
		try {
			await postComment(articleId, body);
			setBody("");
			toast.success("Comment submitted — it will appear once approved by a moderator.");
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Could not post comment");
		} finally {
			setBusy(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mx-auto mt-16 max-w-3xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
				className: "mb-6 border-b-2 border-[var(--ink)] pb-2 font-serif text-2xl font-bold uppercase tracking-wider",
				children: ["Comments ", q.data ? `(${q.data.length})` : ""]
			}),
			user ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: submit,
				className: "mb-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
					value: body,
					onChange: (e) => setBody(e.target.value),
					rows: 4,
					maxLength: 2e3,
					placeholder: "Share your thoughts…"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-2 flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-xs text-muted-foreground",
						children: [body.length, "/2000"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						disabled: busy || !body.trim(),
						className: "bg-[var(--brand)] text-white hover:bg-[var(--brand)]/90",
						children: "Post comment"
					})]
				})]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mb-8 border-l-4 border-[var(--brand)] bg-muted/40 p-4 text-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/auth",
						className: "font-semibold underline",
						children: "Sign in"
					}),
					" ",
					"to join the conversation."
				]
			}),
			q.isLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Loading comments…"
			}),
			q.data?.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "No comments yet. Be the first."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "space-y-6",
				children: (q.data ?? []).map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "border-b border-border pb-5 last:border-b-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-1 flex items-center gap-2 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-semibold",
							children: c.author_name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-muted-foreground",
							children: ["· ", relativeDate(c.created_at)]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "whitespace-pre-wrap text-sm leading-relaxed",
						children: c.content
					})]
				}, c.id))
			})
		]
	});
}
function AuthorAvatar({ name, avatarUrl, size = 36 }) {
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
		className: "flex items-center justify-center rounded-full bg-[var(--ink)] text-xs font-bold text-white",
		children: name.slice(0, 2).toUpperCase()
	});
}
function ArticlePage() {
	const { slug } = Route$26.useParams();
	const { article: loaderArticle } = Route$26.useLoaderData();
	const q = useQuery({
		queryKey: ["article", slug],
		queryFn: () => fetchArticleBySlug(slug),
		initialData: loaderArticle
	});
	const related = useQuery({
		queryKey: ["related", q.data?.category_id],
		queryFn: () => fetchPublishedArticles(4),
		enabled: !!q.data
	});
	(0, import_react.useEffect)(() => {
		if (!q.data) return;
		supabase.from("articles").update({ view_count: (q.data.view_count ?? 0) + 1 }).eq("id", q.data.id).then(() => {});
		logPageView(`/article/${q.data.slug}`, { articleId: q.data.id });
	}, [q.data?.id]);
	if (q.isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
			className: "container-page py-10",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-muted-foreground",
				children: "Loading…"
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {})
	] });
	if (!q.data) throw notFound();
	const a = q.data;
	const cat = a.categories;
	const authorName = a.profiles?.display_name ?? "Staff";
	const jsonLd = {
		"@context": "https://schema.org",
		"@type": "NewsArticle",
		headline: a.title,
		description: a.excerpt ?? a.seo_description ?? void 0,
		image: a.featured_image ? [a.featured_image] : void 0,
		datePublished: a.published_at ?? a.created_at,
		dateModified: a.updated_at,
		author: {
			"@type": "Person",
			name: authorName
		},
		publisher: {
			"@type": "Organization",
			name: "The Dispatch"
		},
		mainEntityOfPage: {
			"@type": "WebPage",
			"@id": absoluteUrl(`/article/${a.slug}`)
		},
		articleSection: cat?.name ?? void 0
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("script", {
				type: "application/ld+json",
				dangerouslySetInnerHTML: { __html: JSON.stringify(jsonLd) }
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "container-page py-10",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "mx-auto max-w-3xl",
					children: [
						cat && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/category/$slug",
							params: { slug: cat.slug },
							className: "inline-block px-2 py-1 text-xs font-bold uppercase tracking-widest text-white",
							style: { backgroundColor: cat.color },
							children: cat.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "mt-4 font-serif text-4xl font-black leading-tight text-[var(--ink)] md:text-5xl",
							children: a.title
						}),
						a.excerpt && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 text-lg text-muted-foreground md:text-xl",
							children: a.excerpt
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-6 flex flex-wrap items-center gap-3 border-y border-border py-4 text-sm text-muted-foreground",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/authors/$id",
									params: { id: a.author_id },
									className: "flex items-center gap-2 hover:text-[var(--brand)]",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthorAvatar, {
										name: authorName,
										avatarUrl: a.profiles?.avatar_url,
										size: 32
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-semibold text-foreground",
										children: authorName
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "·" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatDate(a.published_at ?? a.created_at) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "·" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [a.reading_time, " min read"] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "·" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [a.view_count?.toLocaleString() ?? 0, " views"] })
							]
						}),
						a.featured_image && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: a.featured_image,
							alt: a.title,
							className: "mt-6 aspect-[16/9] w-full object-cover"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdSlot, {
							placement: "article-inline",
							className: "my-8"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "article-prose mt-8",
							dangerouslySetInnerHTML: { __html: a.content }
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-10 flex gap-4 border border-border bg-[var(--paper)] p-5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/authors/$id",
								params: { id: a.author_id },
								className: "shrink-0",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthorAvatar, {
									name: authorName,
									avatarUrl: a.profiles?.avatar_url,
									size: 56
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs font-bold uppercase tracking-widest text-muted-foreground",
									children: "Written by"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/authors/$id",
									params: { id: a.author_id },
									className: "mt-1 inline-block font-serif text-lg font-bold text-[var(--ink)] hover:text-[var(--brand)]",
									children: authorName
								}),
								a.profiles?.bio ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-sm text-muted-foreground",
									children: a.profiles.bio
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-sm text-muted-foreground",
									children: "Reporter at The Dispatch."
								})
							] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdSlot, {
							placement: "article-bottom",
							className: "my-10"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Comments, { articleId: a.id })
					]
				}), related.data && related.data.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "mx-auto mt-16 max-w-5xl",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mb-6 border-b-2 border-[var(--ink)] pb-2 font-serif text-2xl font-bold uppercase tracking-wider",
						children: "More stories"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid gap-8 md:grid-cols-3",
						children: related.data.filter((r) => r.id !== a.id).slice(0, 3).map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArticleCard, { article: r }, r.id))
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {})
		]
	});
}
//#endregion
export { ArticlePage as component };
