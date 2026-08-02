export const TIP_OPTIONS = [
  "Home Win",
  "Draw",
  "Away Win",
  "Home Win or Draw",
  "Away Win or Draw",
  "Home or Away (no draw)",
  "Over 1.5 Goals",
  "Under 1.5 Goals",
  "Over 2.5 Goals",
  "Under 2.5 Goals",
  "Over 3.5 Goals",
  "Under 3.5 Goals",
  "Both Teams To Score",
  "Both Teams To Score - No",
  "Correct Score",
] as const;

export type TipResult = "won" | "lost" | "void";

/**
 * Settle a tip from the final score. Returns null when the tip text isn't a
 * known market (manual settlement required).
 */
export function settleTip(
  tip: string,
  home: number,
  away: number,
  predictedHome?: number | null,
  predictedAway?: number | null,
): TipResult | null {
  const t = tip.trim().toLowerCase();
  const total = home + away;
  const won = (b: boolean): TipResult => (b ? "won" : "lost");

  switch (t) {
    case "home win":
      return won(home > away);
    case "draw":
      return won(home === away);
    case "away win":
      return won(away > home);
    case "home win or draw":
      return won(home >= away);
    case "away win or draw":
      return won(away >= home);
    case "home or away (no draw)":
      return won(home !== away);
    case "over 1.5 goals":
      return won(total > 1.5);
    case "under 1.5 goals":
      return won(total < 1.5);
    case "over 2.5 goals":
      return won(total > 2.5);
    case "under 2.5 goals":
      return won(total < 2.5);
    case "over 3.5 goals":
      return won(total > 3.5);
    case "under 3.5 goals":
      return won(total < 3.5);
    case "both teams to score":
      return won(home > 0 && away > 0);
    case "both teams to score - no":
      return won(home === 0 || away === 0);
    case "correct score":
      if (predictedHome == null || predictedAway == null) return null;
      return won(predictedHome === home && predictedAway === away);
    default:
      return null;
  }
}
