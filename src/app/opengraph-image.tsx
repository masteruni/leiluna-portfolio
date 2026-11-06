import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { site, stats } from "@/content/site";
import { ogFonts } from "./og-fonts";

// The preview card shown when the site link is shared (WhatsApp, LinkedIn, iMessage, Slack…). It leads with what the
// studio does, in the site's own headline, and shows real work: three reel stills from the Library, fanned like
// phones. Kept to a few large elements so it still reads at thumbnail size, and the middle of the card (which
// WhatsApp and some apps crop to a square) holds the headline and a reel.
export const alt = `${site.name}: social media that people stop for.`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const INK = "#050506";
const PAPER = "#f6f2ef";
const MUTED = "#8e8893";
const PINK = "#ea6a8e";

// Small JPEG copies of Library posters (the image renderer can't read WebP): src/app/og-home/*.jpg
const reels = [
  { file: "muse-beauty-edit.jpg", rotate: -9, x: 0, y: 46 },
  { file: "kabogera-ad.jpg", rotate: 7, x: 236, y: 70 },
  { file: "ramen-ad.jpg", rotate: -1, x: 112, y: 6 },
];

async function still(file: string) {
  const jpeg = await readFile(join(process.cwd(), "src/app/og-home", file));
  return `data:image/jpeg;base64,${jpeg.toString("base64")}`;
}

export default async function OpengraphImage() {
  const [fonts, ...images] = await Promise.all([ogFonts(), ...reels.map((r) => still(r.file))]);
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background: `radial-gradient(55% 80% at 82% 45%, rgba(234,106,142,0.22), transparent 70%), ${INK}`,
          color: PAPER,
          overflow: "hidden",
          fontFamily: "Outfit",
        }}
      >
        {/* Copy */}
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "64px 0 56px 76px", width: 700 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            {/* the mark: a white and a pink crescent (same geometry as the site, scaled) */}
            <div style={{ position: "relative", width: 44, height: 44, display: "flex" }}>
              <div style={{ position: "absolute", left: 3, top: 3, width: 33, height: 33, borderRadius: 9999, background: PAPER }} />
              <div style={{ position: "absolute", left: 10, top: 6, width: 29, height: 29, borderRadius: 9999, background: INK }} />
              <div style={{ position: "absolute", left: 12, top: 12, width: 29, height: 29, borderRadius: 9999, background: PINK }} />
              <div style={{ position: "absolute", left: 11, top: 13, width: 24, height: 24, borderRadius: 9999, background: INK }} />
            </div>
            <div style={{ display: "flex", fontSize: 30, fontWeight: 800, letterSpacing: -1 }}>leiluna</div>
            <div style={{ display: "flex", fontSize: 15, letterSpacing: 6, color: MUTED, marginTop: 4 }}>STUDIO</div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", fontSize: 92, fontWeight: 800, lineHeight: 0.98, letterSpacing: -4 }}>
            <div style={{ display: "flex" }}>Social media</div>
            <div style={{ display: "flex" }}>that people</div>
            <div style={{ display: "flex", fontFamily: "Instrument Serif", fontStyle: "italic", fontWeight: 400, fontSize: 112, letterSpacing: -2, color: PINK, marginTop: 4 }}>
              stop for.
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "baseline", gap: 14 }}>
            <div style={{ display: "flex", fontSize: 40, fontWeight: 800, letterSpacing: -1.5 }}>
              {stats[0].value}
              {stats[0].suffix}
            </div>
            <div style={{ display: "flex", fontSize: 24, color: MUTED }}>views on client reels</div>
          </div>
        </div>

        {/* Real work, fanned like phones */}
        <div style={{ position: "absolute", right: 70, top: 64, width: 450, height: 520, display: "flex" }}>
          {reels.map((r, i) => (
            <div
              key={r.file}
              style={{
                position: "absolute",
                left: r.x,
                top: r.y,
                width: 214,
                height: 380,
                display: "flex",
                borderRadius: 30,
                overflow: "hidden",
                border: `3px solid rgba(246,242,239,0.18)`,
                boxShadow: "0 30px 70px rgba(0,0,0,0.75)",
                transform: `rotate(${r.rotate}deg)`,
              }}
            >
              <img src={images[i]} alt="" width={214} height={380} style={{ objectFit: "cover" }} />
            </div>
          ))}
        </div>

        <div style={{ position: "absolute", right: 76, bottom: 44, display: "flex", fontSize: 20, letterSpacing: 4, color: MUTED }}>
          LEILUNASTUDIO.COM
        </div>
      </div>
    ),
    { ...size, fonts },
  );
}
