"use client";

import { Volume2, VolumeX } from "lucide-react";
import { AnimatePresence, motion, useInView, useMotionValue, useReducedMotion, useTransform, type Variants } from "motion/react";
import Image from "next/image";
import { useLenis } from "lenis/react";
import { useEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import { industriesOf, pieces, type Piece } from "@/content/library";
import { formats } from "@/content/site";
import { openBriefWith } from "@/lib/brief";
import { openShowreel } from "@/lib/showreel";
import { track } from "@/lib/track";
import { spark } from "@/lib/spark";
import { Eyebrow } from "./Eyebrow";
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

type Item = (typeof items)[number];

// The front card comes forward out of the deck and leaves the way it was swiped (dir 1 = next, -1 = previous).
const card: Variants = {
  enter: { opacity: 0.6, scale: 0.95, y: 10 },
  center: { opacity: 1, scale: 1, x: 0, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
  exit: (dir: number) => ({ opacity: 0, x: dir * -420, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } }),
};

// The playing example, as the top card of the deck: drag or swipe it sideways for the next or previous format.
function FrontCard({
  f,
  sound,
  video,
  reduce,
  onStep,
  children,
}: {
  f: Item;
  sound: boolean;
  video: RefObject<HTMLVideoElement | null>;
  reduce: boolean;
  onStep: (dir: number) => void;
  children: ReactNode;
}) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-300, 300], [-10, 10]);
  return (
    <motion.div
      variants={card}
      initial={reduce ? false : "enter"}
      animate="center"
      exit={reduce ? undefined : "exit"}
      drag={reduce ? false : "x"}
      dragSnapToOrigin
      dragElastic={0.6}
      onDragEnd={(_, info) => {
        const swipe = info.offset.x + info.velocity.x * 0.2;
        if (swipe < -90) onStep(1);
        else if (swipe > 90) onStep(-1);
      }}
      style={{ x, rotate, touchAction: "pan-y" }}
      className="absolute inset-0 cursor-grab overflow-hidden rounded-[2rem] border border-line bg-ink-2 shadow-[0_40px_100px_-40px_rgb(234_106_142/0.35)] active:cursor-grabbing"
    >
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
          className="pointer-events-none absolute inset-0 size-full object-cover"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        />
      </AnimatePresence>
      {children}
    </motion.div>
  );
}

