"use client";

import Link from "next/link";
import { useEffect, useRef, useSyncExternalStore } from "react";
import { motion, useInView, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useLenis } from "lenis/react";
import { profileLinks, site } from "@/content/site";
import { useAnchor } from "@/lib/anchor";
import { Wordmark } from "./Wordmark";

const explore = [
  { href: "/#work", label: "Work" },
  { href: "/#library", label: "Library" },
  { href: "/#services", label: "Services" },
  { href: "/#studio", label: "Studio" },
  { href: "/#contact", label: "Contact" },
];

// The year is read on the client only: a prerendered page may not read the clock (cacheComponents).
const noSubscribe = () => () => {};
const currentYear = () => new Date().getFullYear();
const noYear = () => null;

const heading = "mb-4 font-mono text-[10px] uppercase tracking-[0.25em] text-muted";

// Where the moonlight falls on the wordmark: a soft-edged circle around the --mx / --my point.
const light = (radius: string) => `radial-gradient(circle ${radius} at var(--mx, 50%) var(--my, 50%), #000 0%, transparent 70%)`;

export function Footer() {
  const lenis = useLenis();
  const anchor = useAnchor();
  const year = useSyncExternalStore(noSubscribe, currentYear, noYear);
  const floor = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: floor, offset: ["start end", "end end"] });
  const rise = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["55%", "0%"]);
  const glow = useTransform(scrollYProgress, [0, 1], reduce ? [1, 1] : [0.15, 1]);

  // Moonlight over the wordmark: it follows the mouse, and drifts across on its own when there's no pointer.
  const mark = useRef<HTMLDivElement>(null);
  const pointer = useRef<{ x: number; y: number } | null>(null);
  const markInView = useInView(mark);
  useEffect(() => {
    const el = mark.current;
    if (!el || reduce || !markInView) return;
    const pos = { x: 50, y: 50 };
    let raf = requestAnimationFrame(function loop(t) {
      const target = pointer.current ?? { x: 50 + Math.sin(t / 2600) * 45, y: 50 + Math.cos(t / 3700) * 30 };
      pos.x += (target.x - pos.x) * 0.08;
      pos.y += (target.y - pos.y) * 0.08;
      el.style.setProperty("--mx", `${pos.x}%`);
      el.style.setProperty("--my", `${pos.y}%`);
      raf = requestAnimationFrame(loop);
    });
    return () => cancelAnimationFrame(raf);
  }, [reduce, markInView]);
  return (
    <footer className="relative z-10 border-t border-line bg-ink px-5 pt-14 sm:px-10">
      <div className="mx-auto grid max-w-7xl gap-10 text-sm sm:grid-cols-2 md:grid-cols-5">
        <div className="sm:col-span-2">
          <p className="max-w-xs text-paper/60">{site.description}</p>
        </div>
        <div>
          <p className={heading}>Explore</p>
          <ul className="space-y-2">
            {explore.map((l) => (
              <li key={l.href}>
                <Link href={l.href} onClick={anchor} className="text-paper/70 transition-colors hover:text-brand">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        {profileLinks.length > 0 && (
          <div>
            <p className={heading}>Follow</p>
            <ul className="space-y-2">
              {profileLinks.map((s) => (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noreferrer" className="text-paper/70 transition-colors hover:text-brand">
                    {s.label} ↗
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className="space-y-2 md:text-right">
          <p className={heading}>Say hello</p>
          <a href={`mailto:${site.email}`} className="block break-all text-paper/70 hover:text-brand">
            {site.email}
          </a>
          <button
            type="button"
            onClick={() => (lenis ? lenis.scrollTo(0, { duration: 2 }) : window.scrollTo({ top: 0 }))}
            className="text-paper/70 hover:text-brand"
          >
            Back to orbit ↑
          </button>
        </div>
      </div>

      {/* The wordmark rises out of the floor as the page ends, lit by a moonlight that follows the mouse */}
      <div ref={floor} className="mx-auto mt-16 max-w-7xl overflow-hidden">
        <motion.div
          ref={mark}
          style={{ y: rise, opacity: glow }}
          className="relative"
          onPointerMove={(e) => {
            if (e.pointerType !== "mouse") return;
            const r = e.currentTarget.getBoundingClientRect();
            pointer.current = { x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 };
          }}
          onPointerLeave={() => (pointer.current = null)}
        >
          {/* with reduced motion the wordmark is simply fully lit */}
          <Wordmark title={site.name} className="h-auto w-full select-none text-paper/25 motion-reduce:text-paper/90" />
          <div aria-hidden className="pointer-events-none motion-reduce:hidden">
            <div className="absolute inset-0" style={{ maskImage: light("28vw") }}>
              <Wordmark className="h-auto w-full text-brand-2" />
            </div>
            <div className="absolute inset-0" style={{ maskImage: light("14vw") }}>
              <Wordmark className="h-auto w-full text-paper" />
            </div>
          </div>
        </motion.div>
      </div>
      <div className="mx-auto flex max-w-7xl flex-col gap-3 py-6 font-mono text-[10px] uppercase tracking-[0.25em] text-muted sm:flex-row sm:justify-between sm:gap-10">
        <span>© {year ? `${year} ` : ""}{site.name}. All work shown is protected and may not be downloaded or reused without permission.</span>
        <span>Your story. Our creative orbit.</span>
      </div>
    </footer>
  );
}
