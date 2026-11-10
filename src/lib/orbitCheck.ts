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

// The handle and email checks live in ./validate (shared with the server); re-exported here for the form.
export { isEmail, normalizeHandle } from "./validate";
