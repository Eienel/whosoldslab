import { SlabStatus } from "./data";

// Confirmed sell-backs / redemptions.
//
// There is currently NO public, per-winner "sold" signal for SlabDrop:
//   - won slabs are custodied by SlabDrop / phygitals.com, so they never land
//     in the winner's own wallet (nothing on-chain to watch leave),
//   - phygitals' listing database is not openly queryable,
//   - the buyback payout has no shared on-chain wallet to fingerprint.
//
// So we only ever flag a winner as SOLD / REDEEMED when a sale is INDEPENDENTLY
// CONFIRMED. Add an entry here when that happens (a SlabDrop sold flag, a
// verified phygitals relist, an on-chain buyback the winner confirms, etc).
// We never label a real wallet as a seller on a guess.
//
// Keyed by drawId.
export interface ConfirmedSell {
  drawId: number;
  status: Exclude<SlabStatus, "holding">; // "sold" | "redeemed"
  soldAt?: string; // ISO
  salePriceUsd?: number;
  source: string; // how it was verified (url / note) — shown nowhere, audit only
}

export const CONFIRMED_SELLS: ConfirmedSell[] = [
  // Example shape (commented out — no real sale has been verified yet):
  // { drawId: 7, status: "sold", soldAt: "2026-06-05T18:00:00Z", salePriceUsd: 225, source: "winner posted phygitals receipt" },
];

export function confirmedByDraw(): Map<number, ConfirmedSell> {
  return new Map(CONFIRMED_SELLS.map((c) => [c.drawId, c]));
}
