# Counts report

Rule used: a page is a real HTML page a visitor can reach, excluding 404.html, partials and admin tools. Repository figures come from your measurements of 21 to 23 October 2026. I re-measured all repositories myself on 26 October 2026 by cloning them, and the figures match yours. You can repeat it with `node scripts/audit-counts.mjs <folder of repos>` to re-check.

| Number or label | Where it appeared | Verified value | What I changed |
|---|---|---|---|
| First Experts pages (repo first-experts re-counted) | projects/first-experts.html (meta description, JSON-LD, body, Pages fact), index.html stat, resume.html, skills.html | 23 (24 files including 404) | Changed 24 to 23 everywhere on the site |
| ShelemJ pages | projects/shelemj.html (meta, JSON-LD, hero, body, decision block, Pages fact), index.html, work.html, skills.html | 20 (21 files including 404) | Changed 21 to 20 everywhere |
| ShelemJ structured data | shelemj.html | On all 20 pages | Text now says every one of the 20 pages |
| Amani pages | work.html, amani.html | 22 | Already correct, left as is |
| Fernhollow pages | work.html, fernhollow.html (meta, hero, Pages fact), CV | 27 (28 files including 404, sitemap lists 18) | Site now says 27 pages. The README claims differ, trust the repository |
| Stride pages | none published before | 25 (26 files including 404) | Added a Pages fact reading 25 |
| Pulse pages | none published before | 12 (13 files including 404) | Added a Pages fact reading 12 |
| Individual support practice site | teaching-portfolio.html | 36 real pages (41 files minus 404, admin page, gallery admin and 2 partials) | Added a Pages fact reading "More than 30" |
| Trackpoint "38 versioned releases" | trackpoint.html stat | 38 install notes, say "more than thirty releases" | Stat now shows 30+ |
| Cheliv "40 permissions" | cheliv-platform.html stat | About 40 | Label now reads "Permissions, about" |
| Boardly 24 Edge Functions | index.html, boardly.html | 24 | Correct |
| Projects documented | index.html stat and copy, work.html, about.html, README | 14 | Correct |
| Cheliv stats 9, 32, 22 | cheliv-platform.html | 9 roles, 32 models, 22 migrations | Correct |
| SECKY stats 6, 4, 14, 5 | secky.html | 6 releases, 4 videos, 14 tests, 5 widths | Correct |
| Trackpoint 26 patterns, 14 setup scripts, 4 theme modes | trackpoint.html | 26, 14, 4 | Correct |
| "Live" labels | Every case study Status row, archive chips | See below | Standardised to the allowed labels |

## Status labels now used

Live and Client project: Victorious Concept, Trackpoint, SECKY, First Experts, ShelemJ. Client project and Live: teaching site. Live and Personal project: Boardly. Live and Personal project: Cheliv 2025. Development build: Cheliv Care Platform. Demo: Stride, Fernhollow, Pulse Analytics, E commerce showcase. Concept: Amani.

## CV lines that need updating

The CV PDF and DOCX were not edited. Update these lines so they match the portfolio:

1. Experience, First Experts: "a modern 24 page site" should say 23.
2. Projects, First Experts: "24 pages including service pages" should say 23.
3. Projects, Fernhollow: "nearly 30 pages" should say 27 pages.

ShelemJ (20 page) and the individual practice site (more than 30 pages) already match. Dash check: the sentence about CV text uses none of the banned characters in the lines above.
