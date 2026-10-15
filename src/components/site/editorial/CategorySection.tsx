import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { CardStack, CompactThumbCard, LeadCard, TextLinkCard } from "./cards";
import type { EditorialStory } from "./types";

export type CategoryLayout = "africa" | "politics" | "standard";

/** Column wrapper: adds the divider line (horizontal when stacked, vertical when side by side). */
function Col({ children, divided = false }: { children: ReactNode; divided?: boolean }) {
  return (
    <div
      className={
        divided
          ? "min-w-0 border-t border-[var(--ed-line)] pt-6 min-[900px]:border-l min-[900px]:border-t-0 min-[900px]:pl-6 min-[900px]:pt-0"
          : "min-w-0 min-[900px]:pr-6"
      }
    >
      {children}
    </div>
  );
}

type SectionCategory = { name: string; slug: string };

/**
 * Each layout turns an ordered list of stories into markup. The first story is
 * the lead; the rest fill the remaining slots. Adding a section style means
 * adding one entry here and one value to CategoryLayout.
 */
const LAYOUTS: Record<CategoryLayout, (stories: EditorialStory[]) => ReactNode> = {
  /** Lead (text left, image right) beside a text-only list. */
  africa: ([lead, ...rest]) => (
    <div className="grid grid-cols-1 gap-8 min-[900px]:grid-cols-[2fr_1fr] min-[900px]:gap-0">
      <div className="min-w-0 min-[900px]:pr-6">
        {lead && <LeadCard story={lead} headingLevel={3} imagePosition="right" />}
      </div>
      {rest.length > 0 && (
        <div className="min-w-0 border-t border-[var(--ed-line)] pt-6 min-[900px]:border-l min-[900px]:border-t-0 min-[900px]:pl-6 min-[900px]:pt-0">
          <CardStack>
            {rest.map((s) => (
              <TextLinkCard key={s.id} story={s} headingLevel={4} />
            ))}
          </CardStack>
        </div>
      )}
    </div>
  ),

  /** Lead (image on top) | compact thumbs | text-only links. */
  politics: ([lead, ...rest]) => {
    const thumbs = rest.slice(0, 3);
    const links = rest.slice(3);
    const cols =
      links.length > 0
        ? "min-[900px]:grid-cols-[1.4fr_1fr_1fr]"
        : "min-[900px]:grid-cols-[1.4fr_1fr]";
    return (
      <div className={`grid grid-cols-1 gap-8 min-[900px]:gap-0 ${cols}`}>
        <Col>{lead && <LeadCard story={lead} headingLevel={3} imagePosition="top" />}</Col>
        {thumbs.length > 0 && (
          <Col divided>
            <CardStack>
              {thumbs.map((s) => (
                <CompactThumbCard key={s.id} story={s} headingLevel={4} />
              ))}
            </CardStack>
          </Col>
        )}
        {links.length > 0 && (
          <Col divided>
            <CardStack>
              {links.map((s) => (
                <TextLinkCard key={s.id} story={s} headingLevel={4} />
              ))}
            </CardStack>
          </Col>
        )}
      </div>
    );
  },

  /** Generic fallback for any other category: lead (image on top) beside compact thumbs. */
  standard: ([lead, ...rest]) => (
    <div className="grid grid-cols-1 gap-8 min-[900px]:grid-cols-[1.4fr_1fr] min-[900px]:gap-0">
      <Col>{lead && <LeadCard story={lead} headingLevel={3} imagePosition="top" />}</Col>
      {rest.length > 0 && (
        <Col divided>
          <CardStack>
            {rest.map((s) => (
              <CompactThumbCard key={s.id} story={s} headingLevel={4} />
            ))}
          </CardStack>
        </Col>
      )}
    </div>
  ),
};

/**
 * Category block: header row (red uppercase label + "All [Category] →") and a
 * grid chosen by `layout`. Renders nothing when there are no stories.
 */
export function CategorySection({
  category,
  stories,
  layout,
  className = "",
}: {
  category: SectionCategory;
  stories: EditorialStory[];
  layout: CategoryLayout;
  className?: string;
}) {
  if (stories.length === 0) return null;
  const headingId = `ed-cat-${category.slug}`;

  return (
    <section aria-labelledby={headingId} className={className}>
      <div className="mb-4 flex items-baseline justify-between gap-4 border-b border-[var(--ed-line)] pb-2">
        <h2
          id={headingId}
          className="font-sans text-sm font-extrabold uppercase tracking-wider text-[var(--ed-accent)]"
        >
          {category.name}
        </h2>
        <Link
          to="/category/$slug"
          params={{ slug: category.slug }}
          className="font-sans text-xs font-semibold hover:text-[var(--ed-accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ed-accent)]"
        >
          All {category.name} <span aria-hidden="true">→</span>
        </Link>
      </div>
      {LAYOUTS[layout](stories)}
    </section>
  );
}
