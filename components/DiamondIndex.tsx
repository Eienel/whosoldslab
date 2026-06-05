"use client";

import { useState } from "react";
import { pct } from "@/lib/format";

function Gauge({ value }: { value: number }) {
  const r = 52;
  const c = 2 * Math.PI * r;
  const dash = (value / 100) * c;
  return (
    <svg viewBox="0 0 128 128" className="h-32 w-32 -rotate-90">
      <circle cx="64" cy="64" r={r} fill="none" stroke="var(--color-line)" strokeWidth="10" />
      <circle
        cx="64"
        cy="64"
        r={r}
        fill="none"
        stroke="url(#g)"
        strokeWidth="10"
        strokeLinecap="round"
        strokeDasharray={`${dash} ${c}`}
      />
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#34d399" />
          <stop offset="100%" stopColor="#f5c451" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function DiamondIndex({
  index,
  holdRate,
  holding,
  total,
}: {
  index: number;
  holdRate: number;
  holding: number;
  total: number;
}) {
  const [copied, setCopied] = useState(false);

  const tweet = `🪪 SlabDrop holders are DIAMOND HANDED 💎\n\n${pct(
    holdRate,
    0,
  )} of slab winners are STILL HOLDING the slab they won — Diamond Hands Index: ${index}/100.\n\nSee who sold vs who's holding 👇 @SlabDrop`;

  const share = () => {
    const url = typeof window !== "undefined" ? window.location.origin : "";
    const intent = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      tweet,
    )}&url=${encodeURIComponent(url)}`;
    window.open(intent, "_blank", "noopener,noreferrer");
  };

  const copy = async () => {
    const url = typeof window !== "undefined" ? window.location.origin : "";
    try {
      await navigator.clipboard.writeText(`${tweet}\n${url}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* ignore */
    }
  };

  return (
    <section className="rise overflow-hidden rounded-2xl border border-gold/25 bg-gradient-to-br from-gold/[0.07] via-card to-card p-5 sm:p-6">
      <div className="flex flex-col items-center gap-6 sm:flex-row sm:gap-8">
        <div className="relative grid shrink-0 place-items-center">
          <Gauge value={index} />
          <div className="absolute flex flex-col items-center">
            <span className="font-mono text-3xl font-bold tabular text-foreground">{index}</span>
            <span className="text-[10px] uppercase tracking-widest text-faint">/ 100</span>
          </div>
        </div>

        <div className="flex-1 text-center sm:text-left">
          <div className="text-[11px] uppercase tracking-[0.2em] text-gold">
            Diamond Hands Index
          </div>
          <h2 className="mt-1 text-xl font-bold sm:text-2xl">
            {pct(holdRate, 0)} of winners are still holding 💎
          </h2>
          <p className="mt-1 text-sm text-muted">
            {holding} of {total} slab winners never sold the slab they won. Higher index ={" "}
            <span className="text-hold">stronger hands</span>.
          </p>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
            <button
              onClick={share}
              className="inline-flex items-center gap-2 rounded-lg bg-foreground px-4 py-2 text-sm font-semibold text-ink transition-transform hover:-translate-y-0.5"
            >
              <span>𝕏</span> Flex on X
            </button>
            <button
              onClick={copy}
              className="inline-flex items-center gap-2 rounded-lg border border-line-2 bg-card px-4 py-2 text-sm font-medium text-muted transition-colors hover:border-gold/50 hover:text-foreground"
            >
              {copied ? "✓ Copied!" : "Copy stat"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
