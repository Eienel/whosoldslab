# Who Sold Slab 🪪

A live dashboard that tracks every **[SlabDrop](https://slabdrop.io/)** winner and shows
**who sold the graded trading-card slab they won** versus **who's still holding** it in the vault.

> Diamond hands vs paper hands — for the SlabDrop community.

## What it shows

- **Diamond Hands Index** — a single 0–100 loyalty score for the whole community, with a
  one-click **"Flex on X"** button that pre-composes a tweet (tagging `@SlabDrop`) and a
  dynamic **Open Graph share image** so the link unfurls into a branded card.
- **Live stats** — slabs won, still holding, sold/flipped, sell-through rate, realized value,
  average hold time.
- **Leaderboards** — 💎 Diamond Hands (biggest unsold slabs), 📄 Paper Hands (fastest flips),
  and 💸 Best Flips (biggest realized P&L).
- **Winners explorer** — searchable, filterable, sortable table of every winner with their
  per-slab Diamond Hands Score and tier (Vault Legend → Paper Hands).

## Tech

- [Next.js 16](https://nextjs.org/) (App Router) · React 19 · TypeScript
- Tailwind CSS v4
- Dynamic OG images via `next/og`
- Deployed on [Vercel](https://vercel.com/)

## Data

The dashboard renders a deterministic **demo dataset** (`lib/data.ts`) for illustration.
Every component consumes the `SlabRecord` shape, so wiring in live data is a one-function swap:
point `getSlabRecords()` at the SlabDrop API / on-chain indexer and everything else just works.

A JSON feed of the same data is exposed at **`/api/slabs`**.

## Develop

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```

---

Independent tracker inspired by slabdrop.io. Not affiliated with SlabDrop. Not financial advice.
