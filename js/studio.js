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

  var here = location.pathname.split('/').pop() || 'index.html';
  var inProjects = /\/projects\/[^/]*$/.test(location.pathname);
  function el(tag, cls, attrs) { var e = doc.createElement(tag); if (cls) e.className = cls; for (var k in (attrs || {})) e.setAttribute(k, attrs[k]); return e; }
  function icon(name) { var s = doc.createElementNS('http://www.w3.org/2000/svg', 'svg'); s.setAttribute('class', 'ic'); s.setAttribute('aria-hidden', 'true'); s.setAttribute('focusable', 'false'); var u = doc.createElementNS('http://www.w3.org/2000/svg', 'use'); u.setAttribute('href', BASE + 'assets/icons.svg#' + name); s.appendChild(u); return s; }

  /* ---------- 3. aria-current on nav links ---------- */
  Array.prototype.forEach.call(doc.querySelectorAll('header .links a[href], #mobileMenu a[href]'), function (a) {
    var f = (a.getAttribute('href') || '').split('#')[0].split('/').pop();
    if (f && f === here) a.setAttribute('aria-current', 'page');
    else if (a.getAttribute('aria-current') === 'page' && f !== here) a.removeAttribute('aria-current');
  });

  /* ---------- 1. Project Index overlay ---------- */
  var anchor = doc.querySelector('header .menu-btn');
  var row = doc.querySelector('header .nav-row');
  if (!row) return;
  var trigger = el('button', 'sx-trigger', { type: 'button', 'aria-haspopup': 'dialog', 'aria-expanded': 'false', 'aria-controls': 'sxIndex' });
  trigger.appendChild(icon('i-grid')); var tl = el('span'); tl.textContent = 'Index'; trigger.appendChild(tl);
  if (anchor && anchor.parentNode) anchor.parentNode.insertBefore(trigger, anchor); else row.appendChild(trigger);

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
    html.classList.add('sx-lock'); ov.classList.add('is-open'); trigger.setAttribute('aria-expanded', 'true');
    setTimeout(function () { close.focus(); }, RM ? 0 : 60);
  }
  function shut() {
    if (!ov.classList.contains('is-open')) return;
    ov.classList.remove('is-open'); html.classList.remove('sx-lock'); trigger.setAttribute('aria-expanded', 'false');
    hidden.forEach(function (c) { c.removeAttribute('inert'); }); hidden = [];
    if (lastFocus && lastFocus.focus) lastFocus.focus(); else trigger.focus();
  }
  trigger.addEventListener('click', function () { ov.classList.contains('is-open') ? shut() : open(); });
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
})();
