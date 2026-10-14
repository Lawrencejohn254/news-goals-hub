export type Size = { w: number; h: number };

export type PlacementSpec = {
  label: string;
  desktop: Size | null;
  mobile: Size | null;
  maxKB: number;
};

// Matched against the placement name (case-insensitive), first match wins.
// Edit the sizes here to match your real layout slots.
const RULES: { match: RegExp; spec: PlacementSpec }[] = [
  {
    match: /popup|modal/,
    spec: { label: "Popup", desktop: { w: 600, h: 400 }, mobile: { w: 300, h: 250 }, maxKB: 300 },
  },
  {
    match: /sidebar|side/,
    spec: { label: "Sidebar", desktop: { w: 300, h: 250 }, mobile: { w: 300, h: 250 }, maxKB: 200 },
  },
  {
    match: /article|in[-_ ]?content|inline/,
    spec: { label: "In-article", desktop: { w: 728, h: 90 }, mobile: { w: 300, h: 250 }, maxKB: 250 },
  },
  {
    match: /header|leaderboard/,
    spec: { label: "Header", desktop: { w: 728, h: 90 }, mobile: { w: 320, h: 50 }, maxKB: 150 },
  },
  {
    match: /footer/,
    spec: { label: "Footer", desktop: { w: 728, h: 90 }, mobile: { w: 320, h: 50 }, maxKB: 150 },
  },
  {
    match: /banner|home|hero/,
    spec: { label: "Homepage banner", desktop: { w: 970, h: 250 }, mobile: { w: 320, h: 100 }, maxKB: 300 },
  },
];

const FALLBACK: PlacementSpec = { label: "Custom", desktop: null, mobile: null, maxKB: 300 };

export function getPlacementSpec(placement: string): PlacementSpec {
  const key = placement.toLowerCase();
  return RULES.find((r) => r.match.test(key))?.spec ?? FALLBACK;
}

export function describeSpec(spec: PlacementSpec): string {
  const parts: string[] = [];
  if (spec.desktop) parts.push(`${spec.desktop.w}×${spec.desktop.h} desktop`);
  if (spec.mobile) parts.push(`${spec.mobile.w}×${spec.mobile.h} mobile`);
  if (!parts.length) return "Any size. Keep the file under " + spec.maxKB + " KB.";
  return `${parts.join(" / ")}. Max ${spec.maxKB} KB after compression.`;
}

export type ImageCheck = { error: string | null; warning: string | null };

// Accept an image if its shape matches the desktop OR mobile size (±12%).
export function checkImageForPlacement(w: number, h: number, spec: PlacementSpec): ImageCheck {
  const sizes = [spec.desktop, spec.mobile].filter(Boolean) as Size[];
  if (!sizes.length) return { error: null, warning: null };

  const ratio = w / h;
  const matches = sizes.some((s) => Math.abs(ratio - s.w / s.h) / (s.w / s.h) <= 0.12);
  if (!matches) {
    return {
      error: `This image is ${w}×${h}, which doesn't fit the ${spec.label} slot. Use ${describeSpec(spec).split(". ")[0]}.`,
      warning: null,
    };
  }

  const smallest = Math.min(...sizes.map((s) => s.w));
  if (w < smallest) {
    return {
      error: null,
      warning: `Image is ${w}px wide and may look blurry. Aim for at least ${smallest}px wide.`,
    };
  }
  return { error: null, warning: null };
}

export function maxUploadWidth(spec: PlacementSpec): number {
  const widths = [spec.desktop?.w, spec.mobile?.w].filter(Boolean) as number[];
  return widths.length ? Math.max(...widths) * 2 : 1600; // 2x for retina screens
}