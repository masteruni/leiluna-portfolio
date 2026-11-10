// Checks shared by the forms in the browser and the route that sends them (src/app/api/send/route.ts), so both
// agree on what counts as valid. Plain functions: no "use client", so the server can call them too.

// Turns "@brand", "brand" or a profile link (instagram.com/brand/?hl=en) into "brand". Returns null when what's
// left isn't a possible Instagram username (letters, numbers, dots and underscores, up to 30).
export function normalizeHandle(input: string): string | null {
  let s = input.trim();
  const url = s.match(/instagram\.com\/([^/?#\s]+)/i);
  if (url) s = url[1];
  s = s.replace(/^@+/, "").replace(/\/+$/, "");
  return /^[A-Za-z0-9._]{1,30}$/.test(s) ? s.toLowerCase() : null;
}

export const isEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s.trim());

// The longest each free-text field may be. The inputs stop at these, and the server trims to them.
export const LIMITS = { name: 120, email: 200, brand: 160, link: 300, message: 5000 } as const;
