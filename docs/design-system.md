# Design system (batch 02)

Source of truth: `css/style.css` (palette, base type, components), `css/stage.css` (loader, cursor, rail, statement) and the new `css/studio.css` (tokens, accessibility floor, Project Index, next project previews). Everything is plain CSS custom properties, no build step.

## Identity
- Ink #15140F, Paper #F2EEE3, Brass #B8863A (bright brass #D6A855 for focus and hover). Defined in style.css. Dark is the default theme, with light, device and local time modes.
- Fraunces for display and headings, Newsreader for reading text, JetBrains Mono for small technical labels and metadata. No other families.
- Brass is an accent: focus rings, hover states, status marks. Never a large fill except buttons.

## Tokens (css/studio.css, section 1)
| Group | Tokens |
|---|---|
| Type scale (fluid) | --fs-label, --fs-small, --fs-body, --fs-lead, --fs-h3, --fs-h2, --fs-h1 (all clamp) |
| Leading and tracking | --lh-tight, --lh-head, --lh-body, --track-display, --track-label |
| Line length | --measure (64ch reading), --measure-head (16ch headings) |
| Spacing | --space-1 to --space-8, --gutter, --section-y, --grid-gap |
| Widths | --content-w (1180px), --content-wide (1520px) |
| Borders | --border, --radius-s, --radius-m |
| Focus | --focus-color, --focus-ring, --focus-offset (darker brass in light theme) |
| Motion | --dur-instant, --dur-1 to --dur-4, --ease-standard, --ease-out-soft, --ease-in-out |
| Layers | --z-base 1, --z-header 50, --z-cursor 200, --z-cmdk 300, --z-index-overlay 340, --z-loader 400 |
| Aspect ratios | --ar-shot 16/10, --ar-video 16/9, --ar-cine 21/9, --ar-phone 9/19.5, --ar-og 1200/630 |
| Breakpoints | sm 480, md 768, lg 900 (menu switch), xl 1200, 2xl 1520 (documented, CSS cannot use variables in media queries) |

## Motion principles
1. Motion answers an action (opening, closing, hovering). Nothing loops.
2. Fast in, slow out. Distances under 24px. One orchestrated moment per screen.
3. Reduced motion: every duration collapses to about zero, the loader is skipped and the Index opens instantly.
4. Important content never depends on animation finishing.

## Accessibility floor
- One visible focus ring for every interactive element.
- Touch targets at least 44px on coarse pointers.
- aria-current marks the current page in the header, mobile menu and Project Index.
- Safe area insets respected (viewport-fit=cover plus env() padding).
- Headings use text-wrap: balance, paragraphs use text-wrap: pretty.

## Components added in batch 02
- **Project Index** (js/studio.js, css/studio.css): button in the header on every page. Opens a full screen dialog listing all 14 projects. Desktop: hover or focus a project to see its real screenshot with its honest status. Touch and narrow screens: list with small thumbnails. Esc closes, Tab is trapped, arrow keys move between projects, the rest of the page is inert and scroll is locked, and focus returns to the button.
- **Next project preview**: small real screenshot of the next case study inside the existing strip.

## Components added in batch 03
- **Flow** (.flow, .flow-step, .flow-link): boxed mono steps joined by one thin arrow. Used for decision chains on all 14 case studies, the experience path and the skills stack flows. Stacks vertically with a rotated arrow under 900px.
- **Arrows**: every text arrow was replaced by the same SVG arrow (73 places) and the command palette arrow too.
- **Heading reveal** (.rise): IntersectionObserver plus a CSS transition with a safety net. Replaces the scroll position based reveal that could leave headings hidden.
- **Skills map** (.skillmap): list based, readable without JavaScript, dots and a thumbnail legend added by script.
- **Hero**: 12 column grid on wide screens, headline spans 11 columns, real reel sits beside the lede.
- **Rail controls** (.rail-nav): previous and next buttons that work in pinned (desktop) and swipe (touch) modes.
- **Note pager**, **404 suggestion**, **Contact grid**.

## Still open
Per project copy rewrites, a Notes index redesign beyond the shared type, and a Safari and iPhone pass.
