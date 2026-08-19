import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-CZsxps-O.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { r as useQueryClient, t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as formatDate } from "./format-CG3FEzEE.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.users-8dgje0H-.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var ROLES = [
	"super_admin",
	"admin",
	"editor",
	"author",
	"moderator",
	"subscriber"
];
function UsersAdmin() {
	const qc = useQueryClient();
	const q = useQuery({
		queryKey: ["admin", "users"],
		queryFn: async () => {
			const { data: profiles, error } = await supabase.from("profiles").select("id,display_name,avatar_url,bio,created_at,approval_status").order("created_at", { ascending: false });
			if (error) throw error;
			const { data: roles } = await supabase.from("user_roles").select("user_id,role");
			const map = /* @__PURE__ */ new Map();
			for (const r of roles ?? []) map.set(r.user_id, [...map.get(r.user_id) ?? [], r.role]);
			return (profiles ?? []).map((p) => ({
				...p,
				approval_status: p.approval_status ?? "pending",
				roles: map.get(p.id) ?? []
			}));
		}
	});
	const toggleRole = async (userId, role, has) => {
		const { error } = has ? await supabase.from("user_roles").delete().eq("user_id", userId).eq("role", role) : await supabase.from("user_roles").insert({
			user_id: userId,
			role
		});
		if (error) return toast.error(error.message);
		toast.success("Roles updated");
		qc.invalidateQueries({ queryKey: ["admin", "users"] });
	};
	const saveProfile = async (userId, fields) => {
		const { error } = await supabase.from("profiles").update(fields).eq("id", userId);
		if (error) return toast.error(error.message);
		toast.success("Profile updated");
		qc.invalidateQueries({ queryKey: ["admin", "users"] });
	};
	const decide = async (userId, decision) => {
		const { error } = await supabase.rpc(decision === "approve" ? "approve_user" : "reject_user", { target_user_id: userId });
		if (error) return toast.error(error.message);
		toast.success(decision === "approve" ? "User approved — they can now sign in" : "User rejected");
		qc.invalidateQueries({ queryKey: ["admin", "users"] });
	};
	const all = q.data ?? [];
	const pending = all.filter((u) => u.approval_status === "pending");
	const others = all.filter((u) => u.approval_status !== "pending");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "mb-2 font-serif text-3xl font-black",
			children: "Users & roles"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mb-6 text-sm text-muted-foreground",
			children: "New sign-ups can't log in until approved here. Display name and bio appear publicly on articles as the author byline."
		}),
		pending.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-8",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
				className: "mb-3 flex items-center gap-2 font-serif text-xl font-bold",
				children: ["Pending approval", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "rounded-full bg-[var(--brand)] px-2 py-0.5 text-xs font-bold text-white",
					children: pending.length
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "border border-[var(--brand)]",
				children: pending.map((u) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between gap-4 border-b border-border p-4 last:border-b-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [u.avatar_url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: u.avatar_url,
							alt: "",
							className: "h-9 w-9 rounded-full object-cover"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "flex h-9 w-9 items-center justify-center rounded-full bg-muted text-xs font-bold",
							children: (u.display_name ?? "?").slice(0, 2).toUpperCase()
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-semibold",
							children: u.display_name ?? "Unnamed"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-muted-foreground",
							children: ["Requested ", formatDate(u.created_at)]
						})] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex shrink-0 gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => decide(u.id, "approve"),
							className: "bg-[var(--brand)] px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-white hover:bg-[var(--brand)]/90",
							children: "Approve"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => decide(u.id, "reject"),
							className: "border border-border px-3 py-1.5 text-xs font-semibold uppercase tracking-wide hover:bg-muted",
							children: "Reject"
						})]
					})]
				}, u.id))
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "mb-3 font-serif text-xl font-bold",
			children: "All users"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "border border-border bg-background",
			children: [q.isLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "p-6 text-muted-foreground",
				children: "Loading…"
			}), others.map((u) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserRow, {
				user: u,
				onToggleRole: toggleRole,
				onSaveProfile: saveProfile,
				onDecide: decide
			}, u.id))]
		})
	] });
}
function UserRow({ user: u, onToggleRole, onSaveProfile, onDecide }) {
	const [editing, setEditing] = (0, import_react.useState)(false);
	const [displayName, setDisplayName] = (0, import_react.useState)(u.display_name ?? "");
	const [bio, setBio] = (0, import_react.useState)(u.bio ?? "");
	const [avatarUrl, setAvatarUrl] = (0, import_react.useState)(u.avatar_url ?? "");
	const save = () => {
		onSaveProfile(u.id, {
			display_name: displayName.trim() || null,
			bio: bio.trim() || null,
			avatar_url: avatarUrl.trim() || null
		});
		setEditing(false);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "border-b border-border p-4 last:border-b-0",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [u.avatar_url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: u.avatar_url,
						alt: "",
						className: "h-9 w-9 rounded-full object-cover"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "flex h-9 w-9 items-center justify-center rounded-full bg-muted text-xs font-bold",
						children: (u.display_name ?? "?").slice(0, 2).toUpperCase()
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-semibold",
							children: u.display_name ?? "Unnamed"
						}), u.approval_status === "rejected" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "rounded border border-destructive px-1.5 py-0.5 text-[10px] font-bold uppercase text-destructive",
							children: "Rejected"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-muted-foreground",
						children: ["Joined ", formatDate(u.created_at)]
					})] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex shrink-0 gap-2",
					children: [u.approval_status === "rejected" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => onDecide(u.id, "approve"),
						className: "border border-border px-3 py-1 text-xs font-semibold uppercase tracking-wide hover:bg-muted",
						children: "Reconsider"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setEditing((v) => !v),
						className: "border border-border px-3 py-1 text-xs font-semibold uppercase tracking-wide hover:bg-muted",
						children: editing ? "Cancel" : "Edit profile"
					})]
				})]
			}),
			editing && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 space-y-3 border border-border bg-[var(--paper)] p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "mb-1 block text-xs font-semibold uppercase tracking-wide text-muted-foreground",
						children: "Display name"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: displayName,
						onChange: (e) => setDisplayName(e.target.value),
						className: "w-full border border-input bg-background px-3 py-2 text-sm",
						placeholder: "Name shown publicly"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "mb-1 block text-xs font-semibold uppercase tracking-wide text-muted-foreground",
						children: "Bio (shown under \"Written by\" on their articles)"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						value: bio,
						onChange: (e) => setBio(e.target.value),
						rows: 3,
						maxLength: 400,
						className: "w-full border border-input bg-background px-3 py-2 text-sm",
						placeholder: "A short line about this author…"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "mb-1 block text-xs font-semibold uppercase tracking-wide text-muted-foreground",
						children: "Avatar URL"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: avatarUrl,
						onChange: (e) => setAvatarUrl(e.target.value),
						className: "w-full border border-input bg-background px-3 py-2 text-sm",
						placeholder: "https://…"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: save,
						className: "bg-[var(--brand)] px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white hover:bg-[var(--brand)]/90",
						children: "Save profile"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 flex flex-wrap gap-2",
				children: ROLES.map((r) => {
					const has = u.roles.includes(r);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => onToggleRole(u.id, r, has),
						className: "rounded border px-2 py-1 text-xs font-semibold uppercase tracking-wide " + (has ? "border-[var(--brand)] bg-[var(--brand)] text-white" : "border-border text-muted-foreground hover:bg-muted"),
						children: r.replace("_", " ")
					}, r);
				})
			})
		]
	});
}
//#endregion
export { UsersAdmin as component };
