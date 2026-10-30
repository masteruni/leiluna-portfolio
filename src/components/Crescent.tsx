import { useId, type CSSProperties } from "react";

// The crescent from the Leiluna mark as a filled shape: a disc with a second, offset disc cut out of it.
// dx and dy move the cut-out, in percent of the disc's width; the lit edge is on the opposite side.
export function Crescent({
  color,
  dx,
  dy,
  base,
  className = "",
  style,
}: {
  color: string;
  dx: number;
  dy: number;
  /** fills the cut-out too, so the shape reads as a planet with a lit limb */
  base?: string;
  className?: string;
  style?: CSSProperties;
}) {
  const id = useId();
  return (
    <svg viewBox="0 0 100 100" aria-hidden className={className} style={style}>
      <defs>
        <mask id={id}>
          <rect width="100" height="100" fill="white" />
          <circle cx={50 + dx} cy={50 + dy} r="50" fill="black" />
        </mask>
      </defs>
      {base && <circle cx="50" cy="50" r="50" fill={base} />}
      <circle cx="50" cy="50" r="50" fill={color} mask={`url(#${id})`} />
    </svg>
  );
}
