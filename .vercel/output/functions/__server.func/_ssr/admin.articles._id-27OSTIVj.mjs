import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-CZsxps-O.mjs";
import { i as fetchCategories } from "./queries-BfatjlGT.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { _ as Link, v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as readingTime } from "./format-CG3FEzEE.mjs";
import { m as Route$6, r as Label, t as ArticleForm } from "./router-C9TCD_gT.mjs";
import { t as Button } from "./button-BLZ6ednA.mjs";
import { t as Switch } from "./switch-Cn1w-cIH.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.articles._id-27OSTIVj.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function EditArticle() {
	const { id } = Route$6.useParams();
	useNavigate();
	const cats = useQuery({
		queryKey: ["categories"],
		queryFn: fetchCategories
	});
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [title, setTitle] = (0, import_react.useState)("");
	const [slug, setSlug] = (0, import_react.useState)("");
	const [excerpt, setExcerpt] = (0, import_react.useState)("");
	const [content, setContent] = (0, import_react.useState)("");
	const [featuredImage, setFeaturedImage] = (0, import_react.useState)("");
	const [categoryId, setCategoryId] = (0, import_react.useState)("");
	const [status, setStatus] = (0, import_react.useState)("draft");
	const [isFeatured, setIsFeatured] = (0, import_react.useState)(false);
	const [isPinned, setIsPinned] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		supabase.from("articles").select("*").eq("id", id).maybeSingle().then(({ data, error }) => {
			if (error) toast.error(error.message);
			if (data) {
				setTitle(data.title);
				setSlug(data.slug);
				setExcerpt(data.excerpt ?? "");
				setContent(data.content ?? "");
				setFeaturedImage(data.featured_image ?? "");
				setCategoryId(data.category_id ?? "");
				setStatus(data.status);
				setIsFeatured(data.is_featured);
				setIsPinned(data.is_pinned);
			}
			setLoading(false);
		});
	}, [id]);
	const save = async (newStatus) => {
		const s = newStatus ?? status;
		const { error } = await supabase.from("articles").update({
			title,
			slug,
			excerpt: excerpt || null,
			content,
			featured_image: featuredImage || null,
			category_id: categoryId || null,
			status: s,
			is_featured: isFeatured,
			is_pinned: isPinned,
			reading_time: readingTime(content),
			published_at: s === "published" ? (/* @__PURE__ */ new Date()).toISOString() : s === "draft" ? null : void 0
		}).eq("id", id);
		if (error) return toast.error(error.message);
		setStatus(s);
		toast.success("Saved");
	};
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-muted-foreground",
		children: "Loading…"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-6 flex items-center justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-serif text-3xl font-black",
				children: "Edit article"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex items-center gap-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/article/$slug",
					params: { slug },
					target: "_blank",
					className: "text-sm text-muted-foreground underline",
					children: "Preview"
				})
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArticleForm, {
			title,
			setTitle,
			slug,
			setSlug,
			excerpt,
			setExcerpt,
			content,
			setContent,
			featuredImage,
			setFeaturedImage,
			categoryId,
			setCategoryId,
			categories: cats.data ?? []
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-6 grid gap-4 border border-border bg-background p-6 md:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
					id: "feat",
					checked: isFeatured,
					onCheckedChange: setIsFeatured
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					htmlFor: "feat",
					children: "Featured (appears in Editor's Picks)"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
					id: "pin",
					checked: isPinned,
					onCheckedChange: setIsPinned
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					htmlFor: "pin",
					children: "Pinned to top of feed"
				})]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-6 flex flex-wrap gap-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					onClick: () => save(),
					children: "Save changes"
				}),
				status !== "published" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: () => save("published"),
					className: "bg-[var(--brand)] text-white hover:bg-[var(--brand)]/90",
					children: "Publish"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					onClick: () => save("draft"),
					children: "Unpublish"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					onClick: () => save("archived"),
					className: "text-muted-foreground",
					children: "Archive"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "ml-auto text-sm text-muted-foreground",
					children: ["Status: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-semibold uppercase",
						children: status
					})]
				})
			]
		})
	] });
}
//#endregion
export { EditArticle as component };
