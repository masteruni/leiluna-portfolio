"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useRef, useState, type CSSProperties, type PointerEvent, type ReactNode } from "react";
import { cn } from "@/lib/utils";

// A magnifying glass that follows the mouse over whatever it wraps: on a case study it lets a visitor read the
// small numbers in a client's own screenshot. From Aceternity UI (`npx shadcn add @aceternity/lens`), adapted
// for this site: mouse only (touch and keyboard get the plain image), the position is written straight to CSS
// variables so moving the mouse never re-renders the image, and the glass has a rim so it reads as an object.
//
// `magnified` is what shows inside the glass: pass a sharper copy of the image (larger `sizes`), or leave it out
// to enlarge the children as they are.
export function Lens({
  children,
  magnified,
  zoom = 2,
  size = 200,
  className,
}: {
  children: ReactNode;
  magnified?: ReactNode;
  zoom?: number;
  /** Diameter of the glass, in px. */
  size?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);
  const reduce = useReducedMotion();

  const place = (e: PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (e.pointerType !== "mouse" || !el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--lx", `${e.clientX - r.left}px`);
    el.style.setProperty("--ly", `${e.clientY - r.top}px`);
  };

  const glass = `radial-gradient(circle ${size / 2}px at var(--lx) var(--ly), #000 99%, transparent 100%)`;
  const origin: CSSProperties = { transformOrigin: "var(--lx) var(--ly)" };

  return (
    <div
      ref={ref}
      className={cn("relative overflow-hidden", on && "cursor-none", className)}
      onPointerEnter={(e) => {
        if (e.pointerType !== "mouse") return;
        place(e);
        setOn(true);
      }}
      onPointerMove={place}
      onPointerLeave={() => setOn(false)}
    >
      {children}
      <AnimatePresence>
        {on && (
          <motion.div
            aria-hidden
            initial={{ opacity: 0, scale: reduce ? 1 : 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: reduce ? 1 : 0.85, transition: { duration: 0.12, ease: [0.4, 0, 1, 1] } }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-none absolute inset-0 z-10"
            style={origin}
          >
            <div className="absolute inset-0" style={{ maskImage: glass, WebkitMaskImage: glass }}>
              <div className="absolute inset-0" style={{ ...origin, transform: `scale(${zoom})` }}>
                {magnified ?? children}
              </div>
            </div>
            {/* the rim of the glass */}
            <div
              className="absolute left-0 top-0 rounded-full shadow-[0_18px_40px_-12px_rgb(0_0_0/0.75),inset_0_0_0_1px_rgb(246_242_239/0.55),inset_0_0_24px_rgb(246_166_189/0.18)]"
              style={{ width: size, height: size, transform: `translate(calc(var(--lx) - ${size / 2}px), calc(var(--ly) - ${size / 2}px))` }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
