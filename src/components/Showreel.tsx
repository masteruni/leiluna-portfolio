"use client";

import { AnimatePresence, motion } from "motion/react";
import { useLenis } from "lenis/react";
import { useEffect, useRef } from "react";
import { useFocusTrap } from "@/lib/focus";
import { closeShowreel, useShowreel } from "@/lib/showreel";
import { buttonClass } from "./ui";

const protect = {
  controlsList: "nodownload noplaybackrate noremoteplayback",
  disablePictureInPicture: true,
  disableRemotePlayback: true,
} as const;

// Full-screen player with sound, for a clip opened from a Recent work card or a receipt in Proof.
export function ShowreelPlayer() {
  const { open, clip: playing } = useShowreel();
  const clip = playing;
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
      {open && clip && (
        <motion.div
          ref={dialog}
          role="dialog"
          aria-modal="true"
          aria-label={clip.title}
          className="fixed inset-0 z-[95] grid place-items-center bg-ink/95 p-4 backdrop-blur-xl sm:p-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.3 } }}
          onClick={closeShowreel}
        >
          <motion.div
            className={`relative overflow-hidden ${"image" in clip && clip.image ? "mt-12 sm:mt-0" : clip.vertical ? "mt-12 aspect-[9/16] h-full max-h-[80svh] w-auto max-w-full sm:mt-0 sm:max-h-[85svh]" : "aspect-video w-full max-w-6xl"} rounded-2xl bg-black shadow-[0_40px_120px_-20px_rgb(234_106_142/0.35)]`}
            initial={{ scale: 0.92, y: 30 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.96, opacity: 0, transition: { duration: 0.25 } }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            {"image" in clip && clip.image ? (
              // eslint-disable-next-line @next/next/no-img-element -- a full-size screenshot, shown as is
              <img src={clip.src} alt={clip.title} draggable={false} className="block h-auto max-h-[80svh] w-auto max-w-full sm:max-h-[85svh]" />
            ) : (
              <video {...protect} key={clip.src} src={clip.src} poster={clip.poster} autoPlay controls playsInline className="size-full object-contain" />
            )}
          </motion.div>
          <button
            ref={closeRef}
            type="button"
            onClick={closeShowreel}
            className={buttonClass("solid", "md", "absolute right-5 top-5 sm:right-10 sm:top-6")}
          >
            Close ✕
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
