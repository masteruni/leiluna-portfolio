import { Bookmark, Heart, MessageCircle, Music2, Send } from "lucide-react";
import { site } from "@/content/site";

// [PLACEHOLDER] slides — swap the text/gradients, or replace the stack with a real <video> of your best reel.
const slides = [
  { kicker: "POV:", text: "your brand finally goes viral", from: "var(--brand)", to: "var(--brand-3)" },
  { kicker: "3 hooks", text: "that never miss", from: "var(--brand-2)", to: "#00b37e" },
  { kicker: "Before → After", text: "a feed glow-up", from: "var(--brand-3)", to: "#3dd6ff" },
];

export function PhoneReel() {
  const loop = [...slides, slides[0]];
  return (
    <div className="relative mx-auto w-[min(62vw,300px)]" aria-hidden>
      {/* phone */}
      <div className="relative aspect-[9/19] rotate-[4deg] rounded-[2.75rem] border border-paper/15 bg-ink-2 p-2.5 shadow-[0_40px_120px_-30px_var(--brand)]">
        <div className="relative size-full overflow-hidden rounded-[2.25rem] bg-ink">
          <div className="animate-reel absolute inset-0">
            {loop.map((s, i) => (
              <div
                key={i}
                className="absolute inset-x-0 flex h-full flex-col justify-center p-6 pr-14"
                style={{
                  top: `${i * 100}%`,
                  background: `radial-gradient(circle at 30% 25%, ${s.from}, transparent 60%), radial-gradient(circle at 80% 85%, ${s.to}, transparent 55%), var(--ink-2)`,
                }}
              >
                <p className="font-mono text-xs uppercase tracking-widest text-ink/70">{s.kicker}</p>
                <p className="mt-2 font-display text-3xl font-bold leading-[0.95] text-ink">{s.text}</p>
              </div>
            ))}
          </div>

          {/* notch */}
          <div className="absolute left-1/2 top-2 h-5 w-20 -translate-x-1/2 rounded-full bg-ink" />

          {/* reel UI */}
          <div className="absolute bottom-24 right-3 flex flex-col items-center gap-4 text-paper">
            {[
              { Icon: Heart, n: "248K" },
              { Icon: MessageCircle, n: "3.1K" },
              { Icon: Send, n: "12K" },
              { Icon: Bookmark, n: "41K" },
            ].map(({ Icon, n }) => (
              <div key={n} className="flex flex-col items-center gap-1 drop-shadow">
                <Icon size={22} strokeWidth={2.2} />
                <span className="text-[10px] font-semibold">{n}</span>
              </div>
            ))}
          </div>
          <div className="absolute inset-x-4 bottom-6 text-paper drop-shadow">
            <p className="text-sm font-semibold">@{site.name.toLowerCase()}</p>
            <p className="mt-1 flex items-center gap-1.5 text-xs text-paper/80">
              <Music2 size={12} /> original audio · {site.name}
            </p>
          </div>

          {/* floating hearts */}
          {[0, 1, 2].map((i) => (
            <Heart
              key={i}
              size={18}
              fill="var(--brand)"
              stroke="none"
              className="animate-heart absolute bottom-32 right-6 opacity-0"
              style={{ animation: `heart 3s ease-out ${i * 1}s infinite`, right: `${18 + i * 6}px` }}
            />
          ))}
        </div>
      </div>

      {/* stickers */}
      <div
        className="animate-float absolute -left-10 top-16 rounded-2xl bg-brand-2 px-3 py-2 font-display text-sm font-bold text-ink shadow-xl sm:-left-16"
        style={{ "--r": "-8deg" } as React.CSSProperties}
      >
        ▶ 12.4M views
      </div>
      <div
        className="animate-float absolute -right-6 top-[30%] rounded-2xl bg-paper px-3 py-2 font-display text-sm font-bold text-ink shadow-xl [animation-delay:1.2s] sm:-right-14"
        style={{ "--r": "6deg" } as React.CSSProperties}
      >
        +410% engagement
      </div>
      <div
        className="animate-float absolute -left-6 bottom-14 flex items-center gap-1.5 rounded-full bg-brand px-3 py-2 text-sm font-bold text-ink shadow-xl [animation-delay:2.4s] sm:-left-12"
        style={{ "--r": "-4deg" } as React.CSSProperties}
      >
        <Heart size={14} fill="currentColor" /> 248K
      </div>
    </div>
  );
}
