import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { AdSlot } from "@/components/site/AdSlot";
import {
  fetchTeamBySlug,
  fetchTeamMatches,
  computeTeamStats,
  type MatchWithTeams,
} from "@/lib/football";

export const Route = createFileRoute("/teams/$slug")({
  component: TeamPage,
  head: ({ params }) => {
    const name = params.slug.replace(/-\d+$/, "").replace(/-/g, " ");
    const title = `${name} stats, form & fixtures — The Dispatch`;
    const description = `${name} team stats: recent form, win rate, goals scored and conceded, clean sheets, BTTS and over 2.5 trends plus upcoming fixtures.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: `/teams/${params.slug}` }],
    };
  },
  notFoundComponent: () => (
    <div className="min-h-screen">
      <Header />
      <main className="container-page py-20 text-center">
        <h1 className="font-serif text-4xl font-black">Team not found</h1>
        <Link to="/predictions" className="mt-4 inline-block text-[var(--brand)] underline">
          Back to predictions
        </Link>
      </main>
      <Footer />
    </div>
  ),
});

function FormPips({ value }: { value: string }) {
  const chars = value.split("");
  if (!chars.length) return <span className="text-xs text-muted-foreground">No results yet</span>;
  return (
    <span className="inline-flex gap-1">
      {chars.map((c, i) => (
        <span
          key={i}
          className={`flex h-6 w-6 items-center justify-center text-[11px] font-bold text-white ${
            c === "W" ? "bg-[#1b8a3f]" : c === "D" ? "bg-[#8a8a8a]" : "bg-[var(--brand)]"
          }`}
        >
          {c}
        </span>
      ))}
    </span>
  );
}

function Stat({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="border border-border bg-background p-4">
      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className="mt-1 font-serif text-2xl font-black text-[var(--ink)]">{value}</p>
      {sub && <p className="text-[11px] text-muted-foreground">{sub}</p>}
    </div>
  );
}

function Row({ m, teamId }: { m: MatchWithTeams; teamId: string }) {
  const isHome = m.home_team_id === teamId;
  const opp = isHome ? m.away_team : m.home_team;
  const done = m.status === "finished" && m.home_score != null && m.away_score != null;
  const gf = (isHome ? m.home_score : m.away_score) ?? null;
  const ga = (isHome ? m.away_score : m.home_score) ?? null;
  const outcome = done ? (gf! > ga! ? "W" : gf === ga ? "D" : "L") : null;
  return (
    <tr className="border-t border-border">
      <td className="whitespace-nowrap p-2 text-xs text-muted-foreground">
        {new Date(m.kickoff_at).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })}
      </td>
      <td className="p-2 text-xs text-muted-foreground">{m.competitions?.name ?? "—"}</td>
      <td className="p-2">
        <span className="text-[10px] font-bold uppercase text-muted-foreground">
          {isHome ? "H" : "A"}
        </span>{" "}
        <span className="font-semibold">{opp?.name ?? "?"}</span>
      </td>
      <td className="p-2 text-center font-serif font-black">
        {done ? `${gf}-${ga}` : new Date(m.kickoff_at).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
      </td>
      <td className="p-2 text-center">
        {outcome ? (
          <span
            className={`inline-flex h-5 w-5 items-center justify-center text-[10px] font-bold text-white ${
              outcome === "W" ? "bg-[#1b8a3f]" : outcome === "D" ? "bg-[#8a8a8a]" : "bg-[var(--brand)]"
            }`}
          >
            {outcome}
          </span>
        ) : (
          <span className="text-[10px] uppercase text-muted-foreground">Upcoming</span>
        )}
      </td>
    </tr>
  );
}

function TeamPage() {
  const { slug } = Route.useParams();
  const team = useQuery({ queryKey: ["team", slug], queryFn: () => fetchTeamBySlug(slug) });
  const teamId = team.data?.id;
  const matches = useQuery({
    queryKey: ["team-matches", teamId],
    queryFn: () => fetchTeamMatches(teamId!),
    enabled: !!teamId,
  });

  if (team.isLoading) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="container-page py-12 text-muted-foreground">Loading team…</main>
        <Footer />
      </div>
    );
  }
  if (!team.data) throw notFound();

  const t = team.data;
  const all = matches.data ?? [];
  const stats = computeTeamStats(t.id, all);
  const now = Date.now();
  const recent = all.filter((m) => new Date(m.kickoff_at).getTime() <= now).slice(0, 10);
  const upcoming = all
    .filter((m) => new Date(m.kickoff_at).getTime() > now)
    .sort((a, b) => a.kickoff_at.localeCompare(b.kickoff_at))
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container-page py-10">
        <div className="flex items-center gap-4 border-b-4 border-[var(--brand)] pb-5">
          {t.crest_url && <img src={t.crest_url} alt={`${t.name} crest`} className="h-16 w-16 object-contain" />}
          <div>
            <h1 className="font-serif text-4xl font-black text-[var(--ink)]">{t.name}</h1>
            <p className="text-sm text-muted-foreground">
              {t.country ?? "Football club"} · {stats.played} matches on record
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-center gap-3">
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            Recent form
          </span>
          <FormPips value={stats.form} />
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Stat label="Win rate" value={`${stats.winPct}%`} sub={`${stats.won}W ${stats.drawn}D ${stats.lost}L`} />
          <Stat label="Goals scored" value={stats.goalsFor} sub={`${stats.avgScored} per game`} />
          <Stat label="Goals conceded" value={stats.goalsAgainst} sub={`${stats.avgConceded} per game`} />
          <Stat label="Clean sheets" value={stats.cleanSheets} />
          <Stat label="Both teams scored" value={`${stats.bttsPct}%`} sub="of matches" />
          <Stat label="Over 2.5 goals" value={`${stats.over25Pct}%`} sub="of matches" />
          <Stat label="Matches played" value={stats.played} />
          <Stat
            label="Goal difference"
            value={`${stats.goalsFor - stats.goalsAgainst > 0 ? "+" : ""}${stats.goalsFor - stats.goalsAgainst}`}
          />
        </div>

        <AdSlot placement="home-top" className="mt-8" />

        <section className="mt-10">
          <h2 className="bg-[var(--ink)] px-3 py-2 font-serif text-lg font-bold uppercase text-white">
            Recent results
          </h2>
          <div className="overflow-x-auto border border-t-0 border-border">
            <table className="w-full min-w-[560px] text-sm">
              <thead className="bg-muted/60 text-[10px] uppercase tracking-widest text-muted-foreground">
                <tr>
                  <th className="p-2 text-left">Date</th>
                  <th className="p-2 text-left">Competition</th>
                  <th className="p-2 text-left">Opponent</th>
                  <th className="p-2 text-center">Score</th>
                  <th className="p-2 text-center">Res</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((m) => (
                  <Row key={m.id} m={m} teamId={t.id} />
                ))}
              </tbody>
            </table>
            {!recent.length && <p className="p-4 text-sm text-muted-foreground">No results recorded yet.</p>}
          </div>
        </section>

        <section className="mt-10">
          <h2 className="bg-[var(--ink)] px-3 py-2 font-serif text-lg font-bold uppercase text-white">
            Upcoming fixtures
          </h2>
          <div className="overflow-x-auto border border-t-0 border-border">
            <table className="w-full min-w-[560px] text-sm">
              <tbody>
                {upcoming.map((m) => (
                  <Row key={m.id} m={m} teamId={t.id} />
                ))}
              </tbody>
            </table>
            {!upcoming.length && (
              <p className="p-4 text-sm text-muted-foreground">No scheduled fixtures right now.</p>
            )}
          </div>
        </section>

        <Link to="/predictions" className="mt-8 inline-block text-sm font-bold uppercase tracking-wider text-[var(--brand)] hover:underline">
          ← All football tips
        </Link>
      </main>
      <Footer />
    </div>
  );
}
