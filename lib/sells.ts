import { SlabStatus } from "./data";
import seed from "@/data/confirmed-sells.json";

// Confirmed sell-backs / redemptions.
//
// These are PROVEN, not guessed. The scheduled watcher (scripts/watch.mjs,
// run by .github/workflows/watch.yml) accumulates the winner feed over time and
// flags a winner as SOLD when the exact slab they won is re-dropped in a later
// draw (the same per-item photo reappears), which means the slab went back into
// SlabDrop's pool, i.e. the winner sold it back. The watcher commits its
// findings to data/confirmed-sells.json; we read that file here.
export interface ConfirmedSell {
  drawId: number;
  status: Exclude<SlabStatus, "holding">; // "sold" | "redeemed"
  soldAt?: string;
  salePriceUsd?: number;
  source: string;
}

// Pull the freshest findings straight from the repo so the cron's commits show
// up without needing a redeploy; fall back to the version bundled at build.
const RAW_URL =
  "https://raw.githubusercontent.com/Eienel/whosoldslab/main/data/confirmed-sells.json";

export async function getConfirmedSells(): Promise<Map<number, ConfirmedSell>> {
  let list = seed as ConfirmedSell[];
  try {
    const res = await fetch(RAW_URL, { next: { revalidate: 120 } });
    if (res.ok) {
      const fresh = (await res.json()) as ConfirmedSell[];
      if (Array.isArray(fresh)) list = fresh;
    }
  } catch {
    /* use bundled seed */
  }
  return new Map(list.map((c) => [c.drawId, c]));
}
