# Batch 04b: Cheliv dashboard footage and no more missing-video errors (Windows PowerShell)

You already pushed batch 04. This is a small follow-up. You do NOT need to record anything.

What changed:
- Cheliv Care Platform video now shows the public site and then the admin dashboard (your post-login footage). The login screen, the fingerprint pop-up and the staff email list were left out on purpose.
- Five case studies (Cheliv Care Platform, First Experts, SECKY, Trackpoint, Victorious Concept) no longer ask for phone videos that do not exist, so there are no more error requests. The desktop video now uses the full width.

Steps:
1. `cd C:\dev\portfolio` then `git status` (should be clean).
2. Extract and copy over:
   ```
   Expand-Archive -Path "$HOME\Downloads\portfolio-update-batch-04b.zip" -DestinationPath "$HOME\Downloads\b04b" -Force
   Copy-Item -Path "$HOME\Downloads\b04b\*" -Destination "C:\dev\portfolio" -Recurse -Force
   ```
3. `git diff --stat` then check locally with `python -m http.server 8000` (open http://localhost:8000/projects/cheliv-platform.html, Ctrl+C to stop).
4. Publish (never force push):
   ```
   git add -A
   git commit -m "Batch 04b: Cheliv dashboard footage, remove missing phone video slots"
   git push origin main
   ```
5. Wait a minute, hard refresh (Ctrl+Shift+R) the live site.
