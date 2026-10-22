# Obioma Chibueze Justice, personal portfolio

Web Developer and Product Builder based in Lagos, Nigeria. This repository is the
"Field Notes" rebuild of the portfolio: a static, dependency free HTML site with
a shared design system, built to document fourteen real projects honestly rather
than impressively.

Live at: https://justixxprime.github.io/portfolio/

## What this is

No build step. No framework. Plain HTML, one shared stylesheet, one shared
JavaScript file. That is a deliberate choice, not a limitation: a portfolio
does not need a bundler, and keeping it dependency free means it will still
run in ten years with zero maintenance.

## Technology

- HTML5, semantic where it matters
- One shared stylesheet: `css/style.css`
- One shared script: `js/main.js`
- Fraunces (display), Newsreader (body), JetBrains Mono (technical labels),
  loaded from Google Fonts
- Font Awesome, loaded from a CDN, for social and brand icons only
- A real service worker (`service-worker.js`) for installability
- A real four mode theme system: dark, light, matched to device, matched to
  local time using actual solar position math

## Structure

```
index.html              Homepage
work.html                Full project archive with category filters
about.html                The actual story, not a generic bio
experience.html           Real roles, real employer names, real dates
skills.html               Organized by where each skill is actually used
notes.html                Field notes index
notes/                    Five real posts, migrated from the previous site
resume.html               Web version of the CV
contact.html              Real Web3Forms contact form
404.html
projects/                 One case study per project, fourteen total
  boardly.html
  victorious-concept.html
  first-experts.html
  shelemj.html
  teaching-portfolio.html
  cheliv.html              (the 2025 training site)
  cheliv-platform.html     (the Next.js care platform)
  trackpoint.html          (WordPress client theme)
  secky.html               (artist website, React)
  stride.html
  fernhollow.html
  amani.html
  pulse-analytics.html
  ecommerce-showcase.html
css/style.css             The whole design system, one file
js/main.js                Nav, theme switching, scroll reveal, cursor,
                           magnetic buttons, command palette (Ctrl+K)
assets/                   Real screenshots, two real hero videos, icons,
                           the CV in both docx and PDF
manifest.json             PWA manifest
service-worker.js         PWA service worker
browserconfig.xml         Windows tile configuration
sitemap.xml
robots.txt
```

## Design system

Colors, spacing, and type scale all live as CSS custom properties at the top
of `css/style.css`. The four theme modes swap `--ink`, `--paper`, `--line`,
and related tokens rather than inverting a single palette, so light mode was
designed on its own terms instead of being a filter over dark mode.

The one recurring signature motif is the numbered work index: every project,
on the homepage, the archive, and inside the nav dropdown, is presented as a
numbered list entry rather than a card, with a thin brass rule as the
connective element throughout.

## Updating a project

Each case study is a self contained HTML file with no shared template file to
edit. To update one:

1. Open the relevant file in `projects/`.
2. Update the copy directly. Keep claims honest: say concept, prototype, or
   production based on what is actually true, not what sounds better.
3. Drop new screenshots into `assets/` using the existing naming pattern:
   `projectname-desktop.jpg`, `projectname-tablet.jpg`, `projectname-mobile.jpg`.
4. If the project is new, also add it to the nav dropdown (repeated across all
   pages, search for `dropdown-panel`), the homepage if it belongs there, and
   `work.html`.

## Adding a note

Notes are plain HTML files in `notes/`, following the same header and footer
as every other page. Copy an existing one as a starting point, update the
title, category, and body, and add a link to it from `notes.html`.

## The CV

`assets/Obioma_Chibueze_Justice_CV.docx` is generated from a script, not
hand edited in Word. The generator lives outside this repository. If content
needs to change, regenerate from the script and re export to PDF rather than
editing the DOCX directly, so the two stay in sync.

## What is honestly still missing

- Real screenshots for a few projects would benefit from a refresh as those
  projects continue to change.
- The service worker and install prompt have not been tested in a real
  browser session by anyone other than the person reading this.
- No automated tests exist. Verification so far has been manual: dash
  checks, HTML tag balance checks, and visual review of the rendered CV.
