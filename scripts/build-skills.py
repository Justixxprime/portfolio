#!/usr/bin/env python3
"""
build-skills.py (batch 04)
Inserts the new live sections into skills.html between marker comments, so it is safe to run again.
Every fact comes from text that already exists on this site (skills.html, experience.html, about.html).
Run from the repository root:   python3 scripts/build-skills.py
"""
import re, html, os

E = html.escape
ARW = '<svg class="ic ic-14 arw" aria-hidden="true" focusable="false"><use href="assets/icons.svg#i-arrow-right"/></svg>'

PROJECT_NAMES = {
    'boardly': 'Boardly', 'victorious-concept': 'Victorious Concept', 'first-experts': 'First Experts Logistics',
    'shelemj': 'ShelemJ Resources', 'stride': 'Stride', 'fernhollow': 'Fernhollow', 'pulse-analytics': 'Pulse Analytics',
    'amani': 'Amani Community Trust', 'trackpoint': 'Trackpoint Global Resources', 'secky': 'SECKY official website',
    'cheliv-platform': 'Cheliv Care Platform', 'cheliv': 'Cheliv Compassionate Care', 'ecommerce-showcase': 'E commerce showcase',
    'teaching-portfolio': 'Teaching Portfolio',
}
ALL = ' '.join(PROJECT_NAMES)

# id, name, short label for the bench, use line (taken from the skills page), projects
GROUPS = [
    ('Interface', [
        ('html', 'HTML, semantic', 'HTML', 'Semantic structure on every project, including all 23 pages of First Experts Logistics and 20 pages of ShelemJ Resources.', ALL),
        ('css', 'CSS', 'CSS', 'Responsive layouts, and fully hand rolled CSS on the Teaching Portfolio.', 'teaching-portfolio'),
        ('tailwind', 'Tailwind CSS', 'Tailwind CSS', 'The primary styling approach across most client sites and Boardly.', 'first-experts boardly stride fernhollow'),
        ('javascript', 'Vanilla JavaScript', 'JavaScript', 'Stride\'s full checkout wizard and Build Your Own configurator run on no framework at all.', 'stride boardly fernhollow'),
        ('react-vite', 'React and Vite', 'React', 'Victorious Concept\'s production storefront and admin panel.', 'victorious-concept'),
        ('gsap', 'GSAP', 'GSAP', 'The motion on this portfolio: the project rail, heading reveals and page effects.', ''),
    ]),
    ('Typed applications', [
        ('nextjs-ts', 'Next.js and TypeScript', 'Next.js', 'The Cheliv Care Platform: App Router, Server Actions, and about 23,000 lines of strictly typed code.', 'cheliv-platform'),
    ]),
    ('WordPress', [
        ('wordpress', 'WordPress block themes', 'WordPress', 'Trackpoint Global Resources: a custom theme with 26 patterns, built from scratch.', 'trackpoint'),
        ('php', 'PHP', None, 'Part of the custom WordPress theme built for Trackpoint Global Resources.', 'trackpoint'),
        ('wpcli', 'WP-CLI', None, 'Fourteen repeatable scripts that rebuild the Trackpoint site on a fresh WordPress install.', 'trackpoint'),
    ]),
    ('Backend and data', [
        ('supabase', 'Supabase', 'Supabase', 'Boardly\'s row level security, Victorious Concept\'s product and order data, and the sign in behind the Teaching Portfolio.', 'boardly victorious-concept teaching-portfolio'),
        ('postgres', 'PostgreSQL', 'PostgreSQL', 'Behind Supabase on Boardly, and with Prisma on the Cheliv Care Platform.', 'boardly cheliv-platform'),
        ('prisma', 'Prisma', 'Prisma', '32 models and 22 migrations behind nine roles on the Cheliv Care Platform.', 'cheliv-platform'),
        ('edge', 'Supabase Edge Functions', None, 'Boardly runs on 24 Edge Functions.', 'boardly'),
        ('vercel-fn', 'Vercel serverless functions', None, 'Victorious Concept\'s order creation, Paystack webhook and refund processing.', 'victorious-concept'),
        ('paystack', 'Paystack', 'Paystack', 'A live checkout, webhook and refund flow on Victorious Concept.', 'victorious-concept'),
        ('cloudflare', 'Cloudflare Workers and R2', None, 'Part of the Teaching Portfolio\'s publishing chain, after Decap CMS and Supabase Auth.', 'teaching-portfolio'),
    ]),
    ('Integrations and data on the page', [
        ('slack', 'Slack slash commands', None, 'Part of Boardly\'s third party integrations.', 'boardly'),
        ('zapier', 'Zapier webhooks', None, 'Part of Boardly\'s third party integrations.', 'boardly'),
        ('gcal', 'Google Calendar sync', None, 'Boardly\'s two way Google Calendar sync.', 'boardly'),
        ('jsonld', 'JSON-LD structured data', None, 'Organization and FAQPage schema across all 21 ShelemJ pages.', 'shelemj'),
    ]),
    ('Workflow and shipping', [
        ('git', 'Git', None, 'Version control across every project on this site.', ALL),
        ('github', 'GitHub', 'GitHub', 'Where every project on this site lives, and the base for deployment.', ALL),
        ('ghpages', 'GitHub Pages', None, 'Hosting for Boardly, Stride, Fernhollow and the Teaching Portfolio.', 'boardly stride fernhollow teaching-portfolio'),
        ('vercel', 'Vercel', 'Vercel', 'Hosting for Victorious Concept.', 'victorious-concept'),
        ('decap', 'Decap CMS', None, 'Lets the Teaching Portfolio\'s client publish her own articles without touching code.', 'teaching-portfolio'),
    ]),
]
TOOLS = [t for _, ts in GROUPS for t in ts]
TOOL_ID = {t[0]: t for t in TOOLS}
BENCH = [('html', 'HTML'), ('css', 'CSS'), ('tailwind', 'Tailwind CSS'), ('javascript', 'JavaScript'), ('react-vite', 'React'),
         ('react-vite', 'Vite'), ('nextjs-ts', 'Next.js'), ('nextjs-ts', 'TypeScript'), ('supabase', 'Supabase'), ('postgres', 'PostgreSQL'),
         ('prisma', 'Prisma'), ('paystack', 'Paystack'), ('vercel', 'Vercel'), ('github', 'GitHub'), ('wordpress', 'WordPress'), ('gsap', 'GSAP')]

