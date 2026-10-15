import type { EditorialStory } from "./types";

/** Placeholder stories for previewing the card variants. Replaced by real data in a later step. */
const minutesAgo = (m: number) => new Date(Date.now() - m * 60_000).toISOString();

const base = (
  n: number,
  title: string,
  category: string,
  mins: number,
  extra: Partial<EditorialStory> = {},
): EditorialStory => ({
  id: `dummy-${n}`,
  slug: `dummy-story-${n}`,
  title,
  excerpt:
    "A short summary line that explains the story in a sentence or two so readers know what to expect.",
  featured_image: null,
  published_at: minutesAgo(mins),
  categories: { name: category, slug: category.toLowerCase() },
  ...extra,
});

export const DUMMY_STORIES: EditorialStory[] = [
  base(1, "Lead story headline runs long enough to wrap onto two lines", "Politics", 37, {
    has_audio: true,
  }),
  base(2, "Headline with a one-line summary and no image", "Business", 55),
  base(3, "Media row story with the picture on the right-hand side", "Africa", 130),
  base(4, "Compact thumbnail story with a short headline", "Sport", 200),
  base(5, "Text-only link story", "Politics", 1500),
  base(6, "A partner story from our sponsor", "Brand Book", 400, { sponsor_name: "Acme Bank" }),
];
