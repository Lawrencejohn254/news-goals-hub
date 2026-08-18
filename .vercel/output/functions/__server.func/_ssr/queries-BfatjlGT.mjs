import { t as supabase } from "./client-CZsxps-O.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/queries-BfatjlGT.js
var ARTICLE_SELECT = "*, categories(id,name,slug,color), profiles!articles_author_profile_fkey(display_name,avatar_url,bio)";
async function fetchCategories() {
	const { data, error } = await supabase.from("categories").select("*").eq("is_enabled", true).order("sort_order", { ascending: true });
	if (error) throw error;
	return data ?? [];
}
async function fetchPublishedArticles(limit = 20, offset = 0) {
	const { data, error } = await supabase.from("articles").select(ARTICLE_SELECT).eq("status", "published").lte("published_at", (/* @__PURE__ */ new Date()).toISOString()).order("is_pinned", { ascending: false }).order("published_at", { ascending: false }).range(offset, offset + limit - 1);
	if (error) throw error;
	return data ?? [];
}
async function fetchFeaturedArticles(limit = 5) {
	const { data, error } = await supabase.from("articles").select(ARTICLE_SELECT).eq("status", "published").eq("is_featured", true).lte("published_at", (/* @__PURE__ */ new Date()).toISOString()).order("published_at", { ascending: false }).limit(limit);
	if (error) throw error;
	return data ?? [];
}
async function fetchMostRead(limit = 5) {
	const { data, error } = await supabase.from("articles").select(ARTICLE_SELECT).eq("status", "published").lte("published_at", (/* @__PURE__ */ new Date()).toISOString()).order("view_count", { ascending: false }).limit(limit);
	if (error) throw error;
	return data ?? [];
}
/**
* "Trending" = published in the last 7 days, ranked by view count.
* This differs from fetchMostRead (all-time views), surfacing stories
* that are getting attention *right now* rather than old evergreen hits.
*/
async function fetchTrending(limit = 6, windowDays = 7) {
	const since = (/* @__PURE__ */ new Date(Date.now() - windowDays * 24 * 60 * 60 * 1e3)).toISOString();
	const { data, error } = await supabase.from("articles").select(ARTICLE_SELECT).eq("status", "published").lte("published_at", (/* @__PURE__ */ new Date()).toISOString()).gte("published_at", since).order("view_count", { ascending: false }).limit(limit);
	if (error) throw error;
	return data ?? [];
}
async function fetchArticleBySlug(slug) {
	const { data, error } = await supabase.from("articles").select(ARTICLE_SELECT).eq("slug", slug).maybeSingle();
	if (error) throw error;
	return data;
}
async function fetchArticlesByCategory(categorySlug, limit = 30) {
	const { data: cat } = await supabase.from("categories").select("id,name,slug,color,description").eq("slug", categorySlug).maybeSingle();
	if (!cat) return {
		category: null,
		articles: []
	};
	const { data, error } = await supabase.from("articles").select(ARTICLE_SELECT).eq("status", "published").eq("category_id", cat.id).lte("published_at", (/* @__PURE__ */ new Date()).toISOString()).order("published_at", { ascending: false }).limit(limit);
	if (error) throw error;
	return {
		category: cat,
		articles: data ?? []
	};
}
/**
* Public author page data: the profile plus only their *published* articles
* (drafts are never exposed here, regardless of who's viewing).
*/
async function fetchAuthorWithArticles(authorId) {
	const { data: profile, error: profileError } = await supabase.from("profiles").select("id,display_name,avatar_url,bio,created_at").eq("id", authorId).maybeSingle();
	if (profileError) throw profileError;
	if (!profile) return {
		profile: null,
		articles: []
	};
	const { data: articles, error: articlesError } = await supabase.from("articles").select(ARTICLE_SELECT).eq("author_id", authorId).eq("status", "published").lte("published_at", (/* @__PURE__ */ new Date()).toISOString()).order("published_at", { ascending: false }).limit(50);
	if (articlesError) throw articlesError;
	return {
		profile,
		articles: articles ?? []
	};
}
//#endregion
export { fetchFeaturedArticles as a, fetchTrending as c, fetchCategories as i, fetchArticlesByCategory as n, fetchMostRead as o, fetchAuthorWithArticles as r, fetchPublishedArticles as s, fetchArticleBySlug as t };
