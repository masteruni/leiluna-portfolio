"use client";

import { useEffect, useId, useRef, useState } from "react";

// Where the night of the hero meets the page: the page rises into the dark in a shallow curve, like the edge of a
// moon, so the two never meet in a hard line (in light mode the page below is pale). No words, no motion: the hero's
// planet is the one glowing horizon; this is only the seam.
export function HorizonLoop() {
  const id = useId().replace(/:/g, "");
  const wrap = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(1440);

  // Drawn in real pixels so the curve keeps its shape at any width.
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setW(Math.round(e.contentRect.width)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const h = Math.round(Math.min(110, Math.max(56, w * 0.07))); // height of the seam
  const apex = Math.round(h * 0.45); // how high the curve rises in the middle
  const cy = Math.round((4 * apex - 2 * h) / 2); // control point that puts the curve's top at `apex`
  const limb = `M -40 ${h} Q ${w / 2} ${cy} ${w + 40} ${h}`;

  return (
    <div
      ref={wrap}
      aria-hidden
      className="pointer-events-none relative z-10 select-none"
      // overlaps the bottom of the hero, so the two read as one sky
      style={{ marginTop: -h }}
    >
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="block w-full" style={{ height: h }}>
        <defs>
          <linearGradient id={`rim-${id}`} x1="0" x2="1">
            <stop offset="0" stopColor="var(--brand)" stopOpacity="0" />
            <stop offset="0.5" stopColor="var(--brand-2)" stopOpacity="0.7" />
            <stop offset="1" stopColor="var(--brand)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* the page rising as a moon */}
        <path d={`${limb} V ${h + 2} H -40 Z`} className="horizon-moon" />
        {/* a faint pink rim along the edge */}
        <path d={limb} fill="none" stroke={`url(#rim-${id})`} strokeWidth="1" />
      </svg>
    </div>
  );
}
