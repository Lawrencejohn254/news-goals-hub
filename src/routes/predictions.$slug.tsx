import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { AdSlot } from "@/components/site/AdSlot";
import { MatchLine, ConfidenceMeter, ResultBadge, PredictionCard } from "@/components/site/FootballBits";
import { fetchPredictionBySlug, fetchPredictions } from "@/lib/football";
import { supabase } from "@/integrations/supabase/client";
import { logPageView } from "@/lib/site";
import { absoluteUrl } from "@/lib/site-url";

export const Route = createFileRoute("/predictions/$slug")({
  component: PredictionPage,
  // Server-fetch the prediction so real match/tip data is in the initial
  // HTML (crawlability) and the title/description below reflect the actual
  // fixture instead of a generic slug-derived placeholder.
  loader: async ({ params }) => {
    const prediction = await fetchPredictionBySlug(params.slug);
    return { prediction };
  },
  head: ({ loaderData, params }) => {
    const p = loaderData?.prediction;
    const path = `/predictions/${params.slug}`;
    const url = absoluteUrl(path);
    if (!p) {
      return { meta: [{ title: `Prediction — The Dispatch` }], links: [{ rel: "canonical", href: url }] };
    }
    const matchName = `${p.matches?.home_team?.name ?? "?"} vs ${p.matches?.away_team?.name ?? "?"}`;
    const title = p.seo_title?.trim() || `${p.title} — Prediction | The Dispatch`;
    const description =
      p.seo_description?.trim() ||
      `Our tip for ${matchName}: ${p.tip}. Full match preview, form guide and head-to-head record.`;

    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:type", content: "article" },
        { property: "og:site_name", content: "The Dispatch" },
        { property: "og:title", content: p.title },
        { property: "og:description", content: description },
        { property: "og:url", content: url },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: p.title },
        { name: "twitter:description", content: description },
      ],
      links: [{ rel: "canonical", href: url }],
    };
  },
  notFoundComponent: () => (
    <div className="min-h-screen">
      <Header />
      <main className="container-page py-20 text-center">
        <h1 className="font-serif text-5xl font-black">Prediction not found</h1>
        <Link to="/predictions" className="mt-4 inline-block text-[var(--brand)] underline">
          All predictions
        </Link>
      </main>
      <Footer />
    </div>
  ),
});

function PredictionPage() {
  const { slug } = Route.useParams();
  const { prediction: loaderPrediction } = Route.useLoaderData();
  const q = useQuery({
    queryKey: ["prediction", slug],
    queryFn: () => fetchPredictionBySlug(slug),
    initialData: loaderPrediction,
  });
  const more = useQuery({ queryKey: ["predictions"], queryFn: () => fetchPredictions({ limit: 6 }) });

  useEffect(() => {
    const p = q.data;
    if (!p) return;
    supabase
      .from("predictions")
      .update({ view_count: (p.view_count ?? 0) + 1 })
      .eq("id", p.id)
      .then(() => {});
    logPageView(`/predictions/${p.slug}`, { predictionId: p.id });
  }, [q.data?.id]);

  if (q.isLoading) {
    return (
      <div>
        <Header />
        <main className="container-page py-10 text-muted-foreground">Loading…</main>
        <Footer />
      </div>
    );
  }
  if (!q.data) throw notFound();
  const p = q.data;
  const m = p.matches;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container-page py-10">
        <article className="mx-auto max-w-3xl">
          <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.25em] text-[var(--brand)]">
            <Link to="/predictions">Predictions</Link>
            <span className="text-muted-foreground">
              {m?.competitions?.name ?? "Football"}
            </span>
            <ResultBadge result={p.result} />
          </div>

          <h1 className="mt-4 font-serif text-4xl font-black leading-tight text-[var(--ink)] md:text-5xl">
            {p.title}
          </h1>

          {m && (
            <div className="mt-6 border border-border bg-muted/30 p-5">
              <MatchLine m={m} className="text-lg" />
              <p className="mt-2 text-sm text-muted-foreground">
                {new Date(m.kickoff_at).toLocaleString("en-GB", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
                {m.venue ? ` · ${m.venue}` : ""}
                {m.status === "finished" && m.home_score != null
                  ? ` · Final: ${m.home_score}–${m.away_score}`
                  : ""}
              </p>
            </div>
          )}

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <TipBox label="Our tip" value={p.tip} accent />
            <TipBox
              label="Correct score"
              value={
                p.predicted_home_score != null && p.predicted_away_score != null
                  ? `${p.predicted_home_score}–${p.predicted_away_score}`
                  : "—"
              }
            />
            <TipBox label="Odds" value={p.odds ? String(p.odds) : "—"} />
          </div>

          <div className="mt-4 flex items-center gap-3 border-y border-border py-4 text-sm text-muted-foreground">
            <span className="font-semibold uppercase tracking-widest">Confidence</span>
            <ConfidenceMeter value={p.confidence} />
            <span>{p.confidence}/5</span>
            <span className="ml-auto">{p.view_count?.toLocaleString() ?? 0} views</span>
          </div>

          <section className="article-prose mt-8" dangerouslySetInnerHTML={{ __html: p.analysis }} />

          <AdSlot placement="article-inline" className="my-8" />

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {p.home_form && <Panel title={`${m?.home_team?.name ?? "Home"} form`} body={p.home_form} />}
            {p.away_form && <Panel title={`${m?.away_team?.name ?? "Away"} form`} body={p.away_form} />}
            {p.head_to_head && <Panel title="Head to head" body={p.head_to_head} />}
            {p.key_stats && <Panel title="Key stats" body={p.key_stats} />}
          </div>

          <p className="mt-10 border-l-4 border-[var(--brand)] bg-muted/40 p-4 text-xs text-muted-foreground">
            18+. This prediction is editorial opinion, not financial advice. Please gamble
            responsibly.
          </p>
        </article>

        {(more.data ?? []).filter((x) => x.id !== p.id).length > 0 && (
          <section className="mx-auto mt-16 max-w-5xl">
            <h2 className="mb-6 border-b-2 border-[var(--ink)] pb-2 font-serif text-2xl font-bold uppercase tracking-wider">
              More predictions
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              {(more.data ?? [])
                .filter((x) => x.id !== p.id)
                .slice(0, 3)
                .map((x) => (
                  <PredictionCard key={x.id} p={x} />
                ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}

function TipBox({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className={`border border-border p-4 ${accent ? "bg-[var(--ink)] text-white" : "bg-background"}`}>
      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] opacity-70">{label}</p>
      <p className="mt-1 font-serif text-xl font-black">{value}</p>
    </div>
  );
}

function Panel({ title, body }: { title: string; body: string }) {
  return (
    <div className="border border-border bg-background p-5">
      <h3 className="mb-2 font-serif text-lg font-bold uppercase tracking-wide">{title}</h3>
      <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">{body}</p>
    </div>
  );
}