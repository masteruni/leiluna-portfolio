"use client";

import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useLenis } from "lenis/react";
import { useRef, type CSSProperties, type MouseEvent } from "react";
import { site, stats } from "@/content/site";
import { setBriefOpen } from "@/lib/brief";
import { openOrbitCheck } from "@/lib/orbitCheck";
import { useReady } from "@/lib/ready";
import { track } from "@/lib/track";
import { CallLink } from "./CallLink";
import { HeroPhone } from "./HeroPhone";
import { LineReveal } from "./LineReveal";
import { Magnetic } from "./Magnetic";
import { Planet } from "./Planet";
import { RotatingText } from "./RotatingText";
import { TrustLine } from "./TrustLine";

// Says plainly what the studio does, shows real work playing in a phone, and puts the proof and the
// next steps (start a project, a free feed audit, or a free call) above the fold.
export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const phone = useRef<HTMLDivElement>(null);
  const ready = useReady();
  const reduce = useReducedMotion();
  const lenis = useLenis();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "-25%"]);
  const phoneY = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "-12%"]);
  const fadeOut = useTransform(scrollYProgress, [0.45, 0.95], [1, 0]);

  // The entrance runs in CSS (`hero-in` / `line-in` in globals.css, each with a --d delay), so the text shows the
  // moment the page arrives instead of waiting for JavaScript, which takes seconds on a mid-range phone. On a first
  // visit it waits, paused, behind the intro and plays as the intro opens.

  // Glides to the brief once it has opened.
  const toBrief = () =>
    requestAnimationFrame(() => {
      const target = document.querySelector<HTMLElement>("#project-brief") ?? document.querySelector<HTMLElement>("#contact");
      if (!target) return;
      if (lenis) lenis.scrollTo(target, { offset: -140, duration: 1.6, force: true });
      else target.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
    });

  // Opens the project brief and glides to it.
  const startProject = (e: MouseEvent<HTMLAnchorElement>) => {
    track("Start project", { from: "hero" });
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    setBriefOpen(true);
    toBrief();
  };

  // The low-commitment option: a free feed audit, in a short form over the page.
  const orbitCheck = () => {
    track("Free audit", { from: "hero" });
    openOrbitCheck();
  };

  return (
    <section ref={ref} className="night relative min-h-[100svh] overflow-hidden">
      <div className="absolute inset-0">
        <Planet progress={scrollYProgress} anchor={phone} />
      </div>
      <div aria-hidden className="pointer-events-none absolute inset-0 hidden overflow-hidden md:block">
        <span className="shooting-star left-[72%] top-[12%]" />
        <span className="shooting-star left-[38%] top-[6%] [animation-delay:6.5s] [animation-duration:14s]" />
      </div>

      {/* On desktop the spacing and the type follow the screen's height as well as its width, so the whole pitch, from
          headline to proof, sits above the fold on a laptop (and clear of the horizon that overlaps the bottom edge). */}
      <div className="relative z-10 mx-auto grid min-h-[100svh] max-w-[90rem] items-center gap-14 px-5 pb-24 pt-32 sm:px-10 lg:grid-cols-[1.25fr_0.75fr] lg:gap-10 lg:pb-[clamp(4.5rem,9svh,5.5rem)] lg:pt-[clamp(5.5rem,12svh,7rem)]">
        <motion.div style={{ y: textY, opacity: fadeOut }} className="min-w-0">
          <p
            className="hero-in mb-7 flex flex-wrap items-center gap-x-5 gap-y-3 text-[13px] text-muted lg:mb-[clamp(0.875rem,3svh,1.75rem)]"
            style={{ "--d": "0.1s" } as CSSProperties}
          >
            <span className="flex items-center gap-3">
              <span className="h-px w-10 bg-brand" />
              {site.headline.join(" ")}
            </span>
            <span className="hidden items-center gap-5 lg:flex">
              <span aria-hidden className="size-1 rounded-full bg-paper/30" />
              {site.location}
            </span>
          </p>

          <h1 className="font-display text-[clamp(2.1rem,11vw,5.5rem)] font-bold leading-[0.9] tracking-[-0.045em] lg:text-[clamp(3rem,min(7.4vw,12svh),8rem)]">
            <LineReveal
              css
              delay={0.1}
              lines={[
                <span key="a">
                  <RotatingText words={site.hero.rotating} play={ready} />
                  {site.hero.title[0].replace(site.hero.rotating[0], "")}
                </span>,
                <span key="b">
                  {site.hero.title[1].replace("stop for.", "")}
                  <span className="serif pr-[0.06em] text-[1.08em] font-normal tracking-[-0.02em] text-accent">stop for.</span>
                </span>,
              ]}
            />
          </h1>

          <p
            className="hero-in mt-7 max-w-xl text-lg leading-relaxed text-paper/70 sm:text-xl lg:mt-[clamp(0.875rem,3svh,1.75rem)] xl:max-w-2xl short:lg:text-lg"
            style={{ "--d": "0.2s" } as CSSProperties}
          >
            {site.hero.intro}
          </p>

          <div
            className="hero-in mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center lg:mt-[clamp(1.125rem,3.6svh,2.25rem)]"
            style={{ "--d": "0.3s" } as CSSProperties}
          >
            <Magnetic className="block sm:inline-block">
              <Link
                href="/#contact"
                onClick={startProject}
                className="group relative flex w-full items-center justify-center gap-3 sm:inline-flex sm:w-auto overflow-hidden press rounded-full bg-brand px-7 py-4 font-medium text-ink"
              >
                <span className="absolute inset-0 translate-y-full rounded-full bg-paper transition-transform duration-300 ease-[var(--ease-out)] group-hover:translate-y-0" />
                <span className="relative">Start a project</span>
              </Link>
            </Magnetic>
            <button
              type="button"
              onClick={orbitCheck}
              className="flex items-center justify-center rounded-full bg-ink/40 px-7 py-4 font-medium ring-1 ring-inset ring-line backdrop-blur-md transition-shadow duration-200 press hover:ring-paper/60 sm:inline-flex"
            >
              Free Orbit Check
            </button>
          </div>

          {/* the price and the brands we've worked with, right under the buttons that ask for a decision (one line
              where there's room for both) */}
          <div className="hero-in mt-4 flex flex-wrap items-center gap-x-6 gap-y-3" style={{ "--d": "0.32s" } as CSSProperties}>
            <p className="text-sm text-paper/70">
              Plans from {site.plansFrom}. <CallLink from="hero">Book a free 30-min call</CallLink>
            </p>
            <TrustLine />
          </div>

          {/* proof bar */}
          <dl
            className="hero-in mt-12 grid max-w-2xl grid-cols-3 gap-4 border-t border-line pt-6 sm:gap-8 lg:mt-[clamp(1.125rem,4svh,3rem)] lg:max-w-none lg:pt-[clamp(1rem,2.6svh,1.5rem)]"
            style={{ "--d": "0.4s" } as CSSProperties}
          >
            {stats.map((s) => (
              <div key={s.label} className="flex flex-col-reverse justify-end">
                <dt className="mt-1.5 text-xs leading-snug text-paper/60 sm:text-sm">{s.label}</dt>
                <dd className="font-display text-2xl font-semibold tracking-[-0.03em] sm:text-4xl">
                  {s.value}
                  <span className="text-accent">{s.suffix}</span>
                </dd>
              </div>
            ))}
          </dl>
        </motion.div>

        <motion.div style={{ y: phoneY, opacity: fadeOut }}>
          {/* (the planet lines itself up with this box on phones: see Planet.tsx) */}
          <div ref={phone} className="hero-phone-in" style={{ "--d": "0.5s" } as CSSProperties}>
            <HeroPhone play={ready} />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
