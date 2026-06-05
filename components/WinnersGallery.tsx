"use client";

import { useMemo, useState } from "react";
import { SlabRecord, solscanWallet } from "@/lib/data";
import { truncateWallet, usd, relativeTime, oddsLabel } from "@/lib/format";
import { StatusBadge, GraderTag } from "./ui";

type Filter = "all" | "holding" | "sold";
type SortKey = "recent" | "value" | "odds";

const FILTERS: { key: Filter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "holding", label: "Holding" },
  { key: "sold", label: "Sold" },
];
const SORTS: { key: SortKey; label: string }[] = [
  { key: "recent", label: "Most recent" },
  { key: "value", label: "Highest value" },
  { key: "odds", label: "Longest odds" },
];

function Card({ r }: { r: SlabRecord }) {
  return (
    <div className="group flex flex-col overflow-hidden rounded-lg border border-line bg-surface transition-colors hover:border-line-2">
      <div className="relative aspect-square w-full overflow-hidden bg-ink-2">
        {r.card.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={r.card.image}
            alt={r.card.fullName}
            className="h-full w-full object-contain"
          />
        ) : (
          <div className="grid h-full w-full place-items-center font-mono text-xs text-faint">
            no image
          </div>
        )}
        <div className="absolute left-2 top-2">
          <StatusBadge status={r.status} />
        </div>
        <div className="absolute right-2 top-2">
          <GraderTag grader={r.card.grader} grade={r.card.grade} />
        </div>
        <div className="absolute bottom-2 right-2 rounded bg-ink/80 px-2 py-0.5 font-mono text-[10px] text-muted">
          #{r.drawId}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-3">
        <div className="min-h-[2.5rem] text-sm leading-snug text-foreground">
          {r.card.year ? `${r.card.year} ` : ""}
          {r.card.title}
        </div>

        <div className="flex items-end justify-between">
          <div>
            <div className="font-mono text-lg font-bold tabular text-gold">
              {usd(r.prizeValueUsd)}
            </div>
            <div className="font-mono text-[10px] text-faint">
              sellback {usd(r.sellbackUsd)}
            </div>
          </div>
          <div className="text-right font-mono text-[10px] text-muted">
            <div>{oddsLabel(r.odds)}</div>
            <div className="text-faint">{relativeTime(r.wonAt)}</div>
          </div>
        </div>

        <a
          href={solscanWallet(r.wallet)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1 flex items-center justify-between rounded border border-line bg-ink px-2 py-1.5 font-mono text-[11px] text-muted transition-colors hover:border-pink/50 hover:text-foreground"
        >
          <span>{truncateWallet(r.wallet, 5, 5)}</span>
          <span className="text-faint group-hover:text-pink">Solscan</span>
        </a>
      </div>
    </div>
  );
}

export function WinnersGallery({ records }: { records: SlabRecord[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [sort, setSort] = useState<SortKey>("recent");
  const [q, setQ] = useState("");

  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase();
    let list = records.filter((r) => (filter === "all" ? true : r.status === filter));
    if (needle) {
      list = list.filter(
        (r) =>
          r.wallet.toLowerCase().includes(needle) ||
          r.card.fullName.toLowerCase().includes(needle),
      );
    }
    const sorted = [...list];
    switch (sort) {
      case "value":
        sorted.sort((a, b) => b.prizeValueUsd - a.prizeValueUsd);
        break;
      case "odds":
        sorted.sort((a, b) => (a.odds ?? 1) - (b.odds ?? 1));
        break;
      default:
        sorted.sort((a, b) => +new Date(b.wonAt) - +new Date(a.wonAt));
    }
    return sorted;
  }, [records, filter, sort, q]);

  return (
    <section>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`rounded-md px-3 py-1.5 font-mono text-xs transition-colors ${
                filter === f.key
                  ? "bg-pink/15 text-pink ring-1 ring-pink/40"
                  : "bg-surface text-muted ring-1 ring-line hover:text-foreground"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search wallet or card"
            className="w-full min-w-0 rounded-md border border-line bg-ink px-3 py-1.5 font-mono text-sm text-foreground outline-none placeholder:text-faint focus:border-pink/50 sm:w-56"
          />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="rounded-md border border-line bg-ink px-2 py-1.5 font-mono text-xs text-muted outline-none focus:border-pink/50"
          >
            {SORTS.map((s) => (
              <option key={s.key} value={s.key}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {rows.length === 0 ? (
        <div className="rounded-lg border border-line bg-surface py-16 text-center font-mono text-sm text-faint">
          No winners match.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
          {rows.map((r) => (
            <Card key={r.id} r={r} />
          ))}
        </div>
      )}

      <div className="mt-4 font-mono text-[11px] text-faint">
        Showing {rows.length} of {records.length} tracked winners. Live from slabdrop.io/api.
      </div>
    </section>
  );
}
