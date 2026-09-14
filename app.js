/* auyoga — enhancement only. The page reads fully with this file blocked. */
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
  var floatMsg = document.querySelector('[data-float-msg]');
  var tick = false;

  function frame() {
    var y = scrollY;
    var vh = innerHeight;

    if (nav) { nav.classList.toggle('on', y > vh * 0.8); }
    if (floatMsg) { floatMsg.classList.toggle('on', y > vh * 0.4); }

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
    var suffix = el.dataset.suffix || '';
    if (still || !to) { el.textContent = to + suffix; return; }
    var t0;
    (function step(now) {
      t0 = t0 || now;
      var p = Math.min((now - t0) / 1100, 1);
      el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3))) + suffix;
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

  /* batch timings in the visitor's own time zone. Classes run on IST, which is
     UTC+5:30 all year (India has no daylight saving), so one fixed offset converts them. */
  var tz = document.querySelector('[data-tz]');
  if (tz && window.Intl && Intl.DateTimeFormat.prototype.formatToParts) { localTimes(tz); }

  function localTimes(tz) {
    var IST = 330 * 6e4;
    var KEY = 'auyoga-tz';
    var DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var RENAMED = { Calcutta: 'Kolkata', Katmandu: 'Kathmandu', Saigon: 'Ho Chi Minh', Kiev: 'Kyiv',
                    Rangoon: 'Yangon', 'Sao Paulo': 'São Paulo', 'St Johns': 'St John\'s' };
    var REGION = { America: 'Americas', Indian: 'Indian Ocean' };
    var pick = tz.querySelector('select');
    var same = tz.querySelector('output');
    var slots = $('.slot').map(function (el) {
      return { at: $('time', el).map(function (t) { return t.getAttribute('datetime'); }),
               out: el.querySelector('[data-local]') };
    }).filter(function (s) { return s.at.length === 2 && s.out; });
    if (!pick || !slots.length) { return; }

    function ok(z) {
      try { return !!z && !!new Intl.DateTimeFormat('en-US', { timeZone: z }); } catch (e) { return false; }
    }
    function names(z) {   /* 'America/Argentina/Buenos_Aires' → ['Argentina', 'Buenos Aires'] */
      var p = z.split('/');
      return (p.length > 1 ? p.slice(1) : p).map(function (s) {
        s = s.replace(/_/g, ' ');
        return RENAMED[s] || s;
      });
    }

    /* "HH:MM" on today's date in India → what the wall clock reads in the picked zone */
    function there(hm, fmt) {
      var now = new Date(Date.now() + IST);
      var day = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
      var p = hm.split(':');
      var o = {};
      fmt.formatToParts(new Date(day + (p[0] * 60 + +p[1]) * 6e4 - IST))
        .forEach(function (x) { o[x.type] = +x.value; });
      return { h: o.hour % 24, m: o.minute,
               shift: Math.round((Date.UTC(o.year, o.month - 1, o.day) - day) / 864e5) };
    }
    function clock(t) { return (t.h % 12 || 12) + ':' + (t.m < 10 ? '0' : '') + t.m; }
    function half(t) {
      if (!t.m && t.h === 12) { return 'noon'; }
      if (!t.m && !t.h) { return 'midnight'; }
      return t.h < 12 ? 'am' : 'pm';
    }
    function range(a, b) {   /* '10:30 – 11:30 pm', '11:30 pm – 12:30 am', '11:00 – 12:00 noon' */
      var x = half(a), y = half(b);
      var one = x === y || (x === 'am' && y === 'noon') || (x === 'pm' && y === 'midnight');
      return clock(a) + (one ? '' : ' ' + x) + ' – ' + clock(b) + ' ' + y;
    }
    function week(shift) {   /* classes are Monday to Saturday in India */
      var d = function (n) { return DAYS[(n + shift + 7) % 7]; };
      return d(1) + ' to ' + d(6) + (shift ? ' (Monday to Saturday in India)' : '');
    }

    function show(zone) {
      var fmt = new Intl.DateTimeFormat('en-US', { timeZone: zone, hour12: false,
        year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' });
      var city = names(zone).pop();
      var all = true;
      slots.forEach(function (s) {
        var a = there(s.at[0], fmt), b = there(s.at[1], fmt);
        var p = s.at[0].split(':');
        var equal = !a.shift && a.h === +p[0] && a.m === +p[1];
        all = all && equal;
        s.out.hidden = equal;
        if (equal) { return; }
        var f = s.out.children;
        f[0].textContent = city + ' time';
        f[1].textContent = range(a, b);
        f[2].textContent = week(a.shift);
      });
      if (same) { same.hidden = !all; }
    }

    var list = Intl.supportedValuesOf ? Intl.supportedValuesOf('timeZone') : [];
    var saved;
    try { saved = localStorage.getItem(KEY); } catch (e) {}
    var start = [saved, Intl.DateTimeFormat().resolvedOptions().timeZone, 'Asia/Kolkata'].filter(ok)[0];
    /* spell it the way this browser's own list does ('Asia/Kolkata' vs 'Asia/Calcutta') */
    start = new Intl.DateTimeFormat('en-US', { timeZone: start }).resolvedOptions().timeZone;
    if (list.indexOf(start) < 0) { list = list.concat(start); }

    var groups = {};
    list.forEach(function (z) {
      var region = z.indexOf('/') < 0 ? 'Other' : z.split('/')[0];
      if (!groups[region]) {
        groups[region] = document.createElement('optgroup');
        groups[region].label = REGION[region] || region;
        pick.appendChild(groups[region]);
      }
      groups[region].appendChild(new Option(names(z).join(' / '), z));
    });

    pick.value = start;
    pick.addEventListener('change', function () {
      show(pick.value);
      try { localStorage.setItem(KEY, pick.value); } catch (e) {}
    });
    show(start);
    tz.hidden = false;
  }
})();
