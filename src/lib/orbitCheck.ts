"use client";

import { useSyncExternalStore } from "react";

// The Free Orbit Check (a free feed audit): a short form any button on the page can open.
let open = false;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

export const openOrbitCheck = () => {
  open = true;
  emit();
};
export const closeOrbitCheck = () => {
  open = false;
  emit();
};

export function useOrbitCheckOpen() {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => open,
    () => false,
  );
}

// Turns "@brand", "brand" or a profile link (instagram.com/brand/?hl=en) into "brand". Returns null when what's
// left isn't a possible Instagram username (letters, numbers, dots and underscores, up to 30).
export function normalizeHandle(input: string): string | null {
  let s = input.trim();
  const url = s.match(/instagram\.com\/([^/?#\s]+)/i);
  if (url) s = url[1];
  s = s.replace(/^@+/, "").replace(/\/+$/, "");
  return /^[A-Za-z0-9._]{1,30}$/.test(s) ? s.toLowerCase() : null;
}

export const isEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s.trim());
