/* header.js (batch 04). Shared on every page.
   Opens and closes the pages panel in the header.
   Desktop: hover (120ms intent delay, 250ms grace on leaving), focus, click or Enter. Escape closes and returns focus to the trigger.
   Touch and small screens: tap. The panel becomes a full screen menu with a focus trap and a locked page behind it.
   Without JavaScript the panel is a plain list under the header (see header.css). */
(function () {
  'use strict';
  var doc = document, html = doc.documentElement;
  var hdr = doc.getElementById('siteHeader');
  var trigger = doc.getElementById('hdTrigger');
  var panel = doc.getElementById('hdPanel');
  if (!hdr || !trigger || !panel) return;

  var RM = window.matchMedia('(prefers-reduced-motion: reduce)');
  var MOBILE = window.matchMedia('(max-width: 899px)');
  var label = trigger.querySelector('[data-hd-label]');
  var scrim = doc.createElement('div'); scrim.className = 'hd-scrim'; scrim.setAttribute('aria-hidden', 'true');
  hdr.parentNode.insertBefore(scrim, hdr.nextSibling);

  var isOpen = false, pinned = false, silent = false, openT = 0, closeT = 0, endT = 0, inerted = [];

  /* ---------- scrolled state (never hides the header) ---------- */
  var ticking = false;
  function onScroll() {
    if (ticking) return; ticking = true;
    requestAnimationFrame(function () { ticking = false; hdr.classList.toggle('is-scrolled', window.scrollY > 8); });
  }
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

  /* ---------- previews: show the card of the page under the pointer or focus ---------- */
  var cards = Array.prototype.slice.call(panel.querySelectorAll('[data-hd-card]'));
  var pageLinks = Array.prototype.slice.call(panel.querySelectorAll('[data-hd-page]'));
  var curIdx = Math.max(0, pageLinks.findIndex(function (a) { return a.hasAttribute('aria-current'); }));
  function showCard(i) { cards.forEach(function (c, k) { c.classList.toggle('is-on', k === i); }); }
  pageLinks.forEach(function (a, i) {
    a.addEventListener('mouseenter', function () { showCard(i); });
    a.addEventListener('focus', function () { showCard(i); });
  });
  panel.addEventListener('mouseleave', function () { showCard(curIdx); });
  showCard(curIdx);

  /* ---------- open and close ---------- */
  function lockPage(on) {
    if (on) {
      html.classList.add('hd-lock');
      Array.prototype.forEach.call(doc.body.children, function (c) {
        if (c === hdr || c.tagName === 'SCRIPT' || c.classList.contains('hd-scrim') || c.hasAttribute('inert')) return;
        c.setAttribute('inert', ''); inerted.push(c);
      });
      panel.setAttribute('role', 'dialog'); panel.setAttribute('aria-modal', 'true');
    } else {
      html.classList.remove('hd-lock');
      inerted.forEach(function (c) { c.removeAttribute('inert'); }); inerted = [];
      panel.removeAttribute('role'); panel.removeAttribute('aria-modal');
    }
    window.dispatchEvent(new CustomEvent('hd-lock', { detail: { lock: on } }));
  }

  function open(pin) {
    clearTimeout(openT); clearTimeout(closeT); clearTimeout(endT);
    if (pin) pinned = true;
    if (isOpen) return;
    isOpen = true;
    panel.classList.add('is-active');
    void panel.offsetHeight;                           // let the browser see the closed state first
    requestAnimationFrame(function () { panel.classList.add('is-open'); });
    hdr.classList.add('is-open'); trigger.setAttribute('aria-expanded', 'true');
    if (label) label.textContent = 'Close';
    if (MOBILE.matches) { lockPage(true); scrim.classList.remove('is-on'); }
    else scrim.classList.add('is-on');
    showCard(curIdx);
  }

  function close(opts) {
    opts = opts || {};
    clearTimeout(openT); clearTimeout(closeT);
    if (!isOpen) return;
    isOpen = false; pinned = false;
    panel.classList.remove('is-open'); hdr.classList.remove('is-open'); scrim.classList.remove('is-on');
    trigger.setAttribute('aria-expanded', 'false');
    if (label) label.textContent = 'Menu';
    if (inerted.length || html.classList.contains('hd-lock')) lockPage(false);
    var wait = RM.matches ? 0 : 620;
    clearTimeout(endT);
    endT = setTimeout(function () { if (!isOpen) panel.classList.remove('is-active'); }, wait);
    if (opts.focus) { silent = true; trigger.focus(); silent = false; }
  }

  function scheduleOpen() { clearTimeout(closeT); clearTimeout(openT); if (!isOpen) openT = setTimeout(function () { open(false); }, 120); }
  function scheduleClose() { clearTimeout(openT); clearTimeout(closeT); if (isOpen && !pinned) closeT = setTimeout(function () { close(); }, 250); }

  /* ---------- pointer (mouse only: touch and pen use the click) ---------- */
  function isMouse(e) { return !e.pointerType || e.pointerType === 'mouse'; }
  trigger.addEventListener('pointerenter', function (e) { if (isMouse(e) && !MOBILE.matches) scheduleOpen(); });
  trigger.addEventListener('pointerleave', function (e) { if (isMouse(e)) clearTimeout(openT); });
  hdr.addEventListener('pointerenter', function (e) { if (isMouse(e)) clearTimeout(closeT); });
  hdr.addEventListener('pointerleave', function (e) { if (isMouse(e) && !MOBILE.matches) scheduleClose(); });
  scrim.addEventListener('pointerenter', function (e) { if (isMouse(e)) scheduleClose(); });
  scrim.addEventListener('click', function () { close({ focus: false }); });

  /* ---------- click, keyboard ---------- */
  trigger.addEventListener('click', function () {
    if (!isOpen) open(true);
    else if (!pinned) { pinned = true; clearTimeout(closeT); }       // opened by hover: a click keeps it open
    else close({ focus: true });
  });
  trigger.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowDown' && !isOpen) { e.preventDefault(); open(true); }
  });
  /* keyboard focus on the trigger opens the panel, so Tab leads straight into it */
  trigger.addEventListener('focus', function () {
    if (isOpen || MOBILE.matches || silent) return;
    var kb = false; try { kb = trigger.matches(':focus-visible'); } catch (err) {}
    if (kb) open(true);
  });
  doc.addEventListener('keydown', function (e) {
    if (!isOpen) return;
    if (e.key === 'Escape') {
      if (doc.getElementById('sxIndex') && doc.getElementById('sxIndex').classList.contains('is-open')) return;
      e.preventDefault(); close({ focus: true }); return;
    }
    if (e.key === 'Tab' && MOBILE.matches) {                         // true dialog: keep focus inside
      var f = Array.prototype.slice.call(hdr.querySelectorAll('a[href], button:not([disabled])')).filter(function (n) { return n.offsetParent !== null; });
      if (!f.length) return; var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && doc.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && doc.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  }, true);

  /* focus leaving the header closes the desktop panel */
  hdr.addEventListener('focusout', function (e) {
    if (!isOpen || MOBILE.matches) return;
    var to = e.relatedTarget; if (!to) return;
    if (!hdr.contains(to)) close();
  });

  /* choosing a link, the index, or search closes the panel first (capture, so it runs before the next dialog opens) */
  panel.addEventListener('click', function (e) {
    var t = e.target.closest ? e.target.closest('a[href], [data-open-index], [data-cmdk-open]') : null;
    if (t) close();
  }, true);

  /* resizing across the breakpoint resets everything */
  var lastMobile = MOBILE.matches;
  window.addEventListener('resize', function () {
    if (MOBILE.matches !== lastMobile) { lastMobile = MOBILE.matches; if (isOpen) close(); }
  });
  window.addEventListener('pageshow', function () { if (isOpen) close(); });
})();
