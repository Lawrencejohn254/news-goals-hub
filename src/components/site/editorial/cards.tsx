import { useState, type ElementType, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ArticleMeta } from "./ArticleMeta";
import type { EditorialStory, HeadingLevel } from "./types";

/* ------------------------------------------------------------------ */
/* Shared pieces                                                       */
/* ------------------------------------------------------------------ */

/** Fixed-ratio, lazy image that falls back to a neutral block if missing/broken. */
function EdImage({
  story,
  ratio,
  className = "",
  eager = false,
}: {
  story: EditorialStory;
  ratio: "16/9" | "4/3" | "1/1";
  className?: string;
  eager?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  const aspect =
    ratio === "16/9" ? "aspect-video" : ratio === "4/3" ? "aspect-[4/3]" : "aspect-square";
  return (
    <div className={`${aspect} overflow-hidden bg-[var(--ed-surface)] ${className}`}>
      {story.featured_image && !failed && (
        <img
          src={story.featured_image}
          alt={story.title}
          loading={eager ? "eager" : "lazy"}
          decoding="async"
          onError={() => setFailed(true)}
          className="h-full w-full object-cover"
        />
      )}
    </div>
  );
}

/**
 * Headline whose link stretches over the whole card (::after), so the card is
 * one big click target while the meta row's Listen button stays a separate,
 * valid, keyboard-focusable control.
 */
function Headline({
  story,
  as: Tag = "h3",
  className,
}: {
  story: EditorialStory;
  as?: ElementType;
  className: string;
}) {
  return (
    <Tag className={`ed-serif ${className}`}>
      <Link
        to="/article/$slug"
        params={{ slug: story.slug }}
        className="after:absolute after:inset-0 hover:text-[var(--ed-accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ed-accent)]"
      >
        {story.title}
      </Link>
    </Tag>
  );
}

function Meta({ story, onListen }: { story: EditorialStory; onListen?: () => void }) {
  return (
    <ArticleMeta
      category={story.categories?.name}
      publishedAt={story.published_at}
      hasAudio={story.has_audio}
      onListen={onListen}
    />
  );
}

function Summary({
  text,
  lines = 2,
  className = "",
}: {
  text?: string | null;
  lines?: 1 | 2 | 3;
  className?: string;
}) {
  if (!text) return null;
  const clamp = lines === 1 ? "line-clamp-1" : lines === 2 ? "line-clamp-2" : "line-clamp-3";
  return (
    <p className={`font-sans text-sm leading-snug text-[var(--ed-muted)] ${clamp} ${className}`}>
      {text}
    </p>
  );
}

/**
 * Vertical stack with thin divider lines between cards (no boxes).
 * Wrap any list of cards in this.
 */
export function CardStack({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`flex flex-col divide-y divide-[var(--ed-line)] [&>*]:py-4 [&>*:first-child]:pt-0 [&>*:last-child]:pb-0 ${className}`}
    >
      {children}
    </div>
  );
}

type CardProps = {
  story: EditorialStory;
  headingLevel?: HeadingLevel;
  onListen?: () => void;
  className?: string;
};

/* ------------------------------------------------------------------ */
/* Variants                                                            */
/* ------------------------------------------------------------------ */

/** Large headline, summary, large 16:9 image (top, or beside), meta row. */
export function LeadCard({
  story,
  headingLevel = 2,
  onListen,
  className = "",
  imagePosition = "top",
}: CardProps & { imagePosition?: "top" | "right" }) {
  const beside = imagePosition === "right";
  return (
    <article
      className={`relative ${beside ? "grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1.8fr)] md:gap-6" : "flex flex-col gap-3"} ${className}`}
    >
      {!beside && <EdImage story={story} ratio="16/9" eager />}
      <div className="flex min-w-0 flex-col gap-2">
        <Headline
          story={story}
          as={`h${headingLevel}` as ElementType}
          className="text-2xl font-bold leading-tight md:text-3xl"
        />
        <Summary text={story.excerpt} lines={3} className="text-base" />
        <Meta story={story} onListen={onListen} />
      </div>
      {beside && <EdImage story={story} ratio="16/9" className="md:order-last" />}
    </article>
  );
}

/** Medium headline, one-line summary, no image. */
export function HeadlineSummaryCard({
  story,
  headingLevel = 3,
  onListen,
  className = "",
}: CardProps) {
  return (
    <article className={`relative flex flex-col gap-1.5 ${className}`}>
      <Headline
        story={story}
        as={`h${headingLevel}` as ElementType}
        className="text-xl font-bold leading-snug"
      />
      <Summary text={story.excerpt} lines={1} />
      <Meta story={story} onListen={onListen} />
    </article>
  );
}

/** Headline + summary on one side, image on the other. */
export function MediaRowCard({ story, headingLevel = 3, onListen, className = "" }: CardProps) {
  return (
    <article className={`relative flex items-start gap-4 ${className}`}>
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <Headline
          story={story}
          as={`h${headingLevel}` as ElementType}
          className="text-lg font-bold leading-snug"
        />
        <Summary text={story.excerpt} lines={2} />
        <Meta story={story} onListen={onListen} />
      </div>
      <EdImage story={story} ratio="16/9" className="w-36 shrink-0 sm:w-48" />
    </article>
  );
}

/**
 * Small headline with a small thumbnail. Square by default; `ratio="4/3"` gives
 * the wider thumb used in the hero column and county lists. `imageSide="left"`
 * moves the image visually (DOM order stays text-first for screen readers).
 */
export function CompactThumbCard({
  story,
  headingLevel = 3,
  onListen,
  className = "",
  imageSide = "right",
  ratio = "1/1",
}: CardProps & { imageSide?: "left" | "right"; ratio?: "1/1" | "4/3" }) {
  return (
    <article
      className={`relative flex items-start gap-3 ${imageSide === "left" ? "flex-row-reverse" : ""} ${className}`}
    >
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <Headline
          story={story}
          as={`h${headingLevel}` as ElementType}
          className="text-base font-semibold leading-snug"
        />
        <Meta story={story} onListen={onListen} />
      </div>
      <EdImage
        story={story}
        ratio={ratio}
        className={`shrink-0 ${ratio === "4/3" ? "w-24 sm:w-28" : "w-20"}`}
      />
    </article>
  );
}

/** Headline and meta only. */
export function TextLinkCard({ story, headingLevel = 3, onListen, className = "" }: CardProps) {
  return (
    <article className={`relative flex flex-col gap-1.5 ${className}`}>
      <Headline
        story={story}
        as={`h${headingLevel}` as ElementType}
        className="text-base font-semibold leading-snug"
      />
      <Meta story={story} onListen={onListen} />
    </article>
  );
}

/** Compact thumb carrying a "Sponsored by [name]" label instead of a category. */
export function SponsoredCard({ story, headingLevel = 3, className = "" }: CardProps) {
  return (
    <article className={`relative flex items-start gap-3 ${className}`}>
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <Headline
          story={story}
          as={`h${headingLevel}` as ElementType}
          className="text-base font-semibold leading-snug"
        />
        <p className="font-sans text-[11px] leading-none text-[var(--ed-muted)]">
          {story.sponsor_name ? `Sponsored by ${story.sponsor_name}` : "Sponsored"}
        </p>
      </div>
      <EdImage story={story} ratio="1/1" className="w-20 shrink-0" />
    </article>
  );
}
