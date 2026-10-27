# Leiluna — Portfolio

Portfolio for a social media manager, content strategist, video editor and graphic designer.
Built with Next.js, Tailwind CSS and Motion, and deployed on Vercel.

## Edit the content (no design knowledge needed)

| What | Where |
| --- | --- |
| Name, tagline, email, socials, stats, services, process, about, toolkit, experience, testimonials | `src/content/site.ts` |
| Portfolio projects and case studies | `src/content/projects.ts` |
| Brand colors | the `:root` block at the top of `src/app/globals.css` |
| Your photo | add `public/me.jpg`, then set `photo = "/me.jpg"` in `src/components/About.tsx` |
| Your CV | replace `public/resume.pdf` |
| Project images / videos | add files to `public/work/` and set `cover` / `video` on the project |

Anything marked `[PLACEHOLDER]` is sample content.

### Project card shapes
Each project has a `format` that matches how the content actually lives on social:
`reel` (9:16), `square` (1:1), `portrait` (4:5), `wide` (16:9).

## Run locally

```bash
npm install
npm run dev   # http://localhost:3000
```

## Deploy

Pushing to GitHub triggers a Vercel deploy automatically:
- pushes to the production branch (usually `main`) update the live site
- pushes to any other branch get their own preview URL
