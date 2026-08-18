import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-CZsxps-O.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { _ as Link, p as Outlet, v as useNavigate, x as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { r as useQueryClient } from "../_libs/tanstack__react-query.mjs";
import { C as LayoutDashboard, E as House, L as ArrowLeft, P as ChartColumn, T as Image, _ as Megaphone, c as Tag, g as Menu, h as MessageSquare, i as Trophy, l as Settings, n as Users, p as Newspaper, t as X, v as Mail, y as LogOut } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-glCyULAd.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminLayout() {
	const navigate = useNavigate();
	const router = useRouter();
	const qc = useQueryClient();
	const [roles, setRoles] = (0, import_react.useState)([]);
	const [email, setEmail] = (0, import_react.useState)(null);
	const [sidebarOpen, setSidebarOpen] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		supabase.auth.getUser().then(async ({ data }) => {
			setEmail(data.user?.email ?? null);
			if (data.user) {
				const { data: rows } = await supabase.from("user_roles").select("role").eq("user_id", data.user.id);
				setRoles((rows ?? []).map((r) => r.role));
			}
		});
	}, []);
	(0, import_react.useEffect)(() => {
		return router.subscribe("onResolved", () => setSidebarOpen(false));
	}, [router]);
	const isStaff = roles.some((r) => [
		"super_admin",
		"admin",
		"editor",
		"author",
		"moderator"
	].includes(r));
	const signOut = async () => {
		await qc.cancelQueries();
		qc.clear();
		await supabase.auth.signOut();
		router.invalidate();
		navigate({
			to: "/auth",
			replace: true
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen bg-[var(--paper)]",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex",
			children: [
				sidebarOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "fixed inset-0 z-40 bg-black/50 md:hidden",
					onClick: () => setSidebarOpen(false),
					"aria-hidden": "true"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
					className: "fixed inset-y-0 left-0 z-50 w-64 transform border-r border-border bg-background transition-transform duration-200 ease-in-out md:static md:z-auto md:w-60 md:shrink-0 md:translate-x-0 " + (sidebarOpen ? "translate-x-0" : "-translate-x-full"),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between border-b border-border p-5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/",
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "inline-block h-6 w-1.5 bg-[var(--brand)]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-serif text-lg font-black",
									children: "Dispatch"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setSidebarOpen(false),
								className: "text-muted-foreground hover:text-foreground md:hidden",
								"aria-label": "Close menu",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { size: 20 })
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "px-5 pt-3 text-xs text-muted-foreground",
							children: "Newsroom"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
							className: "flex flex-col p-3 text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavItem, {
									to: "/admin",
									icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LayoutDashboard, { size: 16 }),
									exact: true,
									children: "Dashboard"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavItem, {
									to: "/admin/articles",
									icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Newspaper, { size: 16 }),
									children: "Articles"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavItem, {
									to: "/admin/categories",
									icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, { size: 16 }),
									children: "Categories"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavItem, {
									to: "/admin/predictions",
									icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trophy, { size: 16 }),
									children: "Predictions"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavItem, {
									to: "/admin/football",
									icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trophy, { size: 16 }),
									children: "Football data"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavItem, {
									to: "/admin/leagues",
									icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trophy, { size: 16 }),
									children: "Leagues & sync"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavItem, {
									to: "/admin/media",
									icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image, { size: 16 }),
									children: "Media"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavItem, {
									to: "/admin/comments",
									icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquare, { size: 16 }),
									children: "Comments"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavItem, {
									to: "/admin/users",
									icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { size: 16 }),
									children: "Users"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavItem, {
									to: "/admin/ads",
									icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Megaphone, { size: 16 }),
									children: "Ads"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavItem, {
									to: "/admin/newsletter",
									icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { size: 16 }),
									children: "Newsletter"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavItem, {
									to: "/admin/analytics",
									icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartColumn, { size: 16 }),
									children: "Analytics"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavItem, {
									to: "/admin/settings",
									icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings, { size: 16 }),
									children: "Settings"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "my-2 border-t border-border" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavItem, {
									to: "/",
									icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(House, { size: 16 }),
									target: "_blank",
									rel: "noopener noreferrer",
									children: "View site"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: signOut,
									className: "mt-1 flex items-center gap-2 rounded px-3 py-2 text-left text-muted-foreground hover:bg-muted",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { size: 16 }), " Sign out"]
								})
							]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0 flex-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
							className: "flex items-center justify-between gap-3 border-b border-border bg-background px-4 py-4 md:px-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => setSidebarOpen(true),
									className: "text-foreground hover:text-[var(--brand)] md:hidden",
									"aria-label": "Open menu",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { size: 22 })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => router.history.back(),
									className: "text-muted-foreground hover:text-foreground",
									"aria-label": "Go back",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { size: 20 })
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "truncate text-right text-sm text-muted-foreground",
								children: [
									"Signed in as ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-semibold text-foreground",
										children: email
									}),
									roles.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "ml-2 rounded bg-muted px-2 py-0.5 text-xs",
										children: roles.join(", ")
									})
								]
							})]
						}),
						!isStaff && roles.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "m-6 border-l-4 border-[var(--brand)] bg-white p-4 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-semibold",
								children: "Awaiting editorial access"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-muted-foreground",
								children: [
									"Your account is a subscriber. Ask an admin to grant you the",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
										className: "rounded bg-muted px-1",
										children: "author"
									}),
									" or",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
										className: "rounded bg-muted px-1",
										children: "editor"
									}),
									" role via the",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
										className: "rounded bg-muted px-1",
										children: "user_roles"
									}),
									" table."
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "p-4 md:p-6",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
						})
					]
				})
			]
		})
	});
}
function NavItem({ to, icon, children, exact, target, rel }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to,
		activeOptions: { exact },
		className: "flex items-center gap-2 rounded px-3 py-2 text-foreground hover:bg-muted",
		activeProps: { className: "flex items-center gap-2 rounded px-3 py-2 bg-[var(--ink)] text-white hover:bg-[var(--ink)]" },
		target,
		rel,
		children: [
			icon,
			" ",
			children
		]
	});
}
//#endregion
export { AdminLayout as component };
