"use client";

import { useSyncExternalStore } from "react";

// The intro loader flips this once it's gone, so hero animations start on cue.
let ready = false;
const listeners = new Set<() => void>();

export function markReady() {
  if (ready) return;
  ready = true;
  // Lets the hero's CSS entrance play (it's held while the intro covers the page: see globals.css). "open", not
  // "seen", because "seen" hides the loader outright and would cut the intro's reveal short.
  const d = document.documentElement;
  if (d.dataset.intro === "pending") d.dataset.intro = "open";
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function useReady() {
  return useSyncExternalStore(
    subscribe,
    () => ready,
    () => false,
  );
}
