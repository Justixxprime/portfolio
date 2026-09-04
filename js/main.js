// Field Notes shared behavior, cinematic revision

(function () {
  // register service worker for real installability (top level pages only,
  // registration persists site wide once the browser has seen it)
  if ('serviceWorker' in navigator && !location.pathname.includes('/projects/') && !location.pathname.includes('/notes/')) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./service-worker.js', { scope: './' }).catch(() => {});
    });
  }

  // apply saved theme before paint as much as possible
  var saved = localStorage.getItem('fn-theme') || 'dark';
  applyTheme(saved, true);

  function computeIsNight(lat, lon) {
    // simplified solar position estimate, good enough for a day/night proxy
    var now = new Date();
    var dayMs = 86400000;
    var start = new Date(now.getFullYear(), 0, 0);
    var dayOfYear = Math.floor((now - start) / dayMs);
    var decl = -23.44 * Math.cos((2 * Math.PI / 365) * (dayOfYear + 10));
    var latRad = lat * Math.PI / 180;
    var declRad = decl * Math.PI / 180;
    var cosHourAngle = -Math.tan(latRad) * Math.tan(declRad);
    cosHourAngle = Math.max(-1, Math.min(1, cosHourAngle));
    var hourAngle = Math.acos(cosHourAngle) * 180 / Math.PI;
    var daylightHours = (2 * hourAngle) / 15;
    var solarNoonUTC = 12 - (lon / 15);
    var sunriseUTC = solarNoonUTC - daylightHours / 2;
    var sunsetUTC = solarNoonUTC + daylightHours / 2;
    var utcHour = now.getUTCHours() + now.getUTCMinutes() / 60;
    return !(utcHour > sunriseUTC && utcHour < sunsetUTC);
  }

  function resolveAutoLocal(cb) {
    if (!navigator.geolocation) {
      var hr = new Date().getHours();
      cb(hr < 6 || hr >= 19);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      function (pos) {
        cb(computeIsNight(pos.coords.latitude, pos.coords.longitude));
      },
      function () {
        var hr = new Date().getHours();
        cb(hr < 6 || hr >= 19);
      },
      { timeout: 3000 }
    );
  }

  function applyTheme(mode, initial) {
    document.documentElement.setAttribute('data-fn-mode', mode);
    if (mode === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else if (mode === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    } else if (mode === 'device') {
      var prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
      document.documentElement.setAttribute('data-theme', prefersLight ? 'light' : 'dark');
    } else if (mode === 'local') {
      resolveAutoLocal(function (isNight) {
        document.documentElement.setAttribute('data-theme', isNight ? 'dark' : 'light');
      });
    }
    localStorage.setItem('fn-theme', mode);
    if (!initial) updateThemeButtons(mode);
  }

  function updateThemeButtons(mode) {
    document.querySelectorAll('[data-theme-set]').forEach(function (btn) {
      btn.classList.toggle('active', btn.getAttribute('data-theme-set') === mode);
    });
  }

  window.fnSetTheme = applyTheme;

  document.addEventListener('DOMContentLoaded', () => {
    updateThemeButtons(saved);

    document.querySelectorAll('[data-theme-set]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        applyTheme(btn.getAttribute('data-theme-set'), false);
      });
    });

    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', function () {
        if (localStorage.getItem('fn-theme') === 'device') applyTheme('device', true);
      });
    }

    // page reveal
    document.body.classList.add('pre-reveal');
    requestAnimationFrame(() => requestAnimationFrame(() => document.body.classList.remove('pre-reveal')));

    // mobile menu
    const openBtn = document.querySelector('[data-menu-open]');
    const closeBtn = document.querySelector('[data-menu-close]');
    const menu = document.getElementById('mobileMenu');
    if (openBtn && menu) openBtn.addEventListener('click', () => menu.classList.add('open'));
    if (closeBtn && menu) closeBtn.addEventListener('click', () => menu.classList.remove('open'));
    if (menu) {
      menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => menu.classList.remove('open')));
    }

    // scroll progress bar
    const bar = document.getElementById('scrollProgress');
    if (bar) {
      const update = () => {
        const h = document.documentElement;
        const scrolled = h.scrollTop;
        const height = h.scrollHeight - h.clientHeight;
        bar.style.width = height > 0 ? (scrolled / height * 100) + '%' : '0%';
      };
      document.addEventListener('scroll', update, { passive: true });
      update();
    }

    // work index accordion
    document.querySelectorAll('[data-work-toggle]').forEach(btn => {
      btn.addEventListener('click', () => {
        const item = btn.closest('.work-item');
        const wasOpen = item.classList.contains('open');
        item.parentElement.querySelectorAll('.work-item.open').forEach(i => i.classList.remove('open'));
        if (!wasOpen) item.classList.add('open');
      });
    });
    const firstWork = document.querySelector('.work-item');
    if (firstWork) firstWork.classList.add('open');

    // testimonial rotator
    const slides = document.querySelectorAll('.testi-slide');
    const dots = document.querySelectorAll('.testi-dot');
    if (slides.length) {
      let active = 0;
      const show = (i) => {
        slides.forEach((s, idx) => s.classList.toggle('active', idx === i));
        dots.forEach((d, idx) => d.classList.toggle('active', idx === i));
        active = i;
      };
      dots.forEach((d, idx) => d.addEventListener('click', () => show(idx)));
      setInterval(() => {
        if (!document.querySelector('.testi-stage:hover')) show((active + 1) % slides.length);
      }, 7000);
    }

    // work filters (archive page)
    const filterBtns = document.querySelectorAll('[data-filter]');
    if (filterBtns.length) {
      filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          filterBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          const cat = btn.getAttribute('data-filter');
          document.querySelectorAll('[data-category]').forEach(item => {
            const show = cat === 'all' || item.getAttribute('data-category').includes(cat);
            item.style.display = show ? '' : 'none';
          });
        });
      });
    }

    // nav dropdown, click to open on touch, hover on desktop (css handles hover)
    document.querySelectorAll('.nav-item-dropdown > a').forEach(trigger => {
      trigger.addEventListener('click', (e) => {
        if (window.matchMedia('(hover: none)').matches) {
          e.preventDefault();
          trigger.closest('.nav-item-dropdown').classList.toggle('open');
        }
      });
    });

    // scroll reveal
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15 });
      document.querySelectorAll('[data-reveal]').forEach(el => io.observe(el));
    } else {
      document.querySelectorAll('[data-reveal]').forEach(el => el.classList.add('in-view'));
    }

    // custom cursor, desktop with hover support only
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      const dot = document.createElement('div');
      dot.id = 'cursorDot';
      const ring = document.createElement('div');
      ring.id = 'cursorRing';
      document.body.appendChild(dot);
      document.body.appendChild(ring);
      document.body.classList.add('cursor-ready');

      let mx = 0, my = 0, rx = 0, ry = 0;
      document.addEventListener('mousemove', (e) => {
        mx = e.clientX; my = e.clientY;
        dot.style.left = mx + 'px'; dot.style.top = my + 'px';
      });
      function loop() {
        rx += (mx - rx) * 0.18;
        ry += (my - ry) * 0.18;
        ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
        requestAnimationFrame(loop);
      }
      loop();

      document.querySelectorAll('a, button, [data-magnetic]').forEach(el => {
        el.addEventListener('mouseenter', () => ring.classList.add('hover'));
        el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
      });

      // magnetic buttons
      document.querySelectorAll('[data-magnetic]').forEach(el => {
        el.addEventListener('mousemove', (e) => {
          const r = el.getBoundingClientRect();
          const relX = e.clientX - r.left - r.width / 2;
          const relY = e.clientY - r.top - r.height / 2;
          el.style.transform = `translate(${relX * 0.25}px, ${relY * 0.35}px)`;
        });
        el.addEventListener('mouseleave', () => { el.style.transform = ''; });
      });
    }
  });
})();
