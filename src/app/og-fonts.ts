import { readFile } from "node:fs/promises";
import { join } from "node:path";

// Outfit, the site's typeface, for the generated share images (ImageResponse can't use next/font).
// Static files: the image renderer doesn't read variable fonts.
export async function ogFonts() {
  const dir = join(process.cwd(), "src/app/fonts");
  const [regular, bold, serif] = await Promise.all([
    readFile(join(dir, "Outfit-Regular.ttf")),
    readFile(join(dir, "Outfit-ExtraBold.ttf")),
    readFile(join(dir, "InstrumentSerif-Italic.ttf")), // the italic accent word, as on the site (OFL, Google Fonts)
  ]);
  return [
    { name: "Outfit", data: regular, weight: 400 as const, style: "normal" as const },
    { name: "Outfit", data: bold, weight: 800 as const, style: "normal" as const },
    { name: "Instrument Serif", data: serif, weight: 400 as const, style: "italic" as const },
  ];
}
