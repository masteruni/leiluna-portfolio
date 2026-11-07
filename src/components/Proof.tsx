"use client";

import { motion, useInView, useReducedMotion } from "motion/react";
import { useRef, useState } from "react";
import Image from "next/image";
import { moreProof, receipts, stats, topReels } from "@/content/site";
import { openClip } from "@/lib/showreel";
import { Tag } from "./ui";
import { CountUp } from "./CountUp";
import { Eyebrow } from "./Eyebrow";
import { LineReveal } from "./LineReveal";
import { LogoLoop } from "./LogoLoop";

// Each figure sits under a hairline rule, like a ledger, rather than in its own rounded card.
const tile = "relative overflow-hidden border-t border-line pt-6 sm:pt-8";

// Horizontal bars that grow to each reel's view count once the chart is on screen.
function ReelChart() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const reduce = useReducedMotion();
  const max = Math.max(...topReels.map((r) => r.views));
  return (
    <div ref={ref} className={`${tile} col-span-2 lg:row-span-2`}>
      <p className="text-xs text-muted">Views on our top client reels</p>
      <ol className="mt-8 space-y-5" aria-label="Views on the six top-performing client reels">
        {topReels.map((r, i) => (
          <li key={i}>
            <div className="flex items-baseline justify-between gap-4 text-sm">
              <span className="truncate text-paper/70">{r.page}</span>
              <span className="font-display text-lg font-semibold tabular-nums">{r.label}</span>
            </div>
            <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-paper/5">
              <motion.div
                className="h-full origin-left rounded-full"
                style={{
                  width: `${(r.views / max) * 100}%`,
                  background: i < 3 ? "linear-gradient(90deg, var(--brand-3), var(--brand))" : "linear-gradient(90deg, #1b3a5c, #5ab8e8)",
                }}
                initial={{ scaleX: reduce ? 1 : 0 }}
                animate={{ scaleX: inView || reduce ? 1 : 0 }}
                transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.15 + i * 0.1 }}
              />
            </div>
          </li>
        ))}
      </ol>
      <p className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-xs text-paper/60">
        <span className="flex items-center gap-2"><span className="size-2 rounded-full bg-brand" /> Business Resilience Mindset</span>
        <span className="flex items-center gap-2"><span className="size-2 rounded-full bg-[#5ab8e8]" /> The AI Edge Daily</span>
      </p>
    </div>
  );
}

