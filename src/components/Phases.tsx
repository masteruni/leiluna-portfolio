"use client";

import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";
import { process } from "@/content/site";
import { Eyebrow } from "./Eyebrow";

// A moon whose lit side grows with `phase` (0 = new moon, 1 = full).
function Moon({ phase }: { phase: MotionValue<number> }) {
  const shadowX = useTransform(phase, [0, 1], [50, 150]);
  const glow = useTransform(phase, [0, 1], [0, 0.55]);
  return (
    <svg viewBox="0 0 100 100" className="size-full overflow-visible" aria-hidden>
      <motion.circle cx="50" cy="50" r="46" fill="var(--brand)" style={{ opacity: glow, filter: "blur(18px)" }} />
      <circle cx="50" cy="50" r="40" fill="var(--paper)" />
      <motion.circle cx={shadowX} cy="50" r="41" fill="var(--ink)" />
      <circle cx="50" cy="50" r="40" fill="none" stroke="var(--line)" />
    </svg>
  );
}

function Step({ i, total, progress }: { i: number; total: number; progress: MotionValue<number> }) {
  const p = process[i];
  const start = (i / total) * 0.9;
  const phase = useTransform(progress, [start, start + 0.18], [0.02 + (i / (total - 1)) * 0.2, 0.2 + (i / (total - 1)) * 0.8]);
  const opacity = useTransform(progress, [start - 0.05, start + 0.12], [0.25, 1]);
  return (
    <motion.li style={{ opacity }} className="flex gap-6 md:flex-col md:gap-0">
      <div className="size-20 shrink-0 md:size-28 lg:size-32">
        <Moon phase={phase} />
      </div>
      <div className="md:mt-10">
        <p className="font-mono text-xs text-accent">Phase 0{i + 1}</p>
        <h3 className="mt-2 font-display text-3xl font-semibold tracking-tight">{p.title}</h3>
        <p className="mt-3 max-w-[30ch] text-sm leading-relaxed text-paper/60">{p.text}</p>
        {p.output && (
          <p className="mt-4 flex max-w-[30ch] gap-2 text-sm text-paper/85">
            <span aria-hidden className="text-accent">✦</span>
            <span>
              <span className="text-muted">You get: </span>
              {p.output}
            </span>
          </p>
        )}
      </div>
    </motion.li>
  );
}

export function Phases() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.6"] });
  const line = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section id="process" className="px-5 py-32 sm:px-10 md:py-44">
      <div className="mx-auto max-w-7xl">
        <Eyebrow id="process" />
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <h2 className="mt-6 max-w-4xl font-display text-[clamp(2.8rem,6vw,6rem)] font-bold leading-[0.9] tracking-[-0.045em]">
            From new moon to <span className="serif font-normal text-accent">full orbit.</span>
          </h2>
          <p className="max-w-sm text-lg text-paper/60">
            Five phases in order the first time, then Create, Launch and Grow on repeat every month. You always know what&apos;s being made, why, and what you get back.
          </p>
        </div>

        <div ref={ref} className="relative mt-20">
          <div className="absolute left-10 top-0 h-full w-px bg-line md:left-0 md:top-16 md:h-px md:w-full">
            <motion.div className="hidden h-px bg-brand md:block" style={{ width: line }} />
          </div>
          <ol className="relative grid gap-14 md:grid-cols-5 md:gap-8">
            {process.map((_, i) => (
              <Step key={i} i={i} total={process.length} progress={scrollYProgress} />
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
