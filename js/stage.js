/* Stage layer: counter loader, labelled cursor, pinned horizontal project rail,
   scroll-lit statement, split-character heading, scroll progress hairline.
   Needs gsap + ScrollTrigger for the pinned parts; everything degrades to plain scrolling. */
(function () {
  'use strict';
  var doc = document, html = doc.documentElement;
  var RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var FINE = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var SAVE = !!(navigator.connection && navigator.connection.saveData);
  var $ = function (s, c) { return (c || doc).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || doc).querySelectorAll(s)); };
  var HAS_GSAP = !!(window.gsap && window.ScrollTrigger);

  /* ---------- 1. counter loader (home, once per session) ---------- */
  function endLoading() { html.classList.remove('ld'); }
  (function loader() {
    if (!html.classList.contains('ld')) return;
    if (RM) { endLoading(); return; }
    var old = $('#intro'); if (old) old.remove();
    var el = doc.createElement('div'); el.id = 'loader'; el.setAttribute('role', 'status'); el.setAttribute('aria-label', 'Loading');
    el.innerHTML = '<div class="ld-top"><span>obioma.justice</span><span>Lagos, Nigeria</span></div>' +
      '<div class="ld-mid"><div><div class="ld-count" aria-hidden="true"><span class="ld-n">0</span><sup>%</sup></div><div class="ld-bar"><i></i></div></div></div>' +
      '<div class="ld-bot"><span>Portfolio 2026</span><button type="button" class="ld-skip">Skip</button></div>';
    doc.body.appendChild(el);
    var n = $('.ld-n', el), bar = $('.ld-bar i', el), done = false, t0 = performance.now(), DUR = 1700;
    function finish() {
      if (done) return; done = true;
      n.textContent = '100'; bar.style.transform = 'scaleX(1)';
      el.style.transition = 'clip-path 0.95s cubic-bezier(.76,0,.24,1)';
      requestAnimationFrame(function () { el.style.clipPath = 'inset(0 0 100% 0)'; });
      setTimeout(endLoading, 380);
      setTimeout(function () { el.remove(); }, 1100);
    }
    function tick(now) {
      if (done) return;
      var p = Math.min(1, (now - t0) / DUR), e = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
      n.textContent = String(Math.round(e * 100)); bar.style.transform = 'scaleX(' + e + ')';
      if (p < 1) requestAnimationFrame(tick); else setTimeout(finish, 120);
    }
    requestAnimationFrame(tick);
    $('.ld-skip', el).addEventListener('click', finish);
    doc.addEventListener('keydown', function (e) { if (e.key === 'Escape') finish(); });
  })();

  /* ---------- 2. cursor labels (View, Play, Open) ---------- */
  (function cursorLabels() {
    if (!FINE || RM) return;
    $$('.rail-card, .work-item').forEach(function (e) { if (!e.hasAttribute('data-cursor')) e.setAttribute('data-cursor', 'View'); });
    $$('.work-head').forEach(function (e) { if (!e.hasAttribute('data-cursor')) e.setAttribute('data-cursor', 'Open'); });
    doc.addEventListener('mouseover', function (e) {
      var ring = $('#cursorRing'); if (!ring) return;
      var t = e.target.closest && e.target.closest('[data-cursor]');
      if (t) { ring.dataset.label = t.getAttribute('data-cursor'); ring.classList.add('label'); doc.body.classList.add('has-label'); }
      else { ring.classList.remove('label'); doc.body.classList.remove('has-label'); }
    });
  })();

  /* ---------- 3. scroll progress hairline ---------- */
  (function progress() {
    if (RM) return;
    var b = doc.createElement('div'); b.id = 'scrollBar'; b.setAttribute('aria-hidden', 'true'); doc.body.appendChild(b);
    var q = false;
    function upd() { q = false; var h = html.scrollHeight - innerHeight; b.style.transform = 'scaleX(' + (h > 0 ? Math.min(1, scrollY / h) : 0) + ')'; }
    addEventListener('scroll', function () { if (!q) { q = true; requestAnimationFrame(upd); } }, { passive: true });
    upd();
  })();

  /* ---------- 4. project rail ---------- */
  var rail = $('#rail');
  if (rail) {
    var viewport = $('.rail-viewport', rail), track = $('.rail-track', rail), cards = $$('.rail-card', rail);

    // video: attach the source only when a card is near the screen, play only the one in view
    function src(v) {
      if (v.dataset.ready) return; v.dataset.ready = '1';
      var webm = v.getAttribute('data-webm'), mp4 = v.getAttribute('data-mp4');
      v.src = (webm && v.canPlayType('video/webm; codecs="vp9"')) ? webm : mp4; v.load();
    }
    cards.forEach(function (c) {
      var v = $('video', c); if (!v) return;
      v.muted = true; v.loop = true; v.setAttribute('playsinline', '');
      c.addEventListener('mouseenter', function () { if (RM || SAVE) return; src(v); var p = v.play(); if (p && p.catch) p.catch(function () {}); });
      c.addEventListener('mouseleave', function () { v.pause(); });
      c.addEventListener('focusin', function () { if (RM || SAVE) return; src(v); var p = v.play(); if (p && p.catch) p.catch(function () {}); });
      c.addEventListener('focusout', function () { v.pause(); });
    });
    if ('IntersectionObserver' in window && !RM && !SAVE) {
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (en) {
          var v = $('video', en.target); if (!v) return;
          if (en.isIntersecting) { src(v); if (!FINE) { var p = v.play(); if (p && p.catch) p.catch(function () {}); } }
          else if (!FINE) v.pause();
        });
      }, { threshold: 0.55, rootMargin: '0px 300px 0px 300px' });
      cards.forEach(function (c) { io.observe(c); });
    }

    // split characters of the heading, rise in on view
    var title = $('.rail-title', rail);
    if (title && HAS_GSAP && !RM) {
      var walk = function (node) {
        Array.prototype.slice.call(node.childNodes).forEach(function (c) {
          if (c.nodeType === 3) {
            var frag = doc.createDocumentFragment();
            c.textContent.split(/(\s+)/).forEach(function (part) {
              if (!part) return;
              if (/^\s+$/.test(part)) { frag.appendChild(doc.createTextNode(' ')); return; }
              var w = doc.createElement('span'); w.style.cssText = 'display:inline-block; overflow:hidden; vertical-align:top; padding-bottom:0.12em; margin-bottom:-0.12em;';
              part.split('').forEach(function (ch) { var s = doc.createElement('span'); s.className = 'ch'; s.textContent = ch; w.appendChild(s); });
              frag.appendChild(w);
            });
            node.replaceChild(frag, c);
          } else if (c.nodeType === 1) walk(c);
        });
      };
      var label = title.textContent; title.setAttribute('aria-label', label); walk(title);
      $$('span', title).forEach(function (s) { s.setAttribute('aria-hidden', 'true'); });
      gsap.set($$('.ch', title), { yPercent: 115 });
      ScrollTrigger.create({ trigger: title, start: 'top 88%', once: true, onEnter: function () { gsap.to($$('.ch', title), { yPercent: 0, duration: 1.1, ease: 'power4.out', stagger: 0.025 }); } });
    }

    // pin and scrub sideways on desktop; native swipe scroller everywhere else
    if (HAS_GSAP && !RM) {
      var mm = gsap.matchMedia();
      mm.add('(min-width: 1000px) and (hover: hover)', function () {
        rail.classList.add('is-pinned');
        var fill = $('.rail-progress .bar i', rail), cnt = $('.rail-progress .cnt', rail);
        var dist = function () { return Math.max(0, track.scrollWidth - innerWidth + 48); };
        var tw = gsap.to(track, {
          x: function () { return -dist(); }, ease: 'none',
          scrollTrigger: {
            trigger: rail, start: 'top top', end: function () { return '+=' + dist(); }, pin: true, scrub: 0.7, invalidateOnRefresh: true, anticipatePin: 1,
            onUpdate: function (s) { if (fill) fill.style.transform = 'scaleX(' + s.progress + ')'; if (cnt) cnt.textContent = String(Math.min(cards.length, 1 + Math.round(s.progress * (cards.length - 1)))).padStart(2, '0') + ' / ' + String(cards.length).padStart(2, '0'); }
          }
        });
        return function () { rail.classList.remove('is-pinned'); if (tw.scrollTrigger) tw.scrollTrigger.kill(); gsap.set(track, { clearProps: 'transform' }); };
      });
    }
  }

  /* ---------- 5. statement: words light up with scroll ---------- */
  var st = $('[data-statement]');
  if (st) {
    var hl = (st.getAttribute('data-hl') || '').split(',').map(function (x) { return x.trim().toLowerCase(); });
    var words = st.textContent.trim().split(/\s+/);
    st.setAttribute('aria-label', st.textContent.trim());
    st.innerHTML = words.map(function (w) { var k = w.replace(/[^\w]/g, '').toLowerCase(); return '<span class="w' + (hl.indexOf(k) > -1 ? ' hl' : '') + '" aria-hidden="true">' + w + '</span>'; }).join(' ');
    if (HAS_GSAP && !RM) {
      gsap.to($$('.w', st), { opacity: 1, ease: 'none', stagger: 0.12, scrollTrigger: { trigger: st, start: 'top 82%', end: 'bottom 50%', scrub: 0.5 } });
    } else { $$('.w', st).forEach(function (w) { w.style.opacity = 1; }); }
  }

  addEventListener('load', function () { if (HAS_GSAP) ScrollTrigger.refresh(); });
  setTimeout(endLoading, 6000); // failsafe: never leave the hero paused
})();
