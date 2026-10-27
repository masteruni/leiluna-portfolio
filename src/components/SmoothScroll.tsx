"use client";

import { ReactLenis } from "lenis/react";
import type { ReactNode } from "react";

export function SmoothScroll({ children }: { children: ReactNode }) {
  return (
    <ReactLenis root options={{ lerp: 0.09, anchors: { offset: -40 }, stopInertiaOnNavigate: true }}>
      {children}
    </ReactLenis>
  );
}
