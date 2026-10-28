"use client";

import { useEffect } from "react";

// Discourages casual saving of our work: no right-click "Save as…" and no drag-out on images and videos.
// Text stays selectable and right-click still works everywhere else.
const PROTECTED = "img, video, canvas, picture, [data-protect]";

export function Protect() {
  useEffect(() => {
    const block = (e: Event) => {
      if ((e.target as Element | null)?.closest?.(PROTECTED)) e.preventDefault();
    };
    document.addEventListener("contextmenu", block);
    document.addEventListener("dragstart", block);
    return () => {
      document.removeEventListener("contextmenu", block);
      document.removeEventListener("dragstart", block);
    };
  }, []);
  return null;
}
