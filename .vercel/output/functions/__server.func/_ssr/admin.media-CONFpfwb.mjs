import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-CZsxps-O.mjs";
import { f as uploadMedia, o as fetchMedia, r as deleteMedia, u as signedMediaUrl } from "./site-D9u_L-Ue.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { r as useQueryClient, t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Button } from "./button-BLZ6ednA.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.media-CONFpfwb.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function MediaAdmin() {
	const qc = useQueryClient();
	const inputRef = (0, import_react.useRef)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const q = useQuery({
		queryKey: ["admin", "media"],
		queryFn: async () => {
			const rows = await fetchMedia();
			return Promise.all(rows.map(async (r) => ({
				...r,
				url: await signedMediaUrl(r.path)
			})));
		}
	});
	const onFiles = async (files) => {
		if (!files?.length) return;
		setBusy(true);
		try {
			for (const f of Array.from(files)) await uploadMedia(f);
			toast.success("Uploaded");
			qc.invalidateQueries({ queryKey: ["admin", "media"] });
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Upload failed");
		} finally {
			setBusy(false);
			if (inputRef.current) inputRef.current.value = "";
		}
	};
	const remove = async (item) => {
		if (!confirm(`Delete ${item.file_name}?`)) return;
		try {
			await deleteMedia(item);
			toast.success("Deleted");
			qc.invalidateQueries({ queryKey: ["admin", "media"] });
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Delete failed");
		}
	};
	const saveAlt = async (id, alt) => {
		const { error } = await supabase.from("media").update({ alt_text: alt }).eq("id", id);
		if (error) toast.error(error.message);
		else toast.success("Alt text saved");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-6 flex items-center justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-serif text-3xl font-black",
				children: "Media library"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Images and files used across the site"
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				ref: inputRef,
				type: "file",
				multiple: true,
				accept: "image/*,application/pdf",
				className: "hidden",
				onChange: (e) => onFiles(e.target.files)
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				disabled: busy,
				onClick: () => inputRef.current?.click(),
				className: "bg-[var(--brand)] text-white hover:bg-[var(--brand)]/90",
				children: busy ? "Uploading…" : "Upload files"
			})] })]
		}),
		q.isLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-muted-foreground",
			children: "Loading…"
		}),
		q.data?.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "border border-dashed border-border p-10 text-center text-muted-foreground",
			children: "No media yet. Upload your first file."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
			children: (q.data ?? []).map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "border border-border bg-background",
				children: [m.mime_type?.startsWith("image/") ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: m.url,
					alt: m.alt_text ?? m.file_name,
					className: "aspect-video w-full object-cover"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex aspect-video items-center justify-center bg-muted text-xs text-muted-foreground",
					children: m.mime_type ?? "file"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2 p-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "truncate text-xs font-semibold",
							children: m.file_name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: m.size_bytes ? `${Math.round(m.size_bytes / 1024)} KB` : ""
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							defaultValue: m.alt_text ?? "",
							placeholder: "Alt text",
							onBlur: (e) => saveAlt(m.id, e.target.value),
							className: "w-full border border-input bg-background px-2 py-1 text-xs"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								size: "sm",
								onClick: () => {
									navigator.clipboard.writeText(m.url);
									toast.success("URL copied");
								},
								children: "Copy URL"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								size: "sm",
								className: "text-destructive hover:text-destructive",
								onClick: () => remove(m),
								children: "Delete"
							})]
						})
					]
				})]
			}, m.id))
		})
	] });
}
//#endregion
export { MediaAdmin as component };
