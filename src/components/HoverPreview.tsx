"use client";

import { motion, useReducedMotion, useSpring } from "motion/react";
import { useState, type ReactNode } from "react";

const follow = { stiffness: 220, damping: 26, mass: 0.6 };

// Wraps a link (or any row) and shows a small preview that trails the mouse while it's over it: the next case
// study's cover beside its title, so the visitor sees where the link goes before clicking. Mouse only; touch and
// keyboard users get the link as it is. With reduced motion the preview appears in place without trailing.
export function HoverPreview({ children, preview, className = "" }: { children: ReactNode; preview: ReactNode; className?: string }) {
  const x = useSpring(0, follow);
  const y = useSpring(0, follow);
  const [on, setOn] = useState(false);
  const reduce = useReducedMotion();

  const place = (e: React.PointerEvent<HTMLDivElement>, jump: boolean) => {
    if (e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    const [px, py] = [e.clientX - r.left, e.clientY - r.top];
    if (jump || reduce) {
      x.jump(px);
      y.jump(py);
    } else {
      x.set(px);
      y.set(py);
    }
  };

  return (
    <div
      className={`relative ${className}`}
      onPointerEnter={(e) => {
        if (e.pointerType !== "mouse") return;
        place(e, true); // start at the pointer, rather than flying in from the corner
        setOn(true);
      }}
      onPointerMove={(e) => place(e, false)}
      onPointerLeave={() => setOn(false)}
    >
      {children}
      <motion.div aria-hidden style={{ x, y }} className="pointer-events-none absolute left-0 top-0 z-20 hidden lg:block">
        <motion.div
          initial={false}
          animate={on ? { opacity: 1, scale: 1, rotate: -5 } : { opacity: 0, scale: 0.8, rotate: 0 }}
          transition={on ? { type: "spring", stiffness: 300, damping: 24 } : { duration: 0.15, ease: [0.4, 0, 1, 1] }}
          // floats up and to the right of the pointer, so most of it clears the words under the mouse
          className="w-40 translate-x-8 -translate-y-[85%] overflow-hidden rounded-2xl shadow-[0_30px_80px_-20px_rgb(0_0_0/0.8)]"
        >
          {preview}
        </motion.div>
      </motion.div>
    </div>
  );
}
