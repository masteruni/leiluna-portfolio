// A button label that changes with state ("Copy email" → "Copied") without the button changing size: every label
// sits in the same grid cell, so the button keeps the width of the longest, and the current one crossfades in with a
// slight blur, so it reads as one label changing rather than two swapping. Screen readers only hear the current one.
export function SwapLabel<K extends string>({ current, labels }: { current: K; labels: readonly (readonly [K, string])[] }) {
  return (
    <span className="grid">
      {labels.map(([key, text]) => (
        <span
          key={key}
          aria-hidden={current !== key}
          className={`col-start-1 row-start-1 transition-[opacity,filter] duration-200 ease-[var(--ease-out)] motion-reduce:blur-0 ${
            current === key ? "opacity-100 blur-0" : "opacity-0 blur-[2px]"
          }`}
        >
          {text}
        </span>
      ))}
    </span>
  );
}
