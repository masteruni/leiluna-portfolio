import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { getProject, projects } from "@/content/projects";
import { ogFonts } from "../../og-fonts";

// The preview card shown when a case study is shared (WhatsApp, LinkedIn, iMessage, Slack…): the title, the
// client, the three headline numbers, and the cover in a phone frame, in the project's own colours.
export const alt = "Leiluna Studio case study";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const INK = "#050506";
const PAPER = "#f6f2ef";
const MUTED = "#8e8893";
const PINK = "#ea6a8e";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

// The cover for the card: a small JPEG copy kept in src/app/og-covers/<slug>.jpg (the image renderer can't read
// the site's WebP covers, and reading from public/ would pull every video into the server bundle). Null when a
// project has no copy yet; the card then simply leaves the frame out.
async function cover(slug: string) {
  try {
    const jpeg = await readFile(join(process.cwd(), "src/app/og-covers", `${slug}.jpg`));
    return `data:image/jpeg;base64,${jpeg.toString("base64")}`;
  } catch {
    return null;
  }
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) return new ImageResponse(<div style={{ width: "100%", height: "100%", display: "flex", background: INK }} />, size);
  const [a, b] = p.palette;
  const [img, fonts] = await Promise.all([cover(p.slug), ogFonts()]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background: `radial-gradient(60% 80% at 85% 20%, ${a}55, transparent 70%), radial-gradient(50% 70% at 0% 100%, ${b}66, transparent 70%), ${INK}`,
          color: PAPER,
          overflow: "hidden",
          fontFamily: "Outfit",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "64px 0 56px 80px", width: img ? 760 : 1100 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 20, letterSpacing: 6, color: MUTED }}>
            <div style={{ width: 44, height: 2, background: PINK }} />
            LEILUNA STUDIO · CASE STUDY
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", fontSize: 26, letterSpacing: 4, color: PINK }}>{p.client.toUpperCase()}</div>
            <div style={{ display: "flex", fontSize: 84, fontWeight: 800, lineHeight: 0.95, letterSpacing: -4, marginTop: 18 }}>{p.title}</div>
          </div>

          <div style={{ display: "flex", gap: 44, borderTop: `1px solid ${PAPER}26`, paddingTop: 26 }}>
            {p.metrics.slice(0, 3).map((m) => (
              <div key={m.label} style={{ display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", fontSize: 50, fontWeight: 800, letterSpacing: -2 }}>{m.value}</div>
                <div style={{ display: "flex", fontSize: 18, color: MUTED, marginTop: 4 }}>{m.label}</div>
              </div>
            ))}
          </div>
        </div>

        {img && (
          <div
            style={{
              position: "absolute",
              right: 80,
              top: 56,
              width: 300,
              height: 560,
              display: "flex",
              borderRadius: 36,
              overflow: "hidden",
              border: `2px solid ${PAPER}33`,
              boxShadow: `0 30px 80px ${INK}`,
              transform: "rotate(4deg)",
            }}
          >
            <img src={img} alt="" width={300} height={560} style={{ objectFit: "cover", objectPosition: "top" }} />
          </div>
        )}
      </div>
    ),
    { ...size, fonts },
  );
}
