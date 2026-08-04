/* Sthira — progressive enhancement only.
   Every word on the page is readable with this file blocked. */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var canObserve = 'IntersectionObserver' in window;

  /* ---------- scroll progress bar + hero parallax + sticky nav ---------- */
  function initScroll() {
    var bar = document.querySelector('.progress__bar');
    var nav = document.querySelector('[data-nav]');
    var hero = document.querySelector('.hero');
    var ticking = false;

    function onScroll() {
      var y = window.scrollY || document.documentElement.scrollTop;
      var max = document.documentElement.scrollHeight - window.innerHeight;

      if (bar) {
        bar.style.width = (max > 0 ? (y / max) * 100 : 0).toFixed(2) + '%';
      }

      if (hero && !reduced) {
        var h = hero.offsetHeight || 1;
        hero.style.setProperty('--sy', Math.min(y / h, 1).toFixed(3));
      }

      if (nav) {
        nav.classList.toggle('is-stuck', y > window.innerHeight * 0.75);
      }

      ticking = false;
    }

    window.addEventListener('scroll', function () {
      if (ticking) { return; }
      ticking = true;
      window.requestAnimationFrame(onScroll);
    }, { passive: true });

    onScroll();
  }

  /* ---------- reveal on scroll, with stagger inside a group ---------- */
  function initReveal() {
    var items = document.querySelectorAll('.reveal');
    if (!items.length) { return; }

    if (reduced || !canObserve) {
      Array.prototype.forEach.call(items, function (el) { el.classList.add('is-in'); });
      return;
    }

    Array.prototype.forEach.call(document.querySelectorAll('[data-stagger]'), function (group) {
      Array.prototype.forEach.call(group.querySelectorAll('.reveal'), function (el, i) {
        el.style.transitionDelay = (i * 90) + 'ms';
      });
    });

    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) { return; }
        entry.target.classList.add('is-in');
        obs.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });

    Array.prototype.forEach.call(items, function (el) { obs.observe(el); });
  }

  /* ---------- sticky sequence: light each item as it crosses ---------- */
  function initSequence() {
    var items = document.querySelectorAll('.seq__item');
    if (!items.length) { return; }

    if (reduced || !canObserve) {
      Array.prototype.forEach.call(items, function (el) { el.classList.add('is-on'); });
      return;
    }

    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        entry.target.classList.toggle('is-on', entry.isIntersecting);
      });
    }, { rootMargin: '-22% 0px -32% 0px', threshold: 0 });

    Array.prototype.forEach.call(items, function (el) { obs.observe(el); });
  }

  /* ---------- counters ---------- */
  function countUp(el) {
    var target = parseInt(el.getAttribute('data-to'), 10);
    if (isNaN(target)) { return; }
    if (reduced || target === 0) { el.textContent = String(target); return; }

    var duration = 1100;
    var start = null;

    function frame(now) {
      if (start === null) { start = now; }
      var p = Math.min((now - start) / duration, 1);
      el.textContent = String(Math.round(target * (1 - Math.pow(1 - p, 3))));
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

  /* ---------- seat meter ---------- */
  function initSeats() {
    var meter = document.querySelector('.seats');
    if (!meter) { return; }

    var total = parseInt(meter.getAttribute('data-total'), 10) || 30;
    var taken = Math.min(parseInt(meter.getAttribute('data-taken'), 10) || 0, total);

    var label = meter.querySelector('.seats__n b');
    if (label) { label.textContent = String(taken); }

    var dots = meter.querySelector('.seats__dots');
    if (!dots) { return; }

    var frag = document.createDocumentFragment();
    for (var i = 0; i < total; i++) {
      var d = document.createElement('span');
      d.className = 'seats__d';
      frag.appendChild(d);
    }
    dots.appendChild(frag);
    dots.setAttribute('role', 'img');
    dots.setAttribute('aria-label', taken + ' of ' + total + ' seats taken');

    var all = dots.children;
    if (reduced || !canObserve) {
      for (var j = 0; j < taken; j++) { all[j].classList.add('is-taken'); }
      return;
    }

    // fill them one at a time, once, when the meter scrolls into view
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) { return; }
        obs.disconnect();
        for (var k = 0; k < taken; k++) {
          (function (index) {
            setTimeout(function () { all[index].classList.add('is-taken'); }, index * 45);
          })(k);
        }
      });
    }, { threshold: 0.4 });
    obs.observe(meter);
  }

  /* ---------- FAQ: one answer open at a time ---------- */
  function initFaq() {
    var items = document.querySelectorAll('.faq__i');
    Array.prototype.forEach.call(items, function (item) {
      item.addEventListener('toggle', function () {
        if (!item.open) { return; }
        Array.prototype.forEach.call(items, function (other) {
          if (other !== item) { other.open = false; }
        });
      });
    });
  }

  initScroll();
  initReveal();
  initSequence();
  initCounters();
  initSeats();
  initFaq();
})();
