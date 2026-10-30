"use client";

import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useLenis } from "lenis/react";
import { useEffect, useRef } from "react";
import { useFocusTrap } from "@/lib/focus";
import { closeShowreel, openShowreel, useShowreel } from "@/lib/showreel";

export const showreel = {
  // Cut from real client work in the Library, ending on the logo reveal.
  src: "/library/showreel-2026.mp4",
  preview: "/library/showreel-2026-preview.mp4",
  poster: "/library/showreel-2026-poster.webp",
  duration: "0:16",
};

const protect = {
  controlsList: "nodownload noplaybackrate noremoteplayback",
  disablePictureInPicture: true,
  disableRemotePlayback: true,
} as const;

// Full-screen player with sound. Opened from the hero button or the showreel section.
export function ShowreelPlayer() {
  const open = useShowreel();
  const lenis = useLenis();
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialog = useRef<HTMLDivElement>(null);
  useFocusTrap(dialog, open);

  useEffect(() => {
    if (!open) return;
    lenis?.stop();
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeShowreel();
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      lenis?.start();
    };
  }, [open, lenis]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={dialog}
          role="dialog"
          aria-modal="true"
          aria-label="Leiluna Studio showreel"
          className="fixed inset-0 z-[95] grid place-items-center bg-ink/95 p-4 backdrop-blur-xl sm:p-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.3 } }}
          onClick={closeShowreel}
        >
          <motion.div
            className="relative aspect-video w-full max-w-6xl overflow-hidden rounded-2xl bg-black shadow-[0_40px_120px_-20px_rgb(234_106_142/0.35)]"
            initial={{ scale: 0.92, y: 30 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.96, opacity: 0, transition: { duration: 0.25 } }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <video {...protect} src={showreel.src} poster={showreel.poster} autoPlay controls playsInline className="size-full object-contain" />
          </motion.div>
          <button
            ref={closeRef}
            type="button"
            onClick={closeShowreel}
            className="absolute right-5 top-5 rounded-full bg-paper px-5 py-2.5 text-sm font-medium text-ink sm:right-10 sm:top-6"
          >
            Close ✕
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// A cinematic interlude: the reel starts as a framed card and grows to fill the screen as you scroll.
export function ShowreelSection() {
  const ref = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const scale = useTransform(scrollYProgress, [0, 0.75], reduce ? [1, 1] : [0.42, 1]);
  const radius = useTransform(scrollYProgress, [0, 0.75], reduce ? [0, 0] : [48, 0]);
  const shade = useTransform(scrollYProgress, [0.45, 0.85], [0, 1]);
  const captionY = useTransform(scrollYProgress, [0.5, 0.9], reduce ? ["0%", "0%"] : ["40%", "0%"]);

  useEffect(() => {
    const v = video.current;
    if (!v) return;
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? v.play().catch(() => {}) : v.pause()), { threshold: 0.1 });
    io.observe(v);
    return () => io.disconnect();
  }, []);

  return (
    <section ref={ref} aria-label="Showreel" className="relative h-[220vh]">
      <div className="sticky top-0 grid h-svh place-items-center overflow-hidden">
        <motion.div style={{ scale, borderRadius: radius }} className="relative size-full overflow-hidden will-change-transform">
          <video
            {...protect}
            ref={video}
            src={showreel.preview}
            poster={showreel.poster}
            muted
            loop
            playsInline
            preload="none"
            className="absolute inset-0 size-full bg-ink object-contain md:object-cover"
          />
          <motion.div style={{ opacity: shade }} className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" />
          <motion.div
            style={{ opacity: shade, y: captionY }}
            className="absolute inset-x-5 bottom-10 flex flex-col gap-6 sm:inset-x-10 md:flex-row md:items-end md:justify-between"
          >
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-paper/70">Showreel 2026 · {showreel.duration} · cut from client work</p>
              <p className="mt-3 font-display text-[clamp(2.6rem,7vw,7rem)] font-bold leading-[0.88] tracking-[-0.045em]">
                See us <span className="serif font-normal text-brand">in motion.</span>
              </p>
            </div>
            <button
              type="button"
              onClick={openShowreel}
              data-cursor="Play"
              className="group flex items-center gap-4 self-start rounded-full bg-paper py-2 pl-2 pr-6 font-medium text-ink transition-colors hover:bg-brand md:self-auto"
            >
              <span className="grid size-12 place-items-center rounded-full bg-ink text-paper transition-transform duration-500 group-hover:scale-110">
                <span className="ml-1 border-y-[7px] border-l-[11px] border-y-transparent border-l-paper" />
              </span>
              Play with sound
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
