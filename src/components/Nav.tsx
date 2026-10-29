"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useLenis } from "lenis/react";
import { site } from "@/content/site";
import { Magnetic } from "./Magnetic";

const links = [
  { href: "/#work", label: "Work" },
  { href: "/#library", label: "Library" },
  { href: "/#services", label: "Services" },
  { href: "/#studio", label: "Studio" },
  { href: "/#contact", label: "Contact" },
];

export function Nav() {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lenis = useLenis(({ direction, scroll }) => setHidden(direction === 1 && scroll > 200));

  useEffect(() => {
    if (open) lenis?.stop();
    else lenis?.start();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, lenis]);

  return (
    <>
      <header
        // Keyboard users tabbing into the header bring it back even while scrolled down.
        onFocusCapture={() => setHidden(false)}
        className={`fixed inset-x-0 top-0 z-[80] flex items-center justify-between px-5 py-5 transition-transform duration-700 ease-[var(--ease-out)] sm:px-10 ${
          hidden && !open ? "-translate-y-full" : ""
        }`}
      >
        <Link href="/" aria-label={`${site.name} home`} className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <Image src="/brand/mark.png" alt="" width={36} height={38} priority className="h-9 w-auto" />
          <span className="hidden font-display text-lg font-semibold tracking-tight sm:block">
            leiluna<span className="ml-1.5 align-middle font-mono text-[10px] font-normal uppercase tracking-[0.3em] text-muted">studio</span>
          </span>
        </Link>

        {/* Desktop: the sections are one click away without opening the menu */}
        <nav aria-label="Sections" className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 lg:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="group relative py-1 text-sm text-paper/70 transition-colors hover:text-paper">
              {l.label}
              <span className="absolute inset-x-0 -bottom-px h-px origin-left scale-x-0 bg-brand transition-transform duration-500 ease-[var(--ease-out)] group-hover:scale-x-100" />
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Magnetic className="hidden sm:block">
            <Link
              href="/#contact"
              className="block rounded-full border border-line bg-ink/50 px-5 py-2.5 text-sm backdrop-blur-md transition-colors duration-300 hover:border-brand hover:bg-brand hover:text-ink"
            >
              Let&apos;s talk
            </Link>
          </Magnetic>
          <Magnetic>
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls="menu"
              className="flex items-center gap-3 rounded-full bg-paper py-2.5 pl-5 pr-4 text-sm font-medium text-ink"
            >
              <span>{open ? "Close" : "Menu"}</span>
              <span className="relative block h-2.5 w-4">
                <span className={`absolute left-0 block h-px w-4 bg-ink transition-all duration-500 ${open ? "top-1 rotate-45" : "top-0"}`} />
                <span className={`absolute left-0 block h-px w-4 bg-ink transition-all duration-500 ${open ? "top-1 -rotate-45" : "top-2"}`} />
              </span>
            </button>
          </Magnetic>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.nav
            id="menu"
            aria-label="Main"
            className="fixed inset-0 z-[70] flex flex-col justify-between gap-6 overflow-y-auto overflow-x-hidden bg-ink px-5 pb-8 pt-28 sm:px-10 short:pb-5 short:pt-20"
            initial={{ clipPath: "circle(0% at 100% 0%)" }}
            animate={{ clipPath: "circle(150% at 100% 0%)" }}
            exit={{ clipPath: "circle(0% at 100% 0%)" }}
            transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
          >
            {/* orbit decoration */}
            <svg aria-hidden viewBox="0 0 600 600" className="animate-spin-slow pointer-events-none absolute -right-40 top-1/2 size-[110vmin] -translate-y-1/2 opacity-40">
              <circle cx="300" cy="300" r="290" fill="none" stroke="var(--line)" />
              <circle cx="300" cy="300" r="200" fill="none" stroke="var(--line)" />
              <circle cx="300" cy="10" r="6" fill="var(--brand)" />
              <circle cx="100" cy="300" r="4" fill="var(--paper)" />
            </svg>

            <ul className="relative">
              {links.map((l, i) => (
                <li key={l.href} className="overflow-hidden">
                  <motion.div
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "100%" }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.25 + i * 0.07 }}
                  >
                    <Link
                      href={l.href}
                      onClick={() => setOpen(false)}
                      className="group flex items-baseline gap-4 py-1 font-display text-[clamp(2rem,min(11vw,calc((100svh-19rem)/4.8)),9rem)] font-semibold leading-[0.95] tracking-[-0.04em]"
                    >
                      <span className="font-mono text-xs font-normal tracking-normal text-muted">0{i + 1}</span>
                      <span className="transition-all duration-500 group-hover:translate-x-4 group-hover:text-brand">
                        {l.label}
                      </span>
                      <span className="serif text-[0.5em] text-brand opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                        ✦
                      </span>
                    </Link>
                  </motion.div>
                </li>
              ))}
            </ul>

            <motion.div
              className="relative flex flex-col gap-4 border-t border-line pt-6 text-sm text-muted sm:flex-row sm:items-center sm:justify-between"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.6 } }}
              exit={{ opacity: 0 }}
            >
              <div className="flex flex-col gap-2">
                {site.available && (
                  <span className="flex items-center gap-2.5 font-mono text-[10px] uppercase tracking-[0.25em] text-paper/70">
                    <span className="pulse relative size-1.5 rounded-full bg-brand" />
                    Open for new projects
                  </span>
                )}
                <a href={`mailto:${site.email}`} className="text-paper hover:text-brand">
                  {site.email}
                </a>
              </div>
              <div className="flex gap-6">
                {site.socials.map((s) => (
                  <a key={s.label} href={s.href} target="_blank" rel="noreferrer" className="hover:text-paper">
                    {s.label}
                  </a>
                ))}
              </div>
            </motion.div>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}
