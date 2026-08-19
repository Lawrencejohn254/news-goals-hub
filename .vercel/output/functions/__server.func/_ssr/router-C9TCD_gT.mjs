import { i as __toESM, n as __exportAll } from "../_runtime.mjs";
import { t as supabase } from "./client-CZsxps-O.mjs";
import { a as fetchFeaturedArticles, c as fetchTrending, i as fetchCategories, n as fetchArticlesByCategory, o as fetchMostRead, r as fetchAuthorWithArticles, s as fetchPublishedArticles, t as fetchArticleBySlug } from "./queries-BfatjlGT.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { _ as Link, f as createRouter, g as createRootRouteWithContext, h as createFileRoute, l as Scripts, m as lazyRouteComponent, p as Outlet, u as HeadContent, x as useRouter, z as redirect } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { n as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
import { D as Heading3, I as Bold, O as Heading2, S as Link$1, T as Image, a as TextAlignStart, b as List, d as Redo, f as Quote, k as GripVertical, m as Minus, o as TextAlignEnd, r as Undo, s as TextAlignCenter, w as Italic, x as ListOrdered } from "../_libs/lucide-react.mjs";
import { t as __exportAll$1 } from "./rolldown-runtime-D7D4PA-g.mjs";
import { a as supabaseAdmin, i as slugify } from "./format-CG3FEzEE.mjs";
import { a as fetchPredictionBySlug, o as fetchPredictionStats, s as fetchPredictions } from "./football-DKHVh4O4.mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { i as useEditor, n as NodeViewWrapper, r as ReactNodeViewRenderer, t as EditorContent } from "../_libs/fast-equals+tiptap__react.mjs";
import { n as index_default } from "../_libs/@tiptap/extension-link+[...].mjs";
import { t as index_default$1 } from "../_libs/tiptap__starter-kit.mjs";
import { t as index_default$2 } from "../_libs/tiptap__extension-text-align.mjs";
import { t as DragHandle } from "../_libs/@tiptap/extension-drag-handle-react+[...].mjs";
import { t as index_default$3 } from "../_libs/tiptap__extension-image.mjs";
import { t as Root } from "../_libs/radix-ui__react-label.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/site-url-mKdm-s_o.js
/**
* Single source of truth for the site's public production URL.
*
* Set VITE_SITE_URL in your environment (e.g. https://thedispatch.co.ke,
* no trailing slash) once your custom domain is connected. Until it's set,
* absoluteUrl() falls back to returning the relative path unchanged — still
* valid for canonical/OG tags, just not a fully-qualified URL, so nothing
* breaks before the domain is configured; it just becomes fully correct the
* moment the env var is set.
*/
var SITE_URL = "https://yourdomain.com".replace(/\/+$/, "");
function absoluteUrl(path) {
	const cleanPath = path.startsWith("/") ? path : `/${path}`;
	return SITE_URL ? `${SITE_URL}${cleanPath}` : cleanPath;
}
function getSiteUrl() {
	return SITE_URL;
}
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/router-C9TCD_gT.js
var router_C9TCD_gT_exports = /* @__PURE__ */ __exportAll({
	a: () => Label,
	c: () => Route$6,
	d: () => Route$23,
	f: () => Route$24,
	g: () => Route$38,
	getRouter: () => getRouter,
	h: () => Route$30,
	i: () => Textarea,
	l: () => Route$21,
	m: () => Route$26,
	n: () => Route$3,
	o: () => Input,
	p: () => Route$25,
	r: () => ArticleForm,
	s: () => RichTextEditor,
	t: () => router_exports,
	u: () => Route$22
});
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var styles_default = "/assets/styles-Tc-torbA.css";
/**
* Lightweight error reporting. Currently just logs to the console; swap the
* body of reportError() for a real provider (Sentry, LogRocket, etc.) when
* you're ready to track errors from real production traffic.
*/
function reportError(error, context = {}) {
	if (typeof window === "undefined") return;
	const message = error instanceof Response ? `Response ${error.status}${error.url ? ` at ${error.url}` : ""}` : error instanceof Error ? error.message : String(error);
	console.error("[error-boundary]", message, {
		route: window.location.pathname,
		stack: error instanceof Error ? error.stack : void 0,
		...context
	});
}
var Toaster$1 = ({ ...props }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
		className: "toaster group",
		toastOptions: { classNames: {
			toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
			description: "group-[.toast]:text-muted-foreground",
			actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
			cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
		} },
		...props
	});
};
var NOT_FOUND_CATEGORIES = [
	{
		label: "Politics",
		slug: "politics"
	},
	{
		label: "Business",
		slug: "business"
	},
	{
		label: "Technology",
		slug: "technology"
	},
	{
		label: "Sports",
		slug: "sports"
	},
	{
		label: "Entertainment",
		slug: "entertainment"
	},
	{
		label: "International",
		slug: "international"
	}
];
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4 py-16",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-lg text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-serif text-7xl font-black text-[var(--ink)]",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold",
					children: "Page not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap items-center justify-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center bg-[var(--brand)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--brand)]/90",
						children: "Back to home"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/search",
						className: "inline-flex items-center justify-center border border-border px-4 py-2 text-sm font-semibold hover:bg-muted",
						children: "Search the site"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-10 border-t border-border pt-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-bold uppercase tracking-widest text-muted-foreground",
						children: "Or browse a section"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm",
						children: [NOT_FOUND_CATEGORIES.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/category/$slug",
							params: { slug: c.slug },
							className: "text-[var(--brand)] hover:underline",
							children: c.label
						}, c.slug)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/predictions",
							className: "text-[var(--brand)] hover:underline",
							children: "Predictions"
						})]
					})]
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		reportError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong on our end. You can try refreshing or head back home."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center bg-[var(--brand)] px-4 py-2 text-sm font-semibold text-white",
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "inline-flex items-center justify-center border border-input px-4 py-2 text-sm font-medium",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$39 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "The Dispatch — News, Analysis & Football Predictions" },
			{
				name: "description",
				content: "Independent reporting on politics, business, technology, and sport — plus expert football predictions and match analysis."
			},
			{
				property: "og:site_name",
				content: "The Dispatch"
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			}
		],
		links: [
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "icon",
				href: "/favicon.svg",
				type: "image/svg+xml"
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: ""
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@700;900&display=swap"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$39.useRouteContext();
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		const { data: sub } = supabase.auth.onAuthStateChange((event) => {
			if (event !== "SIGNED_IN" && event !== "SIGNED_OUT" && event !== "USER_UPDATED") return;
			router.invalidate();
			if (event !== "SIGNED_OUT") queryClient.invalidateQueries();
		});
		return () => sub.subscription.unsubscribe();
	}, [router, queryClient]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(QueryClientProvider, {
		client: queryClient,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster$1, {})]
	});
}
var $$splitComponentImporter$35 = () => import("./routes-DEOo4iLN.mjs");
var Route$38 = createFileRoute("/")({
	loader: async () => {
		const [featured, latest, mostRead, trending, categories] = await Promise.all([
			fetchFeaturedArticles(5),
			fetchPublishedArticles(12),
			fetchMostRead(5),
			fetchTrending(6),
			fetchCategories()
		]);
		return {
			featured,
			latest,
			mostRead,
			trending,
			categories
		};
	},
	component: lazyRouteComponent($$splitComponentImporter$35, "component")
});
var $$splitComponentImporter$34 = () => import("./route-Di7iQBCH.mjs");
var Route$37 = createFileRoute("/_authenticated")({
	ssr: false,
	beforeLoad: async () => {
		const { data, error } = await supabase.auth.getUser();
		if (error || !data.user) throw redirect({ to: "/auth" });
		return { user: data.user };
	},
	component: lazyRouteComponent($$splitComponentImporter$34, "component")
});
var $$splitComponentImporter$33 = () => import("./about-BolZi7Kc.mjs");
var Route$36 = createFileRoute("/about")({
	component: lazyRouteComponent($$splitComponentImporter$33, "component"),
	head: () => {
		const url = absoluteUrl("/about");
		const description = "The Dispatch is an independent newsroom covering politics, business, technology, sport and football predictions.";
		return {
			meta: [
				{ title: "About — The Dispatch" },
				{
					name: "description",
					content: description
				},
				{
					property: "og:title",
					content: "About The Dispatch"
				},
				{
					property: "og:description",
					content: description
				},
				{
					property: "og:url",
					content: url
				}
			],
			links: [{
				rel: "canonical",
				href: url
			}]
		};
	}
});
var $$splitComponentImporter$32 = () => import("./auth-Dvp1ooH_.mjs");
var Route$35 = createFileRoute("/auth")({
	component: lazyRouteComponent($$splitComponentImporter$32, "component"),
	head: () => ({ meta: [
		{ title: "Sign in — The Dispatch" },
		{
			name: "description",
			content: "Sign in to The Dispatch to publish, comment, and follow stories."
		},
		{
			name: "robots",
			content: "noindex"
		}
	] })
});
var $$splitComponentImporter$31 = () => import("./disclaimer-DurSoI-u.mjs");
var Route$34 = createFileRoute("/disclaimer")({
	component: lazyRouteComponent($$splitComponentImporter$31, "component"),
	head: () => {
		const url = absoluteUrl("/disclaimer");
		const description = "Important information about news accuracy and football predictions on The Dispatch.";
		return {
			meta: [
				{ title: "Disclaimer — The Dispatch" },
				{
					name: "description",
					content: description
				},
				{
					property: "og:title",
					content: "Disclaimer — The Dispatch"
				},
				{
					property: "og:description",
					content: description
				},
				{
					property: "og:url",
					content: url
				}
			],
			links: [{
				rel: "canonical",
				href: url
			}]
		};
	}
});
var $$splitComponentImporter$30 = () => import("./editorial-policy-Bv1lTi0n.mjs");
var Route$33 = createFileRoute("/editorial-policy")({
	component: lazyRouteComponent($$splitComponentImporter$30, "component"),
	head: () => {
		const url = absoluteUrl("/editorial-policy");
		const description = "How The Dispatch sources, verifies, and corrects its reporting.";
		return {
			meta: [
				{ title: "Editorial Policy — The Dispatch" },
				{
					name: "description",
					content: description
				},
				{
					property: "og:title",
					content: "Editorial Policy — The Dispatch"
				},
				{
					property: "og:description",
					content: description
				},
				{
					property: "og:url",
					content: url
				}
			],
			links: [{
				rel: "canonical",
				href: url
			}]
		};
	}
});
var $$splitComponentImporter$29 = () => import("./privacy-policy-CseS-Kln.mjs");
var Route$32 = createFileRoute("/privacy-policy")({
	component: lazyRouteComponent($$splitComponentImporter$29, "component"),
	head: () => {
		const url = absoluteUrl("/privacy-policy");
		const description = "How The Dispatch collects, stores and uses your information.";
		return {
			meta: [
				{ title: "Privacy Policy — The Dispatch" },
				{
					name: "description",
					content: description
				},
				{
					property: "og:title",
					content: "Privacy Policy — The Dispatch"
				},
				{
					property: "og:description",
					content: description
				},
				{
					property: "og:url",
					content: url
				}
			],
			links: [{
				rel: "canonical",
				href: url
			}]
		};
	}
});
function esc(s) {
	return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
var Route$31 = createFileRoute("/rss.xml")({ server: { handlers: { GET: async ({ request }) => {
	const origin = new URL(request.url).origin;
	const { data } = await supabaseAdmin.from("articles").select("title,slug,excerpt,published_at").eq("status", "published").order("published_at", { ascending: false }).limit(50);
	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>The Dispatch</title>
    <link>${origin}</link>
    <description>Breaking news, analysis and football predictions.</description>
    <language>en</language>
${(data ?? []).map((a) => [
		"    <item>",
		`      <title>${esc(a.title)}</title>`,
		`      <link>${origin}/article/${a.slug}</link>`,
		`      <guid isPermaLink="true">${origin}/article/${a.slug}</guid>`,
		a.excerpt ? `      <description>${esc(a.excerpt)}</description>` : "",
		a.published_at ? `      <pubDate>${new Date(a.published_at).toUTCString()}</pubDate>` : "",
		"    </item>"
	].filter(Boolean).join("\n")).join("\n")}
  </channel>
</rss>`;
	return new Response(xml, { headers: {
		"Content-Type": "application/rss+xml",
		"Cache-Control": "public, max-age=1800"
	} });
} } } });
var $$splitComponentImporter$28 = () => import("./search-D9M5xeTw.mjs");
var Route$30 = createFileRoute("/search")({
	component: lazyRouteComponent($$splitComponentImporter$28, "component"),
	validateSearch: (s) => ({ q: typeof s.q === "string" ? s.q : "" }),
	head: () => ({ meta: [
		{ title: "Search — The Dispatch" },
		{
			name: "description",
			content: "Search news, analysis and football predictions from The Dispatch."
		},
		{
			property: "og:title",
			content: "Search The Dispatch"
		},
		{
			property: "og:description",
			content: "Find news stories, analysis and football predictions."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary"
		},
		{
			name: "robots",
			content: "noindex"
		}
	] })
});
var Route$29 = createFileRoute("/sitemap.xml")({ server: { handlers: { GET: async ({ request }) => {
	const origin = getSiteUrl() ?? new URL(request.url).origin;
	const now = (/* @__PURE__ */ new Date()).toISOString();
	const [{ data: articles }, { data: predictions }, { data: categories }] = await Promise.all([
		supabase.from("articles").select("slug,updated_at,published_at").eq("status", "published").lte("published_at", now).order("published_at", { ascending: false }).limit(5e3),
		supabase.from("predictions").select("slug,updated_at").eq("is_published", true).limit(5e3),
		supabase.from("categories").select("slug,updated_at").eq("is_enabled", true)
	]);
	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[
		...[
			{
				loc: "/",
				priority: "1.0",
				changefreq: "hourly"
			},
			{
				loc: "/predictions",
				priority: "0.8",
				changefreq: "hourly"
			},
			{
				loc: "/search",
				priority: "0.3",
				changefreq: "monthly"
			}
		].map((u) => `<url><loc>${origin}${u.loc}</loc><changefreq>${u.changefreq}</changefreq><priority>${u.priority}</priority></url>`),
		...(categories ?? []).map((c) => `<url><loc>${origin}/category/${c.slug}</loc><lastmod>${new Date(c.updated_at).toISOString()}</lastmod><changefreq>daily</changefreq><priority>0.6</priority></url>`),
		...(articles ?? []).map((a) => `<url><loc>${origin}/article/${a.slug}</loc><lastmod>${new Date(a.updated_at).toISOString()}</lastmod><changefreq>weekly</changefreq><priority>0.7</priority></url>`),
		...(predictions ?? []).map((p) => `<url><loc>${origin}/predictions/${p.slug}</loc><lastmod>${new Date(p.updated_at).toISOString()}</lastmod><changefreq>daily</changefreq><priority>0.6</priority></url>`)
	].join("\n")}
</urlset>`;
	return new Response(xml, { headers: {
		"Content-Type": "application/xml; charset=utf-8",
		"Cache-Control": "public, max-age=600, s-maxage=600"
	} });
} } } });
var $$splitComponentImporter$27 = () => import("./terms-DQr1g-TN.mjs");
var Route$28 = createFileRoute("/terms")({
	component: lazyRouteComponent($$splitComponentImporter$27, "component"),
	head: () => {
		const url = absoluteUrl("/terms");
		const description = "Terms of use for The Dispatch website.";
		return {
			meta: [
				{ title: "Terms of Use — The Dispatch" },
				{
					name: "description",
					content: description
				},
				{
					property: "og:title",
					content: "Terms of Use — The Dispatch"
				},
				{
					property: "og:description",
					content: description
				},
				{
					property: "og:url",
					content: url
				}
			],
			links: [{
				rel: "canonical",
				href: url
			}]
		};
	}
});
var $$splitComponentImporter$26 = () => import("./admin-glCyULAd.mjs");
var Route$27 = createFileRoute("/_authenticated/admin")({ component: lazyRouteComponent($$splitComponentImporter$26, "component") });
var $$splitNotFoundComponentImporter$3 = () => import("./article._slug-CCof-qpZ.mjs");
var $$splitComponentImporter$25 = () => import("./article._slug-DEfdEW3U.mjs");
var Route$26 = createFileRoute("/article/$slug")({
	component: lazyRouteComponent($$splitComponentImporter$25, "component"),
	loader: async ({ params }) => {
		return { article: await fetchArticleBySlug(params.slug) };
	},
	head: ({ loaderData, params }) => {
		const a = loaderData?.article;
		if (!a) return { meta: [{ title: `${params.slug} — The Dispatch` }] };
		const title = a.seo_title?.trim() || `${a.title} — The Dispatch`;
		const description = a.seo_description?.trim() || a.excerpt?.trim() || "Read the full story on The Dispatch.";
		const image = a.featured_image ?? void 0;
		const url = absoluteUrl(`/article/${a.slug}`);
		return {
			meta: [
				{ title },
				{
					name: "description",
					content: description
				},
				{
					property: "og:type",
					content: "article"
				},
				{
					property: "og:site_name",
					content: "The Dispatch"
				},
				{
					property: "og:title",
					content: a.title
				},
				{
					property: "og:description",
					content: description
				},
				{
					property: "og:url",
					content: url
				},
				...image ? [{
					property: "og:image",
					content: image
				}] : [],
				{
					property: "article:published_time",
					content: a.published_at ?? a.created_at
				},
				{
					property: "article:modified_time",
					content: a.updated_at
				},
				...a.categories ? [{
					property: "article:section",
					content: a.categories.name
				}] : [],
				{
					name: "twitter:card",
					content: image ? "summary_large_image" : "summary"
				},
				{
					name: "twitter:title",
					content: a.title
				},
				{
					name: "twitter:description",
					content: description
				},
				...image ? [{
					name: "twitter:image",
					content: image
				}] : []
			],
			links: [{
				rel: "canonical",
				href: url
			}]
		};
	},
	notFoundComponent: lazyRouteComponent($$splitNotFoundComponentImporter$3, "notFoundComponent")
});
var $$splitNotFoundComponentImporter$2 = () => import("./authors._id-B3zQLRA4.mjs");
var $$splitComponentImporter$24 = () => import("./authors._id-BC-YiL9J.mjs");
var Route$25 = createFileRoute("/authors/$id")({
	component: lazyRouteComponent($$splitComponentImporter$24, "component"),
	loader: async ({ params }) => {
		return await fetchAuthorWithArticles(params.id);
	},
	head: ({ loaderData, params }) => {
		const url = absoluteUrl(`/authors/${params.id}`);
		const profile = loaderData?.profile;
		if (!profile) return {
			meta: [{ title: "Author — The Dispatch" }],
			links: [{
				rel: "canonical",
				href: url
			}]
		};
		const name = profile.display_name ?? "Staff";
		const description = profile.bio?.trim() || `Articles by ${name} on The Dispatch.`;
		return {
			meta: [
				{ title: `${name} — The Dispatch` },
				{
					name: "description",
					content: description
				},
				{
					property: "og:type",
					content: "profile"
				},
				{
					property: "og:site_name",
					content: "The Dispatch"
				},
				{
					property: "og:title",
					content: name
				},
				{
					property: "og:description",
					content: description
				},
				{
					property: "og:url",
					content: url
				}
			],
			links: [{
				rel: "canonical",
				href: url
			}]
		};
	},
	notFoundComponent: lazyRouteComponent($$splitNotFoundComponentImporter$2, "notFoundComponent")
});
var $$splitComponentImporter$23 = () => import("./category._slug-BmovBIXM.mjs");
var Route$24 = createFileRoute("/category/$slug")({
	component: lazyRouteComponent($$splitComponentImporter$23, "component"),
	loader: async ({ params }) => {
		return await fetchArticlesByCategory(params.slug);
	},
	head: ({ loaderData, params }) => {
		const cat = loaderData?.category;
		const name = cat?.name ?? cap(params.slug);
		const description = cat?.description?.trim() || `Latest ${name} news, analysis, and reporting from The Dispatch.`;
		const url = absoluteUrl(`/category/${params.slug}`);
		return {
			meta: [
				{ title: `${name} — The Dispatch` },
				{
					name: "description",
					content: description
				},
				{
					property: "og:type",
					content: "website"
				},
				{
					property: "og:site_name",
					content: "The Dispatch"
				},
				{
					property: "og:title",
					content: `${name} — The Dispatch`
				},
				{
					property: "og:description",
					content: description
				},
				{
					property: "og:url",
					content: url
				}
			],
			links: [{
				rel: "canonical",
				href: url
			}]
		};
	}
});
function cap(s) {
	return s.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}
var $$splitComponentImporter$22 = () => import("./predictions.index-0NfmGtb0.mjs");
var Route$23 = createFileRoute("/predictions/")({
	component: lazyRouteComponent($$splitComponentImporter$22, "component"),
	loader: async () => {
		const [predictions, stats] = await Promise.all([fetchPredictions({ limit: 500 }), fetchPredictionStats()]);
		return {
			predictions,
			stats
		};
	},
	head: () => {
		const url = absoluteUrl("/predictions");
		return {
			meta: [
				{ title: "Football Tips Today — Free Predictions | The Dispatch" },
				{
					name: "description",
					content: "Free football betting tips for today, tomorrow and the weekend. Match predictions, correct scores, form guides and odds across every major league."
				},
				{
					property: "og:site_name",
					content: "The Dispatch"
				},
				{
					property: "og:title",
					content: "Football Tips Today — Free Predictions"
				},
				{
					property: "og:description",
					content: "Free football predictions, correct scores and form guides from The Dispatch."
				},
				{
					property: "og:type",
					content: "website"
				},
				{
					property: "og:url",
					content: url
				},
				{
					name: "twitter:card",
					content: "summary_large_image"
				}
			],
			links: [{
				rel: "canonical",
				href: url
			}]
		};
	}
});
var $$splitNotFoundComponentImporter$1 = () => import("./predictions._slug-D_POBv01.mjs");
var $$splitComponentImporter$21 = () => import("./predictions._slug-Du9KmxRu.mjs");
var Route$22 = createFileRoute("/predictions/$slug")({
	component: lazyRouteComponent($$splitComponentImporter$21, "component"),
	loader: async ({ params }) => {
		return { prediction: await fetchPredictionBySlug(params.slug) };
	},
	head: ({ loaderData, params }) => {
		const p = loaderData?.prediction;
		const url = absoluteUrl(`/predictions/${params.slug}`);
		if (!p) return {
			meta: [{ title: `Prediction — The Dispatch` }],
			links: [{
				rel: "canonical",
				href: url
			}]
		};
		const matchName = `${p.matches?.home_team?.name ?? "?"} vs ${p.matches?.away_team?.name ?? "?"}`;
		const title = p.seo_title?.trim() || `${p.title} — Prediction | The Dispatch`;
		const description = p.seo_description?.trim() || `Our tip for ${matchName}: ${p.tip}. Full match preview, form guide and head-to-head record.`;
		return {
			meta: [
				{ title },
				{
					name: "description",
					content: description
				},
				{
					property: "og:type",
					content: "article"
				},
				{
					property: "og:site_name",
					content: "The Dispatch"
				},
				{
					property: "og:title",
					content: p.title
				},
				{
					property: "og:description",
					content: description
				},
				{
					property: "og:url",
					content: url
				},
				{
					name: "twitter:card",
					content: "summary_large_image"
				},
				{
					name: "twitter:title",
					content: p.title
				},
				{
					name: "twitter:description",
					content: description
				}
			],
			links: [{
				rel: "canonical",
				href: url
			}]
		};
	},
	notFoundComponent: lazyRouteComponent($$splitNotFoundComponentImporter$1, "notFoundComponent")
});
var $$splitNotFoundComponentImporter = () => import("./teams._slug-CIN-mysl.mjs");
var $$splitComponentImporter$20 = () => import("./teams._slug-3LacieTJ.mjs");
var Route$21 = createFileRoute("/teams/$slug")({
	component: lazyRouteComponent($$splitComponentImporter$20, "component"),
	head: ({ params }) => {
		const name = params.slug.replace(/-\d+$/, "").replace(/-/g, " ");
		const title = `${name} stats, form & fixtures — The Dispatch`;
		const description = `${name} team stats: recent form, win rate, goals scored and conceded, clean sheets, BTTS and over 2.5 trends plus upcoming fixtures.`;
		return {
			meta: [
				{ title },
				{
					name: "description",
					content: description
				},
				{
					property: "og:title",
					content: title
				},
				{
					property: "og:description",
					content: description
				},
				{
					property: "og:type",
					content: "website"
				},
				{
					name: "twitter:card",
					content: "summary_large_image"
				}
			],
			links: [{
				rel: "canonical",
				href: `/teams/${params.slug}`
			}]
		};
	},
	notFoundComponent: lazyRouteComponent($$splitNotFoundComponentImporter, "notFoundComponent")
});
var $$splitComponentImporter$19 = () => import("./admin.index-CPQHuyKo.mjs");
var Route$20 = createFileRoute("/_authenticated/admin/")({ component: lazyRouteComponent($$splitComponentImporter$19, "component") });
var $$splitComponentImporter$18 = () => import("./admin.ads-B7iOS7Uy.mjs");
var Route$19 = createFileRoute("/_authenticated/admin/ads")({ component: lazyRouteComponent($$splitComponentImporter$18, "component") });
var $$splitComponentImporter$17 = () => import("./admin.analytics-DpTtOS9e.mjs");
var Route$18 = createFileRoute("/_authenticated/admin/analytics")({ component: lazyRouteComponent($$splitComponentImporter$17, "component") });
var $$splitComponentImporter$16 = () => import("./admin.articles-DPhgaqoq.mjs");
var Route$17 = createFileRoute("/_authenticated/admin/articles")({ component: lazyRouteComponent($$splitComponentImporter$16, "component") });
var $$splitComponentImporter$15 = () => import("./admin.categories-CAHLin9q.mjs");
var Route$16 = createFileRoute("/_authenticated/admin/categories")({ component: lazyRouteComponent($$splitComponentImporter$15, "component") });
var $$splitComponentImporter$14 = () => import("./admin.comments-BTePy-dH.mjs");
var Route$15 = createFileRoute("/_authenticated/admin/comments")({ component: lazyRouteComponent($$splitComponentImporter$14, "component") });
var $$splitComponentImporter$13 = () => import("./admin.football-H9ie8K9p.mjs");
var Route$14 = createFileRoute("/_authenticated/admin/football")({ component: lazyRouteComponent($$splitComponentImporter$13, "component") });
var $$splitComponentImporter$12 = () => import("./admin.leagues-DoOikndV.mjs");
var Route$13 = createFileRoute("/_authenticated/admin/leagues")({ component: lazyRouteComponent($$splitComponentImporter$12, "component") });
var $$splitComponentImporter$11 = () => import("./admin.media-CONFpfwb.mjs");
var Route$12 = createFileRoute("/_authenticated/admin/media")({ component: lazyRouteComponent($$splitComponentImporter$11, "component") });
var $$splitComponentImporter$10 = () => import("./admin.newsletter-DrEmt4Wp.mjs");
var Route$11 = createFileRoute("/_authenticated/admin/newsletter")({ component: lazyRouteComponent($$splitComponentImporter$10, "component") });
var $$splitComponentImporter$9 = () => import("./admin.predictions-C4Es82GW.mjs");
var Route$10 = createFileRoute("/_authenticated/admin/predictions")({ component: lazyRouteComponent($$splitComponentImporter$9, "component") });
var $$splitComponentImporter$8 = () => import("./admin.settings-ClrB1xDu.mjs");
var Route$9 = createFileRoute("/_authenticated/admin/settings")({ component: lazyRouteComponent($$splitComponentImporter$8, "component") });
var $$splitComponentImporter$7 = () => import("./admin.users-8dgje0H-.mjs");
var Route$8 = createFileRoute("/_authenticated/admin/users")({ component: lazyRouteComponent($$splitComponentImporter$7, "component") });
var $$splitComponentImporter$6 = () => import("./admin.articles.index-BJQ4OeFx.mjs");
var Route$7 = createFileRoute("/_authenticated/admin/articles/")({ component: lazyRouteComponent($$splitComponentImporter$6, "component") });
var $$splitComponentImporter$5 = () => import("./admin.articles._id-27OSTIVj.mjs");
var Route$6 = createFileRoute("/_authenticated/admin/articles/$id")({ component: lazyRouteComponent($$splitComponentImporter$5, "component") });
function ImageView({ node, updateAttributes, selected }) {
	const ref = (0, import_react.useRef)(null);
	const align = node.attrs.align || "center";
	const startResize = (e) => {
		e.preventDefault();
		e.stopPropagation();
		const img = ref.current;
		if (!img) return;
		const startX = e.clientX;
		const startWidth = img.offsetWidth;
		const move = (ev) => {
			const next = Math.max(80, startWidth + (ev.clientX - startX));
			updateAttributes({ width: Math.round(next) });
		};
		const up = () => {
			window.removeEventListener("mousemove", move);
			window.removeEventListener("mouseup", up);
		};
		window.addEventListener("mousemove", move);
		window.addEventListener("mouseup", up);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NodeViewWrapper, {
		className: `my-4 flex ${align === "left" ? "justify-start" : align === "right" ? "justify-end" : "justify-center"}`,
		"data-drag-handle": true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative inline-block",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					ref,
					src: node.attrs.src,
					alt: node.attrs.alt ?? "",
					title: node.attrs.title ?? void 0,
					style: { width: node.attrs.width ? `${node.attrs.width}px` : void 0 },
					className: `max-w-full ${selected ? "outline outline-2 outline-[var(--brand)]" : ""}`,
					draggable: false
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "pointer-events-none absolute left-1 top-1 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100 [div:hover>&]:opacity-100",
					children: [
						"left",
						"center",
						"right"
					].map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onMouseDown: (e) => {
							e.preventDefault();
							updateAttributes({ align: a });
						},
						className: `pointer-events-auto rounded bg-[var(--ink)]/80 px-2 py-0.5 text-[10px] uppercase text-white ${align === a ? "bg-[var(--brand)]" : ""}`,
						children: a
					}, a))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					onMouseDown: startResize,
					className: "absolute -bottom-1 -right-1 h-4 w-4 cursor-nwse-resize rounded-sm border-2 border-background bg-[var(--brand)]",
					title: "Drag to resize"
				})
			]
		})
	});
}
var ResizableImage = index_default$3.extend({
	addAttributes() {
		return {
			...this.parent?.(),
			width: {
				default: null,
				parseHTML: (el) => {
					const w = el.getAttribute("width");
					return w ? parseInt(w, 10) : null;
				},
				renderHTML: (attrs) => attrs.width ? {
					width: attrs.width,
					style: `width:${attrs.width}px`
				} : {}
			},
			align: {
				default: "center",
				parseHTML: (el) => el.getAttribute("data-align") || "center",
				renderHTML: (attrs) => ({ "data-align": attrs.align })
			}
		};
	},
	addNodeView() {
		return ReactNodeViewRenderer(ImageView);
	}
});
function RichTextEditor({ value, onChange, placeholder = "Start writing…" }) {
	const editor = useEditor({
		extensions: [
			index_default$1,
			ResizableImage.configure({ inline: false }),
			index_default.configure({
				openOnClick: false,
				HTMLAttributes: { rel: "noopener" }
			}),
			index_default$2.configure({ types: ["heading", "paragraph"] })
		],
		content: value,
		editorProps: { attributes: {
			class: "tiptap article-prose",
			"data-placeholder": placeholder
		} },
		onUpdate: ({ editor }) => onChange(editor.getHTML()),
		immediatelyRender: false
	});
	(0, import_react.useEffect)(() => {
		if (editor && value !== editor.getHTML()) editor.commands.setContent(value || "");
	}, [value, editor]);
	if (!editor) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "border border-border p-4 text-muted-foreground",
		children: "Loading editor…"
	});
	const btn = "p-2 hover:bg-muted rounded";
	const active = "bg-[var(--ink)] text-white hover:bg-[var(--ink)]";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative border border-border bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center gap-1 border-b border-border p-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => editor.chain().focus().toggleBold().run(),
						className: `${btn} ${editor.isActive("bold") ? active : ""}`,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bold, { size: 16 })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => editor.chain().focus().toggleItalic().run(),
						className: `${btn} ${editor.isActive("italic") ? active : ""}`,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Italic, { size: 16 })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "mx-1 h-5 w-px bg-border" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
						className: `${btn} ${editor.isActive("heading", { level: 2 }) ? active : ""}`,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading2, { size: 16 })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
						className: `${btn} ${editor.isActive("heading", { level: 3 }) ? active : ""}`,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading3, { size: 16 })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "mx-1 h-5 w-px bg-border" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => editor.chain().focus().setTextAlign("left").run(),
						className: `${btn} ${editor.isActive({ textAlign: "left" }) ? active : ""}`,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextAlignStart, { size: 16 })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => editor.chain().focus().setTextAlign("center").run(),
						className: `${btn} ${editor.isActive({ textAlign: "center" }) ? active : ""}`,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextAlignCenter, { size: 16 })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => editor.chain().focus().setTextAlign("right").run(),
						className: `${btn} ${editor.isActive({ textAlign: "right" }) ? active : ""}`,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextAlignEnd, { size: 16 })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "mx-1 h-5 w-px bg-border" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => editor.chain().focus().toggleBulletList().run(),
						className: `${btn} ${editor.isActive("bulletList") ? active : ""}`,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(List, { size: 16 })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => editor.chain().focus().toggleOrderedList().run(),
						className: `${btn} ${editor.isActive("orderedList") ? active : ""}`,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListOrdered, { size: 16 })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => editor.chain().focus().toggleBlockquote().run(),
						className: `${btn} ${editor.isActive("blockquote") ? active : ""}`,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Quote, { size: 16 })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => editor.chain().focus().setHorizontalRule().run(),
						className: btn,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minus, { size: 16 })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "mx-1 h-5 w-px bg-border" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => {
							const url = prompt("Link URL");
							if (url) editor.chain().focus().setLink({ href: url }).run();
						},
						className: btn,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, { size: 16 })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => {
							const url = prompt("Image URL");
							if (url) editor.chain().focus().setImage({ src: url }).run();
						},
						className: btn,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image, { size: 16 })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "mx-1 h-5 w-px bg-border" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => editor.chain().focus().undo().run(),
						className: btn,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Undo, { size: 16 })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => editor.chain().focus().redo().run(),
						className: btn,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Redo, { size: 16 })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "ml-auto hidden text-[11px] text-muted-foreground sm:block",
						children: "Drag the handle to move blocks · drag an image corner to resize"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DragHandle, {
				editor,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex cursor-grab items-center rounded bg-muted p-1 text-muted-foreground hover:bg-[var(--brand)] hover:text-white active:cursor-grabbing",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GripVertical, { size: 14 })
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EditorContent, { editor })
		]
	});
}
var Input = import_react.forwardRef(({ className, type, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		type,
		className: cn("flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm", className),
		ref,
		...props
	});
});
Input.displayName = "Input";
var labelVariants = cva("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70");
var Label = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Root, {
	ref,
	className: cn(labelVariants(), className),
	...props
}));
Label.displayName = Root.displayName;
var Textarea = import_react.forwardRef(({ className, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
		className: cn("flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm", className),
		ref,
		...props
	});
});
Textarea.displayName = "Textarea";
var $$splitComponentImporter$4 = () => import("./admin.articles.new-Dwo9N37k.mjs");
var Route$5 = createFileRoute("/_authenticated/admin/articles/new")({ component: lazyRouteComponent($$splitComponentImporter$4, "component") });
function ArticleForm(props) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4 border border-border bg-background p-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
				htmlFor: "title",
				children: "Title"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				id: "title",
				value: props.title,
				onChange: (e) => {
					props.setTitle(e.target.value);
					if (!props.slug) props.setSlug(slugify(e.target.value));
				},
				className: "text-xl font-semibold",
				placeholder: "Headline"
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 md:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					htmlFor: "slug",
					children: "Slug"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					id: "slug",
					value: props.slug,
					onChange: (e) => props.setSlug(slugify(e.target.value)),
					placeholder: "url-slug"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					htmlFor: "cat",
					children: "Category"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
					id: "cat",
					value: props.categoryId,
					onChange: (e) => props.setCategoryId(e.target.value),
					className: "h-10 w-full border border-input bg-background px-3 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "",
						children: "Uncategorized"
					}), props.categories.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: c.id,
						children: c.name
					}, c.id))]
				})] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
				htmlFor: "excerpt",
				children: "Excerpt"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
				id: "excerpt",
				value: props.excerpt,
				onChange: (e) => props.setExcerpt(e.target.value),
				rows: 2,
				placeholder: "Short summary shown in feed cards"
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					htmlFor: "img",
					children: "Featured image URL"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					id: "img",
					value: props.featuredImage,
					onChange: (e) => props.setFeaturedImage(e.target.value),
					placeholder: "https://…"
				}),
				props.featuredImage && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: props.featuredImage,
					alt: "",
					className: "mt-2 max-h-40 rounded border border-border object-cover"
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Content" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RichTextEditor, {
				value: props.content,
				onChange: props.setContent
			})] })
		]
	});
}
var $$splitComponentImporter$3 = () => import("./admin.predictions.index-CYxKtCNy.mjs");
var Route$4 = createFileRoute("/_authenticated/admin/predictions/")({ component: lazyRouteComponent($$splitComponentImporter$3, "component") });
var $$splitComponentImporter$2 = () => import("./admin.predictions._id-DhMm0cle.mjs");
var Route$3 = createFileRoute("/_authenticated/admin/predictions/$id")({ component: lazyRouteComponent($$splitComponentImporter$2, "component") });
var $$splitComponentImporter$1 = () => import("./admin.predictions.board-BjLpCViY.mjs");
var Route$2 = createFileRoute("/_authenticated/admin/predictions/board")({ component: lazyRouteComponent($$splitComponentImporter$1, "component") });
var $$splitComponentImporter = () => import("./admin.predictions.new-C6IEorys.mjs");
var Route$1 = createFileRoute("/_authenticated/admin/predictions/new")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
var Route = createFileRoute("/api/public/hooks/football-sync")({ server: { handlers: { POST: async () => {
	try {
		const { syncFixtures, settleResults } = await import("./football-sync.server-CgSCTqRZ.mjs");
		const synced = await syncFixtures(10);
		const settled = await settleResults();
		return Response.json({
			ok: true,
			synced,
			settled
		});
	} catch (e) {
		console.error("[football-sync]", e);
		return Response.json({
			ok: false,
			error: String(e)
		}, { status: 500 });
	}
} } } });
var IndexRoute = Route$38.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$39
});
var AuthenticatedRouteRoute = Route$37.update({
	id: "/_authenticated",
	getParentRoute: () => Route$39
});
var AboutRoute = Route$36.update({
	id: "/about",
	path: "/about",
	getParentRoute: () => Route$39
});
var AuthRoute = Route$35.update({
	id: "/auth",
	path: "/auth",
	getParentRoute: () => Route$39
});
var DisclaimerRoute = Route$34.update({
	id: "/disclaimer",
	path: "/disclaimer",
	getParentRoute: () => Route$39
});
var EditorialPolicyRoute = Route$33.update({
	id: "/editorial-policy",
	path: "/editorial-policy",
	getParentRoute: () => Route$39
});
var PrivacyPolicyRoute = Route$32.update({
	id: "/privacy-policy",
	path: "/privacy-policy",
	getParentRoute: () => Route$39
});
var RssDotxmlRoute = Route$31.update({
	id: "/rss.xml",
	path: "/rss.xml",
	getParentRoute: () => Route$39
});
var SearchRoute = Route$30.update({
	id: "/search",
	path: "/search",
	getParentRoute: () => Route$39
});
var SitemapDotxmlRoute = Route$29.update({
	id: "/sitemap.xml",
	path: "/sitemap.xml",
	getParentRoute: () => Route$39
});
var TermsRoute = Route$28.update({
	id: "/terms",
	path: "/terms",
	getParentRoute: () => Route$39
});
var AuthenticatedAdminRoute = Route$27.update({
	id: "/admin",
	path: "/admin",
	getParentRoute: () => AuthenticatedRouteRoute
});
var ArticleSlugRoute = Route$26.update({
	id: "/article/$slug",
	path: "/article/$slug",
	getParentRoute: () => Route$39
});
var AuthorsIdRoute = Route$25.update({
	id: "/authors/$id",
	path: "/authors/$id",
	getParentRoute: () => Route$39
});
var CategorySlugRoute = Route$24.update({
	id: "/category/$slug",
	path: "/category/$slug",
	getParentRoute: () => Route$39
});
var PredictionsIndexRoute = Route$23.update({
	id: "/predictions/",
	path: "/predictions/",
	getParentRoute: () => Route$39
});
var PredictionsSlugRoute = Route$22.update({
	id: "/predictions/$slug",
	path: "/predictions/$slug",
	getParentRoute: () => Route$39
});
var TeamsSlugRoute = Route$21.update({
	id: "/teams/$slug",
	path: "/teams/$slug",
	getParentRoute: () => Route$39
});
var AuthenticatedAdminIndexRoute = Route$20.update({
	id: "/",
	path: "/",
	getParentRoute: () => AuthenticatedAdminRoute
});
var AuthenticatedAdminAdsRoute = Route$19.update({
	id: "/ads",
	path: "/ads",
	getParentRoute: () => AuthenticatedAdminRoute
});
var AuthenticatedAdminAnalyticsRoute = Route$18.update({
	id: "/analytics",
	path: "/analytics",
	getParentRoute: () => AuthenticatedAdminRoute
});
var AuthenticatedAdminArticlesRoute = Route$17.update({
	id: "/articles",
	path: "/articles",
	getParentRoute: () => AuthenticatedAdminRoute
});
var AuthenticatedAdminCategoriesRoute = Route$16.update({
	id: "/categories",
	path: "/categories",
	getParentRoute: () => AuthenticatedAdminRoute
});
var AuthenticatedAdminCommentsRoute = Route$15.update({
	id: "/comments",
	path: "/comments",
	getParentRoute: () => AuthenticatedAdminRoute
});
var AuthenticatedAdminFootballRoute = Route$14.update({
	id: "/football",
	path: "/football",
	getParentRoute: () => AuthenticatedAdminRoute
});
var AuthenticatedAdminLeaguesRoute = Route$13.update({
	id: "/leagues",
	path: "/leagues",
	getParentRoute: () => AuthenticatedAdminRoute
});
var AuthenticatedAdminMediaRoute = Route$12.update({
	id: "/media",
	path: "/media",
	getParentRoute: () => AuthenticatedAdminRoute
});
var AuthenticatedAdminNewsletterRoute = Route$11.update({
	id: "/newsletter",
	path: "/newsletter",
	getParentRoute: () => AuthenticatedAdminRoute
});
var AuthenticatedAdminPredictionsRoute = Route$10.update({
	id: "/predictions",
	path: "/predictions",
	getParentRoute: () => AuthenticatedAdminRoute
});
var AuthenticatedAdminSettingsRoute = Route$9.update({
	id: "/settings",
	path: "/settings",
	getParentRoute: () => AuthenticatedAdminRoute
});
var AuthenticatedAdminUsersRoute = Route$8.update({
	id: "/users",
	path: "/users",
	getParentRoute: () => AuthenticatedAdminRoute
});
var AuthenticatedAdminArticlesIndexRoute = Route$7.update({
	id: "/",
	path: "/",
	getParentRoute: () => AuthenticatedAdminArticlesRoute
});
var AuthenticatedAdminArticlesIdRoute = Route$6.update({
	id: "/$id",
	path: "/$id",
	getParentRoute: () => AuthenticatedAdminArticlesRoute
});
var AuthenticatedAdminArticlesNewRoute = Route$5.update({
	id: "/new",
	path: "/new",
	getParentRoute: () => AuthenticatedAdminArticlesRoute
});
var AuthenticatedAdminPredictionsIndexRoute = Route$4.update({
	id: "/",
	path: "/",
	getParentRoute: () => AuthenticatedAdminPredictionsRoute
});
var AuthenticatedAdminPredictionsIdRoute = Route$3.update({
	id: "/$id",
	path: "/$id",
	getParentRoute: () => AuthenticatedAdminPredictionsRoute
});
var AuthenticatedAdminPredictionsBoardRoute = Route$2.update({
	id: "/board",
	path: "/board",
	getParentRoute: () => AuthenticatedAdminPredictionsRoute
});
var AuthenticatedAdminPredictionsNewRoute = Route$1.update({
	id: "/new",
	path: "/new",
	getParentRoute: () => AuthenticatedAdminPredictionsRoute
});
var ApiPublicHooksFootballSyncRoute = Route.update({
	id: "/api/public/hooks/football-sync",
	path: "/api/public/hooks/football-sync",
	getParentRoute: () => Route$39
});
var AuthenticatedAdminArticlesRouteChildren = {
	AuthenticatedAdminArticlesIdRoute,
	AuthenticatedAdminArticlesNewRoute,
	AuthenticatedAdminArticlesIndexRoute
};
var AuthenticatedAdminArticlesRouteWithChildren = AuthenticatedAdminArticlesRoute._addFileChildren(AuthenticatedAdminArticlesRouteChildren);
var AuthenticatedAdminPredictionsRouteChildren = {
	AuthenticatedAdminPredictionsIdRoute,
	AuthenticatedAdminPredictionsBoardRoute,
	AuthenticatedAdminPredictionsNewRoute,
	AuthenticatedAdminPredictionsIndexRoute
};
var AuthenticatedAdminRouteChildren = {
	AuthenticatedAdminAdsRoute,
	AuthenticatedAdminAnalyticsRoute,
	AuthenticatedAdminArticlesRoute: AuthenticatedAdminArticlesRouteWithChildren,
	AuthenticatedAdminCategoriesRoute,
	AuthenticatedAdminCommentsRoute,
	AuthenticatedAdminFootballRoute,
	AuthenticatedAdminLeaguesRoute,
	AuthenticatedAdminMediaRoute,
	AuthenticatedAdminNewsletterRoute,
	AuthenticatedAdminPredictionsRoute: AuthenticatedAdminPredictionsRoute._addFileChildren(AuthenticatedAdminPredictionsRouteChildren),
	AuthenticatedAdminSettingsRoute,
	AuthenticatedAdminUsersRoute,
	AuthenticatedAdminIndexRoute
};
var AuthenticatedRouteRouteChildren = { AuthenticatedAdminRoute: AuthenticatedAdminRoute._addFileChildren(AuthenticatedAdminRouteChildren) };
var rootRouteChildren = {
	IndexRoute,
	AuthenticatedRouteRoute: AuthenticatedRouteRoute._addFileChildren(AuthenticatedRouteRouteChildren),
	AboutRoute,
	AuthRoute,
	DisclaimerRoute,
	EditorialPolicyRoute,
	PrivacyPolicyRoute,
	RssDotxmlRoute,
	SearchRoute,
	SitemapDotxmlRoute,
	TermsRoute,
	ArticleSlugRoute,
	AuthorsIdRoute,
	CategorySlugRoute,
	PredictionsSlugRoute,
	TeamsSlugRoute,
	PredictionsIndexRoute,
	ApiPublicHooksFootballSyncRoute
};
var routeTree = Route$39._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll$1({ getRouter: () => getRouter });
var getRouter = () => {
	const queryClient = new QueryClient();
	return createRouter({
		routeTree,
		context: { queryClient },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { absoluteUrl as _, Route$21 as a, Route$24 as c, Route$3 as d, Route$30 as f, router_C9TCD_gT_exports as g, Textarea as h, RichTextEditor as i, Route$25 as l, Route$6 as m, Input as n, Route$22 as o, Route$38 as p, Label as r, Route$23 as s, ArticleForm as t, Route$26 as u };
