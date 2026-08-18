import { createFileRoute } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { getSiteUrl } from "@/lib/site-url";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        // Prefer the explicitly configured production domain; fall back to
        // whatever host the request actually came in on (so this keeps
        // working correctly on a preview/staging URL too, before
        // VITE_SITE_URL is set).
        const origin = getSiteUrl() ?? new URL(request.url).origin;
        const now = new Date().toISOString();

        const [{ data: articles }, { data: predictions }, { data: categories }] = await Promise.all([
          supabase
            .from("articles")
            .select("slug,updated_at,published_at")
            .eq("status", "published")
            .lte("published_at", now)
            .order("published_at", { ascending: false })
            .limit(5000),
          supabase
            .from("predictions")
            .select("slug,updated_at")
            .eq("is_published", true)
            .limit(5000),
          supabase.from("categories").select("slug,updated_at").eq("is_enabled", true),
        ]);

        const staticUrls = [
          { loc: "/", priority: "1.0", changefreq: "hourly" },
          { loc: "/predictions", priority: "0.8", changefreq: "hourly" },
          { loc: "/search", priority: "0.3", changefreq: "monthly" },
        ];

        const urlEntries = [
          ...staticUrls.map(
            (u) => `<url><loc>${origin}${u.loc}</loc><changefreq>${u.changefreq}</changefreq><priority>${u.priority}</priority></url>`,
          ),
          ...(categories ?? []).map(
            (c) =>
              `<url><loc>${origin}/category/${c.slug}</loc><lastmod>${new Date(c.updated_at).toISOString()}</lastmod><changefreq>daily</changefreq><priority>0.6</priority></url>`,
          ),
          ...(articles ?? []).map(
            (a) =>
              `<url><loc>${origin}/article/${a.slug}</loc><lastmod>${new Date(a.updated_at).toISOString()}</lastmod><changefreq>weekly</changefreq><priority>0.7</priority></url>`,
          ),
          ...(predictions ?? []).map(
            (p) =>
              `<url><loc>${origin}/predictions/${p.slug}</loc><lastmod>${new Date(p.updated_at).toISOString()}</lastmod><changefreq>daily</changefreq><priority>0.6</priority></url>`,
          ),
        ];

        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries.join("\n")}
</urlset>`;

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml; charset=utf-8",
            // Cache at the edge/CDN for 10 minutes — sitemap doesn't need
            // to be second-by-second fresh, and this avoids hitting the
            // database on every single crawler request.
            "Cache-Control": "public, max-age=600, s-maxage=600",
          },
        });
      },
    },
  },
});