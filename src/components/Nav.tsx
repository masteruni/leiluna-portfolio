"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useSpring } from "motion/react";
import { useLenis } from "lenis/react";
import { profileLinks, site } from "@/content/site";
import { useAnchor } from "@/lib/anchor";
import { useFocusTrap } from "@/lib/focus";
import { useActiveSection } from "@/lib/useActiveSection";
import { Magnetic } from "./Magnetic";

const links = [
  { href: "/#work", id: "work", label: "Work" },
  { href: "/#library", id: "library", label: "Library" },
  { href: "/#services", id: "services", label: "Services" },
  { href: "/#studio", id: "studio", label: "Studio" },
  { href: "/#contact", id: "contact", label: "Contact" },
];
const ids = links.map((l) => l.id);

export function Nav() {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const menu = useRef<HTMLElement>(null);
  const lenis = useLenis(({ direction, scroll }) => setHidden(direction === 1 && scroll > 200));
  const anchor = useAnchor();
  const active = useActiveSection(ids);
  // Thin line under the header: how far down the page you are.
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });
  useFocusTrap(menu, open);

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

        {/* Desktop: the sections are one click away without opening the menu. A pink pill slides to the
            section you're reading; a faint one follows the pointer. */}
        <nav
          aria-label="Sections"
          onMouseLeave={() => setHovered(null)}
          className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 rounded-full border border-line bg-ink/50 p-1.5 backdrop-blur-md lg:flex"
        >
          {links.map((l) => {
            const current = active === l.id;
            return (
              <Link
                key={l.href}
                href={l.href}
                onClick={anchor}
                onMouseEnter={() => setHovered(l.id)}
                aria-current={current ? "location" : undefined}
                className={`relative rounded-full px-4 py-2 text-sm transition-colors duration-300 ${current ? "text-ink" : "text-paper/70 hover:text-paper"}`}
              >
                {hovered === l.id && !current && (
                  <motion.span
                    layoutId="nav-hover"
                    aria-hidden
                    className="absolute inset-0 rounded-full bg-paper/10"
                    transition={{ type: "spring", stiffness: 500, damping: 40 }}
                  />
                )}
                {current && (
                  <motion.span
                    layoutId="nav-pill"
                    aria-hidden
                    className="absolute inset-0 rounded-full bg-brand"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                <span className="relative">{l.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <Magnetic className="hidden sm:block">
            <Link
              href="/#contact"
              onClick={anchor}
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
        <motion.span aria-hidden className="scroll-progress" style={{ scaleX: progress }} />
      </header>

      <AnimatePresence>
        {open && (
          // Slides in as one viewport-sized layer (transform only), so phones and tablets animate it on the GPU
          // instead of repainting the whole screen every frame, which broke up into blocks on Android.
          <motion.nav
            ref={menu}
            id="menu"
            aria-label="Main"
            className="fixed inset-0 z-[70] flex flex-col justify-between gap-6 overflow-y-auto overflow-x-hidden bg-ink px-5 pb-8 pt-28 will-change-transform sm:px-10 short:pb-5 short:pt-20"
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%", transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1], delay: 0.15 } }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
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
                    exit={{ y: "100%", transition: { duration: 0.3, ease: [0.76, 0, 0.24, 1], delay: i * 0.03 } }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.25 + i * 0.07 }}
                  >
                    <Link
                      href={l.href}
                      aria-current={active === l.id ? "location" : undefined}
                      onClick={(e) => {
                        setOpen(false);
                        anchor(e);
                      }}
                      className="group flex items-baseline gap-4 py-1 font-display text-[clamp(2rem,min(11vw,calc((100svh-19rem)/4.8)),9rem)] font-semibold leading-[0.95] tracking-[-0.04em]"
                    >
                      <span className="font-mono text-xs font-normal tracking-normal text-muted">0{i + 1}</span>
                      <span className={`transition-all duration-500 group-hover:translate-x-4 group-hover:text-brand ${active === l.id ? "text-brand" : ""}`}>
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
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
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
                {profileLinks.map((s) => (
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
