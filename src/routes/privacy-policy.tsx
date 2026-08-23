import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { absoluteUrl } from "@/lib/site-url";

export const Route = createFileRoute("/privacy-policy")({
  component: PrivacyPage,
  head: () => {
    const url = absoluteUrl("/privacy-policy");
    const description = "How The Dispatch collects, stores and uses your information.";
    return {
      meta: [
        { title: "Privacy Policy — The Dispatch" },
        { name: "description", content: description },
        { property: "og:title", content: "Privacy Policy — The Dispatch" },
        { property: "og:description", content: description },
        { property: "og:url", content: url },
      ],
      links: [{ rel: "canonical", href: url }],
    };
  },
});

function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container-page py-10">
        <article className="mx-auto max-w-3xl">
          <h1 className="font-serif text-4xl font-black text-[var(--ink)] md:text-5xl">
            Privacy Policy
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">Last updated: 2026</p>

          <div className="article-prose mt-8">
            <p>
              This policy explains what information The Dispatch collects and how it's used.
              We only describe services this website actually uses — nothing more.
            </p>

            <h2>Account information</h2>
            <p>
              If you create an account to comment or access editorial tools, we store your
              email address, a display name, an optional short bio, and an optional avatar
              image. Sign-in is passwordless: we email you a one-time code, and you're
              authenticated by entering it. We don't store passwords for accounts created this
              way. Session information is kept in your browser's local storage, not in
              third-party tracking cookies.
            </p>

            <h2>Newsletter subscriptions</h2>
            <p>
              If you subscribe to our newsletter, we store the email address you provide and
              the page you subscribed from, solely to send you the newsletter and let you
              unsubscribe. We don't sell or share this list with third parties.
            </p>

            <h2>Comments</h2>
            <p>
              Comments are linked to your account and are reviewed before appearing publicly.
              Deleting your account removes your comments.
            </p>

            <h2>Page views and analytics</h2>
            <p>
              We log basic page-view data (the page visited, referring page, and timestamp)
              in our own database to understand which stories are being read — this is not
              shared with advertisers or data brokers. We do not currently run third-party
              analytics (such as Google Analytics) on the site. If that changes in the future,
              this policy will be updated to reflect it before any such tool goes live.
            </p>

            <h2>Cookies</h2>
            <p>
              We use the minimum browser storage needed for the site to function — for
              example, keeping you signed in. Beyond that, our advertising partner also sets
              cookies on this site — see "Advertising" below for what that involves.
            </p>

            <h2>Advertising</h2>
            <p>
              The Dispatch shows ads served by Google AdSense. Google and its advertising
              partners use cookies, device identifiers, and similar technologies to serve ads
              on this site, measure how they perform, and — where permitted — personalize
              which ads you see based on your visits here and to other sites. We don't control
              what data these cookies collect or how long they're retained; that's governed by
              each vendor's own privacy policy, not ours.
            </p>
            <p>
              Google's own summary of this, which we're required to link to, is available at{" "}
              <a
                href="https://policies.google.com/technologies/partner-sites"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--brand)] underline"
              >
                How Google uses information from sites that use our services
              </a>
              . A full list of third-party ad technology providers that may serve ads on this
              site is published by Google at{" "}
              <a
                href="https://support.google.com/adsense/answer/9012903"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--brand)] underline"
              >
                Google's ad technology providers
              </a>
              .
            </p>
            <p>
              <strong>Your choices:</strong> you can opt out of personalized advertising from
              Google at{" "}
              <a
                href="https://adssettings.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--brand)] underline"
              >
                Google Ads Settings
              </a>
              , and from many other ad networks at once via{" "}
              <a
                href="https://www.aboutads.info/choices"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--brand)] underline"
              >
                aboutads.info/choices
              </a>
              . Opting out doesn't stop ads from showing — it means the ads you see are no
              longer based on your browsing activity. You can also block cookies generally
              through your browser's settings, though doing so may affect how parts of this
              site (and others) work.
            </p>

            <h2>Your choices</h2>
            <p>
              You can update or delete your account information at any time by contacting us,
              and you can unsubscribe from the newsletter using the link in any newsletter
              email.
            </p>

            <h2>Questions</h2>
            <p>
              For any privacy question, see our{" "}
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