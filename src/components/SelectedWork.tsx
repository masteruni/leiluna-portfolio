"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";
import { projects, type Project } from "@/content/projects";
import { useAnchor } from "@/lib/anchor";
import { CountUp } from "./CountUp";
import { LineReveal } from "./LineReveal";

// One project as a full-width showcase. On large screens the cards pin and stack,
// each one easing back as the next slides over it.
function Showcase({ p, i, total, progress }: { p: Project; i: number; total: number; progress: MotionValue<number> }) {
  const reduce = useReducedMotion();
  const scale = useTransform(progress, [i / total, 1], [1, reduce ? 1 : 1 - (total - 1 - i) * 0.05]);
  const [a, b] = p.palette;

  return (
    <div className="lg:sticky lg:h-svh lg:pt-[12vh]" style={{ top: `${i * 28}px` }}>
      <motion.article
        style={{ scale, transformOrigin: "top center" }}
        className="group relative overflow-hidden rounded-[2rem] lg:h-[76vh] bg-paper/[0.07]"
      >
        {/* palette glow behind the card */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background: `radial-gradient(70% 90% at 85% 10%, color-mix(in oklab, ${a} 30%, transparent), transparent 60%),
              radial-gradient(60% 70% at 0% 100%, color-mix(in oklab, ${b} 55%, transparent), transparent 70%), var(--ink-2)`,
          }}
        />
        <Link href={`/work/${p.slug}`} data-cursor="View" className="relative grid h-full gap-8 p-6 sm:p-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12 lg:p-14">
          <div className="flex flex-col justify-between gap-10">
            <div>
              <h3 className="font-display text-[clamp(2.6rem,5.4vw,5.6rem)] font-bold leading-[0.9] tracking-[-0.045em] transition-colors duration-500 group-hover:text-brand">
                {p.title}
              </h3>
              <p className="mt-4 text-sm text-paper/60">
                {p.client} · {p.year}
              </p>
              <p className="mt-5 max-w-lg text-paper/70 sm:text-lg">{p.summary}</p>
            </div>

            <div>
              <dl className="grid grid-cols-3 gap-4 pt-6">
                {p.metrics.map((m) => (
                  <div key={m.label} className="flex flex-col-reverse justify-end">
                    <dt className="mt-1 text-[13px] text-paper/60 sm:text-sm">{m.label}</dt>
                    <dd className="font-display text-3xl font-semibold tracking-[-0.03em] sm:text-5xl">
                      <CountUp value={m.value} />
                    </dd>
                  </div>
                ))}
              </dl>
              <span className="mt-8 inline-flex items-center gap-3 rounded-full bg-paper py-3 pl-5 pr-3 text-sm font-medium text-ink transition-colors duration-300 group-hover:bg-brand">
                View case study
                <span className="grid size-7 place-items-center rounded-full bg-ink text-paper transition-transform duration-500 group-hover:rotate-45">↗</span>
              </span>
            </div>
          </div>

          {p.cover && (
            <div className="relative mx-auto aspect-[9/16] w-full max-w-[20rem] lg:h-full lg:w-auto lg:max-w-none">
              <div className="absolute inset-0 overflow-hidden rounded-[1.6rem] shadow-[0_40px_80px_-30px_rgb(0_0_0/0.9)] transition-transform duration-700 ease-[var(--ease-out)] group-hover:-rotate-2 group-hover:scale-[1.03]">
                <Image src={p.cover} alt={`${p.title} for ${p.client}`} fill sizes="(min-width: 1024px) 30vw, 80vw" className="object-cover" />
              </div>
            </div>
          )}
        </Link>
      </motion.article>
    </div>
  );
}

export function SelectedWork() {
  const ref = useRef<HTMLDivElement>(null);
  const anchor = useAnchor();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  return (
    <section id="work" className="relative px-5 py-32 sm:px-10 md:py-44">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="font-display text-[clamp(3rem,7vw,7rem)] font-bold leading-[0.88] tracking-[-0.045em]">
              <LineReveal inView lines={["Stories we put", <span key="o" className="serif font-normal text-brand">in orbit.</span>]} />
            </h2>
          </div>
          <p className="max-w-sm text-lg text-paper/60">
            Real pages we run every day, from strategy and editing to posting and community. The numbers are theirs.
          </p>
        </div>

        <div ref={ref} className="mt-16 flex flex-col gap-10 lg:gap-0">
          {projects.map((p, i) => (
            <Showcase key={p.slug} p={p} i={i} total={projects.length} progress={scrollYProgress} />
          ))}
        </div>

        <Link
          href="/#contact"
          onClick={anchor}
          data-cursor="Let's go"
          className="group mt-16 flex flex-col items-start justify-between gap-6 py-10 sm:flex-row sm:items-center"
        >
          <span className="font-display text-[clamp(2.2rem,4.5vw,4.5rem)] font-bold leading-[0.95] tracking-[-0.04em]">
            Your story <span className="serif font-normal text-brand">goes here next.</span>
          </span>
          <span className="grid size-16 shrink-0 place-items-center rounded-full text-2xl transition duration-500 group-hover:rotate-45 group-hover:bg-brand group-hover:text-ink bg-paper/[0.07]">
            ↗
          </span>
        </Link>
      </div>
    </section>
  );
}
