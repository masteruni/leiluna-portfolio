import type { ButtonHTMLAttributes, ReactNode } from "react";

// A selectable pill: filters, and the options in the project brief. `selected` fills it; `tone` picks the fill
// (paper for pick-one choices, brand pink for pick-several). It reports its state to screen readers itself.

export type ChipTone = "paper" | "brand";
export type ChipSize = "sm" | "md";

const sizes: Record<ChipSize, string> = { sm: "px-3.5 py-2 text-xs", md: "px-4 py-2.5 text-sm" };
const on: Record<ChipTone, string> = {
  paper: "border-paper bg-paper text-ink",
  brand: "border-brand bg-brand text-on-brand",
};
const off = "border-line text-paper/70 hover:border-paper/50 hover:text-paper";

export function chipClass(selected: boolean, tone: ChipTone = "paper", size: ChipSize = "md", className = "") {
  return `press rounded-full border pointer-coarse:min-h-11 ${sizes[size]} ${selected ? on[tone] : off} ${className}`.trim();
}

type Props = { selected: boolean; tone?: ChipTone; size?: ChipSize; className?: string; children: ReactNode } & Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "className" | "children"
>;

export function Chip({ selected, tone, size, className, children, type = "button", ...rest }: Props) {
  return (
    <button type={type} aria-pressed={selected} className={chipClass(selected, tone, size, className)} {...rest}>
      {children}
    </button>
  );
}
