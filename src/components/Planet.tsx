"use client";

import type { MotionValue } from "motion/react";
import { useEffect, useRef } from "react";

const VERT = `attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}`;

// A back-lit planet: dark surface, pink atmospheric rim (like the Leiluna header), drifting stars.
const FRAG = `
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uMouse;
uniform vec3 uPlanet; // x, y, radius in screen-height units
uniform float uScroll;
uniform float uLight; // base light angle
uniform vec3 uColor;

float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3. - 2. * f);
  return mix(mix(hash(i), hash(i + vec2(1., 0.)), u.x), mix(hash(i + vec2(0., 1.)), hash(i + vec2(1., 1.)), u.x), u.y);
}
float fbm(vec2 p){ float v = 0., a = .5; for (int i = 0; i < 5; i++){ v += a * noise(p); p *= 2.03; a *= .5; } return v; }

void main(){
  vec2 uv = (gl_FragCoord.xy - .5 * uRes) / uRes.y;
  vec2 c = uPlanet.xy;
  float R = uPlanet.z;
  vec2 d = uv - c;
  float r = length(d);

  // light sweeps around the limb as you scroll; the mouse nudges it
  float ang = uLight - uScroll * 1.1 + uMouse.x * .35;
  vec3 L = normalize(vec3(cos(ang), sin(ang) + uMouse.y * .25, -.32));

  // planet surface (evaluated with a clamped normal so it can blend across the limb)
  vec2 dc = d * min(1., (R - .0005) / max(r, 1e-4));
  vec3 n = vec3(dc / R, sqrt(max(1. - dot(dc, dc) / (R * R), 0.)));
  float diff = max(dot(n, L) + .08, 0.);
  float fres = pow(1. - n.z, 2.6);
  vec2 sp = n.xy / (n.z + 1.2) * 2.4 + vec2(uTime * .012, uTime * .004);
  float tex = fbm(sp * 3.) * .6 + fbm(sp * 9.) * .4;
  vec3 inside = vec3(.012, .01, .016) + uColor * diff * (.06 + .22 * tex)
    + uColor * fres * diff * 2.6 + vec3(1., .86, .92) * pow(diff, 10.) * fres * 1.6;

  // space: drifting stars + atmosphere
  vec3 space = vec3(0.);
  vec2 sg = (gl_FragCoord.xy + vec2(uTime * 4., uScroll * 120.)) / 2.2;
  float h = hash(floor(sg));
  if (h > .9965) {
    float tw = .45 + .55 * sin(uTime * (1. + h * 3.) + h * 90.);
    space += vec3(1., .93, .96) * smoothstep(.3, 0., length(fract(sg) - .5)) * tw * .9;
  }
  float o = max(r - R, 0.);
  float facing = pow(max(dot(d / max(r, 1e-4), normalize(L.xy)) * .5 + .5, 0.), 2.2);
  space += uColor * (exp(-o * 26.) * (.08 + facing * 1.5) + exp(-o * 5.) * facing * .22);

  float px = 1.5 / uRes.y;
  vec3 col = mix(inside, space, smoothstep(R - px, R + px, r));

  // deep-space vignette + a faint nebula wash
  col += uColor * .035 * fbm(uv * 1.6 + uTime * .01) * (1. - smoothstep(.0, 1.2, length(uv - c * .4)));
  col *= 1. - .28 * dot(uv, uv);
  gl_FragColor = vec4(col, 1.);
}`;

export function Planet({ progress, className = "" }: { progress?: MotionValue<number>; className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { antialias: false, alpha: false, powerPreference: "high-performance" });
    if (!gl) return;

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const u = (n: string) => gl.getUniformLocation(prog, n);
    const uRes = u("uRes"), uTime = u("uTime"), uMouse = u("uMouse"), uPlanet = u("uPlanet"), uScroll = u("uScroll"), uColor = u("uColor"), uLight = u("uLight");
    gl.uniform3f(uColor, 0.918, 0.416, 0.557); // #ea6a8e

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    let w = 0, h = 0, raf = 0, visible = true;
    const start = performance.now();

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uRes, canvas.width, canvas.height);
    };

    const draw = () => {
      const t = (performance.now() - start) / 1000;
      const s = progress?.get() ?? 0;
      mouse.x += (mouse.tx - mouse.x) * 0.05;
      mouse.y += (mouse.ty - mouse.y) * 0.05;
      const aspect = w / h;
      // Desktop: huge planet bleeding off the right edge, lit from the upper left.
      // Portrait screens: the planet hangs above the headline, lit from below like an eclipse.
      const wide = aspect > 1;
      const px = wide ? aspect / 2 - 0.02 + s * 0.12 : 0.22;
      const py = wide ? -0.08 + s * 0.35 : 0.56 + s * 0.25;
      const pr = wide ? 0.58 + s * 0.15 : 0.5;
      gl.uniform1f(uLight, wide ? 2.45 : -2.35);
      gl.uniform1f(uTime, reduce ? 0 : t);
      gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.uniform3f(uPlanet, px, py, pr);
      gl.uniform1f(uScroll, s);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const loop = () => {
      if (visible) draw();
      raf = requestAnimationFrame(loop);
    };

    const onMove = (e: PointerEvent) => {
      mouse.tx = (e.clientX / innerWidth - 0.5) * 2;
      mouse.ty = -(e.clientY / innerHeight - 0.5) * 2;
    };

    const io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting));
    io.observe(canvas);
    const ro = new ResizeObserver(() => {
      resize();
      draw();
    });
    ro.observe(canvas);
    resize();
    if (!reduce) {
      window.addEventListener("pointermove", onMove);
      raf = requestAnimationFrame(loop);
    } else draw();
    const unsub = reduce ? progress?.on("change", draw) : undefined;

    return () => {
      unsub?.();
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [progress]);

  return <canvas ref={canvasRef} aria-hidden className={`block size-full ${className}`} />;
}
