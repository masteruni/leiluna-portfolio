"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { brands as demoBrands, recent as demoRecent, type Brand, type RecentPiece } from "@/content/recent";
import { openClip } from "@/lib/showreel";
import { Eyebrow } from "./Eyebrow";
import { LineReveal } from "./LineReveal";
import { ArrowCircle, IconButton, Tag } from "./ui";

const isVideo = (src: string) => src.endsWith(".mp4");

// A video plays (muted, looping) only while its card is on screen, so a row of them doesn't all decode at once.
// A video without a `preview` only shows its poster here (the full file is often 15MB+); it still plays in full
// when tapped.
function Clip({ src, poster, still }: { src: string; poster?: string; still?: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = ref.current;
    if (!v || still) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !reduce) v.play().catch(() => {});
        else v.pause();
      },
      { threshold: 0.5 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, [still]);
  return (
    <video
      ref={ref}
      src={still ? undefined : src}
      poster={poster}
      muted
      loop
      playsInline
      preload={still ? "none" : "metadata"}
      className="absolute inset-0 size-full object-cover"
    />
  );
}

// A brand's round logo, or its first letter when there's no logo or the file is missing (a typo, a forgotten upload).
function BrandMark({ name, logo, size }: { name: string; logo?: string; size: 24 | 28 }) {
  const [failed, setFailed] = useState(false);
  const box = size === 24 ? "size-6 text-[11px]" : "size-7 text-xs";
  if (!logo || failed) {
    const initial = Array.from(new Intl.Segmenter(undefined, { granularity: "grapheme" }).segment(name.trim()))[0]?.segment ?? "?";
    return (
      <span aria-hidden className={`grid shrink-0 place-items-center rounded-full border border-line bg-ink-3 font-medium uppercase text-paper/80 ${box}`}>
        {initial}
      </span>
    );
  }
  return (
    <Image
      src={logo}
      alt=""
      width={size}
      height={size}
      onError={() => setFailed(true)}
      className={`shrink-0 rounded-full border border-line object-cover ${box}`}
    />
  );
}

// The card's picture, or a quiet branded panel if the file is missing, instead of a broken-image icon.
function CardImage({ src, alt, brand }: { src: string; alt: string; brand: string }) {
  const [failed, setFailed] = useState(false);
  if (failed)
    return (
      <span role="img" aria-label={alt} className="absolute inset-0 grid place-items-center bg-ink-2 p-6 text-center">
        <span className="serif text-2xl text-paper/50">{brand}</span>
      </span>
    );
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes="(min-width: 1024px) 22rem, 75vw"
      onError={() => setFailed(true)}
      className="object-cover object-top transition-transform duration-500 ease-[var(--ease-out)] group-hover:scale-[1.04]"
    />
  );
}

function Card({ p, brands }: { p: RecentPiece; brands: Brand[] }) {
  const brand = brands.find((b) => b.name === p.brand);
  const video = isVideo(p.src);
  // Development only: point out entries that will look unfinished, once per card.
  useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    if (!brand) console.warn(`Recent work: "${p.brand}" isn't in \`brands\` (src/content/recent.ts), so it has no logo.`);
    if (video && !p.preview) console.warn(`Recent work: "${p.title}" has no \`preview\`, so its card shows only the poster.`);
  }, [brand, video, p.brand, p.title, p.preview]);
  const body = (
    <>
      <div className="relative aspect-[4/5] overflow-hidden rounded-[1.4rem] border border-line bg-ink-2">
        {video ? (
          <Clip src={p.preview ?? p.src} poster={p.poster} still={!p.preview} />
        ) : (
          <CardImage src={p.src} alt={`${p.title}, for ${p.brand}`} brand={p.brand} />
        )}
        <Tag className="absolute left-3 top-3">{p.kind}</Tag>
        {video && !p.link && (
          <span
            aria-hidden
            className="absolute right-3 top-3 grid size-8 place-items-center rounded-full bg-paper text-ink transition-colors duration-200 group-hover:bg-brand group-hover:text-on-brand"
          >
            <span className="ml-0.5 border-y-[5px] border-l-[8px] border-y-transparent border-l-current" />
          </span>
        )}
        {p.link && (
          <ArrowCircle size="sm" className="absolute right-3 top-3" />
        )}
      </div>
      <div className="mt-4 flex min-w-0 items-center gap-2.5 text-sm">
        <BrandMark name={p.brand} logo={brand?.logo} size={24} />
        <span className="min-w-0 truncate text-paper/60" title={p.brand}>
          {p.brand}
        </span>
        {p.date && <span className="shrink-0 whitespace-nowrap text-paper/40">· {p.date}</span>}
      </div>
      <p
        title={p.title}
        className="mt-1.5 line-clamp-3 text-lg font-medium leading-snug tracking-[-0.01em] [overflow-wrap:anywhere] transition-colors duration-300 group-hover:text-accent"
      >
        {p.title}
      </p>
    </>
  );
  return (
    <li className="w-[min(75vw,20rem)] shrink-0 snap-start lg:w-[22rem]">
      {p.link ? (
        <a href={p.link} target="_blank" rel="noopener noreferrer" data-cursor="Open" className="group block">
          {body}
          <span className="sr-only"> (opens the post in a new tab)</span>
        </a>
      ) : video ? (
        <button
          type="button"
          onClick={() => openClip({ src: p.src, poster: p.poster, title: `${p.title}, for ${p.brand}`, vertical: p.vertical })}
          data-cursor="Play"
          className="group block w-full text-left"
        >
          {body}
          <span className="sr-only"> (play with sound)</span>
        </button>
      ) : (
        <div className="group">{body}</div>
      )}
    </li>
  );
}

