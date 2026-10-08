import { Link } from "@tanstack/react-router";
import type { ArticleWithMeta } from "@/lib/queries";
import { formatDate, relativeDate } from "@/lib/format";

export function ArticleCard({
  article,
  size = "md",
}: {
  article: ArticleWithMeta;
  size?: "sm" | "md" | "lg" | "hero" | "headline";
}) {
  const cat = article.categories;
  const author = article.profiles?.display_name ?? "Staff";

    if (size === "hero") {
    return (
      <Link
        to="/article/$slug"
        params={{ slug: article.slug }}
        className="group relative block min-h-[22rem] flex-1 overflow-hidden bg-[var(--ink)]"
      >
        <div className="absolute inset-0">
          {article.featured_image && (
            <img
              src={article.featured_image}
              alt={article.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
          )}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-5 md:p-8">
          {cat && (
            <span className="mb-3 inline-block bg-[var(--brand)] px-2 py-1 text-xs font-extrabold uppercase tracking-widest text-white">
              {cat.name}
            </span>
          )}
          <h2 className="text-2xl font-extrabold leading-tight text-white md:text-3xl">
            {article.title}
          </h2>
          {article.excerpt && (
            <p className="mt-3 hidden line-clamp-2 text-base text-white/80 md:block">
              {article.excerpt}
            </p>
          )}
          <div className="mt-3 text-xs font-semibold uppercase tracking-wide text-white/70">
            {relativeDate(article.published_at)}
          </div>
        </div>
      </Link>
    );
  }

  if (size === "headline") {
    return (
      <Link
        to="/article/$slug"
        params={{ slug: article.slug }}
        className="group block border-b border-border py-3 last:border-b-0"
      >
        <h3 className="font-serif text-base font-bold leading-snug text-[var(--ink)] group-hover:text-[var(--brand)]">
          {article.title}
        </h3>
        <div className="mt-1 text-xs text-muted-foreground">
          {relativeDate(article.published_at)}
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
      <h3 className="mt-1 text-lg font-extrabold leading-tight text-[var(--ink)] group-hover:text-[var(--brand)]">
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