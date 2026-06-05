// Who Sold Slab — data layer.
//
// SlabDrop awards physical, graded trading-card "slabs" to token holders via a
// recurring on-chain draw. This dashboard tracks each winner and whether they
// flipped (SOLD) the slab they won or are still HOLDING it.
//
// The records below are generated deterministically from a fixed seed so the
// dashboard renders identically on every request. To wire in live data, replace
// `getSlabRecords()` with a fetch against the SlabDrop API / on-chain indexer —
// every component consumes the `SlabRecord` shape, nothing else needs to change.

export type SlabStatus = "holding" | "sold";

export interface SlabRecord {
  id: string;
  drawId: number;
  /** Solana-style base58 wallet of the winner. */
  wallet: string;
  /** Optional X / community handle, when the winner is doxxed. */
  handle?: string;
  card: string;
  set: string;
  grader: "PSA" | "BGS" | "CGC";
  grade: string;
  /** USD value of the slab at the moment it was won. */
  wonValueUsd: number;
  wonAt: string; // ISO
  status: SlabStatus;
  // present only when status === "sold"
  soldAt?: string; // ISO
  salePriceUsd?: number;
}

// ----------------------------------------------------------------------------
// deterministic PRNG (mulberry32) — stable output, no render-time randomness
// ----------------------------------------------------------------------------
function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const BASE58 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";

const CARDS: Array<{ card: string; set: string; base: number }> = [
  { card: "Charizard 1st Edition", set: "Base Set", base: 28000 },
  { card: "Pikachu Illustrator", set: "Promo", base: 96000 },
  { card: "Blastoise Shadowless", set: "Base Set", base: 9400 },
  { card: "Lugia", set: "Neo Genesis", base: 7200 },
  { card: "Mewtwo", set: "Base Set", base: 1900 },
  { card: "Umbreon Gold Star", set: "POP Series 5", base: 14500 },
  { card: "Rayquaza Gold Star", set: "EX Deoxys", base: 11200 },
  { card: "Michael Jordan RC", set: "1986 Fleer", base: 31000 },
  { card: "LeBron James RC", set: "2003 Topps Chrome", base: 18800 },
  { card: "Tom Brady RC", set: "2000 Bowman", base: 12600 },
  { card: "Kobe Bryant RC", set: "1996 Topps Chrome", base: 8700 },
  { card: "Luka Doncic RC", set: "2018 Prizm Silver", base: 5400 },
  { card: "Victor Wembanyama RC", set: "2023 Prizm", base: 6900 },
  { card: "Shohei Ohtani RC", set: "2018 Topps Chrome", base: 4300 },
  { card: "Mickey Mantle", set: "1952 Topps", base: 42000 },
  { card: "Gengar VMAX Alt Art", set: "Fusion Strike", base: 1600 },
  { card: "Giratina V Alt Art", set: "Lost Origin", base: 2100 },
  { card: "Moonbreon Umbreon VMAX", set: "Evolving Skies", base: 1850 },
];

const GRADES: Array<{ grader: SlabRecord["grader"]; grade: string; mult: number; w: number }> = [
  { grader: "PSA", grade: "10", mult: 1.0, w: 5 },
  { grader: "PSA", grade: "9", mult: 0.55, w: 4 },
  { grader: "BGS", grade: "9.5", mult: 0.85, w: 3 },
  { grader: "BGS", grade: "10 Black", mult: 1.9, w: 1 },
  { grader: "CGC", grade: "10", mult: 0.9, w: 2 },
];

const HANDLES = [
  "slabking",
  "pulled_it",
  "gradedgains",
  "vault_chad",
  "diamondtimmy",
  "paperhandz",
  "the_pull",
  "wenmoon_cards",
  "psa10ordie",
  "flipnflip",
  "hodlslabs",
  "cardbarron",
];

function pickWeighted<T extends { w: number }>(rng: () => number, arr: T[]): T {
  const total = arr.reduce((s, a) => s + a.w, 0);
  let r = rng() * total;
  for (const a of arr) {
    r -= a.w;
    if (r <= 0) return a;
  }
  return arr[arr.length - 1];
}

