import type { ReactNode } from "react";

// How every section between the hero and the closing call to action opens: a heading that says what the section
// is, and one sentence under it. No label above it and no entrance animation; the heading is simply there when
// you arrive. (The type lives in globals.css: `heading-section` and `lede`.)
export function SectionHead({
  title,
  id,
  children,
  className = "",
}: {
  title: ReactNode;
  /** An id for the heading, when the section points at it with aria-labelledby. */
  id?: string;
  /** The sentence under the heading. */
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <h2 id={id} className="heading-section">
        {title}
      </h2>
      {children && <p className="lede mt-5">{children}</p>}
    </div>
  );
}
