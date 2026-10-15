import {
  CardStack,
  CompactThumbCard,
  HeadlineSummaryCard,
  LeadCard,
  MediaRowCard,
  SponsoredCard,
  TextLinkCard,
} from "./cards";
import { DUMMY_STORIES as s } from "./dummy";
import { CategorySection } from "./CategorySection";
import { TopSection } from "./TopSection";

/**
 * Temporary showcase of every card variant with dummy data, for visual review
 * during the build. Not mounted anywhere yet; removed once the real homepage
 * is wired up.
 */
export function EditorialPreview() {
  return (
    <div className="editorial">
      <div className="container-page py-8">
        <TopSection
          lead={s[0]}
          headlineSummary={[s[1]]}
          mediaRows={[s[2]]}
          compactThumbs={[s[3]]}
          textLinks={[s[4]]}
          video={s[2]}
          live={[s[0], s[1], s[3]]}
          latest={[s[1], s[3], s[4]]}
          brandBook={[s[5]]}
        />

        <hr className="my-10 border-[var(--ed-line)]" />

        <CategorySection
          category={{ name: "Africa", slug: "africa" }}
          stories={[s[2], s[1], s[3], s[4]]}
          layout="africa"
        />

        <hr className="my-10 border-[var(--ed-line)]" />

        <CategorySection
          category={{ name: "Politics", slug: "politics" }}
          stories={[s[0], s[3], s[2], s[1], s[4], s[5]]}
          layout="politics"
        />

        <hr className="my-10 border-[var(--ed-line)]" />

        <CategorySection
          category={{ name: "Sport", slug: "sport" }}
          stories={[s[3], s[2], s[1]]}
          layout="standard"
        />

        <hr className="my-10 border-[var(--ed-line)]" />

        <div className="max-w-xl">
          <CardStack>
            <LeadCard story={s[0]} />
            <HeadlineSummaryCard story={s[1]} />
            <MediaRowCard story={s[2]} />
            <CompactThumbCard story={s[3]} />
            <TextLinkCard story={s[4]} />
            <SponsoredCard story={s[5]} />
          </CardStack>
        </div>
      </div>
    </div>
  );
}
