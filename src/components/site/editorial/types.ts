import type { ArticleWithMeta } from "@/lib/queries";

/**
 * The shape the editorial cards render. Real articles (ArticleWithMeta) already
 * satisfy it; the optional fields are the ones the database does not have yet
 * (see the proposed migration), so cards degrade gracefully without them.
 */
export type EditorialStory = Pick<
  ArticleWithMeta,
  "id" | "slug" | "title" | "excerpt" | "featured_image" | "published_at"
> & {
  categories: Pick<NonNullable<ArticleWithMeta["categories"]>, "name" | "slug"> | null;
  has_audio?: boolean | null;
  sponsor_name?: string | null;
};

export type HeadingLevel = 1 | 2 | 3 | 4;
