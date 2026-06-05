import { Header } from "@/components/Header";
import { StatsBar } from "@/components/StatsBar";
import { DiamondIndex } from "@/components/DiamondIndex";
import { Leaderboards } from "@/components/Leaderboards";
import { WinnersExplorer } from "@/components/WinnersExplorer";
import { getSlabRecords, computeStats } from "@/lib/data";
import { diamondIndex } from "@/lib/score";

export default function Home() {
  const records = getSlabRecords();
  const stats = computeStats(records);
  const index = diamondIndex(records);

  return (
    <>
      <Header />

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
        {/* hero */}
        <section className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Who <span className="shimmer-text">sold</span> the slab?
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted sm:text-base">
            Every <span className="text-gold">SlabDrop</span> draw awards a graded
            trading-card slab to a holder. This board tracks each winner and shows who
            flipped their slab for profit and who&apos;s still holding in the vault.
          </p>
        </section>

        <div className="space-y-8">
          <DiamondIndex
            index={index}
            holdRate={1 - stats.sellThroughRate}
            holding={stats.holding}
            total={stats.totalWon}
          />
          <StatsBar stats={stats} />
          <Leaderboards records={records} />
          <WinnersExplorer records={records} />
        </div>
      </main>

      <footer className="border-t border-line/80">
        <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-6 text-xs text-faint sm:px-6">
          <p>
            Who Sold Slab — an independent winner tracker inspired by{" "}
            <a
              href="https://slabdrop.io/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted underline-offset-2 hover:text-gold hover:underline"
            >
              slabdrop.io
            </a>
            .
          </p>
          <p>
            Demo dataset for illustration. Wire <code className="text-muted">getSlabRecords()</code>{" "}
            to the live SlabDrop API / on-chain indexer to track real draws. Not affiliated with
            SlabDrop. Not financial advice.
          </p>
        </div>
      </footer>
    </>
  );
}
