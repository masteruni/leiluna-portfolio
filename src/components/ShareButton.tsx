"use client";

import { useState } from "react";

// Share the current page: the native share sheet on phones, "copy link" everywhere else.
export function ShareButton({ title, text, className = "" }: { title: string; text?: string; className?: string }) {
  const [state, setState] = useState<"idle" | "copied" | "shared">("idle");

  const share = async () => {
    const url = window.location.href;
    try {
      if (typeof navigator.share === "function" && navigator.canShare?.({ url })) {
        await navigator.share({ title, text, url });
        setState("shared");
      } else {
        await navigator.clipboard.writeText(url);
        setState("copied");
      }
    } catch {
      // The person closed the share sheet: nothing to report.
      return;
    }
    window.setTimeout(() => setState("idle"), 2000);
  };

  return (
    <button
      type="button"
      onClick={share}
      aria-live="polite"
      className={`inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm text-paper/80 transition-colors hover:border-paper hover:text-paper ${className}`}
    >
      {state === "copied" ? "Link copied" : state === "shared" ? "Shared" : "Share this case study"}
    </button>
  );
}
