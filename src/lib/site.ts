import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type SiteSettings = Database["public"]["Tables"]["site_settings"]["Row"];
export type Ad = Database["public"]["Tables"]["ads"]["Row"];
export type MediaItem = Database["public"]["Tables"]["media"]["Row"];
export type Comment = Database["public"]["Tables"]["comments"]["Row"];

export const AD_PLACEMENTS = [
  "header",
  "home-top",
  "home-mid",
  "sidebar",
  "article-inline",
  "article-bottom",
  "footer",
] as const;

export async function fetchSettings() {
  const { data, error } = await supabase.from("site_settings").select("*").eq("id", 1).maybeSingle();
  if (error) throw error;
  return data;
}

export async function fetchActiveAds(placement: string) {
  const nowIso = new Date().toISOString();
  const { data, error } = await supabase
    .from("ads")
    .select("*")
    .eq("placement", placement)
    .eq("is_active", true);
  if (error) throw error;
  return (data ?? []).filter(
    (a) => (!a.starts_at || a.starts_at <= nowIso) && (!a.ends_at || a.ends_at >= nowIso),
  );
}

export async function subscribeToNewsletter(email: string, source = "site") {
  const clean = email.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(clean) || clean.length > 254) {
    throw new Error("Please enter a valid email address");
  }
  const { error } = await supabase
    .from("newsletter_subscribers")
    .insert({ email: clean, status: "subscribed", source: source.slice(0, 40) });
  if (error) {
    if (error.code === "23505") return { alreadySubscribed: true };
    throw error;
  }
  return { alreadySubscribed: false };
}

export async function logPageView(path: string, ids: { articleId?: string; predictionId?: string } = {}) {
  if (!/^\/[A-Za-z0-9/_.$-]*$/.test(path) || path.length > 300) return;
  await supabase.from("page_views").insert({
    path,
    article_id: ids.articleId ?? null,
    prediction_id: ids.predictionId ?? null,
    referrer: typeof document !== "undefined" ? document.referrer.slice(0, 300) || null : null,
  });
}

export async function fetchMedia() {
  const { data, error } = await supabase
    .from("media")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);
  if (error) throw error;
  return data ?? [];
}

export function mediaUrl(path: string) {
  return supabase.storage.from("media").getPublicUrl(path).data.publicUrl;
}

export async function signedMediaUrl(path: string) {
  const { data } = await supabase.storage.from("media").createSignedUrl(path, 60 * 60 * 24 * 7);
  return data?.signedUrl ?? mediaUrl(path);
}

export async function uploadMedia(file: File) {
  const { data: userData } = await supabase.auth.getUser();
  const ext = file.name.split(".").pop() ?? "bin";
  const path = `${new Date().getFullYear()}/${crypto.randomUUID()}.${ext}`;
  const { error: upErr } = await supabase.storage.from("media").upload(path, file, {
    cacheControl: "31536000",
    upsert: false,
  });
  if (upErr) throw upErr;
  const { data, error } = await supabase
    .from("media")
    .insert({
      path,
      file_name: file.name,
      mime_type: file.type,
      size_bytes: file.size,
      uploaded_by: userData.user?.id ?? null,
    })
    .select("*")
    .single();
  if (error) throw error;
  return data;
}

export async function deleteMedia(item: MediaItem) {
  await supabase.storage.from("media").remove([item.path]);
  const { error } = await supabase.from("media").delete().eq("id", item.id);
  if (error) throw error;
}

export type CommentWithAuthor = Comment & { author_name: string };

export async function attachAuthors(rows: Comment[]): Promise<CommentWithAuthor[]> {
  const ids = [...new Set(rows.map((r) => r.user_id))];
  if (ids.length === 0) return [];
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id,display_name")
    .in("id", ids);
  const map = new Map((profiles ?? []).map((p) => [p.id, p.display_name]));
  return rows.map((r) => ({ ...r, author_name: map.get(r.user_id) ?? "Reader" }));
}

export async function fetchApprovedComments(articleId: string) {
  const { data, error } = await supabase
    .from("comments")
    .select("*")
    .eq("article_id", articleId)
    .eq("is_approved", true)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return attachAuthors(data ?? []);
}

export async function postComment(articleId: string, content: string) {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) throw new Error("You must be signed in to comment");
  const body = content.trim();
  if (!body) throw new Error("Comment cannot be empty");
  if (body.length > 2000) throw new Error("Comment is too long (max 2000 characters)");
  const { error } = await supabase
    .from("comments")
    .insert({ article_id: articleId, user_id: userData.user.id, content: body });
  if (error) throw error;
}
