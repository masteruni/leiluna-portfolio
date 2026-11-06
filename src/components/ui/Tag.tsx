import type { ReactNode } from "react";

// The small frosted label laid over photos and video (an industry, a format, "Before / After").
// It's informational, never a button. `accent` colours the text pink for the one tag that matters most.

export function Tag({ tone = "default", className = "", children }: { tone?: "default" | "accent"; className?: string; children: ReactNode }) {
  return (
    <span
      className={`rounded-full bg-ink/60 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] backdrop-blur-md ${
        tone === "accent" ? "text-accent" : "text-paper/80"
      } ${className}`.trim()}
    >
      {children}
    </span>
  );
}
