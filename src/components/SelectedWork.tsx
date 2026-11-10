"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef, ViewTransition } from "react";
import { projects, type Project } from "@/content/projects";
import { useAnchor } from "@/lib/anchor";
import { openOrbitCheck } from "@/lib/orbitCheck";
import { track } from "@/lib/track";
import { SectionHead } from "./SectionHead";
import { ArrowCircle, buttonClass } from "./ui";

// One project as a full-width showcase. On large screens the cards pin and stack, each one easing back as the
// next slides over it. That stacking is the section's one piece of motion: the cards themselves are flat, and the
// client's own cover carries the colour.
function Showcase({ p, i, total, progress }: { p: Project; i: number; total: number; progress: MotionValue<number> }) {
  const reduce = useReducedMotion();
  const scale = useTransform(progress, [i / total, 1], [1, reduce ? 1 : 1 - (total - 1 - i) * 0.05]);

  return (
    <div className="lg:sticky lg:h-svh lg:pt-[12vh]" style={{ top: `${i * 28}px` }}>
      <motion.article
        style={{ scale, transformOrigin: "top center" }}
        className="group overflow-hidden rounded-3xl border border-line bg-ink-2 lg:h-[76vh]"
      >
        <Link href={`/work/${p.slug}`} className="grid h-full gap-8 p-6 sm:p-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12 lg:p-14">
          <div className="flex flex-col justify-between gap-10">
            <div>
              <p className="text-sm text-paper/60">
                <span className="text-paper">{p.client}</span>, {p.year}
              </p>
              <h3 className="mt-5 font-display text-[clamp(2.4rem,4.8vw,5rem)] font-bold leading-[0.92] tracking-[-0.045em]">{p.title}</h3>
              <p className="mt-5 max-w-lg text-paper/70 sm:text-lg">{p.summary}</p>
              <p className="mt-5 text-sm text-paper/60">{p.categories.join(", ")}</p>
            </div>

            <div>
              <dl className="grid grid-cols-3 gap-4 border-t border-line pt-6">
                {p.metrics.map((m) => (
                  <div key={m.label} className="flex flex-col-reverse justify-end">
                    <dt className="mt-1 text-xs text-paper/60 sm:text-sm">{m.label}</dt>
                    <dd className="font-display text-3xl font-semibold tracking-[-0.03em] sm:text-5xl">{m.value}</dd>
                  </div>
                ))}
              </dl>
              <span className={buttonClass("solid", "lg", "mt-8 group-hover:bg-brand group-hover:text-on-brand")}>
                Read the case study
                <ArrowUpRight aria-hidden size={16} strokeWidth={1.75} />
              </span>
            </div>
          </div>

          {p.cover && (
            // Shares its name with the case study's hero cover, so opening the case study morphs this cover
            // into that one instead of cutting to a new page.
            <ViewTransition name={`cover-${p.slug}`} share="cover-morph" default="none">
              <div className="relative mx-auto aspect-[9/16] w-full max-w-[20rem] overflow-hidden rounded-2xl border border-line lg:h-full lg:w-auto lg:max-w-none">
                <Image src={p.cover} alt={`${p.title} for ${p.client}`} fill sizes="(min-width: 1024px) 30vw, 80vw" className="object-cover" />
              </div>
            </ViewTransition>
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
    <section id="work" className="relative px-5 py-16 sm:px-10 md:py-24">
      <div className="mx-auto max-w-7xl">
        <SectionHead title="Stories we put in orbit.">
          Real pages we&rsquo;ve grown, from strategy and editing to posting and community. The numbers are theirs.
        </SectionHead>

        <div ref={ref} className="mt-12 flex flex-col gap-10 lg:gap-0">
          {projects.map((p, i) => (
            <Showcase key={p.slug} p={p} i={i} total={projects.length} progress={scrollYProgress} />
          ))}
        </div>

        <Link
          href="/#contact"
          onClick={anchor}
          className="group mt-12 flex items-center justify-between gap-6 border-y border-line py-8"
        >
          <span className="heading-section transition-colors duration-300 group-hover:text-accent">Your story goes here next.</span>
          <ArrowCircle size="lg" tone="outline" />
        </Link>

        <div className="mt-8 flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-lg text-paper/80">Want numbers like these? Start with a free look at your feed.</p>
          <button
            type="button"
            onClick={() => {
              track("Free audit", { from: "work" });
              openOrbitCheck();
            }}
            className={buttonClass("outline", "lg")}
          >
            Get your free Orbit Check
          </button>
        </div>
      </div>
    </section>
  );
}
