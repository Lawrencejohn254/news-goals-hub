import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { ArticleCard } from "@/components/site/ArticleCard";
import { supabase } from "@/integrations/supabase/client";
import type { ArticleWithMeta } from "@/lib/queries";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/search")({
  component: SearchPage,
  validateSearch: (s: Record<string, unknown>) => ({ q: typeof s.q === "string" ? s.q : "" }),
  head: () => ({
    meta: [
      { title: "Search — The Dispatch" },
      { name: "description", content: "Search news, analysis and football predictions from The Dispatch." },
      { property: "og:title", content: "Search The Dispatch" },
      { property: "og:description", content: "Find news stories, analysis and football predictions." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
});

function SearchPage() {
  const { q: initial } = Route.useSearch();
  const [term, setTerm] = useState(initial);
  const navigate = Route.useNavigate();

  const results = useQuery({
    queryKey: ["search", initial],
    enabled: initial.trim().length > 1,
    queryFn: async () => {
      // Cap length and strip PostgREST/ILIKE special characters so the
      // value can never be interpreted as anything but a literal search
      // term, however it's later combined into a query.
      const cleaned = initial
        .trim()
        .slice(0, 100)
        .replace(/[%_,.()]/g, "");
      const like = `%${cleaned}%`;

      // Two separate parameterized queries instead of a single hand-built
      // `.or()` string — each .ilike() call passes its value as a bound
      // parameter, so there's no raw string for user input to break out of.
      const [byTitle, byExcerpt, preds] = await Promise.all([
        supabase
          .from("articles")
          .select("*, categories(id,name,slug,color), profiles!articles_author_profile_fkey(display_name,avatar_url)")
          .eq("status", "published")
          .ilike("title", like)
          .limit(20),
        supabase
          .from("articles")
          .select("*, categories(id,name,slug,color), profiles!articles_author_profile_fkey(display_name,avatar_url)")
          .eq("status", "published")
          .ilike("excerpt", like)
          .limit(20),
        supabase
          .from("predictions")
          .select("id,slug,title,tip")
          .eq("is_published", true)
          .ilike("title", like)
          .limit(10),
      ]);

      // Merge + de-dupe the two article result sets (title match ∪ excerpt match)
      const seen = new Set<string>();
      const articles: ArticleWithMeta[] = [];
      for (const a of [...(byTitle.data ?? []), ...(byExcerpt.data ?? [])] as unknown as ArticleWithMeta[]) {
        if (!seen.has(a.id)) {
          seen.add(a.id);
          articles.push(a);
        }
      }

      return {
        articles: articles.slice(0, 20),
        predictions: preds.data ?? [],
      };
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container-page py-10">
        <h1 className="font-serif text-4xl font-black">Search</h1>
        <form
          className="mt-4 flex max-w-xl gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            navigate({ search: { q: term } });
          }}
        >
          <Input value={term} onChange={(e) => setTerm(e.target.value)} placeholder="Search stories…" maxLength={100} />
          <button className="bg-[var(--brand)] px-5 text-sm font-semibold text-white">Search</button>
        </form>

        {initial && (
          <p className="mt-6 text-sm text-muted-foreground">
            Results for <span className="font-semibold text-foreground">"{initial}"</span>
          </p>
        )}

        {results.isLoading && <p className="mt-6 text-muted-foreground">Searching…</p>}

        {results.data && (
          <>
            <div className="mt-8 grid gap-8 md:grid-cols-3">
              {results.data.articles.map((a) => (
                <ArticleCard key={a.id} article={a} />
              ))}
            </div>
            {results.data.predictions.length > 0 && (
              <section className="mt-12">
                <h2 className="mb-4 border-b-2 border-[var(--ink)] pb-2 font-serif text-xl font-bold uppercase tracking-wider">
                  Predictions
                </h2>
                <ul className="space-y-2 text-sm">
                  {results.data.predictions.map((p) => (
                    <li key={p.id}>
                      <a href={`/predictions/${p.slug}`} className="font-semibold hover:text-[var(--brand)]">
                        {p.title}
                      </a>{" "}
                      <span className="text-muted-foreground">— {p.tip}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}
            {results.data.articles.length === 0 && results.data.predictions.length === 0 && (
              <p className="mt-8 text-muted-foreground">No matches found.</p>
            )}
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}