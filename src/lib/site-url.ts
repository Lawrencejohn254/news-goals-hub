/**
 * Single source of truth for the site's public production URL.
 *
 * Set VITE_SITE_URL in your environment (e.g. https://thedispatch.co.ke,
 * no trailing slash) once your custom domain is connected. Until it's set,
 * absoluteUrl() falls back to returning the relative path unchanged — still
 * valid for canonical/OG tags, just not a fully-qualified URL, so nothing
 * breaks before the domain is configured; it just becomes fully correct the
 * moment the env var is set.
 */
const SITE_URL = (import.meta.env.VITE_SITE_URL as string | undefined)?.replace(/\/+$/, "");

export function absoluteUrl(path: string): string {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return SITE_URL ? `${SITE_URL}${cleanPath}` : cleanPath;
}

export function getSiteUrl(): string | undefined {
  return SITE_URL;
}