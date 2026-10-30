"use client";

import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { heroProof, site, stats } from "@/content/site";
import { useAnchor } from "@/lib/anchor";
import { openShowreel } from "@/lib/showreel";
import { useReady } from "@/lib/ready";
import { LineReveal } from "./LineReveal";
import { Magnetic } from "./Magnetic";
import { OrbitBadge } from "./OrbitBadge";
import { Planet } from "./Planet";

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const ready = useReady();
  const reduce = useReducedMotion();
  const anchor = useAnchor();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "-35%"]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const fade = (delay: number) => ({
    initial: reduce ? false : { opacity: 0, y: 16 },
    animate: ready ? { opacity: 1, y: 0 } : undefined,
    transition: { duration: 1, ease: [0.16, 1, 0.3, 1] as const, delay },
  });

  return (
    <section ref={ref} className="relative h-[100svh] min-h-[640px] overflow-hidden">
      <div className="absolute inset-0">
        <Planet progress={scrollYProgress} />
      </div>

      {/* two streaks of light, far apart in time, so the sky never quite sits still */}
      <div aria-hidden className="pointer-events-none absolute inset-0 hidden overflow-hidden md:block">
        <span className="shooting-star left-[72%] top-[12%]" />
        <span className="shooting-star left-[38%] top-[6%] [animation-delay:6.5s] [animation-duration:14s]" />
      </div>

      <motion.div
        style={{ y: textY, opacity: textOpacity }}
        className="relative z-10 flex h-full flex-col justify-end px-5 pb-28 sm:px-10 md:justify-center md:pb-0"
      >
        <motion.p {...fade(0.2)} className="mb-6 flex flex-wrap items-center gap-x-5 gap-y-3 font-mono text-[11px] uppercase tracking-[0.3em] text-muted">
          <span className="flex items-center gap-3">
            <span className="h-px w-10 bg-brand" />
            Social &amp; content studio
          </span>
          {site.available && (
            <span className="flex items-center gap-2.5 text-paper/80 md:hidden">
              <span className="pulse relative size-1.5 rounded-full bg-brand" />
              Open for new projects
            </span>
          )}
        </motion.p>

        <h1 className="font-display text-[clamp(3.4rem,10.5vw,10.5rem)] font-bold leading-[0.88] tracking-[-0.045em]">
          <LineReveal
            play={ready}
            delay={0.1}
            lines={[
              site.headline[0],
              site.headline[1],
              <span key="o" className="relative inline-block">
                <span className="serif pr-[0.06em] text-[1.12em] font-normal leading-[0.8] tracking-[-0.02em] text-brand">
                  {site.headline[2]}
                </span>
              </span>,
            ]}
          />
        </h1>

        <div className="mt-10 flex flex-col gap-8 md:flex-row md:items-center md:gap-14">
          <motion.ul {...fade(0.7)} className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-paper/70">
            {site.pillars.map((p, i) => (
              <li key={p} className="flex items-center gap-5">
                {i > 0 && <span className="size-1 rounded-full bg-brand" />}
                {p}
              </li>
            ))}
          </motion.ul>

          <motion.div {...fade(0.85)} className="flex flex-wrap items-center gap-3">
            <Magnetic className="inline-block">
              <Link
                href="/#contact"
                onClick={anchor}
                className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-brand px-7 py-4 font-medium text-ink"
              >
                <span className="absolute inset-0 translate-y-full rounded-full bg-paper transition-transform duration-500 ease-[var(--ease-out)] group-hover:translate-y-0" />
                <span className="relative">{site.tagline}</span>
                <span className="relative transition-transform duration-500 group-hover:translate-x-1">→</span>
              </Link>
            </Magnetic>
            <button
              type="button"
              onClick={openShowreel}
              data-cursor="Play"
              className="group inline-flex items-center gap-3 rounded-full border border-line bg-ink/40 py-2 pl-2 pr-5 text-sm backdrop-blur-md transition-colors hover:border-paper/60"
            >
              <span className="relative grid size-10 place-items-center rounded-full bg-paper">
                <span className="absolute inset-0 animate-ping rounded-full bg-paper/30 [animation-duration:2.4s]" />
                <span className="ml-0.5 border-y-[5px] border-l-[8px] border-y-transparent border-l-ink" />
              </span>
              Watch showreel
            </button>
          </motion.div>
        </div>

        {/* proof in one line on small screens; the floating chips take over on large ones */}
        <motion.p {...fade(1)} className="mt-8 font-mono text-[10px] uppercase tracking-[0.25em] text-paper/60 xl:hidden">
          <span className="text-brand">
            {stats[0].value}
            {stats[0].suffix}
          </span>{" "}
          {stats[0].label}
        </motion.p>
      </motion.div>

      {/* Floating proof chips: real results drifting in orbit around the planet */}
      <div aria-label="Results" className="pointer-events-none absolute inset-0 z-10 hidden xl:block">
        {heroProof.map((p, i) => (
          <motion.div
            key={p.value}
            initial={reduce ? false : { opacity: 0, scale: 0.9 }}
            animate={ready ? { opacity: 1, scale: 1 } : undefined}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 1.2 + i * 0.18 }}
            className="absolute"
            style={[{ right: "5%", top: "15%" }, { right: "18%", top: "38%" }, { right: "4%", top: "57%" }][i]}
          >
            <motion.div
              animate={reduce ? undefined : { y: [0, i % 2 ? 10 : -10, 0] }}
              transition={{ duration: 5 + i, repeat: Infinity, ease: "easeInOut" }}
              className="rounded-2xl border border-line bg-ink/55 px-5 py-4 shadow-[0_20px_60px_-20px_rgb(0_0_0/0.8)] backdrop-blur-md"
            >
              <p className="font-display text-4xl font-semibold tracking-[-0.04em]">
                {p.value}
                <span className="ml-1.5 inline-block size-2 rounded-full bg-brand align-middle" />
              </p>
              <p className="mt-1 text-xs text-paper/70">{p.label}</p>
              <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.2em] text-muted">{p.source}</p>
            </motion.div>
          </motion.div>
        ))}
      </div>

      {site.available && (
        <motion.div {...fade(1.2)} className="absolute bottom-24 right-6 z-10 hidden md:block lg:right-14">
          <OrbitBadge text="Available for new projects" second={site.location} />
        </motion.div>
      )}

      <motion.div
        {...fade(1.1)}
        className="absolute inset-x-5 bottom-6 z-10 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.3em] text-muted sm:inset-x-10"
      >
        <span className="flex items-center gap-3">
          <span className="relative h-8 w-px overflow-hidden bg-line">
            <motion.span
              className="absolute inset-x-0 top-0 h-1/2 bg-brand"
              animate={reduce ? undefined : { y: ["-100%", "200%"] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            />
          </span>
          Scroll to explore
        </span>
        <span className="hidden sm:block">{site.location}</span>
      </motion.div>
    </section>
  );
}
