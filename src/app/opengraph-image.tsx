import { ImageResponse } from "next/og";
import { site } from "@/content/site";

// The preview card shown when the site link is shared on social media / iMessage / Slack.
export const alt = `${site.name}: ${site.roles.join(", ")}`;
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
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "radial-gradient(circle at 85% 20%, #7b5cff, transparent 45%), radial-gradient(circle at 10% 100%, #ff3d7f, transparent 45%), #0c0b10",
          color: "#f4efe6",
        }}
      >
        <div style={{ display: "flex", fontSize: 28, color: "#c6ff3d" }}>{site.roles.join("  /  ")}</div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 180, fontWeight: 800, letterSpacing: -8, lineHeight: 0.9 }}>{`${site.name}.`}</div>
          <div style={{ fontSize: 40, marginTop: 24, opacity: 0.85 }}>{site.tagline}</div>
        </div>
      </div>
    ),
    size,
  );
}