// Dev-only switch between the real data and test data (break-ui). Plain chrome, not part of the design.
function DataToggle({ mode }: { mode: string }) {
  const modes = [
    ["demo", "Demo data"],
    ["worst", "Worst case"],
    ["empty", "Empty"],
    ["one", "One"],
    ["many", "24 pieces"],
  ] as const;
  return (
    <div
      role="group"
      aria-label="Recent work test data (development only)"
      className="fixed bottom-4 left-1/2 z-[100] flex -translate-x-1/2 gap-0.5 rounded-full bg-[#e5e5e5] p-1 font-sans text-xs text-[#222] shadow-lg"
    >
      {modes.map(([m, label]) => (
        <button
          key={m}
          type="button"
          aria-pressed={mode === m}
          onClick={() => {
            const url = new URL(window.location.href);
            if (m === "demo") url.searchParams.delete("data");
            else url.searchParams.set("data", m);
            history.replaceState(null, "", url);
            window.dispatchEvent(new Event("recent-data"));
          }}
          className={`rounded-full px-3 py-1.5 ${mode === m ? "bg-white shadow" : ""}`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

// Our newest pieces for client brands, as a row you can swipe or step through. (It never says which clients are
// current: the label is "Brands we've worked with".) Content lives
// in src/content/recent.ts.
export function RecentWork() {
  const rail = useRef<HTMLUListElement>(null);
  const [{ brands, recent }, setData] = useState({ brands: demoBrands, recent: demoRecent });
  const [mode, setMode] = useState("demo");

  // Development only: ?data=worst|empty|one|many swaps in test data from src/content/recent.fixtures.ts (the
  // switch at the bottom of the page sets it). The whole branch is removed from production builds.
  useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    const sync = () => {
      const m = new URLSearchParams(window.location.search).get("data") ?? "demo";
      import("@/content/recent.fixtures").then(({ fixtures }) => {
        setMode(fixtures[m] ? m : "demo");
        setData(fixtures[m] ?? { brands: demoBrands, recent: demoRecent });
      });
    };
    sync();
    window.addEventListener("recent-data", sync);
    return () => window.removeEventListener("recent-data", sync);
  }, []);
  const [edge, setEdge] = useState({ start: true, end: false });

  useEffect(() => {
    const el = rail.current;
    if (!el) return;
    const update = () => setEdge({ start: el.scrollLeft < 8, end: el.scrollLeft + el.clientWidth > el.scrollWidth - 8 });
    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [recent]);

  const step = (dir: 1 | -1) => {
    const el = rail.current;
    const card = el?.querySelector("li");
    if (!el || !card) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: dir * (card.getBoundingClientRect().width + 24), behavior: reduce ? "auto" : "smooth" });
  };

  const toggle = process.env.NODE_ENV !== "production" ? <DataToggle mode={mode} /> : null;
  if (!recent.length) return toggle;

  return (
    <section id="recent" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-10">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Eyebrow id="recent" />
            <h2 className="mt-6 font-display text-[clamp(3rem,7vw,7rem)] font-bold leading-[0.88] tracking-[-0.045em]">
              <LineReveal inView lines={["Fresh off", <span key="o" className="serif font-normal text-accent">the timeline.</span>]} />
            </h2>
          </div>
          <p className="max-w-sm text-lg text-paper/60">Our newest pieces for the brands we&rsquo;ve created for.</p>
        </div>

        <div className="mt-12 flex flex-col gap-5 border-y border-line py-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <span className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.25em] text-paper/60">
              Brands we&rsquo;ve worked with
            </span>
            {brands.map((b) => {
              // On phones the row shows logos only, so a long list doesn't push the work off the first screen;
              // the names stay available to screen readers and as a hover title.
              const inner = (
                <>
                  <BrandMark name={b.name} logo={b.logo} size={28} />
                  <span className="max-sm:sr-only">{b.name}</span>
                </>
              );
              return b.url ? (
                <a key={b.name} href={b.url} target="_blank" rel="noopener noreferrer" title={b.name} className="flex items-center gap-2.5 text-sm transition-colors hover:text-accent">
                  {inner}
                </a>
              ) : (
                <span key={b.name} title={b.name} className="flex items-center gap-2.5 text-sm">
                  {inner}
                </span>
              );
            })}
          </div>
          <div className={`hidden gap-2 ${edge.start && edge.end ? "" : "sm:flex"}`}>
            {([-1, 1] as const).map((d) => (
              <IconButton
                key={d}
                onClick={() => step(d)}
                disabled={d === -1 ? edge.start : edge.end}
                label={d === -1 ? "Previous pieces" : "Next pieces"}
              >
                {d === -1 ? "←" : "→"}
              </IconButton>
            ))}
          </div>
        </div>
      </div>

      {/* The row runs to the screen's edge but its first card lines up with the heading above. */}
      <ul
        ref={rail}
        aria-label="Recent pieces"
        className="mt-10 flex snap-x snap-mandatory gap-6 overflow-x-auto overscroll-x-contain px-5 pb-4 [scrollbar-width:none] sm:px-10 lg:scroll-px-[max(2.5rem,calc((100vw-80rem)/2+2.5rem))] lg:px-[max(2.5rem,calc((100vw-80rem)/2+2.5rem))] [&::-webkit-scrollbar]:hidden"
      >
        {recent.map((p, i) => (
          <Card key={`${p.src}-${i}`} p={p} brands={brands} />
        ))}
      </ul>
      {toggle}
    </section>
  );
}
