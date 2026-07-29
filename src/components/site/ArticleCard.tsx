import { Link } from "@tanstack/react-router";
import type { ArticleWithMeta } from "@/lib/queries";
import { formatDate } from "@/lib/format";

export function ArticleCard({
  article,
  size = "md",
}: {
  article: ArticleWithMeta;
  size?: "sm" | "md" | "lg" | "hero";
}) {
  const cat = article.categories;
  const author = article.profiles?.display_name ?? "Staff";

  if (size === "hero") {
    return (
      <Link
        to="/article/$slug"
        params={{ slug: article.slug }}
        className="group grid gap-6 md:grid-cols-2"
      >
        <div className="aspect-[16/10] overflow-hidden bg-muted">
          {article.featured_image ? (
            <img
              src={article.featured_image}
              alt={article.title}
              className="h-full w-full object-cover transition-transform group-hover:scale-[1.02]"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              <span className="font-serif text-4xl">📰</span>
            </div>
          )}
        </div>
        <div className="flex flex-col justify-center">
          {cat && (
            <span
              className="mb-3 inline-block w-fit px-2 py-1 text-xs font-bold uppercase tracking-widest text-white"
              style={{ backgroundColor: cat.color }}
            >
              {cat.name}
            </span>
          )}
          <h2 className="font-serif text-3xl font-black leading-tight text-[var(--ink)] group-hover:text-[var(--brand)] md:text-5xl">
            {article.title}
          </h2>
          {article.excerpt && (
            <p className="mt-4 text-base text-muted-foreground md:text-lg">
              {article.excerpt}
            </p>
          )}
          <div className="mt-4 text-sm text-muted-foreground">
            By <span className="font-semibold text-foreground">{author}</span> ·{" "}
            {formatDate(article.published_at)} · {article.reading_time} min read
          </div>
        </div>
      </Link>
    );
  }

  if (size === "sm") {
    return (
      <Link
        to="/article/$slug"
        params={{ slug: article.slug }}
        className="group flex gap-3 border-b border-border pb-3 last:border-b-0"
      >
        {article.featured_image && (
          <div className="h-16 w-20 shrink-0 overflow-hidden bg-muted">
            <img
              src={article.featured_image}
              alt={article.title}
              className="h-full w-full object-cover"
            />
          </div>
        )}
        <div className="min-w-0">
          {cat && (
            <span
              className="text-[10px] font-bold uppercase tracking-wider"
              style={{ color: cat.color }}
            >
              {cat.name}
            </span>
          )}
          <h3 className="font-serif text-sm font-bold leading-snug text-[var(--ink)] group-hover:text-[var(--brand)]">
            {article.title}
          </h3>
        </div>
      </Link>
    );
  }

  return (
    <Link
      to="/article/$slug"
      params={{ slug: article.slug }}
      className="group block"
    >
      <div className="aspect-[16/10] overflow-hidden bg-muted">
        {article.featured_image ? (
          <img
            src={article.featured_image}
            alt={article.title}
            className="h-full w-full object-cover transition-transform group-hover:scale-[1.02]"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            <span className="font-serif text-2xl">📰</span>
          </div>
        )}
      </div>
      {cat && (
        <span
          className="mt-3 inline-block text-xs font-bold uppercase tracking-widest"
          style={{ color: cat.color }}
        >
          {cat.name}
        </span>
      )}
      <h3 className="mt-1 font-serif text-xl font-bold leading-snug text-[var(--ink)] group-hover:text-[var(--brand)]">
        {article.title}
      </h3>
      {article.excerpt && (
        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
          {article.excerpt}
        </p>
      )}
      <div className="mt-2 text-xs text-muted-foreground">
        {author} · {formatDate(article.published_at)}
      </div>
    </Link>
  );
}