def plinks(slugs):
    out = []
    for s in slugs.split():
        out.append(f'<a href="projects/{s}.html">{E(PROJECT_NAMES[s])}</a>')
    return ', '.join(out)

# ---------------- bench ----------------
def bench():
    items = ''.join(f'<li style="--i:{i}"><a href="#tool-{tid}"><span class="mono">{i+1:02d}</span>{E(label)}</a></li>' for i, (tid, label) in enumerate(BENCH))
    return f'''<!-- sl:begin bench -->
  <section class="sl-bench" aria-labelledby="slBenchTitle">
    <div class="wrap">
      <div class="sl-bench-head"><h2 id="slBenchTitle" class="mono">The toolbench</h2><button type="button" class="sl-skip mono" data-sl-skip hidden>Show all now</button></div>
      <ul class="sl-bench-list" data-sl-bench>{items}</ul>
      <p class="sl-bench-note">Sixteen of the tools I have shipped with. Each one links to its entry in the toolbox below.</p>
    </div>
  </section>
  <!-- sl:end bench -->'''

# ---------------- toolbox ----------------
def toolbox():
    out = ['<!-- sl:begin toolbox -->', '''  <section class="sl-toolbox" id="toolbox" aria-labelledby="slToolTitle">
    <div class="wrap">
      <div class="skill-eyebrow">THE TOOLBOX</div>
      <h2 id="slToolTitle">Tools I can use, <em>and where I used them.</em></h2>
      <p class="sl-lede">Every box says what the tool did and links to the real project. Hover or focus a box to light the projects it touches, or open it for the detail.</p>
      <div class="sl-strip-slot" data-sl-strip></div>''']
    n = 0
    for gname, tools in GROUPS:
        out.append(f'      <div class="sl-group"><h3 class="sl-group-h mono">{E(gname)}</h3><ul class="sl-tools">')
        for tid, name, _, use, projs in tools:
            n += 1
            used = f'<p class="sl-used"><span class="sl-used-k mono">Used in</span> {plinks(projs)}</p>' if projs else '<p class="sl-used"><span class="sl-used-k mono">Used in</span> <a href="index.html">This portfolio</a></p>'
            pa = (projs if projs != ALL else 'all')
            out.append(f'        <li class="sl-tool" id="tool-{tid}" data-tool="{tid}" data-projects="{pa}"><h4 class="sl-tool-name">{E(name)}</h4><p class="sl-use">{E(use)}</p>{used}</li>')
        out.append('      </ul></div>')
    out.append('      <p class="sl-learning">Still learning: <strong>TypeScript</strong> and <strong>testing</strong>. Both are covered honestly in the learning list lower down.</p>')
    out.append('    </div>\n  </section>\n  <!-- sl:end toolbox -->')
    return '\n'.join(out)

