import { NextResponse } from "next/server";
import { getSlabRecords, computeStats } from "@/lib/data";

// JSON feed of the same data the dashboard renders. Useful for embeds / bots.
export function GET() {
  const records = getSlabRecords();
  return NextResponse.json({
    stats: computeStats(records),
    records,
  });
}
