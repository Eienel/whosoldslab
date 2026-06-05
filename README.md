# Who Sold Slab

A live dashboard that tracks **[SlabDrop](https://slabdrop.io/)** winners: the real graded
trading-card slabs people won, their value, the odds they hit, and whether they're holding the
slab or sold it back.

## Real data

The board reads SlabDrop's public API directly (no scraping, no auth):

| Endpoint | Used for |
| --- | --- |
| `GET /api/winners` | winner wallet, draw id, time, value, the actual card + image |
| `GET /api/draws` | per-draw winning odds |
| `GET /api/state` | live draw window, current prize, holder count, slab price |
| `GET /api/config` | brand, mint, draw window length |

Card photos are the real slab images (served through SlabDrop's `/api/img` proxy, which fronts
the phygitals.com listing storage). Every winner links out to their wallet on Solscan.

## Holding vs sold

Won slabs are **custodied by SlabDrop / phygitals.com** until the winner ships them (redeem) or
sells them back (buyback), so the slab never lands in the winner's own wallet. There is no public,
per-winner "sold" flag today, so:

- A winner is shown as **HOLDING** until a sale is independently confirmed.
- We never label a real wallet as a seller without evidence.
- The moment SlabDrop exposes a sold/redeemed flag (or a sale is otherwise verified), the
  `CONFIRMED` map in `lib/data.ts` flips that winner to **SOLD** / **REDEEMED**.

## Tech

- Next.js 16 (App Router) with ISR (`revalidate` 120s) so it stays current
- React 19, TypeScript, Tailwind CSS v4
- JetBrains Mono + dark navy palette sampled from slabdrop.io
- Dynamic Open Graph / X share image via `next/og`
- Deployed on Vercel

JSON feed of everything the dashboard uses: **`/api/slabs`**.

## Develop

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
```

---

Independent winner tracker. Not affiliated with SlabDrop. Not financial advice.
