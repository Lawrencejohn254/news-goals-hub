import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { formatDate } from "@/lib/format";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/users")({
  component: UsersAdmin,
});

const ROLES = ["super_admin", "admin", "editor", "author", "moderator", "subscriber"] as const;
type Role = (typeof ROLES)[number];
type ApprovalStatus = "pending" | "approved" | "rejected";

type UserRowData = {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  created_at: string;
  approval_status: ApprovalStatus;
  roles: Role[];
};

function UsersAdmin() {
  const qc = useQueryClient();
  const q = useQuery({
    queryKey: ["admin", "users"],
    queryFn: async () => {
      const { data: profiles, error } = await supabase
        .from("profiles")
        .select("id,display_name,avatar_url,bio,created_at,approval_status")
        .order("created_at", { ascending: false });
      if (error) throw error;
      const { data: roles } = await supabase.from("user_roles").select("user_id,role");
      const map = new Map<string, Role[]>();
      for (const r of roles ?? []) {
        map.set(r.user_id, [...(map.get(r.user_id) ?? []), r.role as Role]);
      }
      return (profiles ?? []).map((p) => ({
        ...p,
        approval_status: (p.approval_status ?? "pending") as ApprovalStatus,
        roles: map.get(p.id) ?? [],
      })) as UserRowData[];
    },
  });

  const toggleRole = async (userId: string, role: Role, has: boolean) => {
    const { error } = has
      ? await supabase.from("user_roles").delete().eq("user_id", userId).eq("role", role)
      : await supabase.from("user_roles").insert({ user_id: userId, role });
    if (error) return toast.error(error.message);
    toast.success("Roles updated");
    qc.invalidateQueries({ queryKey: ["admin", "users"] });
  };

  const saveProfile = async (
    userId: string,
    fields: Partial<{ display_name: string; bio: string; avatar_url: string }>,
  ) => {
    const { error } = await supabase.from("profiles").update(fields).eq("id", userId);
    if (error) return toast.error(error.message);
    toast.success("Profile updated");
    qc.invalidateQueries({ queryKey: ["admin", "users"] });
  };

  const decide = async (userId: string, decision: "approve" | "reject") => {
    const { error } = await supabase.rpc(decision === "approve" ? "approve_user" : "reject_user", {
      target_user_id: userId,
    });
    if (error) return toast.error(error.message);
    toast.success(decision === "approve" ? "User approved — they can now sign in" : "User rejected");
    qc.invalidateQueries({ queryKey: ["admin", "users"] });
  };

  const all = q.data ?? [];
  const pending = all.filter((u) => u.approval_status === "pending");
  const others = all.filter((u) => u.approval_status !== "pending");

  return (
    <div>
      <h1 className="mb-2 font-serif text-3xl font-black">Users &amp; roles</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        New sign-ups can't log in until approved here. Display name and bio appear
        publicly on articles as the author byline.
      </p>

      {pending.length > 0 && (
        <div className="mb-8">
          <h2 className="mb-3 flex items-center gap-2 font-serif text-xl font-bold">
            Pending approval
            <span className="rounded-full bg-[var(--brand)] px-2 py-0.5 text-xs font-bold text-white">
              {pending.length}
            </span>
          </h2>
          <div className="border border-[var(--brand)]">
            {pending.map((u) => (
              <div key={u.id} className="flex items-center justify-between gap-4 border-b border-border p-4 last:border-b-0">
                <div className="flex items-center gap-3">
                  {u.avatar_url ? (
                    <img src={u.avatar_url} alt="" className="h-9 w-9 rounded-full object-cover" />
                  ) : (
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-xs font-bold">
                      {(u.display_name ?? "?").slice(0, 2).toUpperCase()}
                    </span>
                  )}
                  <div>
                    <p className="font-semibold">{u.display_name ?? "Unnamed"}</p>
                    <p className="text-xs text-muted-foreground">Requested {formatDate(u.created_at)}</p>
                  </div>
                </div>
                <div className="flex shrink-0 gap-2">
                  <button
                    onClick={() => decide(u.id, "approve")}
                    className="bg-[var(--brand)] px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-white hover:bg-[var(--brand)]/90"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => decide(u.id, "reject")}
                    className="border border-border px-3 py-1.5 text-xs font-semibold uppercase tracking-wide hover:bg-muted"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <h2 className="mb-3 font-serif text-xl font-bold">All users</h2>
      <div className="border border-border bg-background">
        {q.isLoading && <p className="p-6 text-muted-foreground">Loading…</p>}
        {others.map((u) => (
          <UserRow key={u.id} user={u} onToggleRole={toggleRole} onSaveProfile={saveProfile} onDecide={decide} />
        ))}
      </div>
    </div>
  );
}

function UserRow({
  user: u,
  onToggleRole,
  onSaveProfile,
  onDecide,
}: {
  user: UserRowData;
  onToggleRole: (userId: string, role: Role, has: boolean) => void;
  onSaveProfile: (
    userId: string,
    fields: Partial<{ display_name: string; bio: string; avatar_url: string }>,
  ) => void;
  onDecide: (userId: string, decision: "approve" | "reject") => void;
}) {
  const [editing, setEditing] = useState(false);
  const [displayName, setDisplayName] = useState(u.display_name ?? "");
  const [bio, setBio] = useState(u.bio ?? "");
  const [avatarUrl, setAvatarUrl] = useState(u.avatar_url ?? "");

  const save = () => {
    onSaveProfile(u.id, {
      display_name: displayName.trim() || null,
      bio: bio.trim() || null,
      avatar_url: avatarUrl.trim() || null,
    });
    setEditing(false);
  };

  return (
    <div className="border-b border-border p-4 last:border-b-0">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          {u.avatar_url ? (
            <img src={u.avatar_url} alt="" className="h-9 w-9 rounded-full object-cover" />
          ) : (
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-xs font-bold">
              {(u.display_name ?? "?").slice(0, 2).toUpperCase()}
            </span>
          )}
          <div>
            <div className="flex items-center gap-2">
              <p className="font-semibold">{u.display_name ?? "Unnamed"}</p>
              {u.approval_status === "rejected" && (
                <span className="rounded border border-destructive px-1.5 py-0.5 text-[10px] font-bold uppercase text-destructive">
                  Rejected
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground">Joined {formatDate(u.created_at)}</p>
          </div>
        </div>
        <div className="flex shrink-0 gap-2">
          {u.approval_status === "rejected" && (
            <button
              onClick={() => onDecide(u.id, "approve")}
              className="border border-border px-3 py-1 text-xs font-semibold uppercase tracking-wide hover:bg-muted"
            >
              Reconsider
            </button>
          )}
          <button
            onClick={() => setEditing((v) => !v)}
            className="border border-border px-3 py-1 text-xs font-semibold uppercase tracking-wide hover:bg-muted"
          >
            {editing ? "Cancel" : "Edit profile"}
          </button>
        </div>
      </div>

      {editing && (
        <div className="mt-4 space-y-3 border border-border bg-[var(--paper)] p-4">
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Display name
            </label>
            <input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full border border-input bg-background px-3 py-2 text-sm"
              placeholder="Name shown publicly"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Bio (shown under "Written by" on their articles)
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              maxLength={400}
              className="w-full border border-input bg-background px-3 py-2 text-sm"
              placeholder="A short line about this author…"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Avatar URL
            </label>
            <input
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              className="w-full border border-input bg-background px-3 py-2 text-sm"
              placeholder="https://…"
            />
          </div>
          <button
            onClick={save}
            className="bg-[var(--brand)] px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white hover:bg-[var(--brand)]/90"
          >
            Save profile
          </button>
        </div>
      )}

      <div className="mt-3 flex flex-wrap gap-2">
        {ROLES.map((r) => {
          const has = u.roles.includes(r);
          return (
            <button
              key={r}
              onClick={() => onToggleRole(u.id, r, has)}
              className={
                "rounded border px-2 py-1 text-xs font-semibold uppercase tracking-wide " +
                (has
                  ? "border-[var(--brand)] bg-[var(--brand)] text-white"
                  : "border-border text-muted-foreground hover:bg-muted")
              }
            >
              {r.replace("_", " ")}
            </button>
          );
        })}
      </div>
    </div>
  );
}