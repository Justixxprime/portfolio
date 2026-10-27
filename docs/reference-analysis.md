# Reference analysis

Seven reference sites, studied on 26 October 2026 for the portfolio redesign.

## Update: code was read for all seven sites, and two screen recordings were studied

After the first draft, the page code of all seven sites was read through the Firecrawl connector (HTML, inline scripts, script file names, meta tags), and two screen recordings supplied by the owner were cut into frames and viewed (frvky.online lock screen and desktop; etornamahiator.com loader and hero; oyin.design loader, floating photo stack, pill nav bar, full screen numbered menu with ring cursor). Individual script files were not opened, so how each animation is implemented is still partly inferred. Library detections in minified bundles can include false positives, so only clear ones are listed.

| Site | Stack seen | Notes from the code |
|---|---|---|
| uibeawuchi.com | Hand built, Three.js (WebGL), own scene, sound and film scripts | Uses IntersectionObserver and checks reduced motion in 5 places. Light payload for what it does. |
| frvky.online | Next.js | About 480 KB inline. No reduced motion handling found. Viewport blocks zoom. |
| etornamahiator.com | Next.js (Turbopack) | Very small inline payload, one reduced motion check. Film slate labels are real text. |
| oyin.design | Single Vite style bundle with GSAP and Lenis | Smallest HTML, about 50 ARIA attributes. Pill nav and full screen menu seen in the recording. |
| Jidekel.com | Next.js, Lenis, Three.js, Web Audio | Roughly 1.7 MB of inline data. No reduced motion handling found. Heaviest of the seven. |
| rashedatjinadu.com | Next.js, Tailwind, Lottie | Strongest accessibility markup: about 390 ARIA attributes and 140 alt attributes. |
| Forty.LeslieWilliams.design | GSAP, Three.js r180, many small own modules | Loader is exposed as an accessible progress bar. Draggable timeline has role slider and keyboard support. Film grain overlay, canvas cursor trail, music toggle with aria-pressed, a dialog gate for mobile. |

What this changes for your portfolio:
1. The most memorable sites are hand built and small, or use GSAP and Lenis sparingly. Heavy WebGL (Jidekel, 1.7 MB) is the opposite of your "fast as well as beautiful" rule.
2. Only two of the seven handle reduced motion at all. Doing it properly is a quality gap you can win on.
3. Forty shows that a loader, a timeline and a cursor can all be accessible if they carry real roles and labels. Your loader already does this and now also skips on any key.
4. Lenis is common (oyin, Jidekel) and your brief says never hijack the wheel. Decide per page, and never on case studies.

## How these were inspected (read this first)

Tools used: a page fetcher that returns extracted text, headings, links and meta tags (all seven sites), and the Firecrawl connector, which renders JavaScript and returns text, fonts and colours (oyin.design only, because the plain fetch returned nothing but meta tags).

What I could NOT observe, for any site: animation, scroll behaviour, hover states, transitions, video playback, loading sequences, the mobile layout, reduced-motion support, real screenshots. A real browser session is not available to me for these domains. Everything below about motion is inferred from copy, labels and markup, and is marked as inferred. Please open the sites yourself for the feel of the interactions.

## 1. uibeawuchi.com (Ugochukwu I, Modern Workplace Specialist)

Inspected: full page text, section structure, meta tags, share image alt text.

Strongest ideas:
- One continuous scroll told as numbered chapters (01 Connect through 13 Contact), each with a short headline and one proof point.
- A skip control on load ("Click or press any key to skip") and a "Skip to my work" link, so the show never blocks the visitor.
- Every showpiece has a plain fallback beside it (for example "Prefer a plain link?").
- Skills as an explorable thing: "tap one to see where I've used it", which is the pattern your brief asks for on the Skills page.
- Honest framing: "Client names stay private", and a footer line "Built by hand. No tracking, no cookies."
- Optional "Play" section with small browser games.

Do not copy: the terminal and mini-game gimmicks, the fake "Mac needs to restart" crash dialog, the long scripted intro.

Lesson for you: numbered chapters, a skip control, a plain fallback beside every interaction, and skills tied to real projects. Your numbered work index already points the same way.

## 2. frvky.online (Kunmi, growth and entertainment marketing)

Inspected: page text, links, meta tags.

