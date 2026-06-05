// Re-drop sell detector for Who Sold Slab.
//
// SlabDrop awards a slab, and if the winner sells it back, SlabDrop re-drops the
// SAME physical slab in a later draw. Each slab photo is a unique per-item asset
// URL, so when the same image reappears for a different (later) draw, the
// earlier winner provably parted with their slab => SOLD. This is real evidence
// from the public feed, not a guess.
//
// Run on a schedule (GitHub Action). It accumulates winner history beyond the
// rolling API window and writes the confirmed sells it can prove.

import fs from "fs";
import path from "path";

const BASE = "https://slabdrop.io";
const DATA = path.join(process.cwd(), "data");
const HISTORY = path.join(DATA, "history.json");
const SELLS = path.join(DATA, "confirmed-sells.json");
const BUYBACK = 0.9;

function imgKey(u) {
  if (!u) return "";
  try {
    const m = decodeURIComponent(u).match(/[?&]u=(.*)$/);
    return (m ? m[1] : u).split("?")[0];
  } catch {
    return u;
  }
}

function load(file, fallback) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return fallback;
  }
}

async function main() {
  const res = await fetch(`${BASE}/api/winners?limit=100`, {
    headers: { Accept: "application/json", "User-Agent": "who-sold-slab-watch" },
  });
  const json = await res.json();
  const winners = Array.isArray(json) ? json : json.winners ?? [];

  const history = load(HISTORY, { draws: {}, updatedAt: null });

  // Merge new draws; keep the first-seen record for each draw immutable.
  for (const w of winners) {
    const id = String(w.drawId);
    const c = w.cards?.[0] ?? {};
    if (!history.draws[id]) {
      history.draws[id] = {
        drawId: w.drawId,
        wallet: w.wallet,
        wonAt: w.wonAt,
        value: w.value,
        name: c.name ?? "",
        image: c.image ?? "",
        imgKey: imgKey(c.image),
      };
    }
  }

  // Group draws by slab image; if one slab shows up across multiple draws,
  // every winner before the latest one sold (the slab went back into the drop).
  const byImg = new Map();
  for (const d of Object.values(history.draws)) {
    if (!d.imgKey) continue;
    if (!byImg.has(d.imgKey)) byImg.set(d.imgKey, []);
    byImg.get(d.imgKey).push(d);
  }

  const sells = [];
  for (const draws of byImg.values()) {
    if (draws.length < 2) continue;
    const sorted = [...draws].sort((a, b) => a.drawId - b.drawId);
    for (let i = 0; i < sorted.length - 1; i++) {
      const seller = sorted[i];
      const next = sorted[i + 1];
      sells.push({
        drawId: seller.drawId,
        status: "sold",
        soldAt: next.wonAt, // sold back before it could be re-dropped
        salePriceUsd: Math.round(seller.value * BUYBACK * 100) / 100,
        source: `re-dropped at draw #${next.drawId} (same slab back in the pool)`,
      });
    }
  }
  sells.sort((a, b) => b.drawId - a.drawId);

  history.updatedAt = new Date().toISOString();
  fs.mkdirSync(DATA, { recursive: true });
  fs.writeFileSync(HISTORY, JSON.stringify(history, null, 2) + "\n");
  fs.writeFileSync(SELLS, JSON.stringify(sells, null, 2) + "\n");

  console.log(
    `tracked draws: ${Object.keys(history.draws).length}, confirmed sells: ${sells.length}`,
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
