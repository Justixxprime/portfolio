# Video shooting guide

Real footage only. Never generate or fake product video. Never show private data, real customers or children.

## How the system works

Every video slot on the site is already built. It stays hidden until you add the files, so there are no empty boxes. Drop files into `assets/video/` with the exact names below and the slot appears by itself. Nothing downloads until the slot is within 200 px of the screen. Under reduced motion or Data Saver, the poster shows with a Play button instead.

## Settings for recording

| Device | Resolution | Tool |
|---|---|---|
| Desktop | 1440 by 900 | OBS Studio, or the Windows Game Bar (Win + G) |
| Tablet | 820 by 1180 | The tablet built in screen recorder |
| Phone | 390 by 844 | The phone built in screen recorder |

Trim with CapCut. Each clip is 10 to 20 seconds. Move the cursor slowly, pause for one second on each result, no sound needed (the files are muted). Use demonstration or test data only. Stop before any real payment.

## Shots per project

**Boardly** (`boardly`): 1) a board with a task being dragged between columns, 2) adding a comment, 3) opening a marketplace booking, 4) the client portal, 5) a notification arriving.

**Victorious Concept** (`victorious-concept`): 1) browsing the shop, 2) adding an item to the cart, 3) the checkout screen up to the payment page, then stop before real payment, 4) order tracking, 5) the admin dashboard with no real customer names visible.

**Trackpoint** (`trackpoint`): 1) the hero slideshow, 2) the three quote form steps filled with test text, 3) the live rates ticker, 4) switching theme mode, 5) the sticky Quote and WhatsApp bar on a phone.

**Cheliv Care Platform** (`cheliv-platform`): 1) the public site, 2) the sign in screen, 3) the signed in menu for two different roles, 4) a document in the waiting for scan state. Demonstration data only.

**SECKY** (`secky`): 1) the hero, 2) scrolling the catalogue, 3) pressing play on a video preview, 4) the phone view.

**First Experts** (`first-experts`): 1) home, 2) the tracking page with a sample number, 3) the route map, 4) the quote flow with test text.

**Stride, Fernhollow, Amani, Pulse** (`stride`, `fernhollow`, `amani`, `pulse-analytics`): one loop each showing the signature interaction (Stride: the Build Your Own configurator. Fernhollow: the booking flow or the night sky. Amani: the four step donation flow, with no real payment. Pulse: the hero mockup tilting and the cascading table rows). You already have `stride-hero.mp4` and `fernhollow-hero.mp4`, which can be compressed with the commands below and renamed.

**Home hero reel** (`hero-reel`): a single compiled montage of 10 to 14 seconds made from your best real project screens, 1280 by 720, no audio track, 3 MB maximum.

## Compression (ffmpeg)

Replace `in.mp4` with your trimmed recording and `slug` with the project slug.

Desktop MP4, 1280 by 720, 24 fps, about 1.2 MB for 12 seconds:

```
ffmpeg -i in.mp4 -t 12 -vf "scale=1280:720:force_original_aspect_ratio=increase,crop=1280:720,fps=24" -c:v libx264 -crf 28 -preset slow -pix_fmt yuv420p -movflags +faststart -an assets/video/slug-desktop.mp4
```

Desktop WebM (VP9), smaller again:

```
ffmpeg -i in.mp4 -t 12 -vf "scale=1280:720:force_original_aspect_ratio=increase,crop=1280:720,fps=24" -c:v libvpx-vp9 -crf 34 -b:v 0 -an assets/video/slug-desktop.webm
```

Phone MP4, 540 by 1170, under 800 kB:

```
ffmpeg -i phone.mp4 -t 12 -vf "scale=540:1170:force_original_aspect_ratio=increase,crop=540:1170,fps=24" -c:v libx264 -crf 30 -preset slow -pix_fmt yuv420p -movflags +faststart -an assets/video/slug-phone.mp4
```

Poster, under 80 kB (a still from the best frame, here at 2 seconds):

```
ffmpeg -ss 2 -i assets/video/slug-desktop.mp4 -frames:v 1 -vf scale=1280:-2 -q:v 6 assets/video/slug-poster.jpg
ffmpeg -ss 2 -i assets/video/slug-phone.mp4 -frames:v 1 -vf scale=540:-2 -q:v 6 assets/video/slug-phone-poster.jpg
```

If a poster is over 80 kB, raise `-q:v` (7 or 8). Check sizes before you commit.

Hero reel (3 MB maximum, no audio):

```
ffmpeg -i reel.mp4 -t 14 -vf "scale=1280:720,fps=24" -c:v libx264 -crf 30 -preset slow -pix_fmt yuv420p -movflags +faststart -an assets/video/hero-reel.mp4
ffmpeg -i reel.mp4 -t 14 -vf "scale=1280:720,fps=24" -c:v libvpx-vp9 -crf 36 -b:v 0 -an assets/video/hero-reel.webm
ffmpeg -ss 1 -i assets/video/hero-reel.mp4 -frames:v 1 -q:v 6 assets/video/hero-poster.jpg
```

## Test on iPhone Safari

Open the page on a real iPhone. Videos must play inline (they are muted with `playsinline`), the Pause button must work, and nothing should go full screen by itself. I could not test on a real iPhone from here, so this check is yours.
