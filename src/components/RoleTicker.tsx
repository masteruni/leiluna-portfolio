"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

export function RoleTicker({ roles }: { roles: string[] }) {
  const [i, setI] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setI((n) => (n + 1) % roles.length), 2200);
    return () => clearInterval(id);
  }, [roles.length, reduce]);

  return (
    <span className="relative inline-flex h-[1.2em] overflow-hidden align-bottom">
      <span className="sr-only">{roles.join(", ")}</span>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={roles[i]}
          aria-hidden
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.5, ease: [0.7, 0, 0.2, 1] }}
          className="block whitespace-nowrap text-brand"
        >
          {roles[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
