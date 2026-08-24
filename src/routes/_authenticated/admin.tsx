import { Link, Outlet, createFileRoute, useNavigate, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  LayoutDashboard,
  Newspaper,
  Tag,
  LogOut,
  Home,
  Image,
  MessageSquare,
  Users,
  Megaphone,
  Mail,
  Settings,
  BarChart3,
  Trophy,
  Menu,
  X,
  ArrowLeft,
  UserCircle,
  ShieldAlert,
} from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

type StaffRole = "super_admin" | "admin" | "editor" | "author" | "moderator";

function useStaffRoles() {
  const [roles, setRoles] = useState<StaffRole[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const loadRoles = async () => {
      setLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        if (active) {
          setRoles([]);
          setLoading(false);
        }
        return;
      }

      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id);

      if (active) {
        const validRoles: StaffRole[] = ["super_admin", "admin", "editor", "author", "moderator"];
        setRoles(
          (data ?? [])
            .map((row) => row.role as StaffRole)
            .filter((role) => validRoles.includes(role)),
        );
        setLoading(false);
      }
    };

    void loadRoles();
    return () => {
      active = false;
    };
  }, []);

  return {
    roles,
    loading,
    hasAny: (...required: StaffRole[]) => required.some((role) => roles.includes(role)),
  };
}

export const Route = createFileRoute("/_authenticated/admin")({
  component: AdminLayout,
});

const EDITOR_UP: StaffRole[] = ["editor", "admin", "super_admin"];
const ADMIN_UP: StaffRole[] = ["admin", "super_admin"];
const ALL_STAFF: StaffRole[] = ["super_admin", "admin", "editor", "author", "moderator"];

// Which roles can reach each admin section — this is enforced twice: once
// to decide what shows in the sidebar, and again as an actual access check
// below (a hidden link alone doesn't stop someone typing the URL directly).
const SECTION_ACCESS: { prefix: string; roles: StaffRole[] }[] = [
  { prefix: "/admin/articles", roles: ALL_STAFF },
  { prefix: "/admin/categories", roles: EDITOR_UP },
  { prefix: "/admin/predictions", roles: EDITOR_UP },
  { prefix: "/admin/football", roles: EDITOR_UP },
  { prefix: "/admin/leagues", roles: EDITOR_UP },
  { prefix: "/admin/media", roles: ALL_STAFF },
  { prefix: "/admin/comments", roles: ["editor", "admin", "super_admin", "moderator"] },
  { prefix: "/admin/users", roles: ADMIN_UP },
  { prefix: "/admin/ads", roles: ADMIN_UP },
  { prefix: "/admin/newsletter", roles: ALL_STAFF },
  { prefix: "/admin/analytics", roles: EDITOR_UP },
  { prefix: "/admin/settings", roles: ADMIN_UP },
  { prefix: "/admin/profile", roles: ALL_STAFF },
  { prefix: "/admin", roles: ALL_STAFF }, // dashboard root — exact match only, checked below
];

function sectionRolesFor(pathname: string): StaffRole[] | null {
  for (const s of SECTION_ACCESS) {
    if (s.prefix === "/admin") {
      if (pathname === "/admin") return s.roles;
      continue;
    }
    if (pathname === s.prefix || pathname.startsWith(`${s.prefix}/`)) return s.roles;
  }
  return null;
}

