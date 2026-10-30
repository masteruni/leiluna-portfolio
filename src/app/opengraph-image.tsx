import { ImageResponse } from "next/og";
import { site, stats } from "@/content/site";

// The preview card shown when the site link is shared on social media / iMessage / Slack.
export const alt = `${site.name}: Your story. Our creative orbit.`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const INK = "#050506";
const PAPER = "#f6f2ef";
const PINK = "#ea6a8e";
const PINK_2 = "#f6a6bd";

// A scatter of stars; fixed positions so the card is identical on every render.
const stars = [
  [60, 70, 3], [180, 40, 2], [310, 120, 2], [420, 60, 3], [560, 30, 2], [700, 90, 2], [820, 40, 3], [1120, 80, 2],
  [90, 520, 2], [250, 590, 3], [430, 560, 2], [660, 600, 2], [1040, 560, 3], [1150, 480, 2], [980, 150, 2], [1170, 300, 2],
  [540, 300, 2], [640, 420, 2], [40, 330, 2], [150, 240, 3], [370, 360, 2], [720, 240, 2],
];

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          // Flat ink around the mark: the crescents are built from stacked circles, so nothing may show through them.
          background: `radial-gradient(45% 70% at 12% 50%, rgba(234,106,142,0.16), transparent 70%), ${INK}`,
          color: PAPER,
          overflow: "hidden",
          fontFamily: "sans-serif",
        }}
      >
        {stars.map(([x, y, r], i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: r,
              height: r,
              borderRadius: 9999,
              background: i % 5 === 0 ? PINK_2 : PAPER,
              opacity: 0.35 + (i % 4) * 0.15,
            }}
          />
        ))}

        {/* The mark, same geometry as the intro loader (scaled x4): a white crescent and a pink crescent locking together */}
        <div style={{ position: "absolute", right: 110, top: 115, width: 400, height: 400, display: "flex" }}>
          <div style={{ position: "absolute", left: 24, top: 24, width: 304, height: 304, borderRadius: 9999, background: PAPER }} />
          <div style={{ position: "absolute", left: 88, top: 56, width: 264, height: 264, borderRadius: 9999, background: INK }} />
          <div
            style={{
              position: "absolute",
              left: 108,
              top: 108,
              width: 264,
              height: 264,
              borderRadius: 9999,
              background: PINK,
            }}
          />
          <div style={{ position: "absolute", left: 96, top: 116, width: 216, height: 216, borderRadius: 9999, background: INK }} />
        </div>

        {/* Copy */}
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 0 0 84px", width: 760 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 22, letterSpacing: 7, color: "#8e8893" }}>
            <div style={{ width: 44, height: 2, background: PINK }} />
            LEILUNA STUDIO
          </div>
          <div style={{ display: "flex", flexDirection: "column", fontSize: 108, fontWeight: 800, lineHeight: 0.95, letterSpacing: -5, marginTop: 30 }}>
            <div style={{ display: "flex" }}>Your story.</div>
            <div style={{ display: "flex" }}>Our creative</div>
            <div style={{ display: "flex", color: PINK, fontStyle: "italic", fontWeight: 400 }}>orbit.</div>
          </div>
          <div style={{ display: "flex", gap: 14, marginTop: 40, fontSize: 24, color: PAPER, opacity: 0.85 }}>
            {site.pillars.map((p, i) => (
              <div key={p} style={{ display: "flex", alignItems: "center", gap: 14 }}>
                {i > 0 && <div style={{ width: 6, height: 6, borderRadius: 9999, background: PINK }} />}
                {p}
              </div>
            ))}
          </div>
        </div>

        <div style={{ position: "absolute", left: 84, bottom: 44, display: "flex", fontSize: 18, letterSpacing: 5, color: "#8e8893" }}>
          LEILUNASTUDIO.COM
        </div>
        {/* One line of proof, so the shared card already makes the case */}
        <div style={{ position: "absolute", right: 84, bottom: 40, display: "flex", alignItems: "baseline", gap: 10, color: PAPER }}>
          <div style={{ display: "flex", fontSize: 30, fontWeight: 800, letterSpacing: -1 }}>
            {stats[0].value}
            {stats[0].suffix}
          </div>
          <div style={{ display: "flex", fontSize: 16, letterSpacing: 2, color: "#8e8893" }}>VIEWS ON CLIENT REELS</div>
        </div>
      </div>
    ),
    size,
  );
}
