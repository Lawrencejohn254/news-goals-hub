import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { absoluteUrl } from "@/lib/site-url";

export const Route = createFileRoute("/editorial-policy")({
  component: EditorialPolicyPage,
  head: () => {
    const url = absoluteUrl("/editorial-policy");
    const description = "How The Dispatch sources, verifies, and corrects its reporting.";
    return {
      meta: [
        { title: "Editorial Policy — The Dispatch" },
        { name: "description", content: description },
        { property: "og:title", content: "Editorial Policy — The Dispatch" },
        { property: "og:description", content: description },
        { property: "og:url", content: url },
      ],
      links: [{ rel: "canonical", href: url }],
    };
  },
});

function EditorialPolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container-page py-10">
        <article className="mx-auto max-w-3xl">
          <h1 className="font-serif text-4xl font-black text-[var(--ink)] md:text-5xl">
            Editorial Policy
          </h1>

          <div className="article-prose mt-8">
            <h2>Editorial independence</h2>
            <p>
              Our reporting and editorial decisions are made independently of advertisers,
              sponsors, and any business relationships The Dispatch may have. Advertising
              content is clearly presented as such and never influences our news coverage.
            </p>

            <h2>Source attribution</h2>
            <p>
              Where an article draws on external reporting, data, or statements, we attribute
              the source and link to it where possible. Original reporting and analysis is
              credited to the author byline shown on the article.
            </p>

            <h2>Accuracy</h2>
            <p>
              We aim to verify facts before publication. Football predictions are clearly
              labelled as analysis and opinion, not news reporting, and carry their own
              disclaimer (see our{" "}
              <Link to="/disclaimer" className="text-[var(--brand)] underline">
                Disclaimer
              </Link>
              ).
            </p>

            <h2>Corrections</h2>
            <p>
              When we get something wrong, we correct it. Articles that have been
              substantively updated after publication show an updated date. For factual
              errors, we aim to correct the article promptly once verified. To report a
              possible error, use our{" "}
              <Link to="/contact" className="text-[var(--brand)] underline">
                Contact
              </Link>{" "}
              page and select "Corrections."
            </p>

            <h2>Conflicts of interest</h2>
            <p>
              Where a writer or editor has a personal or financial interest relevant to a
              story they're covering, that should be disclosed within the article. If you
              believe a conflict of interest wasn't disclosed, please let us know via the
              Contact page.
            </p>

            <h2>Comments moderation</h2>
            <p>
              Reader comments are reviewed before publication. We moderate for abuse,
              harassment, and unlawful content — not for disagreement with our reporting or
              opinions expressed.
            </p>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}