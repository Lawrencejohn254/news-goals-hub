import { createFileRoute } from "@tanstack/react-router";
import { UUID_RE, pathOnly, readRequestInfo, recordAdEvent } from "@/lib/ads.server";

// Receives viewable-impression pings from the browser.
// Clicks are NOT accepted here; they are counted by the /r/$adId redirect.
export const Route = createFileRoute("/api/ad-event")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const done = new Response(null, { status: 204 });
        try {
          const body = (await request.json()) as {
            adId?: string;
            type?: string;
            pageUrl?: string;
            sessionId?: string | null;
          };

          if (body.type !== "impression") return done;
          if (!body.adId || !UUID_RE.test(body.adId)) return done;

          const info = readRequestInfo(request);
          if (info.isBot) return done; // bots are silently ignored

          await recordAdEvent({
            adId: body.adId,
            type: "impression",
            info,
            pageUrl: pathOnly(body.pageUrl),
            sessionId: typeof body.sessionId === "string" ? body.sessionId.slice(0, 64) : null,
          });
        } catch (e) {
          console.error("ad-event error:", e instanceof Error ? e.message : e);
        }
        return done;
      },
    },
  },
});