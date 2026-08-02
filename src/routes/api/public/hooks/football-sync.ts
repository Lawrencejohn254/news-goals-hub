import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/hooks/football-sync")({
  server: {
    handlers: {
      POST: async () => {
        try {
          const { syncFixtures, settleResults } = await import("@/lib/football-sync.server");
          const synced = await syncFixtures(10);
          const settled = await settleResults();
          return Response.json({ ok: true, synced, settled });
        } catch (e) {
          console.error("[football-sync]", e);
          return Response.json({ ok: false, error: String(e) }, { status: 500 });
        }
      },
    },
  },
});
