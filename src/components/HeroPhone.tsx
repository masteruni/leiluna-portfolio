"use client";

import Image from "next/image";
import { Pause, Play } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useId, useRef, useState } from "react";
import { industries, industriesOf, pieces, type Industry, type Piece } from "@/content/library";
import { founders, site } from "@/content/site";
import { track } from "@/lib/track";
import { Chip } from "./ui/Chip";

const SLIDE_MS = 6000;
const MAX_PER_INDUSTRY = 5;

// Only vertical reels with a silent preview clip fit the phone.
const playable = (p: Piece | undefined): p is Piece => !!p && p.format === "reel" && !!p.preview;

// "All": the hand-picked mix from site.ts.
const mix = site.hero.reels.map((id) => pieces.find((p) => p.id === id)).filter(playable);

// One industry: its reels from the Library. Pieces made for that industry alone come first, then ones it shares
// with another industry, then sample edits; within each, the hand-picked ones lead.
const rank = (p: Piece) => (p.sample ? 2 : industriesOf(p).length > 1 ? 1 : 0) * 2 + (mix.includes(p) ? 0 : 1);
const reelsFor = (ind: Industry) =>
  pieces
    .filter((p) => playable(p) && industriesOf(p).includes(ind) && industriesOf(p).length < industries.length)
    .sort((a, b) => rank(a) - rank(b))
    .slice(0, MAX_PER_INDUSTRY);

const picks = site.hero.industries
  .filter((name): name is Industry => (industries as readonly string[]).includes(name))
  .map((name) => ({ name, short: name.split(" & ")[0], reels: reelsFor(name) }))
  .filter((p) => p.reels.length);

// Who made a piece: the founders named in its `by` (library.ts), or both of them.
const makersOf = (p: Piece) => {
  const named = founders.filter((f) => f.photo && p.by?.includes(f.name));
  return named.length ? named : founders.filter((f) => f.photo);
};
const and = (names: string[]) => (names.length > 1 ? `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}` : names[0]);

const protect = {
  controlsList: "nodownload noplaybackrate noremoteplayback",
  disablePictureInPicture: true,
  disableRemotePlayback: true,
} as const;

