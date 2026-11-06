import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

// The site's pill button, in one place so every button looks and moves the same. All variants dip slightly
// while pressed (`press`, in globals.css) and swap colours on hover.
//
//   primary  pink: the main action in a section ("Start a project", "Send brief")
//   solid    moonlight white: a strong action on a busy or pink background ("Close", "Copy email")
//   outline  a hairline: secondary actions next to a primary one ("Back", "Show all")
//   glass    frosted, for buttons laid over photos and video ("Sound on")
//
// Pass `href` for a link (internal paths use Next's <Link>), or leave it out for a <button>.

export type ButtonVariant = "primary" | "solid" | "outline" | "glass";
export type ButtonSize = "sm" | "md" | "lg";

const base = "press inline-flex items-center justify-center gap-2 rounded-full whitespace-nowrap pointer-coarse:min-h-11 disabled:opacity-30";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-brand font-medium text-on-brand hover:bg-paper hover:text-ink",
  solid: "bg-paper font-medium text-ink hover:bg-brand hover:text-on-brand",
  outline: "border border-line text-paper/80 hover:border-paper hover:text-paper",
  glass: "bg-ink/70 text-paper backdrop-blur-md hover:bg-paper hover:text-ink",
};

const sizes: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-xs",
  md: "px-5 py-2.5 text-sm",
  lg: "px-6 py-3.5 text-sm",
};

export function buttonClass(variant: ButtonVariant = "primary", size: ButtonSize = "lg", className = "") {
  return `${base} ${variants[variant]} ${sizes[size]} ${className}`.trim();
}

type Common = { variant?: ButtonVariant; size?: ButtonSize; className?: string; children: ReactNode };
type AsLink = Common & { href: string } & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "className" | "children" | "href">;
type AsButton = Common & { href?: undefined } & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children">;

export function Button(props: AsLink | AsButton) {
  if (props.href !== undefined) {
    const { variant, size, className, children, href, ...rest } = props;
    const cls = buttonClass(variant, size, className);
    // Internal pages go through Next's router; anything else (mailto:, https:) is a plain link.
    return href.startsWith("/") ? (
      <Link href={href} className={cls} {...rest}>
        {children}
      </Link>
    ) : (
      <a href={href} className={cls} {...rest}>
        {children}
      </a>
    );
  }
  const { variant, size, className, children, type = "button", ...rest } = props;
  return (
    <button type={type} className={buttonClass(variant, size, className)} {...rest}>
      {children}
    </button>
  );
}
