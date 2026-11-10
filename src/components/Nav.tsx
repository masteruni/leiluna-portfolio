"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { AnimatePresence, motion, useScroll, useSpring } from "motion/react";
import { useLenis } from "lenis/react";
import { profileLinks, site } from "@/content/site";
import { useAnchor } from "@/lib/anchor";
import { setBriefOpen } from "@/lib/brief";
import { useFocusTrap } from "@/lib/focus";
import { useTheme } from "@/lib/theme";
import { useActiveSection } from "@/lib/useActiveSection";
import { useOverNight } from "@/lib/useOverNight";
import { track } from "@/lib/track";
import { Mark } from "./Mark";
import { ThemeToggle } from "./ThemeToggle";
import { buttonClass } from "./ui";

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
  const [scrolled, setScrolled] = useState(false);
  const menu = useRef<HTMLElement>(null);
  const header = useRef<HTMLElement>(null);
  const lenis = useLenis(({ direction, scroll }) => setHidden(direction === 1 && scroll > 200));
  const anchor = useAnchor();

  // The menu's main button: close the menu, open the project brief and glide to it.
  const startProject = () => {
    track("Start project", { from: "menu" });
    setOpen(false);
    setBriefOpen(true);
    requestAnimationFrame(() => {
      const target = document.querySelector<HTMLElement>("#project-brief") ?? document.querySelector<HTMLElement>("#contact");
      if (!target) return;
      if (lenis) lenis.scrollTo(target, { offset: -140, duration: 1.6, force: true });
      else target.scrollIntoView({ behavior: "smooth" });
    });
  };
  const active = useActiveSection(ids);
  // Thin line under the header: how far down the page you are.
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });
  useFocusTrap(menu, open);

  // In light mode the header floats over both light sections and the dark "night" ones (hero, contact,
  // footer): it takes on the night colours while it's over one, so it always stays readable.
  const overNight = useOverNight(() => 40);

  // The phone's status bar and browser chrome take their colour from <meta name="theme-color">. The site's own
  // light/dark switch and its dark sections don't follow the device setting, so match the colour to whatever is
  // actually at the top of the screen.
  const theme = useTheme();
  useEffect(() => {
    if (!theme) return;
    const dark = theme === "dark" || (overNight && !open);
    document.querySelectorAll('meta[name="theme-color"]').forEach((m) => m.setAttribute("content", dark ? "#050506" : "#f6f2ef"));
  }, [theme, overNight, open]);

  // Once the page has scrolled, the header gets a frosted background so nothing shows through it.
  useEffect(() => {
    const check = () => setScrolled(window.scrollY > 24);
    check();
    window.addEventListener("scroll", check, { passive: true });
    return () => window.removeEventListener("scroll", check);
  }, []);

  // Other sticky bars (the Library filters) sit just below the header while it's showing and slide up when
  // it hides, so the two never overlap: they read --header-h and data-header on <html> (see globals.css).
  const shown = !hidden || open;
  useEffect(() => {
    document.documentElement.dataset.header = shown ? "shown" : "hidden";
  }, [shown]);
  useEffect(() => {
    const el = header.current;
    if (!el) return;
    const ro = new ResizeObserver(() => document.documentElement.style.setProperty("--header-h", `${el.offsetHeight}px`));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // The menu belongs to phone and tablet widths: if the window grows to desktop while it's open, close it.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const close = () => mq.matches && setOpen(false);
    mq.addEventListener("change", close);
    return () => mq.removeEventListener("change", close);
  }, []);

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
        ref={header}
        // Keyboard users tabbing into the header bring it back even while scrolled down.
        onFocusCapture={() => setHidden(false)}
        className={`fixed inset-x-0 top-0 z-[80] flex items-center justify-between border-b px-5 py-5 text-paper transition-[transform,background-color,border-color] duration-400 ease-[var(--ease-out)] sm:px-10 ${
          hidden && !open ? "-translate-y-full" : ""
        } ${overNight && !open ? "over-night" : ""} ${scrolled && !open ? "border-line bg-ink/75 backdrop-blur-xl" : "border-transparent"}`}
      >
        <Link href="/" aria-label={`${site.name} home`} className="flex items-center gap-3 pointer-coarse:min-h-11 pointer-coarse:min-w-11" onClick={() => setOpen(false)}>
          <Mark width={36} height={38} priority className="h-9 w-auto" />
          <span className="hidden font-display text-lg font-semibold tracking-tight sm:block">
            leiluna<span className="ml-1.5 align-middle text-xs font-normal text-muted">studio</span>
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
                className={`relative rounded-full px-4 py-2 text-sm press duration-300 ${current ? "text-on-brand" : "text-paper/70 hover:text-paper"}`}
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
          <ThemeToggle />
          <Link
            href="/#contact"
            onClick={anchor}
            className="hidden rounded-full border border-line bg-ink/50 px-5 py-2.5 text-sm backdrop-blur-md press duration-300 hover:border-brand hover:bg-brand hover:text-on-brand sm:block lg:bg-brand lg:font-medium lg:text-on-brand lg:hover:border-paper lg:hover:bg-paper lg:hover:text-ink lg:border-brand"
          >
            Let&apos;s talk
          </Link>
          {/* Below desktop width the links live in the menu; on desktop they're already in the header, so there's
              no second way in. */}
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="menu"
            className="flex items-center gap-3 press rounded-full bg-paper py-2.5 pl-5 pr-4 text-sm font-medium text-ink pointer-coarse:min-h-11 lg:hidden"
          >
            <span>{open ? "Close" : "Menu"}</span>
            <span className="relative block h-2.5 w-4">
              <span className={`absolute left-0 top-1 block h-px w-4 bg-ink transition-[translate,rotate] duration-300 ease-[var(--ease-out)] ${open ? "rotate-45" : "-translate-y-1"}`} />
              <span className={`absolute left-0 top-1 block h-px w-4 bg-ink transition-[translate,rotate] duration-300 ease-[var(--ease-out)] ${open ? "-rotate-45" : "translate-y-1"}`} />
            </span>
          </button>
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
            className="fixed inset-0 z-[70] flex flex-col justify-between gap-6 overflow-y-auto overflow-x-hidden overscroll-contain bg-ink px-5 pb-8 pt-28 will-change-transform sm:px-10 short:pb-5 short:pt-20"
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            // Opens on the iOS drawer curve; closes faster than it opens, once the links have dropped away.
            exit={{ y: "-100%", transition: { duration: 0.35, ease: [0.77, 0, 0.175, 1], delay: 0.08 } }}
            transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
          >
            <ul className="relative">
              {links.map((l, i) => (
                <li key={l.href} className="overflow-hidden">
                  <motion.div
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "100%", transition: { duration: 0.2, ease: [0.77, 0, 0.175, 1], delay: i * 0.02 } }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.15 + i * 0.05 }}
                  >
                    <Link
                      href={l.href}
                      aria-current={active === l.id ? "location" : undefined}
                      onClick={(e) => {
                        setOpen(false);
                        anchor(e);
                      }}
                      className={`block py-1 font-display text-[clamp(2rem,min(11vw,calc((100svh-19rem)/4.8)),9rem)] font-semibold leading-[0.95] tracking-[-0.04em] transition-colors duration-300 hover:text-accent ${active === l.id ? "text-accent" : ""}`}
                    >
                      {l.label}
                    </Link>
                  </motion.div>
                </li>
              ))}
            </ul>

            <motion.div
              className="relative flex flex-col gap-6 border-t border-line pt-6 text-sm text-muted sm:flex-row sm:items-end sm:justify-between"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.6 } }}
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
            >
              <div className="flex flex-col gap-3">
                <button type="button" onClick={startProject} className={buttonClass("primary", "lg", "min-h-12 gap-3 self-start px-7 text-base")}>
                  Start a project
                  <ArrowRight aria-hidden className="size-4" />
                </button>
                {site.available && (
                  <span className="text-xs text-paper/70">Open for new projects</span>
                )}
                <a href={`mailto:${site.email}`} onClick={() => track("Email clicked", { from: "menu" })} className="text-paper hover:text-accent">
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
