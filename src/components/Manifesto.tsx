"use client";

import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";
import { manifesto } from "@/content/site";

function Word({ word, i, total, progress }: { word: string; i: number; total: number; progress: MotionValue<number> }) {
  const start = i / total;
  const opacity = useTransform(progress, [start, start + 1 / total], [0.12, 1]);
  return (
    <>
      <motion.span style={{ opacity }} className="inline-block">
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
  const words = manifesto.text.split(" ");

  return (
    <section id="studio" data-chapter="crescent" aria-labelledby="studio-title" className="ch-field ch-crescent relative flex min-h-[90svh] flex-col justify-center px-5 py-20 sm:px-10 md:py-28">
      <div className="mx-auto max-w-7xl">
        <h2 id="studio-title" className="font-display text-[clamp(3rem,8vw,8rem)] font-bold leading-[0.9] tracking-[-0.045em]">
          {manifesto.title}
        </h2>
        <div ref={ref} className="mt-12 md:ml-[33%] md:mt-16">
          <p className="max-w-[54rem] font-display text-[clamp(1.375rem,2.2vw,2rem)] font-medium leading-[1.25] tracking-[-0.02em]">
            {words.map((w, i) => (
              <Word key={i} word={w} i={i} total={words.length} progress={scrollYProgress} />
            ))}
          </p>
        </div>
      </div>
    </section>
  );
}
