"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { brands, recent, type RecentPiece } from "@/content/recent";
import { openClip } from "@/lib/showreel";
import { Eyebrow } from "./Eyebrow";
import { LineReveal } from "./LineReveal";
import { ArrowCircle, IconButton, Tag } from "./ui";

const isVideo = (src: string) => src.endsWith(".mp4");

// A video plays (muted, looping) only while its card is on screen, so a row of them doesn't all decode at once.
function Clip({ src, poster }: { src: string; poster?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
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
  }, []);
  return <video ref={ref} src={src} poster={poster} muted loop playsInline preload="metadata" className="absolute inset-0 size-full object-cover" />;
}

function Card({ p }: { p: RecentPiece }) {
  const brand = brands.find((b) => b.name === p.brand);
  const video = isVideo(p.src);
  const body = (
    <>
      <div className="relative aspect-[4/5] overflow-hidden rounded-[1.4rem] border border-line bg-ink-2">
        {video ? (
          <Clip src={p.preview ?? p.src} poster={p.poster} />
        ) : (
          <Image
            src={p.src}
            alt={`${p.title}, for ${p.brand}`}
            fill
            sizes="(min-width: 1024px) 22rem, 75vw"
            className="object-cover object-top transition-transform duration-500 ease-[var(--ease-out)] group-hover:scale-[1.04]"
          />
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
      <div className="mt-4 flex items-center gap-2.5">
        {brand && <Image src={brand.logo} alt="" width={24} height={24} className="size-6 rounded-full border border-line object-cover" />}
        <span className="truncate text-sm text-paper/60">
          {p.brand}
          {p.date && <span className="text-paper/40"> · {p.date}</span>}
        </span>
      </div>
      <p className="mt-1.5 text-lg font-medium leading-snug tracking-[-0.01em] transition-colors duration-300 group-hover:text-accent">{p.title}</p>
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

// The latest pieces from the brands we work with right now, as a row you can swipe or step through. Content lives
// in src/content/recent.ts.
export function RecentWork() {
  const rail = useRef<HTMLUListElement>(null);
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
  }, []);

  const step = (dir: 1 | -1) => {
    const el = rail.current;
    const card = el?.querySelector("li");
    if (!el || !card) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: dir * (card.getBoundingClientRect().width + 24), behavior: reduce ? "auto" : "smooth" });
  };

  if (!recent.length) return null;

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
          <p className="max-w-sm text-lg text-paper/60">The latest from the brands we&rsquo;re working with right now, added as it goes live.</p>
        </div>

        <div className="mt-12 flex flex-col gap-5 border-y border-line py-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <span className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.25em] text-paper/60">
              <span className="relative flex size-2">
                <span className="absolute inset-0 animate-ping rounded-full bg-brand opacity-60 motion-reduce:animate-none" />
                <span className="relative size-2 rounded-full bg-brand" />
              </span>
              Now working with
            </span>
            {brands.map((b) => {
              const inner = (
                <>
                  <Image src={b.logo} alt="" width={28} height={28} className="size-7 rounded-full border border-line object-cover" />
                  <span>{b.name}</span>
                </>
              );
              return b.url ? (
                <a key={b.name} href={b.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 text-sm transition-colors hover:text-accent">
                  {inner}
                </a>
              ) : (
                <span key={b.name} className="flex items-center gap-2.5 text-sm">
                  {inner}
                </span>
              );
            })}
          </div>
          <div className="hidden gap-2 sm:flex">
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
          <Card key={`${p.src}-${i}`} p={p} />
        ))}
      </ul>
    </section>
  );
}
