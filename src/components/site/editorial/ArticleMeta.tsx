import { Headphones } from "lucide-react";
import { relativeTimeLong } from "@/lib/format";

/**
 * Shared meta row: category tag, relative time, optional "Listen" button.
 * Render it OUTSIDE the card's headline link (interactive content must not be
 * nested inside <a>); cards lift it above the stretched link with relative z-10.
 */
export function ArticleMeta({
  category,
  publishedAt,
  hasAudio = false,
  onListen,
  className = "",
}: {
  category?: string | null;
  publishedAt?: string | null;
  hasAudio?: boolean | null;
  onListen?: () => void;
  className?: string;
}) {
  const time = relativeTimeLong(publishedAt);
  if (!category && !time && !hasAudio) return null;

  return (
    <div
      className={`relative z-10 flex flex-wrap items-center gap-x-3 gap-y-1 font-sans text-[11px] leading-none ${className}`}
    >
      {category && (
        <span className="font-bold uppercase tracking-wider text-[var(--ed-accent)]">
          {category}
        </span>
      )}
      {time && publishedAt && (
        <time dateTime={publishedAt} className="text-[var(--ed-muted)]">
          {time}
        </time>
      )}
      {hasAudio && (
        <button
          type="button"
          onClick={onListen}
          aria-label={`Listen to this story${category ? ` (${category})` : ""}`}
          className="inline-flex items-center gap-1 rounded-sm border border-[var(--ed-line)] px-1.5 py-1 font-semibold text-[var(--ed-text)] hover:border-[var(--ed-accent)] hover:text-[var(--ed-accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ed-accent)]"
        >
          <Headphones className="h-3 w-3" aria-hidden="true" />
          Listen
        </button>
      )}
    </div>
  );
}
