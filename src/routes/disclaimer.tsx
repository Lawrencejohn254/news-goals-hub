import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { absoluteUrl } from "@/lib/site-url";

export const Route = createFileRoute("/disclaimer")({
  component: DisclaimerPage,
  head: () => {
    const url = absoluteUrl("/disclaimer");
    const description = "Important information about news accuracy and football predictions on The Dispatch.";
    return {
      meta: [
        { title: "Disclaimer — The Dispatch" },
        { name: "description", content: description },
        { property: "og:title", content: "Disclaimer — The Dispatch" },
        { property: "og:description", content: description },
        { property: "og:url", content: url },
      ],
      links: [{ rel: "canonical", href: url }],
    };
  },
});

function DisclaimerPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container-page py-10">
        <article className="mx-auto max-w-3xl">
          <h1 className="font-serif text-4xl font-black text-[var(--ink)] md:text-5xl">
            Disclaimer
          </h1>

          <div className="article-prose mt-8">
            <h2>News content</h2>
            <p>
              We aim for accuracy, but news situations can change quickly after publication.
              Where an article becomes outdated or inaccurate, we correct it — see our{" "}
              <Link to="/editorial-policy" className="text-[var(--brand)] underline">
                Editorial Policy
              </Link>
              . Always verify time-sensitive information (such as breaking news) against
              official sources before acting on it.
            </p>

            <h2>Football predictions</h2>
            <blockquote>
              18+. Predictions published on The Dispatch are opinion and analysis, not
              guarantees of any outcome. Past results shown on this site (where available) are
              historical and do not predict future results. Please gamble responsibly.
            </blockquote>
            <p>
              Our football predictions are informational content based on publicly available
              form, fixture and statistical data. They are not financial advice, and we make
              no promise — express or implied — about their accuracy or profitability. Any
              betting or wagering decision you make is entirely your own responsibility. If
              gambling is stopping being fun, or you feel you're losing control, please seek
              help from a qualified support service in your area.
            </p>

            <h2>External links</h2>
            <p>
              Articles may link to external websites for context or sourcing. We aren't
              responsible for the content or accuracy of external sites we don't control.
            </p>

            <h2>Questions</h2>
            <p>
              If you have concerns about a specific article or prediction, please use our{" "}
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