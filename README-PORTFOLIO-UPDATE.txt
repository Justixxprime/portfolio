PORTFOLIO UPDATE: EDITORIAL SKILLS EXPERIENCE

This is a changed-files patch, not a full copy of the portfolio repository.
It contains:
- skills.html: a new editorial skills introduction, custom visual capability map, interactive filters and project links.
- css/skills-stage.css: responsive styling for the skills experience and the existing detailed evidence lists.
- css/stage.css: restrained shared polish for inner pages, image motion, typography rhythm and keyboard focus.
- js/skills-stage.js: accessible capability filters with live status updates.

DESIGN INTENT
Preserves the Fraunces, Newsreader and JetBrains Mono type system and the ink, paper and brass palette. Uses CSS-made artwork rather than fake client imagery or invented video. The existing detailed technology lists remain on the page as evidence. Motion is restrained and reduced-motion preferences are respected.

IMPORTANT LIMITATION
The ZIP supplied to this session was a partial archive and did not include the site's main css/style.css or all site assets. I therefore could not run a complete visual regression test or honestly claim the full website was tested in a browser. This patch should be applied to a fresh clone of the actual repository and reviewed locally before publishing. No original repository files were changed remotely.

WINDOWS FRESH-CLONE STEPS
1. Open PowerShell.
2. Run: mkdir C:\dev  (if it does not already exist)
3. Run: cd C:\dev
4. Run: git clone https://github.com/Justixxprime/portfolio.git
5. Run: cd portfolio
6. Extract this ZIP somewhere convenient, for example C:\dev\portfolio-update.
7. Copy the extracted skills.html into C:\dev\portfolio\skills.html, overwriting the cloned version.
8. Copy the extracted css\stage.css and css\skills-stage.css into C:\dev\portfolio\css\.
9. Copy the extracted js\skills-stage.js into C:\dev\portfolio\js\.
10. Check the diff: git diff --check
11. Preview the site locally. Confirm skills.html, the existing technology lists, navigation, dark/light themes and mobile layout work as expected.
12. Run: git status
13. Run: git add skills.html css/stage.css css/skills-stage.css js/skills-stage.js
14. Run: git commit -m "Add editorial skills portfolio experience"
15. Run: git push origin main

If your default branch is not main, use the branch shown by git branch --show-current.

BEFORE PUBLISHING
- Test a desktop browser and a real iPhone Safari session.
- Confirm all linked project pages load.
- Check reduced-motion mode and keyboard-only navigation.
- Confirm the original site's CSS variables and classes match the assumptions in this patch.
