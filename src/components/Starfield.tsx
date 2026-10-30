"use client";

import { useEffect, useRef } from "react";

type Star = { x: number; y: number; z: number; r: number; pink: boolean; phase: number; speed: number };

const COUNT = 450;

// A slowly turning field of stars for the 404 page: three depths that drift with the mouse (nearer stars
// move more), twinkle on their own rhythm, and part around the pointer. A still frame for reduced motion.
export function Starfield() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Positions are in a square around the centre (-1…1), so the field fills any screen shape as it turns.
    const stars: Star[] = Array.from({ length: COUNT }, () => {
      const z = 0.25 + Math.random() * 0.75; // depth: 1 is nearest
      return {
        x: Math.random() * 2 - 1,
        y: Math.random() * 2 - 1,
        z,
        r: 0.4 + z * z * 1.4,
        pink: Math.random() < 0.14,
        phase: Math.random() * Math.PI * 2,
        speed: 0.6 + Math.random() * 1.8,
      };
    });

    let w = 0;
    let h = 0;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const mouse = { x: 0, y: 0, tx: 0, ty: 0, px: -9999, py: -9999 };
    const move = (e: PointerEvent) => {
      mouse.tx = e.clientX / w - 0.5;
      mouse.ty = e.clientY / h - 0.5;
      mouse.px = e.clientX;
      mouse.py = e.clientY;
    };

    const draw = (t: number) => {
      mouse.x += (mouse.tx - mouse.x) * 0.05;
      mouse.y += (mouse.ty - mouse.y) * 0.05;
      ctx.clearRect(0, 0, w, h);
      const size = Math.max(w, h) * 0.75;
      for (const s of stars) {
        const a = t * 0.000012 * (0.4 + s.z); // nearer stars turn a touch faster
        const cos = Math.cos(a);
        const sin = Math.sin(a);
        let x = w / 2 + (s.x * cos - s.y * sin) * size - mouse.x * 60 * s.z;
        let y = h / 2 + (s.x * sin + s.y * cos) * size - mouse.y * 60 * s.z;
        if (x < -10 || x > w + 10 || y < -10 || y > h + 10) continue;
        // part around the pointer
        const dx = x - mouse.px;
        const dy = y - mouse.py;
        const d = Math.hypot(dx, dy);
        if (d < 140 && d > 0) {
          const push = (1 - d / 140) * 28 * s.z;
          x += (dx / d) * push;
          y += (dy / d) * push;
        }
        const twinkle = still ? 0.8 : 0.55 + 0.45 * Math.sin(t * 0.001 * s.speed + s.phase);
        ctx.globalAlpha = twinkle * (0.35 + s.z * 0.65);
        ctx.fillStyle = s.pink ? "#f6a6bd" : "#f6f2ef";
        ctx.beginPath();
        ctx.arc(x, y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    if (still) {
      draw(0);
      const redraw = () => {
        resize();
        draw(0);
      };
      window.addEventListener("resize", redraw);
      return () => window.removeEventListener("resize", redraw);
    }

    let raf = requestAnimationFrame(function loop(t) {
      draw(t);
      raf = requestAnimationFrame(loop);
    });
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", move);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", move);
    };
  }, []);

  return <canvas ref={ref} aria-hidden className="pointer-events-none absolute inset-0 size-full" />;
}
