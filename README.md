# Leiluna Studio

**Your story. Our creative orbit.**
Website for Leiluna Studio: social media management, content creation and AI workflows.
Built with Next.js, Tailwind CSS, Motion and Lenis, and deployed on Vercel at [leilunastudio.com](https://leilunastudio.com).

## Edit the content (no design knowledge needed)

| What | Where |
| --- | --- |
| Email, socials, headline, manifesto, services, stats, process, founders, testimonials | `src/content/site.ts` |
| Portfolio projects and case studies | `src/content/projects.ts` |
| Brand colors | the `:root` block at the top of `src/app/globals.css` |
| Founder photos | add e.g. `public/team/juri.jpg`, then set `photo: "/team/juri.jpg"` in `site.ts` |
| Project images / videos | add files to `public/work/` and set `cover` / `video` on the project |
| Logo files | `public/brand/` (mark, wordmark, full logo) |

Anything marked `[PLACEHOLDER]` is sample content.

## The experience, section by section

1. **Intro loader:** the two crescents of the logo spin in and lock together (first visit per session).
2. **Hero:** a real-time WebGL planet with the Leiluna pink atmosphere (`src/components/Planet.tsx`). The light follows the mouse and the eclipse shifts on scroll.
3. **Manifesto:** the studio statement lights up word by word as you scroll.
4. **Services ("five orbits"):** a pinned orbital system; each service lights up its own orbit.
5. **Work:** vertical scroll drives a horizontal film-strip of projects (a swipe carousel on phones).
6. **Numbers:** odometer-style rolling digits.
7. **Process:** five phases of the moon, waxing as you scroll.
8. **Founders:** Juri & Sven, framed by the logo's crescents.
9. **Testimonials:** cinematic serif quotes.
10. **Contact:** a planet rises over the horizon behind the call to action.

Motion respects the "reduce motion" accessibility setting, and the custom cursor appears only on devices with a mouse.

## Run locally

```bash
npm install
npm run dev   # http://localhost:3000
```

## Deploy

Pushing to GitHub triggers a Vercel deploy automatically:
- pushes to `main` update the live site
- pushes to any other branch get their own preview URL
