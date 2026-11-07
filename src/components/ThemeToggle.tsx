"use client";

import { Moon, Sun } from "lucide-react";
import { setTheme, useTheme } from "@/lib/theme";
import { track } from "@/lib/track";

// Switches between the night (dark) and moonlight (light) themes. The icons swap in CSS, so the button
// renders the same on the server and in the browser.
export function ThemeToggle({ className = "" }: { className?: string }) {
  const theme = useTheme();
  const next = theme === "light" ? "dark" : "light";
  return (
    <button
      type="button"
      onClick={() => {
        track("Theme changed", { to: next });
        // The whole page changes colour at once, so it crossfades (a quarter second, on the GPU) instead of snapping.
        // Instant with reduced motion, or in browsers without View Transitions.
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (reduce || !document.startViewTransition) return setTheme(next);
        const root = document.documentElement;
        root.dataset.vt = "theme";
        const vt = document.startViewTransition(() => setTheme(next));
        vt.finished.finally(() => delete root.dataset.vt);
      }}
      aria-label={theme ? `Switch to ${next} mode` : "Switch theme"}
      className={`grid size-10 place-items-center pointer-coarse:size-11 rounded-full border border-line bg-ink/50 text-paper backdrop-blur-md transition-colors duration-300 hover:border-brand hover:text-accent ${className}`}
    >
      <Sun aria-hidden className="hidden size-4 light:block" />
      <Moon aria-hidden className="size-4 light:hidden" />
    </button>
  );
}
