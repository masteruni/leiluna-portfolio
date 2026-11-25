"use client";

import Image from "next/image";
import { Pause, Play } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { pieces, type Piece } from "@/content/library";
import { site } from "@/content/site";
import { openClip } from "@/lib/showreel";
import { track } from "@/lib/track";

const SLIDE_MS = 5200;

// Vertical Library reels with a silent preview, in the order picked in site.ts.
const reels = site.hero.reels
  .map((id) => pieces.find((p) => p.id === id))
  .filter((p): p is Piece => !!p && p.format === "reel" && !!p.preview && !!p.poster);

// Where each card sits in the fan: the front one is upright and full size, the two behind lean out to either side.
const slots = [
  { x: "0%", rotate: 0, scale: 1, z: 3, dim: 0 },
  { x: "38%", rotate: 7, scale: 0.86, z: 2, dim: 0.45 },
  { x: "-38%", rotate: -7, scale: 0.86, z: 1, dim: 0.45 },
];

// Three real reels fanned like cards in orbit. The front one plays; every few seconds the next reel comes forward.
// Tapping a card opens the full reel with sound. Hover (or the pause button) holds the rotation; reduced motion
// shows the front reel's still and doesn't rotate.
export function HeroReels({ play }: { play: boolean }) {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  const [held, setHeld] = useState(false);
  const [stopped, setStopped] = useState(false);
  const front = useRef<HTMLVideoElement>(null);
  const n = reels.length;

  useEffect(() => {
    if (!play || reduce || held || stopped || n < 2) return;
    const id = setTimeout(() => setI((v) => (v + 1) % n), SLIDE_MS);
    return () => clearTimeout(id);
  }, [i, play, reduce, held, stopped, n]);

  useEffect(() => {
    const v = front.current;
    if (!v) return;
    if (play && !reduce && !stopped) v.play().catch(() => {});
    else v.pause();
  }, [i, play, reduce, stopped]);

  if (n < 3) return null;
  const current = reels[i];

  return (
    <div className="relative mx-auto w-full max-w-[22rem] lg:max-w-[24rem]">
      <div
        className="relative mx-auto aspect-[9/16] w-[46%] sm:w-[52%] lg:w-[62%]"
        onMouseEnter={() => setHeld(true)}
        onMouseLeave={() => setHeld(false)}
      >
        {[0, 1, 2].map((k) => {
          const p = reels[(i + k) % n];
          const s = slots[k];
          const isFront = k === 0;
          return (
            <motion.button
              key={p.id}
              type="button"
              aria-label={isFront ? `Play ${p.style}: ${p.title}, with sound` : `${p.style}: ${p.title}`}
              tabIndex={isFront ? 0 : -1}
              onClick={() => {
                if (!isFront) return setI((i + k) % n);
                track("Library piece opened", { piece: p.id, kind: p.kind });
                openClip({ src: p.src ?? "", poster: p.poster, title: `${p.style}: ${p.title}`, vertical: true });
              }}
              className="absolute inset-0 overflow-hidden rounded-[1.4rem] bg-ink-2 shadow-[0_30px_80px_-20px_rgb(0_0_0/0.7)] ring-1 ring-paper/10"
              initial={false}
              animate={{ x: s.x, rotate: s.rotate, scale: s.scale, zIndex: s.z }}
              transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 140, damping: 22, mass: 0.9 }}
              style={{ transformOrigin: "50% 90%" }}
            >
              {isFront && !reduce ? (
                <video
                  ref={front}
                  key={p.id}
                  src={p.preview}
                  poster={p.poster}
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  disablePictureInPicture
                  className="absolute inset-0 size-full object-cover"
                />
              ) : (
                <Image src={p.poster!} alt="" fill sizes="(min-width: 1024px) 15rem, 40vw" className="object-cover" />
              )}
              <motion.span
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-ink"
                initial={false}
                animate={{ opacity: s.dim }}
                transition={{ duration: 0.4 }}
              />
              {isFront && (
                <span aria-hidden className="absolute right-2.5 top-2.5 grid size-8 place-items-center rounded-full bg-paper text-ink">
                  <span className="ml-0.5 border-y-[5px] border-l-[8px] border-y-transparent border-l-current" />
                </span>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* what's playing, and the controls */}
      <div className="mt-5 flex items-center justify-center gap-3 sm:mt-6">
        <div className="min-w-0 text-center" aria-live="polite">
          <p className="truncate text-sm font-medium">{current.style}</p>
          <p className="truncate text-xs text-paper/60">{current.title}</p>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-center gap-3">
        <div className="flex gap-1.5" role="group" aria-label="Choose a reel">
          {reels.map((p, k) => (
            <button
              key={p.id}
              type="button"
              aria-label={`Show ${p.style}`}
              aria-pressed={k === i}
              onClick={() => setI(k)}
              className="grid size-5 place-items-center"
            >
              <span className={`block h-1.5 rounded-full transition-all duration-300 ${k === i ? "w-5 bg-brand" : "w-1.5 bg-paper/30"}`} />
            </button>
          ))}
        </div>
        {!reduce && (
          <button
            type="button"
            onClick={() => setStopped((v) => !v)}
            aria-label={stopped ? "Play the reels" : "Pause the reels"}
            className="grid size-8 place-items-center rounded-full text-paper/70 ring-1 ring-line transition-colors hover:text-paper hover:ring-paper/50"
          >
            {stopped ? <Play className="size-3.5" /> : <Pause className="size-3.5" />}
          </button>
        )}
      </div>
    </div>
  );
}
