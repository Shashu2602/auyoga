/* Sthira — enhancement only. The page reads fully with this file blocked. */
(function () {
  'use strict';

  var still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  function watch(els, opts, fn) {
    if (still || !window.IntersectionObserver) { els.forEach(function (el) { fn(el, true); }); return; }
    var io = new IntersectionObserver(function (rows) {
      rows.forEach(function (r) { fn(r.target, r.isIntersecting, io); });
    }, opts);
    els.forEach(function (el) { io.observe(el); });
  }

  /* one rAF-throttled scroll pass drives nav, progress bar and hero drift */
  var nav = document.querySelector('[data-nav]');
  var bar = document.querySelector('[data-prog] i');
  var art = document.querySelector('.hero__art');
  var hero = document.querySelector('.hero');
  var lines = document.querySelector('.hero h1');
  var tick = false;

  function frame() {
    var y = scrollY;
    var vh = innerHeight;

    if (nav) { nav.classList.toggle('on', y > vh * 0.8); }

    if (bar) {
      var span = document.documentElement.scrollHeight - vh;
      bar.style.transform = 'scaleX(' + (span > 0 ? Math.min(y / span, 1) : 0) + ')';
    }

    if (!still && hero && y < vh * 1.2) {
      var p = y / vh;
      if (art) { art.style.transform = 'translateY(' + (y * 0.22) + 'px)'; }
      if (lines) {
        lines.style.transform = 'translateY(' + (y * -0.06) + 'px)';
        lines.style.opacity = Math.max(1 - p * 1.25, 0);
      }
    }
    tick = false;
  }

  addEventListener('scroll', function () {
    if (tick) { return; }
    tick = true;
    requestAnimationFrame(frame);
  }, { passive: true });
  frame();

  /* staggered reveals */
  $('[data-stagger] .reveal').forEach(function (el, i) {
    el.style.transitionDelay = (i % 6) * 90 + 'ms';
  });
  watch($('.reveal'), { rootMargin: '0px 0px -10% 0px', threshold: .1 },
    function (el, hit, io) { if (hit) { el.classList.add('on'); io && io.unobserve(el); } });

  /* sticky sequence: light each item as it crosses the middle */
  watch($('.seq li'), { rootMargin: '-20% 0px -30% 0px' },
    function (el, hit) { el.classList.toggle('on', hit); });

  /* counters */
  watch($('.counter'), { threshold: .6 }, function (el, hit, io) {
    if (!hit) { return; }
    io && io.unobserve(el);
    var to = +el.dataset.to || 0;
    if (still || !to) { el.textContent = to; return; }
    var t0;
    (function step(now) {
      t0 = t0 || now;
      var p = Math.min((now - t0) / 1100, 1);
      el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3)));
      if (p < 1) { requestAnimationFrame(step); }
    })(performance.now());
  });

  /* batch-size meter: fifteen mats, filling one at a time */
  var mats = document.querySelector('[data-mats]');
  if (mats) {
    var total = +mats.dataset.mats || 15;
    var box = $('div', mats)[1];
    var label = mats.querySelector('strong b');
    if (label) { label.textContent = total; }

    if (box) {
      for (var i = 0; i < total; i++) { box.appendChild(document.createElement('i')); }
      box.setAttribute('role', 'img');
      box.setAttribute('aria-label', total + ' mats in a batch');

      watch([mats], { threshold: .4 }, function (el, hit, io) {
        if (!hit) { return; }
        io && io.disconnect();
        $('i', box).forEach(function (d, n) {
          setTimeout(function () { d.classList.add('on'); }, still ? 0 : n * 60);
        });
      });
    }
  }

  /* one FAQ answer open at a time */
  var faqs = $('.faq details');
  faqs.forEach(function (d) {
    d.addEventListener('toggle', function () {
      if (d.open) { faqs.forEach(function (o) { if (o !== d) { o.open = false; } }); }
    });
  });
})();
