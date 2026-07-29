import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { fetchArticlesByCategory } from "@/lib/queries";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { ArticleCard } from "@/components/site/ArticleCard";

export const Route = createFileRoute("/category/$slug")({
  component: CategoryPage,
  head: ({ params }) => ({
    meta: [
      { title: `${cap(params.slug)} — The Dispatch` },
      {
        name: "description",
        content: `Latest ${cap(params.slug)} news, analysis, and reporting from The Dispatch.`,
      },
      { property: "og:title", content: `${cap(params.slug)} — The Dispatch` },
      { property: "og:url", content: `/category/${params.slug}` },
    ],
    links: [{ rel: "canonical", href: `/category/${params.slug}` }],
  }),
});

function cap(s: string) {
  return s.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function CategoryPage() {
  const { slug } = Route.useParams();
  const q = useQuery({
    queryKey: ["category", slug],
    queryFn: () => fetchArticlesByCategory(slug),
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container-page py-10">
        {q.isLoading ? (
          <p className="text-muted-foreground">Loading…</p>
        ) : !q.data?.category ? (
          <div className="py-20 text-center">
            <h1 className="font-serif text-4xl font-black">Section not found</h1>
            <Link to="/" className="mt-4 inline-block text-[var(--brand)] underline">
              Back to home
            </Link>
          </div>
        ) : (
          <>
            <header className="mb-10 border-b-2 border-[var(--ink)] pb-4">
              <span
                className="inline-block h-2 w-16"
                style={{ backgroundColor: q.data.category.color }}
              />
              <h1 className="mt-3 font-serif text-5xl font-black text-[var(--ink)]">
                {q.data.category.name}
              </h1>
              {q.data.category.description && (
                <p className="mt-2 max-w-2xl text-muted-foreground">
                  {q.data.category.description}
                </p>
              )}
            </header>

            {q.data.articles.length === 0 ? (
              <p className="text-muted-foreground">
                No stories in this section yet.
              </p>
            ) : (
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {q.data.articles.map((a) => (
                  <ArticleCard key={a.id} article={a} />
                ))}
              </div>
            )}
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
