import { Header } from "@/components/Header";
import { LiveBanner } from "@/components/LiveBanner";
import { Stats } from "@/components/Stats";
import { Share } from "@/components/Share";
import { WinnersGallery } from "@/components/WinnersGallery";
import { getSlabRecords, getLiveWindow, computeStats } from "@/lib/data";
import { usd } from "@/lib/format";

export const revalidate = 120;

export default async function Home() {
  const [records, live] = await Promise.all([getSlabRecords(), getLiveWindow()]);
  const stats = computeStats(records);

  const tweet = `🪪 WHO SOLD SLAB\n\nTracking the last ${stats.totalWon} @SlabDrop winners: ${usd(
    stats.totalWonValueUsd,
    { compact: true },
  )} in graded slabs won, biggest pull ${usd(stats.biggestWinUsd, {
    compact: true,
  })}.\n\nWho's holding, who flips? Watch live 👇`;

  return (
    <>
      <Header />

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
        <section className="mb-6">
          <h1 className="font-mono text-2xl font-bold tracking-tight sm:text-3xl">
            Who sold the slab?
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted">
            Every <span className="text-pink">SlabDrop</span> draw hands a real graded slab to a
            holder. This board pulls the live winners, the actual cards, and tracks who keeps their
            slab versus who sells it back.
          </p>
        </section>

        <div className="space-y-8">
          <LiveBanner live={live} />
          <Stats stats={stats} />

          <section className="flex flex-col gap-3 rounded-lg border border-line bg-surface p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="font-mono text-sm font-semibold text-foreground">
                Flex the leaderboard
              </div>
              <div className="font-mono text-xs text-muted">
                Share the live winner stats and tag the team.
              </div>
            </div>
            <Share tweet={tweet} />
          </section>

          <WinnersGallery records={records} />

          <section className="rounded-lg border border-line bg-surface p-4">
            <div className="font-mono text-xs font-semibold uppercase tracking-wider text-faint">
              How status works
            </div>
            <p className="mt-2 max-w-3xl text-xs leading-relaxed text-muted">
              Winners are pulled live from the public SlabDrop API. A won slab is custodied by
              SlabDrop / phygitals.com until the winner ships it (redeem) or sells it back
              (buyback), so it never lands in the winner&apos;s own wallet. Because of that, a
              winner is shown as <span className="text-hold">HOLDING</span> until a sale is
              independently confirmed. We never label a real wallet as a seller without evidence. As
              soon as SlabDrop exposes a sold flag, or a sale is verified, it flips to{" "}
              <span className="text-sold">SOLD</span>.
            </p>
          </section>
        </div>
      </main>

      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-6 font-mono text-[11px] text-faint sm:px-6">
          <p>
            Independent winner tracker for{" "}
            <a
              href="https://slabdrop.io/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted hover:text-pink"
            >
              slabdrop.io
            </a>
            . Data via slabdrop.io public API. Not affiliated with SlabDrop. Not financial advice.
          </p>
          <p>
            JSON feed at <span className="text-muted">/api/slabs</span>.
          </p>
        </div>
      </footer>
    </>
  );
}
