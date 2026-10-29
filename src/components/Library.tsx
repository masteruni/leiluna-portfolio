"use client";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useLenis } from "lenis/react";
import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { industries, industriesOf, pieces, type Industry, type Kind, type Piece, type PieceFormat } from "@/content/library";

const aspect: Record<PieceFormat, string> = {
  reel: "aspect-[9/16]",
  square: "aspect-square",
  portrait: "aspect-[4/5]",
  tall: "aspect-[3/4]",
  wide: "aspect-video",
  landscape: "aspect-[4/3]",
  long: "aspect-[9/16]",
};

// Each industry gets its own tint in the Leiluna family, so the placeholders read as different worlds.
const tint: Record<Industry, [string, string]> = {
  "Food & Beverage": ["#ff8a6b", "#ea6a8e"],
  "Beauty & Wellness": ["#f6a6bd", "#b06ab3"],
  "Real Estate": ["#c9b8a6", "#6a4c93"],
  Fitness: ["#ea6a8e", "#ff3d5a"],
  Fashion: ["#ffd1dc", "#a8436a"],
  "Tech & SaaS": ["#8e7cc3", "#3d6bff"],
  Education: ["#ffd27a", "#ea6a8e"],
  Hospitality: ["#ffb199", "#8e7cc3"],
  Automotive: ["#b8c4d6", "#ea6a8e"],
  "Home & Living": ["#d9c2a7", "#a8436a"],
  "Finance & Trading": ["#6bd6a0", "#3d6bff"],
};

const industryLabel = (p: Piece) => {
  const list = industriesOf(p);
  if (list.length === industries.length) return "Any industry";
  return list.length > 1 ? "Multi-industry" : list[0];
};

// Column count follows the same breakpoints as the layout (2 / md:3 / xl:4).
const columnQueries = ["(min-width: 1280px)", "(min-width: 768px)"];
function subscribeColumns(cb: () => void) {
  const mqs = columnQueries.map((q) => window.matchMedia(q));
  mqs.forEach((m) => m.addEventListener("change", cb));
  return () => mqs.forEach((m) => m.removeEventListener("change", cb));
}
const getColumns = () => (window.matchMedia(columnQueries[0]).matches ? 4 : window.matchMedia(columnQueries[1]).matches ? 3 : 2);
function useColumns() {
  return useSyncExternalStore(subscribeColumns, getColumns, () => 4);
}

const kinds: { id: "all" | Kind; label: string }[] = [
  { id: "all", label: "Everything" },
  { id: "video", label: "Reels & video" },
  { id: "graphic", label: "Graphics" },
];

