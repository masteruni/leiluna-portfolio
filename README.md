# Leiluna Studio

**Your story. Our creative orbit.**
Website for Leiluna Studio: social media management, content creation and AI workflows.
Built with Next.js, Tailwind CSS, Motion and Lenis, and deployed on Vercel at [leilunastudio.com](https://leilunastudio.com).

## Edit the content (no design knowledge needed)

| What | Where |
| --- | --- |
| Email, socials, headline, manifesto, services, stats, process (and what each phase delivers), founders, FAQs, testimonials, reply time, `updated` date | `src/content/site.ts` |
| Section order | `src/app/page.tsx` |
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
2. **Hero:** a real-time WebGL planet with the Leiluna pink atmosphere (`src/components/Planet.tsx`) behind a phone playing real Library reels. The headline, the two next steps and three verified numbers sit beside it.
3. **Horizon:** the page rises into the hero like the curve of a moon, with the services riding along the edge.
4. **Manifesto:** the studio statement lights up word by word as you scroll.
5. **A month with us:** a sample content plan as a calendar; pick a day to see its production checklist.
6. **Services:** a pinned orbital system; each service lights up its own orbit (a plain list on phones).
7. **Work:** the case studies as full-width cards that stack as you scroll.
8. **Recent work** and **The Library:** the newest client pieces, then single reels and graphics, filterable by format and industry. Videos autoplay silently when visible, and clicking opens a full-screen viewer with sound.
9. **Process:** five phases of the moon, waxing as you scroll.
10. **Founders:** Mj and Sven, each on one of the logo's two pinks; beside the heading the mark's two crescents come together as you scroll.
11. **Testimonials:** appears automatically once `testimonials` in `site.ts` has an entry.
12. **FAQ**, then **Contact:** the page ends in a curve (the mirror of the horizon under the hero, `src/components/Dusk.tsx`) and a planet rises over the horizon behind the call to action.

### Design rules the site keeps to

- **One voice in headlines.** Headings are set in Outfit only, with no accent word in another face or colour. The serif (`.serif`) is for quoted words: client quotes and a case study's challenge and results.
- **Two display sizes.** Only the hero and the closing call to action are set huge. Every section in between opens with `SectionHead` (`src/components/SectionHead.tsx`): a heading that says what the section is, and one sentence. No label above it.
- **Motion shows the work or answers a click.** Each section has at most one scroll-driven moment (listed above). Buttons, chips and cards don't sparkle, tilt, pull toward the pointer or count up.
- **No decoration that carries no information.** No glow blobs, gradient washes, film grain or ornament glyphs; cards are flat and the work supplies the colour.

Motion respects the "reduce motion" accessibility setting.

Also built in: a scroll-progress line and active-section pill in the header, smooth in-page anchor scrolling, focus-trapped dialogs (menu, library viewer, showreel), a project brief that keeps its draft for the session, Share buttons and previous/next links on case studies, an on-brand error page, a web-app manifest, and long-lived CDN caching for videos and images.

## Run locally

```bash
npm install
npm run dev   # http://localhost:3000
```

## Deploy

Pushing to GitHub triggers a Vercel deploy automatically:
- pushes to `main` update the live site
- pushes to any other branch get their own preview URL
