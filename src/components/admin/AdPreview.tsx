import { useState } from "react";
import type { PlacementSpec } from "@/lib/ad-placements";

type Props = {
  spec: PlacementSpec;
  imageUrl: string;
  html: string;
  targetUrl: string;
};

export function AdPreview({ spec, imageUrl, html, targetUrl }: Props) {
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");
  const size = (device === "desktop" ? spec.desktop : spec.mobile) ?? spec.desktop ?? spec.mobile;
  const width = size?.w ?? 468;
  const height = size?.h ?? 120;

  const hasHtml = html.trim().length > 0;
  const hasImage = imageUrl.trim().length > 0;

  return (
    <div className="border border-border bg-muted/30 p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="text-sm font-medium">Preview</p>
        {spec.desktop && spec.mobile && (
          <div className="flex border border-border text-xs">
            {(["desktop", "mobile"] as const).map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDevice(d)}
                className={`px-3 py-1 ${
                  device === d ? "bg-foreground text-background" : "bg-background text-muted-foreground"
                }`}
              >
                {d === "desktop" ? "Desktop" : "Mobile"}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="overflow-x-auto">
        <div
          className="relative border border-dashed border-border bg-background"
          style={{ width, maxWidth: "100%", aspectRatio: `${width} / ${height}` }}
        >
          <span className="absolute left-1 top-1 z-10 bg-background/90 px-1.5 py-0.5 text-[10px] text-muted-foreground">
            Sponsored
          </span>

          {hasHtml ? (
            // No allow-same-origin: the ad code cannot touch your admin session.
            <iframe
              title="Ad preview"
              sandbox="allow-scripts"
              srcDoc={html}
              className="h-full w-full border-0"
            />
          ) : hasImage ? (
            <img
              src={imageUrl}
              alt="Ad preview"
              className="h-full w-full object-contain"
              onError={(e) => ((e.currentTarget as HTMLImageElement).style.opacity = "0.2")}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center p-2 text-center text-xs text-muted-foreground">
              Upload an image or add custom HTML to see it here.
            </div>
          )}
        </div>
      </div>

      <p className="mt-2 text-xs text-muted-foreground">
        {size ? `${width}×${height}px slot` : "Flexible slot"}
        {targetUrl.trim() ? ` · Links to ${targetUrl.trim()}` : ""}
      </p>
    </div>
  );
}