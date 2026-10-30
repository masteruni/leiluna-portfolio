"use client";

import { useEffect, useState } from "react";

// Whether the given height on screen (in px from the top; a function so it can follow the window size)
// is over one of the dark "night" sections. Fixed elements use it to take on the night colours in light mode.
export function useOverNight(y: () => number) {
  const [over, setOver] = useState(false);
  useEffect(() => {
    let raf = 0;
    const check = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const at = y();
        setOver(
          // (the intro loader is a passing full-screen overlay, not a section, so it never counts)
          [...document.querySelectorAll(".night:not([data-loader])")].some((el) => {
            const r = el.getBoundingClientRect();
            return r.top <= at && r.bottom >= at;
          }),
        );
      });
    };
    check();
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
    // `y` is read on every check, so a new function each render doesn't need to re-subscribe.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return over;
}
