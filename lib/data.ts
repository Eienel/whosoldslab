// Who Sold Slab, data layer.
//
// SlabDrop (slabdrop.io) runs a draw every 30 minutes that awards a graded
// trading-card "slab" (a phygitals.com listing) to a $SLAB token holder. This
// board reads the REAL public SlabDrop API and shows every recent winner, the
// actual card they won, its value, their odds, and a holding/sold status.
//
// Data sources (all public, no auth):
//   GET https://slabdrop.io/api/winners   wallet, drawId, wonAt, value, cards[]
//   GET https://slabdrop.io/api/draws      per-draw winner odds
//   GET https://slabdrop.io/api/state      live window + prize + treasury
//   GET https://slabdrop.io/api/config     brand, mint, draw window
//
// Card images are served via SlabDrop's proxy (/api/img), which fronts the
// phygitals.com / Supabase storage the slabs actually live on.

import { getConfirmedSells } from "./sells";

export const SLAB_BASE = "https://slabdrop.io";

export type SlabStatus = "holding" | "sold" | "redeemed";

export interface SlabRecord {
  id: string;
  drawId: number;
  wallet: string;
  wonAt: string; // ISO
  prizeValueUsd: number;
  sellbackUsd: number; // what SlabDrop would pay to buy it back (value * buyback)
  odds?: number; // winner's draw odds, when known
  slabCount: number;
  card: {
    fullName: string;
    title: string; // trimmed display title
    year?: string;
    grader?: string; // PSA / CGC / BGS
    grade?: string; // 10, 9.5, GEM MINT...
    image: string; // absolute URL
  };
  status: SlabStatus;
  soldAt?: string;
  salePriceUsd?: number;
}

export interface LiveWindow {
  id: number;
  closesAt: number;
  prizeValueUsd: number;
  slabCount: number;
  holderCount: number;
  eligibleSupply: number;
  slabPriceUsd: number;
  drawWindowMinutes: number;
  prize?: { name: string; value: number; image: string };
}

interface RawWinner {
  drawId: number;
  wallet: string;
  wonAt: string;
  value: number;
  slabCount: number;
  cards: Array<{ name: string; value: number; image: string }>;
}

interface RawDraw {
  id: number;
  winner?: { wallet: string; odds?: number };
  closedAt: string;
  prizeValue: number;
  slabCount: number;
}

const BUYBACK = 0.9;

function absImage(path: string): string {
  if (!path) return "";
  return path.startsWith("http") ? path : `${SLAB_BASE}${path}`;
}

// Pull grader + grade + year out of a phygitals card title.
function parseCard(name: string) {
  const grade = name.match(/\b(PSA|CGC|BGS|SGC)\s*([0-9]+(?:\.[0-9])?)\b/i);
  const year = name.match(/\b(19|20)\d{2}\b/);
  let title = name
    .replace(/\b(PSA|CGC|BGS|SGC)\s*[0-9]+(?:\.[0-9])?\b.*$/i, "")
    .replace(/^\s*(19|20)\d{2}\s*/, "")
    .trim();
  if (title.length > 64) title = title.slice(0, 61).trim() + "...";
  return {
    title: title || name,
    year: year?.[0],
    grader: grade?.[1]?.toUpperCase(),
    grade: grade?.[2],
  };
}

async function safeJson<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url, {
      headers: { Accept: "application/json", "User-Agent": "who-sold-slab" },
      next: { revalidate: 120 },
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export async function getSlabRecords(): Promise<SlabRecord[]> {
  const [winnersRes, drawsRes, confirmed] = await Promise.all([
    safeJson<{ winners: RawWinner[] } | RawWinner[]>(`${SLAB_BASE}/api/winners?limit=100`),
    safeJson<RawDraw[]>(`${SLAB_BASE}/api/draws`),
    getConfirmedSells(),
  ]);

  const winners = (Array.isArray(winnersRes) ? winnersRes : winnersRes?.winners) ?? [];
  const oddsByDraw = new Map<number, number>();
  (drawsRes ?? []).forEach((d) => {
    if (d.winner?.odds != null) oddsByDraw.set(d.id, d.winner.odds);
  });

  return winners.map((w): SlabRecord => {
    const c = w.cards?.[0];
    const parsed = parseCard(c?.name ?? "Unknown slab");
    const conf = confirmed.get(w.drawId);
    return {
      id: `draw-${w.drawId}`,
      drawId: w.drawId,
      wallet: w.wallet,
      wonAt: w.wonAt,
      prizeValueUsd: w.value,
      sellbackUsd: Math.round(w.value * BUYBACK * 100) / 100,
      odds: oddsByDraw.get(w.drawId),
      slabCount: w.slabCount ?? 1,
      card: {
        fullName: c?.name ?? "Unknown slab",
        ...parsed,
        image: absImage(c?.image ?? ""),
      },
      // Presumed holding until a sale is independently confirmed. We do not
      // fabricate "sold" for real wallets.
      status: conf?.status ?? "holding",
      soldAt: conf?.soldAt,
      salePriceUsd: conf?.salePriceUsd,
    };
  });
}

export async function getLiveWindow(): Promise<LiveWindow | null> {
  const [state, config] = await Promise.all([
    safeJson<{
      window: {
        id: number;
        closesAt: number;
        prizeValue: number;
        slabCount: number;
        slabs?: Array<{ name: string; value: number; image: string }>;
      };
      holderCount: number;
      eligibleSupply: number;
      slabPriceUsd: number;
    }>(`${SLAB_BASE}/api/state`),
    safeJson<{ drawWindowMinutes: number }>(`${SLAB_BASE}/api/config`),
  ]);
  if (!state?.window) return null;
  const prize = state.window.slabs?.[0];
  return {
    id: state.window.id,
    closesAt: state.window.closesAt,
    prizeValueUsd: state.window.prizeValue,
    slabCount: state.window.slabCount,
    holderCount: state.holderCount,
    eligibleSupply: state.eligibleSupply,
    slabPriceUsd: state.slabPriceUsd,
    drawWindowMinutes: config?.drawWindowMinutes ?? 30,
    prize: prize
      ? { name: prize.name, value: prize.value, image: absImage(prize.image) }
      : undefined,
  };
}

// ----------------------------------------------------------------------------
// aggregates
// ----------------------------------------------------------------------------
export interface SlabStats {
  totalWon: number;
  holding: number;
  sold: number;
  totalWonValueUsd: number;
  biggestWinUsd: number;
  bestOdds: number | null; // smallest odds = longest shot
}

export function computeStats(records: SlabRecord[]): SlabStats {
  const sold = records.filter((r) => r.status === "sold").length;
  const odds = records.map((r) => r.odds).filter((o): o is number => o != null && o > 0);
  return {
    totalWon: records.length,
    holding: records.filter((r) => r.status === "holding").length,
    sold,
    totalWonValueUsd: records.reduce((s, r) => s + r.prizeValueUsd, 0),
    biggestWinUsd: records.reduce((m, r) => Math.max(m, r.prizeValueUsd), 0),
    bestOdds: odds.length ? Math.min(...odds) : null,
  };
}

export function solscanWallet(addr: string): string {
  return `https://solscan.io/account/${addr}`;
}