// A phone playing real Library reels one after another, like stories: tap to skip, hover to pause, and a
// pause button so touch and keyboard users can stop it too (it moves on its own for more than five seconds).
// Above it a visitor picks their industry and the phone plays the reels made for it; each reel names the
// founders who made it.
export function HeroPhone({ play }: { play: boolean }) {
  const reduce = useReducedMotion();
  const label = useId();
  const [industry, setIndustry] = useState<"All" | Industry>("All");
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false); // mouse over the phone
  const [stopped, setStopped] = useState(false); // the pause button
  const video = useRef<HTMLVideoElement>(null);
  const reels = picks.find((p) => p.name === industry)?.reels ?? mix;
  const reel = reels[i % reels.length];
  const running = play && !paused && !stopped && !reduce;

  // advance the reel (a single reel just loops)
  useEffect(() => {
    if (!running || reels.length < 2) return;
    const id = setTimeout(() => setI((n) => (n + 1) % reels.length), SLIDE_MS);
    return () => clearTimeout(id);
  }, [i, running, reels]);

  useEffect(() => {
    const v = video.current;
    if (!v) return;
    if (running) v.play().catch(() => {});
    else v.pause();
  }, [running, reel]);

  if (!reel) return null;
  const makers = makersOf(reel);

  const pick = (next: "All" | Industry) => {
    if (next === industry) return;
    track("Hero industry picked", { industry: next });
    setIndustry(next);
    setI(0);
    setStopped(false); // they asked to see something: play it
  };

  return (
    <div className="flex flex-col items-center">
      {picks.length > 1 && (
        // On its own dark panel: the planet's bright rim passes behind it on most screens.
        <div
          role="group"
          aria-labelledby={label}
          className="relative z-10 mb-4 w-full max-w-[23rem] rounded-3xl border border-line bg-ink/75 p-2.5 text-center backdrop-blur-md lg:mb-3.5 short:lg:mb-2"
        >
          <p id={label} className="text-[13px] text-paper/80">
            Pick your industry
          </p>
          <div className="mt-2 flex flex-wrap justify-center gap-1.5">
            {[{ name: "All" as const, short: "All" }, ...picks].map((p) => (
              <Chip key={p.name} size="sm" selected={industry === p.name} onClick={() => pick(p.name)}>
                {p.short}
              </Chip>
            ))}
          </div>
        </div>
      )}

      {/* On desktop the phone's size follows the screen's height (it's 19.5:9), so with the industries above it, it
          never pushes the hero past the fold. */}
      <div className="relative w-[min(62vw,17rem)] sm:w-[18rem] lg:w-[clamp(13rem,calc((100svh-20.5rem)*0.4615),18rem)] xl:w-[clamp(13rem,calc((100svh-20.5rem)*0.4615),19.5rem)]">
        {/* glow behind the phone */}
        <div aria-hidden className="absolute -inset-10 rounded-full bg-brand/25 blur-3xl" />

        <div
          className="relative aspect-[9/19.5] overflow-hidden rounded-[2.6rem] border border-paper/15 bg-ink p-2 shadow-[0_50px_120px_-30px_rgb(0_0_0/0.9)]"
          onPointerEnter={(e) => e.pointerType === "mouse" && setPaused(true)}
          onPointerLeave={(e) => e.pointerType === "mouse" && setPaused(false)}
        >
          <button
            type="button"
            onClick={() => setI((n) => (n + 1) % reels.length)}
            aria-label={`${reels.length > 1 ? "Next reel. " : ""}Now showing ${reel.style}, ${industriesOf(reel).join(", ")}${makers.length ? `, made by ${and(makers.map((f) => f.name))}` : ""}`}
            className="relative block size-full overflow-hidden rounded-[2.1rem] bg-ink-2 text-left"
          >
            <AnimatePresence initial={false}>
              <motion.video
                key={reel.id}
                {...protect}
                ref={video}
                src={reel.preview}
                poster={reel.poster}
                muted
                playsInline
                loop
                autoPlay={running}
                preload="metadata"
                className="absolute inset-0 size-full object-cover"
                initial={{ opacity: 0, scale: 1.06 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              />
            </AnimatePresence>

            {/* keeps the white text at the top readable over a bright frame */}
            <span aria-hidden className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-ink/70 to-transparent" />

            {/* story progress */}
            <span className="absolute inset-x-3 top-9 flex gap-1">
              {reels.map((r, n) => (
                <span key={r.id} className="h-0.5 flex-1 overflow-hidden rounded-full bg-paper/30">
                  {n < i && <span className="block h-full bg-paper" />}
                  {n === i && (
                    <motion.span
                      key={`${r.id}-${i}`}
                      className="block h-full origin-left bg-paper"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: running ? 1 : 0.15 }}
                      transition={{ duration: running ? SLIDE_MS / 1000 : 0, ease: "linear" }}
                    />
                  )}
                </span>
              ))}
            </span>

            {/* who made it: the founders' faces and names, where a story names its account */}
            <span className="absolute inset-x-3 top-12 flex items-center gap-2 pr-10 pt-1">
              <span className="flex shrink-0 -space-x-2">
                {makers.map((f) => (
                  <span key={f.name} className="relative block size-7 overflow-hidden rounded-full bg-brand-3 ring-1 ring-brand">
                    <Image
                      src={f.photo!}
                      alt=""
                      width={112}
                      height={168}
                      sizes={`${Math.round(28 * f.face.zoom)}px`}
                      className="absolute left-1/2 top-1/2 h-auto max-w-none"
                      style={{ width: `${f.face.zoom * 100}%`, translate: `${-f.face.x * 100}% ${-f.face.y * 100}%` }}
                    />
                  </span>
                ))}
              </span>
              <span className="min-w-0 leading-tight drop-shadow">
                {makers.length ? (
                  <>
                    <span className="block text-[11px] text-paper/75">Made by</span>
                    <span className="block truncate text-xs font-medium text-paper">{and(makers.map((f) => f.name))}</span>
                  </>
                ) : (
                  <span className="block truncate text-xs font-medium text-paper">{site.name}</span>
                )}
              </span>
            </span>

            {/* caption */}
            <span className="absolute inset-x-0 bottom-0 block bg-gradient-to-t from-ink via-ink/60 to-transparent p-4 pt-16">
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={reel.id}
                  className="block"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6, transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] } }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                >
                  <span className="block font-display text-base font-semibold leading-tight">{reel.style}</span>
                  <span className="mt-1 block text-[11px] text-paper/60">
                    {industriesOf(reel).length > 2 ? "Multi-industry" : industriesOf(reel).join(", ")}, {reel.duration}
                  </span>
                </motion.span>
              </AnimatePresence>
            </span>
          </button>

          {/* pause / play: a sibling of the reel button, since buttons can't nest. With reduced motion nothing
              moves, so it's hidden in CSS rather than left out, which keeps server and browser markup the same. */}
          <button
            type="button"
            onClick={() => setStopped((s) => !s)}
            aria-label={stopped ? "Play reels" : "Pause reels"}
            aria-pressed={stopped}
            className="absolute right-4 top-[3.25rem] z-10 grid size-8 place-items-center rounded-full bg-ink/60 text-paper backdrop-blur-md press hover:bg-ink/80 pointer-coarse:size-11 motion-reduce:hidden"
          >
            {stopped ? <Play aria-hidden className="ml-0.5 size-3.5" /> : <Pause aria-hidden className="size-3.5" />}
          </button>

          {/* notch */}
          <span aria-hidden className="absolute left-1/2 top-4 h-5 w-20 -translate-x-1/2 rounded-full bg-ink" />
        </div>

        {/* Clipped onto the phone's bottom edge, over the bezel: anywhere on the screen itself it would sit on top of
            a reel's own headline, and those land in a different place in every reel. */}
        {site.available && (
          <span className="absolute -bottom-3.5 left-1/2 hidden -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full border border-line bg-ink px-3 py-1.5 text-[11px] text-paper/80 sm:flex">
            <span className="pulse relative size-1.5 rounded-full bg-brand" />
            Open for projects
          </span>
        )}
      </div>
    </div>
  );
}
