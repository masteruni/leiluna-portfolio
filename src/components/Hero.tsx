"use client";

import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useLenis } from "lenis/react";
import { useRef, type CSSProperties, type MouseEvent } from "react";
import { projects } from "@/content/projects";
import { site, stats } from "@/content/site";
import { useAnchor } from "@/lib/anchor";
import { setBriefOpen } from "@/lib/brief";
import { openOrbitCheck } from "@/lib/orbitCheck";
import { useReady } from "@/lib/ready";
import { track } from "@/lib/track";
import { CallLink } from "./CallLink";
import { LineReveal } from "./LineReveal";
import { Magnetic } from "./Magnetic";
import { HeroWall } from "./HeroWall";
import { RotatingText } from "./RotatingText";
import { TrustLine } from "./TrustLine";
import { LinkPreview } from "./ui/link-preview";

// Says plainly what the studio does, centred over a wall of real reels, and puts the proof and the
// next steps (start a project, a free feed audit, or a free call) above the fold.
export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const ready = useReady();
  const reduce = useReducedMotion();
  const lenis = useLenis();
  const anchor = useAnchor();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "-25%"]);
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
      <HeroWall />

      {/* On desktop the spacing and the type follow the screen's height as well as its width, so the whole pitch, from
          headline to proof, sits above the fold on a laptop (and clear of the horizon that overlaps the bottom edge). */}
      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-6xl flex-col items-center justify-center px-5 pb-24 pt-32 text-center sm:px-10 lg:pb-[clamp(4.5rem,9svh,5.5rem)] lg:pt-[clamp(5.5rem,12svh,7rem)]">
        <motion.div style={{ y: textY, opacity: fadeOut }} className="flex w-full min-w-0 flex-col items-center">
          <p
            className="hero-in mb-6 text-[11px] uppercase tracking-[0.34em] text-brand-2 sm:text-xs lg:mb-[clamp(0.75rem,2.6svh,1.5rem)]"
            style={{ "--d": "0.1s" } as CSSProperties}
          >
            Social media &amp; content studio
          </p>

          <h1 className="font-display text-[clamp(2.6rem,12.5vw,6rem)] font-bold leading-[0.86] tracking-[-0.055em] lg:text-[clamp(3.4rem,min(8.2vw,13.5svh),8.5rem)]">
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
                  <span className="serif pr-[0.06em] text-[1.12em] font-normal tracking-[-0.025em] text-accent">stop for.</span>
                </span>,
              ]}
            />
          </h1>

          <p
            className="hero-in mx-auto mt-7 max-w-xl text-lg leading-relaxed text-paper/75 sm:text-xl lg:mt-[clamp(0.875rem,3svh,1.75rem)] xl:max-w-2xl short:lg:text-lg"
            style={{ "--d": "0.2s" } as CSSProperties}
          >
            {site.hero.intro}
          </p>

          <div
            className="hero-in mt-9 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center sm:justify-center lg:mt-[clamp(1.125rem,3.6svh,2.25rem)]"
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
            <Link
              href="/#library"
              onClick={anchor}
              className="flex items-center justify-center rounded-full bg-ink/50 px-7 py-4 font-medium ring-1 ring-inset ring-paper/25 backdrop-blur-md transition-shadow duration-200 press hover:ring-paper/60 sm:inline-flex"
            >
              Browse the Library
            </Link>
          </div>

          {/* the price and the two low-commitment ways in, right under the buttons that ask for a decision */}
          <p
            className="hero-in mt-5 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-sm text-paper/70 sm:text-base"
            style={{ "--d": "0.32s" } as CSSProperties}
          >
            <span>
              Plans from <span className="font-semibold text-paper">{site.plansFrom}</span>
            </span>
            <span aria-hidden className="text-paper/30">&middot;</span>
            <CallLink from="hero">Book a free 30-min call</CallLink>
            <span aria-hidden className="text-paper/30">&middot;</span>
            <button type="button" onClick={orbitCheck} className="text-paper underline decoration-paper/30 underline-offset-4 transition-colors hover:text-accent hover:decoration-accent">
              Get a free audit
            </button>
          </p>

          {/* proof bar */}
          <div
            className="hero-in mx-auto mt-12 flex w-full max-w-3xl flex-col items-stretch overflow-hidden rounded-[1.75rem] bg-ink/70 ring-1 ring-inset ring-line backdrop-blur-xl lg:mt-[clamp(1.5rem,5svh,3.5rem)] lg:w-auto lg:max-w-none"
            style={{ "--d": "0.4s" } as CSSProperties}
          >
          <dl className="grid flex-1 grid-cols-3 divide-x divide-line">
            {stats.map((s) => {
              // Each number can be checked: it links to the case study it comes from (or to the Work section when
              // it spans several), and with a mouse previews the client's own page. The link's hit area covers the
              // number and its label.
              const sources = projects.filter((p) => p.cover && s.proof?.includes(p.slug));
              const number = (
                <>
                  {s.value}
                  <span className="text-accent">{s.suffix}</span>
                </>
              );
              return (
                <div key={s.label} className="group relative flex flex-col-reverse items-center justify-end px-2 py-4 sm:px-4 lg:px-7 lg:py-3.5">
                  <dt
                    className={`mt-1 text-[11px] leading-snug text-paper/60 sm:text-xs lg:whitespace-nowrap ${
                      sources.length ? "underline decoration-transparent underline-offset-4 transition-colors duration-200 group-hover:text-paper group-hover:decoration-paper/40" : ""
                    }`}
                  >
                    {s.label}
                  </dt>
                  <dd className="font-display text-xl font-semibold tracking-[-0.03em] sm:text-2xl">
                    {sources.length ? (
                      <LinkPreview
                        href={sources.length === 1 ? `/work/${sources[0].slug}` : "/#work"}
                        onClick={sources.length === 1 ? undefined : anchor}
                        images={sources.map((p) => ({ src: p.cover!, alt: `${p.client} on Instagram` }))}
                        caption={
                          <>
                            <span className="block text-paper">{sources.map((p) => p.client).join(" and ")}</span>
                            {sources.length === 1 ? "Open the case study" : "See both in Selected work"}
                          </>
                        }
                        className="rounded-sm after:absolute after:inset-0"
                      >
                        {number}
                      </LinkPreview>
                    ) : (
                      number
                    )}
                  </dd>
                </div>
              );
            })}
          </dl>
          <div className="flex items-center justify-center border-t border-line px-5 py-3.5">
            <TrustLine className="text-xs sm:text-sm" />
          </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