// "Pick a format": the kinds of content we make, each playing a real example, with a one-tap way to ask for it.
export function Formats() {
  const [i, setI] = useState(0);
  const [dir, setDir] = useState(1);
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

  const pick = (n: number, d = n > i ? 1 : -1) => {
    if (n === i) return;
    setDir(d);
    setI(n);
    setSound(false);
  };
  const step = (d: number) => pick((i + d + items.length) % items.length, d);

  const want = () => {
    track("Format requested", { format: f.name });
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
    <section ref={ref} id="formats" className="relative px-5 py-32 sm:px-10 md:py-44" aria-labelledby="formats-title">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Eyebrow id="formats" />
            <h2 id="formats-title" className="mt-6 font-display text-[clamp(3rem,7vw,7rem)] font-bold leading-[0.88] tracking-[-0.045em]">
              <LineReveal inView lines={["Pick a format.", <span key="b" className="serif font-normal text-accent">See it work.</span>]} />
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
              <span className="grid size-9 place-items-center rounded-full border border-line transition-colors group-hover:border-brand group-hover:bg-brand">
                <span className="ml-0.5 border-y-[4px] border-l-[7px] border-y-transparent border-l-paper group-hover:border-l-on-brand" />
              </span>
              Or watch the full showreel ({showreel.duration})
            </button>
          </div>
        </div>

        <div className="mt-16 grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
          {/* the list (a swipeable row of chips on phones) */}
          <div role="tablist" aria-label="Formats" className="-mx-5 flex gap-2 overflow-x-auto px-5 [scrollbar-width:none] sm:-mx-10 sm:px-10 lg:mx-0 lg:block lg:overflow-visible lg:border-t lg:border-line lg:px-0">
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
                  onClick={(e) => {
                    if (n !== i) spark(e);
                    pick(n);
                  }}
                  className={`group relative shrink-0 text-left transition-colors max-lg:rounded-full max-lg:border max-lg:px-4 max-lg:py-2 max-lg:text-sm lg:flex lg:w-full lg:items-center lg:gap-5 lg:border-b lg:border-line lg:py-5 ${
                    on ? "max-lg:border-brand max-lg:bg-brand max-lg:text-on-brand" : "max-lg:border-line max-lg:text-paper/75"
                  }`}
                >
                  <span className={`hidden font-mono text-xs lg:block ${on ? "text-accent" : "text-muted"}`}>0{n + 1}</span>
                  <span className="lg:flex-1">
                    <span className={`block whitespace-nowrap font-display font-semibold tracking-[-0.02em] lg:whitespace-normal lg:text-2xl ${on ? "lg:text-paper" : "lg:text-paper/55 lg:group-hover:text-paper/85"}`}>
                      {x.name}
                    </span>
                    <span className={`mt-1 hidden text-sm lg:block ${on ? "text-paper/75" : "text-paper/65"}`}>{x.bestFor}</span>
                  </span>
                  {on && (
                    <motion.span
                      layoutId="format-marker"
                      aria-hidden
                      className="absolute -left-4 top-1/2 hidden h-10 w-1 -translate-y-1/2 rounded-full bg-brand lg:block"
                      transition={{ type: "spring", stiffness: 400, damping: 34 }}
                    />
                  )}
                  <span aria-hidden className={`hidden text-xl transition-transform duration-500 lg:block ${on ? "translate-x-0 text-accent" : "-translate-x-2 text-paper/20"}`}>
                    →
                  </span>
                </button>
              );
            })}
          </div>

          {/* the example */}
          <div id="format-panel" role="tabpanel" aria-labelledby={`format-tab-${i}`} className="relative">
            <div className={`relative mx-auto ${wide ? "aspect-video w-full" : "aspect-[9/16] w-full max-w-[22rem]"}`}>
              {/* the next two formats, stacked behind like a deck; they shuffle forward as you go */}
              {[2, 1].map((d) => {
                if (d >= items.length) return null;
                const next = items[(i + d) % items.length];
                return (
                  <div
                    key={next.piece}
                    aria-hidden
                    className="absolute inset-0 overflow-hidden rounded-[2rem] border border-line bg-ink-2 transition-[transform,opacity] duration-500 ease-[var(--ease-out)]"
                    style={{ transform: `translate(${d * 14}px, ${d * 10}px) rotate(${d * 3}deg) scale(${1 - d * 0.05})`, opacity: 1 - d * 0.3 }}
                  >
                    {next.p.poster && <Image src={next.p.poster} alt="" fill sizes="22rem" className="object-cover opacity-50" />}
                  </div>
                );
              })}
              <AnimatePresence initial={false} custom={dir}>
                <FrontCard key={f.piece} f={f} sound={sound} video={video} reduce={!!reduce} onStep={step}>
                  <button
                    type="button"
                    onClick={() => setSound((s) => !s)}
                    className="absolute bottom-4 right-4 z-10 inline-flex items-center gap-2 rounded-full bg-ink/70 px-4 py-2 text-xs text-paper backdrop-blur-md transition-colors hover:bg-paper hover:text-ink"
                  >
                    {sound ? <VolumeX aria-hidden className="size-4" /> : <Volume2 aria-hidden className="size-4" />}
                    {sound ? "Sound off" : "Sound on"}
                  </button>
                  <span className="absolute left-4 top-4 z-10 rounded-full bg-ink/60 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-paper/80 backdrop-blur">
                    {industriesOf(f.p).length > 2 ? "Multi-industry" : industriesOf(f.p).join(" · ")} · {f.p.duration}
                  </span>
                </FrontCard>
              </AnimatePresence>
            </div>
            <p className={`mx-auto mt-5 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.25em] text-muted ${wide ? "" : "max-w-[22rem]"}`}>
              <span>← Swipe for more →</span>
              <span>
                <span className="text-accent">0{i + 1}</span> / 0{items.length}
              </span>
            </p>

            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={f.piece}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35 }}
                className={`mx-auto mt-8 ${wide ? "" : "max-w-[22rem] lg:max-w-none"}`}
              >
                <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-accent">Best for · {f.bestFor}</p>
                <p className="mt-3 text-lg leading-relaxed text-paper/80">{f.pitch}</p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={want}
                    className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-medium text-on-brand transition-colors hover:bg-paper hover:text-ink"
                  >
                    I want this →
                  </button>
                  <button
                    type="button"
                    onClick={browse}
                    className="rounded-full border border-line px-6 py-3 text-sm text-paper/80 transition-colors hover:border-paper hover:text-paper"
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
