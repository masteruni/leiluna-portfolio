"use client";

import { useSyncExternalStore } from "react";

// Whether the project brief in the contact section is open. Shared so the hero can open it directly.
let open = false;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

export const setBriefOpen = (next: boolean | ((cur: boolean) => boolean)) => {
  open = typeof next === "function" ? next(open) : next;
  emit();
};

export function useBriefOpen() {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => open,
    () => false,
  );
}
