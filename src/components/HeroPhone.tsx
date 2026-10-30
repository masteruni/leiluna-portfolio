"use client";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { industriesOf, pieces, type Piece } from "@/content/library";
import { heroProof, site } from "@/content/site";

const SLIDE_MS = 6000;
const reels = site.hero.reels
  .map((id) => pieces.find((p) => p.id === id))
  .filter((p): p is Piece => !!p && !!p.preview);

const protect = {
  controlsList: "nodownload noplaybackrate noremoteplayback",
  disablePictureInPicture: true,
  disableRemotePlayback: true,
} as const;

// A phone playing real Library reels one after another, like stories: tap to skip, hover to pause.
export function HeroPhone({ play }: { play: boolean }) {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const [proof, setProof] = useState(0);
  const video = useRef<HTMLVideoElement>(null);
  const reel = reels[i];
  const running = play && !paused && !reduce;

  // advance the reel
  useEffect(() => {
    if (!running) return;
    const id = setTimeout(() => setI((n) => (n + 1) % reels.length), SLIDE_MS);
    return () => clearTimeout(id);
  }, [i, running]);

  // rotate the proof card
  useEffect(() => {
    if (!play || reduce) return;
    const id = setInterval(() => setProof((n) => (n + 1) % heroProof.length), 3800);
    return () => clearInterval(id);
  }, [play, reduce]);

  useEffect(() => {
    const v = video.current;
    if (!v) return;
    if (running) v.play().catch(() => {});
    else v.pause();
  }, [running, i]);

  if (!reel) return null;
  const p = heroProof[proof];

  return (
    <div className="relative mx-auto w-[min(62vw,17rem)] sm:w-[18rem] xl:w-[19.5rem]">
      {/* glow behind the phone */}
      <div aria-hidden className="absolute -inset-10 rounded-full bg-brand/25 blur-3xl" />

      <div
        data-ui
        className="relative aspect-[9/19.5] overflow-hidden rounded-[2.6rem] border border-paper/15 bg-ink p-2 shadow-[0_50px_120px_-30px_rgb(0_0_0/0.9)]"
        onPointerEnter={(e) => e.pointerType === "mouse" && setPaused(true)}
        onPointerLeave={(e) => e.pointerType === "mouse" && setPaused(false)}
      >
        <button
          type="button"
          onClick={() => setI((n) => (n + 1) % reels.length)}
          aria-label={`Next reel. Now showing ${reel.style}, ${industriesOf(reel).join(", ")}`}
          data-cursor="Next"
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

          {/* story progress */}
          <div className="absolute inset-x-3 top-9 flex gap-1">
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
          </div>

          {/* account row */}
          <div className="absolute inset-x-3 top-12 flex items-center gap-2 pt-1">
            <span className="grid size-7 place-items-center rounded-full bg-ink/70 ring-1 ring-brand">
              <Image src="/brand/mark.png" alt="" width={18} height={19} className="h-4 w-auto" />
            </span>
            <span className="text-[13px] font-medium text-paper drop-shadow">Leiluna Studio</span>
          </div>

          {/* caption */}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink via-ink/60 to-transparent p-4 pt-16">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={reel.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.4 }}
              >
                <p className="font-display text-base font-semibold leading-tight">{reel.style}</p>
                <p className="mt-1 text-[13px] text-paper/60">
                  {industriesOf(reel).length > 2 ? "Multi-industry" : industriesOf(reel).join(" · ")} · {reel.duration}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </button>

        {/* notch */}
        <span aria-hidden className="absolute left-1/2 top-4 h-5 w-20 -translate-x-1/2 rounded-full bg-ink" />
      </div>

      {/* real result, rotating */}
      <div className="absolute -left-10 bottom-16 hidden w-48 sm:block xl:-left-24" aria-live="polite">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={p.value}
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-2xl bg-ink/75 px-4 py-3.5 shadow-[0_20px_60px_-20px_rgb(0_0_0/0.9)] backdrop-blur-md"
          >
            <p className="font-display text-3xl font-semibold tracking-[-0.04em]">
              {p.value}
              <span className="ml-1.5 inline-block size-2 rounded-full bg-brand align-middle" />
            </p>
            <p className="mt-1 text-[13px] text-paper/75">{p.label}</p>
            <p className="mt-1.5 text-[13px] text-muted">{p.source}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      {site.available && (
        <span className="absolute -right-4 top-20 hidden items-center gap-2 rounded-full bg-ink/75 px-3 py-1.5 text-[13px] text-paper/80 backdrop-blur-md sm:flex xl:-right-10">
          <span className="pulse relative size-1.5 rounded-full bg-brand" />
          Open for projects
        </span>
      )}
    </div>
  );
}
