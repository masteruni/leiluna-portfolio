---
name: Leiluna Studio
description: A dark, cinematic studio site where a rim of pink light does the pointing.
colors:
  brand: "#ea6a8e"
  brand-2: "#f6a6bd"
  brand-3: "#a8436a"
  on-brand: "#050506"
  accent: "#ea6a8e"
  accent-day: "#b0365f"
  ink: "#050506"
  ink-2: "#0e0d11"
  ink-3: "#1a181e"
  paper: "#f6f2ef"
  muted: "#8e8893"
  line: "rgb(246 242 239 / 0.1)"
  ink-day: "#f6f2ef"
  ink-2-day: "#ece6e2"
  ink-3-day: "#ddd5d0"
  paper-day: "#141217"
  muted-day: "#605a64"
  line-day: "rgb(20 18 23 / 0.12)"
typography:
  display:
    fontFamily: "Outfit, system-ui, sans-serif"
    fontSize: "clamp(2.8rem, 6vw, 6rem)"
    fontWeight: 700
    lineHeight: 0.9
    letterSpacing: "-0.045em"
  headline:
    fontFamily: "Outfit, system-ui, sans-serif"
    fontSize: "3rem"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "-0.04em"
  title:
    fontFamily: "Outfit, system-ui, sans-serif"
    fontSize: "1.875rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.03em"
  body:
    fontFamily: "Outfit, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.625
    letterSpacing: "0em"
  label:
    fontFamily: "Outfit, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: 1.35
    letterSpacing: "0em"
  aside:
    fontFamily: "Instrument Serif, Georgia, serif"
    fontSize: "1.25rem"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "0em"
rounded:
  tooltip: "0.5rem"
  media: "1rem"
  card: "2rem"
  pill: "9999px"
spacing:
  gutter: "1.25rem"
  gutter-wide: "2.5rem"
  section: "4rem"
  section-wide: "6rem"
  container: "80rem"
components:
  button-primary:
    backgroundColor: "{colors.brand}"
    textColor: "{colors.on-brand}"
    rounded: "{rounded.pill}"
    padding: "0.875rem 1.5rem"
  button-primary-hover:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
  button-solid:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "0.875rem 1.5rem"
  button-solid-hover:
    backgroundColor: "{colors.brand}"
    textColor: "{colors.on-brand}"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.paper}"
    rounded: "{rounded.pill}"
    padding: "0.875rem 1.5rem"
  button-glass:
    backgroundColor: "rgb(5 5 6 / 0.7)"
    textColor: "{colors.paper}"
    rounded: "{rounded.pill}"
    padding: "0.875rem 1.5rem"
  chip:
    backgroundColor: "transparent"
    textColor: "{colors.paper}"
    rounded: "{rounded.pill}"
    padding: "0.625rem 1rem"
  chip-selected:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
  chip-selected-brand:
    backgroundColor: "{colors.brand}"
    textColor: "{colors.on-brand}"
  tag:
    backgroundColor: "rgb(5 5 6 / 0.6)"
    textColor: "{colors.paper}"
    rounded: "{rounded.pill}"
    padding: "0.25rem 0.75rem"
  icon-button:
    backgroundColor: "transparent"
    textColor: "{colors.paper}"
    rounded: "{rounded.pill}"
    size: "2.75rem"
  field:
    backgroundColor: "transparent"
    textColor: "{colors.paper}"
    padding: "0.75rem 0"
  card:
    backgroundColor: "{colors.ink-2}"
    textColor: "{colors.paper}"
    rounded: "{rounded.card}"
    padding: "2.5rem"
  media-tile:
    backgroundColor: "{colors.ink-2}"
    rounded: "{rounded.media}"
---

# Design System: Leiluna Studio

## Overview

**Creative North Star: "The Eclipse"**

The page is deep space, and almost all of it is dark. Light arrives at one edge: the glowing pink rim of the hero's planet, the horizon the contact section rises over, a hairline of pink under the header as the page scrolls. Because light is rare here, wherever it falls is where the eye goes. Every decision in the system follows from that: surfaces stay flat and quiet so the rim can do the pointing.

The mood is cinematic, confident, warm and precise. Cinematic in the dark stage and the slow, deliberate motion. Confident in very large, tightly set headlines that say plainly what the studio does. Warm in the pink itself, the soft moonlight off-white in place of pure white, the italic serif asides and the founders shown as people. Precise in the hairlines, the consistent pills and the small labels that never fight the headline.

