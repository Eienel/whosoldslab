import { SlabRecord, holdDurationDays } from "./data";

// Diamond Hands Score (0–100) per slab: holders score high, fast flippers low.
// A single, tweetable loyalty metric the community can flex.
export function diamondScore(r: SlabRecord, now = Date.UTC(2026, 5, 5, 16, 0, 0)): number {
  if (r.status === "holding") {
    const heldDays = (now - new Date(r.wonAt).getTime()) / 86400000;
    // still holding → 80 baseline, climbing toward 100 the longer it's held
    return Math.round(Math.min(100, 80 + Math.min(20, heldDays * 0.8)));
  }
  // sold → score decays the faster they flipped (0d ≈ 5, 20d ≈ ~65)
  const held = holdDurationDays(r);
  return Math.round(Math.max(2, Math.min(70, 5 + held * 3)));
}

export interface Tier {
  name: string;
  emoji: string;
  className: string; // tailwind text color
}

export function tierFor(score: number): Tier {
  if (score >= 90) return { name: "Vault Legend", emoji: "🏆", className: "text-gold" };
  if (score >= 80) return { name: "Diamond Hands", emoji: "💎", className: "text-hold" };
  if (score >= 50) return { name: "Steady", emoji: "🤝", className: "text-info" };
  if (score >= 25) return { name: "Trader", emoji: "🔁", className: "text-muted" };
  return { name: "Paper Hands", emoji: "📄", className: "text-sold" };
}

// Community Diamond Hands Index: average score across all winners, 0–100.
export function diamondIndex(records: SlabRecord[]): number {
  if (!records.length) return 0;
  const sum = records.reduce((s, r) => s + diamondScore(r), 0);
  return Math.round(sum / records.length);
}
