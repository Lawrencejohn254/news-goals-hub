import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/media/$")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const path = params._splat;
        if (!path) return new Response("Not found", { status: 404 });

        const base = process.env.SUPABASE_URL;
        if (!base) return new Response("Storage not configured", { status: 500 });

        const upstream = await fetch(`${base}/storage/v1/object/public/media/${path}`);
        if (!upstream.ok || !upstream.body) {
          return new Response("Not found", { status: 404 });
        }

        return new Response(upstream.body, {
          status: 200,
          headers: {
            "Content-Type": upstream.headers.get("content-type") ?? "application/octet-stream",
            // Images are content-addressed by a random UUID filename, so a
            // given URL's content never changes — safe to cache for a year.
            "Cache-Control": "public, max-age=31536000, immutable",
          },
        });
      },
    },
  },
});