function makeWallet(rng: () => number): string {
  let s = "";
  for (let i = 0; i < 44; i++) s += BASE58[Math.floor(rng() * BASE58.length)];
  return s;
}

function buildRecords(): SlabRecord[] {
  const rng = mulberry32(0x51ab);
  const records: SlabRecord[] = [];
  const COUNT = 42;
  // Draws run every 30 min on SlabDrop; this board is a curated sample of
  // winners spread across the last ~2 months so hold durations are meaningful.
  // Anchor to a fixed "now" for determinism.
  const now = Date.UTC(2026, 5, 5, 16, 0, 0); // 2026-06-05T16:00:00Z
  const DAY = 24 * 60 * 60 * 1000;

  let cursor = now;
  for (let i = 0; i < COUNT; i++) {
    const drawId = 4821 - i;
    // step back between ~6h and ~3.5d per record → ~2 month span, newest first
    cursor -= Math.floor((0.25 + rng() * 3.25) * DAY);
    const wonAt = cursor;
    const c = CARDS[Math.floor(rng() * CARDS.length)];
    const g = pickWeighted(rng, GRADES);
    const wonValueUsd = Math.round((c.base * g.mult * (0.85 + rng() * 0.3)) / 50) * 50;

    const doxxed = rng() < 0.5;
    const handle = doxxed ? HANDLES[Math.floor(rng() * HANDLES.length)] : undefined;

    // older wins are more likely to have been sold
    const ageFrac = i / COUNT;
    const sold = rng() < 0.32 + ageFrac * 0.33;

    const rec: SlabRecord = {
      id: `slab-${drawId}`,
      drawId,
      wallet: makeWallet(rng),
      handle,
      card: c.card,
      set: c.set,
      grader: g.grader,
      grade: g.grade,
      wonValueUsd,
      wonAt: new Date(wonAt).toISOString(),
      status: sold ? "sold" : "holding",
    };

    if (sold) {
      // sold somewhere between a few hours and ~20 days after winning
      const holdMs = Math.floor((0.1 + rng() * 20) * DAY);
      const soldAt = Math.min(wonAt + holdMs, now - 0.04 * DAY);
      // flippers realize between -25% and +95% of won value
      const factor = 0.75 + rng() * 1.2;
      rec.soldAt = new Date(soldAt).toISOString();
      rec.salePriceUsd = Math.round((wonValueUsd * factor) / 50) * 50;
    }

    records.push(rec);
  }
  return records;
}

let _cache: SlabRecord[] | null = null;

export function getSlabRecords(): SlabRecord[] {
  if (!_cache) _cache = buildRecords();
  return _cache;
}

// ----------------------------------------------------------------------------
// derived aggregates
// ----------------------------------------------------------------------------
export interface SlabStats {
  totalWon: number;
  holding: number;
  sold: number;
  sellThroughRate: number; // 0..1
  totalWonValueUsd: number;
  totalRealizedUsd: number;
  avgHoldDays: number;
}

export function computeStats(records: SlabRecord[]): SlabStats {
  const sold = records.filter((r) => r.status === "sold");
  const holding = records.length - sold.length;
  const totalWonValueUsd = records.reduce((s, r) => s + r.wonValueUsd, 0);
  const totalRealizedUsd = sold.reduce((s, r) => s + (r.salePriceUsd ?? 0), 0);
  const holdDaysSum = sold.reduce((s, r) => s + holdDurationDays(r), 0);

  return {
    totalWon: records.length,
    holding,
    sold: sold.length,
    sellThroughRate: records.length ? sold.length / records.length : 0,
    totalWonValueUsd,
    totalRealizedUsd,
    avgHoldDays: sold.length ? holdDaysSum / sold.length : 0,
  };
}

export function holdDurationDays(r: SlabRecord): number {
  if (!r.soldAt) return 0;
  return (new Date(r.soldAt).getTime() - new Date(r.wonAt).getTime()) / 86400000;
}

export function pnlUsd(r: SlabRecord): number {
  if (r.status !== "sold" || r.salePriceUsd == null) return 0;
  return r.salePriceUsd - r.wonValueUsd;
}
