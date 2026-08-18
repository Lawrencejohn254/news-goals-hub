import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-CZsxps-O.mjs";
import { i as fetchCategories } from "./queries-BfatjlGT.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { i as slugify, n as readingTime } from "./format-CG3FEzEE.mjs";
import { h as Textarea, i as RichTextEditor, n as Input, r as Label } from "./router-C9TCD_gT.mjs";
import { t as Button } from "./button-BLZ6ednA.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.articles.new-Dwo9N37k.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function NewArticle() {
	const navigate = useNavigate();
	const cats = useQuery({
		queryKey: ["categories"],
		queryFn: fetchCategories
	});
	const [title, setTitle] = (0, import_react.useState)("");
	const [slug, setSlug] = (0, import_react.useState)("");
	const [excerpt, setExcerpt] = (0, import_react.useState)("");
	const [content, setContent] = (0, import_react.useState)("");
	const [featuredImage, setFeaturedImage] = (0, import_react.useState)("");
	const [categoryId, setCategoryId] = (0, import_react.useState)("");
	const [saving, setSaving] = (0, import_react.useState)(false);
	const save = async (status) => {
		if (!title.trim()) return toast.error("Title required");
		const { data: userData } = await supabase.auth.getUser();
		if (!userData.user) return toast.error("Not signed in");
		setSaving(true);
		const finalSlug = slug.trim() || slugify(title);
		const { data, error } = await supabase.from("articles").insert({
			title: title.trim(),
			slug: finalSlug,
			excerpt: excerpt.trim() || null,
			content,
			featured_image: featuredImage.trim() || null,
			category_id: categoryId || null,
			author_id: userData.user.id,
			status,
			published_at: status === "published" ? (/* @__PURE__ */ new Date()).toISOString() : null,
			reading_time: readingTime(content)
		}).select("id").single();
		setSaving(false);
		if (error) return toast.error(error.message);
		toast.success(status === "published" ? "Published!" : "Draft saved");
		navigate({
			to: "/admin/articles/$id",
			params: { id: data.id }
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "mb-6 font-serif text-3xl font-black",
			children: "New article"
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
			className: "mt-6 flex gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "outline",
				onClick: () => save("draft"),
				disabled: saving,
				children: "Save draft"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				onClick: () => save("published"),
				disabled: saving,
				className: "bg-[var(--brand)] text-white hover:bg-[var(--brand)]/90",
				children: "Publish"
			})]
		})
	] });
}
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
//#endregion
export { ArticleForm, NewArticle as component };
