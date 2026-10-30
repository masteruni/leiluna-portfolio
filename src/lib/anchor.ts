"use client";

import { useLenis } from "lenis/react";
import { usePathname } from "next/navigation";
import { useCallback, type MouseEvent } from "react";

// Links like "/#work" normally jump. On the homepage this glides to the section with Lenis instead and still
// updates the URL hash; on any other page the link navigates as usual.
export function useAnchor() {
  const lenis = useLenis();
  const pathname = usePathname();

  return useCallback(
    (e: MouseEvent<HTMLAnchorElement>) => {
      const href = e.currentTarget.getAttribute("href") ?? "";
      const hash = href.startsWith("/#") ? href.slice(1) : href.startsWith("#") ? href : null;
      if (!hash || pathname !== "/" || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const target = document.querySelector<HTMLElement>(hash);
      if (!target) return;
      e.preventDefault();
      if (lenis) lenis.scrollTo(target, { offset: -40, duration: 1.4, force: true });
      else target.scrollIntoView({ behavior: "smooth" });
      history.replaceState(null, "", hash);
    },
    [lenis, pathname],
  );
}
