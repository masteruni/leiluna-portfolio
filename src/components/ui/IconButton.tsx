import type { ButtonHTMLAttributes, ReactNode } from "react";

// A round, hairline button holding a single glyph or icon (previous/next arrows). It needs an `aria-label`,
// since there's no visible text.

type Props = { label: string; className?: string; children: ReactNode } & Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "className" | "children" | "aria-label"
>;

export function IconButton({ label, className = "", children, type = "button", ...rest }: Props) {
  return (
    <button
      type={type}
      aria-label={label}
      className={`press grid size-11 place-items-center rounded-full border border-line hover:border-paper/60 disabled:pointer-events-none disabled:opacity-30 ${className}`.trim()}
      {...rest}
    >
      {children}
    </button>
  );
}
