/* studio.js (batch 02). Shared on every page, after stage.js.
   1. Project Index overlay: every project, one click away from any page, with a live preview of the real screenshot.
   2. Next-project previews on case studies.
   3. aria-current on navigation links.
   Everything is added by script, so without JavaScript the normal navigation still works. */
(function () {
  'use strict';
  var doc = document, html = doc.documentElement;
  var script = doc.currentScript || (function(){ var s = doc.getElementsByTagName('script'); return s[s.length - 1]; })();
  var BASE = script.src.replace(/js\/studio\.js.*$/, '');           // site root, works from nested pages and GitHub Pages /portfolio/
  var RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var SAVE = !!(navigator.connection && navigator.connection.saveData);

  /* Facts only. Statuses match the Status row on each case study. */
  var PROJECTS = [
    { slug:'boardly', name:'Boardly', type:'Task platform', status:'Live, personal project', img:'assets/boardly-desktop.jpg' },
    { slug:'victorious-concept', name:'Victorious Concept', type:'E commerce', status:'Live, client project', img:'assets/victorious-concept-desktop.jpg' },
    { slug:'first-experts', name:'First Experts Logistics', type:'Client site', status:'Live, client project', img:'assets/firstexperts-desktop.jpg' },
    { slug:'shelemj', name:'ShelemJ Resources', type:'Client site', status:'Live, client project', img:'assets/shelemj-desktop.jpg' },
    { slug:'stride', name:'Stride', type:'E commerce concept', status:'Demo, no real orders', img:'assets/stride-desktop.jpg' },
    { slug:'fernhollow', name:'Fernhollow', type:'Booking concept', status:'Demo, no real payments', img:'assets/fernhollow-tablet.jpg' },
    { slug:'pulse-analytics', name:'Pulse Analytics', type:'Interaction design', status:'Demo, no backend', img:'assets/pulse-desktop.jpg' },
    { slug:'amani', name:'Amani Community Trust', type:'Nonprofit concept', status:'Concept, not a real organisation', img:'assets/amani-desktop.jpg' },
    { slug:'trackpoint', name:'Trackpoint Global Resources', type:'Client site, WordPress', status:'Live, client project', img:'assets/work-trackpoint.jpg' },
    { slug:'secky', name:'SECKY official website', type:'Artist website', status:'Live, client project', img:'assets/work-secky.jpg' },
    { slug:'cheliv-platform', name:'Cheliv Care Platform', type:'Healthcare platform', status:'Development build, demonstration data', img:'assets/work-cheliv-platform.jpg' },
    { slug:'cheliv', name:'Cheliv Compassionate Care', type:'Healthcare site', status:'Live, personal project', img:'assets/work-cheliv.jpg' },
    { slug:'ecommerce-showcase', name:'E commerce showcase', type:'E commerce demo', status:'Demo, from training', img:'assets/work-ecommerce.jpg' },
    { slug:'teaching-portfolio', name:'Teaching Portfolio', type:'Client system', status:'Live, client project', img:'assets/teaching-portfolio-desktop.jpg' }
  ];
  var PAGES = [['Home','index.html'],['Work archive','work.html'],['About','about.html'],['Experience','experience.html'],['Skills','skills.html'],['Notes','notes.html'],['Resume','resume.html'],['Contact','contact.html']];

  window.SX_PROJECTS = PROJECTS;
  var here = location.pathname.split('/').pop() || 'index.html';
  var inProjects = /\/projects\/[^/]*$/.test(location.pathname);
  function el(tag, cls, attrs) { var e = doc.createElement(tag); if (cls) e.className = cls; for (var k in (attrs || {})) e.setAttribute(k, attrs[k]); return e; }
  function icon(name) { var s = doc.createElementNS('http://www.w3.org/2000/svg', 'svg'); s.setAttribute('class', 'ic'); s.setAttribute('aria-hidden', 'true'); s.setAttribute('focusable', 'false'); var u = doc.createElementNS('http://www.w3.org/2000/svg', 'use'); u.setAttribute('href', BASE + 'assets/icons.svg#' + name); s.appendChild(u); return s; }

  /* ---------- 3. aria-current on nav links ---------- */
  Array.prototype.forEach.call(doc.querySelectorAll('header a[href]:not(.hd-more)'), function (a) {
    var f = (a.getAttribute('href') || '').split('#')[0].split('/').pop();
    if (f && f === here) a.setAttribute('aria-current', 'page');
    else if (a.getAttribute('aria-current') === 'page' && f !== here) a.removeAttribute('aria-current');
  });

  /* ---------- 1. Project Index overlay ---------- */
  var row = doc.querySelector('header .hd-row, header .nav-row');
  if (!row) return;
  /* The Index button lives in the header panel ([data-open-index]). Older markup falls back to a button in the header row. */
  var triggers = Array.prototype.slice.call(doc.querySelectorAll('[data-open-index]'));
  if (!triggers.length) {
    var t0 = el('button', 'sx-trigger', { type: 'button', 'aria-haspopup': 'dialog', 'aria-expanded': 'false', 'aria-controls': 'sxIndex' });
    t0.appendChild(icon('i-grid')); var tl = el('span'); tl.textContent = 'Index'; t0.appendChild(tl); row.appendChild(t0); triggers = [t0];
  }
  triggers.forEach(function (t) { t.setAttribute('aria-haspopup', 'dialog'); t.setAttribute('aria-controls', 'sxIndex'); t.setAttribute('aria-expanded', 'false'); });
  var trigger = triggers[0];
  function setExp(v) { triggers.forEach(function (t) { t.setAttribute('aria-expanded', v ? 'true' : 'false'); }); }

  var ov = el('div', 'sx-index', { id: 'sxIndex', role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'sxTitle', 'data-lenis-prevent': '' });
  var head = el('div', 'sx-head'); var h = el('h2', 'sx-title', { id: 'sxTitle' }); h.textContent = 'All fourteen projects';
  var close = el('button', 'sx-close', { type: 'button' }); close.appendChild(icon('i-x')); var cl = el('span'); cl.textContent = 'Close (Esc)'; close.appendChild(cl);
  head.appendChild(h); head.appendChild(close);
  var body = el('div', 'sx-body'); var list = el('ul', 'sx-list'); var items = [];
  PROJECTS.forEach(function (p, i) {
    var li = el('li'); var a = el('a', 'sx-item', { href: BASE + 'projects/' + p.slug + '.html' });
    var th = el('img', 'sx-thumb', { alt: '', loading: 'lazy', decoding: 'async', width: '84', height: '52' }); th.setAttribute('data-src', BASE + p.img);
    var tx = el('span'); var nm = el('span', 'sx-name'); nm.textContent = p.name; var mt = el('span', 'sx-meta'); var ty = el('span', 'sx-type'); ty.textContent = p.type; var st = el('span', 'sx-state'); st.textContent = '. ' + p.status + '.'; mt.appendChild(ty); mt.appendChild(st);
    tx.appendChild(nm); tx.appendChild(mt); a.appendChild(th); a.appendChild(tx); li.appendChild(a); list.appendChild(li); items.push(a);
    if (inProjects && location.pathname.indexOf('/' + p.slug + '.html') > -1) a.setAttribute('aria-current', 'page');
    function show() { setPreview(i); } a.addEventListener('mouseenter', show); a.addEventListener('focus', show);
  });
  var prev = el('figure', 'sx-preview'); prev.setAttribute('aria-hidden', 'true');
  var frame = el('div', 'sx-frame'); var imgA = el('img', '', { alt: '', decoding: 'async' }), imgB = el('img', '', { alt: '', decoding: 'async' }); frame.appendChild(imgA); frame.appendChild(imgB);
  var cap = el('figcaption', 'sx-cap'); var capName = el('strong'); var capStatus = el('span'); cap.appendChild(capName); cap.appendChild(capStatus);
  prev.appendChild(frame); prev.appendChild(cap); body.appendChild(list); body.appendChild(prev);
  var pages = el('nav', 'sx-pages', { 'aria-label': 'Site pages' });
  PAGES.forEach(function (p) { var a = el('a', '', { href: BASE + p[1] }); a.textContent = p[0]; if (p[1] === here && !inProjects) a.setAttribute('aria-current', 'page'); pages.appendChild(a); });
  ov.appendChild(head); ov.appendChild(body); ov.appendChild(pages); doc.body.appendChild(ov);

  var cur = -1, flip = false;
  function setPreview(i) {
    if (i === cur) return; cur = i; var p = PROJECTS[i]; flip = !flip;
    var on = flip ? imgA : imgB, off = flip ? imgB : imgA;
    on.src = BASE + p.img; on.classList.add('is-on'); off.classList.remove('is-on');
    capName.textContent = p.name; capStatus.textContent = p.status;
  }
  function loadThumbs() { Array.prototype.forEach.call(ov.querySelectorAll('.sx-thumb'), function (t) { if (!t.src && t.dataset.src && !SAVE) t.src = t.dataset.src; }); }

  var lastFocus = null, hidden = [];
  function focusables() { return Array.prototype.slice.call(ov.querySelectorAll('a[href], button:not([disabled])')).filter(function (n) { return n.offsetParent !== null || n === close; }); }
  function open() {
    if (ov.classList.contains('is-open')) return;
    lastFocus = doc.activeElement; loadThumbs(); setPreview(0);
    Array.prototype.forEach.call(doc.body.children, function (c) { if (c !== ov && c.tagName !== 'SCRIPT' && !c.hasAttribute('inert')) { c.setAttribute('inert', ''); hidden.push(c); } });
    html.classList.add('sx-lock'); ov.classList.add('is-open'); setExp(true);
    setTimeout(function () { close.focus(); }, RM ? 0 : 60);
  }
  function shut() {
    if (!ov.classList.contains('is-open')) return;
    ov.classList.remove('is-open'); html.classList.remove('sx-lock'); setExp(false);
    hidden.forEach(function (c) { c.removeAttribute('inert'); }); hidden = [];
    var back = (lastFocus && lastFocus.focus && lastFocus.offsetParent !== null) ? lastFocus : (doc.getElementById('hdTrigger') || trigger);
    back.focus();
  }
  triggers.forEach(function (t) { t.addEventListener('click', function () { ov.classList.contains('is-open') ? shut() : open(); }); });
  close.addEventListener('click', shut);
  ov.addEventListener('wheel', function (e) { e.stopPropagation(); }, { passive: true });
  ov.addEventListener('touchmove', function (e) { e.stopPropagation(); }, { passive: true });
  doc.addEventListener('keydown', function (e) {
    if (!ov.classList.contains('is-open')) return;
    if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); shut(); return; }
    if (e.key === 'Tab') {
      var f = focusables(); if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && doc.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && doc.activeElement === last) { e.preventDefault(); first.focus(); }
    }
    if ((e.key === 'ArrowDown' || e.key === 'ArrowUp') && doc.activeElement && doc.activeElement.classList.contains('sx-item')) {
      var i = items.indexOf(doc.activeElement); var n = e.key === 'ArrowDown' ? Math.min(items.length - 1, i + 1) : Math.max(0, i - 1);
      if (n !== i) { e.preventDefault(); items[n].focus(); }
    }
  }, true);
  window.addEventListener('pageshow', function () { shut(); });

  /* ---------- 2. next-project preview ---------- */
  var next = doc.querySelector('a.next-project');
  if (next) {
    var slug = (next.getAttribute('href') || '').split('/').pop().replace('.html', '');
    var p = PROJECTS.filter(function (x) { return x.slug === slug; })[0];
    var wrap = next.querySelector('.wrap'); var arrow = next.querySelector('.np-a');
    if (p && wrap && arrow) { var im = el('img', 'np-thumb', { alt: '', loading: 'lazy', decoding: 'async', width: '220', height: '137', src: BASE + p.img }); wrap.insertBefore(im, arrow); }
  }

  /* ---------- 4. previous project link on case studies ---------- */
  if (next && inProjects) {
    var curSlug = location.pathname.split('/').pop().replace('.html', '');
    var ci = -1; PROJECTS.forEach(function (x, k) { if (x.slug === curSlug) ci = k; });
    if (ci > -1) {
      var pv = PROJECTS[(ci + PROJECTS.length - 1) % PROJECTS.length];
      var row2 = el('div', 'np-prev-row'); var w2 = el('div', 'wrap'); var a2 = el('a', '', { href: BASE + 'projects/' + pv.slug + '.html' });
      var ar = doc.createElementNS('http://www.w3.org/2000/svg', 'svg'); ar.setAttribute('class', 'ic ic-14 arw'); ar.setAttribute('aria-hidden', 'true'); ar.setAttribute('focusable', 'false');
      var us = doc.createElementNS('http://www.w3.org/2000/svg', 'use'); us.setAttribute('href', BASE + 'assets/icons.svg#i-arrow-right'); ar.appendChild(us);
      var tx2 = el('span'); tx2.textContent = 'Previous project: ' + pv.name; a2.appendChild(ar); a2.appendChild(tx2); w2.appendChild(a2); row2.appendChild(w2);
      next.parentNode.insertBefore(row2, next);
    }
  }

  /* ---------- 5. skills map: dots and a project legend (the text list works on its own) ---------- */
  var map = doc.getElementById('skill-map');
  if (map) {
    var rows = Array.prototype.slice.call(map.querySelectorAll('.sm-row'));
    rows.forEach(function (r) {
      var set = (r.getAttribute('data-projects') || '').split(' ');
      var d = el('span', 'sm-dots'); d.setAttribute('aria-hidden', 'true');
      PROJECTS.forEach(function (p, idx) {
        var i = el('i');
        if (set.indexOf(p.slug) > -1) {
          i.className = 'on';
          /* each lit dot links to its case study (pointer and touch; keyboard users have the text links in the row) */
          var a = el('a', 'sm-dot', { href: BASE + 'projects/' + p.slug + '.html', tabindex: '-1', title: p.name, 'aria-hidden': 'true', style: '--di:' + idx });
          a.appendChild(i); d.appendChild(a);
        } else d.appendChild(i);
      });
      r.appendChild(d);
    });
    var firstGroup = map.querySelector('.sm-group');
    if (firstGroup) {
      var lg = el('div', 'sm-legendrow'); var note = el('p', 'sm-legend-note'); note.textContent = 'Fourteen projects, in the order of the Index. Hover or focus one to light its column.';
      var cols = el('div', 'sm-cols'); var cap = el('div', 'sm-caption'); cap.setAttribute('aria-hidden', 'true');
      PROJECTS.forEach(function (p, k) {
        var a = el('a', 'sm-col', { href: BASE + 'projects/' + p.slug + '.html', 'aria-label': p.name + ', case study' });
        var im = el('img', '', { alt: '', loading: 'lazy', decoding: 'async', width: '20', height: '32', src: BASE + p.img }); a.appendChild(im);
        function on() { map.classList.add('is-dim'); a.classList.add('hot'); cap.textContent = p.name; rows.forEach(function (r) { var dot = r.querySelectorAll('.sm-dots i')[k]; if (dot) dot.classList.add('hot'); }); }
        function off() { map.classList.remove('is-dim'); a.classList.remove('hot'); cap.textContent = ''; map.querySelectorAll('.sm-dots i.hot').forEach(function (x) { x.classList.remove('hot'); }); }
        a.addEventListener('mouseenter', on); a.addEventListener('focus', on); a.addEventListener('mouseleave', off); a.addEventListener('blur', off);
        cols.appendChild(a);
      });
      lg.appendChild(note); lg.appendChild(cols); lg.appendChild(cap);
      firstGroup.parentNode.insertBefore(lg, firstGroup);
    }
    map.classList.add('is-enhanced');
  }

  /* ---------- 6. 404: say what was asked for and suggest the closest real page ---------- */
  var nf = doc.getElementById('nfSuggest');
  if (nf) {
    var asked = decodeURIComponent(location.pathname.split('/').pop() || '').toLowerCase().replace(/\.html?$/, '');
    var ask = doc.getElementById('nfAsked'); if (ask) ask.textContent = 'You asked for ' + location.pathname + '.';
    function lev(a, b) { var m = [], i, j; for (i = 0; i <= b.length; i++) m[i] = [i]; for (j = 0; j <= a.length; j++) m[0][j] = j; for (i = 1; i <= b.length; i++) for (j = 1; j <= a.length; j++) m[i][j] = b.charAt(i - 1) === a.charAt(j - 1) ? m[i - 1][j - 1] : Math.min(m[i - 1][j - 1], m[i][j - 1], m[i - 1][j]) + 1; return m[b.length][a.length]; }
    var cands = PROJECTS.map(function (p) { return { name: p.name, url: 'projects/' + p.slug + '.html', key: p.slug }; }).concat(PAGES.map(function (p) { return { name: p[0], url: p[1], key: p[1].replace('.html', '') }; }));
    var best = null, bs = 99;
    if (asked) cands.forEach(function (c) { var d = lev(asked, c.key); if (c.key.indexOf(asked) > -1 || asked.indexOf(c.key) > -1) d = Math.min(d, 1); if (d < bs) { bs = d; best = c; } });
    if (best && bs <= Math.max(2, Math.round(best.key.length * 0.4))) { nf.textContent = 'Did you mean '; var la = el('a', '', { href: BASE + best.url }); la.textContent = best.name; nf.appendChild(la); nf.appendChild(doc.createTextNode('?')); nf.hidden = false; }
  }

  /* ---------- 7. gentle magnetic pull on primary buttons (fine pointers, not under reduced motion) ---------- */
  if (!RM && window.matchMedia('(hover:hover) and (pointer:fine)').matches) {
    Array.prototype.forEach.call(doc.querySelectorAll('.btn-primary:not([data-magnetic])'), function (b) {
      b.classList.add('sx-mag');
      var raf = 0;
      b.addEventListener('pointermove', function (e) {
        var r = b.getBoundingClientRect(); var x = (e.clientX - (r.left + r.width / 2)) * 0.18, y = (e.clientY - (r.top + r.height / 2)) * 0.28;
        cancelAnimationFrame(raf); raf = requestAnimationFrame(function () { b.style.transform = 'translate(' + x.toFixed(1) + 'px,' + (y - 2).toFixed(1) + 'px)'; });
      });
      b.addEventListener('pointerleave', function () { cancelAnimationFrame(raf); b.style.transform = ''; });
    });
  }

})();
