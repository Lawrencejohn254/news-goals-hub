import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-CZsxps-O.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { r as useQueryClient, t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { i as slugify } from "./format-CG3FEzEE.mjs";
import { n as Input, r as Label } from "./router-C9TCD_gT.mjs";
import { t as Button } from "./button-BLZ6ednA.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.categories-CAHLin9q.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CategoriesAdmin() {
	const qc = useQueryClient();
	const q = useQuery({
		queryKey: ["admin", "categories"],
		queryFn: async () => {
			const { data, error } = await supabase.from("categories").select("*").order("sort_order");
			if (error) throw error;
			return data ?? [];
		}
	});
	const [name, setName] = (0, import_react.useState)("");
	const [color, setColor] = (0, import_react.useState)("#dc2626");
	const add = async () => {
		if (!name.trim()) return;
		const { error } = await supabase.from("categories").insert({
			name: name.trim(),
			slug: slugify(name),
			color,
			sort_order: (q.data?.length ?? 0) + 1
		});
		if (error) toast.error(error.message);
		else {
			toast.success("Category added");
			setName("");
			qc.invalidateQueries({ queryKey: ["admin", "categories"] });
			qc.invalidateQueries({ queryKey: ["categories"] });
		}
	};
	const remove = async (id) => {
		if (!confirm("Delete this category?")) return;
		const { error } = await supabase.from("categories").delete().eq("id", id);
		if (error) toast.error(error.message);
		else {
			toast.success("Deleted");
			qc.invalidateQueries({ queryKey: ["admin", "categories"] });
			qc.invalidateQueries({ queryKey: ["categories"] });
		}
	};
	const toggle = async (id, value) => {
		const { error } = await supabase.from("categories").update({ is_enabled: value }).eq("id", id);
		if (error) toast.error(error.message);
		else qc.invalidateQueries({ queryKey: ["admin", "categories"] });
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "mb-6 font-serif text-3xl font-black",
			children: "Categories"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-6 grid gap-3 border border-border bg-background p-4 md:grid-cols-[1fr_auto_auto]",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					htmlFor: "name",
					children: "New category name"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					id: "name",
					value: name,
					onChange: (e) => setName(e.target.value)
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					htmlFor: "color",
					children: "Color"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					id: "color",
					type: "color",
					value: color,
					onChange: (e) => setColor(e.target.value),
					className: "h-10 w-16 p-1"
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-end",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: add,
						className: "bg-[var(--brand)] text-white hover:bg-[var(--brand)]/90",
						children: "Add"
					})
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "border border-border bg-background",
			children: (q.data ?? []).map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between border-b border-border p-4 last:border-b-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "inline-block h-5 w-5 rounded",
							style: { backgroundColor: c.color }
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-semibold",
							children: c.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-xs text-muted-foreground",
							children: ["/", c.slug]
						}),
						!c.is_enabled && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "rounded bg-muted px-2 py-0.5 text-xs",
							children: "Disabled"
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "sm",
						onClick: () => toggle(c.id, !c.is_enabled),
						children: c.is_enabled ? "Disable" : "Enable"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "sm",
						onClick: () => remove(c.id),
						className: "text-destructive hover:text-destructive",
						children: "Delete"
					})]
				})]
			}, c.id))
		})
	] });
}
//#endregion
export { CategoriesAdmin as component };
