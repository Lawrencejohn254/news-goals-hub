import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { fetchArticlesByCategory } from "@/lib/queries";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { EditorialCategory } from "@/components/site/editorial/EditorialCategory";
import { absoluteUrl } from "@/lib/site-url";

export const Route = createFileRoute("/category/$slug")({
  component: CategoryPage,
  // Server-fetch the category + its articles so both are present in the
  // initial HTML for crawlers, instead of only ever loading client-side.
  loader: async ({ params }) => {
    const result = await fetchArticlesByCategory(params.slug);
    return result;
  },
  head: ({ loaderData, params }) => {
    const cat = loaderData?.category;
    const name = cat?.name ?? cap(params.slug);
    const description =
      cat?.description?.trim() ||
      `Latest ${name} news, analysis, and reporting from The Africa Daily Dispatch.`;
    const path = `/category/${params.slug}`;
    const url = absoluteUrl(path);

    return {
      meta: [
        { title: `${name} — The Africa Daily Dispatch` },
        { name: "description", content: description },
        { property: "og:type", content: "website" },
        { property: "og:site_name", content: "The Africa Daily Dispatch" },
        { property: "og:title", content: `${name} — The Africa Daily Dispatch` },
        { property: "og:description", content: description },
        { property: "og:url", content: url },
      ],
      links: [{ rel: "canonical", href: url }],
    };
  },
});

function cap(s: string) {
  return s.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function CategoryPage() {
  const { slug } = Route.useParams();
  const loaderData = Route.useLoaderData();
  const q = useQuery({
    queryKey: ["category", slug],
    queryFn: () => fetchArticlesByCategory(slug),
    initialData: loaderData,
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container-page py-10">
        {!q.data?.category ? (
          <div className="py-20 text-center">
            <h1 className="font-serif text-4xl font-black">Section not found</h1>
            <Link to="/" className="mt-4 inline-block text-[var(--brand)] underline">
              Back to home
            </Link>
          </div>
        ) : (
          <>
            {q.data.articles.length === 0 ? (
              <>
                <h1 className="font-serif text-3xl font-black text-[var(--ink)]">
                  {q.data.category.name}
                </h1>
                <p className="mt-4 text-muted-foreground">No stories in this section yet.</p>
              </>
            ) : (
              <EditorialCategory category={q.data.category} articles={q.data.articles} />
            )}
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
