import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { CardStack, CompactThumbCard, LeadCard, TextLinkCard } from "./cards";
import type { EditorialStory } from "./types";

export type CategoryLayout = "africa" | "politics" | "counties" | "opinion" | "standard";

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

/** A small link shown in the header row instead of "All [Category] →" (e.g. "Coast"). */
export type SubLink = { label: string; slug: string };

/** Lead (text left, big image right) beside a text-only list. */
const leadBesideList = ([lead, ...rest]: EditorialStory[]): ReactNode => (
  <div className="grid grid-cols-1 gap-8 min-[900px]:grid-cols-[2fr_1fr] min-[900px]:gap-0">
    <Col>{lead && <LeadCard story={lead} headingLevel={3} imagePosition="right" />}</Col>
    {rest.length > 0 && (
      <Col divided>
        <CardStack>
          {rest.map((s) => (
            <TextLinkCard key={s.id} story={s} headingLevel={4} />
          ))}
        </CardStack>
      </Col>
    )}
  </div>
);

/**
 * Each layout turns an ordered list of stories into markup. The first story is
 * the lead; the rest fill the remaining slots. Adding a section style means
 * adding one entry here and one value to CategoryLayout.
 */
const LAYOUTS: Record<CategoryLayout, (stories: EditorialStory[]) => ReactNode> = {
  africa: leadBesideList,

  /** Same shape as Africa; kept as its own key so opinion can diverge later. */
  opinion: leadBesideList,

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

  /** Three equal columns: thumbs (image left) | text links | text links. No lead. */
  counties: (stories) => {
    const thumbs = stories.slice(0, 4);
    const rest = stories.slice(4);
    const half = Math.ceil(rest.length / 2);
    const colA = rest.slice(0, half);
    const colB = rest.slice(half);
    return (
      <div className="grid grid-cols-1 gap-8 min-[900px]:grid-cols-3 min-[900px]:gap-0">
        <Col>
          <CardStack>
            {thumbs.map((s) => (
              <CompactThumbCard
                key={s.id}
                story={s}
                headingLevel={3}
                imageSide="left"
                ratio="4/3"
              />
            ))}
          </CardStack>
        </Col>
        {colA.length > 0 && (
          <Col divided>
            <CardStack>
              {colA.map((s) => (
                <TextLinkCard key={s.id} story={s} headingLevel={4} />
              ))}
            </CardStack>
          </Col>
        )}
        {colB.length > 0 && (
          <Col divided>
            <CardStack>
              {colB.map((s) => (
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

const linkClass =
  "font-sans text-xs font-semibold hover:text-[var(--ed-accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ed-accent)]";

/**
 * Category block: header row (red uppercase label + "All [Category] →", or a
 * row of sub-links) and a grid chosen by `layout`. Renders nothing when there
 * are no stories.
 */
export function CategorySection({
  category,
  stories,
  layout,
  subLinks,
  className = "",
}: {
  category: SectionCategory;
  stories: EditorialStory[];
  layout: CategoryLayout;
  subLinks?: SubLink[];
  className?: string;
}) {
  if (stories.length === 0) return null;
  const headingId = `ed-cat-${category.slug}`;

  return (
    <section aria-labelledby={headingId} className={className}>
      <div className="mb-4 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2 border-b border-[var(--ed-line)] pb-2">
        <h2
          id={headingId}
          className="font-sans text-sm font-extrabold uppercase tracking-wider text-[var(--ed-accent)]"
        >
          {category.name}
        </h2>
        {subLinks && subLinks.length > 0 ? (
          <nav aria-label={`${category.name} sections`} className="flex flex-wrap gap-x-4 gap-y-1">
            {subLinks.map((l) => (
              <Link
                key={l.slug}
                to="/category/$slug"
                params={{ slug: l.slug }}
                className={linkClass}
              >
                {l.label}
              </Link>
            ))}
          </nav>
        ) : (
          <Link to="/category/$slug" params={{ slug: category.slug }} className={linkClass}>
            All {category.name} <span aria-hidden="true">→</span>
          </Link>
        )}
      </div>
      {LAYOUTS[layout](stories)}
    </section>
  );
}
