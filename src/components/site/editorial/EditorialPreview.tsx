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

/**
 * Temporary showcase of every card variant with dummy data, for visual review
 * during the build. Not mounted anywhere yet; removed once the real homepage
 * is wired up.
 */
export function EditorialPreview() {
  return (
    <div className="editorial">
      <div className="container-page py-8">
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
