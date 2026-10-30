import type { ReactNode } from "react";
import { sectionNumber, sections, type SectionId } from "@/lib/sections";

// The small running head above every section: "(03) Selected work". The number follows the section's place
// on the page (see src/lib/sections.ts), so it can't drift when sections are added or moved.
export function Eyebrow({
  id,
  as: Tag = "p",
  className = "",
  children,
}: {
  id: SectionId;
  as?: "p" | "h2" | "span";
  className?: string;
  children?: ReactNode;
}) {
  const label = children ?? sections.find((s) => s.id === id)?.label;
  return (
    <Tag className={`font-mono text-[11px] font-normal uppercase tracking-[0.3em] text-muted ${className}`}>
      <span className="text-brand">{sectionNumber(id)}</span> {label}
    </Tag>
  );
}
