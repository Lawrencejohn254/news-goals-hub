import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Search, Menu, X } from "lucide-react";

const NAV = [
  { label: "Politics", to: "/category/politics" },
  { label: "Business", to: "/category/business" },
  { label: "Technology", to: "/category/technology" },
  { label: "Sports", to: "/category/sports" },
  { label: "Predictions", to: "/predictions" },
  { label: "Entertainment", to: "/category/entertainment" },
  { label: "International", to: "/category/international" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(t);
  }, []);

  return (
    <header className="border-b border-border bg-background">
      {/* Utility bar — admin/sign-in link intentionally not shown here.
          Staff can reach the login screen via the small "Staff Login" link
          in the footer, or by going directly to /auth. */}
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

      {/* Masthead */}
      <div className="container-page flex items-center justify-between py-6">
        <button
          className="md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>

        <Link to="/" className="flex items-center gap-2">
          <span className="inline-block h-8 w-2 bg-[var(--brand)]" />
          <span className="font-serif text-3xl font-black tracking-tight text-[var(--ink)]">
            The Dispatch
          </span>
        </Link>

        <Link to="/search" aria-label="Search" className="p-2 hover:text-[var(--brand)]">
          <Search size={20} />
        </Link>
      </div>

      {/* Primary nav — sticky so it stays visible while scrolling */}
      <nav className="sticky top-0 z-40 hidden border-t border-border bg-background md:block">
        <div className="container-page flex items-center gap-6 overflow-x-auto py-3 text-sm font-semibold uppercase tracking-wide">
          <Link
            to="/"
            className="text-[var(--ink)] hover:text-[var(--brand)]"
            activeOptions={{ exact: true }}
            activeProps={{ className: "text-[var(--brand)]" }}
          >
            Home
          </Link>
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="text-[var(--ink)] hover:text-[var(--brand)] whitespace-nowrap"
              activeProps={{ className: "text-[var(--brand)]" }}
            >
              {n.label}
            </Link>
          ))}
        </div>
      </nav>

      {open && (
        <nav className="md:hidden border-t border-border">
          <div className="container-page flex flex-col py-3 text-sm font-semibold">
            <Link to="/" onClick={() => setOpen(false)} className="py-2">
              Home
            </Link>
            {NAV.map((n) => (
              <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className="py-2">
                {n.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}