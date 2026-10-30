"use client";

import { AnimatePresence, animate, motion } from "motion/react";
import { useEffect, useState } from "react";
import { markReady } from "@/lib/ready";

const KEY = "leiluna:intro";

// First visit per session: the two crescents spin in, lock into the mark, then the curtain lifts.
export function Loader() {
  const [show, setShow] = useState(true);
  const [count, setCount] = useState(0);

  // Runs exactly once. (Reading the reduced-motion setting here, rather than through a hook in the
  // dependency list, means a re-render can never restart the counter or mark the intro as "seen" twice.)
  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem(KEY) === "1";
    } catch {}
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Returning visitors (and reduced motion) skip straight to the curtain lift.
    const skip = seen || reduce;
    const done = () => {
      // Marked as seen only once the intro has actually played, so a cancelled first run (React's
      // development double-mount, a quick back-navigation) doesn't count.
      try {
        sessionStorage.setItem(KEY, "1");
      } catch {}
      setShow(false);
    };
    const counter = animate(skip ? 100 : 0, 100, {
      duration: skip ? 0 : 1.9,
      ease: [0.65, 0, 0.35, 1],
      onUpdate: (v) => setCount(Math.round(v)),
      onComplete: done,
    });
    // Belt and braces: whatever happens, the curtain lifts within four seconds.
    const failsafe = window.setTimeout(done, 4000);
    return () => {
      counter.stop();
      window.clearTimeout(failsafe);
    };
  }, []);

  return (
    <AnimatePresence onExitComplete={markReady}>
      {show && (
        <motion.div
          key="loader"
          data-loader
          className="fixed inset-0 z-[100] flex items-center justify-center bg-ink"
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
          style={{ clipPath: "inset(0 0 0% 0)" }}
        >
          <div className="relative size-28">
            {/* white crescent */}
            <motion.svg
              viewBox="0 0 100 100"
              className="absolute inset-0"
              initial={{ rotate: -220, x: -60, opacity: 0 }}
              animate={{ rotate: 0, x: 0, opacity: 1 }}
              transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <defs>
                <mask id="cw">
                  <rect width="100" height="100" fill="white" />
                  <circle cx="55" cy="47" r="33" fill="black" />
                </mask>
              </defs>
              <circle cx="44" cy="44" r="38" fill="var(--paper)" mask="url(#cw)" />
            </motion.svg>
            {/* pink crescent */}
            <motion.svg
              viewBox="0 0 100 100"
              className="absolute inset-0"
              initial={{ rotate: 220, x: 60, opacity: 0 }}
              animate={{ rotate: 0, x: 0, opacity: 1 }}
              transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            >
              <defs>
                <mask id="cp">
                  <rect width="100" height="100" fill="white" />
                  <circle cx="51" cy="56" r="27" fill="black" />
                </mask>
              </defs>
              <circle cx="60" cy="60" r="33" fill="var(--brand)" mask="url(#cp)" />
            </motion.svg>
            <motion.div
              className="absolute inset-0 rounded-full"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: [0, 0.8, 0], scale: [0.6, 1.8, 2.4] }}
              transition={{ duration: 1.2, delay: 1.1 }}
              style={{ boxShadow: "0 0 80px 10px var(--brand)" }}
            />
          </div>

          <div className="absolute inset-x-6 bottom-6 flex items-end justify-between font-mono text-xs uppercase tracking-[0.25em] text-muted sm:inset-x-10 sm:bottom-10">
            <span className="flex flex-col gap-1.5">
              <span className="text-paper">Leiluna Studio</span>
              <span className="text-[10px] normal-case tracking-[0.1em] text-muted">Your story. Our creative orbit.</span>
            </span>
            <span className="font-display text-6xl font-light tracking-tight text-paper tabular-nums sm:text-8xl">
              {count}
              <span className="text-brand">%</span>
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
