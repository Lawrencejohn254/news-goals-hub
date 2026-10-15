import { useEffect, useId, useState, type CSSProperties } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouterState } from "@tanstack/react-router";
import {
  fetchCountdown,
  formatEat,
  isSafeFlagUrl,
  splitRemaining,
  type CountdownAnimation,
  type ElectionCountdownSettings,
} from "@/lib/countdown";

/**
 * Live "now" in ms. Starts as null so the server render and the first client
 * render match (no hydration mismatch); ticks every second after mount.
 */
function useNow() {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  return now;
}

/* ---------------------------------------------------------------- flags */

function KenyaFlag({ c1, c2, c3 }: { c1: string; c2: string; c3: string }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg
      viewBox="0 0 450 300"
      role="img"
      aria-label="Flag of Kenya"
      className="block h-full w-full"
    >
      <rect width="450" height="80" fill={c1} />
      <rect y="80" width="450" height="10" fill="#fff" />
      <rect y="90" width="450" height="120" fill={c2} />
      <rect y="210" width="450" height="10" fill="#fff" />
      <rect y="220" width="450" height="80" fill={c3} />
      {/* crossed spears */}
      <g stroke="#fff" strokeWidth="7" strokeLinecap="round">
        <line x1="170" y1="232" x2="280" y2="68" />
        <line x1="280" y1="232" x2="170" y2="68" />
      </g>
      <g fill="#fff">
        <polygon points="159,51 177.5,63 162.5,73" />
        <polygon points="291,51 272.5,63 287.5,73" />
      </g>
      {/* shield */}
      <ellipse cx="225" cy="150" rx="46" ry="76" fill="#000" />
      <ellipse cx="225" cy="150" rx="40" ry="70" fill={c2} />
      <clipPath id={`shield-${id}`}>
        <ellipse cx="225" cy="150" rx="40" ry="70" />
      </clipPath>
      <g clipPath={`url(#shield-${id})`}>
        <rect x="185" y="143" width="80" height="14" fill="#fff" />
        <ellipse cx="225" cy="150" rx="9" ry="70" fill="#000" />
        <ellipse cx="225" cy="150" rx="3.5" ry="70" fill="#fff" />
      </g>
    </svg>
  );
}

function StripesFlag({ c1, c2, c3 }: { c1: string; c2: string; c3: string }) {
  return (
    <svg viewBox="0 0 450 300" role="img" aria-label="Flag" className="block h-full w-full">
      <rect width="450" height="100" fill={c1} />
      <rect y="100" width="450" height="100" fill={c2} />
      <rect y="200" width="450" height="100" fill={c3} />
    </svg>
  );
}

