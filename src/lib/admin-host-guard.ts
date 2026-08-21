import { createMiddleware } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";

const ADMIN_PATH_PREFIXES = ["/auth", "/admin"];

/**
 * The one hostname allowed to reach /auth and /admin/*.
 *
 * Set STAFF_HOST in your environment — e.g. staff.yourdomain.com (no
 * protocol, no trailing slash, no port). Point a DNS record for that
 * subdomain at the same Vercel project so it serves this same app, then
 * only that hostname will be able to load the admin/login pages at all —
 * everywhere else (your main domain, and anyone linking to /auth from it)
 * gets a plain 404, as if the route doesn't exist.
 *
 * Until STAFF_HOST is set, this fails OPEN (admin stays reachable
 * everywhere) so a missing env var can never lock you out of your own
 * admin panel by accident.
 */
const STAFF_HOST = process.env.STAFF_HOST;

/**
 * Only enforced in real production. Local dev and Vercel preview
 * deployments (which each get their own random *.vercel.app hostname,
 * different every time) always have access, so you're never locked out
 * while testing a branch or working locally.
 */
const ENFORCE = process.env.VERCEL_ENV === "production" || process.env.NODE_ENV === "production";

export const adminHostGuard = createMiddleware().server(async ({ next }) => {
  if (!ENFORCE || !STAFF_HOST) return next();

  const request = getRequest();
  const pathname = request ? new URL(request.url).pathname : "";
  const isAdminPath = ADMIN_PATH_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );

  if (isAdminPath) {
    const host = request?.headers.get("host")?.split(":")[0] ?? "";
    if (host !== STAFF_HOST) {
      return new Response("Not Found", { status: 404 });
    }
  }

  return next();
});