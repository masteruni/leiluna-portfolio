import type { MouseEvent } from "react";

// A burst of short pale-pink and white lines from where you clicked, like a spark. Fire-and-forget: the lines are
// animated with the Web Animations API and removed when they finish. Skipped for reduced motion.
export function spark(e: MouseEvent<HTMLElement>) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const r = e.currentTarget.getBoundingClientRect();
  // A keyboard press reports no pointer position, so the burst comes from the middle of the button.
  const x = e.detail ? e.clientX : r.left + r.width / 2;
  const y = e.detail ? e.clientY : r.top + r.height / 2;

  const burst = document.createElement("div");
  burst.setAttribute("aria-hidden", "true");
  Object.assign(burst.style, { position: "fixed", left: `${x}px`, top: `${y}px`, pointerEvents: "none", zIndex: "90" });

  document.body.appendChild(burst);

  const count = 8;
  for (let k = 0; k < count; k++) {
    const line = document.createElement("span");
    const angle = (360 / count) * k;
    Object.assign(line.style, {
      position: "absolute",
      left: "0",
      top: "-1px",
      width: "12px",
      height: "2px",
      borderRadius: "2px",
      background: k % 2 ? "var(--paper)" : "var(--brand-2)",
      transformOrigin: "0 50%",
    });
    burst.appendChild(line);
    line.animate(
      [
        { transform: `rotate(${angle}deg) translateX(14px) scaleX(1)`, opacity: 1 },
        { transform: `rotate(${angle}deg) translateX(44px) scaleX(0.2)`, opacity: 0 },
      ],
      { duration: 600, easing: "cubic-bezier(0.16, 1, 0.3, 1)", fill: "forwards" },
    );
  }
  window.setTimeout(() => burst.remove(), 650);
}
