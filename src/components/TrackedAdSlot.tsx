import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouterState } from "@tanstack/react-router";
import { getPlacementSpec } from "@/lib/ad-placements";

type ServedAd = {
  id: string;
  name: string;
  image_url: string | null;
  html_code: string | null;
  target_url: string | null;
  is_fallback: boolean;
};

function getSessionId(): string | null {
  try {
    let id = sessionStorage.getItem("ad_sid");
    if (!id) {
      id = crypto.randomUUID();
      sessionStorage.setItem("ad_sid", id);
    }
    return id;
  } catch {
    return null;
  }
}

/** Counts an impression once the ad has been at least 50% visible for 1 second. */
function useViewableImpression(ref: React.RefObject<HTMLElement | null>, adId: string | undefined) {
  useEffect(() => {
    const el = ref.current;
    if (!el || !adId) return;

    let timer: ReturnType<typeof setTimeout> | undefined;
    let sent = false;

    const send = () => {
      sent = true;
      fetch("/api/ad-event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          adId,
          type: "impression",
          pageUrl: window.location.pathname,
          sessionId: getSessionId(),
        }),
        keepalive: true,
      }).catch(() => {});
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (sent) return;
        if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
          if (timer) return;
          timer = setTimeout(() => {
            if (document.visibilityState === "visible") {
              send();
              io.disconnect();
            }
            timer = undefined;
          }, 1000);
        } else if (timer) {
          clearTimeout(timer);
          timer = undefined;
        }
      },
      { threshold: [0, 0.5, 1] },
    );

    io.observe(el);
    return () => {
      io.disconnect();
      if (timer) clearTimeout(timer);
    };
  }, [ref, adId]);
}

type Props = {
  placement: string;
  /** Site section / category slug (e.g. "politics"). Used for section targeting. */
  section?: string;
  className?: string;
};

export function TrackedAdSlot({ placement, section, className }: Props) {
  const spec = getPlacementSpec(placement);
  const maxW = spec.desktop?.w ?? 970;
  const height = spec.desktop?.h ?? 250;
  const ref = useRef<HTMLElement>(null);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  // The server decides which ad to show (targeting, rotation, caps, fallback).
  // Keyed by page so each new page view gets a fresh pick.
  const { data: ad, isLoading } = useQuery({
    queryKey: ["ad-serve", placement, section ?? "", pathname],
    staleTime: Infinity,
    gcTime: 60_000,
    retry: false,
    refetchOnWindowFocus: false,
    queryFn: async (): Promise<ServedAd | null> => {
      const params = new URLSearchParams({ placement });
      if (section) params.set("section", section);
      const res = await fetch(`/api/ad-serve?${params.toString()}`);
      if (!res.ok) return null;
      const json = (await res.json()) as { ad: ServedAd | null };
      return json.ad ?? null;
    },
  });

  useViewableImpression(ref, ad?.id);

  // Reserve space while loading so the page doesn't jump.
  if (isLoading) {
    return <div className={className} style={{ minHeight: height, maxWidth: maxW }} aria-hidden />;
  }
  if (!ad) return null;

  const hasHtml = !!ad.html_code?.trim();
  const hasImage = !!ad.image_url && !!ad.target_url;
  if (!hasHtml && !hasImage) return null;

  return (
    <aside ref={ref} className={className} aria-label="Advertisement" style={{ maxWidth: maxW }}>
      <p className="mb-1 text-[10px] uppercase tracking-widest text-muted-foreground">Sponsored</p>
      {hasHtml ? (
        // Clicks inside custom HTML can't be tracked (browser security). Impressions still are.
        <iframe
          title={ad.name}
          srcDoc={ad.html_code ?? ""}
          sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox"
          loading="lazy"
          className="w-full border-0"
          style={{ height }}
        />
      ) : (
        <a href={`/r/${ad.id}`} target="_blank" rel="noopener sponsored" className="block">
          <img
            src={ad.image_url ?? ""}
            alt={ad.name}
            loading="lazy"
            className="h-auto w-full"
            style={{ maxWidth: maxW }}
          />
        </a>
      )}
    </aside>
  );
}