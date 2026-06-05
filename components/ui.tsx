import { SlabRecord } from "@/lib/data";

export function StatusBadge({ status }: { status: SlabRecord["status"] }) {
  if (status === "holding") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-hold/30 bg-hold/10 px-2.5 py-0.5 text-[11px] font-semibold text-hold">
        <span className="text-[9px]">💎</span> HOLDING
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-sold/30 bg-sold/10 px-2.5 py-0.5 text-[11px] font-semibold text-sold">
      <span className="text-[9px]">📄</span> SOLD
    </span>
  );
}

// Deterministic gradient swatch keyed off the card name — stands in for the
// real slab photo while keeping the grid colorful and stable.
const PALETTES = [
  ["#f5c451", "#d9a032"],
  ["#fb7185", "#9f1239"],
  ["#60a5fa", "#1e40af"],
  ["#34d399", "#065f46"],
  ["#c084fc", "#6b21a8"],
  ["#f97316", "#7c2d12"],
];

export function SlabAvatar({ card, grade }: { card: string; grade: string }) {
  let h = 0;
  for (let i = 0; i < card.length; i++) h = (h * 31 + card.charCodeAt(i)) >>> 0;
  const [a, b] = PALETTES[h % PALETTES.length];
  return (
    <div
      className="grid h-10 w-8 shrink-0 place-items-center rounded-[3px] border border-white/10 text-[9px] font-bold text-black/70 shadow-inner"
      style={{ background: `linear-gradient(140deg, ${a}, ${b})` }}
      aria-hidden
    >
      {grade}
    </div>
  );
}