# ---------------- roles ----------------
def roles():
    s = open('experience.html', encoding='utf-8').read()
    items = re.findall(r'<div class="role-item">.*?<div class="role-title">(.*?)</div>\s*<div class="role-org">(.*?)</div>.*?<div class="role-period mono">(.*?)</div>.*?<p class="role-desc">(.*?)</p>', s, re.S)
    assert len(items) == 5, len(items)
    sk_dev = [t for t in TOOLS]
    method = ['Form a hypothesis', 'Run a controlled test', 'Change one variable at a time', 'Trust the result over a first guess', 'Find the mechanism, not just the symptom']
    panels = []
    for i, (title, org, period, desc) in enumerate(items):
        title = html.unescape(title); org = html.unescape(org)
        if title.startswith('Freelance'):
            chips = ''.join(f'<li><a href="#tool-{t[0]}">{E(t[1])}</a></li>' for t in sk_dev)
            lead = 'Skills this role used: every tool in the toolbox above.'
            extra = '<p class="sl-role-links">Related work: <a href="projects/first-experts.html">First Experts Logistics</a>, <a href="projects/victorious-concept.html">Victorious Concept</a>, <a href="projects/boardly.html">Boardly</a>, <a href="projects/trackpoint.html">Trackpoint</a></p>'
        elif title.startswith('Social'):
            chips = '<li><span>Content strategy and social media</span></li><li><span>SEO structure</span></li><li><span>Visual storytelling</span></li>'
            lead = 'Skills this role used, as named on the Skills page:'
            extra = '<p class="sl-role-links">Related work: <a href="projects/first-experts.html">First Experts Logistics website</a></p>'
        elif title.startswith('Laboratory'):
            chips = ''.join(f'<li><span>{E(m)}</span></li>' for m in method)
            lead = 'Habits from this role, as described on the About page:'
            extra = '<p class="sl-role-links"><a href="about.html#how-i-debug">How I debug</a></p>'
        else:
            chips = ''
            lead = 'No skills are mapped to this role. The site does not claim any.'
            extra = ''
        chips_html = f'<ul class="sl-chips">{chips}</ul>' if chips else ''
        panels.append(f'''      <article class="sl-role" id="role-{i}" data-role="{i}">
        <div class="sl-role-top"><div><h3 class="sl-role-title">{E(title)}</h3><p class="sl-role-org">{E(org)}</p></div><p class="sl-role-period mono">{E(html.unescape(period))}</p></div>
        <p class="sl-role-desc">{desc}</p>
        <p class="sl-role-lead mono">{E(lead)}</p>
        {chips_html}
        {extra}
      </article>''')
    return '''<!-- sl:begin roles -->
  <section class="sl-roles" id="roles" aria-labelledby="slRolesTitle">
    <div class="wrap">
      <div class="skill-eyebrow">THE ROLES</div>
      <h2 id="slRolesTitle">Five roles, <em>and what each one used.</em></h2>
      <p class="sl-lede">Choose a role. The skills shown are only the ones this site already supports for that role.</p>
      <div class="sl-roles-body" data-sl-roles>
''' + '\n'.join(panels) + '''
      </div>
    </div>
  </section>
  <!-- sl:end roles -->'''

# ---------------- process ----------------
def process():
    arw = f'<span class="flow-link" aria-hidden="true">{ARW.replace("ic-14","ic-20")}</span>'
    build = [
        ('01', 'Build with intent', 'Interfaces should feel considered, move naturally and work on the devices people actually use.', 'Example: Stride\'s checkout wizard and configurator, built with no framework.', 'projects/stride.html', 'Stride'),
        ('02', 'Test the real paths', 'A project is not finished when it looks right on one machine.', 'Example: twelve role based verification scripts on the Cheliv Care Platform.', 'projects/cheliv-platform.html', 'Cheliv Care Platform'),
        ('03', 'Ship with care', 'Deployment is part of the product.', 'Example: fourteen repeatable WP-CLI scripts that rebuild the Trackpoint site on a fresh install.', 'projects/trackpoint.html', 'Trackpoint'),
    ]
    s = open('about.html', encoding='utf-8').read()
    dbg = re.findall(r'<div class="debug-name">(.*?)</div><div class="debug-desc">(.*?)</div>', s, re.S)
    assert len(dbg) == 7, len(dbg)
    def flow(steps, cls=''):
        parts = []
        for i, st in enumerate(steps):
            parts.append(st)
            if i < len(steps) - 1: parts.append(arw)
        return f'<div class="flow sl-flow {cls}" data-sl-flow>' + ''.join(parts) + '</div>'
    b = [f'<div class="flow-step" data-sl-step><span class="flow-k">{n}  {E(t)}</span><span class="flow-v">{E(d)}</span><span class="flow-v sl-ex">{E(ex)} <a href="{href}">{E(pn)}</a></span></div>' for n, t, d, ex, href, pn in build]
    d1 = [f'<div class="flow-step" data-sl-step><span class="flow-k">{i+1:02d}  {E(n)}</span><span class="flow-v">{E(html.unescape(t))}</span></div>' for i, (n, t) in enumerate(dbg[:4])]
    d2 = [f'<div class="flow-step" data-sl-step><span class="flow-k">{i+5:02d}  {E(n)}</span><span class="flow-v">{E(html.unescape(t))}</span></div>' for i, (n, t) in enumerate(dbg[4:])]
    return f'''<!-- sl:begin process -->
  <section class="sl-process" id="process" aria-labelledby="slProcTitle">
    <div class="wrap">
      <div class="skill-eyebrow">HOW I BUILD</div>
      <h2 id="slProcTitle">Step by step, <em>with a real example each time.</em></h2>
      <p class="sl-lede">The three release notes from above, then the method I use when something breaks. The debugging example is the Amani Community Trust mobile menu, written up in full on the About page.</p>
      <h3 class="sl-sub mono">Release notes</h3>
      {flow(b)}
      <h3 class="sl-sub mono">When something breaks</h3>
      {flow(d1, 'sl-flow-wrap')}
      <div class="sl-flow-turn" aria-hidden="true">{ARW.replace("ic-14","ic-20")}</div>
      {flow(d2, 'sl-flow-wrap')}
      <p class="sl-lede"><a href="about.html#how-i-debug">Read the whole debugging story on the About page {ARW}</a></p>
    </div>
  </section>
  <!-- sl:end process -->'''

