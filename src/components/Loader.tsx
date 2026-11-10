"use client";

import { animate, motion, useMotionValue, useMotionValueEvent } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { site } from "@/content/site";
import { markReady } from "@/lib/ready";
import { Crescent } from "./Crescent";
import { MoonPhase } from "./MoonPhase";
import { LineReveal } from "./LineReveal";

const KEY = "leiluna:intro";
const MIN_MS = 1500; // long enough for the crescents to lock together and the slogan to be read
const WAX_S = 1.1; // the last stretch to full weight: slow enough to watch, even when the page was ready at once
const IMAGES_MS = 800; // the most it waits for images once the fonts are in (the page is usable by then)
const MAX_MS = 4000; // whatever happens, the page shows by then
const REVEAL_S = 0.8;
const HOLE_PX = 10; // the opening's radius when it starts, hidden under the mark
// The dark sheet is a square 150vmax across (it covers any screen), with a small soft-edged opening in its middle.
// The eclipse grows the opening by scaling the whole sheet up from the centre: a transform the GPU handles on its
// own, so it stays smooth even while the page is still busy loading (redrawing a mask every frame would not).
const SHEET_MASK = `radial-gradient(circle at 50% 50%, transparent ${HOLE_PX}px, #000 ${HOLE_PX * 1.25}px)`;

// First visit per session: the two crescents of the mark lock together while the slogan waxes like a moon, its
// letters growing from a hairline to full weight with the page's real loading (fonts, then images, though it won't
// wait long for those). A small moon beside the studio's name fills in step. Once it's full the dark lifts like an
// eclipse ending: a pink-rimmed opening grows from the mark until the page is uncovered. Any key or tap skips
// ahead. Returning visitors and reduced motion get the page straight away.
export function Loader() {
  const [show, setShow] = useState(true);
  const [lit, setLit] = useState(0.04); // the moon's phase, 0 (new) to 1 (full)
  const [revealing, setRevealing] = useState(false);
  // The slogan waits for the real typeface: its weight is the animation, and a fallback font can't do it.
  const [typeIn, setTypeIn] = useState(false);
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
      progressAnim =
        done === 2
          ? animate(progress, 1, { duration: WAX_S, ease: [0.45, 0, 0.2, 1] })
          : animate(progress, 0.15 + done * 0.3, { duration: 0.6, ease: [0.16, 1, 0.3, 1] });
      if (done === 2) {
        const wait = Math.max(WAX_S * 1000, MIN_MS - (performance.now() - t0));
        window.clearTimeout(minTimer);
        minTimer = window.setTimeout(reveal, wait + 250); // a beat at full moon before it lifts
      }
    };
    let imagesCap = 0;
    document.fonts.ready.then(() => {
      steps.fonts = true;
      setTypeIn(true);
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
        className="absolute left-1/2 top-1/2 size-28 -translate-x-1/2 -translate-y-1/2 sm:size-36"
        animate={revealing ? { scale: 1.15, opacity: 0 } : { scale: 1, opacity: 1 }}
        transition={{ duration: REVEAL_S * 0.6, ease: [0.65, 0, 0.35, 1] }}
      >
        <Crescent
          tone="paper"
          className="absolute inset-0"
          initial={{ rotate: -200, x: -48, opacity: 0 }}
          animate={{ rotate: 0, x: 0, opacity: 1 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        />
        <Crescent
          tone="brand"
          className="absolute inset-0"
          initial={{ rotate: 200, x: 48, opacity: 0 }}
          animate={{ rotate: 0, x: 0, opacity: 1 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.06 }}
        />
      </motion.div>

      <motion.div
        className="absolute inset-x-6 bottom-7 flex items-end justify-between gap-6 sm:inset-x-10 sm:bottom-10"
        animate={revealing ? { opacity: 0, y: -12 } : { opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 1, 1] }}
      >
        {/* The slogan, waxing: each line rises in as a hairline and the letters fill out to full weight as the page
            loads. (Outfit is a variable font, so the weight moves smoothly.) */}
        <p
          className="font-display text-[clamp(2.4rem,7.2vw,6.5rem)] leading-[0.94] tracking-[-0.04em] text-paper"
          style={{ fontWeight: Math.round(100 + 700 * lit) }}
        >
          <LineReveal
            play={typeIn}
            stagger={0.1}
            lines={[site.headline[0], site.headline.slice(1).join(" ")]}
          />
        </p>
        {/* the name, with a moon that fills in step */}
        <span className="hidden shrink-0 items-center gap-3 pb-2 text-lg text-paper/80 md:flex">
          <MoonPhase lit={lit} className="size-[0.9em] text-paper/60" />
          {site.name}
        </span>
      </motion.div>
    </div>
  );
}
