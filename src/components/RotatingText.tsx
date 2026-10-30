"use client";

import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

const rise = { type: "spring", stiffness: 380, damping: 32 } as const;

// Cycles through words in place: each word's letters rise in one after another while the old one lifts
// away, and the space eases to the new word's width so the text after it slides along.
// The page loads with the first word as plain text, so search engines and screen readers read the headline
// as written; once it starts cycling, they keep getting that first word.
export function RotatingText({ words, play = true, interval = 2600 }: { words: string[]; play?: boolean; interval?: number }) {
  const [i, setI] = useState(0);
  const [cycled, setCycled] = useState(false);
  const [widths, setWidths] = useState<number[]>([]);
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();
  const onScreen = useInView(ref);

  // Every word's width in the headline's font, measured on a canvas (no hidden copies of the words in the page).
  useEffect(() => {
    const ctx = document.createElement("canvas").getContext("2d");
    const measure = () => {
      if (!ctx || !ref.current) return;
      const cs = getComputedStyle(ref.current);
      ctx.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
      const spacing = parseFloat(cs.letterSpacing) || 0;
      const slack = parseFloat(cs.fontSize) * 0.04; // canvas runs a hair narrower than the page; never clip a letter
      setWidths(words.map((w) => ctx.measureText(w).width + spacing * w.length + slack));
    };
    measure();
    document.fonts.ready.then(measure);
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [words]);

  useEffect(() => {
    if (!play || reduce || !onScreen || words.length < 2) return;
    const t = window.setInterval(() => {
      setCycled(true);
      setI((n) => (n + 1) % words.length);
    }, interval);
    return () => window.clearInterval(t);
  }, [play, reduce, onScreen, words.length, interval]);

  return (
    <span ref={ref} className="inline-block align-bottom">
      {cycled && <span className="sr-only">{words[0]}</span>}
      <motion.span
        aria-hidden={cycled || undefined}
        className="relative inline-flex overflow-hidden whitespace-pre pb-[0.08em] align-bottom"
        animate={cycled && widths[i] ? { width: widths[i] } : undefined}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          {cycled ? (
            <motion.span key={i} className="inline-flex">
              {[...words[i]].map((ch, k) => (
                <motion.span
                  key={k}
                  className="inline-block"
                  initial={{ y: "110%" }}
                  animate={{ y: "0%" }}
                  exit={{ y: "-120%" }}
                  transition={{ ...rise, delay: k * 0.025 }}
                >
                  {ch === " " ? " " : ch}
                </motion.span>
              ))}
            </motion.span>
          ) : (
            <motion.span key="first" className="inline-block" exit={{ y: "-120%" }} transition={rise}>
              {words[0]}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.span>
    </span>
  );
}
