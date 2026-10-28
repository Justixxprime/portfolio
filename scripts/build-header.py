#!/usr/bin/env python3
"""
build-header.py  (batch 04)
Rewrites the shared header, the footer social row and the asset tags on all 28 pages so they stay identical.
Run from the repository root:   python3 scripts/build-header.py
It is safe to run again: it replaces its own output.

What it changes, on every page:
  1. The <header>...</header> block and the old #mobileMenu block become one new header with a pages panel.
  2. The footer .foot-social row lists all seven accounts.
  3. css/header.css and js/header.js are loaded, and every ?v=7 becomes ?v=8.
On contact.html and about.html it also updates the "Elsewhere" list and the social row.
"""
import re, sys, glob, os, html

ROOT = os.getcwd()
VERSION = '8'

PAGES = [
    # file, label, mono descriptor, preview sentence (taken from each page's own meta description)
    ('index.html',      'Home',       'Start here',           'I build web products from interface to backend. Task platforms with real payment infrastructure, e commerce with live payment integrations, and client systems non technical people can run themselves.'),
    ('work.html',       'Work',       'Fourteen projects',    'Fourteen projects, ranging from a full backend task platform and a healthcare access control system to plain hand written HTML sites with no backend at all.'),
    ('about.html',      'About',      'The story behind it',  'From a biochemistry degree to building web products for real clients. The story behind the work.'),
    ('experience.html', 'Experience', 'Lab to freelance',     'From laboratory science to freelance web development and social media management.'),
    ('skills.html',     'Skills',     'Tools, with evidence', 'What I actually work with, organized by where it gets used rather than a percentage bar.'),
    ('notes.html',      'Notes',      'Field notes',          'Field notes on building real projects, moving from lab science into code, and what actually worked.'),
    ('resume.html',     'Resume',     'Web resume and CV',    'Web resume for Obioma Chibueze Justice, Web Developer and Product Builder based in Lagos, Nigeria.'),
    ('contact.html',    'Contact',    'Start a project',      'Have a project worth building properly. Get in touch.'),
]

PROJECTS = [  # slug, name, type, thumbnail (same facts as js/studio.js)
    ('boardly', 'Boardly', 'Task platform', 'assets/boardly-desktop.jpg'),
    ('victorious-concept', 'Victorious Concept', 'E commerce', 'assets/victorious-concept-desktop.jpg'),
    ('first-experts', 'First Experts Logistics', 'Client site', 'assets/firstexperts-desktop.jpg'),
    ('shelemj', 'ShelemJ Resources', 'Client site', 'assets/shelemj-desktop.jpg'),
    ('stride', 'Stride', 'E commerce concept', 'assets/stride-desktop.jpg'),
    ('fernhollow', 'Fernhollow', 'Booking concept', 'assets/fernhollow-tablet.jpg'),
    ('pulse-analytics', 'Pulse Analytics', 'Interaction design', 'assets/pulse-desktop.jpg'),
    ('amani', 'Amani Community Trust', 'Nonprofit concept', 'assets/amani-desktop.jpg'),
    ('trackpoint', 'Trackpoint Global Resources', 'Client site, WordPress', 'assets/work-trackpoint.jpg'),
    ('secky', 'SECKY official website', 'Artist website', 'assets/work-secky.jpg'),
    ('cheliv-platform', 'Cheliv Care Platform', 'Healthcare platform', 'assets/work-cheliv-platform.jpg'),
    ('cheliv', 'Cheliv Compassionate Care', 'Healthcare site', 'assets/work-cheliv.jpg'),
    ('ecommerce-showcase', 'E commerce showcase', 'E commerce demo', 'assets/work-ecommerce.jpg'),
    ('teaching-portfolio', 'Teaching Portfolio', 'Client system', 'assets/teaching-portfolio-desktop.jpg'),
]

SOCIALS = [  # label shown, accessible name, url, icon id
    ('GitHub',              'GitHub',                         'https://github.com/Justixxprime',                  'b-github'),
    ('LinkedIn',            'LinkedIn',                       'https://www.linkedin.com/in/chibueze-obioma',      'b-linkedin'),
    ('X, @iamjustixx',      'X, @iamjustixx',                 'https://x.com/iamjustixx',                         'b-x'),
    ('X, @obiomachibueze',  'X, @obiomachibueze',             'https://x.com/obiomachibueze',                     'b-x'),
    ('Instagram',           'Instagram, @chibueze_obioma',    'https://www.instagram.com/chibueze_obioma',        'b-instagram'),
    ('Facebook',            'Facebook, obiomachibueze',       'https://www.facebook.com/obiomachibueze',          'b-facebook'),
    ('Threads, @chibueze_obioma', 'Threads, @chibueze_obioma', 'https://www.threads.com/@chibueze_obioma',        'b-threads'),
]

