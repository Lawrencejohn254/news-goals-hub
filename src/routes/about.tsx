import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { absoluteUrl } from "@/lib/site-url";

export const Route = createFileRoute("/about")({
  component: AboutPage,
  head: () => {
    const url = absoluteUrl("/about");
    const description =
      "The Africa Daily Dispatch is an independent newsroom covering politics, business, technology, sport and football analysis.";
    return {
      meta: [
        { title: "About — The Africa Daily Dispatch" },
        { name: "description", content: description },
        { property: "og:title", content: "About The Africa Daily Dispatch" },
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
            About The Africa Daily Dispatch
          </h1>
          <div className="article-prose mt-8">
            <p>
              The Africa Daily Dispatch is an independent digital newsroom covering politics, business,
              technology, sport and international affairs, alongside a dedicated football
              analysis section offering match analysis and tips.
            </p>

            <h2>What we cover</h2>
            <p>
              Our newsroom publishes original reporting and analysis across politics, business,
              finance, technology, health, sport, entertainment, international news and local
              news. Our football analysis team publishes match previews, form guides and
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

            <h2>Who runs The Africa Daily Dispatch</h2>
            <p>
              The Africa Daily Dispatch is founded and edited by Lawrence John, who is based in
              Kenya and is responsible for what we publish. Articles carry the byline of the
              person who wrote them, and every story shows its publication date.
            </p>

            <h2>Sources and corrections</h2>
            <p>
              We attribute and link to the sources behind our reporting wherever we can. When we
              get something wrong we correct it openly and mark the update with a date. If you
              spot an error, choose the Corrections option on our{" "}
              <Link to="/contact" className="text-[var(--brand)] underline">
                Contact
              </Link>{" "}
              page.
            </p>

            <h2>Copyright and image credits</h2>
            <p>
              If you own a photograph or other material that appears on our site and would like
              it credited or removed, contact us with the page address and we will review it
              promptly.
            </p>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}