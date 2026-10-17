/**
 * Google Analytics 4 settings.
 *
 * Paste your GA4 Measurement ID (it looks like G-XXXXXXXXXX) between the quotes
 * below, or set VITE_GA_MEASUREMENT_ID in your hosting environment instead.
 * While this is empty, no analytics code loads at all. The ID is public (it is
 * visible in any page's source), so it is safe to keep in the repo.
 */
export const GA_MEASUREMENT_ID: string = import.meta.env.VITE_GA_MEASUREMENT_ID || "G-002G16T5D0";

/** Only well-formed GA4 IDs are used; anything else disables analytics. */
export const GA_ENABLED = /^G-[A-Z0-9]{6,}$/.test(GA_MEASUREMENT_ID);

/** Staff areas are never counted, so your own editing doesn't skew traffic. */
export function isTrackedPath(pathname: string): boolean {
  return !/^\/(admin|auth)(\/|$)/.test(pathname);
}
