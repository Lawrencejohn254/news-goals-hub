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
  delay = 0,
  animated,
}: {
  s: ElectionCountdownSettings;
  size: string;
  delay?: number;
  animated: boolean;
}) {
  if (s.flag_mode === "none") return null;
  if (s.flag_mode === "image" && !(s.flag_image_url && isSafeFlagUrl(s.flag_image_url))) {
    return null;
  }
  return (
    <div
      className={`shrink-0 ${size} ${animated ? "cd-flag-wave" : ""}`}
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="aspect-[3/2] w-full overflow-hidden rounded-[3px] shadow-[0_8px_24px_rgba(0,0,0,0.45)] ring-1 ring-white/20">
        {s.flag_mode === "kenya" && (
          <KenyaFlag c1={s.flag_color_1} c2={s.flag_color_2} c3={s.flag_color_3} />
        )}
        {s.flag_mode === "stripes" && (
          <StripesFlag c1={s.flag_color_1} c2={s.flag_color_2} c3={s.flag_color_3} />
        )}
        {s.flag_mode === "image" && s.flag_image_url && (
          <img
            src={s.flag_image_url}
            alt=""
            className="h-full w-full object-cover"
            loading="lazy"
          />
        )}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- tiles */

function Tile({
  value,
  label,
  pad,
  animation,
  live,
}: {
  value: number | null;
  label: string;
  pad: number;
  animation: CountdownAnimation;
  live?: boolean;
}) {
  const text = value === null ? "--" : String(value).padStart(pad, "0");
  const anim = animation === "flip" ? "cd-num-flip" : animation === "slide" ? "cd-num-slide" : "";
  return (
    <div className="min-w-0" aria-hidden="true">
      <div
        className="cd-persp relative flex h-[clamp(4.5rem,17vw,9.5rem)] items-center justify-center overflow-hidden rounded-md ring-1 ring-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.35)]"
        style={{ background: "var(--cd-tile)", color: "var(--cd-tile-text)" }}
      >
        {/* soft highlight on the top half, like a flip-clock card */}
        <span className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/[0.08] to-transparent" />
        {/* centre split + side notches — drawn BEFORE the number so the digits
            sit on top of the line instead of looking struck through */}
        <span className="pointer-events-none absolute inset-x-0 top-1/2 h-px bg-black/40" />
        <span className="pointer-events-none absolute left-0 top-1/2 h-2 w-1 -translate-y-1/2 rounded-r bg-black/60" />
        <span className="pointer-events-none absolute right-0 top-1/2 h-2 w-1 -translate-y-1/2 rounded-l bg-black/60" />
        <span
          key={text}
          className={`${anim} relative block font-black leading-none tabular-nums tracking-tight text-[clamp(2.1rem,9.5vw,6rem)]`}
        >
          {text}
        </span>
        {/* accent underline — pulses on the seconds tile */}
        <span
          className={`absolute inset-x-0 bottom-0 h-[3px] ${live ? "cd-glow" : ""}`}
          style={{ background: "var(--cd-accent)" }}
        />
      </div>
      <p
        className="mt-2 text-[0.62rem] font-semibold uppercase tracking-[0.18em] opacity-75 sm:text-xs md:mt-3 md:text-sm md:tracking-[0.25em]"
        style={{ color: "var(--cd-text)" }}
      >
        {label}
      </p>
    </div>
  );
}

/* ----------------------------------------------------------------- view */

/** Pure presentation — used by the site and by the admin live preview. */
export function ElectionCountdownView({ settings: s }: { settings: ElectionCountdownSettings }) {
  const now = useNow();
  const target = new Date(s.target_at).getTime();
  const r = now === null || Number.isNaN(target) ? null : splitRemaining(target - now);
  const animated = s.animation !== "none";

  const style = {
    "--cd-from": s.bg_from,
    "--cd-to": s.bg_to,
    "--cd-accent": s.accent,
    "--cd-tile": s.tile_bg,
    "--cd-tile-text": s.tile_text,
    "--cd-text": s.text_color,
    background: `linear-gradient(135deg, ${s.bg_from}, ${s.bg_to})`,
    color: s.text_color,
  } as CSSProperties;

  const flagSize =
    s.flag_position === "above" ? "w-20 sm:w-24 md:w-28" : "w-12 sm:w-20 md:w-32 lg:w-40";
  const flagA = <Flag s={s} size={flagSize} animated={animated} />;
  const flagB = <Flag s={s} size={flagSize} animated={animated} delay={-2.5} />;

  const stripe =
    s.flag_mode === "kenya" || s.flag_mode === "stripes"
      ? [s.flag_color_1, s.flag_color_2, s.flag_color_3]
      : [s.accent, s.accent, s.accent];

  const titleBlock = (
    <div className="min-w-0 text-center">
      <p
        className="mb-1 text-[0.65rem] font-bold uppercase tracking-[0.3em] md:mb-2 md:text-sm"
        style={{ color: "var(--cd-accent)" }}
      >
        {s.subtitle}
      </p>
      <h2 className="font-serif text-2xl font-black uppercase leading-[1.05] tracking-tight sm:text-4xl md:text-6xl">
        {s.title}
      </h2>
    </div>
  );

  return (
    <section
      className="relative overflow-hidden rounded-md shadow-sm ring-1 ring-black/10"
      style={style}
      aria-label={`${s.title} countdown`}
    >
      {/* tri-colour strip across the top */}
      <div className="flex h-1.5 w-full">
        {stripe.map((c, i) => (
          <span key={i} className="h-full flex-1" style={{ background: c }} />
        ))}
      </div>

      <div className="px-4 py-7 text-center sm:px-8 md:py-12">
        {s.flag_position === "above" ? (
          <div className="flex flex-col items-center gap-4 md:gap-5">
            {flagA}
            {titleBlock}
          </div>
        ) : s.flag_position === "left" ? (
          <div className="flex items-center justify-center gap-4 md:gap-8">
            {flagA}
            {titleBlock}
          </div>
        ) : (
          <div className="flex items-center justify-center gap-3 sm:gap-6 md:gap-10">
            {flagA}
            {titleBlock}
            {flagB}
          </div>
        )}

        {r?.over ? (
          <p
            className="mx-auto mt-8 max-w-3xl font-serif text-3xl font-black uppercase leading-tight tracking-tight md:mt-12 md:text-6xl"
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
            <div className="mx-auto mt-7 grid max-w-4xl grid-cols-4 gap-2 sm:gap-4 md:mt-12 md:gap-6">
              <Tile value={r ? r.days : null} label="Days" pad={2} animation={s.animation} />
              <Tile value={r ? r.hours : null} label="Hours" pad={2} animation={s.animation} />
              <Tile value={r ? r.minutes : null} label="Mins" pad={2} animation={s.animation} />
              <Tile
                value={r ? r.seconds : null}
                label="Secs"
                pad={2}
                animation={s.animation}
                live={animated}
              />
            </div>
          </>
        )}

        <p className="mt-6 text-xs font-medium opacity-80 sm:text-sm md:mt-9 md:text-base">
          {formatEat(s.target_at)} <span className="opacity-70">(EAT)</span>
        </p>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------- wrapper */

/**
 * Site-facing component. Renders nothing unless the admin has switched the
 * countdown on — and nothing at all (no error, no layout shift) if the
 * settings table isn't there yet or the request fails.
 */
export function ElectionCountdown() {
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
    <div className="container-page mt-6 md:mt-10">
      <ElectionCountdownView settings={s} />
    </div>
  );
}
