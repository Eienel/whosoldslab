import { SlabRecord, holdDurationDays, pnlUsd } from "@/lib/data";
import { truncateWallet, usd, holdLabel } from "@/lib/format";
import { SlabAvatar } from "./ui";

function WinnerName({ r }: { r: SlabRecord }) {
  return r.handle ? (
    <span className="text-foreground">@{r.handle}</span>
  ) : (
    <span className="font-mono text-muted">{truncateWallet(r.wallet)}</span>
  );
}

function Board({
  title,
  blurb,
  emoji,
  tone,
  rows,
}: {
  title: string;
  blurb: string;
  emoji: string;
  tone: "hold" | "sold";
  rows: Array<{ r: SlabRecord; metric: string; metricTone?: "up" | "down" }>;
}) {
  const ring = tone === "hold" ? "border-hold/25" : "border-sold/25";
  const titleTone = tone === "hold" ? "text-hold" : "text-sold";
  return (
    <div className={`rounded-2xl border ${ring} bg-card/50 p-4`}>
      <div className="flex items-baseline justify-between">
        <h3 className={`flex items-center gap-2 text-sm font-semibold ${titleTone}`}>
          <span>{emoji}</span> {title}
        </h3>
      </div>
      <p className="mt-1 text-xs text-faint">{blurb}</p>
      <ol className="mt-3 space-y-1">
        {rows.map(({ r, metric, metricTone }, i) => (
          <li
            key={r.id}
            className="flex items-center gap-3 rounded-lg px-2 py-1.5 transition-colors hover:bg-card-2"
          >
            <span className="w-4 text-right font-mono text-xs text-faint">{i + 1}</span>
            <SlabAvatar card={r.card} grade={r.grade} />
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm">
                <WinnerName r={r} />
              </div>
              <div className="truncate text-[11px] text-faint">
                {r.card} · {r.grader} {r.grade}
              </div>
            </div>
            <span
              className={`font-mono text-xs font-semibold tabular ${
                metricTone === "up"
                  ? "text-hold"
                  : metricTone === "down"
                    ? "text-sold"
                    : "text-muted"
              }`}
            >
              {metric}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}

export function Leaderboards({ records }: { records: SlabRecord[] }) {
  const diamond = records
    .filter((r) => r.status === "holding")
    .sort((a, b) => b.wonValueUsd - a.wonValueUsd)
    .slice(0, 5)
    .map((r) => ({ r, metric: usd(r.wonValueUsd, { compact: true }) }));

  const paper = records
    .filter((r) => r.status === "sold")
    .sort((a, b) => holdDurationDays(a) - holdDurationDays(b))
    .slice(0, 5)
    .map((r) => ({ r, metric: holdLabel(holdDurationDays(r)) }));

  const flips = records
    .filter((r) => r.status === "sold")
    .sort((a, b) => pnlUsd(b) - pnlUsd(a))
    .slice(0, 5)
    .map((r) => {
      const p = pnlUsd(r);
      return {
        r,
        metric: `${p >= 0 ? "+" : "−"}${usd(Math.abs(p), { compact: true })}`,
        metricTone: (p >= 0 ? "up" : "down") as "up" | "down",
      };
    });

  return (
    <section className="grid gap-4 lg:grid-cols-3">
      <Board
        title="Diamond Hands"
        blurb="Highest-value slabs still in the vault, unsold."
        emoji="💎"
        tone="hold"
        rows={diamond}
      />
      <Board
        title="Paper Hands"
        blurb="Fastest flips — sold the slab almost as soon as they won."
        emoji="📄"
        tone="sold"
        rows={paper}
      />
      <Board
        title="Best Flips"
        blurb="Biggest realized gain (and loss) from selling."
        emoji="💸"
        tone="sold"
        rows={flips}
      />
    </section>
  );
}
