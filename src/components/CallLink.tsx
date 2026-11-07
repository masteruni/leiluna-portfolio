"use client";

import type { ReactNode } from "react";
import { site } from "@/content/site";
import { track } from "@/lib/track";

// A link to the free 30-minute intro call (Calendly), opened in a new tab so the visitor keeps their place here.
export function CallLink({ from, className = "", children }: { from: string; className?: string; children: ReactNode }) {
  return (
    <a
      href={site.callUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => track("Call booked", { from })}
      className={`text-paper underline decoration-paper/30 underline-offset-4 transition-colors hover:text-accent hover:decoration-accent ${className}`}
    >
      {children}
      <span className="sr-only"> (opens Calendly in a new tab)</span>
    </a>
  );
}
