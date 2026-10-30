"use client";

import Link from "next/link";
import { motion, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from "motion/react";
import { useLayoutEffect, useRef, useState } from "react";
import { projects, type Project } from "@/content/projects";
import { ProjectCover } from "./ProjectCover";

// Card heights vary by format so the reel has rhythm, like frames of different content.
const frame: Record<Project["format"], { h: number; ratio: number }> = {
  reel: { h: 70, ratio: 9 / 16 },
  portrait: { h: 60, ratio: 4 / 5 },
  square: { h: 50, ratio: 1 },
  wide: { h: 42, ratio: 16 / 9 },
};

// The project's lead result, so the proof is visible before anyone clicks through.
function Headline({ p }: { p: Project }) {
  const m = p.metrics[0];
  if (!m) return null;
  return (
    <p className="mt-4 flex items-baseline gap-3 border-t border-line pt-4">
      <span className="font-display text-3xl font-semibold tracking-[-0.03em] text-brand">{m.value}</span>
      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">{m.label}</span>
    </p>
  );
}

function Card({ p, i, progress }: { p: Project; i: number; progress: MotionValue<number> }) {
  const reduce = useReducedMotion();
  // gentle vertical drift, alternating direction per card
  const y = useTransform(progress, [0, 1], reduce ? [0, 0] : i % 2 ? [60, -60] : [-40, 40]);
  return (
    <motion.article style={{ y }} className={`shrink-0 ${i % 2 ? "self-end" : "self-start"}`}>
      <Link href={`/work/${p.slug}`} data-cursor="View" className="group block">
        <div style={{ height: `${frame[p.format].h}vh`, width: `${frame[p.format].h * frame[p.format].ratio}vh` }}>
          <ProjectCover project={p} variant={i} className="size-full" />
        </div>
        <div className="mt-5 flex items-baseline justify-between gap-6">
          <h3 className="font-display text-2xl font-semibold tracking-tight transition-colors group-hover:text-brand">{p.title}</h3>
          <span className="font-mono text-xs text-muted">0{i + 1}</span>
        </div>
        <p className="mt-1 text-sm text-muted">
          {p.client} · {p.categories.join(" / ")}
        </p>
        <Headline p={p} />
      </Link>
    </motion.article>
  );
}

export function WorkReel() {
  const section = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);

  useLayoutEffect(() => {
    const measure = () => {
      if (track.current) setDistance(Math.max(0, track.current.scrollWidth - window.innerWidth));
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (track.current) ro.observe(track.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end end"] });
  const smooth = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });
  const x = useTransform(smooth, [0, 1], [0, -distance]);
  const bar = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section id="work" className="relative">
      {/* Desktop: vertical scroll drives a horizontal reel */}
      <div ref={section} className="hidden lg:block" style={{ height: `calc(100vh + ${distance}px)` }}>
        <div className="sticky top-0 flex h-screen items-center overflow-hidden">
          <motion.div ref={track} style={{ x }} className="flex h-[84vh] items-stretch gap-[6vw] pl-10 pr-[10vw] will-change-transform">
            <div className="flex w-[34vw] shrink-0 flex-col justify-between py-6">
              <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-muted">
                <span className="text-brand">(03)</span> Selected work
              </p>
              <h2 className="font-display text-[clamp(3.5rem,7vw,7.5rem)] font-bold leading-[0.88] tracking-[-0.045em]">
                Stories
                <br />
                we put in
                <br />
                <span className="serif font-normal text-brand">orbit.</span>
              </h2>
              <p className="max-w-xs text-paper/60">
                Real pages we grow and manage, with the numbers to show for it. Keep scrolling →
              </p>
            </div>

            {projects.map((p, i) => (
              <Card key={p.slug} p={p} i={i} progress={scrollYProgress} />
            ))}

            <Link
              href="/#contact"
              data-cursor="Let's go"
              className="group flex w-[30vw] shrink-0 flex-col items-start justify-center gap-6"
            >
              <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-muted">Your turn</span>
              <span className="font-display text-[clamp(3rem,5vw,5.5rem)] font-bold leading-[0.9] tracking-[-0.04em] transition-colors group-hover:text-brand">
                Your story
                <br />
                <span className="serif font-normal">goes here.</span>
              </span>
            </Link>
          </motion.div>

          <div className="absolute inset-x-10 bottom-8 h-px bg-line">
            <motion.div className="h-px bg-brand" style={{ width: bar }} />
          </div>
        </div>
      </div>

      {/* Mobile: native swipe reel */}
      <div className="py-24 lg:hidden">
        <div className="px-5 sm:px-10">
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-muted">
            <span className="text-brand">(03)</span> Selected work
          </p>
          <h2 className="mt-4 font-display text-6xl font-bold leading-[0.88] tracking-[-0.045em]">
            Stories we put in <span className="serif font-normal text-brand">orbit.</span>
          </h2>
          <p className="mt-4 text-sm text-muted">Swipe →</p>
        </div>
        <div className="mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 [scrollbar-width:none] sm:px-10">
          {projects.map((p, i) => (
            <Link key={p.slug} href={`/work/${p.slug}`} className="group w-[72vw] max-w-sm shrink-0 snap-start">
              <ProjectCover project={p} format="portrait" variant={i} />
              <h3 className="mt-4 font-display text-xl font-semibold">{p.title}</h3>
              <p className="text-sm text-muted">{p.client}</p>
              <Headline p={p} />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
