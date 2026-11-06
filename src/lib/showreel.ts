"use client";

import { useSyncExternalStore } from "react";
import { track } from "@/lib/track";

// One shared full-screen player, so any button on the page can open it: with no video named it plays the
// showreel; Recent work opens it with one of its own clips.
// `image` shows a still (a screenshot) instead of playing a video.
export type Clip = { src: string; poster?: string; title: string; vertical?: boolean; image?: boolean };

// `clip` stays set after closing, so the player keeps showing the same video while it fades out.
type State = { open: boolean; clip: Clip | "showreel" };
const initial: State = { open: false, clip: "showreel" };
let state = initial;
const listeners = new Set<() => void>();
const set = (next: State) => {
  state = next;
  listeners.forEach((l) => l());
};

// Takes no arguments on purpose: it's used directly as an onClick handler.
export const openShowreel = () => {
  if (!state.open) track("Showreel opened");
  set({ open: true, clip: "showreel" });
};
export const openClip = (clip: Clip) => set({ open: true, clip });
export const closeShowreel = () => set({ ...state, open: false });

export function useShowreel() {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => state,
    () => initial,
  );
}
