/* Sthira — progressive enhancement only. The page is fully readable without this file. */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var canObserve = 'IntersectionObserver' in window;

  /* ---- seat meter: build the dots from data-taken / data-total ---- */
  function buildSeatMeter() {
    var meter = document.querySelector('.seatmeter');
    if (!meter) { return; }

    var total = parseInt(meter.getAttribute('data-total'), 10) || 30;
    var taken = parseInt(meter.getAttribute('data-taken'), 10) || 0;
    if (taken > total) { taken = total; }

    var dots = meter.querySelector('.seatmeter__dots');
    var label = meter.querySelector('.seatmeter__taken');
    if (label) { label.textContent = String(taken); }
    if (!dots) { return; }

    var frag = document.createDocumentFragment();
    for (var i = 0; i < total; i++) {
      var dot = document.createElement('span');
      dot.className = 'seatmeter__dot' + (i < taken ? ' is-taken' : '');
      frag.appendChild(dot);
    }
    dots.appendChild(frag);
    dots.setAttribute('aria-label', taken + ' of ' + total + ' seats taken');
  }

  /* ---- counters: count up once, when scrolled into view ---- */
  function countUp(el) {
    var target = parseInt(el.getAttribute('data-to'), 10);
    if (isNaN(target)) { return; }
    if (reduced || target === 0) { el.textContent = String(target); return; }

    var duration = 900;
    var start = null;

    function frame(now) {
      if (start === null) { start = now; }
      var p = Math.min((now - start) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = String(Math.round(target * eased));
      if (p < 1) { requestAnimationFrame(frame); }
    }
    requestAnimationFrame(frame);
  }

  function initCounters() {
    var counters = document.querySelectorAll('.counter');
    if (!counters.length) { return; }

    if (!canObserve) {
      Array.prototype.forEach.call(counters, function (el) {
        el.textContent = el.getAttribute('data-to') || el.textContent;
      });
      return;
    }

    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) { return; }
        countUp(entry.target);
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.6 });

    Array.prototype.forEach.call(counters, function (el) { obs.observe(el); });
  }

  /* ---- scroll reveal ---- */
  function initReveal() {
    var items = document.querySelectorAll('.reveal');
    if (!items.length) { return; }

    if (reduced || !canObserve) {
      Array.prototype.forEach.call(items, function (el) { el.classList.add('is-in'); });
      return;
    }

    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) { return; }
        entry.target.classList.add('is-in');
        obs.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    Array.prototype.forEach.call(items, function (el, i) {
      el.style.transitionDelay = Math.min(i % 6, 5) * 55 + 'ms';
      obs.observe(el);
    });
  }

  /* ---- FAQ: only one answer open at a time ---- */
  function initFaq() {
    var items = document.querySelectorAll('.faq__item');
    Array.prototype.forEach.call(items, function (item) {
      item.addEventListener('toggle', function () {
        if (!item.open) { return; }
        Array.prototype.forEach.call(items, function (other) {
          if (other !== item) { other.open = false; }
        });
      });
    });
  }

  buildSeatMeter();
  initCounters();
  initReveal();
  initFaq();
})();
