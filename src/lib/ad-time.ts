export const AD_TZ = "Africa/Nairobi"; // UTC+3, no daylight saving

export type AdStatus = "draft" | "scheduled" | "active" | "paused" | "expired";

/** Reads a <input type="datetime-local"> value as Nairobi time and returns a UTC ISO string. */
export function nairobiInputToISO(value: string): string | null {
  if (!value) return null;
  const v = value.length === 16 ? `${value}:00` : value;
  const d = new Date(`${v}+03:00`);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}

const fmt = new Intl.DateTimeFormat("en-KE", {
  timeZone: AD_TZ,
  dateStyle: "medium",
  timeStyle: "short",
});

export function formatNairobi(iso: string | null | undefined): string {
  if (!iso) return "—";
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "—" : fmt.format(d);
}

/** Status to show in the UI: stored status adjusted for the current time. */
export function effectiveStatus(
  ad: {
    status?: string | null;
    is_active: boolean;
    starts_at: string | null;
    ends_at: string | null;
  },
  now: Date = new Date(),
): AdStatus {
  const stored = (ad.status ?? (ad.is_active ? "active" : "paused")) as AdStatus;
  if (stored === "draft" || stored === "paused") return stored;
  if (ad.ends_at && new Date(ad.ends_at) < now) return "expired";
  if (ad.starts_at && new Date(ad.starts_at) > now) return "scheduled";
  return "active";
}

/** Status to store when publishing an ad with these dates. */
export function publishStatus(startsAtISO: string | null, now: Date = new Date()): AdStatus {
  return startsAtISO && new Date(startsAtISO) > now ? "scheduled" : "active";
}