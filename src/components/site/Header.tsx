import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Menu, X } from "lucide-react";
import { fetchCategories } from "@/lib/queries";
import { fetchSettings } from "@/lib/site";
import { ElectionCountdown } from "@/components/site/ElectionCountdown";

// Scroll distances (px) at which the pinned header shrinks and grows back.
// Two different values stop it flickering when the height change itself
// nudges the scroll position.
const COMPACT_ON = 120;
const COMPACT_OFF = 40;

// The whole header — date bar, masthead, countdown and menu — stays pinned to
// the top on every screen size. Once you scroll it shrinks (date bar and
// countdown title hide, smaller logo) so it doesn't cover the article.
// On wide screens the countdown sits in the masthead row between the site name
// and the search icon; below 1024px it drops into a slim strip under it.
export function Header() {
  const [open, setOpen] = useState(false);
  const [now, setNow] = useState(new Date());
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setCompact((c) => (c ? y > COMPACT_OFF : y > COMPACT_ON));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Nav mirrors the real categories table (respects is_enabled and
  // sort_order) instead of a hardcoded list — add/disable a category in
  // the admin panel and this updates automatically, no code change needed.
  const categories = useQuery({ queryKey: ["nav-categories"], queryFn: fetchCategories });
  const navCategories = categories.data ?? [];
  // Predictions nav link respects the toggle in Admin -> Settings — default
  // true (matches the DB default) so it doesn't flicker away while loading.
  const settings = useQuery({ queryKey: ["site-settings"], queryFn: fetchSettings });
  const showPredictions = settings.data?.predictions_enabled ?? true;

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(t);
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background">
      {/* Utility bar — hidden once the page is scrolled; admin/sign-in link
          intentionally not shown here (see Footer's "Staff Login"). */}
      {!compact && (
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
      )}

      <div className="border-b border-border bg-background">
        <div
          className={
            "container-page flex items-center justify-between " +
            (compact ? "py-1.5 md:py-2" : "py-3 md:py-4")
          }
        >
          <button
            className="md:hidden"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>

          <Link to="/" className="flex items-center gap-2">
            <span
              className={
                "font-serif font-black tracking-tight text-[var(--ink)] " +
                (compact ? "text-xl md:text-2xl" : "text-3xl md:text-4xl")
              }
            >
              The Africa Daily Dispatch
            </span>
          </Link>

          <ElectionCountdown compact={compact} wrapperClassName="hidden lg:block" />

          <Link to="/search" search={{ q: "" }} aria-label="Search" className="p-2 hover:text-[var(--brand)]">
            <Search size={20} />
          </Link>
        </div>

        {/* Phones & tablets: no room beside the logo, so the countdown gets
            its own slim strip inside the pinned header. */}
        <ElectionCountdown
          size="sm"
          compact={compact}
          wrapperClassName={
            "container-page flex justify-center lg:hidden " + (compact ? "pb-1.5" : "pb-3")
          }
        />

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
            {showPredictions && (
              <Link
                to="/predictions"
                className="text-[var(--ink)] hover:text-[var(--brand)] whitespace-nowrap"
                activeProps={{ className: "text-[var(--brand)]" }}
              >
                Predictions
              </Link>
            )}
          </div>
        </nav>

        {open && (
          <nav className="max-h-[60vh] overflow-y-auto border-t border-border md:hidden">
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
              {showPredictions && (
                <Link to="/predictions" onClick={() => setOpen(false)} className="py-2">
                  Predictions
                </Link>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}