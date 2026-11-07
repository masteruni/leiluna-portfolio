"use client";

import { useState, type MouseEvent } from "react";
import { spark } from "@/lib/spark";
import { track } from "@/lib/track";
import { SwapLabel, buttonClass } from "./ui";

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
      <SwapLabel current={state} labels={labels} />
    </button>
  );
}
