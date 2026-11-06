"use client";

import { animate, motion, useMotionValue, useMotionValueEvent } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { markReady } from "@/lib/ready";
import { MoonPhase } from "./Eyebrow";

const KEY = "leiluna:intro";
const MIN_MS = 900; // long enough for the crescents to lock together
const IMAGES_MS = 800; // the most it waits for images once the fonts are in (the page is usable by then)
const MAX_MS = 4000; // whatever happens, the page shows by then
const REVEAL_S = 0.8;
const HOLE_PX = 10; // the opening's radius when it starts, hidden under the mark
// The dark sheet is a square 150vmax across (it covers any screen), with a small soft-edged opening in its middle.
// The eclipse grows the opening by scaling the whole sheet up from the centre: a transform the GPU handles on its
// own, so it stays smooth even while the page is still busy loading (redrawing a mask every frame would not).
const SHEET_MASK = `radial-gradient(circle at 50% 50%, transparent ${HOLE_PX}px, #000 ${HOLE_PX * 1.25}px)`;

// First visit per session: the two crescents of the mark lock together while a small moon waxes with the page's
// real loading (fonts, then images, though it won't wait long for those), and once it's full the dark lifts like an
// eclipse ending: a pink-rimmed
// opening grows from the mark until the page is uncovered. Any key or tap skips ahead. Returning visitors and
// reduced motion get the page straight away.
export function Loader() {
  const [show, setShow] = useState(true);
  const [lit, setLit] = useState(0.04); // the moon's phase, 0 (new) to 1 (full)
  const [revealing, setRevealing] = useState(false);
  const progress = useMotionValue(0.04);
  const sheet = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useMotionValueEvent(progress, "change", (v) => setLit(v));

  // Runs exactly once. (Settings are read here rather than through hooks in the dependency list, so a re-render
  // can never restart the intro or mark it as "seen" twice.)
  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem(KEY) === "1";
    } catch {}
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (seen || reduce) {
      const id = requestAnimationFrame(() => {
        setShow(false);
        markReady();
      });
      return () => cancelAnimationFrame(id);
    }

    const t0 = performance.now();
    const steps = { fonts: false, page: document.readyState === "complete" };
    let progressAnim = animate(progress, 0.12, { duration: 0.4 });
    let revealAnim: Animation | null = null;
    let minTimer = 0;

    const reveal = () => {
      if (started.current) return;
      started.current = true;
      // Marked as seen only once the intro has actually played, so a cancelled first run (React's development
      // double-mount, a quick back-navigation) doesn't count.
      try {
        sessionStorage.setItem(KEY, "1");
      } catch {}
      progressAnim.stop();
      progress.set(1);
      setRevealing(true);
      markReady(); // the hero starts its entrance as the dark lifts
      const el = sheet.current;
      if (!el) return setShow(false);
      // Large enough that the opening's soft edge has cleared the corners of the screen.
      const end = (Math.hypot(window.innerWidth, window.innerHeight) / 2 / HOLE_PX) * 1.15;
      el.style.maskImage = el.style.webkitMaskImage = SHEET_MASK;
      revealAnim = el.animate([{ transform: "scale(1)" }, { transform: `scale(${end})` }], {
        duration: REVEAL_S * 1000,
        easing: "cubic-bezier(0.65, 0, 0.35, 1)",
        fill: "forwards",
      });
      revealAnim.onfinish = () => setShow(false);
    };

    // The moon follows real work: each finished step fills more of it, and it's full when both are done.
    const advance = () => {
      const done = Number(steps.fonts) + Number(steps.page);
      progressAnim.stop();
      progressAnim = animate(progress, done === 2 ? 1 : 0.15 + done * 0.4, { duration: 0.5, ease: [0.16, 1, 0.3, 1] });
      if (done === 2) {
        const wait = Math.max(0, MIN_MS - (performance.now() - t0));
        minTimer = window.setTimeout(reveal, wait + 200); // a beat at full moon before it lifts
      }
    };
    let imagesCap = 0;
    document.fonts.ready.then(() => {
      steps.fonts = true;
      advance();
      // Below-the-fold media can keep the page "loading" for a while; don't hold the visitor for it.
      imagesCap = window.setTimeout(() => {
        if (steps.page) return;
        steps.page = true;
        advance();
      }, IMAGES_MS);
    });
    const onLoad = () => {
      steps.page = true;
      advance();
    };
    if (steps.page) advance();
    else window.addEventListener("load", onLoad, { once: true });

    const failsafe = window.setTimeout(reveal, MAX_MS);
    const skip = () => reveal();
    window.addEventListener("keydown", skip);
    window.addEventListener("pointerdown", skip);
    return () => {
      progressAnim.stop();
      revealAnim?.cancel();
      window.clearTimeout(minTimer);
      window.clearTimeout(imagesCap);
      window.clearTimeout(failsafe);
      window.removeEventListener("load", onLoad);
      window.removeEventListener("keydown", skip);
      window.removeEventListener("pointerdown", skip);
    };
  }, [progress]);

  if (!show) return null;

  return (
    <div data-loader aria-hidden className="night fixed inset-0 z-[100] overflow-hidden" style={{ background: "transparent" }}>
      <div
        ref={sheet}
        className="absolute left-[calc(50%-75vmax)] top-[calc(50%-75vmax)] size-[150vmax] bg-ink will-change-transform"
      />

      {/* the eclipse's edge: a pink glow that rides the opening outwards */}
      <motion.div
        className="pointer-events-none absolute left-1/2 top-1/2 aspect-square w-[16rem] -translate-x-1/2 -translate-y-1/2 rounded-full"
        initial={false}
        animate={revealing ? { scale: 9, opacity: 0 } : { scale: 1, opacity: 0.55 }}
        transition={{ duration: REVEAL_S, ease: [0.65, 0, 0.35, 1] }}
        style={{ boxShadow: "0 0 90px 18px var(--brand), inset 0 0 40px 4px var(--brand-2)" }}
      />

      {/* the mark: two crescents spin in and lock together */}
      <motion.div
        className="absolute left-1/2 top-1/2 size-28 -translate-x-1/2 -translate-y-1/2"
        animate={revealing ? { scale: 1.15, opacity: 0 } : { scale: 1, opacity: 1 }}
        transition={{ duration: REVEAL_S * 0.6, ease: [0.65, 0, 0.35, 1] }}
      >
        <motion.svg
          viewBox="0 0 100 100"
          className="absolute inset-0"
          initial={{ rotate: -200, x: -48, opacity: 0 }}
          animate={{ rotate: 0, x: 0, opacity: 1 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <defs>
            <mask id="cw">
              <rect width="100" height="100" fill="white" />
              <circle cx="55" cy="47" r="33" fill="black" />
            </mask>
          </defs>
          <circle cx="44" cy="44" r="38" fill="var(--paper)" mask="url(#cw)" />
        </motion.svg>
        <motion.svg
          viewBox="0 0 100 100"
          className="absolute inset-0"
          initial={{ rotate: 200, x: 48, opacity: 0 }}
          animate={{ rotate: 0, x: 0, opacity: 1 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.06 }}
        >
          <defs>
            <mask id="cp">
              <rect width="100" height="100" fill="white" />
              <circle cx="51" cy="56" r="27" fill="black" />
            </mask>
          </defs>
          <circle cx="60" cy="60" r="33" fill="var(--brand)" mask="url(#cp)" />
        </motion.svg>
      </motion.div>

      {/* the name, with a moon that waxes as the page actually loads */}
      <motion.div
        className="absolute inset-x-6 bottom-6 flex items-end justify-between gap-6 sm:inset-x-10 sm:bottom-10"
        animate={{ opacity: revealing ? 0 : 1 }}
        transition={{ duration: 0.3 }}
      >
        <span className="flex items-center gap-3 font-serif text-2xl italic text-paper sm:text-3xl">
          <MoonPhase lit={lit} className="size-[0.9em] text-paper/60" />
          Leiluna Studio
        </span>
        <span className="hidden font-serif text-lg italic text-muted sm:block">Your story. Our creative orbit.</span>
      </motion.div>
    </div>
  );
}
