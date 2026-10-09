import { createFileRoute } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { getSiteUrl } from "@/lib/site-url";

function esc(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export const Route = createFileRoute("/news-sitemap.xml")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const origin = getSiteUrl() ?? new URL(request.url).origin;
        const now = new Date();
        const since = new Date(now.getTime() - 48 * 60 * 60 * 1000).toISOString();

        const { data } = await supabase
          .from("articles")
          .select("title,slug,published_at")
          .eq("status", "published")
          .gte("published_at", since)
          .lte("published_at", now.toISOString())
          .order("published_at", { ascending: false })
          .limit(1000);

        const urls = (data ?? [])
          .map(
            (a) => `<url>
  <loc>${origin}/article/${a.slug}</loc>
  <news:news>
    <news:publication>
      <news:name>The Africa Daily Dispatch</news:name>
      <news:language>en</news:language>
    </news:publication>
    <news:publication_date>${new Date(a.published_at as string).toISOString()}</news:publication_date>
    <news:title>${esc(a.title)}</news:title>
  </news:news>
</url>`,
          )
          .join("\n");

        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${urls}
</urlset>`;

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, max-age=300, s-maxage=300",
          },
        });
      },
    },
  },
});