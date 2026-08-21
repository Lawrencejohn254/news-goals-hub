import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportError } from "../lib/error-reporting";
import { supabase } from "@/integrations/supabase/client";
import { Toaster } from "@/components/ui/sonner";

const NOT_FOUND_CATEGORIES = [
  { label: "Politics", slug: "politics" },
  { label: "Business", slug: "business" },
  { label: "Technology", slug: "technology" },
  { label: "Sports", slug: "sports" },
  { label: "Entertainment", slug: "entertainment" },
  { label: "International", slug: "international" },
];

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-16">
      <div className="max-w-lg text-center">
        <h1 className="font-serif text-7xl font-black text-[var(--ink)]">404</h1>
        <h2 className="mt-4 text-xl font-semibold">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center justify-center bg-[var(--brand)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--brand)]/90"
          >
            Back to home
          </Link>
          <Link
            to="/search"
            className="inline-flex items-center justify-center border border-border px-4 py-2 text-sm font-semibold hover:bg-muted"
          >
            Search the site
          </Link>
        </div>

        <div className="mt-10 border-t border-border pt-6">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Or browse a section
          </p>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm">
            {NOT_FOUND_CATEGORIES.map((c) => (
              <Link
                key={c.slug}
                to="/category/$slug"
                params={{ slug: c.slug }}
                className="text-[var(--brand)] hover:underline"
              >
                {c.label}
              </Link>
            ))}
            <Link to="/predictions" className="text-[var(--brand)] hover:underline">
              Predictions
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold">This page didn't load</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center bg-[var(--brand)] px-4 py-2 text-sm font-semibold text-white"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center border border-input px-4 py-2 text-sm font-medium"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "The Dispatch — News, Analysis & Football Predictions" },
      {
        name: "description",
        content:
          "Independent reporting on politics, business, technology, and sport — plus expert football predictions and match analysis.",
      },
      { property: "og:site_name", content: "The Dispatch" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@700;900&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
        {/* AdSense Auto ads — Google decides ad placement automatically.
            Production-only: loading this in local dev/preview risks
            accidental self-clicks, which AdSense treats as invalid
            traffic and can penalize the account for. */}
        {import.meta.env.PROD && (
          <script
            async
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5403976968935620"
            crossOrigin="anonymous"
          />
        )}
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const router = useRouter();

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event !== "SIGNED_IN" && event !== "SIGNED_OUT" && event !== "USER_UPDATED") return;
      router.invalidate();
      if (event !== "SIGNED_OUT") queryClient.invalidateQueries();
    });
    return () => sub.subscription.unsubscribe();
  }, [router, queryClient]);

  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
      <Toaster />
    </QueryClientProvider>
  );
}