/* Showpiece layer: smooth scroll, scroll-driven motion, marquee, tilt, loader counter.
   Needs gsap, ScrollTrigger and Lenis (vendored in js/vendor). Skipped entirely under reduced motion. */
(function () {
  'use strict';
  var RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (RM || !window.gsap || !window.ScrollTrigger) return;
  var doc = document, $ = function (s, c) { return (c || doc).querySelector(s); }, $$ = function (s, c) { return Array.prototype.slice.call((c || doc).querySelectorAll(s)); };
  var FINE = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  gsap.registerPlugin(ScrollTrigger);
  doc.documentElement.classList.add('wow');

  /* ---------- Lenis smooth scroll, wired to ScrollTrigger ---------- */
  var lenis = null, vel = 0;
  if (window.Lenis) {
    lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 1, anchors: true });
    lenis.on('scroll', function (e) { vel = e.velocity; ScrollTrigger.update(); });
    gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
    gsap.ticker.lagSmoothing(0);
    window.addEventListener('hd-lock', function (e) { e.detail && e.detail.lock ? lenis.stop() : lenis.start(); });
    var lb = $('dialog.lightbox');
    if (lb) new MutationObserver(function () { lb.open ? lenis.stop() : lenis.start(); }).observe(lb, { attributes: true, attributeFilter: ['open'] });
  }

  /* ---------- hero reel scales up as you scroll ---------- */
  var heroMedia = $('.hero-media .vf-wrap');
  if (heroMedia) {
    gsap.fromTo(heroMedia, { scale: 0.86, y: 30, transformOrigin: '50% 0%' }, { scale: 1, y: 0, ease: 'none', scrollTrigger: { trigger: '.hero-media', start: 'top 98%', end: 'top 35%', scrub: 0.6 } });
  }

  /* ---------- project name marquee, speed follows scroll velocity ---------- */
  var anchor = $('#showreel');
  if (anchor) {
    var names = ['Boardly', 'Victorious Concept', 'Trackpoint', 'Cheliv Care Platform', 'SECKY', 'First Experts', 'ShelemJ', 'Stride', 'Fernhollow', 'Amani', 'Pulse'];
    var sec = doc.createElement('section'); sec.className = 'marquee'; sec.setAttribute('aria-hidden', 'true');
    var row = names.map(function (n) { return '<span>' + n + '</span><i></i>'; }).join('');
    sec.innerHTML = '<div class="marquee-track">' + row + row + '</div>';
    anchor.parentNode.insertBefore(sec, anchor);
    var track = $('.marquee-track', sec);
    var tween = gsap.to(track, { xPercent: -50, ease: 'none', duration: 38, repeat: -1 });
    gsap.ticker.add(function () { var s = 1 + Math.min(6, Math.abs(vel) * 0.35); tween.timeScale(gsap.utils.interpolate(tween.timeScale(), vel < 0 ? -s : s, 0.08)); });
  }

  /* ---------- gentle parallax on screenshots ---------- */
  $$('.shot-frame:not(.is-phone) img, .browser-frame img').forEach(function (img) {
    var host = img.closest('.shot-frame, .browser-frame'); if (!host) return;
    if (!img.parentNode.classList.contains('px-clip')) { var clip = doc.createElement('div'); clip.className = 'px-clip'; img.parentNode.insertBefore(clip, img); clip.appendChild(img); }
    gsap.fromTo(img, { yPercent: -2.5, scale: 1.05 }, { yPercent: 2.5, scale: 1.05, ease: 'none', scrollTrigger: { trigger: host, start: 'top bottom', end: 'bottom top', scrub: true } });
  });

  /* ---------- velocity skew on the video frames ---------- */
  var skewTargets = $$('.reel-frame .vf-wrap, .hero-media .vf-wrap');
  if (skewTargets.length) {
    var setters = skewTargets.map(function (t) { return gsap.quickTo(t, 'skewY', { duration: 0.5, ease: 'power3' }); });
    gsap.ticker.add(function () { var k = gsap.utils.clamp(-1.6, 1.6, vel * -0.12); setters.forEach(function (f) { f(k); }); });
  }

  /* ---------- section labels draw their rule ---------- */
  $$('.section-label .rule').forEach(function (r) {
    gsap.fromTo(r, { scaleX: 0, transformOrigin: 'left' }, { scaleX: 1, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: r, start: 'top 92%', once: true } });
  });

  /* ---------- 3D tilt on archive cards ---------- */
  if (FINE) {
    var list = $('.work-archive');
    if (list) {
      list.addEventListener('pointermove', function (e) {
        if (!list.classList.contains('view-grid')) return;
        var it = e.target.closest('.work-item'); if (!it) return; var r = it.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
        gsap.to(it, { rotateY: x * 7, rotateX: -y * 7, transformPerspective: 900, duration: 0.4, ease: 'power2.out' });
      });
      list.addEventListener('pointerout', function (e) { var it = e.target.closest('.work-item'); if (it) gsap.to(it, { rotateX: 0, rotateY: 0, duration: 0.6, ease: 'power3.out' }); });
    }
  }

  /* ---------- big headings rise out of a mask ---------- */
  /* Rebuilt on IntersectionObserver plus CSS transitions. The old version waited for scroll positions that went stale when lazy images and videos loaded, which left headings hidden behind their mask. This one cannot stay hidden: a safety net reveals any heading that is on screen. */
  var risers = [];
  $$('main h2, .page-head h1').forEach(function (h) {
    if (h.closest('.hero') || h.dataset.noSplit || h.classList.contains('rise')) return;
    var inner = doc.createElement('span'); inner.className = 'rise-inner'; while (h.firstChild) inner.appendChild(h.firstChild); h.appendChild(inner); h.classList.add('rise'); risers.push(h);
  });
  function revealVisible() { risers.forEach(function (h) { if (h.classList.contains('is-in')) return; var r = h.getBoundingClientRect(); if (r.top < innerHeight * 0.98) h.classList.add('is-in'); }); }
  if ('IntersectionObserver' in window) {
    var rio = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting || e.boundingClientRect.top < 0) { e.target.classList.add('is-in'); rio.unobserve(e.target); } }); }, { rootMargin: '0px 0px -2% 0px' });
    risers.forEach(function (h) { rio.observe(h); });
    var safety = setInterval(function () { revealVisible(); if (risers.every(function (h) { return h.classList.contains('is-in'); })) clearInterval(safety); }, 1200);
  } else { risers.forEach(function (h) { h.classList.add('is-in'); }); }

  window.addEventListener('load', function () { ScrollTrigger.refresh(); });
})();