def ic(P, name, size=20, extra=''):
    return f'<svg class="ic ic-{size}{extra}" aria-hidden="true" focusable="false"><use href="{P}assets/icons.svg#{name}"/></svg>'

def page_context(rel):
    """Return (prefix, current_page_file, current_project_slug, section_page) for a page path like 'projects/boardly.html'."""
    nested = '/' in rel
    P = '../' if nested else ''
    f = os.path.basename(rel)
    if rel.startswith('projects/'):
        return P, None, f[:-5], 'work.html'
    if rel.startswith('notes/'):
        return P, None, None, 'notes.html'
    return P, f, None, None

def header_html(rel):
    P, cur, cur_proj, section = page_context(rel)
    out = []
    a = out.append
    a('<header class="hd" id="siteHeader" data-hd>')
    a('  <div class="hd-row">')
    a(f'    <a href="{P}index.html" class="mark">obioma<span>.</span>justice</a>')
    a('    <nav class="hd-nav" aria-label="Primary">')
    for f, label in (('work.html', 'Work'), ('contact.html', 'Contact')):
        curattr = ' aria-current="page"' if cur == f else (' aria-current="true"' if section == f else '')
        a(f'      <a class="hd-link" href="{P}{f}"{curattr}>{label}</a>')
    a('      <button type="button" class="hd-trigger" id="hdTrigger" aria-expanded="false" aria-controls="hdPanel" aria-haspopup="true">')
    a('        <span class="hd-trigger-label" data-hd-label>Menu</span>')
    a('        <span class="hd-icon" aria-hidden="true"><i></i><i></i><i></i></span>')
    a('      </button>')
    a('    </nav>')
    a('  </div>')
    # ---- panel
    a('  <div class="hd-panel" id="hdPanel" aria-label="Site menu" data-lenis-prevent>')
    a('    <div class="hd-inner">')
    # column one: pages and preview
    a('      <div class="hd-col hd-col-pages">')
    a('        <h2 class="hd-h mono">Pages</h2>')
    a('        <nav aria-label="Pages"><ol class="hd-pages">')
    for i, (f, label, desc, _) in enumerate(PAGES):
        if cur == f:
            curattr = ' aria-current="page"'
        elif section == f:
            curattr = ' aria-current="true"'
        else:
            curattr = ''
        a(f'          <li style="--i:{i}"><a class="hd-page" href="{P}{f}" data-hd-page="{i}"{curattr}><span class="hd-num mono">{i+1:02d}</span><span class="hd-name">{label}</span><span class="hd-desc mono">{desc}</span></a></li>')
    a('        </ol></nav>')
    a('        <div class="hd-preview" aria-hidden="true">')
    for i, (f, label, desc, sentence) in enumerate(PAGES):
        a(f'          <div class="hd-card" data-hd-card="{i}"><span class="hd-card-k mono">{i+1:02d} / {label}</span><strong class="hd-card-t">{html.escape(label)}</strong><p>{html.escape(sentence)}</p><span class="hd-card-p mono">{f}</span></div>')
    a('        </div>')
    a('      </div>')
    # column two: projects
    a('      <div class="hd-col hd-col-projects">')
    a('        <h2 class="hd-h mono">Fourteen projects</h2>')
    a('        <ul class="hd-grid">')
    for i, (slug, name, typ, img) in enumerate(PROJECTS):
        curattr = ' aria-current="page"' if cur_proj == slug else ''
        a(f'          <li style="--i:{i}"><a class="hd-proj" href="{P}projects/{slug}.html"{curattr}><span class="hd-thumb"><img src="{P}{img}" alt="" width="160" height="100" loading="lazy" decoding="async"></span><span class="hd-pt"><span class="hd-pn">{html.escape(name)}</span><span class="hd-pm mono">{html.escape(typ)}</span></span></a></li>')
    a('        </ul>')
    a('        <div class="hd-proj-actions">')
    a(f'          <a class="hd-more mono" href="{P}work.html">The work archive {ic(P, "i-arrow-right", 14, " arw")}</a>')
    a(f'          <button type="button" class="hd-more mono" data-open-index>Open the full index {ic(P, "i-grid", 14)}</button>')
    a('        </div>')
    a('      </div>')
    # column three: elsewhere and tools
    a('      <div class="hd-col hd-col-else">')
    a('        <h2 class="hd-h mono">Elsewhere</h2>')
    a('        <ul class="hd-social">')
    for i, (label, aria, url, icon) in enumerate(SOCIALS):
        a(f'          <li style="--i:{i}"><a href="{url}" target="_blank" rel="noopener" aria-label="{html.escape(aria)} (opens in a new tab)">{ic(P, icon, 20)}<span>{html.escape(label)}</span>{ic(P, "i-arrow-up-right", 12, " arw")}</a></li>')
    a('        </ul>')
    a('        <div class="hd-tools">')
    a('          <div class="hd-tool-row"><span class="hd-h mono">Theme</span>')
    a('            <div class="theme-switch" role="group" aria-label="Theme">')
    for mode, icon, label in (('light', 'i-sun', 'Light theme'), ('dark', 'i-moon', 'Dark theme'), ('device', 'i-monitor', 'Match device'), ('local', 'i-map-pin', 'Match local time')):
        a(f'              <button type="button" class="theme-btn" data-theme-set="{mode}" aria-label="{label}" title="{label}">{ic(P, icon, 14)}</button>')
    a('            </div></div>')
    a(f'          <button type="button" class="hd-search mono" data-cmdk-open aria-label="Open search and commands">{ic(P, "i-search", 14)}<span>Search</span><kbd>Ctrl K</kbd></button>')
    a('        </div>')
    a('        <p class="hd-loc">Lagos, Nigeria. Open to remote, hybrid, or relocation.</p>')
    a('      </div>')
    a('    </div>')
    a('  </div>')
    a('</header>')
    return '\n'.join(out) + '\n'

