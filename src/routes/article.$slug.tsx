import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { fetchArticleBySlug, fetchPublishedArticles } from "@/lib/queries";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { ArticleCard } from "@/components/site/ArticleCard";
import { formatDate } from "@/lib/format";
import { Comments } from "@/components/site/Comments";
import { AdSlot } from "@/components/site/AdSlot";
import { logPageView } from "@/lib/site";

export const Route = createFileRoute("/article/$slug")({
  component: ArticlePage,
  head: ({ params }) => ({
    meta: [
      { title: `${params.slug} — The Dispatch` },
      { property: "og:type", content: "article" },
      { property: "og:url", content: `/article/${params.slug}` },
    ],
    links: [{ rel: "canonical", href: `/article/${params.slug}` }],
  }),
  notFoundComponent: () => (
    <div className="min-h-screen">
      <Header />
      <main className="container-page py-20 text-center">
        <h1 className="font-serif text-5xl font-black">Article not found</h1>
        <Link to="/" className="mt-4 inline-block text-[var(--brand)] underline">
          Back to home
        </Link>
      </main>
      <Footer />
    </div>
  ),
});

function ArticlePage() {
  const { slug } = Route.useParams();
  const q = useQuery({
    queryKey: ["article", slug],
    queryFn: () => fetchArticleBySlug(slug),
  });
  const related = useQuery({
    queryKey: ["related", q.data?.category_id],
    queryFn: () => fetchPublishedArticles(4),
    enabled: !!q.data,
  });

  useEffect(() => {
    if (!q.data) return;
    // Bump view count client-side (best-effort; not authoritative)
    supabase
      .from("articles")
      .update({ view_count: (q.data.view_count ?? 0) + 1 })
      .eq("id", q.data.id)
      .then(() => {});
  }, [q.data?.id]);

  if (q.isLoading) {
    return (
      <div>
        <Header />
        <main className="container-page py-10">
          <p className="text-muted-foreground">Loading…</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!q.data) throw notFound();
  const a = q.data;
  const cat = a.categories;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container-page py-10">
        <article className="mx-auto max-w-3xl">
          {cat && (
            <Link
              to="/category/$slug"
              params={{ slug: cat.slug }}
              className="inline-block px-2 py-1 text-xs font-bold uppercase tracking-widest text-white"
              style={{ backgroundColor: cat.color }}
            >
              {cat.name}
            </Link>
          )}
          <h1 className="mt-4 font-serif text-4xl font-black leading-tight text-[var(--ink)] md:text-5xl">
            {a.title}
          </h1>
          {a.excerpt && (
            <p className="mt-4 text-lg text-muted-foreground md:text-xl">
              {a.excerpt}
            </p>
          )}
          <div className="mt-6 flex flex-wrap items-center gap-3 border-y border-border py-4 text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">
              {a.profiles?.display_name ?? "Staff"}
            </span>
            <span>·</span>
            <span>{formatDate(a.published_at ?? a.created_at)}</span>
            <span>·</span>
            <span>{a.reading_time} min read</span>
            <span>·</span>
            <span>{a.view_count?.toLocaleString() ?? 0} views</span>
          </div>

          {a.featured_image && (
            <img
              src={a.featured_image}
              alt={a.title}
              className="mt-6 aspect-[16/9] w-full object-cover"
            />
          )}

          <div
            className="article-prose mt-8"
            dangerouslySetInnerHTML={{ __html: a.content }}
          />
        </article>

        {/* Related */}
        {related.data && related.data.length > 0 && (
          <section className="mx-auto mt-16 max-w-5xl">
            <h2 className="mb-6 border-b-2 border-[var(--ink)] pb-2 font-serif text-2xl font-bold uppercase tracking-wider">
              More stories
            </h2>
            <div className="grid gap-8 md:grid-cols-3">
              {related.data
                .filter((r) => r.id !== a.id)
                .slice(0, 3)
                .map((r) => (
                  <ArticleCard key={r.id} article={r} />
                ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
