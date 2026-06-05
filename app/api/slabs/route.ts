import { NextResponse } from "next/server";
import { getSlabRecords, getLiveWindow, computeStats } from "@/lib/data";

export const revalidate = 120;

// JSON feed of the same live data the dashboard renders.
export async function GET() {
  const [records, live] = await Promise.all([getSlabRecords(), getLiveWindow()]);
  return NextResponse.json({
    source: "https://slabdrop.io/api",
    live,
    stats: computeStats(records),
    records,
  });
}
