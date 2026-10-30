"use client";

import { useEffect, useState } from "react";

export type Chapter = "night" | "crescent" | "rose" | "pink" | "full";

// The chapter of the section passing under a horizontal line `y` pixels from the top of the screen,
// read from the nearest [data-chapter] ancestor. The header uses it to take the ink of the field beneath it.
export function useChapter(y = 40): Chapter {
  const [chapter, setChapter] = useState<Chapter>("night");

  useEffect(() => {
    let frame = 0;
    const read = () => {
      frame = 0;
      for (const el of document.elementsFromPoint(window.innerWidth / 2, y)) {
        if (el.closest("header")) continue;
        const host = el.closest<HTMLElement>("[data-chapter]");
        if (host) {
          setChapter(host.dataset.chapter as Chapter);
          return;
        }
      }
      setChapter("night");
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(read);
    };
    read();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [y]);

  return chapter;
}
