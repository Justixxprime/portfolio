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
