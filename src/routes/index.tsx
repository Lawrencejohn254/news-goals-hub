import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { fetchCategories, fetchBreaking, fetchPublishedArticles } from "@/lib/queries";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { EditorialHome } from "@/components/site/editorial/EditorialHome";
import { TrackedAdSlot } from "@/components/TrackedAdSlot";
import { NewsletterForm } from "@/components/site/NewsletterForm";
import { PreferredSource } from "@/components/site/PreferredSource";
import { Link } from "@tanstack/react-router";
import { absoluteUrl } from "@/lib/site-url";

// How many recent articles feed the homepage. The editorial layout fills a lot
// of slots (hero, thumbs, blocks, rail, every category), so it needs a deeper
// pool than the old layout did.
const HOME_ARTICLE_COUNT = 80;

export const Route = createFileRoute("/")({
  // Fetch the homepage's content on the server before first paint. Without
  // this, search engine crawlers (and anyone viewing "page source") only
  // ever see "Loading…" and "Views will show up here." — the data was
  // previously fetched entirely client-side, after the page had already
  // been sent to the browser.
  loader: async () => {
    const [latest, categories] = await Promise.all([
      fetchPublishedArticles(HOME_ARTICLE_COUNT),
      fetchCategories(),
    ]);
    return { latest, categories };
  },
  head: () => ({
    meta: [
      { title: "The Africa Daily Dispatch — Latest News, Politics, Business & Sport" },
      {
        name: "description",
        content:
          "Independent reporting on politics, business, technology and sport, plus expert football analysis.",
      },
      { property: "og:title", content: "The Africa Daily Dispatch" },
      {
        property: "og:description",
        content: "Independent reporting on politics, business, technology and sport.",
      },
      { property: "og:url", content: absoluteUrl("/") },
    ],
    links: [{ rel: "canonical", href: absoluteUrl("/") }],
  }),
  component: HomePage,
});

function HomePage() {
  // Seed every query with the server-fetched data so the first render (and
  // the HTML sent to crawlers) already has real content — React Query then
  // takes over client-side for live refetching as normal.
  const loaderData = Route.useLoaderData();
  const latest = useQuery({
    queryKey: ["latest", HOME_ARTICLE_COUNT],
    queryFn: () => fetchPublishedArticles(HOME_ARTICLE_COUNT),
    initialData: loaderData.latest,
  });
  const categories = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    initialData: loaderData.categories,
  });

  const breaking = useQuery({ queryKey: ["breaking"], queryFn: () => fetchBreaking(8) });

  // Story placement and de-duplication (a story is used in exactly one slot)
  // live in EditorialHome. Articles arrive newest-first from fetchPublishedArticles.
  const hasStories = (latest.data ?? []).length > 0;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Breaking ribbon: only articles marked "Breaking" in the admin */}
      {(breaking.data ?? []).length > 0 && (
        <div className="container-page mt-4">
          <div className="flex items-center gap-4 overflow-hidden border border-border bg-[var(--brand)] px-4 py-2 text-white">
            <span className="shrink-0 bg-[var(--ink)] px-2 py-1 text-xs font-bold uppercase tracking-widest">
              Breaking
            </span>
            <div className="flex-1 overflow-hidden whitespace-nowrap">
              <div className="marquee inline-block">
                {[0, 1, 2, 3].map((copy) =>
                  (breaking.data ?? []).map((a) => (
                    <Link
                      key={`${copy}-${a.id}`}
                      to="/article/$slug"
                      params={{ slug: a.slug }}
                      className="mr-10 text-sm font-medium hover:underline"
                    >
                      ● {a.title}
                    </Link>
                  )),
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <main className="container-page pb-10 pt-6">
        {/* Top banner ad */}
        <div className="mb-10 flex justify-center">
          <TrackedAdSlot placement="home-top" className="w-full max-w-4xl" />
        </div>

        {hasStories ? (
          <EditorialHome
            latest={latest.data ?? []}
            breaking={breaking.data ?? []}
            categories={categories.data ?? []}
          />
        ) : (
          <div className="mb-14 border border-dashed border-border p-8 text-center text-muted-foreground">
            <p className="font-serif text-xl">No stories published yet.</p>
          </div>
        )}

        <PreferredSource className="my-12" />

        {/* Mid-page ad */}
        <div className="mb-14 flex justify-center">
          <TrackedAdSlot placement="home-mid" className="w-full max-w-4xl" />
        </div>

        {/* Two-col: newsletter & sidebar ad */}
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
            <TrackedAdSlot placement="sidebar" />
          </aside>
        </section>
      </main>

      <Footer />
    </div>
  );
}
