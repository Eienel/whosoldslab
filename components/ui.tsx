import { SlabRecord } from "@/lib/data";

export function StatusBadge({ status }: { status: SlabRecord["status"] }) {
  if (status === "sold") {
    return (
      <span className="inline-flex items-center gap-1 rounded border border-sold/40 bg-sold/10 px-2 py-0.5 font-mono text-[10px] font-semibold text-sold">
        SOLD
      </span>
    );
  }
  if (status === "redeemed") {
    return (
      <span className="inline-flex items-center gap-1 rounded border border-blue/40 bg-blue/10 px-2 py-0.5 font-mono text-[10px] font-semibold text-blue">
        REDEEMED
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded border border-hold/40 bg-hold/10 px-2 py-0.5 font-mono text-[10px] font-semibold text-hold">
      HOLDING
    </span>
  );
}

export function GraderTag({ grader, grade }: { grader?: string; grade?: string }) {
  if (!grader) return null;
  return (
    <span className="rounded border border-line-2 bg-ink px-1.5 py-0.5 font-mono text-[10px] font-semibold text-gold">
      {grader} {grade}
    </span>
  );
}
