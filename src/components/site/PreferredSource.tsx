import { Star } from "lucide-react";
import { getSiteUrl } from "@/lib/site-url";

const FALLBACK_DOMAIN = "africadailydispatch.com";

function siteDomain() {
  try {
    const url = getSiteUrl();
    return url ? new URL(url).hostname : FALLBACK_DOMAIN;
  } catch {
    return FALLBACK_DOMAIN;
  }
}

export function PreferredSource({ className = "" }: { className?: string }) {
  const href = `https://www.google.com/preferences/source?q=${encodeURIComponent(siteDomain())}`;

  return (
    <div
      className={`flex flex-col gap-3 border border-border bg-[var(--paper)] p-4 sm:flex-row sm:items-center sm:justify-between ${className}`}
    >
      <div>
        <p className="text-base font-extrabold text-[var(--ink)]">See more of our stories on Google</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Add The Africa Daily Dispatch as a preferred source and we'll appear more often in your
          Top Stories.
        </p>
      </div>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex shrink-0 items-center justify-center gap-2 bg-[var(--brand)] px-4 py-2 text-sm font-bold text-white hover:opacity-90"
      >
        <Star size={16} />
        Add as preferred source
      </a>
    </div>
  );
}