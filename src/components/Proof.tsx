"use client";

import { motion, useInView, useReducedMotion } from "motion/react";
import { useRef } from "react";
import { moreProof, stats, topReels } from "@/content/site";
import { CountUp } from "./CountUp";

const tile = "relative overflow-hidden rounded-[1.6rem] bg-ink-2 p-5 sm:p-8";

// Horizontal bars that grow to each reel's view count once the chart is on screen.
function ReelChart() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const reduce = useReducedMotion();
  const max = Math.max(...topReels.map((r) => r.views));
  return (
    <div ref={ref} className={`${tile} col-span-2 lg:row-span-2`}>
      <p className="text-sm text-muted">Top client reels · views</p>
      <p className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm">
        <span className="flex items-center gap-2"><span className="size-2 rounded-full bg-brand" /> Business Resilience Mindset</span>
        <span className="flex items-center gap-2"><span className="size-2 rounded-full bg-paper" /> The AI Edge Daily</span>
      </p>
      <ol className="mt-8 space-y-5" aria-label="Views on the six top-performing client reels">
        {topReels.map((r, i) => (
          <li key={i}>
            <div className="flex items-baseline justify-between gap-4 text-sm">
              <span className="truncate">{r.page}</span>
              <span className="font-display text-lg font-semibold tabular-nums">{r.label}</span>
            </div>
            <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-paper/10">
              <motion.div
                className="h-full origin-left rounded-full"
                style={{
                  width: `${(r.views / max) * 100}%`,
                  background: i < 3 ? "var(--brand)" : "var(--paper)",
                }}
                initial={{ scaleX: reduce ? 1 : 0 }}
                animate={{ scaleX: inView || reduce ? 1 : 0 }}
                transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.15 + i * 0.1 }}
              />
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

export function Proof() {
  const lead = stats[0];
  const tiles = [
    { value: `${stats[1].value}${stats[1].suffix}`, label: stats[1].label, accent: true },
    { value: `${stats[2].value}${stats[2].suffix}`, label: stats[2].label },
    { value: moreProof[0].value, label: moreProof[0].label },
    { value: moreProof[1].value, label: moreProof[1].label, accent: true },
  ];
  return (
    <section id="proof" data-chapter="full" className="ch-field ch-full relative overflow-hidden px-5 py-20 sm:px-10 md:py-28" aria-labelledby="proof-title">
      <div className="mx-auto max-w-7xl">
        {/* one figure owns the first screen */}
        <div className="flex min-h-[80svh] flex-col justify-between gap-16 md:min-h-[90svh]">
          <h2 id="proof-title" className="font-display text-[clamp(1.75rem,3vw,2.75rem)] font-semibold tracking-[-0.03em]">
            Numbers that travel.
          </h2>
          <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="font-display text-[clamp(8rem,23vw,23.75rem)] font-bold leading-[0.8] tracking-[-0.06em] tabular-nums">
                {lead.value}
                <span className="align-top text-[0.33em] leading-none tracking-[-0.04em] text-brand">{lead.suffix}</span>
              </p>
              <p className="mt-6 max-w-[32ch] text-lg leading-relaxed">
                Views on our clients&apos; six pinned reels, read straight from their own Instagram insights in 2025–26.
              </p>
            </div>
            <p className="max-w-[30ch] text-[15px] text-muted lg:text-right">No estimates and no rounding up: every figure on this page is a screenshot we can show you.</p>
          </div>
        </div>

        {/* the rest of the evidence */}
        <div className="mt-20 grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4">
          {tiles.map((t, i) => (
            <div key={t.label} className={`${tile} ${i === 0 || i === 3 ? "col-span-2 lg:col-span-1" : ""}`}>
              <p className={`font-display text-4xl font-semibold tracking-[-0.05em] sm:text-6xl ${t.accent ? "text-brand" : ""}`}>
                <CountUp value={t.value} />
              </p>
              <p className="mt-3 text-[15px]">{t.label}</p>
            </div>
          ))}

          <ReelChart />

          <div className={`${tile} col-span-2 flex flex-col justify-between gap-8`}>
            {/* eleven full moons, one per reel past three million */}
            <div aria-hidden className="flex flex-wrap gap-2.5">
              {Array.from({ length: 11 }, (_, i) => (
                <motion.span
                  key={i}
                  className="size-6 rounded-full bg-paper sm:size-8"
                  initial={{ scale: 0.6, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.06, type: "spring", stiffness: 300, damping: 20 }}
                />
              ))}
            </div>
            <div>
              <p className="font-display text-6xl font-semibold tracking-[-0.05em] sm:text-7xl">
                <CountUp value={moreProof[2].value} />
              </p>
              <p className="mt-3 text-[15px]">{moreProof[2].label}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
