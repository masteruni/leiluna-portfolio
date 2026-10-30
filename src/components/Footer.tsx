"use client";

import Link from "next/link";
import { useRef, useSyncExternalStore } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useLenis } from "lenis/react";
import { profileLinks, site } from "@/content/site";
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

export function Footer() {
  const lenis = useLenis();
  const year = useSyncExternalStore(noSubscribe, currentYear, noYear);
  const floor = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: floor, offset: ["start end", "end end"] });
  const rise = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["55%", "0%"]);
  const glow = useTransform(scrollYProgress, [0, 1], reduce ? [1, 1] : [0.15, 1]);
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
                <Link href={l.href} className="text-paper/70 transition-colors hover:text-brand">
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

      {/* The wordmark rises out of the floor as the page ends */}
      <div ref={floor} className="mx-auto mt-16 max-w-7xl overflow-hidden">
        <motion.div style={{ y: rise, opacity: glow }}>
          <Wordmark title={site.name} className="h-auto w-full select-none text-paper/90" />
        </motion.div>
      </div>
      <div className="mx-auto flex max-w-7xl flex-col gap-3 py-6 font-mono text-[10px] uppercase tracking-[0.25em] text-muted sm:flex-row sm:justify-between sm:gap-10">
        <span>© {year ? `${year} ` : ""}{site.name}. All work shown is protected and may not be downloaded or reused without permission.</span>
        <span>Your story. Our creative orbit.</span>
      </div>
    </footer>
  );
}
