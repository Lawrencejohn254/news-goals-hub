import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { fetchCompetitions } from "@/lib/football";
import {
  searchLeaguesFn,
  trackLeagueFn,
  setLeagueTrackedFn,
  syncFixturesFn,
  settleResultsFn,
} from "@/lib/football-sync.functions";

export const Route = createFileRoute("/_authenticated/admin/leagues")({
  component: LeaguesAdmin,
});

type Row = {
  external_id: number;
  name: string;
  country: string | null;
  logo_url: string | null;
  season: string | null;
};

function LeaguesAdmin() {
  const qc = useQueryClient();
  const [query, setQuery] = useState("");
  const [country, setCountry] = useState("");
  const [results, setResults] = useState<Row[]>([]);
  const [busy, setBusy] = useState<string | null>(null);

  const search = useServerFn(searchLeaguesFn);
  const track = useServerFn(trackLeagueFn);
  const setTracked = useServerFn(setLeagueTrackedFn);
  const sync = useServerFn(syncFixturesFn);
  const settle = useServerFn(settleResultsFn);

  const comps = useQuery({ queryKey: ["competitions"], queryFn: fetchCompetitions });

  const run = async (key: string, fn: () => Promise<unknown>) => {
    setBusy(key);
    try {
      return await fn();
    } catch (e: any) {
      toast.error(e?.message ?? "Something went wrong");
    } finally {
      setBusy(null);
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-serif text-3xl font-black">Leagues &amp; fixture sync</h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            disabled={busy !== null}
            onClick={() =>
              run("sync", async () => {
                const r: any = await sync({ data: { days: 10 } });
                if (r.quotaExceeded)
                  toast.warning(
                    `Daily football data quota reached — saved ${r.created} new and ${r.updated} existing fixtures before stopping.`,
                  );
                else if (r.planLimited)
                  toast.success(
                    `Synced ${r.created} new and ${r.updated} existing fixtures (your API plan only covers the next few days).`,
                  );
                else toast.success(`Synced ${r.created} new and ${r.updated} existing fixtures`);
                qc.invalidateQueries({ queryKey: ["admin", "matches"] });
              })
            }
          >
            {busy === "sync" ? "Syncing…" : "Sync fixtures"}
          </Button>
          <Button
            className="bg-[var(--brand)] text-white hover:bg-[var(--brand)]/90"
            disabled={busy !== null}
            onClick={() =>
              run("settle", async () => {
                const r: any = await settle({});
                if (r.quotaExceeded)
                  toast.warning(
                    `Daily football data quota reached — ${r.finished} matches finished, ${r.settled} tips settled before stopping.`,
                  );
                else
                  toast.success(`${r.finished} matches finished, ${r.settled} tips settled`);
                qc.invalidateQueries({ queryKey: ["admin", "predictions"] });
              })
            }
          >
            {busy === "settle" ? "Checking…" : "Update results & settle tips"}
          </Button>

        </div>
      </div>

      <div className="mb-8 border border-border bg-background p-6">
        <h2 className="mb-4 font-serif text-xl font-bold">Find a league</h2>
        <div className="grid gap-4 md:grid-cols-[1fr_1fr_auto] md:items-end">
          <div>
            <Label htmlFor="lq">League name</Label>
            <Input
              id="lq"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Premier League"
            />
          </div>
          <div>
            <Label htmlFor="lc">Country (optional)</Label>
            <Input
              id="lc"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="Kenya"
            />
          </div>
          <Button
            disabled={busy !== null}
            onClick={() =>
              run("search", async () => {
                const r = (await search({ data: { query, country } })) as Row[];
                setResults(r);
                if (!r.length) toast.info("No leagues matched");
              })
            }
          >
            {busy === "search" ? "Searching…" : "Search"}
          </Button>
        </div>

        {results.length > 0 && (
          <ul className="mt-6 divide-y divide-border border border-border">
            {results.map((l) => (
              <li key={l.external_id} className="flex items-center gap-3 p-3">
                {l.logo_url && <img src={l.logo_url} alt="" className="h-6 w-6 object-contain" />}
                <div className="flex-1">
                  <p className="font-semibold">{l.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {l.country ?? "International"} · season {l.season ?? "—"}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={busy !== null}
                  onClick={() =>
                    run(`t${l.external_id}`, async () => {
                      await track({ data: l });
                      toast.success(`${l.name} is now tracked`);
                      qc.invalidateQueries({ queryKey: ["competitions"] });
                    })
                  }
                >
                  Track
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="border border-border bg-background">
        <h2 className="border-b border-border p-4 font-serif text-xl font-bold">Your competitions</h2>
        <ul className="divide-y divide-border">
          {(comps.data ?? []).map((c: any) => (
            <li key={c.id} className="flex items-center gap-3 p-3">
              {c.logo_url && <img src={c.logo_url} alt="" className="h-6 w-6 object-contain" />}
              <div className="flex-1">
                <p className="font-semibold">{c.name}</p>
                <p className="text-xs text-muted-foreground">
                  {c.country ?? "—"} · season {c.season ?? "—"} ·{" "}
                  {c.external_id ? "auto-synced" : "manual"}
                </p>
              </div>
              {c.external_id && (
                <Button
                  size="sm"
                  variant={c.is_tracked ? "outline" : "default"}
                  disabled={busy !== null}
                  onClick={() =>
                    run(`u${c.id}`, async () => {
                      await setTracked({ data: { competitionId: c.id, tracked: !c.is_tracked } });
                      toast.success(c.is_tracked ? "Stopped tracking" : "Tracking");
                      qc.invalidateQueries({ queryKey: ["competitions"] });
                    })
                  }
                >
                  {c.is_tracked ? "Tracked" : "Track"}
                </Button>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
