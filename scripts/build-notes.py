#!/usr/bin/env python3
"""
build-notes.py (batch 04)
Rebuilds the Notes index (notes.html) and adds the cinematic header, progress bar and pull quote to the five articles.
Every word of every note stays. Reading time is computed (words divided by 200, rounded up), never typed by hand.
Run from the repository root:   python3 scripts/build-notes.py        (safe to run again)
"""
import re, html, glob, os, math

E = html.escape
ARW = '<svg class="ic ic-16 arw" aria-hidden="true" focusable="false"><use href="{p}assets/icons.svg#i-arrow-right"/></svg>'

# One sentence per note that already exists in the note text, used as a pull quote.
QUOTES = {
    'lab-to-code': 'There was no room for "close enough."',
    'first-freelance-client': 'It was closer to just showing up, consistently, with something real to point to every time.',
    'tailwind-workflow': 'It is mostly discipline, applied consistently, project after project.',
    'boardly-serverless-backend': 'None of this is visible in a demo video.',
    'medical-side': 'None of that work tolerates guessing.',
}
ORDER = ['lab-to-code', 'first-freelance-client', 'tailwind-workflow', 'boardly-serverless-backend', 'medical-side']

def read_note(slug):
    p = f'notes/{slug}.html'
    s = open(p, encoding='utf-8').read()
    body = re.search(r'<div class="wrap note-body">(.*?)</div>\s*</section>', s, re.S).group(1)
    title = html.unescape(re.search(r'<h1[^>]*>(.*?)</h1>', s).group(1))
    cat = html.unescape(re.search(r'<span class="cat">(.*?)</span>', s).group(1))
    body = re.sub(r'<!-- na:begin quote -->.*?<!-- na:end quote -->', '', body, flags=re.S)
    text = html.unescape(re.sub(r'<[^>]+>', ' ', body))
    words = len(text.split())
    first_p = html.unescape(re.sub(r'<[^>]+>', '', re.search(r'<p>(.*?)</p>', body, re.S).group(1))).strip()
    first_sentence = re.split(r'(?<=[.!?])\s', first_p, maxsplit=1)[0]
    return dict(slug=slug, path=p, src=s, body=body, title=title, cat=cat, words=words, mins=max(1, math.ceil(words / 200)), first_p=first_p, first=first_sentence)

def note_page(n, notes):
    s = n['src']
    # 1. cinematic header
    new_head = f'''<!-- na:begin head -->
  <div class="na-progress" aria-hidden="true"><i></i></div>
  <section class="page-head na-head">
    <div class="wrap">
      <div class="section-label">Notes <div class="rule"></div> {E(n["cat"])}</div>
      <h1 class="na-title">{E(n["title"])}</h1>
      <div class="note-meta na-meta"><span class="cat">{E(n["cat"])}</span> &middot; <span data-na-time>{n["mins"]} min read</span></div>
    </div>
  </section>
  <!-- na:end head -->'''
    if '<!-- na:begin head -->' in s:
        s = re.sub(r'<!-- na:begin head -->.*?<!-- na:end head -->', lambda m: new_head, s, count=1, flags=re.S)
    else:
        s = re.sub(r'<section class="page-head">.*?</section>', lambda m: new_head, s, count=1, flags=re.S)
    # 2. pull quote before the second h2
    q = QUOTES[n['slug']]
    plain = html.unescape(re.sub(r'<[^>]+>', '', n['body']))
    assert q in plain, (n['slug'], 'quote not found in note text')
    block = f'<!-- na:begin quote --><blockquote class="na-pull"><p>{E(q, quote=False)}</p></blockquote><!-- na:end quote -->'
    s = re.sub(r'<!-- na:begin quote -->.*?<!-- na:end quote -->', '', s, flags=re.S)
    h2s = [m.start() for m in re.finditer(r'<h2>', s)]
    assert len(h2s) >= 2
    s = s[:h2s[1]] + block + s[h2s[1]:]
    # 3. assets
    if 'css/notes-live.css' not in s:
        s = s.replace('<link rel="stylesheet" href="../css/header.css?v=8">', '<link rel="stylesheet" href="../css/header.css?v=8">\n<link rel="stylesheet" href="../css/notes-live.css?v=8">')
    if 'js/notes-live.js' not in s:
        s = s.replace('<script src="../js/header.js?v=8" defer></script>', '<script src="../js/header.js?v=8" defer></script>\n<script src="../js/notes-live.js?v=8" defer></script>')
    open(n['path'], 'w', encoding='utf-8', newline='\n').write(s)

