import { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";

// Below this word count, articles render normally with no clamp/button at
// all — this is only meant to tame genuinely long pieces, not add UI noise
// to a quick 300-word news brief.
const WORD_THRESHOLD = 650;
const COLLAPSED_HEIGHT = 560; // px

export function ArticleBody({ html }: { html: string }) {
  const [expanded, setExpanded] = useState(false);

  const wordCount = useMemo(() => {
    const text = html.replace(/<[^>]+>/g, " ").trim();
    return text ? text.split(/\s+/).length : 0;
  }, [html]);

  const needsClamp = wordCount > WORD_THRESHOLD;

  if (!needsClamp) {
    return <div className="article-prose mt-8" dangerouslySetInnerHTML={{ __html: html }} />;
  }

  return (
    <div className="relative mt-8">
      <div
        className="article-prose overflow-hidden transition-[max-height] duration-300"
        style={{ maxHeight: expanded ? "none" : COLLAPSED_HEIGHT }}
        dangerouslySetInnerHTML={{ __html: html }}
      />
      {!expanded && (
        <>
          {/* Fades the last bit of visible text into the page background,
              so the cutoff reads as an intentional design choice rather
              than content just stopping mid-thought. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent"
          />
          <div className="relative mt-2 flex justify-center">
            <button
              type="button"
              onClick={() => setExpanded(true)}
              className="flex items-center gap-1.5 border border-border bg-background px-5 py-2 text-sm font-semibold uppercase tracking-wide text-[var(--ink)] shadow-sm hover:border-[var(--brand)] hover:text-[var(--brand)]"
            >
              Continue Reading
              <ChevronDown size={16} />
            </button>
          </div>
        </>
      )}
    </div>
  );
}