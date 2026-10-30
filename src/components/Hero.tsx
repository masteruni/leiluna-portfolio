"use client";

import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useLenis } from "lenis/react";
import { useRef, type MouseEvent } from "react";
import { site, stats } from "@/content/site";
import { setBriefOpen } from "@/lib/brief";
import { openShowreel } from "@/lib/showreel";
import { HeroPhone } from "./HeroPhone";
import { LineReveal } from "./LineReveal";
import { Magnetic } from "./Magnetic";
import { Planet } from "./Planet";

// Says plainly what the studio does, shows real work playing in a phone, and puts the proof and the
// two next steps (start a brief, watch the showreel) above the fold.
export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const lenis = useLenis();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "-25%"]);
  const phoneY = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "-12%"]);
  const fadeOut = useTransform(scrollYProgress, [0.45, 0.95], [1, 0]);

  const fade = (delay: number) => ({
    "data-enter": "",
    initial: reduce ? false : { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const, delay },
  });

  // Opens the project brief and glides to it.
  const startProject = (e: MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    setBriefOpen(true);
    requestAnimationFrame(() => {
      const target = document.querySelector<HTMLElement>("#project-brief") ?? document.querySelector<HTMLElement>("#contact");
      if (!target) return;
      if (lenis) lenis.scrollTo(target, { offset: -140, duration: 1.6, force: true });
      else target.scrollIntoView({ behavior: "smooth" });
    });
  };

  return (
    <section ref={ref} className="relative min-h-[100svh] overflow-hidden">
      <div className="absolute inset-0">
        <Planet progress={scrollYProgress} />
      </div>
      <div aria-hidden className="pointer-events-none absolute inset-0 hidden overflow-hidden md:block">
        <span className="shooting-star left-[72%] top-[12%]" />
        <span className="shooting-star left-[38%] top-[6%] [animation-delay:6.5s] [animation-duration:14s]" />
      </div>

      <div className="relative z-10 mx-auto grid min-h-[100svh] max-w-[90rem] items-center gap-14 px-5 pb-24 pt-32 sm:px-10 lg:grid-cols-[1.25fr_0.75fr] lg:gap-10 lg:pb-16 lg:pt-28">
        <motion.div style={{ y: textY, opacity: fadeOut }} className="min-w-0">
          <h1 className="font-display text-[clamp(2.3rem,7.4vw,8rem)] font-bold leading-[0.9] tracking-[-0.045em]">
            <LineReveal
              delay={0}
              duration={0.9}
              lines={site.hero.title}
            />
          </h1>

          <motion.p {...fade(0.3)} className="mt-7 max-w-xl text-lg leading-relaxed text-paper/70 sm:text-xl">
            {site.hero.intro}
          </motion.p>

          <motion.div {...fade(0.4)} className="mt-9 flex flex-wrap items-center gap-3">
            <Magnetic className="inline-block">
              <Link
                href="/#contact"
                onClick={startProject}
                className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-brand px-7 py-4 font-medium text-ink"
              >
                <span className="absolute inset-0 translate-y-full rounded-full bg-paper transition-transform duration-500 ease-[var(--ease-out)] group-hover:translate-y-0" />
                <span className="relative">Start a project</span>
                <span className="relative transition-transform duration-500 group-hover:translate-x-1">→</span>
              </Link>
            </Magnetic>
            <button
              type="button"
              onClick={openShowreel}
              data-cursor="Play"
              className="group inline-flex items-center gap-3 rounded-full bg-ink/40 py-2 pl-2 pr-5 text-sm backdrop-blur-md transition-colors hover:bg-paper/15"
            >
              <span className="relative grid size-10 place-items-center rounded-full bg-paper">
                <span className="absolute inset-0 animate-ping rounded-full bg-paper/30 [animation-duration:2.4s]" />
                <span className="ml-0.5 border-y-[5px] border-l-[8px] border-y-transparent border-l-ink" />
              </span>
              Watch the showreel
            </button>
          </motion.div>

          {/* proof bar */}
          <motion.dl {...fade(0.5)} className="mt-12 grid max-w-2xl grid-cols-3 gap-4 pt-6 sm:gap-8">
            {stats.map((s) => (
              <div key={s.label} className="flex flex-col-reverse justify-end">
                <dt className="mt-1.5 text-[13px] leading-snug text-paper/60 sm:text-sm">{s.label}</dt>
                <dd className="font-display text-2xl font-semibold tracking-[-0.03em] sm:text-4xl">
                  {s.value}
                  <span className="text-brand">{s.suffix}</span>
                </dd>
              </div>
            ))}
          </motion.dl>
        </motion.div>

        <motion.div
          data-enter=""
          style={{ y: phoneY, opacity: fadeOut }}
          initial={reduce ? false : { opacity: 0, y: 40, rotate: 4 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
        >
          <HeroPhone play />
        </motion.div>
      </div>

    </section>
  );
}
