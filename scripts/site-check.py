#!/usr/bin/env python3
"""
site-check.py (batch 04). Local test run, not shipped to visitors.
Start a server first:   python3 -m http.server 8000      (from the repository root)
Then:                   python3 scripts/site-check.py
Checks every page at 1440 and 390 wide: scrolls end to end, then reports console errors, sideways overflow,
hidden headings, header consistency, panel contents, social links per page and internal link status.
Failures from Google Fonts (blocked in some sandboxes) and the known missing *-phone recordings are ignored on purpose.
"""
import glob, re, sys, os, json, urllib.request, urllib.error
from playwright.sync_api import sync_playwright

BASE = os.environ.get('BASE', 'http://localhost:8000/')
PAGES = sorted(glob.glob('*.html')) + sorted(glob.glob('notes/*.html')) + sorted(glob.glob('projects/*.html'))
SOCIAL = ['github.com/Justixxprime', 'linkedin.com/in/chibueze-obioma', 'x.com/iamjustixx', 'x.com/obiomachibueze',
          'instagram.com/chibueze_obioma', 'facebook.com/obiomachibueze', 'threads.com/@chibueze_obioma']
IGNORE = ('-phone', 'the server responded with a status of 404', 'fonts.g', 'ERR_TUNNEL', 'ERR_NAME_NOT_RESOLVED', 'ERR_INTERNET_DISCONNECTED', 'favicon')

problems = []
def bad(page, msg): problems.append(f'{page}: {msg}')

def status(url):
    try:
        req = urllib.request.Request(url, method='HEAD')
        return urllib.request.urlopen(req, timeout=15).status
    except urllib.error.HTTPError as e: return e.code
    except Exception: return 0

# ---------- static checks ----------
headers = {}
for pg in PAGES:
    s = open(pg, encoding='utf-8').read()
    prefix = '../' if '/' in pg else ''
    m = re.search(r'<header class="hd".*?</header>', s, re.S)
    if not m: bad(pg, 'new header missing'); continue
    h = m.group(0)
    norm = h.replace('="' + prefix, '="') if prefix else h
    norm = re.sub(r' aria-current="[^"]*"', '', norm)
    headers[pg] = norm
    if h.count('class="hd-page"') != 8: bad(pg, 'panel does not list 8 pages')
    if h.count('class="hd-proj"') + h.count('class="hd-proj" aria-current') < 14 and len(re.findall(r'class="hd-proj"', h)) != 14: bad(pg, 'panel does not list 14 projects')
    for u in SOCIAL:
        if s.count(u) < 2: bad(pg, f'social link {u} found {s.count(u)} times (header panel and footer expected)')
    if '<div id="mobileMenu"' in s: bad(pg, 'old mobileMenu still present')
    if '?v=7' in s: bad(pg, 'old ?v=7 still present')
    if 'css/header.css?v=8' not in s or 'js/header.js?v=8' not in s: bad(pg, 'header assets missing')
first = next(iter(headers.values()))
for pg, h in headers.items():
    if h != first: bad(pg, 'header differs from the first page after path normalisation')

# ---------- browser checks ----------
with sync_playwright() as p:
    b = p.chromium.launch()
    for (w, hgt) in ((1440, 900), (390, 844)):
        ctx = b.new_context(viewport={'width': w, 'height': hgt})
        ctx.add_init_script("try{sessionStorage.setItem('fn-loader','1')}catch(e){}")
        for pg in PAGES:
            page = ctx.new_page(); errs = []
            page.on('console', lambda m, errs=errs: errs.append(m.text) if m.type == 'error' else None)
            page.on('pageerror', lambda e, errs=errs: errs.append('pageerror ' + str(e)))
            page.on('response', lambda r, errs=errs: errs.append(f'{r.status} {r.url}') if r.status >= 400 else None)
            page.goto(BASE + pg, wait_until='load'); page.add_style_tag(content='html{scroll-behavior:auto!important}')
            page.wait_for_timeout(500)
            H = page.evaluate('document.documentElement.scrollHeight')
            y = 0
            while y < H:
                page.evaluate(f"window.scrollTo({{top:{y},behavior:'instant'}})"); page.wait_for_timeout(60); y += hgt * 0.8
                H = page.evaluate('document.documentElement.scrollHeight')
            page.wait_for_timeout(600)
            ov = page.evaluate('document.documentElement.scrollWidth - document.documentElement.clientWidth')
            if ov > 0: bad(f'{pg} @{w}', f'sideways overflow {ov}px')
            hidden = page.evaluate("""[...document.querySelectorAll('h1,h2,h3')].filter(e=>{const r=e.getBoundingClientRect();const cs=getComputedStyle(e);return r.width>0&&cs.display!=='none'&&parseFloat(cs.opacity)<0.05&&!e.closest('[hidden],.hd-panel,.sx-index,#cmdkOverlay')}).map(e=>e.textContent.trim().slice(0,30))""")
            if hidden: bad(f'{pg} @{w}', f'headings left hidden: {hidden}')
            real = [e for e in errs if not any(i in e for i in IGNORE)]
            if real: bad(f'{pg} @{w}', f'console/network errors: {real[:4]}')
            page.close()
        ctx.close()
    b.close()

# ---------- links ----------
seen = {}
for pg in PAGES:
    s = open(pg, encoding='utf-8').read()
    base_dir = os.path.dirname(pg)
    for href in set(re.findall(r'<a [^>]*href="([^"#?]+)', s)):
        if re.match(r'^(https?:|mailto:|tel:|javascript:)', href): continue
        path = os.path.normpath(os.path.join(base_dir, href))
        if path in seen: continue
        seen[path] = os.path.exists(path)
        if not seen[path]: bad(pg, f'broken internal link {href}')

print(f'{len(PAGES)} pages checked at 1440 and 390 wide, {len(seen)} distinct internal link targets')
if problems:
    print(f'{len(problems)} problems:'); print('\n'.join(problems[:80])); sys.exit(1)
print('All checks passed')
