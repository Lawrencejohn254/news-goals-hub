import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  fetchCategories,
  fetchFeaturedArticles,
  fetchMostRead,
  fetchPublishedArticles,
  fetchTrending,
} from "@/lib/queries";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { ArticleCard } from "@/components/site/ArticleCard";
import { AdSlot } from "@/components/site/AdSlot";
import { NewsletterForm } from "@/components/site/NewsletterForm";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  // Fetch the homepage's content on the server before first paint. Without
  // this, search engine crawlers (and anyone viewing "page source") only
  // ever see "Loading…" and "Views will show up here." — the data was
  // previously fetched entirely client-side, after the page had already
  // been sent to the browser.
  loader: async () => {
    const [featured, latest, mostRead, trending, categories] = await Promise.all([
      fetchFeaturedArticles(5),
      fetchPublishedArticles(40),
      fetchMostRead(5),
      fetchTrending(6),
      fetchCategories(),
    ]);
    return { featured, latest, mostRead, trending, categories };
  },
  component: HomePage,
});

function HomePage() {
  // Seed every query with the server-fetched data so the first render (and
  // the HTML sent to crawlers) already has real content — React Query then
  // takes over client-side for live refetching as normal.
  const loaderData = Route.useLoaderData();
  const featured = useQuery({
    queryKey: ["featured"],
    queryFn: () => fetchFeaturedArticles(5),
    initialData: loaderData.featured,
  });
  const latest = useQuery({
    queryKey: ["latest"],
    queryFn: () => fetchPublishedArticles(40),
    initialData: loaderData.latest,
  });
  const mostRead = useQuery({
    queryKey: ["mostRead"],
    queryFn: () => fetchMostRead(5),
    initialData: loaderData.mostRead,
  });
  const trending = useQuery({
    queryKey: ["trending"],
    queryFn: () => fetchTrending(6),
    initialData: loaderData.trending,
  });
  const categories = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    initialData: loaderData.categories,
  });

  // Hero is always the single most recently published article — never a
  // manually "featured" one that could be older. Previously this picked
  // featured.data[0] first and then blindly sliced latest.data[0] off the
  // grid assuming it *was* the hero — when the featured article was
  // actually something older, that silently dropped the true newest
  // article from the page entirely (not shown as hero, not shown in the
  // grid either). Filtering by id instead of position fixes this for good,
  // regardless of what's marked featured.
  const hero = latest.data?.[0];
  const featuredRest = (featured.data ?? []).filter((f) => f.id !== hero?.id).slice(0, 3);
  const latestList = (latest.data ?? []).filter((a) => a.id !== hero?.id);

  // Top Stories column beside the lead (Nation-style).
  const topStories = latestList.slice(0, 5);
  const belowHero = latestList.slice(5, 7);
  const usedIds = new Set([
    hero?.id,
    ...topStories.map((a) => a.id),
    ...belowHero.map((a) => a.id),
  ]);

  // One block per category, built from the remaining articles.
  const sections = (categories.data ?? [])
    .map((c) => ({
      category: c,
      articles: latestList
        .filter((a) => !usedIds.has(a.id) && a.categories?.id === c.id)
        .slice(0, 4),
    }))
    .filter((s) => s.articles.length > 0);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Breaking ticker — width now matches the rest of the page's content
          container instead of stretching full browser width */}
      <div className="container-page mt-4">
        <div className="flex items-center gap-4 border border-border bg-[var(--brand)] px-4 py-2 text-white overflow-hidden">
          <span className="shrink-0 bg-[var(--ink)] px-2 py-1 text-xs font-bold uppercase tracking-widest">
            Breaking
          </span>
                    <div className="min-w-0 flex-1">
            {latest.data?.[0] && (
              <Link
                to="/article/$slug"
                params={{ slug: latest.data[0].slug }}
                className="block truncate text-sm font-semibold hover:underline"
              >
                {latest.data[0].title}
              </Link>
            )}
          </div>
        </div>
      </div>

      <main className="container-page pb-10 pt-6">
        {/* Top banner ad */}
        <div className="mb-10 flex justify-center">
          <AdSlot placement="home-top" className="w-full max-w-4xl" />
        </div>

                {/* Lead zone: lead story | top stories | most read */}
        {hero && (
          <section className="mb-12 grid gap-8 lg:grid-cols-12">
            <div className="flex flex-col gap-6 lg:col-span-6">
              <ArticleCard article={hero} size="hero" />
              {belowHero.length > 0 && (
                <div className="grid gap-6 sm:grid-cols-2">
                  {belowHero.map((a) => (
                    <ArticleCard key={a.id} article={a} size="sm" />
                  ))}
                </div>
              )}
            </div>

            <div className="lg:col-span-3 lg:border-l lg:border-border lg:pl-8">
              <h2 className="mb-3 border-l-4 border-[var(--brand)] pl-3 font-serif text-sm font-bold uppercase tracking-wider">
                Top Stories
              </h2>
              <div className="space-y-3">
                {topStories.map((a) => (
                  <ArticleCard key={a.id} article={a} size="sm" />
                ))}
              </div>
            </div>

            <aside className="lg:col-span-3 lg:border-l lg:border-border lg:pl-8">
              <h2 className="mb-3 border-l-4 border-[var(--brand)] pl-3 font-serif text-sm font-bold uppercase tracking-wider">
                Most Read
              </h2>
              <ol className="space-y-4">
                {(mostRead.data ?? []).map((a, i) => (
                  <li key={a.id} className="flex gap-3">
                    <span className="font-serif text-3xl font-black text-[var(--brand)]">
                      {i + 1}
                    </span>
                    <Link
                      to="/article/$slug"
                      params={{ slug: a.slug }}
                      className="font-serif text-sm font-bold leading-snug hover:text-[var(--brand)]"
                    >
                      {a.title}
                    </Link>
                  </li>
                ))}
              </ol>
            </aside>
          </section>
        )}

                {/* One block per category */}
        {latest.isLoading ? (
          <p className="mb-14 text-muted-foreground">Loading…</p>
        ) : sections.length === 0 ? (
          <div className="mb-14 border border-dashed border-border p-8 text-center text-muted-foreground">
            <p className="font-serif text-xl">No stories published yet.</p>
          </div>
        ) : (
          <div className="mb-14 grid gap-x-10 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
            {sections.map(({ category, articles }) => (
              <section key={category.id}>
                <Link
                  to="/category/$slug"
                  params={{ slug: category.slug }}
                  className="mb-4 flex items-center justify-between border-t-4 pt-2"
                  style={{ borderColor: category.color }}
                >
                  <h2 className="font-serif text-lg font-bold uppercase tracking-wider">
                    {category.name}
                  </h2>
                  <span className="text-xs font-semibold text-muted-foreground">More →</span>
                </Link>
                <ArticleCard article={articles[0]} />
                <div className="mt-3">
                  {articles.slice(1).map((a) => (
                    <ArticleCard key={a.id} article={a} size="headline" />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}

        {/* Trending Now */}
        {(trending.data ?? []).length > 0 && (
          <section className="mb-14">
            <h2 className="mb-6 border-b-2 border-[var(--brand)] pb-2 font-serif text-2xl font-bold uppercase tracking-wider">
               Trending Now
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {(trending.data ?? []).map((a) => (
                <ArticleCard key={a.id} article={a} size="sm" />
              ))}
            </div>
          </section>
        )}

        {/* Mid-page ad */}
        <div className="mb-14 flex justify-center">
          <AdSlot placement="home-mid" className="w-full max-w-4xl" />
        </div>

        {/* Two-col: categories & most read */}
        <section className="grid gap-10 md:grid-cols-2">
          <aside className="contents">

            {/* Newsletter signup */}
            <div className="border border-border bg-[var(--ink)] p-5">
              <h2 className="mb-2 font-serif text-lg font-bold uppercase tracking-wider text-white">
                Daily Brief
              </h2>
              <p className="mb-3 text-sm text-white/80">
                Top stories and football updates, straight to your inbox every morning.
              </p>
              <NewsletterForm source="homepage" variant="dark" />
            </div>

            {/* Sidebar ad */}
            <AdSlot placement="sidebar" />
          </aside>
        </section>
      </main>

      <Footer />
    </div>
  );
}