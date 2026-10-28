/* skills-live.js (batch 04). Skills page only.
   Enhances sections that are already complete in the HTML: toolbench build, toolbox highlights and drawer,
   role tabs, step by step reveal, count up numbers, interactive stack chains, skills map dots.
   Without JavaScript every section still reads in full. */
(function () {
  'use strict';
  var doc = document, html = doc.documentElement;
  var RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function $(s, r) { return (r || doc).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || doc).querySelectorAll(s)); }
  function el(tag, cls, attrs) { var e = doc.createElement(tag); if (cls) e.className = cls; for (var k in (attrs || {})) e.setAttribute(k, attrs[k]); return e; }
  var PROJECTS = window.SX_PROJECTS || [];
  function proj(slug) { return PROJECTS.filter(function (p) { return p.slug === slug; })[0]; }
  function once(nodes, fn, opts) {
    if (!('IntersectionObserver' in window)) { nodes.forEach(function (n) { fn(n); }); return; }
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { io.unobserve(e.target); fn(e.target); } }); }, opts || { threshold: 0.25 });
    nodes.forEach(function (n) { io.observe(n); });
  }

  /* ---------- 1. toolbench: boxes assemble, skippable ---------- */
  var bench = $('[data-sl-bench]');
  if (bench) {
    var skip = $('[data-sl-skip]');
    function built() { bench.classList.add('is-built'); if (skip) skip.hidden = true; }
    if (RM) built();
    else {
      bench.classList.add('is-run'); if (skip) skip.hidden = false;
      var t = setTimeout(built, 55 * bench.children.length + 700);
      if (skip) skip.addEventListener('click', function () { clearTimeout(t); built(); });
      doc.addEventListener('keydown', function k(e) { if (e.key === 'Escape' || e.key === 'Enter') { clearTimeout(t); built(); doc.removeEventListener('keydown', k); } });
    }
  }

  /* ---------- 2. toolbox: connected projects, flash on arrival, detail drawer ---------- */
  var toolbox = $('#toolbox');
  if (toolbox && PROJECTS.length) {
    var slot = $('[data-sl-strip]', toolbox);
    var strip = el('div', 'sl-strip'); strip.setAttribute('aria-hidden', 'true');
    var k0 = el('span', 'sl-strip-k mono'); k0.textContent = 'Connected projects'; strip.appendChild(k0);
    var links = {};
    PROJECTS.forEach(function (p) {
      var a = el('a', '', { href: 'projects/' + p.slug + '.html', tabindex: '-1', title: p.name });
      var im = el('img', '', { alt: '', width: '34', height: '22', loading: 'lazy', decoding: 'async', src: p.img }); a.appendChild(im);
      strip.appendChild(a); links[p.slug] = a;
    });
    var cap = el('span', 'sl-strip-cap mono'); strip.appendChild(cap);
    if (slot) slot.appendChild(strip);
    var lists = $$('.sl-tools', toolbox);
    function slugsOf(card) { var d = card.getAttribute('data-projects') || ''; return d === 'all' ? PROJECTS.map(function (p) { return p.slug; }) : d.split(' ').filter(Boolean); }
    function light(card) {
      var s = slugsOf(card);
      Object.keys(links).forEach(function (k) { links[k].classList.toggle('on', s.indexOf(k) > -1); });
      lists.forEach(function (l) { l.classList.add('is-dim'); }); card.classList.add('is-hot');
      cap.textContent = s.length === PROJECTS.length ? 'All fourteen' : (s.length ? s.map(function (x) { return proj(x).name; }).join(', ') : 'This portfolio');
    }
    function unlight(card) {
      Object.keys(links).forEach(function (k) { links[k].classList.remove('on'); });
      lists.forEach(function (l) { l.classList.remove('is-dim'); }); card.classList.remove('is-hot'); cap.textContent = '';
    }
    var cards = $$('.sl-tool', toolbox);

    /* drawer */
    var scrim = el('div', 'sl-drawer-scrim'); scrim.setAttribute('aria-hidden', 'true');
    var dr = el('aside', 'sl-drawer', { role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'slDrawerTitle', 'data-lenis-prevent': '' });
    var top = el('div', 'sl-drawer-top'); var dk = el('span', 'sl-drawer-k mono'); dk.textContent = 'Tool detail';
    var close = el('button', 'sl-drawer-close', { type: 'button' }); close.textContent = 'Close (Esc)'; top.appendChild(dk); top.appendChild(close);
    var dh = el('h3', '', { id: 'slDrawerTitle' }), dp = el('p'), dg = el('p', 'sl-drawer-k mono'), dl = el('ul', 'sl-drawer-list');
    dr.appendChild(top); dr.appendChild(dh); dr.appendChild(dp); dr.appendChild(dg); dr.appendChild(dl);
    doc.body.appendChild(scrim); doc.body.appendChild(dr);
    var opener = null, inerted = [];
    function openDrawer(card, btn) {
      opener = btn;
      dh.textContent = btn.firstChild.textContent;
      dp.textContent = $('.sl-use', card).textContent;
      var s = slugsOf(card); dg.textContent = s.length ? 'Used in ' + (s.length === PROJECTS.length ? 'all fourteen projects' : s.length + (s.length === 1 ? ' project' : ' projects')) : 'Used on this portfolio';
      dl.innerHTML = '';
      s.forEach(function (slug) {
        var p = proj(slug); if (!p) return; var li = el('li'); var a = el('a', '', { href: 'projects/' + slug + '.html' });
        var im = el('img', '', { alt: '', width: '72', height: '45', loading: 'lazy', decoding: 'async', src: p.img }); var tx = el('span'); var n = el('strong'); n.textContent = p.name; var m = el('small'); m.textContent = p.type + '. ' + p.status + '.';
        tx.appendChild(n); tx.appendChild(m); a.appendChild(im); a.appendChild(tx); li.appendChild(a); dl.appendChild(li);
      });
      $$('body > *').forEach(function (c) { if (c !== dr && c !== scrim && c.tagName !== 'SCRIPT' && !c.hasAttribute('inert')) { c.setAttribute('inert', ''); inerted.push(c); } });
      html.classList.add('sl-lock'); scrim.classList.add('is-open'); dr.classList.add('is-open');
      setTimeout(function () { close.focus(); }, RM ? 0 : 80);
    }
    function closeDrawer() {
      if (!dr.classList.contains('is-open')) return;
      dr.classList.remove('is-open'); scrim.classList.remove('is-open'); html.classList.remove('sl-lock');
      inerted.forEach(function (c) { c.removeAttribute('inert'); }); inerted = [];
      if (opener) opener.focus();
    }
    close.addEventListener('click', closeDrawer); scrim.addEventListener('click', closeDrawer);
    doc.addEventListener('keydown', function (e) {
      if (!dr.classList.contains('is-open')) return;
      if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); closeDrawer(); return; }
      if (e.key === 'Tab') {
        var f = $$('a[href], button', dr); if (!f.length) return; var a = f[0], z = f[f.length - 1];
        if (e.shiftKey && doc.activeElement === a) { e.preventDefault(); z.focus(); } else if (!e.shiftKey && doc.activeElement === z) { e.preventDefault(); a.focus(); }
      }
    }, true);

    cards.forEach(function (card) {
      var h = $('.sl-tool-name', card);
      var btn = el('button', 'sl-tool-open', { type: 'button', 'aria-haspopup': 'dialog' });
      var label = el('span'); label.textContent = h.textContent;
      var ar = doc.createElementNS('http://www.w3.org/2000/svg', 'svg'); ar.setAttribute('class', 'ic'); ar.setAttribute('aria-hidden', 'true'); ar.setAttribute('focusable', 'false');
      var u = doc.createElementNS('http://www.w3.org/2000/svg', 'use'); u.setAttribute('href', 'assets/icons.svg#i-arrow-up-right'); ar.appendChild(u);
      var sr = el('span', 'sr-only'); sr.textContent = ', open details';
      btn.appendChild(label); btn.appendChild(sr); btn.appendChild(ar); h.textContent = ''; h.appendChild(btn);
      btn.addEventListener('click', function () { openDrawer(card, btn); });
      card.addEventListener('mouseenter', function () { light(card); });
      card.addEventListener('mouseleave', function () { unlight(card); });
      card.addEventListener('focusin', function () { light(card); });
      card.addEventListener('focusout', function (e) { if (!card.contains(e.relatedTarget)) unlight(card); });
    });
    /* arriving from a chip: scroll there (native) and flash the box */
    function flash(id) { var c = id && doc.getElementById(id); if (c && c.classList.contains('sl-tool')) { c.classList.remove('is-flash'); void c.offsetWidth; c.classList.add('is-flash'); } }
    $$('a[href^="#tool-"]').forEach(function (a) { a.addEventListener('click', function () { var id = a.getAttribute('href').slice(1); setTimeout(function () { flash(id); }, RM ? 0 : 450); }); });
    if (location.hash.indexOf('#tool-') === 0) setTimeout(function () { flash(location.hash.slice(1)); }, 500);
  }

  /* ---------- 3. roles: tabs ---------- */
  var rolesBody = $('[data-sl-roles]');
  if (rolesBody) {
    var panels = $$('.sl-role', rolesBody);
    var tablist = el('div', 'sl-tabs', { role: 'tablist', 'aria-label': 'Choose a role' });
    var tabs = panels.map(function (p, i) {
      var title = $('.sl-role-title', p).textContent, period = $('.sl-role-period', p).textContent;
      var b = el('button', 'sl-tab', { type: 'button', role: 'tab', id: 'slTab' + i, 'aria-controls': p.id, 'aria-selected': 'false', tabindex: '-1' });
      var a = el('span'); a.textContent = title; var m = el('span', 'mono'); m.textContent = period; b.appendChild(a); b.appendChild(m); tablist.appendChild(b);
      p.setAttribute('role', 'tabpanel'); p.setAttribute('aria-labelledby', 'slTab' + i);
      return b;
    });
    rolesBody.parentNode.insertBefore(tablist, rolesBody); rolesBody.classList.add('is-tabs');
    function pick(i, focus, anim) {
      panels.forEach(function (p, k) { p.hidden = k !== i; p.classList.remove('is-enter'); });
      tabs.forEach(function (t, k) { t.setAttribute('aria-selected', k === i ? 'true' : 'false'); t.tabIndex = k === i ? 0 : -1; });
      if (anim && !RM) { void panels[i].offsetWidth; panels[i].classList.add('is-enter'); }
      if (focus) tabs[i].focus();
    }
    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { pick(i, false, true); });
      t.addEventListener('keydown', function (e) {
        var n = null;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') n = (i + 1) % tabs.length;
        else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') n = (i + tabs.length - 1) % tabs.length;
        else if (e.key === 'Home') n = 0; else if (e.key === 'End') n = tabs.length - 1;
        if (n !== null) { e.preventDefault(); pick(n, true, true); }
      });
    });
    pick(1, false, false);   // the current main role: Freelance Web Developer
  }

  /* ---------- 4. process: steps reveal one after another ---------- */
  $$('[data-sl-flow]').forEach(function (flow) {
    var kids = $$('.flow-step, .flow-link', flow);
    if (RM) { kids.forEach(function (k) { k.classList.add('is-in'); }); return; }
    once([flow], function () { kids.forEach(function (k, i) { setTimeout(function () { k.classList.add('is-in'); }, i * 140); }); }, { threshold: 0.2 });
  });

  /* ---------- 5. numbers: count up, only the figures already on the site ---------- */
  var nums = $$('.sl-n[data-count]');
  if (nums.length && !RM) {
    once(nums, function (n) {
      var to = parseInt(n.getAttribute('data-count'), 10), start = null, dur = 900;
      function step(ts) { if (start === null) start = ts; var p = Math.min(1, (ts - start) / dur); n.textContent = Math.round(to * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(step); else n.textContent = to; }
      n.textContent = '0'; requestAnimationFrame(step);
    }, { threshold: 0.6 });
  }

  /* ---------- 6. stack chains: choose a project, watch it light up box by box ---------- */
  var map = $('.tech-map');
  if (map) {
    var rows = $$('.tech-row', map);
    var pick2 = el('div', 'sl-chain-pick', { role: 'group', 'aria-label': 'Choose a project to light its stack' });
    var timers = [];
    function play(i) {
      timers.forEach(clearTimeout); timers = [];
      rows.forEach(function (r, k) { r.classList.toggle('is-chosen', k === i); $$('.tech-node, .tech-arrow', r).forEach(function (n) { n.classList.remove('is-lit'); }); });
      var seq = $$('.tech-node, .tech-arrow', rows[i]);
      seq.forEach(function (n, k) { if (RM) n.classList.add('is-lit'); else timers.push(setTimeout(function () { n.classList.add('is-lit'); }, 160 + k * 260)); });
      btns.forEach(function (b, k) { b.setAttribute('aria-pressed', k === i ? 'true' : 'false'); });
      cur = i;
    }
    var cur = 0;
    var btns = rows.map(function (r, i) {
      var b = el('button', '', { type: 'button', 'aria-pressed': 'false' }); b.textContent = $('.tech-project', r).textContent;
      b.addEventListener('click', function () { play(i); }); pick2.appendChild(b); return b;
    });
    var rp = el('button', 'sl-replay', { type: 'button' }); rp.textContent = 'Replay'; rp.addEventListener('click', function () { play(cur); }); pick2.appendChild(rp);
    map.parentNode.insertBefore(pick2, map); map.classList.add('is-live');
    once([map], function () { play(0); }, { threshold: 0.3 });
  }

  /* ---------- 7. skills map: dots pop in when the map appears ---------- */
  var sm = $('#skill-map');
  if (sm) once([sm], function () { sm.classList.add('is-seen'); }, { threshold: 0.12 });
})();
