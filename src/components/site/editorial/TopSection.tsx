import type { ReactNode } from "react";
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

/**
 * One block in the left column. The homepage picks which blocks appear and in
 * what order, so the rhythm (lead, pair, lead, text row...) is data, not markup.
 */
export type TopBlock =
  | { type: "lead"; story: EditorialStory }
  | { type: "pair"; stories: EditorialStory[]; variant?: "headline" | "thumb" }
  | { type: "media"; story: EditorialStory }
  | { type: "text"; story: EditorialStory };

export type TopSectionProps = {
  /** Full-width band: lead (text left, big image) beside a column of thumbs. */
  hero?: EditorialStory;
  heroThumbs?: EditorialStory[];
  /** Left column under the band. */
  blocks?: TopBlock[];
  /** Right rail. */
  video?: EditorialStory;
  live?: EditorialStory[];
  latest?: EditorialStory[];
  brandBook?: EditorialStory[];
};

/** Two cards side by side with a thin vertical divider; stacks on small screens. */
function Pair({
  stories,
  variant = "headline",
}: {
  stories: EditorialStory[];
  variant?: "headline" | "thumb";
}) {
  const cell = (s: EditorialStory): ReactNode =>
    variant === "thumb" ? (
      <CompactThumbCard story={s} headingLevel={3} />
    ) : (
      <HeadlineSummaryCard story={s} headingLevel={3} />
    );
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-0">
      {stories.slice(0, 2).map((s, i) => (
        <div
          key={s.id}
          className={
            i === 0
              ? "min-w-0 sm:pr-4"
              : "min-w-0 border-t border-[var(--ed-line)] pt-4 sm:border-l sm:border-t-0 sm:pl-4 sm:pt-0"
          }
        >
          {cell(s)}
        </div>
      ))}
    </div>
  );
}

function renderBlock(b: TopBlock): ReactNode {
  switch (b.type) {
    case "lead":
      return <LeadCard story={b.story} headingLevel={2} imagePosition="right" />;
    case "pair":
      return <Pair stories={b.stories} variant={b.variant} />;
    case "media":
      return <MediaRowCard story={b.story} />;
    case "text":
      return <TextLinkCard story={b.story} />;
  }
}

/**
 * Top of the homepage. Band 1 (full width): hero lead + thumbs column, split
 * ~2fr / 1fr. Band 2: left column of blocks + right rail, split ~2fr / 1fr.
 * Everything collapses to one column under 900px.
 */
export function TopSection({
  hero,
  heroThumbs = [],
  blocks = [],
  video,
  live = [],
  latest = [],
  brandBook = [],
}: TopSectionProps) {
  const hasRail = video || live.length || latest.length || brandBook.length;

  return (
    <div aria-label="Top stories" role="region" className="flex flex-col gap-8">
      {hero && (
        <div className="grid grid-cols-1 gap-8 border-b border-[var(--ed-line)] pb-8 min-[900px]:grid-cols-[2fr_1fr] min-[900px]:gap-0">
          <div className="min-w-0 min-[900px]:pr-6">
            <LeadCard story={hero} headingLevel={1} imagePosition="right" />
          </div>
          {heroThumbs.length > 0 && (
            <div className="min-w-0 border-t border-[var(--ed-line)] pt-6 min-[900px]:border-l min-[900px]:border-t-0 min-[900px]:pl-6 min-[900px]:pt-0">
              <CardStack>
                {heroThumbs.map((s) => (
                  <CompactThumbCard key={s.id} story={s} imageSide="left" ratio="4/3" />
                ))}
              </CardStack>
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 gap-8 min-[900px]:grid-cols-[2fr_1fr] min-[900px]:gap-0">
        <div className="min-w-0 min-[900px]:pr-6">
          <CardStack>
            {blocks.map((b, i) => (
              <div key={i}>{renderBlock(b)}</div>
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
      </div>
    </div>
  );
}
