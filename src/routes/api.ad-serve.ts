import { createFileRoute } from "@tanstack/react-router";
import { getServerClient, readRequestInfo, visitorHash } from "@/lib/ads.server";

type RpcClient = {
  rpc: (fn: string, args?: object) => Promise<{ data: unknown; error: { message: string } | null }>;
};

const HEADERS = { "Cache-Control": "private, no-store" };
const none = () => Response.json({ ad: null }, { headers: HEADERS });

// Picks the ad for one slot. Runs on the server because country and device
// come from the request headers, and the rules must not be changeable by visitors.
export const Route = createFileRoute("/api/ad-serve")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const url = new URL(request.url);
          const placement = url.searchParams.get("placement")?.slice(0, 100);
          if (!placement) return none();
          const section = url.searchParams.get("section")?.slice(0, 100) || null;

          const info = readRequestInfo(request);
          if (info.isBot) return none();

          const hash = await visitorHash(info.ip, info.ua);
          const client = getServerClient() as unknown as RpcClient;
          const { data, error } = await client.rpc("serve_ad", {
            p_placement: placement,
            p_country: info.country,
            p_device: info.device,
            p_section: section,
            p_visitor_hash: hash,
          });

          if (error) {
            console.error("serve_ad failed:", error.message);
            return none();
          }
          return Response.json({ ad: data ?? null }, { headers: HEADERS });
        } catch (e) {
          console.error("ad-serve error:", e instanceof Error ? e.message : e);
          return none();
        }
      },
    },
  },
});