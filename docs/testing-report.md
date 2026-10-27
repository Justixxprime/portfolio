# Testing report, batch 02 (26 October 2026)

Environment: Chromium via Playwright, local static server. NOT tested: Safari, a real iPhone, any real device. Google Fonts cannot load in the test sandbox, so text rendered in fallback fonts: typography and exact text widths were not judged.

## Passed
- All 28 pages at 1440 wide and 390 wide: no console errors, no horizontal overflow, Project Index button present on every page.
- Next project preview present on all 14 case studies.
- Project Index (desktop and mobile): opens, focus moves to Close, page behind is inert and scroll locked, current project marked, 14 project links plus 8 page links all return 200, Tab stays inside, Esc closes, focus returns to the button, inert released.
- Reduced motion: Index opens instantly and is visible.
- Header at 320, 360, 390, 768 and 1024 wide: menu button and Index button inside the viewport, overlay and Close button fit.
- JavaScript syntax checks pass for studio.js, stage.js and service-worker.js.
- No en or em dashes in new visible copy.

## Found and fixed during testing
- Mobile header overflowed once the Index button was added (menu button pushed off screen). Fixed by hiding the header theme switch below 900px, since the mobile menu has theme buttons.
- Mobile overlay grew wider than the screen (title and Close cut off). Fixed with minmax(0,1fr) grid columns.
- Desktop list showed only 7 of 14 projects without scrolling. Rows tightened, all 14 now fit at 1440 by 900.

## Failed or open
- projects/trackpoint.html requests 3 recording files that do not exist yet (see media-needed-from-owner.md).
- Service worker update behaviour (v6) not observed in a real browser update cycle.
- Safari and real iPhone: outstanding.
- No Lighthouse or performance numbers were measured, so none are claimed.
