import { useMemo, useState } from "react";
import type { ArticleWithMeta } from "@/lib/queries";
import { CardStack, MediaRowCard } from "./cards";
import { createPicker } from "./picker";
import { TopSection, type TopBlock } from "./TopSection";

const MORE_PAGE_SIZE = 12;

/**
 * Body of a category page in the editorial style: title row, hero band, block
 * column + "Latest" rail, then the rest of the section as a "load more" list.
 * `articles` must be newest-first. Every story is used in exactly one slot.
 */
export function EditorialCategory({
  category,
  articles,
}: {
  category: { name: string; description?: string | null };
  articles: ArticleWithMeta[];
}) {
  const [shown, setShown] = useState(MORE_PAGE_SIZE);

  const layout = useMemo(() => {
    const take = createPicker();
    const [hero] = take(articles, 1, true);
    const heroThumbs = take(articles, 3, true);

    const blocks: TopBlock[] = [];
    const lead = take(articles, 1, true)[0];
    if (lead) blocks.push({ type: "lead", story: lead });
    const pairA = take(articles, 2);
    if (pairA.length) blocks.push({ type: "pair", stories: pairA, variant: "headline" });
    const pairB = take(articles, 2, true);
    if (pairB.length) blocks.push({ type: "pair", stories: pairB, variant: "thumb" });
    const text = take(articles, 1)[0];
    if (text) blocks.push({ type: "text", story: text });

    const latestRail = take(articles, 5, true);
    // Everything left over, still newest-first.
    const more = take(articles, articles.length);
    return { hero, heroThumbs, blocks, latestRail, more };
  }, [articles]);

  return (
    <div className="editorial flex flex-col gap-10">
      <header className="border-b border-[var(--ed-line)] pb-4">
        <h1 className="font-sans text-2xl font-extrabold uppercase tracking-wider text-[var(--ed-accent)]">
          {category.name}
        </h1>
        {category.description && (
          <p className="mt-2 max-w-2xl font-sans text-sm text-[var(--ed-muted)]">
            {category.description}
          </p>
        )}
      </header>

      <TopSection
        hero={layout.hero}
        heroHeadingLevel={2}
        heroThumbs={layout.heroThumbs}
        blocks={layout.blocks}
        latest={layout.latestRail}
      />

      {layout.more.length > 0 && (
        <section aria-labelledby="ed-more">
          <h2
            id="ed-more"
            className="mb-4 border-b border-[var(--ed-line)] pb-2 font-sans text-sm font-extrabold uppercase tracking-wider text-[var(--ed-accent)]"
          >
            More in {category.name}
          </h2>
          <CardStack>
            {layout.more.slice(0, shown).map((s) => (
              <MediaRowCard key={s.id} story={s} headingLevel={3} />
            ))}
          </CardStack>
          {shown < layout.more.length && (
            <button
              type="button"
              onClick={() => setShown((n) => n + MORE_PAGE_SIZE)}
              className="mt-6 border border-[var(--ed-line)] px-4 py-2 font-sans text-sm font-semibold hover:border-[var(--ed-accent)] hover:text-[var(--ed-accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ed-accent)]"
            >
              Load more
            </button>
          )}
        </section>
      )}
    </div>
  );
}
