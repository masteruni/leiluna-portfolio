"use client";

import { useEffect, useState } from "react";

// Which of the given section ids is currently in the middle band of the viewport. The nav uses it to
// underline the link for the section you are reading.
// Pass a stable (module-level) array: the observer is rebuilt whenever `ids` changes identity.
export function useActiveSection(ids: readonly string[]) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const els = ids.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => !!el);
    if (!els.length) return;
    const visible = new Map<string, number>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) visible.set(e.target.id, e.intersectionRect.height);
          else visible.delete(e.target.id);
        }
        // The section that fills most of the band wins; none means we're between sections (or in the hero).
        let best: string | null = null;
        let height = 0;
        visible.forEach((h, id) => {
          if (h > height) {
            height = h;
            best = id;
          }
        });
        setActive(best);
      },
      { rootMargin: "-35% 0px -50% 0px", threshold: [0, 0.1, 0.25, 0.5, 0.75, 1] },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [ids]);

  return active;
}
