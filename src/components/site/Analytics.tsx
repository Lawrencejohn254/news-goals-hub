import { useEffect } from "react";
import { useLocation } from "@tanstack/react-router";
import { GA_ENABLED, isTrackedPath } from "@/lib/analytics";

/**
 * Sends a Google Analytics page_view whenever the visitor lands on a page or
 * navigates to another one. The site is a single-page app, so GA's automatic
 * page_view (which only fires on full page loads) is switched off in
 * __root.tsx and this component does it instead.
 *
 * gtag is defined by the consent script in __root.tsx, which starts every
 * visitor as "denied"; GA only sets cookies after they accept the banner.
 * Production only, like the AdSense script.
 */
export function Analytics() {
  const { pathname, searchStr } = useLocation();

  useEffect(() => {
    if (!import.meta.env.PROD || !GA_ENABLED || !isTrackedPath(pathname)) return;
    const w = window as unknown as { gtag?: (...args: unknown[]) => void };
    w.gtag?.("event", "page_view", {
      page_path: pathname + searchStr,
      page_location: window.location.href,
      page_title: document.title,
    });
  }, [pathname, searchStr]);

  return null;
}