def footer_social(rel, cls_open, cls_close, indent):
    P = page_context(rel)[0]
    lines = []
    for label, aria, url, icon in SOCIALS:
        lines.append(f'{indent}<a href="{url}" target="_blank" rel="noopener" aria-label="{html.escape(aria)}">{ic(P, icon, 20)}</a>')
    return '\n'.join(lines)

def cd_social_list(rel):
    P = page_context(rel)[0]
    items = []
    for label, aria, url, icon in SOCIALS:
        items.append(f'<li><a href="{url}" target="_blank" rel="noopener" aria-label="{html.escape(aria)} (opens in a new tab)">{ic(P, icon, 20)}<span>{html.escape(label)}</span>{ic(P, "i-arrow-up-right", 12, " arw")}</a></li>')
    return '<ul class="cd-social">' + ''.join(items) + '</ul>'

def all_pages():
    pages = sorted(glob.glob('*.html')) + sorted(glob.glob('notes/*.html')) + sorted(glob.glob('projects/*.html'))
    return pages

def process(rel):
    s = open(rel, encoding='utf-8').read()
    orig = s

    # 1. header + old mobile menu
    new_header = header_html(rel)
    s, n = re.subn(r'<header[ >].*?</header>\n?', lambda m: new_header, s, count=1, flags=re.S)
    if n != 1: raise SystemExit(f'{rel}: header not found')
    s = re.sub(r'\n?<div id="mobileMenu">.*?<div class="mm-theme">.*?</div>\s*(?:<div class="menu-foot">.*?</div>\s*)?</div>\n?', '\n', s, count=1, flags=re.S)

    # 2. footer / social rows (foot-social and about/contact social-row blocks)
    def rows(cls):
        pat = re.compile(r'(<div class="%s">\n)(.*?)(\n(\s*)</div>)' % cls, re.S)
        def rep(m):
            indent = re.match(r'\s*', m.group(2)).group(0)
            return m.group(1) + footer_social(rel, '', '', indent) + m.group(3)
        return pat.subn(rep, s)
    s, _ = rows('foot-social')
    s, _ = rows('social-row')

    # 3. contact page Elsewhere list
    if rel == 'contact.html':
        s = re.sub(r'<ul class="cd-social">.*?</ul>', lambda m: cd_social_list(rel), s, count=1, flags=re.S)

    # 4. version bump and new shared files
    s = s.replace('?v=7', '?v=' + VERSION)
    P = page_context(rel)[0]
    if 'css/header.css' not in s:
        s = re.sub(r'(<link rel="stylesheet" href="%scss/studio\.css\?v=%s">)' % (re.escape(P), VERSION),
                   r'\1\n<link rel="stylesheet" href="%scss/header.css?v=%s">' % (P, VERSION), s, count=1)
    if 'js/header.js' not in s:
        s = re.sub(r'(<script src="%sjs/studio\.js\?v=%s" defer></script>)' % (re.escape(P), VERSION),
                   r'\1\n<script src="%sjs/header.js?v=%s" defer></script>' % (P, VERSION), s, count=1)
    if s != orig:
        open(rel, 'w', encoding='utf-8', newline='\n').write(s)
    return s != orig

if __name__ == '__main__':
    pages = all_pages()
    changed = [p for p in pages if process(p)]
    print(f'{len(pages)} pages found, {len(changed)} rewritten')
