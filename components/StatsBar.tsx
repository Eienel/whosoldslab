import { SlabStats } from "@/lib/data";
import { usd, pct, holdLabel } from "@/lib/format";

function Stat({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: string;
  sub?: string;
  accent?: "gold" | "hold" | "sold" | "info";
}) {
  const accentClass =
    accent === "hold"
      ? "text-hold"
      : accent === "sold"
        ? "text-sold"
        : accent === "info"
          ? "text-info"
          : accent === "gold"
            ? "text-gold"
            : "text-foreground";
  return (
    <div className="rise rounded-xl border border-line bg-card/60 p-4 transition-colors hover:border-line-2">
      <div className="text-[11px] uppercase tracking-[0.15em] text-faint">{label}</div>
      <div className={`mt-2 font-mono text-2xl font-semibold tabular ${accentClass}`}>
        {value}
      </div>
      {sub && <div className="mt-1 text-xs text-muted">{sub}</div>}
    </div>
  );
}

export function StatsBar({ stats }: { stats: SlabStats }) {
  return (
    <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      <Stat label="Slabs Won" value={stats.totalWon.toString()} sub="all-time draws" accent="gold" />
      <Stat
        label="Still Holding"
        value={stats.holding.toString()}
        sub={pct(1 - stats.sellThroughRate, 0) + " of winners"}
        accent="hold"
      />
      <Stat
        label="Sold / Flipped"
        value={stats.sold.toString()}
        sub={pct(stats.sellThroughRate, 0) + " sell-through"}
        accent="sold"
      />
      <Stat
        label="Won Value"
        value={usd(stats.totalWonValueUsd, { compact: true })}
        sub="at time of win"
      />
      <Stat
        label="Realized"
        value={usd(stats.totalRealizedUsd, { compact: true })}
        sub="from flippers"
        accent="info"
      />
      <Stat label="Avg Hold" value={holdLabel(stats.avgHoldDays)} sub="before selling" />
    </section>
  );
}
