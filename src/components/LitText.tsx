"use client";

import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";

function Word({ word, at, total, progress }: { word: string; at: number; total: number; progress: MotionValue<number> }) {
  const start = at / total;
  // Words not yet lit stay readable (at least 3:1 for this large text, in both themes); scrolling lights them fully.
  const opacity = useTransform(progress, [start, start + 1 / total], [0.47, 1]);
  return (
    <>
      <motion.span style={{ opacity }} className="inline-block">
        {word}
      </motion.span>
      {/* a real space between words, so screen readers and search engines read a sentence, not one long word */}
      {at < total - 1 && " "}
    </>
  );
}

// A statement that lights up word by word as it's read down the page: the studio statement on the homepage, and
// the challenge that opens each case study.
export function LitText({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.45"] });
  const words = text.split(" ");
  return (
    <p ref={ref} className={className}>
      {words.map((w, i) => (
        <Word key={i} word={w} at={i} total={words.length} progress={scrollYProgress} />
      ))}
    </p>
  );
}
