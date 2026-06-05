import { LiveWindow } from "@/lib/data";
import { usd } from "@/lib/format";

export function LiveBanner({ live }: { live: LiveWindow | null }) {
  if (!live) return null;
  return (
    <section className="flex flex-col gap-4 rounded-lg border border-line bg-surface p-4 sm:flex-row sm:items-center">
      {live.prize?.image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={live.prize.image}
          alt={live.prize.name}
          className="h-24 w-20 shrink-0 rounded border border-line-2 object-cover"
        />
      )}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 font-mono text-[11px] text-hold">
          <span className="blink inline-block h-1.5 w-1.5 rounded-full bg-hold" />
          LIVE DRAW #{live.id} / EVERY {live.drawWindowMinutes}M
        </div>
        <div className="mt-1 truncate text-sm font-semibold text-foreground">
          {live.prize?.name ?? "Next slab up for grabs"}
        </div>
        <div className="mt-0.5 font-mono text-xs text-muted">
          Prize {usd(live.prizeValueUsd)} / {live.holderCount.toLocaleString("en-US")} eligible
          holders
        </div>
      </div>
      <a
        href="https://slabdrop.io/"
        target="_blank"
        rel="noopener noreferrer"
        className="shrink-0 rounded-md border border-pink/50 bg-pink/10 px-4 py-2 text-center font-mono text-xs font-semibold text-pink transition-colors hover:bg-pink/20"
      >
        Enter on slabdrop.io
      </a>
    </section>
  );
}
