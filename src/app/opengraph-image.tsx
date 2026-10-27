import { ImageResponse } from "next/og";
import { site } from "@/content/site";

// The preview card shown when the site link is shared on social media / iMessage / Slack.
export const alt = `${site.name}: Your story. Our creative orbit.`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          background: "#050506",
          color: "#f6f2ef",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            right: -520,
            top: -40,
            width: 760,
            height: 760,
            borderRadius: 9999,
            background: "#050506",
            boxShadow: "0 0 0 2px #f6a6bd, 0 0 60px 6px #ea6a8e, 0 0 180px 30px rgba(234,106,142,0.45)",
          }}
        />
        <div style={{ display: "flex", fontSize: 26, letterSpacing: 8, color: "#8e8893" }}>LEILUNA STUDIO</div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 110, fontWeight: 800, lineHeight: 0.95, letterSpacing: -4, marginTop: 28 }}>
          <div style={{ display: "flex" }}>Your story.</div>
          <div style={{ display: "flex" }}>
            {"Our "}
            <span style={{ color: "#ea6a8e", marginLeft: 28 }}>creative orbit.</span>
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 30, marginTop: 36, color: "#f6f2ef", opacity: 0.8 }}>
          {site.pillars.join("  •  ")}
        </div>
      </div>
    ),
    size,
  );
}
