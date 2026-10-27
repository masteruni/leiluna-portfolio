const items = [
  "Social Strategy",
  "Short-form Video",
  "Brand Design",
  "Community",
  "Content Systems",
  "Motion Graphics",
  "Analytics",
  "Carousels",
];

export function Marquee() {
  const row = [...items, ...items];
  return (
    <div className="overflow-hidden py-8" aria-hidden>
      <div className="relative -mx-4 -rotate-2 border-y border-line bg-brand-2 py-4 text-ink">
        <div className="flex w-max animate-marquee gap-8 whitespace-nowrap font-display text-2xl font-bold uppercase tracking-tight sm:text-3xl">
          {row.map((item, i) => (
            <span key={i} className="flex items-center gap-8">
              {item}
              <span className="text-brand">✦</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
