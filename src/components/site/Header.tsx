import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Menu, X } from "lucide-react";
import { fetchCategories } from "@/lib/queries";

export function Header() {
  const [open, setOpen] = useState(false);
  const [now, setNow] = useState(new Date());

  // Nav mirrors the real categories table (respects is_enabled and
  // sort_order) instead of a hardcoded list — add/disable a category in
  // the admin panel and this updates automatically, no code change needed.
  const categories = useQuery({ queryKey: ["nav-categories"], queryFn: fetchCategories });
  const navCategories = categories.data ?? [];

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(t);
  }, []);

  return (
    <header className="border-b border-border bg-background">
      {/* Utility bar — scrolls away normally; admin/sign-in link
          intentionally not shown here (see Footer's "Staff Login"). */}
      <div className="border-b border-border bg-[var(--ink)] text-white/80 text-xs">
        <div className="container-page flex h-8 items-center">
          <span>
            {now.toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>
      </div>

      {/* Sticky group: logo + nav travel together and stay pinned to the
          top of the viewport as you scroll, so the site is always
          navigable. Kept compact (smaller vertical padding) so it doesn't
          eat too much screen space once pinned. */}
      <div className="sticky top-0 z-40 border-b border-border bg-background">
        <div className="container-page flex items-center justify-between py-3 md:py-4">
          <button
            className="md:hidden"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>

          <Link to="/" className="flex items-center gap-2">
            <span className="inline-block h-7 w-2 bg-[var(--brand)]" />
            <span className="font-serif text-2xl font-black tracking-tight text-[var(--ink)] md:text-3xl">
              The Dispatch
            </span>
          </Link>

          <Link to="/search" aria-label="Search" className="p-2 hover:text-[var(--brand)]">
            <Search size={20} />
          </Link>
        </div>

        <nav className="hidden border-t border-border md:block">
          <div className="container-page flex items-center gap-6 overflow-x-auto py-3 text-sm font-semibold uppercase tracking-wide">
            <Link
              to="/"
              className="text-[var(--ink)] hover:text-[var(--brand)]"
              activeOptions={{ exact: true }}
              activeProps={{ className: "text-[var(--brand)]" }}
            >
              Home
            </Link>
            {navCategories.map((c) => (
              <Link
                key={c.id}
                to="/category/$slug"
                params={{ slug: c.slug }}
                className="text-[var(--ink)] hover:text-[var(--brand)] whitespace-nowrap"
                activeProps={{ className: "text-[var(--brand)]" }}
              >
                {c.name}
              </Link>
            ))}
            <Link
              to="/predictions"
              className="text-[var(--ink)] hover:text-[var(--brand)] whitespace-nowrap"
              activeProps={{ className: "text-[var(--brand)]" }}
            >
              Predictions
            </Link>
          </div>
        </nav>

        {open && (
          <nav className="md:hidden border-t border-border">
            <div className="container-page flex flex-col py-3 text-sm font-semibold">
              <Link to="/" onClick={() => setOpen(false)} className="py-2">
                Home
              </Link>
              {navCategories.map((c) => (
                <Link
                  key={c.id}
                  to="/category/$slug"
                  params={{ slug: c.slug }}
                  onClick={() => setOpen(false)}
                  className="py-2"
                >
                  {c.name}
                </Link>
              ))}
              <Link to="/predictions" onClick={() => setOpen(false)} className="py-2">
                Predictions
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}