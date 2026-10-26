/* Field Notes motion, media and interaction layer.
   Vanilla JS, no dependencies. Respects prefers-reduced-motion everywhere. */
(function () {
  'use strict';
  var doc = document, root = doc.documentElement;
  root.classList.add('js');
  var RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (RM) root.classList.add('reduce-motion');
  var FINE = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var SAVE = !!(navigator.connection && navigator.connection.saveData);
  var sc = doc.querySelector('script[src*="motion.js"]');
  var ROOT = sc ? new URL('../', sc.src).href : '';
  var $ = function (s, c) { return (c || doc).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || doc).querySelectorAll(s)); };
  var esc = function (t) { return String(t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  function ic(name, cls) { return '<svg class="ic ' + (cls || '') + '" aria-hidden="true" focusable="false"><use href="' + ROOT + 'assets/icons.svg#' + name + '"></use></svg>'; }
  var uid = 0;

  /* ---------- missing images hide silently ---------- */
  function hideImg(img) {
    var host = img.closest('.shot-frame, .dd-thumb, .work-thumb, .cmp');
    (host || img).hidden = true;
  }
  doc.addEventListener('error', function (e) { if (e.target && e.target.tagName === 'IMG') hideImg(e.target); }, true);
  function sweepImages() { $$('img').forEach(function (i) { if (i.complete && i.naturalWidth === 0 && i.getAttribute('src')) hideImg(i); }); }

  /* ---------- reveals: stagger indexes, chips, stat grids ---------- */
  function initReveal() {
    var targets = $$('.chip-group, .stat-grid, [data-stagger]');
    targets.forEach(function (g) { Array.prototype.forEach.call(g.children, function (c, i) { c.style.setProperty('--i', i); }); });
    var clips = $$('[data-reveal-clip]');
    if (!('IntersectionObserver' in window) || RM) { targets.concat(clips).forEach(function (t) { t.classList.add('in-view'); }); return; }
    // a fully clipped element never intersects, so watch its parent instead
    var cio = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target._clip.classList.add('in-view'); cio.unobserve(e.target); } });
    }, { threshold: 0.1 });
    clips.forEach(function (c) { var h = c.parentElement; h._clip = c; cio.observe(h); });
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in-view'); io.unobserve(e.target); } });
    }, { threshold: 0.2, rootMargin: '0px 0px -5% 0px' });
    targets.forEach(function (t) { io.observe(t); });
  }

  /* ---------- flow diagrams, rendered from JSON ---------- */
  function initFlows() {
    $$('[data-flow]').forEach(function (el) {
      var data; try { data = JSON.parse($('script[type="application/json"]', el).textContent); } catch (e) { return; }
      var id = 'flow' + (++uid), ol = doc.createElement('ol'); ol.className = 'flow-list';
      ol.setAttribute('aria-label', data.title || 'Flow');
      data.nodes.forEach(function (n, i) {
        var li = doc.createElement('li'); li.className = 'flow-item'; li.style.setProperty('--i', i);
        li.innerHTML = '<button type="button" class="flow-node" aria-expanded="false" aria-controls="' + id + '-' + i + '">' +
          '<span class="fn-top">' + ic('i-' + n.icon, 'ic-20') + '<span class="fn-idx">' + String(i + 1).padStart(2, '0') + '</span></span>' +
          '<span class="fn-t">' + esc(n.title) + '</span><span class="fn-d">' + esc(n.text) + '</span>' +
          '<span class="fn-more">' + ic('i-chevron-down', 'ic-12') + 'What happens here</span></button>' +
          '<div class="flow-note" id="' + id + '-' + i + '" hidden>' + esc(n.note || '') + '</div>';
        ol.appendChild(li);
      });
      var svg = doc.createElementNS('http://www.w3.org/2000/svg', 'svg'); svg.setAttribute('class', 'flow-svg'); svg.setAttribute('aria-hidden', 'true');
      el.appendChild(svg); el.appendChild(ol);
      var drawn = false, anim = null;
      function geo() {
        var base = el.getBoundingClientRect(), nodes = $$('.flow-node', ol), out = [];
        var r = nodes.map(function (b) { var q = b.getBoundingClientRect(); return { l: q.left - base.left, r: q.right - base.left, t: q.top - base.top, b: q.bottom - base.top, cx: (q.left + q.right) / 2 - base.left, cy: (q.top + q.bottom) / 2 - base.top, h: q.height }; });
        for (var i = 0; i < r.length - 1; i++) {
          var a = r[i], b = r[i + 1];
          var yy = a.t + 30; out.push(Math.abs(a.t - b.t) < 6 ? 'M' + a.r + ' ' + yy + 'L' + b.l + ' ' + yy
            : 'M' + a.cx + ' ' + a.b + 'V' + (a.b + b.t) / 2 + 'H' + b.cx + 'V' + b.t);
        }
        return out;
      }
      function layout() {
        var ds = geo(); svg.innerHTML = '';
        var ons = ds.map(function (d) {
          var g = doc.createElementNS(svg.namespaceURI, 'path'); g.setAttribute('d', d); g.setAttribute('class', 'flow-path'); svg.appendChild(g);
          var o = doc.createElementNS(svg.namespaceURI, 'path'); o.setAttribute('d', d); o.setAttribute('class', 'flow-path-on'); svg.appendChild(o);
          o.len = o.getTotalLength(); o.style.strokeDasharray = o.len; o.style.strokeDashoffset = drawn || RM ? 0 : o.len; return o;
        });
        if (!RM) {
          var dot = doc.createElementNS(svg.namespaceURI, 'circle'); dot.setAttribute('r', 4); dot.setAttribute('class', 'flow-dot'); dot.style.opacity = 0; svg.appendChild(dot); svg.dot = dot;
        }
        svg.ons = ons;
        if (drawn && svg.dot && ons.length) { var l = ons[ons.length - 1], p = l.getPointAtLength(l.len); svg.dot.setAttribute('transform', 'translate(' + p.x + ' ' + p.y + ')'); svg.dot.style.opacity = 1; }
      }
      function play() {
        if (drawn) return; drawn = true; el.classList.add('flow-go');
        if (RM) { el.classList.add('flow-still'); return; }
        var STEP = 450, DUR = 600, t0 = performance.now(), ons = svg.ons, dot = svg.dot;
        ons.forEach(function (o, i) { o.style.strokeDashoffset = o.len; o.animate([{ strokeDashoffset: o.len }, { strokeDashoffset: 0 }], { duration: DUR, delay: i * STEP + 250, easing: 'cubic-bezier(.16,.84,.28,1)', fill: 'forwards' }); });
        if (dot) {
          dot.style.opacity = 1; var total = (ons.length - 1) * STEP + DUR + 250;
          (function tick(now) {
            var t = now - t0, i = Math.min(ons.length - 1, Math.max(0, Math.floor((t - 250) / STEP))), o = ons[i];
            var k = Math.min(1, Math.max(0, (t - 250 - i * STEP) / DUR)), p = o.getPointAtLength(o.len * k);
            dot.setAttribute('transform', 'translate(' + p.x + ' ' + p.y + ')');
            if (t < total) requestAnimationFrame(tick);
          })(t0);
        }
      }
      layout();
      if ('ResizeObserver' in window) new ResizeObserver(function () { layout(); }).observe(el); else window.addEventListener('resize', layout);
      ol.addEventListener('click', function (e) {
        var b = e.target.closest('.flow-node'); if (!b) return; var open = b.getAttribute('aria-expanded') === 'true';
        $$('.flow-node', ol).forEach(function (x) { x.setAttribute('aria-expanded', 'false'); $('#' + x.getAttribute('aria-controls')).hidden = true; });
        if (!open) { b.setAttribute('aria-expanded', 'true'); $('#' + b.getAttribute('aria-controls')).hidden = false; }
        layout();
      });
      var ns = $('noscript', el); if (ns) ns.remove();
      if ('IntersectionObserver' in window) { var io = new IntersectionObserver(function (es) { if (es[0].isIntersecting) { play(); io.disconnect(); } }, { threshold: 0.25 }); io.observe(el); } else play();
    });
  }

  /* ---------- video frames ---------- */
  function initVideos() {
    var frames = $$('.video-frame[data-mp4], .video-frame[data-webm]');
    if (!frames.length) return;
    frames.forEach(function (f) {
      var v = $('video', f), btn = $('.vf-toggle', f), lbl = btn && $('.vf-lbl', btn);
      var loaded = false, userPaused = false, visible = false, failed = false;
      v.muted = true; v.setAttribute('playsinline', ''); v.setAttribute('muted', ''); v.loop = true;
      function setState(paused) { if (!btn) return; btn.setAttribute('aria-pressed', paused ? 'true' : 'false'); if (lbl) lbl.textContent = paused ? 'Paused' : 'Pause'; }
      function fail() {
        if (f.dataset.fallbackMp4 && !f._fb) { f._fb = 1; load(f.dataset.fallbackMp4, null); return; }
        failed = true; f.classList.add('vf-missing');
      }
      function load(mp4, webm) {
        loaded = true; v.innerHTML = '';
        var last;
        if (webm) { var s1 = doc.createElement('source'); s1.src = webm; s1.type = 'video/webm'; v.appendChild(s1); last = s1; }
        if (mp4) { var s2 = doc.createElement('source'); s2.src = mp4; s2.type = 'video/mp4'; v.appendChild(s2); last = s2; }
        last.addEventListener('error', fail); v.addEventListener('error', fail); v.load();
      }
      function probePoster() {
        var p = f.dataset.poster; if (!p) return;
        var im = new Image(); im.onload = function () { v.poster = p; }; im.onerror = function () { if (!f.dataset.posterFallback && !f.dataset.fallbackMp4) { failed = true; f.classList.add('vf-missing'); } };
        im.src = p;
      }
      function play() { if (failed) return; var pr = v.play(); if (pr && pr.catch) pr.catch(function () { setState(true); }); }
      function ensure() { if (!loaded) { probePoster(); load(f.dataset.mp4, f.dataset.webm); } }
      var autoOk = !RM && !SAVE;
      setState(!autoOk);
      if (btn) btn.addEventListener('click', function () {
        var nowPaused = btn.getAttribute('aria-pressed') !== 'true';
        if (nowPaused) { userPaused = true; v.pause(); setState(true); } else { userPaused = false; ensure(); play(); setState(false); }
      });
      if (!('IntersectionObserver' in window)) { if (autoOk) { ensure(); play(); } return; }
      new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) { ensure(); } });
      }, { rootMargin: '200px' }).observe(f);
      new IntersectionObserver(function (es) {
        visible = es[0].isIntersecting;
        if (visible && autoOk && !userPaused && loaded) { play(); setState(false); } else if (!visible) { v.pause(); }
      }, { threshold: 0.25 }).observe(f);
      v.addEventListener('loadeddata', function () { if (visible && autoOk && !userPaused) { play(); setState(false); } });
      if (f.dataset.posterFallback) { v.poster = f.dataset.posterFallback; }
    });
  }

  /* ---------- lightbox ---------- */
  function initLightbox() {
    var frames = $$('.shot-frame').filter(function (f) { return $('img', f); });
    if (!frames.length) return;
    var dlg = doc.createElement('dialog'); dlg.className = 'lightbox'; dlg.setAttribute('aria-label', 'Image viewer');
    dlg.innerHTML = '<div class="lb-stage"><img alt=""></div><button class="lb-btn lb-close" type="button" aria-label="Close">' + ic('i-x', 'ic-24') + '</button>' +
      '<button class="lb-btn lb-prev" type="button" aria-label="Previous image">' + ic('i-arrow-right', 'ic-24') + '</button>' +
      '<button class="lb-btn lb-next" type="button" aria-label="Next image">' + ic('i-arrow-right', 'ic-24') + '</button><div class="lb-cap" aria-live="polite"></div>';
    doc.body.appendChild(dlg);
    $('.lb-prev svg', dlg).style.transform = 'scaleX(-1)';
    var img = $('img', dlg), cap = $('.lb-cap', dlg), idx = 0, list = [];
    function show(i) {
      idx = (i + list.length) % list.length; var s = $('img', list[idx]);
      img.src = s.currentSrc || s.src; img.alt = s.alt || '';
      var c = list[idx].parentElement && $('.shot-caption', list[idx].parentElement);
      cap.textContent = (idx + 1) + ' / ' + list.length + (s.alt ? '  ' + s.alt : '');
    }
    function open(f) { list = frames.filter(function (x) { return !x.hidden && !x.closest('[hidden]') && x.offsetParent !== null; }); if (list.indexOf(f) < 0) list = [f]; dlg.showModal(); show(list.indexOf(f)); $('.lb-close', dlg).focus(); }
    frames.forEach(function (f) {
      f.setAttribute('tabindex', '0'); f.setAttribute('role', 'button'); f.setAttribute('aria-label', 'Enlarge image: ' + ($('img', f).alt || 'screenshot'));
      var h = doc.createElement('span'); h.className = 'zoom-hint'; h.innerHTML = ic('i-maximize', 'ic-16'); f.appendChild(h);
      f.addEventListener('click', function () { open(f); });
      f.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(f); } });
    });
    $('.lb-close', dlg).addEventListener('click', function () { dlg.close(); });
    $('.lb-prev', dlg).addEventListener('click', function () { show(idx - 1); });
    $('.lb-next', dlg).addEventListener('click', function () { show(idx + 1); });
    dlg.addEventListener('keydown', function (e) { if (e.key === 'ArrowLeft') show(idx - 1); if (e.key === 'ArrowRight') show(idx + 1); });
    dlg.addEventListener('click', function (e) { if (e.target === dlg || e.target.classList.contains('lb-stage')) dlg.close(); });
    var sx = null;
    dlg.addEventListener('pointerdown', function (e) { sx = e.clientX; });
    dlg.addEventListener('pointerup', function (e) { if (sx === null) return; var dx = e.clientX - sx; sx = null; if (Math.abs(dx) > 60 && e.pointerType === 'touch') show(idx + (dx < 0 ? 1 : -1)); });
  }

  /* ---------- before and after slider ---------- */
  function initCompare() {
    $$('[data-cmp]').forEach(function (c) {
      var h = $('.cmp-handle', c); var pct = 50;
      function set(p) { pct = Math.max(0, Math.min(100, p)); c.style.setProperty('--p', pct + '%'); h.setAttribute('aria-valuenow', Math.round(pct)); h.setAttribute('aria-valuetext', Math.round(pct) + ' percent shows the earlier version'); }
      function fromEvent(e) { var r = c.getBoundingClientRect(); set((e.clientX - r.left) / r.width * 100); }
      var drag = false;
      c.addEventListener('pointerdown', function (e) { drag = true; c.setPointerCapture(e.pointerId); fromEvent(e); h.focus({ preventScroll: true }); });
      c.addEventListener('pointermove', function (e) { if (drag) fromEvent(e); });
      c.addEventListener('pointerup', function () { drag = false; }); c.addEventListener('pointercancel', function () { drag = false; });
      h.addEventListener('keydown', function (e) {
        var k = { ArrowLeft: -5, ArrowDown: -5, ArrowRight: 5, ArrowUp: 5, PageDown: -20, PageUp: 20 }[e.key];
        if (k) { e.preventDefault(); set(pct + k); } else if (e.key === 'Home') { e.preventDefault(); set(0); } else if (e.key === 'End') { e.preventDefault(); set(100); }
      });
      set(50);
    });
  }

  /* ---------- navigation: indicator, header, mobile menu ---------- */
  function initNav() {
    var nav = $('nav.links');
    if (nav) {
      var ind = doc.createElement('span'); ind.className = 'nav-ind'; ind.setAttribute('aria-hidden', 'true'); nav.appendChild(ind);
      var links = $$(':scope > a', nav), cur = $(':scope > a.current', nav);
      function move(a) { if (!a) { ind.style.transform = 'translateX(0) scaleX(0)'; return; } var n = nav.getBoundingClientRect(), r = a.getBoundingClientRect(); ind.style.transform = 'translateX(' + (r.left - n.left) + 'px) scaleX(' + (r.width / 100) + ')'; }
      if (RM) ind.style.transition = 'none';
      links.concat($$('.nav-item-dropdown > a', nav)).forEach(function (a) {
        a.addEventListener('mouseenter', function () { move(a); }); a.addEventListener('focus', function () { move(a); });
        a.addEventListener('mouseleave', function () { move(cur); }); a.addEventListener('blur', function () { move(cur); });
      });
      var cur2 = cur || $('.nav-item-dropdown > a.current', nav); cur = cur2; move(cur);
      window.addEventListener('resize', function () { move(cur); });
      doc.fonts && doc.fonts.ready.then(function () { move(cur); });
    }
    var hdr = $('header'), menu = $('#mobileMenu');
    if (hdr) {
      var lastY = window.scrollY, tick = false;
      window.addEventListener('scroll', function () {
        if (tick) return; tick = true;
        requestAnimationFrame(function () {
          var y = window.scrollY, dy = y - lastY;
          if (!(menu && menu.classList.contains('open'))) {
            if (dy > 6 && y > 240 && !hdr.contains(doc.activeElement)) hdr.classList.add('hdr-hide');
            else if (dy < -6 || y < 120) hdr.classList.remove('hdr-hide');
          }
          lastY = y; tick = false;
        });
      }, { passive: true });
      hdr.addEventListener('focusin', function () { hdr.classList.remove('hdr-hide'); });
    }
    if (menu) {
      menu.setAttribute('role', 'dialog'); menu.setAttribute('aria-modal', 'true'); menu.setAttribute('aria-label', 'Site menu');
      $$('a', menu).forEach(function (a, i) { a.style.setProperty('--i', i); });
      menu.addEventListener('keydown', function (e) {
        if (e.key !== 'Tab') return; var f = $$('a, button', menu).filter(function (x) { return x.offsetParent !== null; });
        if (!f.length) return; var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && doc.activeElement === first) { e.preventDefault(); last.focus(); } else if (!e.shiftKey && doc.activeElement === last) { e.preventDefault(); first.focus(); }
      });
    }
  }

  /* ---------- case study mini bar ---------- */
  function initMinibar() {
    if (!/\/projects\//.test(location.pathname)) return;
    var h1 = $('main h1'), heroSec = h1 && h1.closest('section'); if (!heroSec) return;
    var heads = $$('main .case-num-title'); if (heads.length < 2) heads = $$('main .section-label').filter(function (s) { return s.textContent.trim().length > 3; });
    var secs = heads.map(function (h, i) { var s = h.closest('section, .case-num-section') || h; if (!s.id) s.id = 'sec-' + (i + 1); var t = h.cloneNode(true); $$('.rule', t).forEach(function (r) { r.remove(); }); var label = t.textContent.replace(/\s+/g, ' ').trim().split(/ {2,}| \/ /)[0]; if (label.length > 26) label = label.slice(0, 24) + '...'; return { id: s.id, label: label, el: s }; });
    var keep = secs.length > 6 ? secs.filter(function (_, i) { return i % Math.ceil(secs.length / 6) === 0; }) : secs;
    var bar = doc.createElement('div'); bar.className = 'minibar'; bar.setAttribute('role', 'navigation'); bar.setAttribute('aria-label', 'Case study sections');
    bar.innerHTML = '<div class="wrap minibar-row"><span class="minibar-name">' + esc(h1.textContent.trim()) + '</span><div class="minibar-links">' + keep.map(function (s) { return '<a href="#' + s.id + '">' + esc(s.label) + '</a>'; }).join('') + '</div></div><span class="minibar-line"></span>';
    doc.body.appendChild(bar); var line = $('.minibar-line', bar), as = $$('.minibar-links a', bar);
    var main = $('main'), tick = false;
    function upd() {
      var y = window.scrollY, heroBottom = heroSec.getBoundingClientRect().bottom + y - 80;
      bar.classList.toggle('show', y > heroBottom);
      var r = main.getBoundingClientRect(), p = Math.max(0, Math.min(1, (-r.top) / Math.max(1, r.height - window.innerHeight)));
      line.style.transform = 'scaleX(' + p + ')';
      var on = null; keep.forEach(function (s, i) { if (s.el.getBoundingClientRect().top < window.innerHeight * 0.4) on = i; });
      as.forEach(function (a, i) { a.classList.toggle('on', i === on); });
      tick = false;
    }
    window.addEventListener('scroll', function () { if (!tick) { tick = true; requestAnimationFrame(upd); } }, { passive: true });
    upd();
  }

  /* ---------- work archive: search, sort, view, FLIP, cursor preview ---------- */
  function initArchive() {
    var list = $('.work-archive'); if (!list) return;
    var items = $$('.work-item', list);
    var rank = { 'Live': 0, 'Personal project': 1, 'Client project': 1, 'Development build': 2, 'Demo': 3, 'Concept': 3 };
    var data = items.map(function (el, i) {
      return { el: el, i: i, cat: el.dataset.category || '', title: $('.work-title', el).textContent.trim(), status: el.dataset.status || '', text: el.textContent.toLowerCase().replace(/\s+/g, ' '), titleHTML: $('.work-title', el).innerHTML };
    });
    var state = { cat: 'all', q: '', sort: 'default', view: 'list' };
    var tools = doc.createElement('div'); tools.className = 'archive-tools';
    tools.innerHTML = '<div class="search-box" role="search">' + ic('i-search', 'ic-16') + '<input type="search" id="archiveSearch" placeholder="Search projects, stack, features" aria-label="Search projects" autocomplete="off"></div>' +
      '<label class="sort-box">Sort <select id="archiveSort"><option value="default">Featured order</option><option value="az">A to Z</option><option value="status">Status</option></select></label>' +
      '<div class="view-toggle" role="group" aria-label="View"><button type="button" class="view-btn" data-view="list" aria-pressed="true" aria-label="List view">' + ic('i-list', 'ic-20') + '</button><button type="button" class="view-btn" data-view="grid" aria-pressed="false" aria-label="Grid view">' + ic('i-grid', 'ic-20') + '</button></div>';
    var fr = $('.filter-row'); fr.parentNode.insertBefore(tools, fr.nextSibling);
    var count = doc.createElement('div'); count.className = 'archive-count'; count.setAttribute('role', 'status'); count.setAttribute('aria-live', 'polite'); tools.parentNode.insertBefore(count, tools.nextSibling);
    var empty = doc.createElement('div'); empty.className = 'archive-empty'; empty.innerHTML = ic('i-search', 'ic-32') + '<p>No projects match that search. Try a stack name, a feature, or clear the filters.</p>'; list.parentNode.insertBefore(empty, list.nextSibling);
    function mark(el, html, q) {
      if (!q) { el.innerHTML = html; return; }
      var tmp = doc.createElement('div'); tmp.innerHTML = html;
      (function walk(n) { Array.prototype.slice.call(n.childNodes).forEach(function (c) { if (c.nodeType === 3) { var i = c.data.toLowerCase().indexOf(q); if (i > -1) { var m = doc.createElement('mark'); m.textContent = c.data.substr(i, q.length); var after = c.splitText(i); after.data = after.data.substr(q.length); c.parentNode.insertBefore(m, after); } } else if (c.nodeType === 1) walk(c); }); })(tmp);
      el.innerHTML = tmp.innerHTML;
    }
    function apply(animate) {
      var q = state.q.trim().toLowerCase();
      var vis = data.filter(function (d) { return (state.cat === 'all' || d.cat.indexOf(state.cat) > -1) && (!q || d.text.indexOf(q) > -1); });
      var ord = vis.slice();
      if (state.sort === 'az') ord.sort(function (a, b) { return a.title.localeCompare(b.title); });
      else if (state.sort === 'status') ord.sort(function (a, b) { return (rank[a.status] == null ? 3 : rank[a.status]) - (rank[b.status] == null ? 3 : rank[b.status]) || a.i - b.i; });
      else ord.sort(function (a, b) { return a.i - b.i; });
      var first = new Map(); if (animate && !RM) data.forEach(function (d) { if (!d.el.hidden) first.set(d.el, d.el.getBoundingClientRect()); });
      data.forEach(function (d) { d.el.hidden = vis.indexOf(d) < 0; mark($('.work-title', d.el), d.titleHTML, q); });
      ord.forEach(function (d, n) { list.appendChild(d.el); $('.work-num', d.el).textContent = String(n + 1).padStart(2, '0'); });
      list.classList.toggle('view-grid', state.view === 'grid');
      count.textContent = 'Showing ' + vis.length + ' of ' + data.length + ' projects';
      empty.classList.toggle('show', !vis.length);
      if (animate && !RM) ord.forEach(function (d) {
        var f = first.get(d.el), l = d.el.getBoundingClientRect();
        if (f) { var dx = f.left - l.left, dy = f.top - l.top; if (dx || dy) d.el.animate([{ transform: 'translate(' + dx + 'px,' + dy + 'px)' }, { transform: 'none' }], { duration: 450, easing: 'cubic-bezier(.16,.84,.28,1)' }); }
        else d.el.animate([{ opacity: 0, transform: 'translateY(10px)' }, { opacity: 1, transform: 'none' }], { duration: 400, easing: 'cubic-bezier(.16,.84,.28,1)' });
      });
    }
    $$('[data-filter]').forEach(function (b) { b.addEventListener('click', function () { $$('[data-filter]').forEach(function (x) { x.classList.remove('active'); x.removeAttribute('aria-pressed'); }); b.classList.add('active'); b.setAttribute('aria-pressed', 'true'); state.cat = b.dataset.filter; apply(true); }); });
    $('#archiveSearch').addEventListener('input', function (e) { state.q = e.target.value; apply(true); });
    $('#archiveSort').addEventListener('change', function (e) { state.sort = e.target.value; apply(true); });
    $$('.view-btn', tools).forEach(function (b) { b.addEventListener('click', function () { state.view = b.dataset.view; $$('.view-btn', tools).forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); }); apply(true); }); });
    list.addEventListener('click', function (e) {
      if (state.view !== 'grid') return; var head = e.target.closest('.work-head'); if (!head) return;
      e.stopImmediatePropagation(); var a = $('.work-links a[href*="projects/"]', head.closest('.work-item')); if (a) location.href = a.href;
    }, true);
    apply(false);
    // cursor following preview
    if (FINE && !RM) {
      var peek = doc.createElement('div'); peek.className = 'peek'; peek.setAttribute('aria-hidden', 'true'); peek.innerHTML = '<img alt=""><video muted loop playsinline preload="none" hidden></video>'; doc.body.appendChild(peek);
      var pv = $('video', peek), pi = $('img', peek), tx = 0, ty = 0, cx = 0, cy = 0, run = false;
      function loop() { cx += (tx - cx) * 0.18; cy += (ty - cy) * 0.18; peek.style.transform = 'translate3d(' + cx + 'px,' + cy + 'px,0)'; if (peek.classList.contains('on') || Math.abs(tx - cx) > 0.5) requestAnimationFrame(loop); else run = false; }
      list.addEventListener('pointermove', function (e) { tx = e.clientX + 28; ty = e.clientY + 18; if (tx + 300 > window.innerWidth) tx = e.clientX - 328; if (!run && peek.classList.contains('on')) { run = true; requestAnimationFrame(loop); } });
      list.addEventListener('pointerover', function (e) {
        var h = e.target.closest('.work-head'); if (!h || state.view === 'grid') return;
        var t = $('.work-thumb img', h); if (!t || t.closest('[hidden]')) return;
        pi.src = t.currentSrc || t.src; var clipSrc = h.closest('.work-item').dataset.clip; if (clipSrc && !SAVE) { pv.hidden = false; pi.hidden = true; var cs = (pv.canPlayType('video/webm; codecs="vp9"') ? clipSrc.replace('.mp4', '.webm') : clipSrc); if (pv.getAttribute('src') !== cs) pv.src = cs; pv.play().catch(function () {}); } else { pv.hidden = true; pi.hidden = false; pv.pause(); } cx = tx = e.clientX + 28; cy = ty = e.clientY + 18; peek.classList.add('on'); if (!run) { run = true; requestAnimationFrame(loop); }
      });
      list.addEventListener('pointerout', function (e) { if (!e.relatedTarget || !e.relatedTarget.closest || !e.relatedTarget.closest('.work-head')) peek.classList.remove('on'); pv.pause(); });
    }
  }

  /* ---------- project row shared element name for page transition ---------- */
  function initSharedElement() {
    doc.addEventListener('click', function (e) {
      var a = e.target.closest('a[href*="projects/"]'); if (!a) return;
      var item = a.closest('.work-item'); var t = item && $('.work-thumb', item);
      if (t) t.style.viewTransitionName = 'proj-hero';
    }, true);
  }

  /* ---------- copy email, contact form ---------- */
  var toastEl;
  function toast(msg) { if (!toastEl) { toastEl = doc.createElement('div'); toastEl.className = 'toast'; toastEl.setAttribute('role', 'status'); doc.body.appendChild(toastEl); } toastEl.textContent = msg; toastEl.classList.add('show'); clearTimeout(toastEl._t); toastEl._t = setTimeout(function () { toastEl.classList.remove('show'); }, 2200); }
  function initContact() {
    var cb = $('#copyEmailBtn');
    if (cb) {
      var email = ($('#emailLink') || {}).textContent || '';
      cb.classList.add('copy-btn'); cb.innerHTML = ic('i-copy', 'ic-16') + '<span>Copy email</span>'; cb.setAttribute('aria-label', 'Copy email address');
      cb.addEventListener('click', function () {
        function ok() { cb.innerHTML = ic('i-check', 'ic-16') + '<span>Copied</span>'; toast('Email copied'); setTimeout(function () { cb.innerHTML = ic('i-copy', 'ic-16') + '<span>Copy email</span>'; }, 2000); }
        if (navigator.clipboard) navigator.clipboard.writeText(email.trim()).then(ok, function () { toast('Copy failed. Select the address instead.'); });
        else toast('Copy is not available here. Select the address instead.');
      });
    }
    var form = $('form.form-grid'); if (!form) return;
    form.noValidate = true; var status = doc.createElement('div'); status.className = 'form-status'; status.setAttribute('role', 'status'); status.setAttribute('aria-live', 'polite');
    form.insertBefore(status, $('.form-submit', form));
    $$('.form-row', form).forEach(function (r) { var inp = $('input,textarea', r); if (!inp || !inp.required) return; var er = doc.createElement('div'); er.className = 'err'; er.id = inp.id + '-err'; er.innerHTML = ic('i-alert', 'ic-14') + '<span></span>'; r.appendChild(er); inp.setAttribute('aria-describedby', er.id); });
    function check(inp) {
      var r = inp.closest('.form-row'), er = $('.err span', r), msg = '';
      if (inp.required && !inp.value.trim()) msg = 'This field is required.'; else if (inp.type === 'email' && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(inp.value)) msg = 'Enter a valid email address.';
      r.classList.toggle('invalid', !!msg); inp.setAttribute('aria-invalid', msg ? 'true' : 'false'); if (er) er.textContent = msg; return !msg;
    }
    $$('input[required],textarea[required]', form).forEach(function (i) { i.addEventListener('blur', function () { check(i); }); i.addEventListener('input', function () { if (i.closest('.invalid')) check(i); }); });
    form.addEventListener('submit', function (e) {
      e.preventDefault(); var bad = $$('input[required],textarea[required]', form).filter(function (i) { return !check(i); });
      if (bad.length) { bad[0].focus(); status.className = 'form-status show bad'; status.innerHTML = ic('i-alert', 'ic-16') + 'Please fix the highlighted fields.'; return; }
      var btn = $('.form-submit', form), label = btn.textContent; btn.disabled = true; btn.textContent = 'Sending'; status.className = 'form-status show'; status.innerHTML = ic('i-loader', 'ic-16') + 'Sending your message.';
      var body = {}; new FormData(form).forEach(function (v, k) { body[k] = v; });
      fetch(form.action, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: JSON.stringify(body) })
        .then(function (r) { return r.json(); }).then(function (j) {
          if (j.success) { form.reset(); status.className = 'form-status show ok'; status.innerHTML = ic('i-check', 'ic-16') + 'Message sent. I will reply by email.'; }
          else throw new Error(j.message || 'failed');
        }).catch(function () { status.className = 'form-status show bad'; status.innerHTML = ic('i-alert', 'ic-16') + 'Could not send. Please try again, or email me directly.'; })
        .then(function () { btn.disabled = false; btn.textContent = label; });
    });
  }

  /* ---------- one time per session intro ---------- */
  function initIntro() {
    if (RM || !/(^|\/)(index\.html)?$/.test(location.pathname) && !/\/portfolio\/?$/.test(location.pathname)) return;
    try { if (sessionStorage.getItem('fn-intro')) return; sessionStorage.setItem('fn-intro', '1'); } catch (e) { return; }
    var i = doc.createElement('div'); i.id = 'intro'; i.setAttribute('role', 'presentation');
    i.innerHTML = '<svg viewBox="0 0 330 60" aria-hidden="true"><text x="2" y="42">obioma</text><circle class="dotp" cx="150" cy="38" r="3.4"/><text x="160" y="42">justice</text></svg><button type="button">Skip</button>';
    doc.body.appendChild(i);
    function end() { i.classList.add('out'); setTimeout(function () { i.remove(); }, 400); }
    $('button', i).addEventListener('click', end); setTimeout(end, 1150);
  }


  /* ---------- homepage showreel ---------- */
  function initReel() {
    var box = $('[data-reel]'); if (!box) return;
    var v = $('video', box), btn = $('.vf-toggle', box), lbl = $('.vf-lbl', btn), tabs = $$('.reel-tab', box);
    var title = $('.reel-title', box), desc = $('.reel-desc', box), link = $('.reel-link', box), frame = $('.reel-frame', box);
    var userPaused = false, visible = false, started = false, autoOk = !RM && !SAVE;
    v.muted = true; v.setAttribute('playsinline', '');
    function state(p) { btn.setAttribute('aria-pressed', p ? 'true' : 'false'); lbl.textContent = p ? 'Paused' : 'Pause'; }
    function pick(t, play) {
      tabs.forEach(function (x) { x.setAttribute('aria-pressed', x === t ? 'true' : 'false'); });
      title.textContent = t.dataset.title; desc.textContent = t.dataset.desc; link.href = t.dataset.href;
      v.poster = t.dataset.poster; v.src = (t.dataset.webm && v.canPlayType('video/webm; codecs="vp9"')) ? t.dataset.webm : t.dataset.mp4; v.load(); started = true;
      if (play && autoOk && !userPaused) { var pr = v.play(); if (pr && pr.catch) pr.catch(function () { state(true); }); state(false); } else state(true);
    }
    v.addEventListener('error', function () { frame.classList.add('vf-missing'); });
    tabs.forEach(function (t) { t.addEventListener('click', function () { userPaused = false; var save = autoOk; autoOk = true; pick(t, true); autoOk = save && autoOk; state(false); }); });
    btn.addEventListener('click', function () {
      if (btn.getAttribute('aria-pressed') !== 'true') { userPaused = true; v.pause(); state(true); }
      else { userPaused = false; if (!started) pick(tabs[0], false); v.play(); state(false); }
    });
    tabs[0].setAttribute('aria-pressed', 'true'); title.textContent = tabs[0].dataset.title; desc.textContent = tabs[0].dataset.desc; link.href = tabs[0].dataset.href; v.poster = tabs[0].dataset.poster; state(true);
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) {
        visible = es[0].isIntersecting;
        if (visible && !started) pick(tabs[0], true);
        else if (visible && autoOk && !userPaused) { v.play(); state(false); }
        else if (!visible) v.pause();
      }, { threshold: 0.3, rootMargin: '200px 0px' }).observe(box);
    }
  }

  /* ---------- boot ---------- */
  function boot() {
    sweepImages(); initReveal(); initFlows(); initVideos(); initLightbox(); initCompare(); initNav(); initMinibar(); initArchive(); initReel(); initSharedElement(); initContact(); initIntro();
  }
  if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', boot); else boot();
})();
