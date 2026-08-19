import { t as supabase } from "./client-CZsxps-O.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/site-D9u_L-Ue.js
var AD_PLACEMENTS = [
	"header",
	"home-top",
	"home-mid",
	"sidebar",
	"article-inline",
	"article-bottom",
	"footer"
];
async function fetchSettings() {
	const { data, error } = await supabase.from("site_settings").select("*").eq("id", 1).maybeSingle();
	if (error) throw error;
	return data;
}
async function fetchActiveAds(placement) {
	const nowIso = (/* @__PURE__ */ new Date()).toISOString();
	const { data, error } = await supabase.from("ads").select("*").eq("placement", placement).eq("is_active", true);
	if (error) throw error;
	return (data ?? []).filter((a) => (!a.starts_at || a.starts_at <= nowIso) && (!a.ends_at || a.ends_at >= nowIso));
}
async function subscribeToNewsletter(email, source = "site") {
	const clean = email.trim().toLowerCase();
	if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(clean) || clean.length > 254) throw new Error("Please enter a valid email address");
	const { error } = await supabase.from("newsletter_subscribers").insert({
		email: clean,
		status: "subscribed",
		source: source.slice(0, 40)
	});
	if (error) {
		if (error.code === "23505") return { alreadySubscribed: true };
		throw error;
	}
	return { alreadySubscribed: false };
}
async function logPageView(path, ids = {}) {
	if (!/^\/[A-Za-z0-9/_.$-]*$/.test(path) || path.length > 300) return;
	await supabase.from("page_views").insert({
		path,
		article_id: ids.articleId ?? null,
		prediction_id: ids.predictionId ?? null,
		referrer: typeof document !== "undefined" ? document.referrer.slice(0, 300) || null : null
	});
}
async function fetchMedia() {
	const { data, error } = await supabase.from("media").select("*").order("created_at", { ascending: false }).limit(200);
	if (error) throw error;
	return data ?? [];
}
function mediaUrl(path) {
	return supabase.storage.from("media").getPublicUrl(path).data.publicUrl;
}
async function signedMediaUrl(path) {
	const { data } = await supabase.storage.from("media").createSignedUrl(path, 604800);
	return data?.signedUrl ?? mediaUrl(path);
}
async function uploadMedia(file) {
	const { data: userData } = await supabase.auth.getUser();
	const ext = file.name.split(".").pop() ?? "bin";
	const path = `${(/* @__PURE__ */ new Date()).getFullYear()}/${crypto.randomUUID()}.${ext}`;
	const { error: upErr } = await supabase.storage.from("media").upload(path, file, {
		cacheControl: "31536000",
		upsert: false
	});
	if (upErr) throw upErr;
	const { data, error } = await supabase.from("media").insert({
		path,
		file_name: file.name,
		mime_type: file.type,
		size_bytes: file.size,
		uploaded_by: userData.user?.id ?? null
	}).select("*").single();
	if (error) throw error;
	return data;
}
async function deleteMedia(item) {
	await supabase.storage.from("media").remove([item.path]);
	const { error } = await supabase.from("media").delete().eq("id", item.id);
	if (error) throw error;
}
async function attachAuthors(rows) {
	const ids = [...new Set(rows.map((r) => r.user_id))];
	if (ids.length === 0) return [];
	const { data: profiles } = await supabase.from("profiles").select("id,display_name").in("id", ids);
	const map = new Map((profiles ?? []).map((p) => [p.id, p.display_name]));
	return rows.map((r) => ({
		...r,
		author_name: map.get(r.user_id) ?? "Reader"
	}));
}
async function fetchApprovedComments(articleId) {
	const { data, error } = await supabase.from("comments").select("*").eq("article_id", articleId).eq("is_approved", true).order("created_at", { ascending: false });
	if (error) throw error;
	return attachAuthors(data ?? []);
}
async function postComment(articleId, content) {
	const { data: userData } = await supabase.auth.getUser();
	if (!userData.user) throw new Error("You must be signed in to comment");
	const body = content.trim();
	if (!body) throw new Error("Comment cannot be empty");
	if (body.length > 2e3) throw new Error("Comment is too long (max 2000 characters)");
	const { error } = await supabase.from("comments").insert({
		article_id: articleId,
		user_id: userData.user.id,
		content: body
	});
	if (error) throw error;
}
//#endregion
export { fetchApprovedComments as a, logPageView as c, subscribeToNewsletter as d, uploadMedia as f, fetchActiveAds as i, postComment as l, attachAuthors as n, fetchMedia as o, deleteMedia as r, fetchSettings as s, AD_PLACEMENTS as t, signedMediaUrl as u };
