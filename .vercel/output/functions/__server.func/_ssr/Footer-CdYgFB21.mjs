import { i as __toESM } from "../_runtime.mjs";
import { i as fetchCategories } from "./queries-BfatjlGT.mjs";
import { d as subscribeToNewsletter } from "./site-D9u_L-Ue.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { g as Menu, t as X, u as Search } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/Footer-CdYgFB21.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Header() {
	const [open, setOpen] = (0, import_react.useState)(false);
	const [now, setNow] = (0, import_react.useState)(/* @__PURE__ */ new Date());
	const navCategories = useQuery({
		queryKey: ["nav-categories"],
		queryFn: fetchCategories
	}).data ?? [];
	(0, import_react.useEffect)(() => {
		const t = setInterval(() => setNow(/* @__PURE__ */ new Date()), 6e4);
		return () => clearInterval(t);
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "border-b border-border bg-background",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "border-b border-border bg-[var(--ink)] text-white/80 text-xs",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "container-page flex h-8 items-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: now.toLocaleDateString("en-US", {
					weekday: "long",
					month: "long",
					day: "numeric",
					year: "numeric"
				}) })
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "sticky top-0 z-40 border-b border-border bg-background",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "container-page flex items-center justify-between py-3 md:py-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "md:hidden",
							onClick: () => setOpen(!open),
							"aria-label": "Menu",
							children: open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { size: 22 }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { size: 22 })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/",
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "inline-block h-7 w-2 bg-[var(--brand)]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-serif text-2xl font-black tracking-tight text-[var(--ink)] md:text-3xl",
								children: "The Dispatch"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/search",
							"aria-label": "Search",
							className: "p-2 hover:text-[var(--brand)]",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { size: 20 })
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
					className: "hidden border-t border-border md:block",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "container-page flex items-center gap-6 overflow-x-auto py-3 text-sm font-semibold uppercase tracking-wide",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/",
								className: "text-[var(--ink)] hover:text-[var(--brand)]",
								activeOptions: { exact: true },
								activeProps: { className: "text-[var(--brand)]" },
								children: "Home"
							}),
							navCategories.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/category/$slug",
								params: { slug: c.slug },
								className: "text-[var(--ink)] hover:text-[var(--brand)] whitespace-nowrap",
								activeProps: { className: "text-[var(--brand)]" },
								children: c.name
							}, c.id)),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/predictions",
								className: "text-[var(--ink)] hover:text-[var(--brand)] whitespace-nowrap",
								activeProps: { className: "text-[var(--brand)]" },
								children: "Predictions"
							})
						]
					})
				}),
				open && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
					className: "md:hidden border-t border-border",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "container-page flex flex-col py-3 text-sm font-semibold",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/",
								onClick: () => setOpen(false),
								className: "py-2",
								children: "Home"
							}),
							navCategories.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/category/$slug",
								params: { slug: c.slug },
								onClick: () => setOpen(false),
								className: "py-2",
								children: c.name
							}, c.id)),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/predictions",
								onClick: () => setOpen(false),
								className: "py-2",
								children: "Predictions"
							})
						]
					})
				})
			]
		})]
	});
}
function NewsletterForm({ source = "footer", variant = "dark" }) {
	const [email, setEmail] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [done, setDone] = (0, import_react.useState)(false);
	const submit = async (e) => {
		e.preventDefault();
		setBusy(true);
		try {
			const res = await subscribeToNewsletter(email, source);
			setDone(true);
			toast.success(res.alreadySubscribed ? "You're already subscribed" : "Thanks for subscribing!");
			setEmail("");
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Subscription failed");
		} finally {
			setBusy(false);
		}
	};
	if (done) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: variant === "dark" ? "text-sm text-white/80" : "text-sm text-muted-foreground",
		children: "✓ You're on the list. Watch your inbox for the daily brief."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		onSubmit: submit,
		className: "flex",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			type: "email",
			required: true,
			value: email,
			onChange: (e) => setEmail(e.target.value),
			maxLength: 254,
			placeholder: "you@email.com",
			"aria-label": "Email address",
			className: variant === "dark" ? "flex-1 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/50 focus:outline-none" : "flex-1 border border-input bg-background px-3 py-2 text-sm focus:outline-none"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "submit",
			disabled: busy,
			className: "bg-[var(--brand)] px-4 text-sm font-semibold text-white disabled:opacity-60",
			children: busy ? "…" : "Join"
		})]
	});
}
function Footer() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
		className: "mt-16 border-t border-border bg-[var(--ink)] text-white/80",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "container-page grid gap-10 py-12 md:grid-cols-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "inline-block h-6 w-1.5 bg-[var(--brand)]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-serif text-2xl font-black text-white",
						children: "The Dispatch"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 max-w-xs text-sm",
					children: "Independent reporting on the stories shaping our world — politics, business, sport, and beyond."
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
					className: "mb-3 text-xs font-bold uppercase tracking-widest text-white",
					children: "Sections"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
					className: "space-y-2 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/category/$slug",
							params: { slug: "politics" },
							children: "Politics"
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/category/$slug",
							params: { slug: "business" },
							children: "Business"
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/category/$slug",
							params: { slug: "technology" },
							children: "Technology"
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/category/$slug",
							params: { slug: "sports" },
							children: "Sports"
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/predictions",
							children: "Football Predictions"
						}) })
					]
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
					className: "mb-3 text-xs font-bold uppercase tracking-widest text-white",
					children: "More"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
					className: "space-y-2 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/category/$slug",
							params: { slug: "entertainment" },
							children: "Entertainment"
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/category/$slug",
							params: { slug: "international" },
							children: "International"
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/category/$slug",
							params: { slug: "local-news" },
							children: "Local News"
						}) })
					]
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
					className: "mb-3 text-xs font-bold uppercase tracking-widest text-white",
					children: "About"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
					className: "space-y-2 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/about",
							children: "About Us"
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/contact",
							children: "Contact"
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/editorial-policy",
							children: "Editorial Policy"
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/disclaimer",
							children: "Disclaimer"
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/privacy-policy",
							children: "Privacy Policy"
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/terms",
							children: "Terms of Use"
						}) })
					]
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
						className: "mb-3 text-xs font-bold uppercase tracking-widest text-white",
						children: "Newsletter"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mb-3 text-sm",
						children: "Get the daily brief in your inbox."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NewsletterForm, { source: "footer" })
				] })
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "border-t border-white/10",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "container-page flex flex-col items-center justify-between gap-2 py-4 text-xs text-white/60 md:flex-row",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
					"© ",
					(/* @__PURE__ */ new Date()).getFullYear(),
					" The Dispatch. All rights reserved."
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Built with editorial integrity." }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/auth",
						className: "text-white/40 hover:text-white/70",
						children: "Staff Login"
					})]
				})]
			})
		})]
	});
}
//#endregion
export { Header as n, NewsletterForm as r, Footer as t };