function Flag({
  s,
  size,
  animated,
}: {
  s: ElectionCountdownSettings;
  size: string;
  animated: boolean;
}) {
  if (s.flag_mode === "none") return null;
  if (s.flag_mode === "image" && !(s.flag_image_url && isSafeFlagUrl(s.flag_image_url))) {
    return null;
  }
  return (
    <div className={`shrink-0 ${size} ${animated ? "cd-flag-wave" : ""}`}>
      <div className="aspect-[3/2] w-full overflow-hidden rounded-[2px] shadow-[0_3px_8px_rgba(0,0,0,0.4)] ring-1 ring-white/20">
        {s.flag_mode === "kenya" && (
          <KenyaFlag c1={s.flag_color_1} c2={s.flag_color_2} c3={s.flag_color_3} />
        )}
        {s.flag_mode === "stripes" && (
          <StripesFlag c1={s.flag_color_1} c2={s.flag_color_2} c3={s.flag_color_3} />
        )}
        {s.flag_mode === "image" && s.flag_image_url && (
          <img src={s.flag_image_url} alt="" className="h-full w-full object-cover" />
        )}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- units */

type Size = "md" | "sm";

function Unit({
  value,
  label,
  animation,
  size,
  live,
}: {
  value: number | null;
  label: string;
  animation: CountdownAnimation;
  size: Size;
  live?: boolean;
}) {
  const text = value === null ? "--" : String(value).padStart(2, "0");
  const anim = animation === "flip" ? "cd-num-flip" : animation === "slide" ? "cd-num-slide" : "";
  return (
    <div
      aria-hidden="true"
      className="cd-persp relative flex flex-col items-center overflow-hidden rounded px-2 pb-2 pt-1.5 ring-1 ring-white/10 sm:px-3"
      style={{ background: "var(--cd-tile)", color: "var(--cd-tile-text)" }}
    >
      <span
        key={text}
        className={`${anim} block font-black leading-none tabular-nums tracking-tight ${
          size === "sm" ? "text-[1.7rem]" : "text-[2.15rem]"
        }`}
      >
        {text}
      </span>
      {/* label sits BELOW the number so first-time visitors can read the units */}
      <span
        className={`mt-1 font-bold uppercase leading-none tracking-[0.14em] opacity-80 ${
          size === "sm" ? "text-[0.55rem]" : "text-[0.65rem]"
        }`}
      >
        {label}
      </span>
      {/* accent underline — pulses on the seconds unit */}
      <span
        className={`absolute inset-x-0 bottom-0 h-[2px] ${live ? "cd-glow" : ""}`}
        style={{ background: "var(--cd-accent)" }}
      />
    </div>
  );
}

/* ----------------------------------------------------------------- view */

/**
 * Compact countdown strip: small flag + big numbers with one-letter labels.
 * Built to sit in the masthead row; also used by the admin live preview.
 */
export function ElectionCountdownView({
  settings: s,
  size = "md",
}: {
  settings: ElectionCountdownSettings;
  size?: Size;
}) {
  const now = useNow();
  const target = new Date(s.target_at).getTime();
  const r = now === null || Number.isNaN(target) ? null : splitRemaining(target - now);
  const animated = s.animation !== "none";

  const style = {
    "--cd-accent": s.accent,
    "--cd-tile": s.tile_bg,
    "--cd-tile-text": s.tile_text,
    background: `linear-gradient(135deg, ${s.bg_from}, ${s.bg_to})`,
    color: s.text_color,
  } as CSSProperties;

  const stripe =
    s.flag_mode === "kenya" || s.flag_mode === "stripes"
      ? [s.flag_color_1, s.flag_color_2, s.flag_color_3]
      : [s.accent, s.accent, s.accent];

  return (
    <div
      role="group"
      aria-label={s.title}
      title={`${s.title} — ${formatEat(s.target_at)} (EAT)`}
      className="relative inline-flex items-center gap-1.5 overflow-hidden rounded-md px-2 pb-2 pt-2.5 shadow-sm ring-1 ring-black/10 sm:gap-2.5 sm:px-3"
      style={style}
    >
      {/* tri-colour strip along the top edge */}
      <div className="absolute inset-x-0 top-0 flex h-[3px]">
        {stripe.map((c, i) => (
          <span key={i} className="h-full flex-1" style={{ background: c }} />
        ))}
      </div>

      <Flag s={s} size={size === "sm" ? "w-7" : "w-9"} animated={animated} />

      {r?.over ? (
        <p
          className="px-2 text-sm font-black uppercase leading-tight tracking-tight sm:text-base"
          style={{ color: "var(--cd-accent)" }}
        >
          {s.ended_message}
        </p>
      ) : (
        <>
          <p className="sr-only">
            {r
              ? `${r.days} days, ${r.hours} hours and ${r.minutes} minutes until ${s.title}`
              : `Countdown to ${s.title}`}
          </p>
          <Unit value={r ? r.days : null} label="Days" animation={s.animation} size={size} />
          <Unit value={r ? r.hours : null} label="Hours" animation={s.animation} size={size} />
          <Unit value={r ? r.minutes : null} label="Mins" animation={s.animation} size={size} />
          <Unit
            value={r ? r.seconds : null}
            label="Secs"
            animation={s.animation}
            size={size}
            live={animated}
          />
        </>
      )}
    </div>
  );
}

/* --------------------------------------------------------------- wrapper */

/**
 * Site-facing component. Renders nothing unless the admin has switched the
 * countdown on — and nothing at all (no error, no layout shift) if the
 * settings table isn't there yet or the request fails.
 * `wrapperClassName` is only applied when the countdown is visible, so a
 * hidden countdown never leaves behind an empty padded box.
 */
export function ElectionCountdown({
  size = "md",
  wrapperClassName,
}: {
  size?: Size;
  wrapperClassName?: string;
}) {
  const pathname = useRouterState({ select: (st) => st.location.pathname });
  const q = useQuery({
    queryKey: ["election-countdown"],
    queryFn: fetchCountdown,
    staleTime: 60_000,
    retry: false,
  });
  const s = q.data;
  if (!s || !s.is_enabled) return null;
  if (!s.show_on_all_pages && pathname !== "/") return null;
  return (
    <div className={wrapperClassName}>
      <ElectionCountdownView settings={s} size={size} />
    </div>
  );
}
