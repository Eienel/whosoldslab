"use client";

import { useMemo, useState } from "react";
import { SlabRecord, holdDurationDays, pnlUsd } from "@/lib/data";
import { truncateWallet, usd, relativeTime, holdLabel } from "@/lib/format";
import { diamondScore, tierFor } from "@/lib/score";
import { StatusBadge, SlabAvatar } from "./ui";

type Filter = "all" | "holding" | "sold";
type SortKey = "recent" | "score" | "value" | "pnl" | "hold";

const FILTERS: { key: Filter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "holding", label: "💎 Holding" },
  { key: "sold", label: "📄 Sold" },
];

const SORTS: { key: SortKey; label: string }[] = [
  { key: "recent", label: "Most recent" },
  { key: "score", label: "Diamond score" },
  { key: "value", label: "Won value" },
  { key: "pnl", label: "Realized P&L" },
  { key: "hold", label: "Hold time" },
];

export function WinnersExplorer({ records }: { records: SlabRecord[] }) {
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
          (r.handle?.toLowerCase().includes(needle) ?? false) ||
          r.card.toLowerCase().includes(needle) ||
          r.set.toLowerCase().includes(needle),
      );
    }
    const sorted = [...list];
    switch (sort) {
      case "score":
        sorted.sort((a, b) => diamondScore(b) - diamondScore(a));
        break;
      case "value":
        sorted.sort((a, b) => b.wonValueUsd - a.wonValueUsd);
        break;
      case "pnl":
        sorted.sort((a, b) => pnlUsd(b) - pnlUsd(a));
        break;
      case "hold":
        sorted.sort((a, b) => holdDurationDays(b) - holdDurationDays(a));
        break;
      default:
        sorted.sort((a, b) => +new Date(b.wonAt) - +new Date(a.wonAt));
    }
    return sorted;
  }, [records, filter, sort, q]);

  return (
    <section className="rounded-2xl border border-line bg-card/40">
      {/* controls */}
      <div className="flex flex-col gap-3 border-b border-line p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                filter === f.key
                  ? "bg-gold/15 text-gold ring-1 ring-gold/40"
                  : "bg-card text-muted ring-1 ring-line hover:text-foreground"
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
            placeholder="Search wallet, @handle, card…"
            className="w-full min-w-0 rounded-lg border border-line bg-ink px-3 py-1.5 text-sm text-foreground outline-none placeholder:text-faint focus:border-gold/50 sm:w-56"
          />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="rounded-lg border border-line bg-ink px-2 py-1.5 text-xs text-muted outline-none focus:border-gold/50"
          >
            {SORTS.map((s) => (
              <option key={s.key} value={s.key}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-sm">
          <thead>
            <tr className="text-left text-[11px] uppercase tracking-[0.12em] text-faint">
              <th className="px-4 py-2.5 font-medium">Draw</th>
              <th className="px-4 py-2.5 font-medium">Winner</th>
              <th className="px-4 py-2.5 font-medium">Slab</th>
              <th className="px-4 py-2.5 text-right font-medium">Won Value</th>
              <th className="px-4 py-2.5 font-medium">Status</th>
              <th className="px-4 py-2.5 text-right font-medium">Sold / Hold</th>
              <th className="px-4 py-2.5 text-right font-medium">P&amp;L</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const pnl = pnlUsd(r);
              return (
                <tr
                  key={r.id}
                  className="border-t border-line/60 transition-colors hover:bg-card-2/60"
                >
                  <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-faint">
                    #{r.drawId}
                  </td>
                  <td className="px-4 py-3">
                    {r.handle ? (
                      <span className="text-foreground">@{r.handle}</span>
                    ) : (
                      <span className="font-mono text-xs text-muted">
                        {truncateWallet(r.wallet)}
                      </span>
                    )}
                    {(() => {
                      const t = tierFor(diamondScore(r));
                      return (
                        <div
                          className={`mt-0.5 text-[11px] ${t.className}`}
                          title={`Diamond Hands Score ${diamondScore(r)}/100`}
                        >
                          {t.emoji} {t.name}
                        </div>
                      );
                    })()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <SlabAvatar card={r.card} grade={r.grade} />
                      <div className="leading-tight">
                        <div className="text-foreground">{r.card}</div>
                        <div className="text-[11px] text-faint">
                          {r.set} · {r.grader} {r.grade}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-right font-mono tabular text-foreground">
                    {usd(r.wonValueUsd)}
                    <div className="text-[11px] font-sans text-faint">
                      {relativeTime(r.wonAt)}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={r.status} />
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-right">
                    {r.status === "sold" ? (
                      <>
                        <div className="font-mono tabular text-foreground">
                          {usd(r.salePriceUsd ?? 0)}
                        </div>
                        <div className="text-[11px] text-faint">
                          held {holdLabel(holdDurationDays(r))}
                        </div>
                      </>
                    ) : (
                      <span className="text-faint">—</span>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-right font-mono tabular">
                    {r.status === "sold" ? (
                      <span className={pnl >= 0 ? "text-hold" : "text-sold"}>
                        {pnl >= 0 ? "+" : "−"}
                        {usd(Math.abs(pnl))}
                      </span>
                    ) : (
                      <span className="text-faint">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {rows.length === 0 && (
          <div className="px-4 py-12 text-center text-sm text-faint">
            No slabs match your filters.
          </div>
        )}
      </div>

      <div className="border-t border-line px-4 py-3 text-[11px] text-faint">
        Showing {rows.length} of {records.length} slabs won.
      </div>
    </section>
  );
}
