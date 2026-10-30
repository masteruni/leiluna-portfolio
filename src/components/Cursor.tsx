"use client";

import { useEffect, useRef, useState } from "react";

// A soft ring that trails the pointer. Elements can set data-cursor="View" (any label) to morph it.
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState<string | null>(null);
  const [hover, setHover] = useState(false);
  const [away, setAway] = useState(false); // pointer has left the window
  const [overNight, setOverNight] = useState(false); // over a dark section, so light mode draws it in night colours

  useEffect(() => {
    const mq = window.matchMedia("(pointer: fine) and (prefers-reduced-motion: no-preference)");
    if (!mq.matches) return;
    document.documentElement.classList.add("has-cursor");

    const pos = { x: innerWidth / 2, y: innerHeight / 2 };
    const ringPos = { ...pos };
    let raf = 0;

    const move = (e: PointerEvent) => {
      pos.x = e.clientX;
      pos.y = e.clientY;
      setAway(false);
      const t = (e.target as HTMLElement | null)?.closest<HTMLElement>("[data-cursor], a, button") ?? null;
      setLabel(t?.dataset.cursor ?? null);
      setOverNight(!!(e.target as HTMLElement | null)?.closest?.(".night"));
      setHover(!!t);
    };
    const leave = (e: PointerEvent) => {
      // Only when the pointer actually exits the document, not when it crosses into a child element.
      if (!e.relatedTarget) setAway(true);
    };
    const tick = () => {
      ringPos.x += (pos.x - ringPos.x) * 0.16;
      ringPos.y += (pos.y - ringPos.y) * 0.16;
      if (dot.current) dot.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
      if (ring.current) ring.current.style.transform = `translate3d(${ringPos.x}px, ${ringPos.y}px, 0)`;
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener("pointermove", move);
    document.addEventListener("pointerout", leave);
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerout", leave);
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove("has-cursor");
    };
  }, []);

  return (
    <div aria-hidden className={`pointer-events-none fixed inset-0 z-[95] hidden transition-opacity duration-300 in-[.has-cursor]:block ${away ? "opacity-0" : "opacity-100"} ${
        overNight ? "over-night" : ""
      }`}>
      <div ref={dot} className="absolute left-0 top-0">
        <span
          className={`block size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-paper transition-opacity duration-200 ${
            label ? "opacity-0" : "opacity-100"
          }`}
        />
      </div>
      <div ref={ring} className="absolute left-0 top-0">
        <span
          className={`grid -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border font-mono text-[10px] uppercase tracking-widest transition-all duration-500 ease-[var(--ease-out)] ${
            label
              ? "size-24 border-brand bg-brand text-on-brand"
              : hover
                ? "size-14 border-brand/70 bg-brand/10"
                : "size-9 border-paper/40"
          }`}
        >
          {label}
        </span>
      </div>
    </div>
  );
}
