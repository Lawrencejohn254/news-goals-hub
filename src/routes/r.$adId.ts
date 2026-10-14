import { createFileRoute } from "@tanstack/react-router";
import {
  UUID_RE,
  getServerClient,
  pathOnly,
  readRequestInfo,
  recordAdEvent,
} from "@/lib/ads.server";

function redirectTo(location: string) {
  return new Response(null, {
    status: 302,
    headers: { Location: location, "Cache-Control": "no-store" },
  });
}

function isHttpUrl(value: string) {
  try {
    const u = new URL(value);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

// /r/{ad_id}: logs the click, then sends the visitor to the advertiser's page.
export const Route = createFileRoute("/r/$adId")({
  server: {
    handlers: {
      GET: async ({ request, params }) => {
        const adId = params.adId;
        if (!UUID_RE.test(adId)) return redirectTo("/");

        const client = getServerClient();
        const { data: ad } = await client
          .from("ads")
          .select("id, target_url")
          .eq("id", adId)
          .maybeSingle();

        const target = ad?.target_url;
        if (!target || !isHttpUrl(target)) return redirectTo("/");

        const info = readRequestInfo(request);
        if (!info.isBot) {
          // Don't let a slow database make the visitor wait more than 1.5s.
          await Promise.race([
            recordAdEvent({
              adId,
              type: "click",
              info,
              pageUrl: pathOnly(request.headers.get("referer")),
              sessionId: null,
            }).catch(() => {}),
            new Promise((resolve) => setTimeout(resolve, 1500)),
          ]);
        }

        return redirectTo(target);
      },
    },
  },
});