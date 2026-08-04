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

  /* nav appears once the hero is behind you */
  var nav = document.querySelector('[data-nav]');
  if (nav) {
    var tick = false;
    addEventListener('scroll', function () {
      if (tick) { return; }
      tick = true;
      requestAnimationFrame(function () {
        nav.classList.toggle('on', scrollY > innerHeight * 0.8);
        tick = false;
      });
    }, { passive: true });
  }

  /* staggered reveals */
  $('[data-stagger] .reveal').forEach(function (el, i) {
    el.style.transitionDelay = (i % 6) * 90 + 'ms';
  });
  watch($('.reveal'), { rootMargin: '0px 0px -10% 0px', threshold: .1 },
    function (el, hit, io) { if (hit) { el.classList.add('on'); io && io.unobserve(el); } });

  /* sticky sequence: light each item as it crosses */
  watch($('.seq li'), { rootMargin: '-22% 0px -32% 0px' },
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

  /* seat meter */
  var seats = document.querySelector('.seats');
  if (seats) {
    var total = +seats.dataset.total || 30;
    var taken = Math.min(+seats.dataset.taken || 0, total);
    var label = seats.querySelector('strong b');
    var box = seats.lastElementChild;
    if (label) { label.textContent = taken; }

    for (var i = 0; i < total; i++) { box.appendChild(document.createElement('i')); }
    box.setAttribute('role', 'img');
    box.setAttribute('aria-label', taken + ' of ' + total + ' seats taken');

    watch([seats], { threshold: .4 }, function (el, hit, io) {
      if (!hit) { return; }
      io && io.disconnect();
      $('i', box).slice(0, taken).forEach(function (d, n) {
        setTimeout(function () { d.classList.add('on'); }, still ? 0 : n * 45);
      });
    });
  }

  /* one FAQ answer open at a time */
  var faqs = $('.faq details');
  faqs.forEach(function (d) {
    d.addEventListener('toggle', function () {
      if (d.open) { faqs.forEach(function (o) { if (o !== d) { o.open = false; } }); }
    });
  });
})();
