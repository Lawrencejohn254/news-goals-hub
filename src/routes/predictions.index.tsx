import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { AdSlot } from "@/components/site/AdSlot";
import { fetchPredictions, fetchPredictionStats, type PredictionWithMatch } from "@/lib/football";

export const Route = createFileRoute("/predictions/")({
  component: PredictionsIndex,
  head: () => ({
    meta: [
      { title: "Football Tips Today — Free Predictions | The Dispatch" },
      {
        name: "description",
        content:
          "Free football betting tips for today, tomorrow and the weekend. Match predictions, correct scores, form guides and odds across every major league.",
      },
      { property: "og:title", content: "Football Tips Today — Free Predictions" },
      {
        property: "og:description",
        content: "Free football predictions, correct scores and form guides from The Dispatch.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/predictions" }],
  }),
});

function dayKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function toDayKey(iso?: string | null) {
  if (!iso) return "";
  return dayKey(new Date(iso));
}
function longDate(key: string) {
  return new Date(`${key}T12:00:00`).toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

const DAYS = Array.from({ length: 5 }, (_, i) => {
  const d = new Date();
  d.setDate(d.getDate() + i);
  return dayKey(d);
});

function Form({ value }: { value?: string | null }) {
  const chars = (value ?? "")
    .toUpperCase()
    .replace(/[^WDL]/g, "")
    .slice(-5)
    .split("");
  if (!chars.length) return <span className="text-[10px] text-muted-foreground">—</span>;
  return (
    <span className="inline-flex gap-0.5">
      {chars.map((c, i) => (
        <span
          key={i}
          className={`flex h-4 w-4 items-center justify-center text-[9px] font-bold text-white ${
            c === "W" ? "bg-[#1b8a3f]" : c === "D" ? "bg-[#8a8a8a]" : "bg-[var(--brand)]"
          }`}
        >
          {c}
        </span>
      ))}
    </span>
  );
}

function ResultCell({ p }: { p: PredictionWithMatch }) {
  if (p.result === "won")
    return <span className="bg-[#1b8a3f] px-2 py-0.5 text-[10px] font-bold uppercase text-white">Won</span>;
  if (p.result === "lost")
    return <span className="bg-[var(--brand)] px-2 py-0.5 text-[10px] font-bold uppercase text-white">Lost</span>;
  if (p.result === "void")
    return <span className="bg-muted px-2 py-0.5 text-[10px] font-bold uppercase">Void</span>;
  return <span className="text-[10px] font-semibold uppercase text-muted-foreground">Pending</span>;
}

function PredictionsIndex() {
  const [day, setDay] = useState(DAYS[0]);
  const tabs = DAYS.includes(day) ? DAYS : [day, ...DAYS];
  const preds = useQuery({
    queryKey: ["predictions", "all"],
    queryFn: () => fetchPredictions({ limit: 500 }),
  });
  const stats = useQuery({ queryKey: ["prediction-stats"], queryFn: fetchPredictionStats });

  const all = preds.data ?? [];
  const visible = all.filter((p) => toDayKey(p.matches?.kickoff_at) === day);

  const groups = new Map<string, PredictionWithMatch[]>();
  for (const p of visible) {
    const key = p.matches?.competitions?.name ?? "Other fixtures";
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(p);
  }
  for (const list of groups.values())
    list.sort((a, b) => (a.matches?.kickoff_at ?? "").localeCompare(b.matches?.kickoff_at ?? ""));

  const won = visible.filter((p) => p.result === "won").length;
  const lost = visible.filter((p) => p.result === "lost").length;
  const rate = won + lost ? Math.round((won / (won + lost)) * 100) : 0;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Day tabs */}
      <div className="border-b border-border bg-[var(--ink)]">
        <div className="container-page flex flex-wrap items-center gap-px py-0">
          {tabs.map((d) => (
            <button
              key={d}
              onClick={() => setDay(d)}
              className={`px-4 py-3 text-xs font-bold uppercase tracking-wider transition-colors ${
                day === d
                  ? "bg-[var(--brand)] text-white"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              {d === DAYS[0]
                ? "Today"
                : d === DAYS[1]
                  ? "Tomorrow"
                  : new Date(`${d}T12:00:00`).toLocaleDateString("en-GB", { weekday: "long" })}{" "}
              <span className="opacity-70">
                ({new Date(`${d}T12:00:00`).toLocaleDateString("en-GB", { day: "numeric", month: "short" })})
              </span>
            </button>
          ))}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                className="ml-auto gap-2 rounded-none px-4 py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-white/10 hover:text-white"
              >
                <CalendarIcon className="h-4 w-4" />
                Pick a date
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="single"
                selected={new Date(`${day}T12:00:00`)}
                onSelect={(d) => d && setDay(dayKey(d))}
                initialFocus
                className="pointer-events-auto p-3"
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <main className="container-page py-8">
        <h1 className="font-serif text-3xl font-black text-[var(--ink)] md:text-4xl">
          Football Tips — {longDate(day)}
        </h1>
        <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
          Here are all of our free football betting tips for this matchday. Each row shows both
          teams&apos; last five results, our predicted score, the recommended tip and the price.
          Click any fixture for the full match preview.
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-4 border-y border-border py-2 text-xs">
          <span className="font-bold uppercase tracking-widest">Key</span>
          <span className="flex items-center gap-1"><Form value="W" /> Win</span>
          <span className="flex items-center gap-1"><Form value="D" /> Draw</span>
          <span className="flex items-center gap-1"><Form value="L" /> Loss</span>
          <span className="ml-auto text-muted-foreground">
            {visible.length} tips · {won}W–{lost}L ·{" "}
            <strong className="text-[var(--brand)]">{rate}% strike rate</strong> today · all-time{" "}
            {stats.data?.winRate ?? 0}%
          </span>
        </div>

        <AdSlot placement="home-top" className="mt-6" />

        {preds.isLoading && <p className="mt-8 text-muted-foreground">Loading tips…</p>}
        {!preds.isLoading && visible.length === 0 && (
          <p className="mt-8 border border-border bg-muted/30 p-6 text-muted-foreground">
            No tips published for {longDate(day)} yet. Check back soon.
          </p>
        )}

        <div className="mt-8 space-y-10">
          {[...groups.entries()].map(([comp, list]) => (
            <section key={comp}>
              <h2 className="flex items-center gap-2 bg-[var(--ink)] px-3 py-2 font-serif text-lg font-bold uppercase tracking-wide text-white">
                {list[0]?.matches?.competitions?.logo_url && (
                  <img
                    src={list[0].matches!.competitions!.logo_url!}
                    alt=""
                    className="h-5 w-5 object-contain"
                    loading="lazy"
                  />
                )}
                {comp} Tips
              </h2>
              <div className="overflow-x-auto border border-t-0 border-border">
                <table className="w-full min-w-[860px] border-collapse text-sm">
                  <thead className="bg-muted/60 text-[10px] uppercase tracking-widest text-muted-foreground">
                    <tr>
                      <th className="w-20 p-2 text-left">Time</th>
                      <th className="p-2 text-right">Home</th>
                      <th className="w-28 p-2 text-center">Prediction</th>
                      <th className="p-2 text-left">Away</th>
                      <th className="w-16 p-2 text-center">Tip</th>
                      <th className="w-16 p-2 text-center">Odds</th>
                      <th className="w-20 p-2 text-center">Conf.</th>
                      <th className="w-20 p-2 text-center">Result</th>
                    </tr>
                  </thead>
                  <tbody>
                    {list.map((p, idx) => {
                      const m = p.matches;
                      const score =
                        p.predicted_home_score != null && p.predicted_away_score != null
                          ? `${p.predicted_home_score}-${p.predicted_away_score}`
                          : "—";
                      return (
                        <tr
                          key={p.id}
                          className={`border-t border-border ${idx % 2 ? "bg-muted/20" : "bg-background"}`}
                        >
                          <td className="whitespace-nowrap p-2 text-xs text-muted-foreground">
                            {m?.kickoff_at
                              ? new Date(m.kickoff_at).toLocaleTimeString("en-GB", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })
                              : "—"}
                          </td>
                          <td className="p-2 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Form value={p.home_form} />
                              {m?.home_team?.slug ? (
                                <Link
                                  to="/teams/$slug"
                                  params={{ slug: m.home_team.slug }}
                                  className="font-semibold hover:text-[var(--brand)] hover:underline"
                                >
                                  {m.home_team.name}
                                </Link>
                              ) : (
                                <span className="font-semibold">{m?.home_team?.name ?? "?"}</span>
                              )}
                              {m?.home_team?.crest_url && (
                                <img src={m.home_team.crest_url} alt="" className="h-5 w-5" loading="lazy" />
                              )}
                            </div>
                          </td>
                          <td className="p-2 text-center">
                            <Link
                              to="/predictions/$slug"
                              params={{ slug: p.slug }}
                              className="font-serif text-base font-black text-[var(--brand)] hover:underline"
                            >
                              {score}
                            </Link>
                          </td>
                          <td className="p-2">
                            <div className="flex items-center gap-2">
                              {m?.away_team?.crest_url && (
                                <img src={m.away_team.crest_url} alt="" className="h-5 w-5" loading="lazy" />
                              )}
                              {m?.away_team?.slug ? (
                                <Link
                                  to="/teams/$slug"
                                  params={{ slug: m.away_team.slug }}
                                  className="font-semibold hover:text-[var(--brand)] hover:underline"
                                >
                                  {m.away_team.name}
                                </Link>
                              ) : (
                                <span className="font-semibold">{m?.away_team?.name ?? "?"}</span>
                              )}
                              <Form value={p.away_form} />
                            </div>
                          </td>
                          <td className="p-2 text-center text-xs font-bold uppercase">{p.tip}</td>
                          <td className="p-2 text-center">
                            <span className="inline-block border border-border px-2 py-0.5 text-xs font-semibold">
                              {p.odds ?? "—"}
                            </span>
                          </td>
                          <td className="p-2 text-center text-xs">{p.confidence}/5</td>
                          <td className="p-2 text-center">
                            <ResultCell p={p} />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="border border-t-0 border-border bg-muted/30 px-3 py-2 text-right">
                {list.map((p) => (
                  <span key={p.id} className="ml-3 inline-flex gap-2 text-[11px] font-bold uppercase tracking-wider">
                    <Link
                      to="/predictions/$slug"
                      params={{ slug: p.slug }}
                      className="text-[var(--brand)] hover:underline"
                    >
                      {p.matches?.home_team?.short_name ?? p.matches?.home_team?.name} preview
                    </Link>
                    {p.matches?.home_team?.slug && (
                      <Link
                        to="/teams/$slug"
                        params={{ slug: p.matches.home_team.slug }}
                        className="text-muted-foreground hover:text-[var(--brand)] hover:underline"
                      >
                        stats
                      </Link>
                    )}
                  </span>
                ))}
              </div>
            </section>
          ))}
        </div>

        <AdSlot placement="sidebar" className="mt-10" />

        <p className="mt-8 border-l-4 border-[var(--brand)] bg-muted/40 p-4 text-xs text-muted-foreground">
          18+. Predictions are opinion and analysis, not financial advice. Please gamble responsibly.
        </p>
      </main>
      <Footer />
    </div>
  );
}
