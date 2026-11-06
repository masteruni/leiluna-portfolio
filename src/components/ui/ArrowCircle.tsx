import { ArrowUpRight } from "lucide-react";

// The ↗ in a circle that marks a card or row as a link. It sits inside an element with the `group` class and turns
// pink and a quarter-turn when that element is hovered, and dips while it's pressed. Purely visual: the link
// itself carries the name.

export type ArrowCircleSize = "sm" | "md" | "lg";

const sizes: Record<ArrowCircleSize, { box: string; icon: number }> = {
  sm: { box: "size-7", icon: 14 },
  md: { box: "size-10", icon: 18 },
  lg: { box: "size-14", icon: 24 },
};

export function ArrowCircle({
  size = "md",
  tone = "solid",
  className = "",
}: {
  size?: ArrowCircleSize;
  tone?: "solid" | "outline";
  className?: string;
}) {
  const s = sizes[size];
  return (
    <span
      aria-hidden
      className={`grid shrink-0 place-items-center rounded-full transition-[rotate,scale,background-color,border-color,color] duration-300 ease-[var(--ease-out)] group-hover:rotate-45 group-hover:border-brand group-hover:bg-brand group-hover:text-on-brand group-active:scale-95 group-active:duration-150 ${
        tone === "solid" ? "bg-paper text-ink" : "border border-line"
      } ${s.box} ${className}`.trim()}
    >
      <ArrowUpRight size={s.icon} strokeWidth={1.75} />
    </span>
  );
}
