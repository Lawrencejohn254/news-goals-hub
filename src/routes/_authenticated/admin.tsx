import { Link, Outlet, createFileRoute, useNavigate, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { LayoutDashboard, Newspaper, Tag, LogOut, Home } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

export const Route = createFileRoute("/_authenticated/admin")({
  component: AdminLayout,
});

function AdminLayout() {
  const navigate = useNavigate();
  const router = useRouter();
  const qc = useQueryClient();
  const [roles, setRoles] = useState<string[]>([]);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      setEmail(data.user?.email ?? null);
      if (data.user) {
        const { data: rows } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", data.user.id);
        setRoles((rows ?? []).map((r) => r.role));
      }
    });
  }, []);

  const isStaff = roles.some((r) =>
    ["super_admin", "admin", "editor", "author", "moderator"].includes(r),
  );

  const signOut = async () => {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    router.invalidate();
    navigate({ to: "/auth", replace: true });
  };

  return (
    <div className="min-h-screen bg-[var(--paper)]">
      <div className="flex">
        <aside className="hidden w-60 shrink-0 border-r border-border bg-background md:block">
          <div className="border-b border-border p-5">
            <Link to="/" className="flex items-center gap-2">
              <span className="inline-block h-6 w-1.5 bg-[var(--brand)]" />
              <span className="font-serif text-lg font-black">Dispatch</span>
            </Link>
            <p className="mt-1 text-xs text-muted-foreground">Newsroom</p>
          </div>
          <nav className="flex flex-col p-3 text-sm">
            <NavItem to="/admin" icon={<LayoutDashboard size={16} />} exact>
              Dashboard
            </NavItem>
            <NavItem to="/admin/articles" icon={<Newspaper size={16} />}>
              Articles
            </NavItem>
            <NavItem to="/admin/categories" icon={<Tag size={16} />}>
              Categories
            </NavItem>
            <NavItem to="/admin/predictions" icon={<Newspaper size={16} />}>
              Predictions
            </NavItem>
            <NavItem to="/admin/football" icon={<Tag size={16} />}>
              Football data
            </NavItem>
            <div className="my-2 border-t border-border" />
            <NavItem to="/" icon={<Home size={16} />}>
              View site
            </NavItem>
            <button
              onClick={signOut}
              className="mt-1 flex items-center gap-2 rounded px-3 py-2 text-left text-muted-foreground hover:bg-muted"
            >
              <LogOut size={16} /> Sign out
            </button>
          </nav>
        </aside>

        <div className="flex-1">
          <header className="flex items-center justify-between border-b border-border bg-background px-6 py-4">
            <div className="text-sm text-muted-foreground">
              Signed in as <span className="font-semibold text-foreground">{email}</span>
              {roles.length > 0 && (
                <span className="ml-2 rounded bg-muted px-2 py-0.5 text-xs">
                  {roles.join(", ")}
                </span>
              )}
            </div>
          </header>
          {!isStaff && roles.length > 0 && (
            <div className="m-6 border-l-4 border-[var(--brand)] bg-white p-4 text-sm">
              <p className="font-semibold">Awaiting editorial access</p>
              <p className="mt-1 text-muted-foreground">
                Your account is a subscriber. Ask an admin to grant you the{" "}
                <code className="rounded bg-muted px-1">author</code> or{" "}
                <code className="rounded bg-muted px-1">editor</code> role via the{" "}
                <code className="rounded bg-muted px-1">user_roles</code> table.
              </p>
            </div>
          )}
          <div className="p-6">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}

function NavItem({
  to,
  icon,
  children,
  exact,
}: {
  to: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  exact?: boolean;
}) {
  return (
    <Link
      to={to}
      activeOptions={{ exact }}
      className="flex items-center gap-2 rounded px-3 py-2 text-foreground hover:bg-muted"
      activeProps={{ className: "flex items-center gap-2 rounded px-3 py-2 bg-[var(--ink)] text-white hover:bg-[var(--ink)]" }}
    >
      {icon} {children}
    </Link>
  );
}
