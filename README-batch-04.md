# Batch 04: how to put this on your site (Windows PowerShell)

What is inside: the new header, 7 social links, the rebuilt Skills and Notes pages, site-wide motion, and your three new desktop recordings (SECKY, Trackpoint, Cheliv Care Platform). The zip holds only changed or new files, each at its correct folder path, so you copy it over the top of your repo.

1. Open PowerShell and clone your repo (skip if you already have it):
   ```
   cd C:\dev
   git clone https://github.com/Justixxprime/portfolio.git
   cd portfolio
   ```
   If it already exists: `cd C:\dev\portfolio` then `git pull origin main`.
2. Check it is clean. This must say "nothing to commit, working tree clean":
   ```
   git status
   ```
3. Extract the zip into a temporary folder, then copy everything over the repo (replace when asked):
   ```
   Expand-Archive -Path "$HOME\Downloads\portfolio-update-batch-04.zip" -DestinationPath "$HOME\Downloads\b04" -Force
   Copy-Item -Path "$HOME\Downloads\b04\*" -Destination "C:\dev\portfolio" -Recurse -Force
   ```
4. Check what changed:
   ```
   git diff --check
   git diff --stat
   git status
   ```
   `git diff --check` should print nothing. `--stat` should list the changed pages. New files show under `git status` as untracked.
5. Look at it locally before publishing:
   ```
   python -m http.server 8000
   ```
   Open http://localhost:8000/ in your browser. Stop the server with Ctrl+C.
6. Publish (never force push):
   ```
   git add -A
   git commit -m "Batch 04: new header, socials, Skills, Notes, site-wide motion, three new recordings"
   git push origin main
   ```
7. Wait about a minute. Open https://justixxprime.github.io/portfolio/ and hard refresh (Ctrl+Shift+R). The service worker is now version v8, so an old copy should replace itself; if you still see the old site, close all tabs of the site and reopen.
8. Test on your phone: open the menu, open a project from the panel, try Skills and Notes.

If something looks wrong, do not force anything. Tell me what you see and which page.
