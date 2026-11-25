import Image from "next/image";
import { pieces } from "@/content/library";

// Vertical Library reels with a cover, for the wall behind the hero. Spec edits of other brands go last, so the
// studio's own and client-style work fills the first screen.
const reels = pieces
  .filter((p) => p.kind === "video" && p.format === "reel" && p.poster)
  .sort((a, b) => Number(!!a.sample) - Number(!!b.sample));

// A few tiles carry the piece's style as a tag, so the wall reads as real work rather than decoration.
const TAGGED = new Set([5, 10, 17, 30, 34]);
const COLS = 9;
const PER_COL = 6;
// how far each column starts shifted up, so the wall looks staggered (in % of one tile)
const OFFSETS = [10, 62, 30, 78, 4, 55, 22, 70, 40];

// The reel wall behind the hero: columns of real reel covers drifting slowly up and down (alternate columns in
// opposite directions), dimmed in the middle so the headline reads. Decorative only: hidden from screen readers and
// not clickable. Phones show five columns; reduced motion keeps it still.
export function HeroWall() {
  if (reels.length < 8) return null;
  return (
    // (Its own stacking context and layer, under the copy: on a phone's pinch-zoom the browser otherwise reshuffles the
    // moving columns and can flash a tile above the headline.)
    <div aria-hidden className="pointer-events-none absolute inset-0 isolate z-0 overflow-hidden">
      <div className="absolute -inset-x-6 -top-[10%] bottom-0 flex gap-2.5 sm:gap-3.5">
        {Array.from({ length: COLS }, (_, c) => {
          const tiles = Array.from({ length: PER_COL }, (_, r) => {
            const k = c * PER_COL + r;
            return { p: reels[k % reels.length], k };
          });
          return (
            <div
              key={c}
              className={`hero-wall-col flex min-w-0 flex-1 flex-col gap-2.5 sm:gap-3.5 ${c >= 5 ? "max-sm:hidden" : ""} ${c % 2 ? "hero-wall-down" : ""}`}
              style={{ marginTop: `calc(-${OFFSETS[c]}% * 0.35)`, animationDuration: `${70 + (c % 4) * 12}s` }}
            >
              {/* each column twice over, so the drift loops without a seam */}
              {[0, 1].map((copy) =>
                tiles.map(({ p, k }) => (
                  <div key={`${copy}-${k}`} className="relative aspect-[9/16] shrink-0 overflow-hidden rounded-xl sm:rounded-2xl">
                    <Image
                      src={p.poster!}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 11vw, 20vw"
                      className="object-cover"
                      loading={copy ? "lazy" : "eager"}
                    />
                    {TAGGED.has(k) && copy === 0 && (
                      <span className="absolute bottom-2.5 left-2.5 hidden items-center gap-1.5 rounded-full bg-ink/85 px-2.5 py-1.5 text-[11px] text-paper/85 lg:flex">
                        <span className="size-1.5 rounded-full bg-brand" />
                        {p.style.replace(" (sample edit)", "")}
                      </span>
                    )}
                  </div>
                )),
              )}
            </div>
          );
        })}
      </div>
      {/* dim the middle for the headline, and fade into the night at the top and bottom */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_46%_52%_at_50%_50%,rgb(5_5_6/0.96)_35%,rgb(5_5_6/0.62)_80%,rgb(5_5_6/0.42))] max-sm:bg-[radial-gradient(ellipse_90%_60%_at_50%_45%,rgb(5_5_6/0.95)_40%,rgb(5_5_6/0.7))]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgb(5_5_6/0.92),transparent_18%,transparent_68%,rgb(5_5_6)_98%)]" />
    </div>
  );
}
