import { ImageResponse } from "next/og";
import { getSlabRecords, computeStats } from "@/lib/data";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Who Sold Slab";
export const revalidate = 300;

function usdC(n: number) {
  return n >= 10000
    ? "$" + (n / 1000).toFixed(1) + "k"
    : "$" + Math.round(n).toLocaleString("en-US");
}

export default async function OG() {
  const records = await getSlabRecords();
  const stats = computeStats(records);

  const Stat = (label: string, value: string, color: string) => (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <span style={{ display: "flex", color: "#5a5a64", fontSize: 22 }}>{label}</span>
      <span style={{ display: "flex", color, fontSize: 56, fontWeight: 800 }}>{value}</span>
    </div>
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#070b12",
          color: "#e8eaec",
          padding: "64px 72px",
          fontFamily: "monospace",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ display: "flex", fontSize: 44 }}>🪪</div>
          <div style={{ display: "flex", fontSize: 34, letterSpacing: 6, fontWeight: 700 }}>
            <span>WHO</span>
            <span style={{ color: "#ff7ab8" }}>SOLD</span>
            <span>SLAB</span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 64, fontWeight: 800 }}>
            Who sold the slab?
          </div>
          <div style={{ display: "flex", fontSize: 30, color: "#8a8a95", marginTop: 12 }}>
            {`Live tracker for the last ${stats.totalWon} SlabDrop winners`}
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div style={{ display: "flex", gap: 56 }}>
            {Stat("WINNERS", String(stats.totalWon), "#ff7ab8")}
            {Stat("VALUE WON", usdC(stats.totalWonValueUsd), "#f5b14c")}
            {Stat("BIGGEST", usdC(stats.biggestWinUsd), "#76e6c4")}
          </div>
          <div style={{ display: "flex", fontSize: 22, color: "#8a8a95" }}>
            data: slabdrop.io
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
