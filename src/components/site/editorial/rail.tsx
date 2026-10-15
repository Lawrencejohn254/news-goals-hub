import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Play } from "lucide-react";
import { relativeTimeLong } from "@/lib/format";
import { CardStack, SponsoredCard, TextLinkCard } from "./cards";
import type { EditorialStory } from "./types";

/** Small uppercase heading used by every rail block. */
function RailHeading({ id, children }: { id: string; children: ReactNode }) {
  return (
    <h2
      id={id}
      className="mb-3 border-b border-[var(--ed-line)] pb-2 font-sans text-xs font-bold uppercase tracking-wider text-[var(--ed-accent)]"
    >
      {children}
    </h2>
  );
}

/** Video feature: 16:9 poster with a play badge, headline underneath. */
export function RailVideo({ story }: { story: EditorialStory }) {
  return (
    <article className="relative flex flex-col gap-2">
      <div className="relative aspect-video overflow-hidden bg-[var(--ed-surface)]">
        {story.featured_image && (
          <img
            src={story.featured_image}
            alt=""
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover"
          />
        )}
        <span
          aria-hidden="true"
          className="absolute left-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-[var(--ed-accent)] text-white"
        >
          <Play className="h-4 w-4 fill-current" />
        </span>
      </div>
      <h3 className="ed-serif text-lg font-bold leading-snug">
        <Link
          to="/article/$slug"
          params={{ slug: story.slug }}
          className="after:absolute after:inset-0 hover:text-[var(--ed-accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ed-accent)]"
        >
          <span className="sr-only">Video: </span>
          {story.title}
        </Link>
      </h3>
    </article>
  );
}

/** "Live news updates": a short timeline of the newest breaking items. */
export function LiveUpdatesBox({
  stories,
  className = "",
}: {
  stories: EditorialStory[];
  className?: string;
}) {
  if (stories.length === 0) return null;
  return (
    <section aria-labelledby="ed-live" className={className}>
      <RailHeading id="ed-live">
        <span className="inline-flex items-center gap-2">
          <span aria-hidden="true" className="h-2 w-2 rounded-full bg-[var(--ed-accent)]" />
          Live news updates
        </span>
      </RailHeading>
      <ol className="flex flex-col gap-3 border-l border-[var(--ed-line)] pl-4">
        {stories.map((s) => (
          <li key={s.id} className="relative">
            {s.published_at && (
              <time
                dateTime={s.published_at}
                className="block font-sans text-[11px] text-[var(--ed-muted)]"
              >
                {relativeTimeLong(s.published_at)}
              </time>
            )}
            <Link
              to="/article/$slug"
              params={{ slug: s.slug }}
              className="ed-serif text-base font-semibold leading-snug hover:text-[var(--ed-accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ed-accent)]"
            >
              {s.title}
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}

/** Titled list of text-only links ("Latest"). */
export function LatestList({
  stories,
  className = "",
}: {
  stories: EditorialStory[];
  className?: string;
}) {
  if (stories.length === 0) return null;
  return (
    <section aria-labelledby="ed-latest" className={className}>
      <RailHeading id="ed-latest">Latest</RailHeading>
      <CardStack>
        {stories.map((s) => (
          <TextLinkCard key={s.id} story={s} headingLevel={3} />
        ))}
      </CardStack>
    </section>
  );
}

/** Titled list of sponsored compact thumbs ("Brand Book"). */
export function BrandBookList({
  stories,
  className = "",
}: {
  stories: EditorialStory[];
  className?: string;
}) {
  if (stories.length === 0) return null;
  return (
    <section aria-labelledby="ed-brand" className={className}>
      <RailHeading id="ed-brand">Brand Book</RailHeading>
      <CardStack>
        {stories.map((s) => (
          <SponsoredCard key={s.id} story={s} headingLevel={3} />
        ))}
      </CardStack>
    </section>
  );
}
