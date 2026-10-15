import {
  CardStack,
  CompactThumbCard,
  HeadlineSummaryCard,
  LeadCard,
  MediaRowCard,
  TextLinkCard,
} from "./cards";
import { BrandBookList, LatestList, LiveUpdatesBox, RailVideo } from "./rail";
import type { EditorialStory } from "./types";

export type TopSectionProps = {
  /** Left column, top to bottom. Missing slots are simply skipped. */
  lead?: EditorialStory;
  headlineSummary?: EditorialStory[];
  mediaRows?: EditorialStory[];
  compactThumbs?: EditorialStory[];
  textLinks?: EditorialStory[];
  /** Right rail. */
  video?: EditorialStory;
  live?: EditorialStory[];
  latest?: EditorialStory[];
  brandBook?: EditorialStory[];
};

/**
 * Top of the homepage: ~2fr / 1fr with a vertical divider. Both columns stack
 * into one under 900px (left column first, then the rail with a top divider).
 */
export function TopSection({
  lead,
  headlineSummary = [],
  mediaRows = [],
  compactThumbs = [],
  textLinks = [],
  video,
  live = [],
  latest = [],
  brandBook = [],
}: TopSectionProps) {
  const hasRail = video || live.length || latest.length || brandBook.length;

  return (
    <section
      aria-label="Top stories"
      className="grid grid-cols-1 gap-8 min-[900px]:grid-cols-[2fr_1fr] min-[900px]:gap-0"
    >
      <div className="min-w-0 min-[900px]:pr-6">
        <CardStack>
          {lead && <LeadCard story={lead} headingLevel={2} imagePosition="right" />}
          {headlineSummary.map((s) => (
            <HeadlineSummaryCard key={s.id} story={s} />
          ))}
          {mediaRows.map((s) => (
            <MediaRowCard key={s.id} story={s} />
          ))}
          {compactThumbs.map((s) => (
            <CompactThumbCard key={s.id} story={s} />
          ))}
          {textLinks.map((s) => (
            <TextLinkCard key={s.id} story={s} />
          ))}
        </CardStack>
      </div>

      {hasRail && (
        <aside
          aria-label="More from the newsroom"
          className="flex min-w-0 flex-col gap-8 border-t border-[var(--ed-line)] pt-8 min-[900px]:border-l min-[900px]:border-t-0 min-[900px]:pl-6 min-[900px]:pt-0"
        >
          {video && <RailVideo story={video} />}
          <LiveUpdatesBox stories={live} />
          <LatestList stories={latest} />
          <BrandBookList stories={brandBook} />
        </aside>
      )}
    </section>
  );
}
