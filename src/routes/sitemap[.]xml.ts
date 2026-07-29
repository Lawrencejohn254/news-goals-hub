import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const BASE_URL = "";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const [articles, categories] = await Promise.all([
          supabaseAdmin
            .from("articles")
            .select("slug,updated_at")
            .eq("status", "published"),
          supabaseAdmin.from("categories").select("slug").eq("is_enabled", true),
        ]);

        type Entry = { path: string; lastmod?: string; priority?: string };
        const entries: Entry[] = [
          { path: "/", priority: "1.0" },
          { path: "/auth" },
          ...(categories.data ?? []).map((c) => ({ path: `/category/${c.slug}` })),
          ...(articles.data ?? []).map((a) => ({
            path: `/article/${a.slug}`,
            lastmod: a.updated_at,
          })),
        ];

        const urls = entries.map((e) =>
          [
            `  <url>`,
            `    <loc>${BASE_URL}${e.path}</loc>`,
            e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>` : null,
            e.priority ? `    <priority>${e.priority}</priority>` : null,
            `  </url>`,
          ]
            .filter(Boolean)
            .join("\n"),
        );

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...urls,
          `</urlset>`,
        ].join("\n");

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
