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
  component: HomePage,
});

function HomePage() {
  const featured = useQuery({ queryKey: ["featured"], queryFn: () => fetchFeaturedArticles(5) });
  const latest = useQuery({ queryKey: ["latest"], queryFn: () => fetchPublishedArticles(12) });
  const mostRead = useQuery({ queryKey: ["mostRead"], queryFn: () => fetchMostRead(5) });
  const trending = useQuery({ queryKey: ["trending"], queryFn: () => fetchTrending(6) });
  const categories = useQuery({ queryKey: ["categories"], queryFn: fetchCategories });

  const hero = featured.data?.[0] ?? latest.data?.[0];
  const featuredRest = (featured.data ?? []).slice(1, 4);
  const latestList = (latest.data ?? []).slice(hero ? 1 : 0);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Breaking ticker */}
      <div className="border-y border-border bg-[var(--brand)] text-white">
        <div className="container-page flex items-center gap-4 py-2 overflow-hidden">
          <span className="shrink-0 bg-[var(--ink)] px-2 py-1 text-xs font-bold uppercase tracking-widest">
            Breaking
          </span>
          <div className="flex-1 overflow-hidden whitespace-nowrap">
            <div className="marquee inline-block">
              {(latest.data ?? []).slice(0, 6).map((a) => (
                <Link
                  key={a.id}
                  to="/article/$slug"
                  params={{ slug: a.slug }}
                  className="mr-10 text-sm font-medium hover:underline"
                >
                  ● {a.title}
                </Link>
              ))}
              {(latest.data ?? []).slice(0, 6).map((a) => (
                <Link
                  key={`d-${a.id}`}
                  to="/article/$slug"
                  params={{ slug: a.slug }}
                  className="mr-10 text-sm font-medium hover:underline"
                >
                  ● {a.title}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      <main className="container-page py-10">
        {/* Top banner ad */}
        <div className="mb-10 flex justify-center">
          <AdSlot placement="home-top" className="w-full max-w-4xl" />
        </div>

        {/* Hero + featured */}
        {hero && (
          <section className="mb-14 grid gap-10 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <ArticleCard article={hero} size="hero" />
            </div>
            <div className="space-y-6">
              <h2 className="border-b-2 border-[var(--ink)] pb-2 font-serif text-lg font-bold uppercase tracking-wider">
                Editor's Picks
              </h2>
              {featuredRest.length > 0 ? (
                featuredRest.map((a) => <ArticleCard key={a.id} article={a} size="sm" />)
              ) : (
                <p className="text-sm text-muted-foreground">
                  No featured stories yet
                </p>
              )}
            </div>
          </section>
        )}

        {/* Latest grid */}
        <section className="mb-14">
          <h2 className="mb-6 border-b-2 border-[var(--ink)] pb-2 font-serif text-2xl font-bold uppercase tracking-wider">
            Latest News
          </h2>
          {latest.isLoading ? (
            <p className="text-muted-foreground">Loading…</p>
          ) : latestList.length === 0 ? (
            <div className="border border-dashed border-border p-8 text-center text-muted-foreground">
              <p className="font-serif text-xl">No stories published yet.</p>
              <p className="mt-2 text-sm">
                <Link to="/auth" className="text-[var(--brand)] underline">
                  Sign in
                </Link>{" "}
                and head to the admin dashboard to publish your first article.
              </p>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {latestList.map((a) => (
                <ArticleCard key={a.id} article={a} />
              ))}
            </div>
          )}
        </section>

        {/* Trending Now */}
        {(trending.data ?? []).length > 0 && (
          <section className="mb-14">
            <h2 className="mb-6 border-b-2 border-[var(--brand)] pb-2 font-serif text-2xl font-bold uppercase tracking-wider">
              🔥 Trending Now
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
        <section className="grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h2 className="mb-6 border-b-2 border-[var(--ink)] pb-2 font-serif text-2xl font-bold uppercase tracking-wider">
              Sections
            </h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {(categories.data ?? []).map((c) => (
                <Link
                  key={c.id}
                  to="/category/$slug"
                  params={{ slug: c.slug }}
                  className="group flex items-center justify-between border border-border bg-background p-4 transition-colors hover:bg-[var(--paper)]"
                >
                  <div>
                    <span
                      className="mb-1 block h-1 w-8"
                      style={{ backgroundColor: c.color }}
                    />
                    <span className="font-serif text-lg font-bold group-hover:text-[var(--brand)]">
                      {c.name}
                    </span>
                  </div>
                  <span className="text-muted-foreground group-hover:text-[var(--brand)]">→</span>
                </Link>
              ))}
            </div>
          </div>
          <aside className="space-y-10">
            <div>
              <h2 className="mb-6 border-b-2 border-[var(--ink)] pb-2 font-serif text-lg font-bold uppercase tracking-wider">
                Most Read
              </h2>
              {(mostRead.data ?? []).length === 0 ? (
                <p className="text-sm text-muted-foreground">Views will show up here.</p>
              ) : (
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
              )}
            </div>

            {/* Newsletter signup */}
            <div className="border border-border bg-[var(--ink)] p-5">
              <h2 className="mb-2 font-serif text-lg font-bold uppercase tracking-wider text-white">
                Daily Brief
              </h2>
              <p className="mb-3 text-sm text-white/80">
                Top stories and predictions, straight to your inbox every morning.
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