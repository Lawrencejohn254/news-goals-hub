import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";

const STORAGE_KEY = "ad-consent";
type Consent = "granted" | "denied";

function applyConsent(consent: Consent) {
  if (typeof window === "undefined") return;
  const w = window as unknown as { gtag?: (...args: unknown[]) => void };
  // gtag is defined by the consent-default script in __root.tsx, which
  // always runs first — see that file for why the ordering matters.
  w.gtag?.("consent", "update", {
    ad_storage: consent,
    analytics_storage: consent,
    ad_user_data: consent,
    ad_personalization: consent,
  });
}

export function ConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Matches the script in __root.tsx, which only loads in production —
    // no point showing a banner for ads that aren't even present locally.
    if (!import.meta.env.PROD) return;

    const stored = localStorage.getItem(STORAGE_KEY) as Consent | null;
    if (stored === "granted" || stored === "denied") {
      // Every fresh page load starts consent as "denied" by default (see
      // __root.tsx) — re-apply the visitor's earlier choice immediately so
      // returning visitors aren't shown the banner again.
      applyConsent(stored);
    } else {
      setVisible(true);
    }
  }, []);

  const choose = (consent: Consent) => {
    applyConsent(consent);
    localStorage.setItem(STORAGE_KEY, consent);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-[var(--ink)] p-4 text-white shadow-lg">
      <div className="container-page flex flex-col items-center justify-between gap-3 sm:flex-row">
        <p className="text-sm text-white/80">
          We use cookies to show ads and understand site traffic. See our{" "}
          <Link to="/privacy-policy" className="underline hover:text-white">
            Privacy Policy
          </Link>{" "}
          for details.
        </p>
        <div className="flex shrink-0 gap-2">
          {/* Reject given equal visual weight to Accept, deliberately —
              regulators specifically flag banners that make declining
              harder or less visible than accepting. */}
          <button
            onClick={() => choose("denied")}
            className="border border-white/30 px-4 py-2 text-sm font-semibold hover:bg-white/10"
          >
            Reject
          </button>
          <button
            onClick={() => choose("granted")}
            className="bg-[var(--brand)] px-4 py-2 text-sm font-semibold hover:bg-[var(--brand)]/90"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}