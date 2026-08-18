import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { absoluteUrl } from "@/lib/site-url";

export const Route = createFileRoute("/terms")({
  component: TermsPage,
  head: () => {
    const url = absoluteUrl("/terms");
    const description = "Terms of use for The Dispatch website.";
    return {
      meta: [
        { title: "Terms of Use — The Dispatch" },
        { name: "description", content: description },
        { property: "og:title", content: "Terms of Use — The Dispatch" },
        { property: "og:description", content: description },
        { property: "og:url", content: url },
      ],
      links: [{ rel: "canonical", href: url }],
    };
  },
});

function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container-page py-10">
        <article className="mx-auto max-w-3xl">
          <h1 className="font-serif text-4xl font-black text-[var(--ink)] md:text-5xl">
            Terms of Use
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">Last updated: 2026</p>

          <div className="article-prose mt-8">
            <p>
              By using The Dispatch, you agree to these terms. If you don't agree, please
              don't use the site.
            </p>

            <h2>Using this site</h2>
            <p>
              You may read, share and link to our content for personal, non-commercial use.
              Republishing full articles without permission isn't allowed — for licensing or
              syndication, contact us.
            </p>

            <h2>Accounts</h2>
            <p>
              If you create an account, you're responsible for keeping access to your email
              secure, since that's how you sign in. Editorial and admin accounts require
              approval before they can be used, at our discretion.
            </p>

            <h2>Comments and user content</h2>
            <p>
              You're responsible for what you post in comments. We may remove or decline to
              publish comments that are abusive, unlawful, or otherwise inappropriate, without
              notice.
            </p>

            <h2>Football predictions</h2>
            <p>
              Predictions published on The Dispatch are opinion and analysis, not guarantees.
              See our{" "}
              <Link to="/disclaimer" className="text-[var(--brand)] underline">
                Disclaimer
              </Link>{" "}
              for details.
            </p>

            <h2>No warranty</h2>
            <p>
              The site and its content are provided "as is." We make reasonable efforts to
              keep information accurate and up to date, but we don't guarantee the site will
              be error-free or uninterrupted.
            </p>

            <h2>Changes</h2>
            <p>
              We may update these terms or the site's features from time to time. Continued
              use after changes means you accept the updated terms.
            </p>

            <h2>Contact</h2>
            <p>
              Questions about these terms can be sent via our{" "}
              <Link to="/contact" className="text-[var(--brand)] underline">
                Contact
              </Link>{" "}
              page.
            </p>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}