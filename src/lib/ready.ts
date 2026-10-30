"use client";

import { useSyncExternalStore } from "react";

// The intro loader flips this once it's gone, so hero animations start on cue.
let ready = false;
const listeners = new Set<() => void>();

export function markReady() {
  if (ready) return;
  ready = true;
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
