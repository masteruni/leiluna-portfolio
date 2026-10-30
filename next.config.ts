import type { NextConfig } from "next";

// Sensible security headers for a static marketing site.
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
];

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  poweredByHeader: false,
  reactStrictMode: true,
  // public/ (about 115MB, mostly videos) is served straight from the CDN, so it never belongs in a server function.
  // Without this, any route that reads a file at runtime can pull the whole folder into its bundle.
  outputFileTracingExcludes: {
    "/*": ["public/**/*"],
  },
  images: {
    // AVIF first (smaller), WebP as the fallback; both are served automatically by next/image.
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    return [
      { source: "/(.*)", headers: securityHeaders },
      // Videos, posters and brand files change rarely and are large: let browsers keep them for a day and the
      // CDN for a year (Vercel clears its cache on every deploy, so a replaced file still goes live immediately).
      { source: "/(library|brand|team|work|clients)/(.*)", headers: [{ key: "Cache-Control", value: "public, max-age=86400, s-maxage=31536000, stale-while-revalidate=604800" }] },
    ];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
