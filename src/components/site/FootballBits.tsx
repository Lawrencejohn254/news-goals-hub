import { Link } from "@tanstack/react-router";
import type { MatchWithTeams, PredictionWithMatch } from "@/lib/football";

export function MatchLine({ m, className = "" }: { m: MatchWithTeams | null; className?: string }) {
  if (!m) return null;
  return (
    <div className={`flex items-center gap-3 text-sm ${className}`}>
      <TeamBadge name={m.home_team?.name} crest={m.home_team?.crest_url} />
      <span className="font-bold text-muted-foreground">
        {m.status === "finished" && m.home_score != null
          ? `${m.home_score}–${m.away_score}`
          : "v"}
      </span>
      <TeamBadge name={m.away_team?.name} crest={m.away_team?.crest_url} reverse />
    </div>
  );
}

function TeamBadge({
  name,
  crest,
  reverse,
}: {
  name?: string | null;
  crest?: string | null;
  reverse?: boolean;
}) {
  return (
    <span className={`flex items-center gap-2 ${reverse ? "flex-row-reverse" : ""}`}>
      {crest ? (
        <img src={crest} alt="" className="h-5 w-5 object-contain" />
      ) : (
        <span className="inline-block h-5 w-5 rounded-full bg-muted" />
      )}
      <span className="font-semibold">{name ?? "TBD"}</span>
    </span>
  );
}

export function ConfidenceMeter({ value }: { value: number }) {
  return (
    <span className="inline-flex items-center gap-1" aria-label={`Confidence ${value} of 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className={`h-2 w-4 ${i <= value ? "bg-[var(--brand)]" : "bg-muted"}`}
        />
      ))}
    </span>
  );
}

export function ResultBadge({ result }: { result: string }) {
  const styles: Record<string, string> = {
    won: "bg-green-100 text-green-800",
    lost: "bg-red-100 text-red-800",
    void: "bg-muted text-muted-foreground",
    pending: "bg-yellow-100 text-yellow-800",
  };
  return (
    <span
      className={`rounded px-2 py-0.5 text-xs font-bold uppercase tracking-wider ${styles[result] ?? styles.pending}`}
    >
      {result}
    </span>
  );
}

export function PredictionCard({ p }: { p: PredictionWithMatch }) {
  const kickoff = p.matches?.kickoff_at;
  return (
    <Link
      to="/predictions/$slug"
      params={{ slug: p.slug }}
      className="group flex flex-col border border-border bg-background p-5 transition-colors hover:border-[var(--brand)]"
    >
      <div className="mb-3 flex items-center justify-between text-xs uppercase tracking-widest text-muted-foreground">
        <span>{p.matches?.competitions?.name ?? "Football"}</span>
        <ResultBadge result={p.result} />
      </div>
      <MatchLine m={p.matches} className="mb-3" />
      <h3 className="font-serif text-xl font-bold leading-snug group-hover:text-[var(--brand)]">
        {p.title}
      </h3>
      <div className="mt-4 flex items-end justify-between border-t border-border pt-3">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Our tip</p>
          <p className="font-bold text-[var(--brand)]">{p.tip}</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Confidence</p>
          <ConfidenceMeter value={p.confidence} />
        </div>
      </div>
      {kickoff && (
        <p className="mt-3 text-xs text-muted-foreground">
          Kickoff{" "}
          {new Date(kickoff).toLocaleString("en-GB", {
            weekday: "short",
            day: "numeric",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      )}
    </Link>
  );
}
