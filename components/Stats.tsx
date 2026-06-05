import { SlabStats } from "@/lib/data";
import { usd, oddsLabel } from "@/lib/format";

function Tile({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: string;
  sub?: string;
  accent?: "pink" | "gold" | "hold" | "sold";
}) {
  const color =
    accent === "pink"
      ? "text-pink"
      : accent === "gold"
        ? "text-gold"
        : accent === "hold"
          ? "text-hold"
          : accent === "sold"
            ? "text-sold"
            : "text-foreground";
  return (
    <div className="rounded-lg border border-line bg-surface p-4">
      <div className="font-mono text-[11px] uppercase tracking-wider text-faint">{label}</div>
      <div className={`mt-2 font-mono text-2xl font-bold tabular ${color}`}>{value}</div>
      {sub && <div className="mt-1 font-mono text-[11px] text-muted">{sub}</div>}
    </div>
  );
}

export function Stats({ stats }: { stats: SlabStats }) {
  return (
    <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      <Tile label="Winners" value={stats.totalWon.toString()} sub="recent draws" accent="pink" />
      <Tile
        label="Value Won"
        value={usd(stats.totalWonValueUsd, { compact: true })}
        sub="in slabs"
        accent="gold"
      />
      <Tile label="Biggest Pull" value={usd(stats.biggestWinUsd, { compact: true })} sub="single slab" />
      <Tile label="Holding" value={stats.holding.toString()} sub="no sale detected" accent="hold" />
      <Tile
        label="Longest Shot"
        value={stats.bestOdds != null ? oddsLabel(stats.bestOdds) : "n/a"}
        sub="luckiest win"
      />
    </section>
  );
}
