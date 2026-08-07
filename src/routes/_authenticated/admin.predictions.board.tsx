import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { TIP_OPTIONS } from "@/lib/tips";
import { slugify } from "@/lib/format";
import { fetchMatchesBetween, fetchPredictionsForMatches, matchLabel } from "@/lib/football";
import { useServerFn } from "@tanstack/react-start";
import { setMatchResultFn } from "@/lib/football-sync.functions";

export const Route = createFileRoute("/_authenticated/admin/predictions/board")({
  component: FixtureBoard,
});

function dayKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

const DAY_OFFSETS = [-2, -1, 0, 1, 2, 3];

function boardDays() {
  return DAY_OFFSETS.map((i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return dayKey(d);
  });
}

type Cell = { tip: string; confidence: number; odds: string };

function FixtureBoard() {
  const qc = useQueryClient();
  const days = useMemo<string[]>(() => boardDays(), []);
  const [day, setDay] = useState(days[2]!);
  const [comp, setComp] = useState("");
  const [edits, setEdits] = useState<Record<string, Cell>>({});
  const [busy, setBusy] = useState<string | null>(null);
  const saveResult = useServerFn(setMatchResultFn);

  const from = `${day}T00:00:00.000Z`;
  const to = `${day}T23:59:59.999Z`;

  const fixtures = useQuery({
    queryKey: ["board", "fixtures", day],
    queryFn: () => fetchMatchesBetween(from, to),
  });

  const matchIds = (fixtures.data ?? []).map((m) => m.id);
  const preds = useQuery({
    queryKey: ["board", "preds", day, matchIds.length],
    queryFn: () => fetchPredictionsForMatches(matchIds),
    enabled: matchIds.length > 0,
  });

  const predByMatch = new Map((preds.data ?? []).map((p) => [p.match_id, p]));

  const competitions = [
    ...new Set((fixtures.data ?? []).map((m) => m.competitions?.name).filter(Boolean)),
  ] as string[];

  const rows = (fixtures.data ?? []).filter(
    (m) => !comp || m.competitions?.name === comp,
  );

  const cellFor = (matchId: string): Cell => {
    if (edits[matchId]) return edits[matchId]!;
    const p = predByMatch.get(matchId);
    return {
      tip: p?.tip ?? "",
      confidence: p?.confidence ?? 3,
      odds: p?.odds != null ? String(p.odds) : "",
    };
  };

  const patch = (matchId: string, p: Partial<Cell>) =>
    setEdits((e) => ({ ...e, [matchId]: { ...cellFor(matchId), ...p } }));

  const save = async (matchId: string, publish: boolean) => {
    const m = rows.find((r) => r.id === matchId);
    const c = cellFor(matchId);
    if (!m) return;
    if (!c.tip) return toast.error("Pick a tip first");
    setBusy(matchId);
    try {
      const existing = predByMatch.get(matchId);
      const payload = {
        tip: c.tip,
        confidence: Math.min(5, Math.max(1, Number(c.confidence) || 3)),
        odds: c.odds ? Number(c.odds) : null,
        is_published: publish ? true : (existing?.is_published ?? false),
      };
      if (existing) {
        const { error } = await supabase.from("predictions").update(payload).eq("id", existing.id);
        if (error) throw error;
      } else {
        const { data: auth } = await supabase.auth.getUser();
        const title = `${matchLabel(m)} prediction`;
        const { error } = await supabase.from("predictions").insert({
          ...payload,
          match_id: matchId,
          title,
          slug: `${slugify(title)}-${dayKey(new Date(m.kickoff_at))}`,
          analysis: `Our tip for ${matchLabel(m)}: ${c.tip}.`,
          author_id: auth.user!.id,
        });
        if (error) throw error;
      }
      toast.success(publish ? "Published live" : "Saved as draft");
      setEdits((e) => {
        const n = { ...e };
        delete n[matchId];
        return n;
      });
      qc.invalidateQueries({ queryKey: ["board", "preds"] });
      qc.invalidateQueries({ queryKey: ["admin", "predictions"] });
    } catch (e: any) {
      toast.error(e?.message ?? "Could not save");
    } finally {
      setBusy(null);
    }
  };

  const settle = async (matchId: string, h: string, a: string) => {
    if (h === "" || a === "") return toast.error("Enter both scores");
    setBusy(matchId);
    try {
      const r: any = await saveResult({
        data: { matchId, home: Number(h), away: Number(a) },
      });
      toast.success(r?.settled ? `Result saved — ${r.settled} tip(s) settled` : "Result saved");
      qc.invalidateQueries({ queryKey: ["board"] });
      qc.invalidateQueries({ queryKey: ["admin", "predictions"] });
      qc.invalidateQueries({ queryKey: ["admin", "matches"] });
    } catch (e: any) {
      toast.error(e?.message ?? "Could not save result");
    } finally {
      setBusy(null);
    }
  };



  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-serif text-3xl font-black">Fixture board</h1>
        <Link
          to="/admin/predictions"
          className="border border-border px-4 py-2 text-sm font-semibold hover:bg-muted"
        >
          All predictions
        </Link>
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-3 border border-border bg-muted/30 p-4">
        <div className="flex flex-wrap gap-2">
          {days.map((d, i) => (
            <button
              key={d}
              onClick={() => setDay(d)}
              className={`px-3 py-1 text-xs font-semibold uppercase tracking-wider ${
                day === d ? "bg-[var(--ink)] text-white" : "border border-border"
              }`}
            >
              {i === 0
                ? "Today"
                : new Date(`${d}T12:00:00`).toLocaleDateString("en-GB", {
                    weekday: "short",
                    day: "numeric",
                    month: "short",
                  })}
            </button>
          ))}
        </div>
        <select
          value={comp}
          onChange={(e) => setComp(e.target.value)}
          className="h-9 border border-input bg-background px-3 text-sm"
        >
          <option value="">All competitions</option>
          {competitions.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <p className="ml-auto text-xs text-muted-foreground">{rows.length} fixtures</p>
      </div>

      <div className="overflow-x-auto border border-border bg-background">
        <table className="w-full min-w-[900px] text-sm">
          <thead className="border-b border-border bg-muted/50 text-xs uppercase tracking-widest text-muted-foreground">
            <tr>
              <th className="p-3 text-left">Time</th>
              <th className="p-3 text-left">Competition</th>
              <th className="p-3 text-left">Fixture</th>
              <th className="p-3 text-left">Tip</th>
              <th className="p-3 text-left">Conf.</th>
              <th className="p-3 text-left">Odds</th>
              <th className="p-3 text-left">State</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {fixtures.isLoading && (
              <tr>
                <td colSpan={8} className="p-6 text-center text-muted-foreground">
                  Loading fixtures…
                </td>
              </tr>
            )}
            {!fixtures.isLoading && rows.length === 0 && (
              <tr>
                <td colSpan={8} className="p-6 text-center text-muted-foreground">
                  No fixtures for this day. Track leagues and run a sync in Leagues &amp; sync.
                </td>
              </tr>
            )}
            {rows.map((m) => {
              const c = cellFor(m.id);
              const existing = predByMatch.get(m.id);
              return (
                <tr key={m.id} className="border-b border-border last:border-b-0">
                  <td className="whitespace-nowrap p-3 text-muted-foreground">
                    {new Date(m.kickoff_at).toLocaleTimeString("en-GB", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="p-3 text-xs text-muted-foreground">
                    {m.competitions?.name ?? "—"}
                  </td>
                  <td className="p-3 font-medium">{matchLabel(m)}</td>
                  <td className="p-3">
                    <select
                      value={c.tip}
                      onChange={(e) => patch(m.id, { tip: e.target.value })}
                      className="h-9 w-44 border border-input bg-background px-2 text-xs"
                    >
                      <option value="">Select tip…</option>
                      {TIP_OPTIONS.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="p-3">
                    <select
                      value={c.confidence}
                      onChange={(e) => patch(m.id, { confidence: Number(e.target.value) })}
                      className="h-9 border border-input bg-background px-2 text-xs"
                    >
                      {[1, 2, 3, 4, 5].map((n) => (
                        <option key={n} value={n}>
                          {n}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="p-3">
                    <input
                      value={c.odds}
                      onChange={(e) => patch(m.id, { odds: e.target.value })}
                      placeholder="1.85"
                      className="h-9 w-20 border border-input bg-background px-2 text-xs"
                    />
                  </td>
                  <td className="p-3 text-xs font-semibold uppercase">
                    {existing
                      ? existing.result && existing.result !== "pending"
                        ? existing.result
                        : existing.is_published
                          ? "Live"
                          : "Draft"
                      : "—"}
                  </td>
                  <td className="p-3">
                    <ResultCell
                      key={`${m.id}-${m.home_score}-${m.away_score}`}
                      home={m.home_score ?? null}
                      away={m.away_score ?? null}
                      disabled={busy === m.id}
                      onSettle={(h, a) => settle(m.id, h, a)}
                    />
                  </td>

                  <td className="whitespace-nowrap p-3 text-right">
                    <Button
                      size="sm"
                      variant="ghost"
                      disabled={busy === m.id}
                      onClick={() => save(m.id, false)}
                    >
                      Save
                    </Button>
                    <Button
                      size="sm"
                      disabled={busy === m.id}
                      onClick={() => save(m.id, true)}
                      className="ml-2 bg-[var(--brand)] text-white hover:bg-[var(--brand)]/90"
                    >
                      {busy === m.id ? "…" : "Publish"}
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
