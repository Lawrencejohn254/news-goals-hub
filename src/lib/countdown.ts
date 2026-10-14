import { db } from "@/lib/db";

export type FlagMode = "kenya" | "stripes" | "image" | "none";
export type FlagPosition = "sides" | "left" | "above";
export type CountdownAnimation = "flip" | "slide" | "none";

export type ElectionCountdownSettings = {
  id: number;
  is_enabled: boolean;
  show_on_all_pages: boolean;
  title: string;
  subtitle: string;
  /** ISO timestamp (UTC) of polling day */
  target_at: string;
  ended_message: string;
  flag_mode: FlagMode;
  flag_position: FlagPosition;
  flag_image_url: string | null;
  flag_color_1: string;
  flag_color_2: string;
  flag_color_3: string;
  animation: CountdownAnimation;
  bg_from: string;
  bg_to: string;
  accent: string;
  tile_bg: string;
  tile_text: string;
  text_color: string;
  updated_at: string;
};

// Mirrors the column defaults in the election_countdown migration.
// Kenya's general election is held on the second Tuesday of August every
// five years: 10 Aug 2027, polls open 06:00 EAT (= 03:00 UTC).
export const DEFAULT_COUNTDOWN: ElectionCountdownSettings = {
  id: 1,
  is_enabled: false,
  show_on_all_pages: false,
  title: "Kenya General Election",
  subtitle: "Counting down to polling day",
  target_at: "2027-08-10T03:00:00.000Z",
  ended_message: "Kenyans are voting today",
  flag_mode: "kenya",
  flag_position: "sides",
  flag_image_url: null,
  flag_color_1: "#000000",
  flag_color_2: "#bb0000",
  flag_color_3: "#006600",
  animation: "flip",
  bg_from: "#0a0a0a",
  bg_to: "#10241a",
  accent: "#dc2626",
  tile_bg: "#161616",
  tile_text: "#ffffff",
  text_color: "#f5f5f4",
  updated_at: "",
};

export type ColorKey = "bg_from" | "bg_to" | "accent" | "tile_bg" | "tile_text" | "text_color";

export const COLOR_PRESETS: {
  name: string;
  colors: Record<ColorKey, string>;
}[] = [
  {
    name: "Kenya dark",
    colors: {
      bg_from: "#0a0a0a",
      bg_to: "#10241a",
      accent: "#dc2626",
      tile_bg: "#161616",
      tile_text: "#ffffff",
      text_color: "#f5f5f4",
    },
  },
  {
    name: "Kenya green",
    colors: {
      bg_from: "#004d1f",
      bg_to: "#006600",
      accent: "#ffffff",
      tile_bg: "#003d18",
      tile_text: "#ffffff",
      text_color: "#ffffff",
    },
  },
  {
    name: "Kenya red",
    colors: {
      bg_from: "#7a0000",
      bg_to: "#bb0000",
      accent: "#ffffff",
      tile_bg: "#5c0000",
      tile_text: "#ffffff",
      text_color: "#ffffff",
    },
  },
  {
    name: "Clean light",
    colors: {
      bg_from: "#ffffff",
      bg_to: "#f1f1ef",
      accent: "#bb0000",
      tile_bg: "#0a0a0a",
      tile_text: "#ffffff",
      text_color: "#0a0a0a",
    },
  },
];

export const HEX_RE = /^#[0-9a-fA-F]{6}$/;

export async function fetchCountdown(): Promise<ElectionCountdownSettings | null> {
  const { data, error } = await db.from("election_countdown").select("*").eq("id", 1).maybeSingle();
  if (error) throw error;
  return (data as ElectionCountdownSettings | null) ?? null;
}

export function splitRemaining(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000));
  return {
    days: Math.floor(total / 86_400),
    hours: Math.floor((total % 86_400) / 3_600),
    minutes: Math.floor((total % 3_600) / 60),
    seconds: total % 60,
    over: ms <= 0,
  };
}

// Admin enters the election time in East Africa Time (UTC+3, no daylight
// saving), so the stored instant is the same no matter where the admin's
// browser happens to be.
const EAT_OFFSET_MS = 3 * 60 * 60 * 1000;

/** ISO instant -> "YYYY-MM-DDTHH:mm" in EAT, for <input type="datetime-local"> */
export function isoToEatInput(iso: string) {
  const t = new Date(iso).getTime();
  if (Number.isNaN(t)) return "";
  return new Date(t + EAT_OFFSET_MS).toISOString().slice(0, 16);
}

/** "YYYY-MM-DDTHH:mm" entered as EAT -> ISO instant (UTC), or null if invalid */
export function eatInputToIso(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value)) return null;
  const t = new Date(`${value}:00+03:00`).getTime();
  return Number.isNaN(t) ? null : new Date(t).toISOString();
}

export function formatEat(iso: string) {
  const t = new Date(iso).getTime();
  if (Number.isNaN(t)) return "";
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "Africa/Nairobi",
  }).format(new Date(t));
}

/** Only allow image URLs the DB constraint also allows. */
export function isSafeFlagUrl(url: string) {
  return url.length <= 500 && (url.startsWith("https://") || url.startsWith("/media/"));
}
