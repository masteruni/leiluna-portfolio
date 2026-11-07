"use client";

import { useSyncExternalStore } from "react";

// One shared full-screen player, so any card on the page can open its clip in it (Recent work).
// `image` shows a still (a screenshot) instead of playing a video.
export type Clip = { src: string; poster?: string; title: string; vertical?: boolean; image?: boolean };

// `clip` stays set after closing, so the player keeps showing the same video while it fades out.
type State = { open: boolean; clip: Clip | null };
const initial: State = { open: false, clip: null };
let state = initial;
const listeners = new Set<() => void>();
const set = (next: State) => {
  state = next;
  listeners.forEach((l) => l());
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
