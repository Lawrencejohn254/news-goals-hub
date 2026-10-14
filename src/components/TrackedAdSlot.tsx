import { useEffect, useMemo, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { getPlacementSpec } from "@/lib/ad-placements";

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

type Props = { placement: string; className?: string };

export function TrackedAdSlot({ placement, className }: Props) {
  const spec = getPlacementSpec(placement);
  const maxW = spec.desktop?.w ?? 970;
  const height = spec.desktop?.h ?? 250;
  const ref = useRef<HTMLElement>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["ad-slot", placement],
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ads")
        .select("id, name, image_url, html_code, target_url, starts_at, ends_at")
        .eq("placement", placement)
        .eq("is_active", true);
      if (error) throw error;
      const now = Date.now();
      return (data ?? []).filter(
        (a) =>
          (!a.starts_at || new Date(a.starts_at).getTime() <= now) &&
          (!a.ends_at || new Date(a.ends_at).getTime() >= now),
      );
    },
  });

  // Simple random pick for now. Weighted rotation comes in Phase 4.
  const ad = useMemo(
    () => (data && data.length ? data[Math.floor(Math.random() * data.length)] : null),
    [data],
  );

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