def index_page(notes):
    s = open('notes.html', encoding='utf-8').read()
    feat = notes[0]
    arw = ARW.format(p='')
    rows = []
    for i, n in enumerate(notes[1:], start=2):
        rows.append(f'''        <li class="nx-item" data-nx-item>
          <a class="nx-row" href="notes/{n["slug"]}.html" data-cursor="Read">
            <span class="nx-num mono">{i:02d}</span>
            <h3 class="nx-row-title">{E(n["title"])}</h3>
            <span class="nx-meta mono"><span class="nx-tag">{E(n["cat"])}</span><span class="nx-time">{n["mins"]} min read</span></span>
            <span class="nx-arrow" aria-hidden="true">{arw}</span>
            <span class="nx-ex-wrap"><span class="nx-ex">{E(n["first_p"])}</span></span>
          </a>
        </li>''')
    main = f'''<main id="main">
  <!-- nx:begin -->
  <section class="page-head nx-hero">
    <div class="wrap">
      <div class="nx-kicker mono"><span>Notes</span><span class="nx-count">{len(notes):02d} field notes</span></div>
      <h1 class="nx-title">Notes from building things.</h1>
      <p class="nx-intro">Not a generic blog. Field notes on the actual projects on this site, the move from lab science into code, and what worked when I had no clients yet.</p>
    </div>
  </section>

  <section class="nx-featured" aria-labelledby="nxFeatTitle">
    <div class="wrap">
      <a class="nx-feature" href="notes/{feat["slug"]}.html" data-cursor="Read">
        <span class="nx-feature-k mono"><span>Start here</span><span class="nx-tag">{E(feat["cat"])}</span><span class="nx-time">{feat["mins"]} min read</span></span>
        <h2 class="nx-feature-title" id="nxFeatTitle">{E(feat["title"])}</h2>
        <p class="nx-feature-first">{E(feat["first"])}</p>
        <p class="nx-feature-ex">{E(feat["first_p"])}</p>
        <span class="nx-feature-cta mono">Read the note {arw}</span>
      </a>
    </div>
  </section>

  <section class="nx-index" aria-labelledby="nxIndexTitle">
    <div class="wrap">
      <h2 class="nx-index-h mono" id="nxIndexTitle">More notes</h2>
      <ol class="nx-list" data-nx-list>
{chr(10).join(rows)}
      </ol>
    </div>
  </section>

  <section class="nx-close" aria-labelledby="nxCloseTitle">
    <div class="wrap">
      <h2 class="nx-close-title" id="nxCloseTitle">Want to talk about <em>a project?</em></h2>
      <p>The notes come from real work. If you have something worth building properly, or you want to see the projects behind them, start here.</p>
      <div class="nx-close-links">
        <a class="btn-primary" href="contact.html">Get in touch</a>
        <a class="btn-ghost" href="work.html">See the work archive</a>
      </div>
    </div>
  </section>
  <!-- nx:end -->
</main>'''
    s = re.sub(r'<main id="main">.*?</main>', lambda m: main, s, count=1, flags=re.S)
    if 'css/notes-live.css' not in s:
        s = s.replace('<link rel="stylesheet" href="css/header.css?v=8">', '<link rel="stylesheet" href="css/header.css?v=8">\n<link rel="stylesheet" href="css/notes-live.css?v=8">')
    if 'js/notes-live.js' not in s:
        s = s.replace('<script src="js/header.js?v=8" defer></script>', '<script src="js/header.js?v=8" defer></script>\n<script src="js/notes-live.js?v=8" defer></script>')
    open('notes.html', 'w', encoding='utf-8', newline='\n').write(s)

if __name__ == '__main__':
    notes = [read_note(sl) for sl in ORDER]
    for n in notes: note_page(n, notes)
    index_page(notes)
    print('notes rebuilt:', ', '.join(f'{n["slug"]} {n["words"]}w={n["mins"]}min' for n in notes))
