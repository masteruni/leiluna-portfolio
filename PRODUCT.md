# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Anyone deciding whether to hire a studio for their social media and content. Three groups, with no one of them ranked above the others (confirmed in the init interview):

- **Small business owners**: local and small brands where the owner decides and has little time for social media.
- **Founders and creators**: personal brands, coaches and page owners who want an audience grown around them or their theme page.
- **Marketing teams**: established brands whose marketing manager hires a studio to produce and run content.

They arrive to judge the studio's work and results, find work that looks like what they want, and decide whether to get in touch.

## Product Purpose

The website of Leiluna Studio, a social media and content studio. It exists to win clients for the studio.

Success is a visitor **sending a project brief** (confirmed in the init interview as the action that matters most). The free 30-minute call and the Free Orbit Check are lower-commitment routes to the same relationship, for visitors who aren't ready to brief.

## Positioning

Two reasons to choose Leiluna over another studio or a freelancer (confirmed in the init interview):

1. **Proven reach.** Real numbers from real client pages: a page grown and managed to 306K followers, reels with millions of views, a 2.6M-view reel on a 3.8K-follower account.
2. **Two founders, hands-on.** Clients work directly with Mj and Sven, the people who do the work.

AI workflows and having every discipline under one roof are true of the studio and are sold as services, but they are not the lead claims.

## Operating Context

- The studio works on Instagram, TikTok, YouTube and Facebook, for clients anywhere ("Working worldwide").
- Five services: social media management, content creation and production, AI-powered content generation, AI automation and workflows, content strategy and growth.
- Plans start at $500/month; the exact plan is shaped on the free call.
- A project runs in five phases: Discover, Plan, Create, Launch, Grow. Create, Launch and Grow repeat monthly.
- The studio replies to a brief within one business day.
- Ways in, all on the site: the project brief (four short steps), the free 30-minute call (Calendly), the Free Orbit Check (an Instagram handle and an email, for three fixes in 48 hours), and email.
- The site's content is edited by the studio itself in `src/content/` (`site.ts`, `projects.ts`, `library.ts`, `recent.ts`, `month.ts`), without design knowledge. The README says where each thing lives.

## Capabilities and Constraints

- Next.js on Vercel. Pushes to `main` update the live site at leilunastudio.com; other branches get preview URLs.
- No backend. The brief and the Orbit Check open the visitor's email app with the request written out, and offer a copy button if it doesn't open.
- Pages: the homepage and one case-study page per project (`/work/<slug>`).
- Light and dark themes. The hero, the contact section, the footer and the 404 page stay dark in both.
- Sections that depend on content hide themselves until that content exists (Testimonials, Recent work).
- Existing behaviour the site already holds to: motion respects the reduced-motion setting, dialogs trap focus, keyboard focus is visible, and client media is protected from drag-to-save and long-press saving.
- Terms with fixed meanings on the site: **Orbit Check** (the free feed audit), **the Library** (single pieces by format and industry, as opposed to case studies), **Selected work** (case studies), **Recent work** (the newest pieces for current brands), **sample edit** (a piece made on the studio's own initiative, not for the brand shown).

## Brand Commitments

- Name: Leiluna Studio. Slogan: "Your story. Our creative orbit."
- The mark is two crescents (files in `public/brand/`), standing for the two founders.
- The voice uses the moon and orbit as its vocabulary: services are "orbits", the process runs "from new moon to full orbit", the audit is an "Orbit Check".
- Plain statements of what the studio does come first; the metaphor never replaces them.
- Clients are described as "Trusted by", never as current clients: the site doesn't say which engagements are ongoing.

## Evidence on Hand

- **Case studies** (`src/content/projects.ts`, media in `public/work/`): Business Resilience Mindset (306K followers, 9M top reel, eleven reels over 3M views) and The AI Edge Daily (2.6M-view top reel on a 3.8K-follower account, about 680 times its follower count). Every number comes from the client's own screenshots, which are shown in each case study's gallery.
- **Headline numbers** (`stats` in `src/content/site.ts`): 29M+ views across the two clients' six pinned reels, 680×, 306K. Each names the case study it comes from.
- **Clients** (`clients` in `src/content/site.ts`, logos in `public/clients/`): Kabogera Beauty, MD Raymundo Consulting Services, Business Resilience Mindset, The AI Edge Daily.
- **The Library** (`src/content/library.ts`, files in `public/library/`): 38 reels and graphics across industries. Some are sample edits and are labelled as such.
- **Founders** (`founders` in `src/content/site.ts`, photos in `public/team/`, certification marks in `public/certs/`): Mj (Marian Jurielle D. Raymundo), Social Media & Client Strategy Lead, and Sven M. Laureno, AI Creative & Operations Lead.

Not available, and not to be invented:

- **Testimonials.** There are none yet; the section stays hidden until real quotes are added.
- **The studio's own social profiles.** The links in `site.ts` are bare domains and stay hidden until real profile URLs are added.
- Client locations, growth timelines and before-and-after material.

## Product Principles

1. **Proof before promise.** A claim appears only with a client's own page behind it, and a visitor can get from the claim to that proof.
2. **The founders are the offer.** Mj and Sven are named, shown and reachable; nothing on the site suggests a larger or more anonymous operation.
3. **One main ask.** The project brief is the goal. The call and the Orbit Check exist to make the first step smaller, not to compete with it.
4. **Any brand should see itself.** The work is shown across formats and industries so that an owner, a creator and a marketing manager each find something close to their own case.
5. **Nothing invented.** No fabricated quotes, clients or numbers; sample work is labelled as sample work.