Strongest ideas: the whole site is a macOS-style desktop (menu bar, dock, app icons, lock screen with "Swipe up to unlock"), and visitors can leave a note that goes into Testimonials. A strong single metaphor carried through every detail.

Do not copy: the metaphor itself (it is his identity), and the viewport tag, which sets maximum-scale=1 and user-scalable=no. That blocks pinch zoom and is an accessibility failure.

Lesson: one coherent metaphor beats scattered effects. Yours is the working studio and the numbered archive, not a desktop.

## 3. etornamahiator.com (Etornam, director and cinematographer)

Inspected: page text, navigation, labels. Motion inferred from labels.

Strongest ideas: film slate details as interface ("2.39:1", "FPS: 24", a percentage counter, a PLAY control), a numbered menu (01 to 05), "View Work" as the single main call to action, and a video-first home screen with the project title and category.

Do not copy: the cinema framing, which fits a director and not you.

Lesson: tiny technical labels can carry personality. Your JetBrains Mono metadata (project index, year, stack) and the existing counter loader belong to the same family.

## 4. oyin.design (Rufai Oyinkansola, brand designer)

Inspected with the rendering connector: text, fonts, colours, structure. Motion not observed.

Facts: fonts Faculty Glyphic (headings), Inter (body), Simplon Mono (labels). Warm paper background #F2EEE6, deep oxblood #5E1A17, near-black text #1D1715. Tiny type (11 px body, 14 px h2), 84 px h1, 1 px radius, a live Lagos clock.

Strongest ideas: a theatre structure ("Take your seat", Prologue, Act I The work, Act II The process, "Now showing") used for the whole page; a five-step process (Listen, Shape, Make, Refine, Launch); hover on underlined words reveals the related work; a tight, restrained palette.

Do not copy: the theatre vocabulary, and the very small body text (11 px is below comfortable reading size).

Lesson: a warm paper tone with one deep accent is exactly your Ink, Paper and Brass idea, done with discipline. Reveal work from words in the copy is a nice way to connect your statement section to real projects.

## 5. jidekel.com (Jae, brand, growth and product)

Inspected: page text and meta tags. Motion inferred.

Strongest ideas: "You do not visit a portfolio, you step into a mind"; a scroll-to-open start with a 000% progress readout; catalogue-style codes ("MJ-001 / FIELD-BUILT", "C03/S4/0028"); a stamp reading "100% HUMAN / INTENT"; a theme colour (#EDEAE3) very close to your Paper.

Do not copy: the brain illustration and the "mind" concept, which are his signature.

Lesson: specimen-style labels in mono type give a human, made-by-hand feel. This supports your standing rule that the site must read as human made.

## 6. rashedatjinadu.com (Jinadu Rasheedat, mobile engineer)

Inspected: full page text, structure, links.

Strongest ideas: project cards that state the role and link straight to the App Store and Play Store; a "How I Work" set of principles written in a direct voice; clear ways to hire; a CV download in the hero.

Do not copy: Title Case On Every Word of body copy, a "Trusted By" heading with no visible content in the extraction, the pricing tiers (they are hers), and the generic template feel.

Lesson: for each case study, show your role and the live link or store link as plain facts. Write principles in a plain voice.

## 7. Forty.LeslieWilliams.design (Leslie Williams, "Forty")

Inspected: page text, structure, meta tags. Motion inferred; an audio file is referenced.

Strongest ideas: a life told in dated chapters (1986, 1993 to 2002, 2002, 2007, 2015, 2018, 2026) with real photographs, honest and specific writing, and a closing thank-you.

Do not copy: the mobile gate ("best enjoyed on a desktop"). Your brief requires mobile to be first class. Also his story is his own.

Lesson: the About page works best as dated chapters built only from facts you give me, with real photos if you have them.

## Cross-cutting takeaways

1. Numbered, chaptered structure beats a pile of sections (sites 1, 3, 4, 5).
2. Every showpiece needs a skip or plain fallback (site 1).
3. Small mono labels carry personality cheaply (sites 3, 5).
4. Warm paper plus one deep accent is a proven combination (sites 4, 5), and you already own it.
5. Avoid: blocking zoom (site 2), tiny body text (site 4), desktop-only gates (site 7).
