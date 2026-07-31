import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { formatDate } from "@/lib/format";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/users")({
  component: UsersAdmin,
});

const ROLES = ["super_admin", "admin", "editor", "author", "moderator", "subscriber"] as const;
type Role = (typeof ROLES)[number];

function UsersAdmin() {
  const qc = useQueryClient();
  const q = useQuery({
    queryKey: ["admin", "users"],
    queryFn: async () => {
      const { data: profiles, error } = await supabase
        .from("profiles")
        .select("id,display_name,avatar_url,bio,created_at")
        .order("created_at", { ascending: false });
      if (error) throw error;
      const { data: roles } = await supabase.from("user_roles").select("user_id,role");
      const map = new Map<string, Role[]>();
      for (const r of roles ?? []) {
        map.set(r.user_id, [...(map.get(r.user_id) ?? []), r.role as Role]);
      }
      return (profiles ?? []).map((p) => ({ ...p, roles: map.get(p.id) ?? [] }));
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

  return (
    <div>
      <h1 className="mb-2 font-serif text-3xl font-black">Users &amp; roles</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        Only admins can change roles. Changes take effect on the user&apos;s next request.
      </p>

      <div className="border border-border bg-background">
        {q.isLoading && <p className="p-6 text-muted-foreground">Loading…</p>}
        {(q.data ?? []).map((u) => (
          <div key={u.id} className="border-b border-border p-4 last:border-b-0">
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
                <p className="text-xs text-muted-foreground">Joined {formatDate(u.created_at)}</p>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {ROLES.map((r) => {
                const has = u.roles.includes(r);
                return (
                  <button
                    key={r}
                    onClick={() => toggleRole(u.id, r, has)}
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
        ))}
      </div>
    </div>
  );
}
