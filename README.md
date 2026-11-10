# Leiluna Studio

**Your story. Our creative orbit.**
Website for Leiluna Studio: social media management, content creation and AI workflows.
Built with Next.js, Tailwind CSS, Motion and Lenis, and deployed on Vercel at [leilunastudio.com](https://leilunastudio.com).

## Edit the content (no design knowledge needed)

| What | Where |
| --- | --- |
| Email, socials, headline, manifesto, services, stats, process (and what each phase delivers), founders, FAQs, testimonials, reply time, `updated` date | `src/content/site.ts` |
| Section order and numbering ("(03) Selected work") | `src/lib/sections.ts` |
| Portfolio projects and case studies (per brand) | `src/content/projects.ts` |
| The Library: single reels, videos and graphics by style and industry | `src/content/library.ts` (files go in `public/library/`) |
| Client logos in the "Trusted by" line (hero and contact) | `clients` in `src/content/site.ts` (logos go in `public/clients/`) |
| Brand colors | the `:root` block at the top of `src/app/globals.css` |
| Founder photos | add e.g. `public/team/juri.jpg`, then set `photo: "/team/juri.jpg"` in `site.ts` |
| Project images / videos | add files to `public/work/` and set `cover` / `video` on the project |
| Logo files | `public/brand/` (mark, wordmark, full logo) |

Anything marked `[PLACEHOLDER]` is sample content.

## The experience, section by section

1. **Intro loader:** the two crescents of the logo spin in and lock together while the slogan "waxes" from hairline to full weight as the page loads; then the dark lifts like an eclipse ending (first visit per session).
2. **Hero:** a real-time WebGL planet with the Leiluna pink atmosphere (`src/components/Planet.tsx`). The light follows the mouse and the eclipse shifts on scroll.
3. **Manifesto:** the studio statement lights up word by word as you scroll.
4. **Services ("five orbits"):** a pinned orbital system; each service lights up its own orbit.
5. **Work:** vertical scroll drives a horizontal film-strip of brand case studies (a swipe carousel on phones).
6. **The Library:** individual reels and graphics, filterable by format and industry. Videos autoplay silently when visible, and clicking opens a full-screen viewer with sound.
7. **Numbers:** odometer-style rolling digits.
8. **Process:** five phases of the moon, waxing as you scroll.
9. **Founders:** Mj & Sven, framed by the logo's crescents; beside the heading the mark's two crescents come together as you scroll.
10. **Testimonials:** cinematic serif quotes; appears automatically once `testimonials` in `site.ts` has an entry.
11. **Contact:** the page ends in a curve (the mirror of the horizon under the hero, `src/components/Dusk.tsx`) and a planet rises over the horizon behind the call to action.

Motion respects the "reduce motion" accessibility setting, and effects that follow the pointer appear only on devices with a mouse.

Also built in: a scroll-progress line and active-section underline in the header, smooth in-page anchor scrolling, focus-trapped dialogs (menu, library viewer, showreel), a project brief that keeps its draft for the session, Share buttons and previous/next links on case studies, an on-brand error page, a web-app manifest, and long-lived CDN caching for videos and images.

## Components from shadcn and Aceternity UI

`components.json` lets the shadcn CLI add components from the shadcn and [Aceternity UI](https://ui.aceternity.com) registries:

```bash
npx shadcn@latest add @aceternity/<component>
```

They land in `src/components/ui/` (lower-case file names, next to the site's own pieces) and are then restyled with the brand colours in `globals.css`. Don't run `shadcn init`: it would overwrite the palette. In use so far:

- `lens.tsx`: a magnifying glass over the screenshots in a case study's gallery, so their small numbers can be read.
- `animated-tooltip.tsx`: each logo in the "Trusted by" line names its brand on hover.
- `moving-border.tsx`: the light orbiting the rim of the "Orbit Check" buttons.
- `link-preview.tsx`: the hero's numbers link to the case study they come from and preview the client's page on hover. Set which case studies with `proof` on each entry of `stats` in `src/content/site.ts`.
- Focus cards, as a few lines of CSS in `globals.css`: in the Library and Recent work, the piece under the mouse stays lit and the others dim. Add `data-focus-group` to a list and `data-focus` to its cards to use it elsewhere.

## Run locally

```bash
npm install
npm run dev   # http://localhost:3000
```

## Deploy

Pushing to GitHub triggers a Vercel deploy automatically:
- pushes to `main` update the live site
- pushes to any other branch get their own preview URL