# ---------------- numbers ----------------
def numbers():
    rows = [
        ('14', 'documented projects', 'This portfolio, Work archive', 'work.html'),
        ('23', 'pages', 'First Experts Logistics', 'projects/first-experts.html'),
        ('20', 'pages', 'ShelemJ Resources', 'projects/shelemj.html'),
        ('24', 'Edge Functions', 'Boardly', 'projects/boardly.html'),
        ('26', 'theme patterns', 'Trackpoint Global Resources', 'projects/trackpoint.html'),
        ('32', 'models', 'Cheliv Care Platform', 'projects/cheliv-platform.html'),
        ('22', 'migrations', 'Cheliv Care Platform', 'projects/cheliv-platform.html'),
    ]
    li = ''.join(f'<li><span class="sl-n" data-count="{n}">{n}</span><span class="sl-nl">{E(l)}</span><a class="sl-ns mono" href="{h}">{E(src)}</a></li>' for n, l, src, h in rows)
    return f'''<!-- sl:begin numbers -->
  <section class="sl-numbers" id="numbers" aria-labelledby="slNumTitle">
    <div class="wrap">
      <div class="skill-eyebrow">THE NUMBERS</div>
      <h2 id="slNumTitle">Counted from <em>the projects themselves.</em></h2>
      <p class="sl-lede">Only numbers that are already written in the case studies. Each one names where it comes from.</p>
      <ul class="sl-nums" data-sl-nums>{li}</ul>
    </div>
  </section>
  <!-- sl:end numbers -->'''

def put(s, name, block, after=None, before=None):
    pat = re.compile(r'<!-- sl:begin %s -->.*?<!-- sl:end %s -->' % (name, name), re.S)
    if pat.search(s):
        return pat.sub(lambda m: block, s, count=1)
    if after:
        i = s.index(after) + len(after); return s[:i] + '\n\n  ' + block + s[i:]
    i = s.index(before); return s[:i] + block + '\n\n  ' + s[i:]

if __name__ == '__main__':
    s = open('skills.html', encoding='utf-8').read()
    # anchors in the existing page
    intro_end = '</section>'
    i_intro = s.index('<section class="skill-intro page-head">'); j = s.index('</section>', i_intro) + len('</section>')
    s = put(s, 'bench', bench(), after=s[i_intro:j][-len('</section>'):] if False else None, before=None) if False else s
    # bench goes right after the intro section
    if '<!-- sl:begin bench -->' in s: s = put(s, 'bench', bench())
    else: s = s[:j] + '\n\n  ' + bench() + s[j:]
    marker = '<section class="skillmap" id="skill-map"'
    for name, fn in (('toolbox', toolbox), ('roles', roles), ('process', process), ('numbers', numbers)):
        if f'<!-- sl:begin {name} -->' in s: s = put(s, name, fn())
        else:
            k = s.index(marker); s = s[:k] + fn() + '\n\n  ' + s[k:]
    if 'css/skills-live.css' not in s:
        s = s.replace('<link rel="stylesheet" href="css/skills-stage.css?v=1">', '<link rel="stylesheet" href="css/skills-stage.css?v=1">\n<link rel="stylesheet" href="css/skills-live.css?v=8">')
    if 'js/skills-live.js' not in s:
        s = s.replace('<script src="js/skills-stage.js" defer></script>', '<script src="js/skills-stage.js" defer></script>\n<script src="js/skills-live.js?v=8" defer></script>')
    open('skills.html', 'w', encoding='utf-8', newline='\n').write(s)
    print('skills.html updated')
