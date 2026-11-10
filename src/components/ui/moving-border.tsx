"use client";

import { motion, useAnimationFrame, useInView, useMotionTemplate, useMotionValue, useReducedMotion, useTransform } from "motion/react";
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { cn } from "@/lib/utils";

// Only the outer `--rim` of the box shows through: everything inside it is masked away.
const rimOnly: CSSProperties = {
  padding: "var(--rim)",
  mask: "linear-gradient(#000 0 0) content-box exclude, linear-gradient(#000 0 0)",
};

// A light that travels around the edge of its parent, like a moon on its orbit: put it inside any `relative`
// element (it takes that element's size and corner radius) and it lights the rim as it passes. The site uses it
// on the "Orbit Check" buttons, so that action looks the same wherever it appears.
// From Aceternity UI (`npx shadcn add @aceternity/moving-border`), adapted for this site: it's a layer to drop
// into the site's own buttons rather than a button of its own, it follows the real corner radius (a pill stays
// a pill), the light is the brand pink, and it stops while off-screen and stays hidden with reduced motion.
export function MovingBorder({
  children,
  duration = 7000,
  width = 1,
  className,
}: {
  /** The light itself; defaults to a soft pink glow. */
  children?: ReactNode;
  /** Time for one lap, in ms. */
  duration?: number;
  /** Thickness of the lit rim, in px. */
  width?: number;
  className?: string;
}) {
  const box = useRef<HTMLSpanElement>(null);
  const path = useRef<SVGRectElement>(null);
  const length = useRef(0);
  const [shape, setShape] = useState({ w: 0, h: 0, r: 0 });
  const reduce = useReducedMotion();
  const inView = useInView(box);
  const progress = useMotionValue(0);

  // The track is the box's own outline: follow its size and its corner radius as they change.
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const measure = () => {
      const [w, h] = [el.offsetWidth, el.offsetHeight];
      const r = Math.min(parseFloat(getComputedStyle(el).borderTopLeftRadius) || 0, w / 2, h / 2);
      setShape((s) => (s.w === w && s.h === h && s.r === r ? s : { w, h, r }));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  useEffect(() => {
    length.current = path.current?.getTotalLength() ?? 0;
  }, [shape]);

  useAnimationFrame((time) => {
    if (!inView || reduce || !length.current) return;
    progress.set(((time % duration) / duration) * length.current);
  });

  const x = useTransform(progress, (v) => (length.current ? (path.current?.getPointAtLength(v).x ?? 0) : 0));
  const y = useTransform(progress, (v) => (length.current ? (path.current?.getPointAtLength(v).y ?? 0) : 0));
  const transform = useMotionTemplate`translateX(${x}px) translateY(${y}px) translateX(-50%) translateY(-50%)`;

  return (
    <span
      ref={box}
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 block overflow-hidden rounded-[inherit] motion-reduce:hidden", className)}
      style={{ ...rimOnly, "--rim": `${width}px` } as CSSProperties}
    >
      <svg className="absolute inset-0 size-full" width="100%" height="100%">
        <rect ref={path} fill="none" width={shape.w} height={shape.h} rx={shape.r} ry={shape.r} />
      </svg>
      <motion.span className="absolute left-0 top-0 block" style={{ transform, opacity: shape.w ? 1 : 0 }}>
        {children ?? <span className="block size-24 bg-[radial-gradient(closest-side,var(--brand-2)_0%,var(--brand)_35%,transparent_100%)]" />}
      </motion.span>
    </span>
  );
}
