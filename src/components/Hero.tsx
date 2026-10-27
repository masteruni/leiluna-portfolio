"use client";

import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { site } from "@/content/site";
import { useReady } from "@/lib/ready";
import { LineReveal } from "./LineReveal";
import { Magnetic } from "./Magnetic";
import { Planet } from "./Planet";

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const ready = useReady();
  const reduce = useReducedMotion();
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

      <motion.div
        style={{ y: textY, opacity: textOpacity }}
        className="relative z-10 flex h-full flex-col justify-end px-5 pb-28 sm:px-10 md:justify-center md:pb-0"
      >
        <motion.p {...fade(0.2)} className="mb-6 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.3em] text-muted">
          <span className="h-px w-10 bg-brand" />
          Social &amp; content studio
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

          <motion.div {...fade(0.85)}>
            <Magnetic className="inline-block">
              <Link
                href="/#contact"
                className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-brand px-7 py-4 font-medium text-ink"
              >
                <span className="absolute inset-0 translate-y-full rounded-full bg-paper transition-transform duration-500 ease-[var(--ease-out)] group-hover:translate-y-0" />
                <span className="relative">{site.tagline}</span>
                <span className="relative transition-transform duration-500 group-hover:translate-x-1">→</span>
              </Link>
            </Magnetic>
          </motion.div>
        </div>
      </motion.div>

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
