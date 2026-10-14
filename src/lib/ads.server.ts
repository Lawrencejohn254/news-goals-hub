import { createClient } from "@supabase/supabase-js";

// Server-only helpers for ad tracking (the .server.ts suffix keeps this out of the browser bundle).

type RpcClient = {
  rpc: (fn: string, args?: object) => Promise<{ data: unknown; error: { message: string } | null }>;
};

function env(name: string): string | undefined {
  const fromProcess = typeof process !== "undefined" ? process.env?.[name] : undefined;
  return fromProcess ?? (import.meta.env as Record<string, string | undefined>)[name];
}

export function getServerClient() {
  const url = env("SUPABASE_URL") ?? env("VITE_SUPABASE_URL");
  const key =
    env("SUPABASE_PUBLISHABLE_KEY") ??
    env("VITE_SUPABASE_PUBLISHABLE_KEY") ??
    env("VITE_SUPABASE_ANON_KEY");
  if (!url || !key) throw new Error("Supabase URL / key missing on the server");
  return createClient(url, key, { auth: { persistSession: false } });
}

// "(?<!cu)bot" avoids flagging Cubot phones as bots.
const BOT_RE =
  /(?<!cu)bot|crawl|spider|slurp|headless|lighthouse|pagespeed|facebookexternalhit|curl|wget|python-requests|httpclient|axios|go-http|monitor/i;

export const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export type RequestInfo = {
  ua: string;
  ip: string;
  country: string | null;
  device: "mobile" | "tablet" | "desktop";
  isBot: boolean;
};

export function readRequestInfo(request: Request): RequestInfo {
  const h = request.headers;
  const ua = h.get("user-agent") ?? "";
  const ip =
    h.get("cf-connecting-ip") ??
    h.get("x-real-ip") ??
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "";

  const rawCountry = (h.get("cf-ipcountry") ?? h.get("x-vercel-ip-country") ?? "").toUpperCase();
  const country = /^[A-Z]{2}$/.test(rawCountry) && rawCountry !== "XX" && rawCountry !== "T1" ? rawCountry : null;

  let device: RequestInfo["device"] = "desktop";
  if (/ipad|tablet|playbook|silk/i.test(ua) || (/android/i.test(ua) && !/mobile/i.test(ua))) {
    device = "tablet";
  } else if (/mobi|iphone|ipod|android/i.test(ua)) {
    device = "mobile";
  }

  return { ua, ip, country, device, isBot: !ua || BOT_RE.test(ua) };
}

/** Daily-rotating hash so we can de-duplicate without storing raw IPs. */
export async function visitorHash(ip: string, ua: string): Promise<string> {
  const day = new Date().toISOString().slice(0, 10);
  const data = new TextEncoder().encode(`${ip}|${ua}|${day}|ad-tracking-v1`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .slice(0, 32);
}

/** Keeps only the path of a URL (drops query strings, which can contain personal data). */
export function pathOnly(value: string | null | undefined): string | null {
  if (!value) return null;
  try {
    return new URL(value, "http://local").pathname.slice(0, 500);
  } catch {
    return null;
  }
}

export async function recordAdEvent(args: {
  adId: string;
  type: "impression" | "click";
  info: RequestInfo;
  pageUrl: string | null;
  sessionId: string | null;
}) {
  const client = getServerClient() as unknown as RpcClient;
  const hash = await visitorHash(args.info.ip, args.info.ua);
  const { error } = await client.rpc("record_ad_event", {
    p_ad_id: args.adId,
    p_type: args.type,
    p_country: args.info.country,
    p_device: args.info.device,
    p_page_url: args.pageUrl,
    p_session_id: args.sessionId,
    p_visitor_hash: hash,
  });
  if (error) console.error("record_ad_event failed:", error.message);
}