# Testing report, batch 04 (28 October 2026)

Environment: Chromium via Playwright against a local static server (python3 -m http.server). NOT tested: Safari, Firefox, a real iPhone or any real device. Google Fonts cannot load in the sandbox, so text rendered in fallback fonts and exact typography and text widths were not judged. No performance measurement was done. The Threads link (threads.com/@chibueze_obioma) could not be verified from the sandbox.

## Passed (final code)
- scripts/site-check.py: 28 pages at 1440 and 390 wide, scrolled end to end: no console or network errors (the known missing *-phone files and blocked Google Fonts are ignored), no sideways overflow, no heading left hidden, header identical on every page, 8 pages and 14 projects in the panel, 7 social links per page, no old mobile menu, no ?v=7, all internal links resolve.
- Header panel: opens by hover, click, keyboard and touch; Escape closes and returns focus; at 320, 360, 390 widths and up there is no sideways scroll with the panel open (a 6 to 8px overflow at 320 was found and fixed).
- No JavaScript: content readable, panel is a static list.
- Reduced motion: panel, page transitions and magnetic buttons switch off.
- 404 at a nested path renders correctly.
- Dash audit: 0 en or em dashes in visible copy.
- Skills and Notes pages checked by screenshot at desktop and mobile, with drawer, tabs, chain chooser and note highlight exercised.

## Bugs found during the batch and fixed
Theme switch hidden on mobile, Escape re-opening the panel, footer socials overflowing at 320, home hero lettering overflow, 404 heading overflow by 1px, old mobile menu left on nested pages, wrong aria-current on the work archive link, Skills drawer title read aloud twice.

## Known and left alone
- Missing phone recordings cause 404 requests on three case studies.
- Boardly note now says 24 Edge Functions, matching Skills and the case study (confirmed by the owner; the number will grow as Boardly grows).
- Each article ends its last paragraph with stray "Back to blog Let's talk" text.

## Not tested
Safari, Firefox, a real iPhone, real fonts, performance.

---

# Testing report, batch 03 (26 October 2026)

Environment: Chromium via Playwright, local static server. NOT tested: Safari, a real iPhone, any real device. Google Fonts cannot load in the test sandbox, so text rendered in fallback fonts: typography and exact text widths were not judged.

## Passed (final code, 27 October 2026)
- All 28 pages at 1440 and 390 wide, scrolled end to end: no console errors, no horizontal overflow, 14 item Work dropdown on every page, no heading left hidden.
- Homepage rail: pinned on desktop, native scroll on touch. Next button moves the rail in both modes, Previous starts disabled, focusing the last card with the keyboard brings it into view.
- Project Index overlay: opens, traps focus, closes on Escape, returns focus, reduced motion opens instantly.
- 404 simulated at /portfolio/projects/boardlly.html: styled correctly at a nested path, shows the requested path, suggests Boardly.
- Skills map: legend thumbnails light a column of dots on hover and focus.
- No en or em dashes in visible text or new code. JavaScript syntax checks pass.

## Bugs reported by the owner and fixed
- Headings clipped to slivers while scrolling case studies (Cheliv pages): the reveal waited on scroll positions that go stale when lazy media loads. Rebuilt on IntersectionObserver with a safety net.
- Oversized blank frame beside the First Experts features screenshots (and eight more case studies): grid stretched the desktop frame. Desktop now sits on top at its natural ratio.
- Work dropdown had 13, 12, 11 or 10 items, and none on the notes pages. All pages now list all 14 projects.
- Plain text arrows in chains replaced by the chip and arrow design.
- "No invented ratings" line removed from Skills.

## Not tested
Safari, a real iPhone, real fonts, and any performance measurement (none claimed).
