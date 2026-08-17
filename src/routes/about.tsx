import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { absoluteUrl } from "@/lib/site-url";

export const Route = createFileRoute("/about")({
  component: AboutPage,
  head: () => {
    const url = absoluteUrl("/about");
    const description =
      "The Dispatch is an independent newsroom covering politics, business, technology, sport and football predictions.";
    return {
      meta: [
        { title: "About — The Dispatch" },
        { name: "description", content: description },
        { property: "og:title", content: "About The Dispatch" },
        { property: "og:description", content: description },
        { property: "og:url", content: url },
      ],
      links: [{ rel: "canonical", href: url }],
    };
  },
});

function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container-page py-10">
        <article className="mx-auto max-w-3xl">
          <h1 className="font-serif text-4xl font-black text-[var(--ink)] md:text-5xl">
            About The Dispatch
          </h1>
          <div className="article-prose mt-8">
            <p>
              The Dispatch is an independent digital newsroom covering politics, business,
              technology, sport and international affairs, alongside a dedicated football
              predictions section offering match analysis and tips.
            </p>

            <h2>What we cover</h2>
            <p>
              Our newsroom publishes original reporting and analysis across politics, business,
              finance, technology, health, sport, entertainment, international news and local
              news. Our football predictions team publishes match previews, form guides and
              tips based on publicly available fixture and results data.
            </p>

            <h2>Our editorial mission</h2>
            <p>
              We aim to report accurately, correct mistakes openly, and keep a clear line
              between news reporting and opinion or prediction content. Our full editorial
              standards are set out in our{" "}
              <Link to="/editorial-policy" className="text-[var(--brand)] underline">
                Editorial Policy
              </Link>
              .
            </p>

            <h2>Who operates The Dispatch</h2>
            <p>
              The Dispatch is an independently operated publication. For questions about
              ownership, editorial decisions or corrections, see our{" "}
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