The site must never read as a generic agency template. Its shapes come from its own subject: crescents, orbits, horizons and phases, each doing a job (marking a section, showing progress, pointing at an action) and none of them used as stock decoration.

**Key Characteristics:**
- A near-black stage with a single warm accent, used as light and never as wallpaper.
- Two themes: night by default, a moonlight-paper day theme, with the hero, contact, footer and 404 staying night in both.
- One sans family for everything, plus one italic serif used only as an aside.
- Fully rounded controls that dip when pressed; large soft-cornered cards; no sharp corners.
- Flat surfaces; depth comes from glow and from shadows under the few things that float.
- Motion on one easing curve, switched off or simplified when the visitor asks for reduced motion.

## Colors

A near-monochrome night palette with one warm pink, and a day theme that swaps ink and paper while keeping the same pink.

### Primary
- **Eclipse Pink** (`brand`, #ea6a8e): the light source. It fills the one main action in a section, marks selected and active states, draws progress, and glows at edges (the planet's rim, the horizon, the scroll line).
- **Soft Corona** (`brand-2`, #f6a6bd): the paler pink at the bright end of a glow or gradient, and the sheen that follows the pointer over a portrait. Never used for text on the day theme.
- **Deep Rose** (`brand-3`, #a8436a): the dark end of pink gradients and the scrollbar's hover state.
- **Accent, night** (`accent`, #ea6a8e) and **Accent, day** (`accent-day`, #b0365f): pink for text. On night it is Eclipse Pink itself; on day it deepens so pink words stay readable on the paper background (5.3:1).
- **On-brand** (`on-brand`, #050506): text on a pink fill. Dark in both themes.

### Neutral
- **Deep Space** (`ink`, #050506): the night background. Not pure black.
- **Raised Night** (`ink-2`, #0e0d11): cards, dialogs, tooltips and media placeholders.
- **Dusk Edge** (`ink-3`, #1a181e): the deepest layer of a raised surface and the scrollbar thumb.
- **Moonlight** (`paper`, #f6f2ef): text on night, and the fill of the solid button. Not pure white.
- **Lunar Grey** (`muted`, #8e8893): secondary text and the serif asides.
- **Hairline** (`line`): a 10% Moonlight line for every border and divider.
- **Day theme** (`ink-day`, `ink-2-day`, `ink-3-day`, `paper-day`, `muted-day`, `line-day`): the same roles with ink and paper exchanged. In code both themes use the names `ink` (background) and `paper` (text), so a component written once works in both.

### Named Rules
**The Rim Light Rule.** Pink is light, not paint. It appears as the main action, a state, or a glowing edge. It never fills a section background.

**The Two Pinks Rule.** Use `brand` for fills and glow, `accent` for words. Only `accent` changes between themes, which is what keeps pink text readable on day.

**The Night Islands Rule.** The hero, the contact section, the footer and the 404 page stay night in the day theme. Anything laid over them (the header, a hover card) takes the night palette with them.

## Typography

**Display Font:** Outfit (with system-ui, sans-serif)
**Body Font:** Outfit (with system-ui, sans-serif)
**Aside Font:** Instrument Serif, italic only (with Georgia, serif)

**Character:** One geometric sans carries the whole site, from 9rem headlines down to 12px labels, so the voice never changes register. A single italic serif steps in for asides: a quieter second voice beside the confident first one.

### Hierarchy
- **Display** (700, `clamp(2.8rem, 6vw, 6rem)` and up to `clamp(3rem, 7vw, 7rem)`, line-height 0.88 to 0.95, tracking -0.045em): the hero and section headlines, set on two short lines.
- **Headline** (700, 3rem, tracking -0.04em): names and titles inside a section, such as a founder's name.
- **Title** (600, 1.875rem to 2.25rem, tracking -0.03em): dialog and form-step titles, and large numbers.
- **Body** (400, 1.125rem, line-height 1.625): section intros and paragraphs, usually at 60 to 70% opacity of the text colour and held to about 65 characters by a max width.
- **Label** (400, 0.75rem to 0.875rem): metadata, captions, tags and form labels. On phones no label drops below 11 to 12px.
- **Aside** (Instrument Serif italic, 400, 1.25rem for section markers; up to 3rem for a case study's challenge and results): section markers beside their moon, a founder's full name, the one phrase a headline leans on.

### Named Rules
**The Tight Headline Rule.** Display type is set tight (line-height under 1, tracking around -0.045em) and broken by hand into two lines. Never let a headline wrap on its own into three or more.

**The One Aside Rule.** The serif is always italic, always weight 400, and never used for body copy, buttons or labels inside controls.

**The Sentence Case Rule.** Labels and section markers are sentence case at their natural tracking. No tracked-out capitals.

## Layout

Content sits in a centred column 80rem wide (the hero stretches to 90rem), with a 1.25rem gutter on phones and 2.5rem from the `sm` breakpoint. Sections are separated by 4rem of padding top and bottom, 6rem from `md`. The rhythm is generous rather than dense: each section opens with a small marker, a two-line headline and, on wide screens, a short intro set to the right of the headline's baseline.

Most sections are a single column or an asymmetric two-column split (text beside a visual, or a narrow sticky sidebar beside long text). Lists of work are a horizontal rail (Recent work), a masonry grid of two, three or four columns by breakpoint (the Library), or a stack of full-width cards (Selected work). Identical card grids are not part of the system.

Two sections pin while the visitor scrolls through their content (the service orbits, the stacked case studies). On screens shorter than 760px (`short`), pinned sections and the menu tighten so nothing falls below the fold. Touch targets are at least 2.75rem tall on coarse pointers. Breakpoints are Tailwind's defaults: 640, 768, 1024 and 1280px.

## Elevation & Depth

Flat, lit by glow. Surfaces sit on the page without shadows; a raised surface is told apart by a slightly lighter ink and a hairline border. Depth comes from light instead: radial pink glows behind objects, the planet's rim, a slowly drifting starfield behind the page on night, and a faint film grain over everything.

Shadows are reserved for the few things that truly float above the page: the hero phone, a dialog, a hover preview, a tooltip, the magnifying lens.

### Shadow Vocabulary
- **Floating object** (`box-shadow: 0 40px 80px -30px rgb(0 0 0 / 0.9)`): a device or cover lifted off its card.
- **Hover card** (`box-shadow: 0 30px 70px -20px rgb(0 0 0 / 0.85)`): previews and tooltips that appear over content.
- **Dialog glow** (`box-shadow: 0 40px 120px -20px rgb(234 106 142 / 0.3)`): a dialog's shadow is pink, so it reads as lit from behind.
- **Focus line** (`box-shadow: 0 1px 0 0 var(--brand)`): thickens a field's bottom border when it has focus.

### Named Rules
**The Floating-Only Rule.** If it scrolls with the page, it has no shadow. Shadows belong to things that sit above the page.

**The Glow-Not-Lift Rule.** To draw attention to something, light it (a pink glow, a lit rim) rather than raising it.

## Shapes

Soft and round, with no sharp corners anywhere. Every control is a full pill (9999px): buttons, chips, tags, icon buttons, the header's navigation. Cards, panels and dialogs take a large 2rem corner; media tiles take 1rem; tooltips 0.5rem.

Borders are a single 1px hairline at 10% of the text colour. There are no thick or coloured side borders. Form fields are the exception to the pill: they have no box at all, only a hairline along the bottom.

The recurring geometry is the circle and its parts: crescents (the mark, the phase markers), full orbits (services, the scroll indicator, the light circling a button's rim) and long shallow arcs (the horizon that closes the hero and opens the contact section).

## Components

Soft and tactile: fully rounded, quick to respond, and physical when pressed.

### Buttons
- **Shape:** full pill (9999px). Three sizes: small (0.5rem 1rem, 12px text), medium (0.625rem 1.25rem, 14px), large (0.875rem 1.5rem, 14px).
- **Primary:** Eclipse Pink fill with dark text; the one main action in a section. On hover it swaps to Moonlight with ink text.
- **Solid:** Moonlight fill with ink text, for a strong action on a busy or pink background. On hover it swaps to pink.
- **Outline:** a hairline border and 80% text, for a secondary action beside a primary one. On hover the border and text go to full Moonlight.
- **Glass:** 70% ink with a backdrop blur, only for buttons laid over photos and video.
- **Press:** every button scales to 0.97 while held (160ms), so a tap is felt as it lands. Disabled buttons drop to 30% opacity.
- **Orbit Check:** buttons that open the free audit carry a small pink light circling their rim. No other button does.

### Chips
- **Style:** a pill with a hairline border and 70% text, in two sizes.
- **State:** selected fills with Moonlight (pick-one choices and filters) or Eclipse Pink (pick-several choices). The chip reports its pressed state to assistive technology itself.

### Tags
- **Style:** a small frosted pill (60% ink, backdrop blur, 12px medium text) laid over media to name an industry or format. Informational only, never a button. One tag per tile may use the accent colour.

### Cards / Containers
- **Corner Style:** 2rem for cards, panels and dialogs; 1rem for media tiles.
- **Background:** Raised Night, sometimes at 70% with a backdrop blur over the page behind; a case-study card adds soft radial washes in the client's own two colours.
- **Shadow Strategy:** none at rest (see Elevation & Depth). Dialogs take the pink Dialog glow.
- **Border:** a single hairline.
- **Internal Padding:** 1.5rem on phones, 2.5rem from `sm`, up to 3.5rem on large case-study cards.

### Inputs / Fields
- **Style:** no box. Transparent background, a hairline along the bottom, 0.75rem vertical padding, placeholder at 30% text colour. Labels sit above in small muted text.
- **Focus:** the bottom line turns Eclipse Pink (in the Orbit Check dialog it also thickens by 1px).
- **Error:** the line turns pink and a short message appears below in the accent colour, naming what to fix. Fields are 16px on touch screens so the page doesn't zoom.

### Navigation
- **Style:** a fixed header with the mark at the left, a pill of five section links in the centre (wide screens), and a theme toggle, a "Let's talk" pill and the Menu button at the right. A pink pill slides to the section being read, and a faint Moonlight one follows the pointer. A 1px pink gradient line along the header's bottom edge shows how far the page has been scrolled.
- **Menu:** a full-screen layer that slides down, listing the sections in display type with a moon phase beside each.

### Section marker
Each section opens with a small moon beside its name in the italic serif. The moon's phase follows the section's place on the page, waxing from a thin crescent in the first section to full at the last, so the markers double as a sense of progress.

### Arrow circle
A circle holding an up-right arrow marks a whole card or row as a link. On hover it turns pink and rotates a quarter-turn.

### Hover extras
With a mouse only, and always with a plain fallback for touch and keyboard: client logos name themselves in a small tooltip, the hero's numbers preview the client page they come from, a magnifying lens follows the pointer over a case study's screenshots, and in the Library and Recent work the piece under the pointer stays lit while the rest dim to half.

### Motion
One easing curve for everything that moves under CSS: `cubic-bezier(0.16, 1, 0.3, 1)`, at 160ms for presses, 300ms for hovers and state changes, and 500 to 700ms for entrances. Sections fade in without sliding; only headlines rise, line by line. Things that follow the pointer use springs. With reduced motion, loops stop, entrances appear in place and pointer-following effects are off.

## Do's and Don'ts

### Do:
- **Do** keep pink rare: one primary action per section, states, and edges of glow.
- **Do** use `brand` for fills and glow and `accent` for pink text, so the day theme keeps its contrast.
- **Do** build every control as a full pill with the press dip (scale 0.97, 160ms).
- **Do** set headlines in Outfit 700 on two hand-broken lines with tracking near -0.045em.
- **Do** open a new section with the moon marker and its name in the italic serif.
- **Do** take shapes from the subject (crescents, orbits, horizons, phases) and give each one a job.
- **Do** keep the hero, contact, footer and 404 night in both themes.
- **Do** give every pointer-only effect a plain equivalent for touch and keyboard, and respect reduced motion.
- **Do** keep touch targets at least 2.75rem tall and small labels at 11px or more on phones.

### Don't:
- **Don't** let the site read as a generic agency template: no stock layouts, and no grid of identical cards.
- **Don't** fill a section background with pink, or add a second accent colour.
- **Don't** use pure black or pure white for surfaces or text; the palette is Deep Space and Moonlight.
- **Don't** put a shadow on anything that scrolls with the page.
- **Don't** use sharp corners, thick borders or a coloured stripe down one side of a card.
- **Don't** set labels in tracked-out capitals, or use the serif for body copy or controls.
- **Don't** slide every section up as it enters; sections fade, and only headlines rise.
- **Don't** run `shadcn init` or let a component library write its own colour variables into `globals.css`: `--accent` and `--muted` are this system's own names.
