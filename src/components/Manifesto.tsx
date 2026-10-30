"use client";

import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";
import { manifesto } from "@/content/site";
import { Eyebrow } from "./Eyebrow";

const accent = new Set(["orbiting.", "stop"]);

function Word({ word, i, total, progress }: { word: string; i: number; total: number; progress: MotionValue<number> }) {
  const start = i / total;
  const opacity = useTransform(progress, [start, start + 1 / total], [0.12, 1]);
  const isAccent = accent.has(word);
  return (
    <>
      <motion.span style={{ opacity }} className={`inline-block ${isAccent ? "serif text-accent" : ""}`}>
        {word}
      </motion.span>
      {/* a real space between words, so screen readers and search engines read a sentence, not one long word */}
      {i < total - 1 && " "}
    </>
  );
}

// The studio statement lights up word by word as you scroll through it.
export function Manifesto() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.45"] });
  const words = manifesto.split(" ");

  return (
    <section id="studio" className="relative px-5 py-24 sm:px-10 md:py-36">
      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[180px_1fr]">
        <Eyebrow id="studio" />
        <div ref={ref}>
          <p className="font-display text-[clamp(1.9rem,4.4vw,4.4rem)] font-medium leading-[1.08] tracking-[-0.03em]">
            {words.map((w, i) => (
              <Word key={i} word={w} i={i} total={words.length} progress={scrollYProgress} />
            ))}
          </p>
        </div>
      </div>
    </section>
  );
}
