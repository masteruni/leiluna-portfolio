"use client";

import { motion, useInView, useReducedMotion } from "motion/react";
import { useRef } from "react";
import { stats } from "@/content/site";

// Each digit is a vertical strip of 0–9 that rolls into place, like an odometer.
function Digit({ d, delay, play }: { d: number; delay: number; play: boolean }) {
  return (
    <span className="relative inline-block h-[1em] overflow-hidden leading-none">
      <motion.span
        className="flex flex-col"
        initial={{ y: "0%" }}
        animate={{ y: play ? `${-d * 10}%` : "0%" }}
        transition={{ duration: 2, ease: [0.16, 1, 0.3, 1], delay }}
      >
        {Array.from({ length: 10 }, (_, n) => (
          <span key={n} className="block h-[1em]">
            {n}
          </span>
        ))}
      </motion.span>
    </span>
  );
}

function Roller({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  const reduce = useReducedMotion();
  const digits = String(value).split("").map(Number);
  return (
    <span ref={ref} className="inline-flex items-start">
      {/* Assistive tech reads the final value; the rolling digit strips are decoration. */}
      <span className="sr-only">
        {value}
        {suffix}
      </span>
      <span aria-hidden className="inline-flex items-start">
        {reduce ? (
          <span>{value}</span>
        ) : (
          digits.map((d, i) => <Digit key={i} d={d} play={inView} delay={i * 0.12} />)
        )}
        <span className="serif ml-1 text-[0.55em] leading-none text-brand">{suffix}</span>
      </span>
    </span>
  );
}

export function Numbers() {
  return (
    <section className="relative overflow-hidden px-5 py-32 sm:px-10 md:py-44" aria-label="Results">
      {/* big crescent watermark */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-[20vw] top-1/2 size-[70vw] -translate-y-1/2 rounded-full opacity-60"
        style={{ boxShadow: "inset 3vw -2vw 0 0 rgb(234 106 142 / 0.12)" }}
      />
      <div className="relative mx-auto max-w-7xl">
        <p className="mb-16 font-mono text-[11px] uppercase tracking-[0.3em] text-muted">
          <span className="text-brand">(05)</span> In numbers
        </p>
        <ul className="space-y-6">
          {stats.map((s, i) => (
            <li
              key={s.label}
              className="flex flex-col gap-2 border-t border-line pt-6 md:flex-row md:items-end md:justify-between"
              style={{ paddingLeft: `${i * 9}%` }}
            >
              <span className="font-display text-[clamp(5rem,15vw,14rem)] font-semibold leading-[0.85] tracking-[-0.06em] tabular-nums">
                <Roller value={s.value} suffix={s.suffix} />
              </span>
              <span className="max-w-[16ch] pb-4 text-lg text-paper/60 md:text-right">{s.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
