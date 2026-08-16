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
  // Fetch the article on the server before the page renders. This is what
  // makes per-article title/description/image tags actually work for link
  // previews on WhatsApp, Twitter/X, Facebook, etc. — those crawlers don't
  // run JavaScript, so meta tags populated only by a client-side useQuery
  // (as this page did before) are invisible to them; they'd only ever see
  // the generic fallback title.
  loader: async ({ params }) => {
    const article = await fetchArticleBySlug(params.slug);
    return { article };
  },
  head: ({ loaderData, params }) => {
    const a = loaderData?.article;
    if (!a) {
      return {
        meta: [{ title: `${params.slug} — The Dispatch` }],
      };
    }
    const title = a.seo_title?.trim() || `${a.title} — The Dispatch`;
    const description =
      a.seo_description?.trim() || a.excerpt?.trim() || "Read the full story on The Dispatch.";
    const image = a.featured_image ?? undefined;
    const path = `/article/${a.slug}`;

    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:type", content: "article" },
        { property: "og:title", content: a.title },
        { property: "og:description", content: description },
        { property: "og:url", content: path },
        ...(image ? [{ property: "og:image", content: image }] : []),
        { property: "article:published_time", content: a.published_at ?? a.created_at },
        { property: "article:modified_time", content: a.updated_at },
        ...(a.categories ? [{ property: "article:section", content: a.categories.name }] : []),
        { name: "twitter:card", content: image ? "summary_large_image" : "summary" },
        { name: "twitter:title", content: a.title },
        { name: "twitter:description", content: description },
        ...(image ? [{ name: "twitter:image", content: image }] : []),
      ],
      links: [{ rel: "canonical", href: path }],
    };
  },
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

function AuthorAvatar({
  name,
  avatarUrl,
  size = 36,
}: {
  name: string;
  avatarUrl: string | null | undefined;
  size?: number;
}) {
  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={name}
        style={{ width: size, height: size }}
        className="rounded-full object-cover"
      />
    );
  }
  return (
    <span
      style={{ width: size, height: size }}
      className="flex items-center justify-center rounded-full bg-[var(--ink)] text-xs font-bold text-white"
    >
      {name.slice(0, 2).toUpperCase()}
    </span>
  );
}

function ArticlePage() {
  const { slug } = Route.useParams();
  const { article: loaderArticle } = Route.useLoaderData();

  // Seed with the server-fetched article for an instant first paint, then
  // let React Query take over for live client-side behavior (view count
  // bump, refetch on window focus, etc).
  const q = useQuery({
    queryKey: ["article", slug],
    queryFn: () => fetchArticleBySlug(slug),
    initialData: loaderArticle,
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
    logPageView(`/article/${q.data.slug}`, { articleId: q.data.id });
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
  const authorName = a.profiles?.display_name ?? "Staff";

  // Structured data (schema.org NewsArticle) — this is what makes Google
  // News / rich-result eligibility possible, separate from plain OG tags.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: a.title,
    description: a.excerpt ?? a.seo_description ?? undefined,
    image: a.featured_image ? [a.featured_image] : undefined,
    datePublished: a.published_at ?? a.created_at,
    dateModified: a.updated_at,
    author: {
      "@type": "Person",
      name: authorName,
    },
    publisher: {
      "@type": "Organization",
      name: "The Dispatch",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `/article/${a.slug}`,
    },
    articleSection: cat?.name ?? undefined,
  };

  return (
    <div className="min-h-screen bg-background">
      {/* eslint-disable-next-line react/no-danger */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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

          {/* Byline — now shows the author's photo, not just their name */}
          <div className="mt-6 flex flex-wrap items-center gap-3 border-y border-border py-4 text-sm text-muted-foreground">
            <AuthorAvatar name={authorName} avatarUrl={a.profiles?.avatar_url} size={32} />
            <span className="font-semibold text-foreground">{authorName}</span>
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

          <AdSlot placement="article-inline" className="my-8" />

          <div
            className="article-prose mt-8"
            dangerouslySetInnerHTML={{ __html: a.content }}
          />

          {/* Written by — full author card with photo + bio */}
          <div className="mt-10 flex gap-4 border border-border bg-[var(--paper)] p-5">
            <AuthorAvatar name={authorName} avatarUrl={a.profiles?.avatar_url} size={56} />
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Written by
              </p>
              <p className="mt-1 font-serif text-lg font-bold text-[var(--ink)]">
                {authorName}
              </p>
              {a.profiles?.bio ? (
                <p className="mt-1 text-sm text-muted-foreground">{a.profiles.bio}</p>
              ) : (
                <p className="mt-1 text-sm text-muted-foreground">
                  Reporter at The Dispatch.
                </p>
              )}
            </div>
          </div>

          <AdSlot placement="article-bottom" className="my-10" />

          <Comments articleId={a.id} />
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