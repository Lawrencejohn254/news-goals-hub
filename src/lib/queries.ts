import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type Article = Database["public"]["Tables"]["articles"]["Row"];
export type Category = Database["public"]["Tables"]["categories"]["Row"];

export type ArticleWithMeta = Article & {
  categories: Pick<Category, "id" | "name" | "slug" | "color"> | null;
  profiles: { display_name: string | null; avatar_url: string | null; bio: string | null } | null;
};

const ARTICLE_SELECT =
  "*, categories(id,name,slug,color), profiles!articles_author_profile_fkey(display_name,avatar_url,bio)";

// Lean column list for story cards (homepage, section pages). It leaves out the
// full article body and SEO fields, which are by far the heaviest columns and
// are sent to every visitor inside the page HTML. Article pages still use
// ARTICLE_SELECT so they get everything.
const CARD_SELECT: string =
  "id,slug,title,excerpt,featured_image,published_at,category_id,is_breaking,has_audio,sponsor_name,article_type,categories(id,name,slug,color)";

export async function fetchCategories() {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("is_enabled", true)
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function fetchPublishedArticles(limit = 20, offset = 0) {
  // Pure chronological order — newest published first, full stop. This
  // previously sorted "pinned" articles ahead of everything else
  // regardless of date, which is why the homepage could show an August 21
  // article above an August 25 one: any article ever marked pinned jumped
  // the queue. Removed so "Latest News" always means latest, and older
  // articles fall away naturally (they're still reachable on their
  // category page — nothing is deleted, just no longer on the homepage).
  const { data, error } = await supabase
    .from("articles")
    .select(CARD_SELECT)
    .eq("status", "published")
    .lte("published_at", new Date().toISOString())
    .order("published_at", { ascending: false })
    .range(offset, offset + limit - 1);
  if (error) throw error;
  return (data ?? []) as unknown as ArticleWithMeta[];
}

export async function fetchFeaturedArticles(limit = 5) {
  const { data, error } = await supabase
    .from("articles")
    .select(ARTICLE_SELECT)
    .eq("status", "published")
    .eq("is_featured", true)
    .lte("published_at", new Date().toISOString())
    .order("published_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data ?? []) as unknown as ArticleWithMeta[];
}

export async function fetchBreaking(limit = 8) {
  const { data, error } = await supabase
    .from("articles")
    .select(CARD_SELECT)
    .eq("status", "published")
    .eq("is_breaking", true)
    .lte("published_at", new Date().toISOString())
    .order("published_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data ?? []) as unknown as ArticleWithMeta[];
}

export async function fetchMostRead(limit = 5) {
  const { data, error } = await supabase
    .from("articles")
    .select(ARTICLE_SELECT)
    .eq("status", "published")
    .lte("published_at", new Date().toISOString())
    .order("view_count", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data ?? []) as unknown as ArticleWithMeta[];
}

/**
 * "Trending" = published in the last 7 days, ranked by view count.
 * This differs from fetchMostRead (all-time views), surfacing stories
 * that are getting attention *right now* rather than old evergreen hits.
 */
export async function fetchTrending(limit = 6, windowDays = 7) {
  const since = new Date(Date.now() - windowDays * 24 * 60 * 60 * 1000).toISOString();
  const { data, error } = await supabase
    .from("articles")
    .select(ARTICLE_SELECT)
    .eq("status", "published")
    .lte("published_at", new Date().toISOString())
    .gte("published_at", since)
    .order("view_count", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data ?? []) as unknown as ArticleWithMeta[];
}

export async function fetchRelatedArticles(
  categoryId: string | null,
  excludeId: string,
  publishedAt: string | null,
  limit = 6,
) {
  const now = new Date().toISOString();
  let query = supabase
    .from("articles")
    .select(ARTICLE_SELECT)
    .eq("status", "published")
    .lte("published_at", now)
    .neq("id", excludeId)
    .order("published_at", { ascending: false })
    .limit(limit);
  if (categoryId) query = query.eq("category_id", categoryId);
  if (publishedAt) query = query.lt("published_at", publishedAt);
  const { data, error } = await query;
  if (error) throw error;
  const items = (data ?? []) as unknown as ArticleWithMeta[];
  if (items.length >= 4) return items;

  // Not enough older stories in this section: top up with the newest overall.
  const { data: more } = await supabase
    .from("articles")
    .select(ARTICLE_SELECT)
    .eq("status", "published")
    .lte("published_at", now)
    .neq("id", excludeId)
    .order("published_at", { ascending: false })
    .limit(limit);
  const seen = new Set(items.map((a) => a.id));
  const extra = ((more ?? []) as unknown as ArticleWithMeta[]).filter((a) => !seen.has(a.id));
  return [...items, ...extra].slice(0, limit);
}

export async function fetchArticleBySlug(slug: string) {
  const { data, error } = await supabase
    .from("articles")
    .select(ARTICLE_SELECT)
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  return data as unknown as ArticleWithMeta | null;
}

export async function fetchArticlesByCategory(categorySlug: string, limit = 100) {
  const { data: cat } = await supabase
    .from("categories")
    .select("id,name,slug,color,description")
    .eq("slug", categorySlug)
    .maybeSingle();
  if (!cat) return { category: null, articles: [] as ArticleWithMeta[] };
  const { data, error } = await supabase
    .from("articles")
    .select(CARD_SELECT)
    .eq("status", "published")
    .eq("category_id", cat.id)
    .lte("published_at", new Date().toISOString())
    .order("published_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return { category: cat, articles: (data ?? []) as unknown as ArticleWithMeta[] };
}
export type AuthorProfile = {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  created_at: string;
};

/**
 * Public author page data: the profile plus only their *published* articles
 * (drafts are never exposed here, regardless of who's viewing).
 */
export async function fetchAuthorWithArticles(authorId: string) {
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id,display_name,avatar_url,bio,created_at")
    .eq("id", authorId)
    .maybeSingle();
  if (profileError) throw profileError;
  if (!profile) return { profile: null as AuthorProfile | null, articles: [] as ArticleWithMeta[] };

  const { data: articles, error: articlesError } = await supabase
    .from("articles")
    .select(ARTICLE_SELECT)
    .eq("author_id", authorId)
    .eq("status", "published")
    .lte("published_at", new Date().toISOString())
    .order("published_at", { ascending: false })
    .limit(50);
  if (articlesError) throw articlesError;

  return {
    profile: profile as AuthorProfile,
    articles: (articles ?? []) as unknown as ArticleWithMeta[],
  };
}