// Placeholder artwork until a real file is added, or the real image/video.
function PieceArt({ p, playing, large, slide = 0 }: { p: Piece; playing: boolean; large?: boolean; slide?: number }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (playing) v.play().catch(() => {});
    else v.pause();
  }, [playing]);

  if (p.src && p.kind === "video") {
    return (
      <video controlsList="nodownload noplaybackrate noremoteplayback" disablePictureInPicture disableRemotePlayback
        ref={ref}
        src={large ? p.src : (p.preview ?? p.src)}
        poster={p.poster}
        muted={!large}
        controls={large}
        loop
        playsInline
        preload={large ? "auto" : "metadata"}
        className={`absolute inset-0 size-full ${large ? "object-contain" : "object-cover"}`}
      />
    );
  }
  if (p.src) {
    const src = (large && p.slides?.[slide]) || p.src;
    // Long infographics open at full width and scroll inside the viewer.
    if (large && p.format === "long") {
      return (
        <div data-lenis-prevent className="absolute inset-0 overflow-y-auto overscroll-contain">
          <Image src={src} alt={`${p.style}: ${p.title}`} width={0} height={0} sizes="(min-width: 1024px) 480px, 92vw" className="h-auto w-full" />
        </div>
      );
    }
    return (
      <Image
        key={src}
        src={src}
        alt={`${p.style}: ${p.title}${p.slides ? `, slide ${slide + 1} of ${p.slides.length}` : ""}`}
        fill
        sizes={large ? "90vw" : "(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw"}
        className={large ? "object-contain" : `object-cover ${p.format === "long" ? "object-top" : ""}`}
      />
    );
  }

  const [a, b] = tint[industriesOf(p)[0]];
  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(90% 60% at 20% 10%, color-mix(in oklab, ${a} 45%, transparent), transparent 65%),
            radial-gradient(70% 50% at 90% 95%, color-mix(in oklab, ${b} 40%, transparent), transparent 70%), var(--ink-2)`,
        }}
      />
      {p.kind === "graphic" ? (
        <>
          {/* dot grid + crop marks: a designer's canvas */}
          <div
            className="absolute inset-0 opacity-30"
            style={{ backgroundImage: "radial-gradient(rgb(246 242 239 / 0.35) 1px, transparent 1px)", backgroundSize: "14px 14px" }}
          />
          {["left-3 top-3 border-l border-t", "right-3 top-3 border-r border-t", "bottom-3 left-3 border-b border-l", "bottom-3 right-3 border-b border-r"].map((c) => (
            <span key={c} className={`absolute size-4 border-paper/50 ${c}`} />
          ))}
        </>
      ) : (
        <>
          {(p.format === "reel" || p.format === "portrait") && (
          <span className="absolute left-1/2 top-1/2 grid size-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-paper/30 bg-ink/30 backdrop-blur transition-transform duration-500 group-hover:scale-110">
            <span className="ml-1 border-y-[7px] border-l-[11px] border-y-transparent border-l-paper" />
          </span>
          )}
          {/* scrubbing progress bar */}
          <span className="absolute inset-x-4 bottom-4 h-0.5 overflow-hidden rounded-full bg-paper/20">
            <span
              className="block h-full origin-left bg-brand"
              style={{ animation: playing ? "scrub 6s linear infinite" : "none", transform: playing ? undefined : "scaleX(0.35)" }}
            />
          </span>
        </>
      )}
      <span
        className={`serif absolute inset-x-4 text-paper ${large ? "bottom-16 text-5xl md:text-6xl" : "bottom-9 text-[clamp(1.4rem,2.2vw,2rem)]"} leading-[0.95]`}
      >
        {p.style}
      </span>
    </div>
  );
}

function Tile({ p, onOpen, index }: { p: Piece; onOpen: (opener: HTMLButtonElement) => void; index: number }) {
  const ref = useRef<HTMLButtonElement>(null);
  const [visible, setVisible] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.45 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.94 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: Math.min(index, 8) * 0.04 }}
      className="w-full"
    >
      <button
        ref={ref}
        type="button"
        onClick={(e) => onOpen(e.currentTarget)}
        data-cursor={p.kind === "video" ? "Play" : "View"}
        aria-label={`${p.kind === "video" ? "Play" : "View"} ${p.style}, ${industriesOf(p).join(", ")}`}
        className={`group relative block w-full overflow-hidden rounded-2xl bg-ink-2 text-left ${aspect[p.format]}`}
      >
        <div className="absolute inset-0 transition-transform duration-[1.2s] ease-[var(--ease-out)] group-hover:scale-[1.04]">
          <PieceArt p={p} playing={visible && !reduce} />
        </div>
        <div className="pointer-events-none absolute inset-x-2 top-2 flex items-start justify-between gap-1.5 whitespace-nowrap font-mono text-[9px] uppercase tracking-[0.12em] sm:inset-x-3 sm:top-3 sm:gap-2 sm:text-[10px] sm:tracking-[0.18em]">
          <span className="min-w-0 truncate rounded-full bg-ink/60 px-2 py-1 text-paper/80 backdrop-blur sm:px-2.5">{industryLabel(p)}</span>
          <span className="shrink-0 rounded-full bg-ink/60 px-2 py-1 text-brand backdrop-blur sm:px-2.5">
            {p.kind === "video" ? (
              `▶ ${p.duration ?? "Reel"}`
            ) : (
              <>
                <span className="sm:hidden" aria-hidden>{p.slides ? `◼ ${p.slides.length}` : "◼"}</span>
                <span className="max-sm:sr-only">{p.slides ? `Carousel · ${p.slides.length}` : "Graphic"}</span>
              </>
            )}
          </span>
        </div>
        {p.src && (
          <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/90 to-transparent p-4 pt-10 font-display text-lg font-medium">
            {p.style}
          </span>
        )}
      </button>
    </motion.div>
  );
}

function Lightbox({
  list,
  index,
  onClose,
  onStep,
  onContact,
}: {
  list: Piece[];
  index: number;
  onClose: () => void;
  onStep: (d: number) => void;
  onContact: () => void;
}) {
  const p = list[index];
  const closeRef = useRef<HTMLButtonElement>(null);
  // Carousels flip through their slides first, then on to the next piece.
  const [at, setAt] = useState({ id: p.id, slide: 0 });
  const slide = at.id === p.id ? at.slide : 0;
  const slides = p.slides?.length ?? 0;
  const go = useCallback(
    (d: number) => {
      const next = slide + d;
      if (next >= 0 && next < slides) setAt({ id: p.id, slide: next });
      else onStep(d);
    },
    [slide, slides, p.id, onStep],
  );
  useEffect(() => {
    closeRef.current?.focus();
  }, []);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, go]);

  const media = {
    reel: "aspect-[9/16] h-[min(58vh,760px)] lg:h-[min(78vh,760px)]",
    square: "aspect-square w-[min(88vw,680px)] lg:w-auto lg:h-[min(70vh,680px)]",
    portrait: "aspect-[4/5] h-[min(58vh,720px)] lg:h-[min(74vh,720px)]",
    tall: "aspect-[3/4] h-[min(58vh,760px)] lg:h-[min(76vh,760px)]",
    wide: "aspect-video w-[min(92vw,1000px)] lg:w-[min(60vw,900px)]",
    landscape: "aspect-[4/3] w-[min(92vw,900px)] lg:w-auto lg:h-[min(74vh,680px)]",
    long: "w-[min(92vw,480px)] h-[min(62vh,820px)] lg:h-[min(82vh,820px)]",
  }[p.format];

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={`${p.style}, ${industriesOf(p).join(", ")}`}
      className="fixed inset-0 z-[85] flex items-center justify-center bg-ink px-4 sm:bg-ink/95 pb-4 pt-20 backdrop-blur-xl sm:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        key={p.id}
        className="flex max-h-full w-full max-w-[1320px] flex-col items-center gap-6 overflow-y-auto lg:flex-row lg:items-end lg:justify-center lg:gap-12"
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        <motion.div
          className={`relative max-w-full shrink-0 overflow-hidden rounded-2xl bg-ink-2 ${media} ${slides ? "touch-pan-y" : ""}`}
          onPanEnd={slides ? (_, info) => Math.abs(info.offset.x) > 40 && go(info.offset.x < 0 ? 1 : -1) : undefined}
        >
          <PieceArt p={p} playing large slide={slide} />
          {slides > 1 && (
            <>
              {[-1, 1].map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => go(d)}
                  aria-label={d < 0 ? "Previous slide" : "Next slide"}
                  className={`absolute top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-ink/60 text-paper backdrop-blur transition-opacity hover:bg-ink/80 ${
                    d < 0 ? "left-3" : "right-3"
                  } ${(d < 0 ? slide === 0 : slide === slides - 1) ? "pointer-events-none opacity-0" : ""}`}
                >
                  {d < 0 ? "←" : "→"}
                </button>
              ))}
              <div className="absolute inset-x-0 bottom-3 flex justify-center gap-1.5">
                {p.slides!.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setAt({ id: p.id, slide: i })}
                    aria-label={`Slide ${i + 1}`}
                    aria-current={i === slide}
                    className={`h-1.5 rounded-full transition-all ${i === slide ? "w-5 bg-brand" : "w-1.5 bg-paper/50 hover:bg-paper"}`}
                  />
                ))}
              </div>
            </>
          )}
        </motion.div>
        <div className="w-full max-w-sm shrink-0 lg:w-80">
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-brand">
            {p.kind === "video"
              ? `${p.format === "reel" ? "Reel" : "Video"} · ${p.duration ?? ""}`
              : slides
                ? `Carousel · Slide ${slide + 1} of ${slides}`
                : p.format === "long"
                  ? "Graphic · Scroll to read"
                  : "Graphic"}
          </p>
          <h3 className="mt-3 font-display text-4xl font-semibold leading-[0.95] tracking-[-0.03em]">{p.style}</h3>
          <p className="serif mt-2 text-2xl text-paper/70">{p.title}</p>
          <dl className="mt-8 space-y-3 text-sm">
            <div className="flex justify-between border-t border-line pt-3">
              <dt className="text-muted">{industriesOf(p).length > 1 && industriesOf(p).length < industries.length ? "Industries" : "Industry"}</dt>
              <dd className="max-w-[14rem] text-right">
                {industriesOf(p).length === industries.length ? "Any industry" : industriesOf(p).join(", ")}
              </dd>
            </div>
            {p.tools && (
              <div className="flex justify-between gap-6 border-t border-line pt-3">
                <dt className="text-muted">Made with</dt>
                <dd className="text-right">{p.tools.join(", ")}</dd>
              </div>
            )}
          </dl>
          <button
            type="button"
            onClick={onContact}
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-brand px-5 py-3 text-sm font-medium text-ink transition-colors hover:bg-paper"
          >
            I want this style →
          </button>
          <div className="mt-8 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
            <button type="button" onClick={() => onStep(-1)} className="rounded-full border border-line px-3 py-2 hover:text-paper" aria-label="Previous piece">
              ←
            </button>
            <span className="tabular-nums">
              {String(index + 1).padStart(2, "0")} / {String(list.length).padStart(2, "0")}
            </span>
            <button type="button" onClick={() => onStep(1)} className="rounded-full border border-line px-3 py-2 hover:text-paper" aria-label="Next piece">
              →
            </button>
          </div>
        </div>
      </motion.div>
      <button
        ref={closeRef}
        type="button"
        onClick={onClose}
        className="absolute right-5 top-5 rounded-full bg-paper px-5 py-2.5 text-sm font-medium text-ink sm:right-10 sm:top-6"
      >
        Close ✕
      </button>
    </motion.div>
  );
}

export function Library() {
  const [kind, setKind] = useState<"all" | Kind>("all");
  const [industry, setIndustry] = useState<"All" | Industry>("All");
  const [open, setOpen] = useState<number | null>(null);
  // The tile that opened the viewer, so focus goes back there when it closes.
  const opener = useRef<HTMLButtonElement | null>(null);
  const lenis = useLenis();
  const cols = useColumns();

  const list = useMemo(
    () => pieces.filter((p) => (kind === "all" || p.kind === kind) && (industry === "All" || industriesOf(p).includes(industry))),
    [kind, industry],
  );
  // Only offer industries that have pieces in the current format.
  const available = useMemo(() => new Set(pieces.filter((p) => kind === "all" || p.kind === kind).flatMap(industriesOf)), [kind]);

  useEffect(() => {
    if (open !== null) lenis?.stop();
    else lenis?.start();
  }, [open, lenis]);

  const close = useCallback(() => {
    setOpen(null);
    opener.current?.focus();
  }, []);

  const count = (k: "all" | Kind) => pieces.filter((p) => k === "all" || p.kind === k).length;

  return (
    <section id="library" className="relative px-5 py-32 sm:px-10 md:py-44">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-muted">
              <span className="text-brand">(04)</span> The library
            </p>
            <h2 className="mt-6 font-display text-[clamp(3rem,7vw,7rem)] font-bold leading-[0.88] tracking-[-0.045em]">
              Every format.
              <br />
              <span className="serif font-normal text-brand">Every industry.</span>
            </h2>
          </div>
          <p className="max-w-sm text-lg text-paper/60">
            Not case studies, just the craft. Single reels, edits and graphics across industries, so you can find your style
            before we ever talk.
          </p>
        </div>

        {/* filters */}
        <div className="sticky top-0 z-20 -mx-5 mt-14 border-y border-line bg-ink/80 px-5 py-4 backdrop-blur-xl sm:-mx-10 sm:px-10">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div role="group" aria-label="Filter by format" className="-mx-5 flex shrink-0 gap-2 overflow-x-auto px-5 [scrollbar-width:none] sm:mx-0 sm:px-0">
              {kinds.map((k) => (
                <button
                  key={k.id}
                  type="button"
                  aria-pressed={kind === k.id}
                  onClick={() => {
                    setKind(k.id);
                    setIndustry("All");
                    setOpen(null);
                  }}
                  className={`shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-sm transition-colors ${
                    kind === k.id ? "bg-paper text-ink" : "border border-line text-paper/70 hover:text-paper"
                  }`}
                >
                  {k.label}
                  <sup className="ml-1 font-mono text-[9px] opacity-60">{count(k.id)}</sup>
                </button>
              ))}
            </div>
            <div
              role="group"
              aria-label="Filter by industry"
              className="-mx-5 flex min-w-0 gap-1 overflow-x-auto px-5 [mask-image:linear-gradient(to_right,black_92%,transparent)] [scrollbar-width:none] sm:mx-0 sm:px-0 lg:pr-10"
            >
              {(["All", ...industries] as const).map((ind) => {
                const disabled = ind !== "All" && !available.has(ind);
                return (
                  <button
                    key={ind}
                    type="button"
                    disabled={disabled}
                    aria-pressed={industry === ind}
                    onClick={() => setIndustry(ind)}
                    className={`shrink-0 rounded-full px-3 py-1.5 text-xs transition-colors disabled:opacity-25 ${
                      industry === ind ? "bg-brand text-ink" : "text-paper/60 hover:text-paper"
                    }`}
                  >
                    {ind}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.25em] text-muted" aria-live="polite">
          Showing {list.length} {list.length === 1 ? "piece" : "pieces"}
        </p>

        {list.length === 0 && (
          <div className="mt-10 flex flex-col items-center gap-6 rounded-[2rem] border border-dashed border-line px-6 py-20 text-center">
            {/* an empty orbit */}
            <svg viewBox="0 0 120 120" className="size-24" aria-hidden>
              <ellipse cx="60" cy="60" rx="52" ry="20" fill="none" stroke="var(--line)" transform="rotate(-18 60 60)" />
              <circle cx="60" cy="60" r="14" fill="var(--ink-2)" />
              <circle cx="60" cy="60" r="14" fill="none" stroke="var(--brand)" strokeOpacity="0.7" />
              <circle cx="104" cy="44" r="3" fill="var(--brand)" />
            </svg>
            <p className="font-display text-2xl font-semibold">Nothing in this orbit yet.</p>
            <p className="max-w-xs text-sm text-muted">We haven&apos;t published a {kind === "all" ? "piece" : kind === "video" ? "video" : "graphic"} for {industry} yet, but it&apos;s exactly the kind of thing we make.</p>
            <div className="flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setKind("all");
                  setIndustry("All");
                }}
                className="rounded-full border border-line px-5 py-2.5 text-sm text-paper/80 transition-colors hover:border-paper hover:text-paper"
              >
                Show everything
              </button>
              <button
                type="button"
                onClick={() => lenis?.scrollTo("#contact", { duration: 1.6 })}
                className="rounded-full bg-brand px-5 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-paper"
              >
                Ask us for one →
              </button>
            </div>
          </div>
        )}

        {/* Masonry dealt left-to-right, so the first pieces sit side by side across the top row */}
        <div className="mt-6 grid gap-4" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
          {Array.from({ length: cols }, (_, c) => (
            <div key={c} className="flex flex-col gap-4">
              <AnimatePresence mode="popLayout">
                {list.map((p, i) =>
                  i % cols === c ? (
                    <Tile
                      key={p.id}
                      p={p}
                      index={i}
                      onOpen={(el) => {
                        opener.current = el;
                        setOpen(i);
                      }}
                    />
                  ) : null,
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {open !== null && list[open] && (
          <Lightbox
            list={list}
            index={open}
            onClose={close}
            onStep={(d) => setOpen((o) => (o === null ? o : (o + d + list.length) % list.length))}
            onContact={() => {
              setOpen(null);
              lenis?.start();
              lenis?.scrollTo("#contact", { duration: 1.6 });
            }}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
