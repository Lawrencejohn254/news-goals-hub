import { createFileRoute, Link } from "@tanstack/react-router";
import { fetchAuthorWithArticles } from "@/lib/queries";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { ArticleCard } from "@/components/site/ArticleCard";
import { absoluteUrl } from "@/lib/site-url";

export const Route = createFileRoute("/authors/$id")({
  component: AuthorPage,
  loader: async ({ params }) => {
    const result = await fetchAuthorWithArticles(params.id);
    return result;
  },
  head: ({ loaderData, params }) => {
    const url = absoluteUrl(`/authors/${params.id}`);
    const profile = loaderData?.profile;
    if (!profile) {
      return {
        meta: [{ title: "Author — The Dispatch" }],
        links: [{ rel: "canonical", href: url }],
      };
    }
    const name = profile.display_name ?? "Staff";
    const description =
      profile.bio?.trim() || `Articles by ${name} on The Dispatch.`;
    return {
      meta: [
        { title: `${name} — The Dispatch` },
        { name: "description", content: description },
        { property: "og:type", content: "profile" },
        { property: "og:site_name", content: "The Dispatch" },
        { property: "og:title", content: name },
        { property: "og:description", content: description },
        { property: "og:url", content: url },
      ],
      links: [{ rel: "canonical", href: url }],
    };
  },
  notFoundComponent: () => (
    <div className="min-h-screen">
      <Header />
      <main className="container-page py-20 text-center">
        <h1 className="font-serif text-5xl font-black">Author not found</h1>
        <Link to="/" className="mt-4 inline-block text-[var(--brand)] underline">
          Back to home
        </Link>
      </main>
      <Footer />
    </div>
  ),
});

function Avatar({ name, avatarUrl, size = 72 }: { name: string; avatarUrl: string | null; size?: number }) {
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
      className="flex items-center justify-center rounded-full bg-[var(--ink)] text-2xl font-bold text-white"
    >
      {name.slice(0, 2).toUpperCase()}
    </span>
  );
}

function AuthorPage() {
  const { profile, articles } = Route.useLoaderData();

  if (!profile) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="container-page py-20 text-center">
          <h1 className="font-serif text-5xl font-black">Author not found</h1>
          <Link to="/" className="mt-4 inline-block text-[var(--brand)] underline">
            Back to home
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const name = profile.display_name ?? "Staff";

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container-page py-10">
        <header className="mx-auto flex max-w-3xl items-center gap-5 border-b-2 border-[var(--ink)] pb-8">
          <Avatar name={name} avatarUrl={profile.avatar_url} />
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Author
            </p>
            <h1 className="mt-1 font-serif text-3xl font-black text-[var(--ink)] md:text-4xl">
              {name}
            </h1>
            {profile.bio && <p className="mt-2 text-muted-foreground">{profile.bio}</p>}
          </div>
        </header>

        <section className="mx-auto mt-10 max-w-5xl">
          <h2 className="mb-6 font-serif text-xl font-bold uppercase tracking-wider">
            Articles by {name}
          </h2>
          {articles.length === 0 ? (
            <p className="text-muted-foreground">No published articles yet.</p>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {articles.map((a) => (
                <ArticleCard key={a.id} article={a} />
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}