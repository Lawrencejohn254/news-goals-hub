import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { AdSlot } from "@/components/site/AdSlot";
import { PredictionCard, MatchLine } from "@/components/site/FootballBits";
import {
  fetchPredictions,
  fetchUpcomingMatches,
  fetchPredictionStats,
  fetchCompetitions,
} from "@/lib/football";

export const Route = createFileRoute("/predictions/")({
  component: PredictionsIndex,
  head: () => ({
    meta: [
      { title: "Football Predictions & Betting Tips — The Dispatch" },
      {
        name: "description",
        content:
          "Expert football predictions, match previews, form guides and betting tips across the Premier League, La Liga, Serie A and the Champions League.",
      },
      { property: "og:title", content: "Football Predictions & Betting Tips" },
      {
        property: "og:description",
        content: "Expert football predictions and match analysis from The Dispatch sports desk.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/predictions" }],
  }),
});

function PredictionsIndex() {
  const preds = useQuery({ queryKey: ["predictions"], queryFn: () => fetchPredictions() });
  const upcoming = useQuery({ queryKey: ["upcoming-matches"], queryFn: () => fetchUpcomingMatches(8) });
  const stats = useQuery({ queryKey: ["prediction-stats"], queryFn: fetchPredictionStats });
  const comps = useQuery({ queryKey: ["competitions"], queryFn: fetchCompetitions });

  const featured = (preds.data ?? []).filter((p) => p.is_featured);
  const rest = (preds.data ?? []).filter((p) => !p.is_featured);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container-page py-10">
        <div className="border-b-4 border-[var(--brand)] pb-6">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-[var(--brand)]">
            The Dispatch Football Desk
          </p>
          <h1 className="mt-2 font-serif text-4xl font-black text-[var(--ink)] md:text-6xl">
            Football Predictions
          </h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Data-driven match analysis, form guides and tips from our sports desk. Published
            before kickoff, settled after full time.
          </p>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-4">
          <Stat label="Tips published" value={stats.data?.total ?? 0} />
          <Stat label="Winners" value={stats.data?.won ?? 0} />
          <Stat label="Pending" value={stats.data?.pending ?? 0} />
          <Stat label="Win rate" value={`${stats.data?.winRate ?? 0}%`} highlight />
        </div>

        <AdSlot placement="home-top" className="mt-8" />

        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_320px]">
          <div>
            {featured.length > 0 && (
              <section className="mb-10">
                <h2 className="mb-4 border-b-2 border-[var(--ink)] pb-2 font-serif text-2xl font-bold uppercase tracking-wider">
                  Featured tips
                </h2>
                <div className="grid gap-6 md:grid-cols-2">
                  {featured.map((p) => (
                    <PredictionCard key={p.id} p={p} />
                  ))}
                </div>
              </section>
            )}

            <section>
              <h2 className="mb-4 border-b-2 border-[var(--ink)] pb-2 font-serif text-2xl font-bold uppercase tracking-wider">
                Latest predictions
              </h2>
              {preds.isLoading && <p className="text-muted-foreground">Loading…</p>}
              {!preds.isLoading && rest.length === 0 && featured.length === 0 && (
                <p className="text-muted-foreground">
                  No predictions published yet. Check back before the next matchday.
                </p>
              )}
              <div className="grid gap-6 md:grid-cols-2">
                {rest.map((p) => (
                  <PredictionCard key={p.id} p={p} />
                ))}
              </div>
            </section>
          </div>

          <aside className="space-y-8">
            <div className="border border-border bg-background p-5">
              <h3 className="mb-4 font-serif text-lg font-bold uppercase tracking-wider">
                Upcoming fixtures
              </h3>
              {(upcoming.data ?? []).length === 0 && (
                <p className="text-sm text-muted-foreground">No fixtures scheduled.</p>
              )}
              <ul className="space-y-4">
                {(upcoming.data ?? []).map((m) => (
                  <li key={m.id} className="border-b border-border pb-3 last:border-b-0 last:pb-0">
                    <p className="mb-1 text-[10px] uppercase tracking-widest text-muted-foreground">
                      {m.competitions?.name ?? "Fixture"} ·{" "}
                      {new Date(m.kickoff_at).toLocaleString("en-GB", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                    <MatchLine m={m} />
                  </li>
                ))}
              </ul>
            </div>

            <div className="border border-border bg-background p-5">
              <h3 className="mb-3 font-serif text-lg font-bold uppercase tracking-wider">
                Competitions
              </h3>
              <ul className="space-y-2 text-sm">
                {(comps.data ?? []).map((c) => (
                  <li key={c.id} className="flex items-center justify-between">
                    <span>{c.name}</span>
                    <span className="text-xs text-muted-foreground">{c.country}</span>
                  </li>
                ))}
              </ul>
            </div>

            <AdSlot placement="sidebar" />

            <p className="border-l-4 border-[var(--brand)] bg-muted/40 p-4 text-xs text-muted-foreground">
              18+. Predictions are opinion and analysis, not financial advice. Please gamble
              responsibly.
            </p>
          </aside>
        </div>

        <div className="mt-12 text-center">
          <Link to="/" className="text-sm font-semibold text-[var(--brand)] underline">
            ← Back to the front page
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function Stat({
  label,
  value,
  highlight,
}: {
  label: string;
  value: number | string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`border border-border p-4 ${highlight ? "bg-[var(--ink)] text-white" : "bg-background"}`}
    >
      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] opacity-70">{label}</p>
      <p className="mt-1 font-serif text-3xl font-black">{value}</p>
    </div>
  );
}
