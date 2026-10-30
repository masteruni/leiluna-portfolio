"use client";

import { useSyncExternalStore } from "react";
import { track } from "@/lib/track";

// One shared switch for the full-screen showreel, so any button on the page can open it.
let open = false;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

export const openShowreel = () => {
  if (!open) track("Showreel opened");
  open = true;
  emit();
};
export const closeShowreel = () => {
  open = false;
  emit();
};

export function useShowreel() {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => open,
    () => false,
  );
}
