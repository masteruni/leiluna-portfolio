"use client";

import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import { useLenis } from "lenis/react";
import { useEffect, useRef } from "react";
import { useFocusTrap } from "@/lib/focus";
import { closeShowreel, useShowreel } from "@/lib/showreel";

export const showreel = {
  // Cut from real client work in the Library, ending on the logo reveal.
  src: "/library/showreel-2026.mp4",
  preview: "/library/showreel-2026-preview.mp4",
  poster: "/library/showreel-2026-poster.webp",
  duration: "0:16",
};

const protect = {
  controlsList: "nodownload noplaybackrate noremoteplayback",
  disablePictureInPicture: true,
  disableRemotePlayback: true,
} as const;

// Full-screen player with sound. Opened from the hero button or the showreel section.
export function ShowreelPlayer() {
  const open = useShowreel();
  const lenis = useLenis();
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialog = useRef<HTMLDivElement>(null);
  useFocusTrap(dialog, open);

  useEffect(() => {
    if (!open) return;
    lenis?.stop();
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeShowreel();
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      lenis?.start();
    };
  }, [open, lenis]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={dialog}
          role="dialog"
          aria-modal="true"
          aria-label="Leiluna Studio showreel"
          className="fixed inset-0 z-[95] grid place-items-center bg-ink/95 p-4 sm:p-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.3 } }}
          onClick={closeShowreel}
        >
          <motion.div
            className="relative aspect-video w-full max-w-6xl overflow-hidden rounded-2xl bg-black"
            initial={{ scale: 0.92, y: 30 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.96, opacity: 0, transition: { duration: 0.25 } }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <video {...protect} src={showreel.src} poster={showreel.poster} autoPlay controls playsInline className="size-full object-contain" />
          </motion.div>
          <button
            ref={closeRef}
            type="button"
            onClick={closeShowreel}
            className="absolute right-5 top-5 inline-flex items-center gap-2 rounded-full bg-paper px-5 py-2.5 text-sm font-medium text-ink sm:right-10 sm:top-6"
          >
            Close <X aria-hidden className="size-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
