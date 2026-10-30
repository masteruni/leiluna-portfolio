"use client";

import { Volume2, VolumeX } from "lucide-react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { useLenis } from "lenis/react";
import { useEffect, useRef, useState } from "react";
import { industriesOf, pieces, type Piece } from "@/content/library";
import { formats } from "@/content/site";
import { openBriefWith } from "@/lib/brief";
import { openShowreel } from "@/lib/showreel";
import { LineReveal } from "./LineReveal";
import { showreel } from "./Showreel";

const protect = {
  controlsList: "nodownload noplaybackrate noremoteplayback",
  disablePictureInPicture: true,
  disableRemotePlayback: true,
} as const;

const items = formats
  .map((f) => ({ ...f, p: pieces.find((x) => x.id === f.piece) }))
  .filter((f): f is (typeof formats)[number] & { p: Piece } => !!f.p?.src);

// "Pick a format": the kinds of content we make, each playing a real example, with a one-tap way to ask for it.
export function Formats() {
  const [i, setI] = useState(0);
  const [sound, setSound] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const inView = useInView(ref, { margin: "-20% 0px" });
  const reduce = useReducedMotion();
  const lenis = useLenis();
  const f = items[i];
  const wide = f.p.format === "wide";

  // play only while the section is on screen
  useEffect(() => {
    const v = video.current;
    if (!v) return;
    if (inView) v.play().catch(() => {});
    else v.pause();
  }, [inView, i, sound]);

  const pick = (n: number) => {
    setI(n);
    setSound(false);
  };

  const want = () => {
    openBriefWith({ need: f.need, message: `We'd like something like your "${f.name}" example.` });
    requestAnimationFrame(() => {
      const t = document.querySelector<HTMLElement>("#project-brief") ?? document.querySelector<HTMLElement>("#contact");
      if (!t) return;
      if (lenis) lenis.scrollTo(t, { offset: -140, duration: 1.6, force: true });
      else t.scrollIntoView({ behavior: "smooth" });
    });
  };

  const browse = () => {
    const t = document.querySelector<HTMLElement>("#library");
    if (!t) return;
    if (lenis) lenis.scrollTo(t, { offset: -40, duration: 1.4, force: true });
    else t.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section ref={ref} id="formats" className="relative px-5 py-20 sm:px-10 md:py-28" aria-labelledby="formats-title">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 id="formats-title" className="font-display text-[clamp(3rem,7vw,7rem)] font-bold leading-[0.88] tracking-[-0.045em]">
              <LineReveal inView lines={["Pick a format.", "See it work."]} />
            </h2>
          </div>
          <div className="max-w-sm">
            <p className="text-lg text-paper/60">
              Not sure what you need yet? Tap through the formats we make most, watch a real example, and ask for the one that fits.
            </p>
            <button
              type="button"
              onClick={openShowreel}
              className="group mt-5 inline-flex items-center gap-3 text-sm text-paper/80 transition-colors hover:text-paper"
            >
              <span className="grid size-9 place-items-center rounded-full transition-colors group-hover:bg-brand bg-paper/[0.07]">
                <span className="ml-0.5 border-y-[4px] border-l-[7px] border-y-transparent border-l-paper group-hover:border-l-ink" />
              </span>
              Or watch the full showreel ({showreel.duration})
            </button>
          </div>
        </div>

        <div className="mt-16 grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
          {/* the list (a swipeable row of chips on phones) */}
          <div role="tablist" aria-label="Formats" className="flex flex-wrap gap-2 lg:block">
            {items.map((x, n) => {
              const on = n === i;
              return (
                <button
                  key={x.piece}
                  type="button"
                  role="tab"
                  id={`format-tab-${n}`}
                  aria-selected={on}
                  aria-controls="format-panel"
                  onClick={() => pick(n)}
                  className={`group relative shrink-0 text-left transition-colors max-lg:rounded-full max-lg:px-4 max-lg:py-2 max-lg:text-sm lg:flex lg:w-full lg:items-center lg:gap-5 lg:py-5 ${
                    on ? "max-lg:bg-brand max-lg:text-ink" : "max-lg:bg-paper/[0.07] max-lg:text-paper/75"
                  }`}
                >
                  <span className="lg:flex-1">
                    <span className={`block whitespace-nowrap font-display font-semibold tracking-[-0.02em] lg:whitespace-normal lg:text-2xl ${on ? "lg:text-paper" : "lg:text-paper/55 lg:group-hover:text-paper/85"}`}>
                      {x.name}
                    </span>
                    <span className={`mt-1 hidden text-sm lg:block ${on ? "text-paper/65" : "text-paper/55"}`}>{x.bestFor}</span>
                  </span>
                  {on && (
                    <motion.span
                      layoutId="format-marker"
                      aria-hidden
                      className="absolute -left-4 top-1/2 hidden h-10 w-1 -translate-y-1/2 rounded-full bg-brand lg:block"
                      transition={{ type: "spring", stiffness: 400, damping: 34 }}
                    />
                  )}
                  <span aria-hidden className={`hidden text-xl transition-transform duration-500 lg:block ${on ? "translate-x-0 text-brand" : "-translate-x-2 text-paper/20"}`}>
                    →
                  </span>
                </button>
              );
            })}
          </div>

          {/* the example */}
          <div id="format-panel" role="tabpanel" aria-labelledby={`format-tab-${i}`} className="relative">
            <div className={`relative mx-auto overflow-hidden rounded-[2rem] bg-ink-2 ${wide ? "aspect-video w-full" : "aspect-[9/16] w-full max-w-[22rem]"}`}>
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.video
                  key={`${f.piece}-${sound}`}
                  {...protect}
                  ref={video}
                  src={sound ? f.p.src : (f.p.preview ?? f.p.src)}
                  poster={f.p.poster}
                  muted={!sound}
                  loop
                  playsInline
                  preload="metadata"
                  className="absolute inset-0 size-full object-cover"
                  initial={reduce ? false : { opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                />
              </AnimatePresence>
              <button
                type="button"
                onClick={() => setSound((s) => !s)}
                className="absolute bottom-4 right-4 z-10 inline-flex items-center gap-2 rounded-full bg-ink/85 px-4 py-2 text-[13px] text-paper transition-colors hover:bg-paper hover:text-ink"
              >
                {sound ? <VolumeX aria-hidden className="size-4" /> : <Volume2 aria-hidden className="size-4" />}
                {sound ? "Sound off" : "Sound on"}
              </button>
              <span className="absolute left-4 top-4 z-10 rounded-full bg-ink/85 px-3 py-1 text-[13px] text-paper/80">
                {industriesOf(f.p).length > 2 ? "Multi-industry" : industriesOf(f.p).join(" · ")} · {f.p.duration}
              </span>
            </div>

            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={f.piece}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35 }}
                className={`mx-auto mt-8 ${wide ? "" : "max-w-[22rem] lg:max-w-none"}`}
              >
                <p className="text-sm text-brand">Best for · {f.bestFor}</p>
                <p className="mt-3 text-lg leading-relaxed text-paper/80">{f.pitch}</p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={want}
                    className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-medium text-ink transition-colors hover:bg-paper"
                  >
                    I want this →
                  </button>
                  <button
                    type="button"
                    onClick={browse}
                    className="rounded-full px-6 py-3 text-sm text-paper/80 transition-colors hover:text-paper bg-paper/[0.07] hover:bg-paper/15"
                  >
                    See more in the Library
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
