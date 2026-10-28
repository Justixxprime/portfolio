/* notes-live.js (batch 04). Notes index and articles.
   Adds: staggered reveals (IntersectionObserver), a sliding highlight bar on the index, and a reading progress bar.
   Without JavaScript the pages read in full. */
(function () {
  'use strict';
  var doc = document;
  var RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var FINE = window.matchMedia('(hover:hover) and (pointer:fine)').matches;
  function $(s, r) { return (r || doc).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || doc).querySelectorAll(s)); }

  /* ----- reveals: one orchestrated moment per group ----- */
  var groups = [];
  var hero = $('.nx-hero .wrap');
  if (hero) groups.push($$('.nx-kicker, .nx-title, .nx-intro', hero));
  var feat = $('.nx-feature'); if (feat) groups.push([feat]);
  var list = $('[data-nx-list]'); if (list) groups.push($$('.nx-item', list));
  var close = $('.nx-close .wrap'); if (close) groups.push($$('.nx-close-title, .nx-close p, .nx-close-links', close));
  var head = $('.na-head .wrap'); if (head) groups.push($$('.section-label, .na-title, .na-meta', head));
  var pull = $$('.na-pull'); if (pull.length) groups.push(pull);
  groups.forEach(function (g) { g.forEach(function (n, i) { n.setAttribute('data-nr', ''); n.style.setProperty('--nd', i); }); });
  var all = [].concat.apply([], groups);
  if (RM || !('IntersectionObserver' in window)) all.forEach(function (n) { n.classList.add('is-in'); });
  else {
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } }); }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    all.forEach(function (n) { io.observe(n); });
  }

  /* ----- index: sliding highlight bar (mouse only; touch gets the stacked version) ----- */
  if (list && FINE && !RM) {
    var bar = doc.createElement('span'); bar.className = 'nx-bar'; bar.setAttribute('aria-hidden', 'true'); list.insertBefore(bar, list.firstChild);
    list.classList.add('has-bar');
    function move(item) {
      var lr = list.getBoundingClientRect(), r = item.getBoundingClientRect();
      bar.style.setProperty('--by', (r.top - lr.top) + 'px'); bar.style.setProperty('--bh', r.height + 'px');
    }
    $$('.nx-item', list).forEach(function (item) {
      item.addEventListener('mouseenter', function () { move(item); });
      item.addEventListener('focusin', function () { move(item); });
      /* the row grows when its excerpt opens, so follow it for a moment */
      var t = null;
      function follow() { var n = 0; clearInterval(t); t = setInterval(function () { move(item); if (++n > 16) clearInterval(t); }, 32); }
      item.addEventListener('mouseenter', follow); item.addEventListener('focusin', follow);
    });
  }

  /* ----- article: reading progress ----- */
  var prog = $('.na-progress'), body = $('.note-body');
  if (prog && body) {
    var fill = $('i', prog), ticking = false;
    function upd() {
      ticking = false;
      var r = body.getBoundingClientRect(), vh = window.innerHeight;
      var p = Math.min(1, Math.max(0, (vh * 0.2 - r.top) / Math.max(1, r.height - vh * 0.4)));
      prog.style.setProperty('--p', p.toFixed(4));
    }
    window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(upd); } }, { passive: true });
    window.addEventListener('resize', upd); upd();
  }
})();
