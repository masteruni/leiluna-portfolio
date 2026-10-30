"use client";

import { motion, useAnimationFrame, useInView, useMotionValue, useReducedMotion } from "motion/react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { industries } from "@/content/library";
import { clients } from "@/content/site";

type Item = { name: string; logo?: string };

const SPEED = 40; // pixels per second

// Clients spread evenly through the industries (each a couple of names in, so the first one lands
// mid-strip rather than in the faded edge), and the logos never sit side by side.
const rest: Item[] = industries.map((name) => ({ name }));
const step = Math.ceil(rest.length / Math.max(clients.length, 1));
const items: Item[] = clients.length
  ? clients.flatMap((c, i) => {
      const chunk = rest.slice(i * step, (i + 1) * step);
      return [...chunk.slice(0, 2), c, ...chunk.slice(2)];
    })
  : rest;

// With reduced motion, the first copy wraps into a still, centred list and the rest are hidden. That's done
// in CSS so the server and browser render the same markup.
function Sequence({ hidden, ref }: { hidden?: boolean; ref?: React.Ref<HTMLUListElement> }) {
  return (
    <ul
      ref={ref}
      aria-hidden={hidden || undefined}
      aria-label={hidden ? undefined : "Clients and industries"}
      className={`flex shrink-0 items-center gap-10 pr-10 motion-reduce:shrink motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:gap-y-5 motion-reduce:pr-0 ${
        hidden ? "motion-reduce:hidden" : ""
      }`}
    >
      {items.map((it) => (
        <li key={it.name} className="group flex items-center gap-10 whitespace-nowrap">
          {it.logo ? (
            <span className="flex items-center gap-4">
              <Image
                src={it.logo}
                alt=""
                width={48}
                height={48}
                loading="eager" // off to the side, so lazy loading would only fetch it as it slides in
                className="size-10 rounded-full ring-1 ring-line transition-transform duration-500 ease-[var(--ease-out)] group-hover:scale-110 sm:size-12"
              />
              <span className="font-display text-2xl font-semibold tracking-[-0.03em] sm:text-3xl">{it.name}</span>
            </span>
          ) : (
            <span className="font-display text-2xl tracking-[-0.03em] text-paper/35 sm:text-3xl">{it.name}</span>
          )}
          <span aria-hidden className="size-1.5 rounded-full bg-brand/70" />
        </li>
      ))}
    </ul>
  );
}

// Clients and industries gliding past. Hovering eases it to a stop (and back), so a name can be read.
export function LogoLoop() {
  const wrap = useRef<HTMLDivElement>(null);
  const seq = useRef<HTMLUListElement>(null);
  const [width, setWidth] = useState(0);
  const [copies, setCopies] = useState(2);
  const hover = useRef(false);
  const velocity = useRef(SPEED);
  const x = useMotionValue(0);
  const reduce = useReducedMotion();
  const onScreen = useInView(wrap);

  // Enough copies to always cover the strip, re-measured when fonts load or the window resizes.
  useEffect(() => {
    const measure = () => {
      const w = seq.current?.offsetWidth ?? 0;
      setWidth(w);
      if (w) setCopies(Math.ceil((wrap.current?.offsetWidth ?? 0) / w) + 1);
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (wrap.current) ro.observe(wrap.current);
    if (seq.current) ro.observe(seq.current);
    return () => ro.disconnect();
  }, []);

  useAnimationFrame((_, delta) => {
    if (reduce || !onScreen || !width) return;
    const dt = Math.min(delta, 100) / 1000; // a backgrounded tab shouldn't make it jump
    velocity.current += ((hover.current ? 0 : SPEED) - velocity.current) * Math.min(1, dt * 4);
    let next = x.get() - velocity.current * dt;
    if (next <= -width) next += width;
    x.set(next);
  });

  return (
    <div
      ref={wrap}
      className="overflow-hidden py-2 [mask-image:linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)] motion-reduce:[mask-image:none]"
      onMouseEnter={() => (hover.current = true)}
      onMouseLeave={() => (hover.current = false)}
    >
      <motion.div className="flex w-max motion-reduce:w-auto" style={{ x }}>
        <Sequence ref={seq} />
        {Array.from({ length: copies - 1 }, (_, i) => (
          <Sequence key={i} hidden />
        ))}
      </motion.div>
    </div>
  );
}
