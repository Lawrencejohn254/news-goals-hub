import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

function esc(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export const Route = createFileRoute("/rss.xml")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const origin = new URL(request.url).origin;
        const { data } = await supabaseAdmin
          .from("articles")
          .select("title,slug,excerpt,published_at")
          .eq("status", "published")
          .order("published_at", { ascending: false })
          .limit(50);

        const items = (data ?? [])
          .map((a) =>
            [
              "    <item>",
              `      <title>${esc(a.title)}</title>`,
              `      <link>${origin}/article/${a.slug}</link>`,
              `      <guid isPermaLink="true">${origin}/article/${a.slug}</guid>`,
              a.excerpt ? `      <description>${esc(a.excerpt)}</description>` : "",
              a.published_at
                ? `      <pubDate>${new Date(a.published_at).toUTCString()}</pubDate>`
                : "",
              "    </item>",
            ]
              .filter(Boolean)
              .join("\n"),
          )
          .join("\n");

        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>The Dispatch</title>
    <link>${origin}</link>
    <description>Breaking news, analysis and football predictions.</description>
    <language>en</language>
${items}
  </channel>
</rss>`;

        return new Response(xml, {
          headers: {
            "Content-Type": "application/rss+xml",
            "Cache-Control": "public, max-age=1800",
          },
        });
      },
    },
  },
});
