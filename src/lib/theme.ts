import { useSyncExternalStore } from "react";
import { THEME_KEY as KEY } from "./theme-script";

export type Theme = "light" | "dark";

const read = (): Theme => (document.documentElement.dataset.theme === "light" ? "light" : "dark");

function subscribe(cb: () => void) {
  const mo = new MutationObserver(cb);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  // With no saved choice, follow the device when its setting changes.
  const mq = window.matchMedia("(prefers-color-scheme: light)");
  const follow = () => {
    try {
      if (localStorage.getItem(KEY)) return;
    } catch {}
    document.documentElement.dataset.theme = mq.matches ? "light" : "dark";
  };
  mq.addEventListener("change", follow);
  return () => {
    mo.disconnect();
    mq.removeEventListener("change", follow);
  };
}

// The current theme; null while rendering on the server (the theme is only known in the browser).
export function useTheme() {
  return useSyncExternalStore<Theme | null>(subscribe, read, () => null);
}

export function setTheme(t: Theme) {
  document.documentElement.dataset.theme = t;
  try {
    localStorage.setItem(KEY, t);
  } catch {}
}