// The screenshots behind the numbers, unedited, straight from the clients' own Instagram. Tapping one opens it full
// size, so anyone can check a figure for themselves.
function Receipts() {
  return (
    <div className="mt-12">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <h3 className="font-display text-2xl font-semibold tracking-[-0.02em] sm:text-3xl">
          The receipts behind the numbers.
        </h3>
        <p className="max-w-sm text-sm text-paper/60">Unedited screenshots from our clients&apos; Instagram. Tap one to see it full size.</p>
      </div>
      <ul className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
        {receipts.map((r, i) => (
          <li key={r.src} className={i === 2 ? "col-span-2 lg:col-span-1" : ""}>
            <button
              type="button"
              onClick={() => openClip({ src: r.src, title: `${r.client}: ${r.what}`, vertical: true, image: true })}
              data-cursor="View"
              className="group block w-full text-left"
            >
              <span className="relative block aspect-[4/5] overflow-hidden rounded-[1.4rem] border border-line bg-ink-2">
                <Image
                  src={r.src}
                  alt={`Screenshot from ${r.client}'s Instagram: ${r.what}`}
                  fill
                  sizes="(min-width: 1024px) 26rem, 50vw"
                  className="object-cover object-top transition-transform duration-500 ease-[var(--ease-out)] group-hover:scale-[1.03]"
                />
                <Tag className="absolute left-3 top-3">Instagram</Tag>
              </span>
              <span className="mt-3 block text-sm text-paper/60">{r.client}</span>
              <span className="mt-0.5 block font-medium leading-snug transition-colors duration-300 group-hover:text-accent">{r.what}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Proof() {
  const [held, setHeld] = useState(false); // a tap stops the ticker on touch screens (hover does it with a mouse)
  const ticker = [...stats.map((s) => `${s.value}${s.suffix} ${s.label}`), ...moreProof.map((m) => `${m.value} ${m.label}`)];
  return (
    <section id="proof" className="relative overflow-hidden py-16 md:py-24" aria-labelledby="proof-title">
      <div className="px-5 sm:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <Eyebrow id="proof" />
              <h2 id="proof-title" className="mt-6 font-display text-[clamp(3rem,7vw,7rem)] font-bold leading-[0.88] tracking-[-0.045em]">
                <LineReveal inView lines={["Numbers that", "travel."]} />
              </h2>
            </div>
            <p className="max-w-sm text-lg text-paper/60">
              Every figure here comes straight from our clients&apos; own Instagram insights. No estimates, no rounding up.
            </p>
          </div>

          <div className="mt-10">
            <p className="text-xs text-muted">Clients &amp; the industries we create for</p>
            <div className="mt-5">
              <LogoLoop />
            </div>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-x-6 gap-y-12 sm:gap-x-10 lg:grid-cols-4">
            {/* lead stat */}
            <div className={`${tile} col-span-2 lg:row-span-2 flex flex-col justify-between`}>
              <div
                aria-hidden
                className="pointer-events-none absolute -right-24 -top-24 size-80 rounded-full"
                style={{ boxShadow: "inset 2.2rem -1.4rem 0 0 rgb(234 106 142 / 0.18)" }}
              />
              <p className="text-xs text-muted">Across our clients&apos; pinned reels</p>
              <div className="mt-12">
                <p className="font-display text-[clamp(5rem,13vw,11rem)] font-bold leading-[0.8] tracking-[-0.06em]">
                  <CountUp value={`${stats[0].value}${stats[0].suffix}`} />
                </p>
                <p className="mt-4 max-w-xs text-lg text-paper/70">{stats[0].label}</p>
              </div>
            </div>

            {stats.slice(1).map((s) => (
              <div key={s.label} className={tile}>
                <p className="font-display text-4xl font-semibold tracking-[-0.05em] text-accent sm:text-6xl">
                  <CountUp value={`${s.value}${s.suffix}`} />
                </p>
                <p className="mt-3 text-sm text-paper/70">{s.label}</p>
              </div>
            ))}
            {moreProof.slice(0, 2).map((m) => (
              <div key={m.label} className={tile}>
                <p className="font-display text-4xl font-semibold tracking-[-0.05em] sm:text-6xl">
                  <CountUp value={m.value} />
                </p>
                <p className="mt-3 text-sm text-paper/70">{m.label}</p>
              </div>
            ))}

            <ReelChart />

            <div className={`${tile} col-span-2 flex items-center justify-between gap-6`}>
              <div>
                <p className="font-display text-6xl font-semibold tracking-[-0.05em] text-accent">
                  <CountUp value={moreProof[2].value} />
                </p>
                <p className="mt-3 text-sm text-paper/70">{moreProof[2].label}</p>
              </div>
              {/* eleven little orbits, one per reel */}
              <div aria-hidden className="flex max-w-[12rem] flex-wrap justify-end gap-2">
                {Array.from({ length: 11 }, (_, i) => (
                  <motion.span
                    key={i}
                    className="size-4 rounded-full border border-brand/70"
                    initial={{ scale: 0.6, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + i * 0.06, type: "spring", stiffness: 300, damping: 18 }}
                    style={{ background: i % 3 === 0 ? "var(--brand)" : "transparent" }}
                  />
                ))}
              </div>
            </div>
          </div>

          <Receipts />
        </div>
      </div>

      {/* running ticker */}
      <div
        className={`marquee-pause mt-14 overflow-hidden border-y border-line py-6 ${held ? "marquee-held" : ""}`}
        aria-hidden
        onPointerUp={(e) => e.pointerType !== "mouse" && setHeld((h) => !h)}
      >
        <div className="animate-marquee flex w-max gap-12 whitespace-nowrap font-display text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
          {[...ticker, ...ticker].map((t, i) => (
            <span key={i} className="flex items-center gap-12">
              <span className={i % 2 ? "text-outline" : ""}>{t}</span>
              <span className="text-accent">✦</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
