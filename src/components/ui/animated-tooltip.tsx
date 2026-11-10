"use client";

import Image from "next/image";
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import { useState, type PointerEvent } from "react";
import { cn } from "@/lib/utils";

// `face` turns a full portrait into a round avatar without a second, cropped file: where the face sits in the
// photo (x and y, from 0 to 1) and how far to zoom in (1 = the photo's full width fills the circle).
export type TooltipItem = { name: string; image: string; face?: { x: number; y: number; zoom: number } };

const lean = { stiffness: 120, damping: 14 };

// A row of overlapping avatars; with a mouse, each one names itself in a small tooltip that drops below it (so it
// never covers the buttons above the row) and leans with the pointer.
// From Aceternity UI (`npx shadcn add @aceternity/animated-tooltip`), adapted for this site: brand colours,
// next/image, phrasing-only markup (it sits inside a link), mouse only, and no lean or pop with reduced motion.
// The images are decorative (alt=""): give the names in the text beside the row.
export function AnimatedTooltip({
  items,
  size = 28,
  className,
  itemClassName,
  imageClassName,
}: {
  items: TooltipItem[];
  /** Avatar width and height, in px. */
  size?: number;
  className?: string;
  itemClassName?: string;
  /** Classes for the round frame of each avatar (its size, ring, backdrop). */
  imageClassName?: string;
}) {
  const [hovered, setHovered] = useState<string | null>(null);
  const reduce = useReducedMotion();
  // Where the pointer is across the avatar, from -1 (left edge) to 1 (right edge).
  const x = useMotionValue(0);
  const rotate = useSpring(useTransform(x, [-1, 1], [-5, 5]), lean);
  const shift = useSpring(useTransform(x, [-1, 1], [-6, 6]), lean);

  const follow = (e: PointerEvent<HTMLSpanElement>) => {
    if (e.pointerType !== "mouse" || reduce) return;
    const r = e.currentTarget.getBoundingClientRect();
    x.set(((e.clientX - r.left) / r.width) * 2 - 1);
  };

  return (
    <span className={cn("flex", className)}>
      {items.map((item) => (
        <span
          key={item.name}
          className={cn("relative block hover:z-10", itemClassName)}
          onPointerEnter={(e) => {
            if (e.pointerType !== "mouse") return;
            follow(e);
            setHovered(item.name);
          }}
          onPointerMove={follow}
          onPointerLeave={() => setHovered(null)}
        >
          <span className={cn("relative block overflow-hidden rounded-full transition-transform duration-300 ease-[var(--ease-out)] hover:scale-110", imageClassName)}>
            {item.face ? (
              // The whole portrait, enlarged and slid so the face lands in the middle of the circle.
              <Image
                src={item.image}
                alt=""
                width={size * 4}
                height={size * 6}
                sizes={`${Math.round(size * item.face.zoom)}px`}
                className="absolute left-1/2 top-1/2 h-auto max-w-none"
                style={{ width: `${item.face.zoom * 100}%`, translate: `${-item.face.x * 100}% ${-item.face.y * 100}%` }}
              />
            ) : (
              <Image src={item.image} alt="" width={size} height={size} className="block size-full object-cover" />
            )}
          </span>
          <AnimatePresence>
            {hovered === item.name && (
              <motion.span
                aria-hidden
                initial={reduce ? { opacity: 0 } : { opacity: 0, y: -8, scale: 0.7 }}
                animate={{ opacity: 1, y: 0, scale: 1, transition: reduce ? { duration: 0.15 } : { type: "spring", stiffness: 320, damping: 18 } }}
                exit={{ opacity: 0, ...(reduce ? {} : { y: -4, scale: 0.85 }), transition: { duration: 0.12, ease: [0.4, 0, 1, 1] } }}
                style={{ x: shift, rotate }}
                className="pointer-events-none absolute left-1/2 top-full z-50 mt-2.5 block origin-top -translate-x-1/2 whitespace-nowrap rounded-lg bg-ink-2 px-3 py-1.5 text-xs font-medium text-paper shadow-[0_14px_30px_-10px_rgb(0_0_0/0.8)] ring-1 ring-line"
              >
                {item.name}
                {/* a thread of brand light along the edge nearest the avatar */}
                <span className="absolute inset-x-2 -top-px block h-px bg-gradient-to-r from-transparent via-brand to-transparent" />
              </motion.span>
            )}
          </AnimatePresence>
        </span>
      ))}
    </span>
  );
}
