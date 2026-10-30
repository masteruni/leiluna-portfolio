ROUND 0 (review of the live site, before any change)
Seen in one second: a black preloader screen with "100%"; after it clears, the pink planet arc and the phone playing a reel.
Idea (one sentence): Leiluna (luna, the moon) becomes an orbit system: services circle the brand mark, work is "put in orbit".
Live thing: the hero phone playing real client reels; the Formats picker (tap a format, watch a real example).
Layout words by section: hero=split / pillars=marquee / manifesto=statement / formats=list+phone / orbits=pinned split x5 screens / work=stacked cards / library=filtered grid / (proof, phases, founders, testimonials, faq, contact not individually reviewed)
Scores: design 7 · usability 7 · creativity 7 · content 8 -> overall 7.1 (raw)
Caps applied: inspect.mjs FAILs -> overall <= 6.0; eyebrows, monospace labels, 01/02 numbering, gradients, resting shadows, hairlines -> <= 6.5.
Top three problems:
1. Preloader hides the title. desktop-fold.jpg is a black screen with "100%"; the inspector found the h1 unreadable 1.2s after load and covered on screen 1. Fix: remove the loader or cut it to a first-visit flash under 0.6s, painting the headline on the first frame.
2. A costume layer over good work: 43 tiny tracked mono labels, 15 "(01) THE STUDIO"-style eyebrows, index numbers, ✦ glyphs, 48 hairlines, 49 text blocks under 13px, 26 font sizes in 3 faces. Fix: drop JetBrains Mono, fold eyebrows into headings, cut to ~5 sizes, nothing read below 13px.
3. Type misfires: the manifesto (34 words at 63px) runs 5-7 lines; 11 headlines switch to a pink italic serif word mid-line; a 380px empty band before the Library; the orbits section spends five screens with small text in the left half. Fix: set the manifesto as a <p> at <=36px, one face per headline, close the gap, tighten the orbits pin.
