import Image from "next/image";

// The Leiluna mark. Its white crescent would vanish on the light theme, so a version with an ink crescent
// takes over there (the swap is CSS, see .mark-day in globals.css, so night islands keep the white one).
export function Mark({ width, height, className = "", priority }: { width: number; height: number; className?: string; priority?: boolean }) {
  return (
    <>
      <Image src="/brand/mark.png" alt="" width={width} height={height} priority={priority} className={`mark-night ${className}`} />
      <Image src="/brand/mark-ink.png" alt="" width={width} height={height} className={`mark-day ${className}`} />
    </>
  );
}
