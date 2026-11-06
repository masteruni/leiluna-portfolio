"use client";

import { useState, type MouseEvent } from "react";
import { spark } from "@/lib/spark";
import { track } from "@/lib/track";
import { buttonClass } from "./ui";

const labels = [
  ["idle", "Share this case study"],
  ["copied", "Link copied ✦"],
  ["shared", "Shared ✦"],
] as const;

// Share the current page: the native share sheet on phones, "copy link" everywhere else.
export function ShareButton({ title, text, className = "" }: { title: string; text?: string; className?: string }) {
  const [state, setState] = useState<"idle" | "copied" | "shared">("idle");

  const share = async (e: MouseEvent<HTMLButtonElement>) => {
    spark(e);
    const url = window.location.href;
    try {
      if (typeof navigator.share === "function" && navigator.canShare?.({ url })) {
        await navigator.share({ title, text, url });
        track("Case study shared", { how: "share sheet" });
        setState("shared");
      } else {
        await navigator.clipboard.writeText(url);
        track("Case study shared", { how: "link copied" });
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
      className={buttonClass("outline", "md", className)}
    >
      {/* All three labels share one grid cell, so the button keeps the width of the longest and never jumps; the
          current one crossfades in with a slight blur, so it reads as one label changing rather than two swapping. */}
      <span className="grid">
        {labels.map(([key, text]) => (
          <span
            key={key}
            aria-hidden={state !== key}
            className={`col-start-1 row-start-1 transition-[opacity,filter] duration-200 ease-[var(--ease-out)] ${
              state === key ? "opacity-100 blur-0" : "opacity-0 blur-[2px]"
            }`}
          >
            {text}
          </span>
        ))}
      </span>
    </button>
  );
}
