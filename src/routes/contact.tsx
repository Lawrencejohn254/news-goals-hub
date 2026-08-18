import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { absoluteUrl } from "@/lib/site-url";
import { Mail } from "lucide-react";

// The one address the publication actually operates today. Swap this (or
// add real category-specific inboxes/aliases) once you set those up —
// everything below just changes the mailto subject line, not the address.
<<<<<<< HEAD
const CONTACT_EMAIL = "lawrencejohn860@gmail.com";
=======
const CONTACT_EMAIL = "contact@thedispach.com";
>>>>>>> origin/main

export const Route = createFileRoute("/contact")({
  component: ContactPage,
  head: () => {
    const url = absoluteUrl("/contact");
    const description = "Get in touch with The Dispatch — news tips, corrections, and general or advertising enquiries.";
    return {
      meta: [
        { title: "Contact — The Dispatch" },
        { name: "description", content: description },
        { property: "og:title", content: "Contact The Dispatch" },
        { property: "og:description", content: description },
        { property: "og:url", content: url },
      ],
      links: [{ rel: "canonical", href: url }],
    };
  },
});

const CATEGORIES = [
  {
    label: "General enquiries",
    subject: "General enquiry",
    description: "Questions about The Dispatch, feedback, or anything not covered below.",
  },
  {
    label: "News tips",
    subject: "News tip",
    description: "Have a story, lead, or something we should be looking into? Tell us here.",
  },
  {
    label: "Corrections",
    subject: "Correction request",
    description: "Spotted an error in one of our articles? Include the article URL and what's wrong.",
  },
  {
    label: "Advertising & business",
    subject: "Advertising enquiry",
    description: "Interested in advertising on The Dispatch or a business partnership.",
  },
];

function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container-page py-10">
        <div className="mx-auto max-w-3xl">
          <h1 className="font-serif text-4xl font-black text-[var(--ink)] md:text-5xl">
            Contact
          </h1>
          <p className="mt-4 text-muted-foreground">
            Reach out using whichever category fits best — each link opens your email client
            with the right subject line pre-filled.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {CATEGORIES.map((c) => (
              <a
                key={c.label}
                href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(`[The Dispatch] ${c.subject}`)}`}
                className="flex flex-col gap-2 border border-border bg-[var(--paper)] p-5 transition-colors hover:border-[var(--brand)]"
              >
                <span className="flex items-center gap-2 font-serif text-lg font-bold text-[var(--ink)]">
                  <Mail size={18} className="text-[var(--brand)]" />
                  {c.label}
                </span>
                <span className="text-sm text-muted-foreground">{c.description}</span>
              </a>
            ))}
          </div>

          <p className="mt-8 text-sm text-muted-foreground">
            You can also email us directly at{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-[var(--brand)] underline">
              {CONTACT_EMAIL}
            </a>
            .
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}