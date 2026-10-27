# Page audit (batch 02, 26 October 2026)

Facts below come from scripts run on the repository, not from memory. "Videos found" counts video files referenced by the page that exist on disk; "Videos missing" counts referenced files that do not exist.

| Page | Title | H1 | Images (decorative) | Videos found | Videos missing | Next project | Stated status |
|---|---|---|---|---|---|---|---|
| 404.html | Page not found: Obioma Chibueze Justice | That page does not exist. | 13 (0) | 0 | 0 | none | none |
| about.html | About: Obioma Chibueze Justice | Science first, code second, and the habits carried over. | 14 (0) | 0 | 0 | none | none |
| contact.html | Contact: Obioma Chibueze Justice | Let's buildsomethingproperly. | 13 (0) | 0 | 0 | none | none |
| experience.html | Experience: Obioma Chibueze Justice | From the bench to the browser. | 13 (0) | 0 | 0 | none | none |
| index.html | Obioma Chibueze Justice: Web Developer & Product Builder | I build web products,not just pages. | 32 (8) | 19 | 0 | none | none |
| notes.html | Notes: Obioma Chibueze Justice | Notes from building things. | 0 (0) | 0 | 0 | none | none |
| resume.html | Resume: Obioma Chibueze Justice | Obioma Chibueze Justice | 13 (0) | 0 | 0 | none | none |
| skills.html | Skills: Obioma Chibueze Justice | I make the whole thing work. | 13 (0) | 0 | 0 | none | none |
| work.html | Work: Obioma Chibueze Justice | Fourteen projects, built for the range they cover. | 41 (14) | 0 | 0 | none | none |
| notes/boardly-serverless-backend.html | What's Actually Running Behind Boardly: Obioma Chibueze Justice | What's Actually Running Behind Boardly | 0 (0) | 0 | 0 | none | none |
| notes/first-freelance-client.html | Getting My First Freelance Client in Lagos: Obioma Chibueze Justice | Getting My First Freelance Client in Lagos | 0 (0) | 0 | 0 | none | none |
| notes/lab-to-code.html | From the Lab Bench to the Browser: Obioma Chibueze Justice | From the Lab Bench to the Browser | 0 (0) | 0 | 0 | none | none |
| notes/medical-side.html | The Medical Side I Don't Always Lead With: Obioma Chibueze Justice | The Medical Side I Don't Always Lead With | 0 (0) | 0 | 0 | none | none |
| notes/tailwind-workflow.html | My Tailwind CSS Workflow: Obioma Chibueze Justice | My Tailwind CSS Workflow | 0 (0) | 0 | 0 | none | none |
| projects/amani.html | Amani Community Trust: Case Study by Obioma Chibueze Justice | Amani Community Trust | 17 (0) | 2 | 0 | trackpoint.html | Concept. Not a real organisation |
| projects/boardly.html | Boardly: Case Study by Obioma Chibueze Justice | Boardly | 17 (0) | 5 | 0 | victorious-concept.html | Live. Personal project, in active development |
| projects/cheliv-platform.html | Cheliv Care Platform: Case Study by Obioma Chibueze Justice | Cheliv Care Platform | 16 (0) | 0 | 2 | cheliv.html | Development build on demonstration data. Not in production |
| projects/cheliv.html | Cheliv Compassionate Care: Case Study by Obioma Chibueze Justice | Cheliv Compassionate Care | 14 (0) | 0 | 0 | ecommerce-showcase.html | Personal project. Live, kept as a before picture |
| projects/ecommerce-showcase.html | E Commerce Showcase Site: Case Study by Obioma Chibueze Justice | E Commerce Showcase Site | 14 (0) | 0 | 0 | teaching-portfolio.html | Demo. Live, unmodified since training |
| projects/fernhollow.html | Fernhollow: Case Study by Obioma Chibueze Justice | Fernhollow | 16 (0) | 4 | 0 | pulse-analytics.html | Demo. No real payments or transactions |
| projects/first-experts.html | First Experts Logistics: Case Study by Obioma Chibueze Justice | SHIPMENTTRACKCLEARDELIVER | 19 (0) | 3 | 1 | shelemj.html | Live. Client project |
| projects/pulse-analytics.html | Pulse Analytics Dashboard: Case Study by Obioma Chibueze Justice | Pulse Analytics Dashboard | 17 (0) | 1 | 0 | amani.html | Demo. No backend, no real data |
| projects/secky.html | SECKY Official Website: Case Study by Obioma Chibueze Justice | SECKY | 17 (0) | 0 | 2 | cheliv-platform.html | Live. Client project |
| projects/shelemj.html | ShelemJ Resources: Case Study by Obioma Chibueze Justice | ShelemJResources | 17 (0) | 1 | 0 | stride.html | Live. Client project |
| projects/stride.html | Stride: Case Study by Obioma Chibueze Justice | Stride | 16 (0) | 3 | 0 | fernhollow.html | Demo. No backend, no real orders |
| projects/teaching-portfolio.html | Teaching Portfolio: Case Study by Obioma Chibueze Justice | Teaching Portfolio | 17 (0) | 0 | 0 | boardly.html | Client project. Live |
| projects/trackpoint.html | Trackpoint Global Resources: Case Study by Obioma Chibueze Justice | Trackpoint Global Resources | 14 (0) | 0 | 2 | secky.html | Live. Client project |
| projects/victorious-concept.html | Victorious Concept: Case Study by Obioma Chibueze Justice | Victorious Concept | 19 (0) | 3 | 1 | first-experts.html | Live. Client project, a real trading business |

## What changed on every page in batch 02
- Shared Project Index overlay (button in header, all 14 projects with real screenshots, keyboard and touch support).
- Shared design tokens, focus ring, safe area insets, reduced motion safety net, touch target sizes (css/studio.css).
- aria-current on the current page link in the header and mobile menu.
- Viewport now allows the page to extend under notches (viewport-fit=cover), with padding that keeps content clear of them.
- On screens under 900 px the header theme switch is hidden because the mobile menu already has theme buttons.
- Share image tags made absolute (batch 01).

## Case study checks (all 14)
- Each has exactly one h1, a stated status, and a Next project link. The 14 Next links form one closed loop with no broken or circular targets.
- Next project strips now show a small real screenshot of the next project (decorative, empty alt, text link carries the name).
- E commerce showcase was missing from the header project dropdown on the homepage. It is now reachable from the Index on every page.

## Honest limits
- The 14 case study layouts were audited and given the shared upgrades above. Their individual copy, composition and media were NOT rewritten in this batch, so "each case study redesigned individually" is not yet true.
- Homepage hero, rail and statement section were not redesigned in this batch.
- Skills, About, Experience, Contact, Notes and Resume content were audited (links, headings, titles) but not redesigned.
