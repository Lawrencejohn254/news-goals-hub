import { useMemo } from "react";
import type { ArticleWithMeta, Category } from "@/lib/queries";
import { CategorySection, type CategoryLayout } from "./CategorySection";
import { TopSection, type TopBlock } from "./TopSection";
import { createPicker } from "./picker";

/**
 * Which layout (and how many stories) each category section gets, keyed by
 * category slug. Any category not listed uses DEFAULT_SECTION. This is the one
 * place to edit when you add or restyle a section.
 */
const SECTION_BY_SLUG: Record<string, { layout: CategoryLayout; count: number }> = {
  politics: { layout: "politics", count: 8 },
  africa: { layout: "africa", count: 5 },
  opinion: { layout: "opinion", count: 5 },
  "local-news": { layout: "counties", count: 12 },
  counties: { layout: "counties", count: 12 },
};
const DEFAULT_SECTION: { layout: CategoryLayout; count: number } = { layout: "standard", count: 4 };

/**
 * Editorial homepage body: hero band, block column + rail, then one section per
 * category. `latest` must be newest-first. Returns null when there is nothing
 * to show so the route can render its own empty state.
 */
export function EditorialHome({
  latest,
  breaking,
  categories,
}: {
  latest: ArticleWithMeta[];
  breaking: ArticleWithMeta[];
  categories: Category[];
}) {
  const layout = useMemo(() => {
    const take = createPicker();

    // Top band.
    const [hero] = take(latest, 1, true);
    const heroThumbs = take(latest, 3, true);

    // Rail: breaking stories feed "Live news updates".
    const live = take(breaking, 4);

    // Left column rhythm: lead, pair, pair (thumbs), text, lead, media row.
    const blocks: TopBlock[] = [];
    const lead1 = take(latest, 1, true)[0];
    if (lead1) blocks.push({ type: "lead", story: lead1 });
    const pairA = take(latest, 2);
    if (pairA.length) blocks.push({ type: "pair", stories: pairA, variant: "headline" });
    const pairB = take(latest, 2, true);
    if (pairB.length) blocks.push({ type: "pair", stories: pairB, variant: "thumb" });
    const text = take(latest, 1)[0];
    if (text) blocks.push({ type: "text", story: text });
    const lead2 = take(latest, 1, true)[0];
    if (lead2) blocks.push({ type: "lead", story: lead2 });
    const media = take(latest, 1, true)[0];
    if (media) blocks.push({ type: "media", story: media });

    const latestRail = take(latest, 5, true);

    // One section per category, from whatever is still unused.
    const sections = categories
      .map((c) => {
        const cfg = SECTION_BY_SLUG[c.slug] ?? DEFAULT_SECTION;
        const stories = take(
          latest.filter((a) => a.categories?.id === c.id),
          cfg.count,
          true,
        );
        return { category: c, layout: cfg.layout, stories };
      })
      .filter((s) => s.stories.length > 0);

    return { hero, heroThumbs, live, blocks, latestRail, sections };
  }, [latest, breaking, categories]);

  if (!layout.hero) return null;

  return (
    <div className="editorial flex flex-col gap-12">
      <TopSection
        hero={layout.hero}
        heroThumbs={layout.heroThumbs}
        blocks={layout.blocks}
        live={layout.live}
        latest={layout.latestRail}
      />
      {layout.sections.map((s) => (
        <CategorySection
          key={s.category.id}
          category={{ name: s.category.name, slug: s.category.slug }}
          stories={s.stories}
          layout={s.layout}
        />
      ))}
    </div>
  );
}
