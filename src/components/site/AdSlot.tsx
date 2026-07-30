import { useQuery } from "@tanstack/react-query";
import { fetchActiveAds } from "@/lib/site";
import { supabase } from "@/integrations/supabase/client";

export function AdSlot({ placement, className = "" }: { placement: string; className?: string }) {
  const q = useQuery({
    queryKey: ["ads", placement],
    queryFn: () => fetchActiveAds(placement),
    staleTime: 5 * 60_000,
  });

  const ad = q.data?.[0];
  if (!ad) return null;

  const track = (field: "impressions" | "clicks") => {
    const patch =
      field === "clicks"
        ? { clicks: (ad.clicks ?? 0) + 1 }
        : { impressions: (ad.impressions ?? 0) + 1 };
    supabase
      .from("ads")
      .update(patch)
      .eq("id", ad.id)
      .then(() => {});
  };

  const inner = ad.html_code ? (
    <div dangerouslySetInnerHTML={{ __html: ad.html_code }} />
  ) : ad.image_url ? (
    <img src={ad.image_url} alt={ad.name} className="mx-auto max-h-[280px] w-full object-contain" />
  ) : null;

  if (!inner) return null;

  return (
    <div className={`border border-border bg-muted/30 p-3 ${className}`}>
      <p className="mb-2 text-center text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
        Advertisement
      </p>
      {ad.target_url ? (
        <a
          href={ad.target_url}
          target="_blank"
          rel="noopener noreferrer sponsored"
          onClick={() => track("clicks")}
          onMouseEnter={() => track("impressions")}
        >
          {inner}
        </a>
      ) : (
        inner
      )}
    </div>
  );
}
