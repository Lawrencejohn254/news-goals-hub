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
  const { data, error } = await supabase
    .from("articles")
    .select(ARTICLE_SELECT)
    .eq("status", "published")
    .lte("published_at", new Date().toISOString())
    .order("is_pinned", { ascending: false })
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

export async function fetchArticleBySlug(slug: string) {
  const { data, error } = await supabase
    .from("articles")
    .select(ARTICLE_SELECT)
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  return data as unknown as ArticleWithMeta | null;
}

export async function fetchArticlesByCategory(categorySlug: string, limit = 30) {
  const { data: cat } = await supabase
    .from("categories")
    .select("id,name,slug,color,description")
    .eq("slug", categorySlug)
    .maybeSingle();
  if (!cat) return { category: null, articles: [] as ArticleWithMeta[] };
  const { data, error } = await supabase
    .from("articles")
    .select(ARTICLE_SELECT)
    .eq("status", "published")
    .eq("category_id", cat.id)
    .lte("published_at", new Date().toISOString())
    .order("published_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return { category: cat, articles: (data ?? []) as unknown as ArticleWithMeta[] };
}