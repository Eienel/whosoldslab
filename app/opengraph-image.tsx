import { ImageResponse } from "next/og";
import { getSlabRecords, computeStats } from "@/lib/data";
import { diamondIndex } from "@/lib/score";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Who Sold Slab — Diamond Hands Index";

function Col({ children, ...style }: { children: React.ReactNode } & React.CSSProperties) {
  return <div style={{ display: "flex", flexDirection: "column", ...style }}>{children}</div>;
}
function Row({ children, ...style }: { children: React.ReactNode } & React.CSSProperties) {
  return <div style={{ display: "flex", flexDirection: "row", ...style }}>{children}</div>;
}

export default function OG() {
  const records = getSlabRecords();
  const stats = computeStats(records);
  const index = diamondIndex(records);
  const holdPct = Math.round((1 - stats.sellThroughRate) * 100);

  const stat = (label: string, value: string, color: string) => (
    <Col>
      <div style={{ display: "flex", color: "#585f72", fontSize: 20 }}>{label}</div>
      <div style={{ display: "flex", fontWeight: 700, color }}>{value}</div>
    </Col>
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
          background:
            "radial-gradient(900px 500px at 80% -100px, rgba(245,196,81,0.18), transparent 70%), #07080c",
          color: "#e8eaf0",
          padding: "64px 72px",
          fontFamily: "sans-serif",
        }}
      >
        <Row alignItems="center" gap={16}>
          <div style={{ display: "flex", fontSize: 40 }}>🪪</div>
          <Row fontSize={30} letterSpacing={6} fontWeight={700}>
            <span>WHO</span>
            <span style={{ color: "#f5c451" }}>SOLD</span>
            <span>SLAB</span>
          </Row>
        </Row>

        <Col>
          <div
            style={{
              display: "flex",
              fontSize: 26,
              letterSpacing: 4,
              color: "#f5c451",
            }}
          >
            DIAMOND HANDS INDEX
          </div>
          <Row alignItems="flex-end" gap={12}>
            <div style={{ display: "flex", fontSize: 200, fontWeight: 800, lineHeight: 1 }}>
              {String(index)}
            </div>
            <div style={{ display: "flex", fontSize: 48, color: "#585f72", paddingBottom: 28 }}>
              /100
            </div>
          </Row>
          <div style={{ display: "flex", fontSize: 40, color: "#34d399", fontWeight: 700 }}>
            {`${holdPct}% of winners are still holding 💎`}
          </div>
        </Col>

        <Row justifyContent="space-between" alignItems="center">
          <Row gap={40} fontSize={28}>
            {stat("SLABS WON", String(stats.totalWon), "#e8eaf0")}
            {stat("HOLDING", String(stats.holding), "#34d399")}
            {stat("SOLD", String(stats.sold), "#fb7185")}
          </Row>
          <div style={{ display: "flex", fontSize: 22, color: "#8b91a3" }}>
            tracking @SlabDrop draws
          </div>
        </Row>
      </div>
    ),
    { ...size },
  );
}
