"use client";

import { useSyncExternalStore } from "react";

// Whether the project brief in the contact section is open. Shared so other sections can open it directly,
// optionally pre-filled (e.g. "I want this" on a format in the explorer).
export type BriefPrefill = { need?: string; message?: string };

let open = false;
let version = 0; // bumps on every pre-filled open, so an already-open brief remounts with the new details
let prefill: BriefPrefill | null = null;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());
const subscribe = (cb: () => void) => {
  listeners.add(cb);
  return () => listeners.delete(cb);
};

export const setBriefOpen = (next: boolean | ((cur: boolean) => boolean)) => {
  open = typeof next === "function" ? next(open) : next;
  emit();
};

export const openBriefWith = (details: BriefPrefill) => {
  prefill = details;
  version += 1;
  open = true;
  emit();
};

// Read by the brief as it mounts (safe to call twice), then cleared once it is on screen.
export const peekBriefPrefill = () => prefill;
export const clearBriefPrefill = () => {
  prefill = null;
};

export function useBriefOpen() {
  return useSyncExternalStore(subscribe, () => open, () => false);
}

export function useBriefVersion() {
  return useSyncExternalStore(subscribe, () => version, () => 0);
}
