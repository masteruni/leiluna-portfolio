import type { ReactNode } from "react";
import { Reveal } from "./Reveal";

export function SectionHeader({
  index,
  label,
  title,
  aside,
}: {
  index: string;
  label: string;
  title: ReactNode;
  aside?: ReactNode;
}) {
  return (
    <div className="mb-12 flex flex-col gap-6 md:mb-16 md:flex-row md:items-end md:justify-between">
      <Reveal>
        <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-muted">
          <span className="text-brand">({index})</span> {label}
        </p>
        <h2 className="max-w-3xl font-display text-4xl font-semibold leading-[0.95] tracking-tight sm:text-5xl md:text-6xl">
          {title}
        </h2>
      </Reveal>
      {aside && <Reveal delay={0.1}>{aside}</Reveal>}
    </div>
  );
}