function AdminLayout() {
  const navigate = useNavigate();
  const router = useRouter();
  const qc = useQueryClient();
  const { roles, hasAny, loading: rolesLoading } = useStaffRoles();
  const [email, setEmail] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pathname, setPathname] = useState(router.state.location.pathname);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? null));
  }, []);

  // Close the mobile drawer automatically whenever the route changes (e.g.
  // after tapping a nav link), and keep our local pathname in sync for the
  // access check below.
  useEffect(() => {
    const unsub = router.subscribe("onResolved", () => {
      setSidebarOpen(false);
      setPathname(router.state.location.pathname);
    });
    return unsub;
  }, [router]);

  const isStaff = roles.some((r) => (ALL_STAFF as string[]).includes(r));

  const signOut = async () => {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    router.invalidate();
    navigate({ to: "/auth", replace: true });
  };

  const canSee = (roles: StaffRole[]) => hasAny(...roles);
  const allowedRolesForCurrentPath = sectionRolesFor(pathname);
  const accessDenied =
    !rolesLoading && allowedRolesForCurrentPath !== null && !hasAny(...allowedRolesForCurrentPath);

  return (
    <div className="min-h-screen bg-[var(--paper)]">
      <div className="flex">
        {/* Mobile backdrop — tapping it closes the drawer */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/50 md:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* Sidebar: normal in-flow column on desktop (md:static), an
            off-canvas drawer sliding in from the left on mobile. */}
        <aside
          className={
            "fixed inset-y-0 left-0 z-50 w-64 transform border-r border-border bg-background transition-transform duration-200 ease-in-out " +
            "md:static md:z-auto md:w-60 md:shrink-0 md:translate-x-0 " +
            (sidebarOpen ? "translate-x-0" : "-translate-x-full")
          }
        >
          <div className="flex items-center justify-between border-b border-border p-5">
            <Link to="/" className="flex items-center gap-2">
              <span className="inline-block h-6 w-1.5 bg-[var(--brand)]" />
              <span className="font-serif text-lg font-black">Dispatch</span>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-muted-foreground hover:text-foreground md:hidden"
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
          </div>
          <p className="px-5 pt-3 text-xs text-muted-foreground">Newsroom</p>
          <nav className="flex flex-col p-3 text-sm">
            <NavItem to="/admin" icon={<LayoutDashboard size={16} />} exact>
              Dashboard
            </NavItem>
            <NavItem to="/admin/articles" icon={<Newspaper size={16} />}>
              Articles
            </NavItem>
            {canSee(EDITOR_UP) && (
              <NavItem to="/admin/categories" icon={<Tag size={16} />}>
                Categories
              </NavItem>
            )}
            {canSee(EDITOR_UP) && (
              <NavItem to="/admin/predictions" icon={<Trophy size={16} />}>
                Predictions
              </NavItem>
            )}
            {canSee(EDITOR_UP) && (
              <NavItem to="/admin/football" icon={<Trophy size={16} />}>
                Football data
              </NavItem>
            )}
            {canSee(EDITOR_UP) && (
              <NavItem to="/admin/leagues" icon={<Trophy size={16} />}>
                Leagues &amp; sync
              </NavItem>
            )}

            <NavItem to="/admin/media" icon={<Image size={16} />}>
              Media
            </NavItem>
            {canSee(["editor", "admin", "super_admin", "moderator"]) && (
              <NavItem to="/admin/comments" icon={<MessageSquare size={16} />}>
                Comments
              </NavItem>
            )}
            {canSee(ADMIN_UP) && (
              <NavItem to="/admin/users" icon={<Users size={16} />}>
                Users
              </NavItem>
            )}
            {canSee(ADMIN_UP) && (
              <NavItem to="/admin/ads" icon={<Megaphone size={16} />}>
                Ads
              </NavItem>
            )}
            <NavItem to="/admin/newsletter" icon={<Mail size={16} />}>
              Newsletter
            </NavItem>
            {canSee(EDITOR_UP) && (
              <NavItem to="/admin/analytics" icon={<BarChart3 size={16} />}>
                Analytics
              </NavItem>
            )}
            {canSee(ADMIN_UP) && (
              <NavItem to="/admin/settings" icon={<Settings size={16} />}>
                Settings
              </NavItem>
            )}
            <div className="my-2 border-t border-border" />
            <NavItem to="/admin/profile" icon={<UserCircle size={16} />}>
              My Profile
            </NavItem>
            <NavItem to="/" icon={<Home size={16} />} target="_blank" rel="noopener noreferrer">
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

        <div className="min-w-0 flex-1">
          <header className="flex items-center justify-between gap-3 border-b border-border bg-background px-4 py-4 md:px-6">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSidebarOpen(true)}
                className="text-foreground hover:text-[var(--brand)] md:hidden"
                aria-label="Open menu"
              >
                <Menu size={22} />
              </button>
              <button
                onClick={() => router.history.back()}
                className="text-muted-foreground hover:text-foreground"
                aria-label="Go back"
              >
                <ArrowLeft size={20} />
              </button>
            </div>
            <div className="truncate text-right text-sm text-muted-foreground">
              Signed in as <span className="font-semibold text-foreground">{email}</span>
              {roles.length > 0 && (
                <span className="ml-2 rounded bg-muted px-2 py-0.5 text-xs">
                  {roles.join(", ")}
                </span>
              )}
            </div>
          </header>
          {!isStaff && !rolesLoading && roles.length > 0 && (
            <div className="m-6 border-l-4 border-[var(--brand)] bg-white p-4 text-sm">
              <p className="font-semibold">Awaiting editorial access</p>
              <p className="mt-1 text-muted-foreground">
                Your account is a subscriber. Ask an admin to grant you the{" "}
                <code className="rounded bg-muted px-1">author</code> or{" "}
                <code className="rounded bg-muted px-1">editor</code> role.
              </p>
            </div>
          )}
          <div className="p-4 md:p-6">
            {accessDenied ? (
              <div className="mx-auto max-w-md border border-destructive/40 bg-destructive/5 p-8 text-center">
                <ShieldAlert className="mx-auto mb-3 text-destructive" size={32} />
                <p className="font-serif text-xl font-bold">Access restricted</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Your role doesn't have access to this section.
                </p>
                <Link
                  to="/admin/articles"
                  className="mt-4 inline-block bg-[var(--brand)] px-4 py-2 text-sm font-semibold text-white"
                >
                  Back to Articles
                </Link>
              </div>
            ) : (
              <Outlet />
            )}
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
  target,
  rel,
}: {
  to: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  exact?: boolean;
  target?: string;
  rel?: string;
}) {
  return (
    <Link
      to={to}
      activeOptions={{ exact }}
      className="flex items-center gap-2 rounded px-3 py-2 text-foreground hover:bg-muted"
      activeProps={{ className: "flex items-center gap-2 rounded px-3 py-2 bg-[var(--ink)] text-white hover:bg-[var(--ink)]" }}
      target={target}
      rel={rel}
    >
      {icon} {children}
    </Link>
  );
}
