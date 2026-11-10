"use client";

import * as HoverCard from "@radix-ui/react-hover-card";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { useState, type MouseEventHandler, type PointerEvent, type ReactNode } from "react";
import { cn } from "@/lib/utils";

// A link that shows where it leads before it's clicked: with a mouse (or keyboard focus) a small card of images
// springs up above it and leans with the pointer. Touch screens get the plain link.
// From Aceternity UI (`npx shadcn add @aceternity/link-preview`), adapted for this site: it only shows images
// the site already has (the original asked an outside service for a screenshot of the page), uses next/link and
// next/image, takes a caption, wears the brand colours, and doesn't spring or lean with reduced motion.
export function LinkPreview({
  href,
  images,
  caption,
  children,
  className,
  onClick,
}: {
  href: string;
  /** One or two images, shown side by side and cropped from the top. */
  images: { src: string; alt: string }[];
  caption?: ReactNode;
  children: ReactNode;
  className?: string;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
}) {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();
  const x = useSpring(useMotionValue(0), { stiffness: 100, damping: 15 });

  const lean = (e: PointerEvent<HTMLAnchorElement>) => {
    if (e.pointerType !== "mouse" || reduce) return;
    const r = e.currentTarget.getBoundingClientRect();
    x.set(Math.max(-24, Math.min(24, (e.clientX - r.left - r.width / 2) / 2)));
  };

  return (
    <HoverCard.Root open={open} onOpenChange={setOpen} openDelay={80} closeDelay={80}>
      <HoverCard.Trigger asChild>
        <Link href={href} onClick={onClick} onPointerMove={lean} className={className}>
          {children}
        </Link>
      </HoverCard.Trigger>
      <AnimatePresence>
        {open && (
          <HoverCard.Portal forceMount>
            <HoverCard.Content forceMount side="top" align="start" sideOffset={14} collisionPadding={16} className="pointer-events-none z-[60]">
              <motion.div
                initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.7 }}
                animate={{ opacity: 1, y: 0, scale: 1, transition: reduce ? { duration: 0.15 } : { type: "spring", stiffness: 260, damping: 20 } }}
                exit={{ opacity: 0, ...(reduce ? {} : { y: 8, scale: 0.9 }), transition: { duration: 0.12, ease: [0.4, 0, 1, 1] } }}
                style={{ x, transformOrigin: "var(--radix-hover-card-content-transform-origin)" }}
                // `night`: the card keeps the dark palette wherever it opens, like the hero it belongs to
                className={cn(
                  "night rounded-2xl border border-line bg-ink-2 p-1.5 shadow-[0_30px_70px_-20px_rgb(0_0_0/0.85)]",
                  images.length > 1 ? "w-72" : "w-56",
                )}
              >
                <div className="flex gap-1.5">
                  {images.map((img) => (
                    <div key={img.src} className={cn("relative flex-1 overflow-hidden rounded-xl bg-ink-3", images.length > 1 ? "aspect-[4/5]" : "aspect-[4/3]")}>
                      <Image src={img.src} alt={img.alt} fill sizes="224px" className="object-cover object-top" />
                    </div>
                  ))}
                </div>
                {caption && <div className="px-2.5 pb-1.5 pt-2.5 text-xs leading-snug text-paper/60">{caption}</div>}
              </motion.div>
            </HoverCard.Content>
          </HoverCard.Portal>
        )}
      </AnimatePresence>
    </HoverCard.Root>
  );
}
