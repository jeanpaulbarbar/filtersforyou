 
(function () {
  'use strict';
  window.__hxReady = true;
  var doc = document.documentElement;
  doc.classList.add('hx-js');
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return [].slice.call((r || document).querySelectorAll(s)); };
  var clamp = function (v, a, b) { return v < a ? a : (v > b ? b : v); };
  var now = function () { return (window.performance && performance.now) ? performance.now() : Date.now(); };
  var easeOut = function (t) { return 1 - Math.pow(1 - t, 3); };
  var fmt = function (n) { return '$' + Math.round(n).toLocaleString('en-AU'); };
  var lenis = function () { return window.__ffyLenis || null; };
  var mod = function (a, n) { return ((a % n) + n) % n; };
  var DATA = {};
  try { DATA = JSON.parse(($('#hx-data') || {}).textContent || '{}'); } catch (e) { DATA = {}; }
  var SYS = DATA.systems || {};
  var OCT = Date.now() < Date.parse(DATA.octUntil || '2026-11-01T00:00:00+11:00');

  function scrollToY(y, dur) {
    y = Math.max(0, Math.round(y));
    var l = lenis();
    if (reduce) { if (l) l.scrollTo(y, { immediate: true, force: true }); else window.scrollTo(0, y); return; }
    if (l) l.scrollTo(y, { duration: dur || 1.05, easing: function (t) { return t === 1 ? 1 : 1 - Math.pow(2, -10 * t); } });
    else window.scrollTo({ top: y, behavior: 'smooth' });
  }
  function headerRoom() { return innerWidth < 1080 ? 82 : 96; }
  function bringIntoView(el, onlyIfBelow) {
    var r = el.getBoundingClientRect();
    if (onlyIfBelow && r.top < innerHeight * 0.62 && r.top > 40) return;
    scrollToY(r.top + scrollY - headerRoom());
  }

   
  var pending = $$('.hx-rise, .hx-pop, [data-hx-count], .hx-both');
  function reveal(el) {
    if (el.hasAttribute('data-hx-count')) return count(el);
    el.classList.add('is-in');
  }
  function scan() {
    if (!pending.length) return;
    var line = innerHeight * 0.9;
    pending = pending.filter(function (el) {
      if (!el.isConnected) return false;
      if (!el.offsetParent && el.getClientRects().length === 0) return true;
      var r = el.getBoundingClientRect();
      if (r.top < line) { reveal(el); return false; }
      return true;
    });
  }
  var scanRaf = 0;
  function queueScan() { if (!scanRaf) scanRaf = requestAnimationFrame(function () { scanRaf = 0; scan(); }); }
  if (reduce) { pending.forEach(function (el) { el.classList.add('is-in'); }); pending = []; }
  else {
    pending.forEach(function (el) { if (el.hasAttribute('data-hx-count')) el.style.visibility = 'hidden'; });
    addEventListener('scroll', queueScan, { passive: true });
    addEventListener('resize', queueScan);
    queueScan();
    setTimeout(queueScan, 600);
  }
  function count(el) {
    var to = parseFloat(el.getAttribute('data-hx-count')), from = parseFloat(el.getAttribute('data-hx-from') || '0');
    var pre = el.getAttribute('data-hx-prefix') || '', suf = el.getAttribute('data-hx-suffix') || '';
    var dur = parseFloat(el.getAttribute('data-hx-dur') || '1500');
    var show = function (v) { el.textContent = pre + Math.round(v).toLocaleString('en-AU') + suf; };
    show(from); el.style.visibility = '';
    var t0 = now() + 120;
    (function tick() {
      var p = clamp((now() - t0) / dur, 0, 1);
      show(from + (to - from) * easeOut(p));
      if (p < 1) requestAnimationFrame(tick);
    })();
  }

   
  $$('[data-hx-until]').forEach(function (el) {
    if (Date.now() < Date.parse(el.getAttribute('data-hx-until'))) el.hidden = false; else el.remove();
  });

   
  function softDetails(d) {
    var sum = d.querySelector('summary'), body = d.querySelector('.ch__a');
    if (!sum || !body || reduce || !body.animate) return;
    var anim = null;
    sum.addEventListener('click', function (e) {
      e.preventDefault();
      var opening = !d.open || d.classList.contains('is-closing');
      var start = d.open ? body.getBoundingClientRect().height : 0;
      if (anim) anim.cancel();
      d.classList.remove('is-closing');
      if (opening) {
        d.open = true;
        var end = body.scrollHeight;
        anim = body.animate([{ height: start + 'px', opacity: start ? 1 : 0 }, { height: end + 'px', opacity: 1 }], { duration: 460, easing: 'cubic-bezier(.22,1,.36,1)' });
      } else {
        d.classList.add('is-closing');
        anim = body.animate([{ height: start + 'px', opacity: 1 }, { height: '0px', opacity: 0 }], { duration: 380, easing: 'cubic-bezier(.45,0,.25,1)' });
      }
      anim.onfinish = function () { anim = null; if (!opening) { d.open = false; d.classList.remove('is-closing'); } };
    });
  }
  $$('#details details.ch').forEach(softDetails);
  var estNav = $$('#details .est__nav a');
  if (estNav.length && 'IntersectionObserver' in window) {
    var mark = function (id) { estNav.forEach(function (a) { a.classList.toggle('on', a.getAttribute('href') === '#' + id); }); };
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) mark(e.target.id); }); }, { rootMargin: '-30% 0px -60% 0px' });
    $$('#details details.ch').forEach(function (c) { io.observe(c); });
  }

   
  function morphHeight(box, change, dur) {
    if (reduce || !box.animate) { change(); return; }
    var from = box.getBoundingClientRect().height;
    change();
    var to = box.getBoundingClientRect().height;
    if (Math.abs(from - to) < 2) return;
    box.style.overflow = 'hidden';
    var a = box.animate([{ height: from + 'px' }, { height: to + 'px' }], { duration: dur || 520, easing: 'cubic-bezier(.22,1,.36,1)' });
    a.onfinish = a.oncancel = function () { box.style.overflow = ''; };
  }

   
  var find = $('#find');
  var PATH_OF = {};

   
  function Rack(panel) {
    var frame = $('.hx-rack__frame', panel), track = $('.hx-rack__track', panel);
    var real = $$('.hx-card', panel), caps = $$('.hx-cap', panel), dots = $$('.hx-dots button', panel);
    var prev = $('.hx-nav [data-step="-1"]', panel), next = $('.hx-nav [data-step="1"]', panel);
    var n = real.length, copies = Math.max(2, Math.ceil(10 / n)), m = n * copies;
    var all = real.slice();
    for (var c = 1; c < copies; c++) real.forEach(function (card) {
      var k = card.cloneNode(true);
      k.setAttribute('aria-hidden', 'true'); k.tabIndex = -1; k.removeAttribute('aria-roledescription');
      $$('img', k).forEach(function (im) { im.alt = ''; });
      track.appendChild(k); all.push(k);
    });
    var start = +panel.getAttribute('data-start') || 0;
    var pos = start, target = start, width = 0, raf = 0, last = 0, drag = null, sel = -1, moved = false, wheelT = 0;
    var api = { panel: panel, index: function () { return sel; }, goTo: goTo, measure: measure, keyAt: function (i) { return real[i].getAttribute('data-key'); }, n: n };
    function phone() { return innerWidth < 600; }
    var GAP = 22, SMALL = 0.82;
    function cfWidth() {
      var w = frame.clientWidth;
      var cf = phone() ? clamp(w * 0.56, 180, 236) : innerWidth >= 1280 ? clamp(w * 0.62, 240, 290) : clamp(w * 0.3, 220, 270);
      var fe = Math.max(36, Math.min((w - cf) / 2 - 8, Math.max(72, w * 0.24)));
      frame.style.setProperty('--cf', cf + 'px'); frame.style.setProperty('--fe', fe.toFixed(1) + 'px'); panel.style.setProperty('--cf', cf + 'px');
    }
     
    function shown(o) {
      if (n <= 2) return o < 0 ? clamp(1 + o, 0, 1) : clamp(2 - o, 0, 1);
      return clamp((n / 2 - Math.abs(o)) * 2, 0, 1);
    }
    function d1() { return width * (1 + SMALL) / 2 + GAP; }
    function d2() { return width * SMALL + GAP; }
    function xAt(o) { var a = Math.abs(o), sg = o < 0 ? -1 : 1; return sg * (Math.min(a, 1) * d1() + Math.max(a - 1, 0) * d2()); }
     
    function equalise() {
      ['.hx-cap__title', '.hx-feats', '.hx-inside', '.hx-cap__note'].forEach(function (sel) {
        var els = caps.map(function (c) { return $(sel, c); }).filter(Boolean);
        els.forEach(function (e) { e.style.minHeight = ''; });
        var h = Math.max.apply(null, els.map(function (e) { return e.offsetHeight; }));
        if (h > 0) els.forEach(function (e) { e.style.minHeight = h + 'px'; });
      });
    }
    function measure() { if (!frame.clientWidth) return; cfWidth(); width = real[0].offsetWidth; equalise(); paint(); }
    function off(j) { var o = mod(j - pos + m / 2, m) - m / 2; return o; }
    function paint() {
      if (!width) return;
      var half = frame.clientWidth / 2 + width;
      for (var j = 0; j < m; j++) {
        var o = off(j), d = Math.abs(o), x = xAt(o), sc = 1 - (1 - SMALL) * Math.min(d, 1);
        var op = shown(o), card = all[j], out = Math.abs(x) > half || op < 0.002;
        card.style.transform = 'translate3d(calc(-50% + ' + x.toFixed(2) + 'px),0,0) scale(' + sc.toFixed(4) + ')';
        card.style.opacity = op < 1 ? op.toFixed(3) : '';
        card.style.zIndex = String(100 - Math.round(d * 10));
        card.style.visibility = out ? 'hidden' : '';
        card.style.pointerEvents = out ? 'none' : '';
      }
      setSel(mod(Math.round(pos), m) % n);
    }
    function setSel(i) {
      var j0 = mod(Math.round(pos), m);
      all.forEach(function (card, j) { card.classList.toggle('is-active', j === j0); });
      if (i === sel) return;
      sel = i;
      real.forEach(function (card, k) { card.setAttribute('aria-current', k === i ? 'true' : 'false'); card.tabIndex = -1; });
      $$('details.hx-feat[open], details.hx-inc[open]', panel).forEach(function (d) { d.open = false; });
      caps.forEach(function (cap, k) { cap.classList.toggle('is-on', k === i); cap.setAttribute('aria-hidden', k === i ? 'false' : 'true'); cap.inert = k !== i; });
      dots.forEach(function (d, k) { d.setAttribute('aria-current', k === i ? 'true' : 'false'); });
    }
    function normalise() { var base = Math.floor(target / m) * m; target -= base; pos -= base; }
    function loop(t) {
      var dt = last ? Math.min(t - last, 64) : 16.7; last = t;
      var diff = target - pos;
      if (Math.abs(diff) < 0.0006) { pos = target; normalise(); paint(); raf = 0; last = 0; return; }
      pos += diff * (1 - Math.pow(1 - 0.11, dt / 16.7));
      paint();
      raf = requestAnimationFrame(loop);
    }
    function settle(t, instant) {
      target = t;
      if (instant || reduce) { pos = target; normalise(); if (raf) cancelAnimationFrame(raf); raf = 0; paint(); return; }
      if (!raf) { last = 0; raf = requestAnimationFrame(loop); }
    }
    function goTo(i, instant) {
      var cur = mod(Math.round(target), m) % n, delta = mod(i - cur, n);
      if (delta > n / 2) delta -= n;
      settle(Math.round(target) + delta, instant);
    }
    function nudge(by) { settle(Math.round(target) + by); }
    if (prev) prev.addEventListener('click', function () { nudge(-1); });
    if (next) next.addEventListener('click', function () { nudge(1); });
    dots.forEach(function (d) { d.addEventListener('click', function () { goTo(+d.getAttribute('data-go')); }); });
    frame.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { e.preventDefault(); nudge(-1); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); nudge(1); }
      else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); choose(real[sel].getAttribute('data-key'), panel.getAttribute('data-path')); }
    });
    frame.addEventListener('pointerdown', function (e) {
      if (e.button !== 0) return;
      if (raf) { cancelAnimationFrame(raf); raf = 0; }
      target = pos; moved = false;
      drag = { id: e.pointerId, x: e.clientX, y: e.clientY, pos: pos, v: 0, t: now(), cap: false };
    });
    frame.addEventListener('pointermove', function (e) {
      if (!drag || drag.id !== e.pointerId) return;
      var dx = e.clientX - drag.x;
      if (!drag.cap) {
        if (Math.abs(dx) < 6) return;
        if (Math.abs(e.clientY - drag.y) > Math.abs(dx)) { drag = null; return; }
        drag.cap = true; moved = true;
        try { frame.setPointerCapture(e.pointerId); } catch (err) {}
      }
      var pitch = d2() || 1;
      var t = now(), before = pos;
      pos = drag.pos - dx / pitch;
      drag.v = (pos - before) / Math.max(t - drag.t, 1) * 1000; drag.t = t;
      target = pos; paint();
    });
    function endDrag(e) {
      if (!drag || drag.id !== e.pointerId) return;
      var carried = clamp(drag.v * 0.16, -2, 2);
      var wasDrag = drag.cap; drag = null;
      if (wasDrag) settle(Math.round(pos + carried));
    }
    frame.addEventListener('pointerup', endDrag);
    frame.addEventListener('pointercancel', function (e) { if (drag && drag.id === e.pointerId) { drag = null; settle(Math.round(pos)); } });
    frame.addEventListener('wheel', function (e) {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY) || Math.abs(e.deltaX) < 2) return;
      e.preventDefault();
      if (raf) { cancelAnimationFrame(raf); raf = 0; }
      var pitch = d2() || 1;
      pos += e.deltaX / pitch; target = pos; paint();
      clearTimeout(wheelT); wheelT = setTimeout(function () { settle(Math.round(pos)); }, 110);
    }, { passive: false });
    all.forEach(function (card, j) {
      card.addEventListener('click', function (e) {
        if (moved) { e.preventDefault(); moved = false; return; }
        var o = Math.round(off(j));
        if (o !== 0) settle(Math.round(target) + o);
        else choose(card.getAttribute('data-key'), panel.getAttribute('data-path'));
      });
    });
    if ('ResizeObserver' in window) new ResizeObserver(function () { if (panel.classList.contains('is-on') && frame.clientWidth) measure(); }).observe(frame);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { if (panel.classList.contains('is-on')) measure(); });
    setSel(start);
    return api;
  }

  var racks = {}, stage = find && $('#hx-stage', find), setupEl = find && $('#hx-setup', find);
  var paths = find ? $$('.hx-path', find) : [];
  var chosen = null, curPath = null, add = { mixer: false, home: false, ro: false }, finish = 'gold', finishName = 'Brushed gold', plan = 'life';
  if (find) $$('.hx-panel', find).forEach(function (p) {
    racks[p.getAttribute('data-path')] = Rack(p);
    $$('.hx-card', p).forEach(function (c) { if (!c.hasAttribute('aria-hidden')) PATH_OF[c.getAttribute('data-key')] = p.getAttribute('data-path'); });
  });

  function progress(step) {
    $$('.hx-progress li', find).forEach(function (li, i) { li.classList.toggle('on', i < step); });
  }
  function setStageHeight(change) {
    var from = stage.classList.contains('is-open') ? stage.offsetHeight : 0;
    change();
    stage.style.height = 'auto';
    var to = stage.offsetHeight;
    if (reduce || from === to) { stage.style.height = ''; return; }
    stage.style.height = from + 'px';
    void stage.offsetHeight;
    stage.style.height = to + 'px';
    var done = function (e) { if (e && e.target !== stage) return; stage.style.height = ''; stage.removeEventListener('transitionend', done); };
    stage.addEventListener('transitionend', done);
    setTimeout(done, 800);
  }
  function selectPath(path, opts) {
    opts = opts || {};
    if (!racks[path]) return;
    var same = path === curPath;
    curPath = path;
    paths.forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-path') === path ? 'true' : 'false'); });
    $('.hx-paths', find).classList.add('has-choice');
    if (!same) {
      var rack = racks[path];
      $$('.hx-flip', find).forEach(function (f) { f.classList.remove('is-flipped'); });
      setStageHeight(function () {
        stage.classList.add('is-open');
        $$('.hx-panel', stage).forEach(function (p) { p.classList.toggle('is-on', p.getAttribute('data-path') === path); });
        rack.measure();
        if (opts.index != null && opts.index >= 0) rack.goTo(opts.index, true);
      });
      warm(path);
    }
    progress(chosen ? 3 : 2);
    if (!opts.noScroll) setTimeout(function () { bringIntoView($('#hx-panel-' + path), false); }, reduce ? 0 : 60);
    if (window.ffyTrack) window.ffyTrack('guide_path', { path: path });
  }
  paths.forEach(function (b) { b.addEventListener('click', function () { selectPath(b.getAttribute('data-path')); }); });
  $$('[data-hx-goto]').forEach(function (a) {
    a.addEventListener('click', function (e) { e.preventDefault(); selectPath(a.getAttribute('data-hx-goto')); });
  });

  var warmed = {};
  function warm(path) {
    if (warmed[path]) return; warmed[path] = true;
    $$('#hx-panel-' + path + ' img').forEach(function (img) { img.loading = 'eager'; if (img.decode) img.decode().catch(function () {}); });
  }
  if (find && 'IntersectionObserver' in window) {
    var near = new IntersectionObserver(function (es) {
      if (!es[0].isIntersecting) return; near.disconnect();
      warm('drink');
      var idle = window.requestIdleCallback || function (f) { return setTimeout(f, 600); };
      idle(function () { warm('home'); warm('deluxe'); }, { timeout: 3000 });
    }, { rootMargin: '0px 0px 200px 0px' });
    near.observe($('.hx-paths', find));
  }

   
  if (find) {
    var POPS = 'details.hx-feat, details.hx-inc';
    var closeAll = function (keep) { $$(POPS, find).forEach(function (o) { if (o !== keep) o.open = false; }); };
    $$(POPS, find).forEach(function (d) {
      d.addEventListener('toggle', function () {
        if (d.open) closeAll(d);
        if (d.open && window.ffyTrack) window.ffyTrack(d.classList.contains('hx-inc') ? 'guide_included' : 'guide_feature', { item: ($('b', d) || $('span', d)).textContent });
      });
      if (d.classList.contains('hx-inc') && matchMedia('(hover:hover) and (pointer:fine)').matches) {
        var t = 0;
        d.addEventListener('mouseenter', function () { clearTimeout(t); d.open = true; });
        d.addEventListener('mouseleave', function () { clearTimeout(t); t = setTimeout(function () { d.open = false; }, 160); });
        $('summary', d).addEventListener('click', function (e) { if (d.open) { e.preventDefault(); } });
      }
    });
    document.addEventListener('click', function (e) { if (!e.target.closest('.hx-feat, .hx-inc')) closeAll(null); });
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      var open = $$(POPS + '[open]', find)[0];
      if (open) { open.open = false; $('summary', open).focus(); }
    });
  }

   
  function flip(panel, on) {
    var box = $('.hx-flip', panel), front = $('.hx-flip__front', box), back = $('.hx-flip__back', box);
    var btn = $('[data-hx-compare]', panel);
    if (box.classList.contains('is-flipped') === on || box.dataset.turning) return;
    if (btn) btn.setAttribute('aria-expanded', on ? 'true' : 'false');
    var outgoing = on ? front : back, incoming = on ? back : front;
    if (reduce || !box.animate) { box.classList.toggle('is-flipped', on); return; }
    box.dataset.turning = '1';
    var h0 = box.getBoundingClientRect().height;
    var a = outgoing.animate([{ transform: 'rotateY(0deg)', opacity: 1 }, { transform: 'rotateY(' + (on ? -90 : 90) + 'deg)', opacity: .6 }], { duration: 240, easing: 'cubic-bezier(.55,0,.8,.45)' });
    a.onfinish = function () {
      box.classList.toggle('is-flipped', on);
      if (!on) racks[panel.getAttribute('data-path')].measure();
      var h1 = box.getBoundingClientRect().height;
      box.style.overflow = 'hidden';
      var hA = box.animate([{ height: h0 + 'px' }, { height: h1 + 'px' }], { duration: 560, easing: 'cubic-bezier(.22,1,.36,1)' });
      hA.onfinish = hA.oncancel = function () { box.style.overflow = ''; };
      var b = incoming.animate([{ transform: 'rotateY(' + (on ? 90 : -90) + 'deg)', opacity: .6 }, { transform: 'rotateY(0deg)', opacity: 1 }], { duration: 620, easing: 'cubic-bezier(.2,1.25,.35,1)' });
      b.onfinish = b.oncancel = function () { delete box.dataset.turning; };
      var top = panel.getBoundingClientRect().top;
      if (top < 0 || top > innerHeight * 0.4) bringIntoView(panel, false);
    };
    if (window.ffyTrack && on) window.ffyTrack('guide_compare', { path: panel.getAttribute('data-path') });
  }
  if (find) $$('.hx-panel', find).forEach(function (panel) {
    var open = $('[data-hx-compare]', panel), close = $('[data-hx-compare-close]', panel);
    if (open) open.addEventListener('click', function () { flip(panel, true); });
    if (close) close.addEventListener('click', function () { flip(panel, false); });
    $$('[data-cmp]', panel).forEach(function (b) {
      b.addEventListener('click', function () {
        var key = b.getAttribute('data-cmp'), rack = racks[panel.getAttribute('data-path')];
        flip(panel, false);
        setTimeout(function () { rack.goTo($$('.hx-card', panel).findIndex(function (c) { return c.getAttribute('data-key') === key; }), true); }, reduce ? 0 : 260);
      });
    });
    $$('.hx-cmp tbody tr', panel).forEach(function (tr, r) { $$('.hx-yes', tr).forEach(function (y) { y.style.setProperty('--r', r); }); });
  });

   
  var lines = setupEl && $('[data-hx-lines]', setupEl), totalEl = setupEl && $('[data-hx-total]', setupEl);
  var TICK = '<svg class="hx-tick" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="m3.5 8.4 2.9 2.9 6.1-6.3" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var PLAN = DATA.plan || { term: 18, ratePct: 7.5, cap: 7000, est: 80, acct: 9.95, fortnights: 39 };
  function weekly(price) {
    var cents = Math.round(price * 100), financed = Math.round(cents / (1 - PLAN.ratePct / 100));
    if (financed > Math.round(PLAN.cap * 100)) return null;
    var total = financed + Math.round(PLAN.est * 100), fortnight = Math.round(total / PLAN.fortnights);
    var payable = total + Math.round(PLAN.acct * 100) * PLAN.term;
    return { week: Math.ceil(fortnight / 200), save: Math.floor((payable - cents) / 100) };
  }
  var shownWeek = 0;
  function rollTo(el, value, pre, suf) {
    var paint = function (v) { el.innerHTML = pre + '<b>$' + Math.round(v).toLocaleString('en-AU') + '</b>' + suf; };
    if (reduce || !shownWeek) { paint(value); shownWeek = value; return; }
    var from = shownWeek, t0 = now(), dur = 600;
    shownWeek = value;
    (function tick() {
      var p = clamp((now() - t0) / dur, 0, 1);
      paint(from + (value - from) * easeOut(p));
      if (p < 1) requestAnimationFrame(tick);
    })();
  }
  var PARTNER = { home: 'essential', reserve: 'premium' };         
  var HOME_FOR = { essential: 'home', premium: 'reserve', luxe: 'reserve', flow: 'home' };
  var PACKAGE_OF = { 'home+essential': 'deluxe', 'reserve+premium': 'deluxe-reserve' };
  var addKey = { home: 'home', ro: 'premium' };
  var mine = null;   
  function kindOf(k) { return SYS[k] ? SYS[k].kind : ''; }
  function mixerAllowed() { var k = kindOf(chosen); return k === 'ro' || (k === 'home' && add.ro); }
  function setup() {
    if (!chosen) return null;
    var s = SYS[chosen], k = s.kind, items = [chosen];
    if (k === 'deluxe') {
      return { kind: k, items: items, total: s.price, from: true, save: 0, mixer: true, free: s.freeYear, care: { life: s.life, service: s.service, diy: s.diy } };
    }
    if ((k === 'ro' || k === 'flow') && add.home) items.push(addKey.home);
    if (k === 'home' && add.ro) items.push(addKey.ro);
    var n = items.length, total = 0, from = false, care = { life: 0, service: 0, diy: 0 };
    items.forEach(function (key) { var it = SYS[key]; total += it.price; from = from || it.from; care.life += it.life; care.service += it.service; care.diy += it.diy; });
    var save = (DATA.installOff || 200) * (n - 1), svcOff = (DATA.serviceOff || 100) * (n - 1);
    total -= save; care.life -= svcOff; care.service -= svcOff;
    var mixer = add.mixer && mixerAllowed();
    if (mixer) total += DATA.mixer.price;
    return { kind: k, items: items, total: total, from: from, save: save, mixer: mixer, care: care, free: false };
  }
  function flipAdd(k) {
    add[k] = !add[k];
    if (k === 'ro' && !add.ro) add.mixer = false;
    if (k === 'mixer' && add.mixer && kindOf(chosen) === 'home' && !add.ro) add.ro = true;   
  }
   
  function stepFor(k) {
    var keep = { mixer: add.mixer, home: add.home, ro: add.ro };
    add[k] = false; if (k === 'ro') add.mixer = false;
    if (k === 'mixer' && kindOf(chosen) === 'home') add.ro = true;
    var off = setup().total;
    add[k] = true; if (k === 'mixer' && kindOf(chosen) === 'home') add.ro = true;
    var on = setup().total;
    add = keep;
     
    var up = on - off;
    return { up: up, week: weekly(on) ? Math.ceil(up / (1 - PLAN.ratePct / 100) / (PLAN.fortnights * 2)) : 0 };
  }
  function thumbHTML(key) {
    var s = SYS[key];
    if (s.kind === 'deluxe') { var b = $('.hx-card[data-key="' + key + '"] .hx-bundle', find); return b ? b.outerHTML : ''; }
    return '<img src="' + s.img + '" alt="" width="64" height="64">';
  }
  function weekHTML(price, from) {
    var w = weekly(price);
    return w ? (from ? '<small>From</small>' : '') + '<b>$' + w.week + '</b><span>a week</span>' : (from ? '<small>From</small>' : '') + '<b>' + fmt(price) + '</b>';
  }
  function dealFor() {
    var k = kindOf(chosen);
    if (k === 'deluxe') return chosen;
    if (k === 'home') return PACKAGE_OF[chosen + '+' + PARTNER[chosen]];
    if (k === 'ro') return PACKAGE_OF[HOME_FOR[chosen] + '+' + chosen] || PACKAGE_OF['reserve+premium'];
    return null;
  }
  function renderDeal(s) {
    var el = $('[data-hx-deal]', setupEl), pk = dealFor();
    if (!pk) { el.hidden = true; return; }
    var p = SYS[pk], inPkg = chosen === pk;
    var back = inPkg ? (mine ? mine.key : p.parts[0]) : chosen;
    var backTotal = inPkg ? (mine ? mine.total : SYS[back].price) : s.total;
    var backName = inPkg && !mine ? 'Just ' + SYS[back].name : 'Your setup';
    var short = function (k) { return SYS[k].name.replace(/^Pure Home Reserve$/, 'Reserve').replace(/^Pure /, ''); };
    var backWhat = inPkg ? (mine ? mine.what : SYS[back].spec) : s.items.map(short).concat(s.mixer ? ['mixer'] : []).join(' + ');
    var bw = weekly(backTotal), pw = weekly(p.price);
    el.innerHTML = '<p class="hx-adds__lab">Or go Deluxe</p><div class="hx-dlx" role="radiogroup" aria-label="Your setup or the Deluxe package">'
      + '<button type="button" class="hx-dlx__b" role="radio" aria-checked="' + !inPkg + '" data-hx-mine>'
      + '<span class="hx-dlx__pic">' + thumbHTML(inPkg ? back : chosen) + '</span><span class="hx-dlx__t"><b>' + backName + '</b>'
      + '<span class="hx-dlx__what">' + backWhat + '</span>'
      + '<span class="hx-dlx__p">' + (bw ? '<em>$' + bw.week + '</em> a week' : fmt(backTotal)) + '</span><span class="hx-dlx__off is-none"></span></span><i class="hx-dlx__tick" aria-hidden="true">' + TICK + '</i></button>'
      + '<button type="button" class="hx-dlx__b hx-dlx__b--gold" role="radio" aria-checked="' + inPkg + '" data-hx-godeal>'
      + '<span class="hx-dlx__pic">' + thumbHTML(pk) + '</span><span class="hx-dlx__t"><b>' + p.name + '</b>'
      + '<span class="hx-dlx__what">' + p.spec + '</span>'
      + '<span class="hx-dlx__p">' + (pw ? '<em>$' + pw.week + '</em> a week' : fmt(p.price)) + '</span>'
      + '<span class="hx-dlx__off">That’s ' + fmt(p.was - p.price) + ' off</span></span><i class="hx-dlx__tick" aria-hidden="true">' + TICK + '</i></button></div>';
    el.hidden = false;
    $('[data-hx-godeal]', el).addEventListener('click', function () {
      if (chosen === pk) return;
      mine = { key: chosen, add: { mixer: add.mixer, home: add.home, ro: add.ro }, addKey: { home: addKey.home, ro: addKey.ro }, total: s.total,
               what: s.items.map(short).concat(s.mixer ? ['mixer'] : []).join(' + ') };
      choose(pk, null, { noScroll: true, keepMine: true });
      if (window.ffyTrack) window.ffyTrack('guide_go_deluxe', { to: pk });
    });
    $('[data-hx-mine]', el).addEventListener('click', function () {
      if (chosen !== pk) return;
      var m = mine;
      choose(back, null, { noScroll: true });
      if (m) { add = m.add; addKey = m.addKey; render(true); }
    });
  }
  function tileFor(k, s) {
    var el = $('.hx-ao[data-add="' + k + '"]', setupEl), dl = s.kind === 'deluxe';
    var show = k === 'home' ? (s.kind === 'ro' || s.kind === 'flow' || dl) : k === 'ro' ? s.kind === 'home' : s.kind !== 'flow';
    el.hidden = !show;
    if (!show) return;
    var pkg = dl && k === 'home', incl = dl, on = incl || !!add[k];
    var it = k === 'mixer' ? null : pkg ? SYS[SYS[chosen].parts[0]] : SYS[addKey[k]];
    var name = pkg ? SYS[chosen].parts.filter(function (x) { return x !== 'mixer'; }).map(function (x) { return SYS[x].name; }).join(' + ') : (it ? it.name : 'Classic mixer');
    $('[data-hx-addname]', el).textContent = name;
    var img = $('[data-hx-addpic]', el), src = it ? it.img : '/media/tap-studio/classic/classic-gooseneck-' + finish + '.webp';
    if (img.getAttribute('src') !== src) img.src = src;
    img.alt = it ? name : 'The Classic three way mixer in ' + finishName.toLowerCase();
    var st = incl ? null : stepFor(k);
    $('[data-hx-addprice]', el).innerHTML = incl ? (pkg ? '<b class="hx-free">Included</b>' : '<s>' + fmt(DATA.mixer.price) + '</s> <b class="hx-free">Free</b>')
      : (st.week ? '<b>+$' + st.week + '</b> a week' : '<b>+' + fmt(st.up) + '</b>');
    var row = $('.hx-ao__opts', el);
    row.classList.toggle('is-off', pkg);
    $$('.hx-ao__opt', el).forEach(function (o) { o.setAttribute('aria-checked', o.getAttribute('data-opt') === addKey[k] ? 'true' : 'false'); });
    var t = $('.hx-ao__btn', el);
    t.classList.toggle('is-off', incl);
    t.disabled = incl;
    t.setAttribute('aria-pressed', on ? 'true' : 'false');
    t.setAttribute('aria-label', (on ? 'Remove ' : 'Add ') + (it ? it.name : 'the Classic mixer'));
    $('span', t).textContent = on ? 'Remove' : 'Add';
    el.classList.toggle('is-added', on);
  }
   
  function render(bump) {
    var card = $('.hx-setup__card', setupEl);
    if (!bump || reduce || !card.animate || !setupEl.classList.contains('is-on')) { paint(bump); return; }
    var h0 = card.getBoundingClientRect().height;
    paint(bump);
    var h1 = card.getBoundingClientRect().height;
    if (Math.abs(h1 - h0) < 1) return;
    card.style.overflow = 'hidden';
    var a = card.animate([{ height: h0 + 'px' }, { height: h1 + 'px' }], { duration: 440, easing: 'cubic-bezier(.22,1,.36,1)' });
    a.onfinish = a.oncancel = function () { card.style.overflow = ''; };
  }
  function paint(bump) {
    var s = setup(); if (!s) return;
    var main = SYS[chosen];
    $('[data-hx-pickthumb]', setupEl).innerHTML = thumbHTML(chosen);
    $('[data-hx-pickname]', setupEl).textContent = main.name;
    $('[data-hx-pickprice]', setupEl).innerHTML = weekHTML(main.price, main.from);
    $('[data-hx-pickoff]', setupEl).innerHTML = main.was ? '<span class="hx-off">That’s ' + fmt(main.was - main.price) + ' off</span>' : '';
    ['home', 'ro', 'mixer'].forEach(function (k) { tileFor(k, s); });
     
    var html = s.items.map(function (key) { var it = SYS[key]; return '<li><span>' + it.name + '</span><b>' + (it.from ? 'From ' : '') + fmt(it.price) + '</b></li>'; });
    if (s.kind === 'deluxe') html.push('<li class="is-free"><span>Classic mixer, ' + finishName.toLowerCase() + '</span><b>Free</b></li>');
    else if (s.mixer) html.push('<li><span>Classic mixer, ' + finishName.toLowerCase() + '</span><b>' + fmt(DATA.mixer.price) + '</b></li>');
    if (s.save) html.push('<li class="is-save"><span>Second system</span><b>&minus;' + fmt(s.save) + '</b></li>');
    lines.innerHTML = html.join('');
    var w = weekly(s.total), up = $('[data-hx-upfront]', setupEl);
    if (w) {
      rollTo(totalEl, w.week, s.from ? '<small>From</small>' : '', '<span class="hx-sum__per">a week <i>for ' + PLAN.term + ' months</i></span>');
      up.innerHTML = 'Or pay ' + (s.from ? 'from ' : '') + fmt(s.total) + ' upfront and <b>save ' + fmt(w.save) + '</b>';
    } else {
      shownWeek = 0; totalEl.innerHTML = (s.from ? '<small>From</small>' : '') + '<b>' + fmt(s.total) + '</b><span class="hx-sum__per">installed</span>';
      up.innerHTML = '';
    }
     
    var what = s.items.map(function (k) { return SYS[k].name.replace(/^Pure Home Reserve$/, 'Reserve').replace(/^Pure /, ''); });
    if (s.kind === 'deluxe' || s.mixer) what.push('mixer');
    $('[data-hx-barwhat]', setupEl).textContent = what.join(' + ');
    $('[data-hx-bartotal]', setupEl).innerHTML = w ? (s.from ? '<small>From</small>' : '') + '$' + w.week + '<small class="hx-bar__wk"><span class="hx-wk-l">a week</span><span class="hx-wk-s">/wk</span></small>' : (s.from ? '<small>From</small>' : '') + fmt(s.total);
    ['life', 'service', 'diy'].forEach(function (p) { $('[data-hx-plan="' + p + '"]', setupEl).textContent = fmt(s.care[p]) + '/yr'; });
    var note = $('[data-hx-plannote]', setupEl), offerItem = s.items.filter(function (k) { return SYS[k].offer; })[0];
    if (s.free) note.textContent = 'First year of cartridges free on both systems.';
    else if (offerItem && OCT) note.textContent = 'October offer: first year of service free.';
    else if (s.items.length > 1) note.textContent = 'Second service $100 off, one visit.';
    else note.textContent = '';
    renderDeal(s);
    if (pop && pop.open) fillPop();
    if (bump && !reduce) { totalEl.classList.remove('hx-bump'); void totalEl.offsetWidth; totalEl.classList.add('hx-bump'); }
    carry(s);
  }
  var PLAN_LABEL = { life: 'Filtered for Life', service: 'professional yearly service', diy: 'DIY cartridge kit' };
  var FORM_NAME = { deluxe: 'Deluxe Home Package', 'deluxe-reserve': 'Deluxe Home Reserve' };
  function describe(s) {
    var parts = s.items.map(function (k) { var it = SYS[k]; return it.name + ' (' + (it.from ? 'from ' : '') + fmt(it.price) + ')'; });
    if (s.kind === 'deluxe') parts.push('Classic three way mixer in ' + finishName.toLowerCase() + ' (free with the package)');
    else if (s.mixer) parts.push('Classic three way mixer in ' + finishName.toLowerCase() + ' (' + fmt(DATA.mixer.price) + ')');
    var txt = 'Chosen on the homepage: ' + parts.join(', ') + '.';
    if (s.save) txt += ' Second system saving of ' + fmt(s.save) + ' applied.';
    var w = weekly(s.total);
    txt += ' Shown total ' + (s.from ? 'from ' : '') + fmt(s.total) + ' installed' + (w ? ', or $' + w.week + ' a week over ' + PLAN.term + ' months' : '') + '.';
    txt += ' Yearly care: ' + PLAN_LABEL[plan] + ', ' + fmt(s.care[plan]) + ' a year' + (s.free ? ', first year of cartridges free on both.' : '.');
    return txt;
  }
  function carry(s) {
    var sys = FORM_NAME[chosen] || SYS[chosen].name, msg = describe(s);
    $$('.hx-get, .fab').forEach(function (b) { b.setAttribute('data-sys', sys); });
    $$('[data-qform] form').forEach(function (f) {
      var m = f.querySelector('input[name="message"]');
      if (!m) { m = document.createElement('input'); m.type = 'hidden'; m.name = 'message'; f.appendChild(m); }
      m.value = msg;
      var q = f.closest('[data-qform]');
      if (q && q._setSystem) q._setSystem(sys);
      var chip = q.querySelector('.hx-pick');
      if (!chip) { chip = document.createElement('p'); chip.className = 'hx-pick'; chip.innerHTML = '<img src="" alt="" width="104" height="104"><span><b></b><span></span></span>'; q.insertBefore(chip, f); }
      fillChip(chip, s);
    });
    var askChip = $('[data-hx-askpick]');
    if (askChip) fillChip(askChip, s);
  }
  function fillChip(chip, s) {
    var names = s.items.map(function (k) { return SYS[k].name; });
    if (s.kind === 'deluxe' || s.mixer) names.push('Classic mixer, ' + finishName.toLowerCase());
    var img = SYS[chosen].img || SYS[SYS[chosen].parts[0]].img, w = weekly(s.total);
    $('img', chip).src = img;
    $('b', chip).textContent = 'Your setup: ' + names.join(' + ');
    $('span span', chip).textContent = (w ? (s.from ? 'From $' : '$') + w.week + ' a week, or ' : (s.from ? 'From ' : '')) + fmt(s.total) + ' upfront. ' + PLAN_LABEL[plan] + ' ' + fmt(s.care[plan]) + ' a year';
    chip.hidden = false;
  }
  function choose(key, path, opts) {
    opts = opts || {};
    if (!SYS[key]) return;
    if (path && path !== curPath) selectPath(path, { noScroll: true, index: racks[path] && $$('.hx-card', racks[path].panel).findIndex(function (c) { return c.getAttribute('data-key') === key; }) });
    var changed = chosen !== key;
    chosen = key;
    if (changed) {
      if (!opts.keepMine) mine = null;
      add = { mixer: false, home: false, ro: false }; shownWeek = 0;
      if (HOME_FOR[key]) addKey.home = HOME_FOR[key];
      if (PARTNER[key]) addKey.ro = PARTNER[key];
    }
    if (!setupEl.classList.contains('is-on')) setupEl.classList.add('is-on');
    progress(3);
    render(false);
    if (!opts.noScroll) setTimeout(function () { bringIntoView(setupEl, false); }, reduce ? 0 : 40);
    if (window.ffyTrack) window.ffyTrack('guide_choose', { system: SYS[key].name });
  }

   
  var pop = setupEl ? $('#hx-bkpop', setupEl) : null, popKey = null, popFrom = null;
  if (!pop || typeof pop.showModal !== 'function') pop = { open: false };
  function fillPop() {
    var s = setup(), k = popKey, incl = k === 'mixer' && s.kind === 'deluxe', on = incl || !!add[k];
    var it = k === 'mixer' ? null : SYS[addKey[k]];
    var img = $('[data-hx-popimg]', pop), src = it ? it.img : '/media/tap-studio/classic/classic-gooseneck-' + finish + '.webp';
    if (img.getAttribute('src') !== src) swapImg(img, src);
    img.alt = it ? it.name + ', studio photo' : 'The Classic three way mixer in ' + finishName.toLowerCase() + ' on a marble kitchen bench';
    $('[data-hx-popname]', pop).textContent = it ? it.name : 'Classic three way mixer';
    $('[data-hx-popwhy]', pop).textContent = it ? it.why : DATA.mixer.why;
    var feats = it ? it.feats : DATA.mixer.feats;
    $('[data-hx-popfeats]', pop).innerHTML = (feats || []).map(function (f) { return '<li>' + TICK + '<span>' + f + '</span></li>'; }).join('');
    $('[data-hx-popfin]', pop).hidden = k !== 'mixer';
    var price = $('[data-hx-popprice]', pop);
    if (incl) price.innerHTML = '<b class="hx-free">Free with Deluxe</b><span class="hx-off">Worth ' + fmt(DATA.mixer.price) + '</span>';
    else {
      var st = stepFor(k), off = k === 'mixer' ? DATA.mixer.was - DATA.mixer.price : (DATA.installOff || 200);
      price.innerHTML = (st.week ? '<b>+$' + st.week + '</b> a week<small>or +' + fmt(st.up) + ' upfront</small>' : '<b>+' + fmt(st.up) + '</b>')
        + '<span class="hx-off">That’s ' + fmt(off) + ' off</span>';
    }
    var b = $('[data-hx-popadd]', pop);
    b.hidden = incl;
    b.setAttribute('aria-pressed', on ? 'true' : 'false');
    $('span', b).textContent = on ? 'Remove' : 'Add';
  }
  function openPop(k, from) {
    popKey = k; popFrom = from;
    fillPop();
    pop.showModal();
    doc.classList.add('hx-pop-on');
    var card = $('.hx-bkpop__card', pop);
    if (!reduce && card.animate && from && innerWidth >= 700) {
      var a = from.getBoundingClientRect(), b = card.getBoundingClientRect();
      var sc = Math.max(.2, Math.min(a.width / b.width, 1));
      card.animate([{ transform: 'translate(' + (a.left + a.width / 2 - b.left - b.width / 2) + 'px,' + (a.top + a.height / 2 - b.top - b.height / 2) + 'px) scale(' + sc + ')', opacity: 0 },
                    { transform: 'none', opacity: 1 }], { duration: 520, easing: 'cubic-bezier(.22,1.3,.36,1)' });
    }
    if (window.ffyTrack) window.ffyTrack('guide_addon_open', { item: k });
  }
  function shutPop() {
    if (!pop.open || pop.classList.contains('is-closing')) return;
    if (reduce) { pop.close(); return; }
    pop.classList.add('is-closing');
    var done = function () { pop.removeEventListener('animationend', done); pop.classList.remove('is-closing'); if (pop.open) pop.close(); };
    pop.addEventListener('animationend', done);
    setTimeout(function () { if (pop.open && pop.classList.contains('is-closing')) done(); }, 420);
  }
  if (pop.showModal) {
    pop.addEventListener('close', function () { doc.classList.remove('hx-pop-on'); if (popFrom) popFrom.focus({ preventScroll: true }); });
    pop.addEventListener('cancel', function (e) { e.preventDefault(); shutPop(); });
    pop.addEventListener('click', function (e) { if (e.target === pop) shutPop(); });
    $('[data-hx-popclose]', pop).addEventListener('click', shutPop);
    $('[data-hx-popadd]', pop).addEventListener('click', function () {
      var k = popKey, was = !!add[k];
      flipAdd(k); render(true);
      if (window.ffyTrack) window.ffyTrack('guide_add', { item: k, on: add[k], from: 'popup' });
      if (!was) setTimeout(shutPop, reduce ? 0 : 280);
    });
  }

  if (find) {
    $$('.hx-choose', find).forEach(function (a) {
      a.addEventListener('click', function (e) { e.preventDefault(); choose(a.getAttribute('data-choose'), a.getAttribute('data-path')); });
    });
    $$('.hx-ao .hx-ao__btn', setupEl).forEach(function (t) {
      t.addEventListener('click', function () {
        var k = t.getAttribute('data-toggle');
        flipAdd(k); render(true);
        if (window.ffyTrack) window.ffyTrack('guide_add', { item: k, on: add[k] });
      });
    });
    $$('.hx-ao__opt', setupEl).forEach(function (o) {
      o.addEventListener('click', function () {
        var k = o.closest('.hx-ao').getAttribute('data-add');
        addKey[k] = o.getAttribute('data-opt'); render(!!add[k]);
        if (window.ffyTrack) window.ffyTrack('guide_addon_pick', { item: k, pick: addKey[k] });
      });
    });
    $$('[data-hx-zoom]', setupEl).forEach(function (b) {
      b.addEventListener('click', function () { if (pop.showModal) openPop(b.getAttribute('data-hx-zoom'), b); });
    });
    $$('input[name="hx-plan"]', setupEl).forEach(function (r) {
      r.addEventListener('change', function () { plan = r.value; render(false); if (window.ffyTrack) window.ffyTrack('guide_plan', { plan: plan }); });
    });
    $('[data-hx-change]', setupEl).addEventListener('click', function () { bringIntoView($('#hx-panel-' + curPath), false); });
  }

   
  function swatches(group, onPick) {
    var sws = $$('.hx-sw', group);
    function pick(sw, focus) {
      sws.forEach(function (o) { var on = o === sw; o.setAttribute('aria-checked', on ? 'true' : 'false'); o.tabIndex = on ? 0 : -1; });
      if (focus) sw.focus();
      onPick(sw.getAttribute('data-finish'), sw.getAttribute('data-name'));
    }
    sws.forEach(function (sw, i) {
      sw.addEventListener('click', function () { pick(sw, false); });
      sw.addEventListener('keydown', function (e) {
        var d = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : (e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0);
        if (!d) return; e.preventDefault(); pick(sws[(i + d + sws.length) % sws.length], true);
      });
    });
  }
  function swapImg(img, src) {
    if (img.getAttribute('src') === src) return;
    if (!img.getAttribute('src')) { img.src = src; return; }
    var n = new Image(); n.src = src;
    var go = function () { img.style.opacity = '0'; setTimeout(function () { img.src = src; img.style.opacity = ''; }, reduce ? 0 : 160); };
    if (n.decode) n.decode().then(go, go); else n.onload = go;
  }
  function setFinish(f, name) {
    finish = f; finishName = name;
    $$('.hx-sw', setupEl).forEach(function (o) { var on = o.getAttribute('data-finish') === f; o.setAttribute('aria-checked', on ? 'true' : 'false'); o.tabIndex = on ? 0 : -1; });
    $$('[data-hx-swname]', setupEl).forEach(function (n) { n.textContent = name; });
    render(false);
  }
  if (setupEl) $$('.hx-sws', setupEl).forEach(function (g) { swatches(g, setFinish); });

   
  if (stage && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (es) { document.body.classList.toggle('hxpanelvis', es[0].isIntersecting && stage.classList.contains('is-open')); }, { threshold: 0.35 }).observe(stage);
  }
   
  if (setupEl && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (es) { document.body.classList.toggle('hxctavis', es[0].isIntersecting && setupEl.classList.contains('is-on')); }, { threshold: 0 }).observe(setupEl);
  }

   
  var DEEP = { PureHome: 'home', PurePlus: 'premium', PurePremium: 'premium', PureLuxe: 'luxe', PureEssential: 'essential', PureFlow: 'flow', PureHomeReserve: 'reserve' };
  function deep(name, instant) {
    var key = DEEP[name]; if (!key || !find) return false;
    var path = PATH_OF[key], rack = racks[path];
    var idx = $$('.hx-card', rack.panel).findIndex(function (c) { return c.getAttribute('data-key') === key; });
    selectPath(path, { noScroll: true, index: idx });
    var y = $('#hx-panel-' + path).getBoundingClientRect().top + scrollY - headerRoom();
    if (instant) { var l = lenis(); if (l) l.scrollTo(y, { immediate: true, force: true }); else window.scrollTo(0, y); }
    else scrollToY(y);
    try { history.replaceState(null, '', '#' + name); } catch (e) {}
    return true;
  }
  if (window.__ffyDeep) {
    var land = function () { deep(window.__ffyDeep, true); try { if ('scrollRestoration' in history) history.scrollRestoration = 'auto'; } catch (e) {} };
    if (document.readyState === 'complete') setTimeout(land, 60); else addEventListener('load', function () { setTimeout(land, 60); });
  }
  addEventListener('hashchange', function () { var h = location.hash.slice(1); if (DEEP[h]) deep(h, false); });
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href*="#Pure"]');
    if (!a || a.pathname !== location.pathname) return;
    var h = a.hash.slice(1); if (!DEEP[h]) return;
    e.preventDefault(); deep(h, false);
  });

   
  var rmq = $('.hx-rmq');
  if (rmq && !reduce) {
    var rows = $$('.hx-rrow', rmq).map(function (row) {
      var track = $('.hx-rrow__track', row), kids = [].slice.call(track.children);
      kids.forEach(function (el) { var c = el.cloneNode(true); c.setAttribute('aria-hidden', 'true'); c.inert = true; track.appendChild(c); });
      return { row: row, track: track, dir: +row.getAttribute('data-dir') || -1, span: 0, n: kids.length };
    });
    var measureRows = function () { rows.forEach(function (r) { var k = r.track.children; r.span = k[r.n].offsetLeft - k[0].offsetLeft; }); };
    measureRows(); addEventListener('resize', measureRows);
    rmq.classList.add('is-moving');
    var vis = false, shown = 0, wanted = 0, lastT = 0, drift = 0;
    new IntersectionObserver(function (es) { vis = es[0].isIntersecting; }, { rootMargin: '120px 0px' }).observe(rmq);
    (function frame(t) {
      var dt = lastT ? Math.min((t - lastT) / 1000, 0.05) : 0; lastT = t;
      if (vis && !document.hidden) {
        var r = rmq.getBoundingClientRect();
        wanted = (innerHeight - r.top) * 0.42;
        drift += dt * 14;
        shown += (wanted - shown) * (1 - Math.pow(1 - 0.12, dt * 60));
        rows.forEach(function (row, i) {
          if (!row.span) return;
          var x = (shown + drift) * row.dir * (i === 1 ? 0.85 : 1);
          x = -mod(-x, row.span);
          row.track.style.transform = 'translate3d(' + x.toFixed(2) + 'px,0,0)';
        });
      }
      requestAnimationFrame(frame);
    })(0);
  }

   
  var wall = $('.hx-wall');
  if (wall) {
    var chips = $$('.hx-wchip');
    var photos = $$('.hx-photo', wall);
    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        var cat = chip.getAttribute('data-cat');
        chips.forEach(function (c) { c.setAttribute('aria-pressed', c === chip ? 'true' : 'false'); });
        var swap = function () {
          var i = 0;
          photos.forEach(function (p) { var on = cat === 'all' || p.getAttribute('data-cat') === cat; p.hidden = !on; if (on) p.style.setProperty('--k', i++); });
          wall.classList.toggle('is-filtered', cat !== 'all');
          wall.classList.remove('is-shuffling'); void wall.offsetWidth; wall.classList.add('is-shuffling');
        };
        morphHeight(wall, swap, 520);
        if (window.ffyTrack) window.ffyTrack('work_filter', { cat: cat });
      });
    });
    var lb = $('.hx-lb'), cur = 0, x0 = null;
    var visible = function () { return photos.filter(function (p) { return !p.hidden; }); };
    var show = function (i) {
      var list = visible(); cur = (i + list.length) % list.length;
      var p = list[cur], img = $('[data-lb-img]', lb), cap = $('img', p).alt, src = p.getAttribute('data-full');
      var put = function () { img.src = src; img.alt = cap; img.style.opacity = ''; };
      if (!img.getAttribute('src') || reduce) put();
      else { var pre = new Image(); pre.src = src; img.style.opacity = '.35'; (pre.decode ? pre.decode() : Promise.resolve()).then(put, put); }
      $('[data-lb-cap]', lb).textContent = cap;
      $('[data-lb-count]', lb).textContent = (cur + 1) + ' / ' + list.length;
    };
    if (lb && lb.showModal) {
      photos.forEach(function (p) { p.addEventListener('click', function () { show(visible().indexOf(p)); lb.showModal(); var l = lenis(); if (l) l.stop(); if (window.ffyTrack) window.ffyTrack('work_photo', { i: +p.getAttribute('data-i') }); }); });
      lb.addEventListener('close', function () { var l = lenis(); if (l) l.start(); });
      $('[data-lb-close]', lb).addEventListener('click', function () { lb.close(); });
      $$('[data-lb]', lb).forEach(function (b) { b.addEventListener('click', function () { show(cur + +b.getAttribute('data-lb')); }); });
      lb.addEventListener('click', function (e) { if (e.target === lb) lb.close(); });
      lb.addEventListener('keydown', function (e) { if (e.key === 'ArrowRight') show(cur + 1); else if (e.key === 'ArrowLeft') show(cur - 1); });
      lb.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
      lb.addEventListener('touchend', function (e) { if (x0 === null) return; var dx = e.changedTouches[0].clientX - x0; if (Math.abs(dx) > 40) show(cur + (dx < 0 ? 1 : -1)); x0 = null; }, { passive: true });
    } else {
      photos.forEach(function (p) { p.addEventListener('click', function () { window.open(p.getAttribute('data-full'), '_blank', 'noopener'); }); });
    }
  }

   
  var fin = $('#taps.hx-fin2');
  if (fin) {
    var pics = $$('[data-fin-photo]', fin), names = $$('[data-fin-name]', fin), navs = $$('[data-fin-jump]', fin), bar = $('.hx-fin2__bar span', fin);
    var curF = 0, decoded = {};
    var decode = function (i) {
      if (!decoded[i]) { var im = $('img', pics[i]); im.loading = 'eager'; decoded[i] = im.decode ? im.decode().catch(function () {}) : Promise.resolve(); }
      return decoded[i];
    };
    var setF = function (i) {
      if (i === curF) return; curF = i;
      decode(i).then(function () {
        if (curF !== i) return;
        pics.forEach(function (p, k) { p.classList.toggle('on', k === i); });
        names.forEach(function (n, k) { n.classList.toggle('on', k === i); n.setAttribute('aria-hidden', k === i ? 'false' : 'true'); });
        navs.forEach(function (b, k) { b.classList.toggle('on', k === i); b.setAttribute('aria-current', k === i ? 'true' : 'false'); });
      });
    };
    var pinned = function () { return getComputedStyle(fin).getPropertyValue('--fin-pin').trim() === '1' && !reduce; };
    var prog = function () { var r = fin.getBoundingClientRect(); return clamp(-r.top / Math.max(1, r.height - innerHeight), 0, 1); };
    var tick = function () {
      if (!pinned()) return;
      var r = fin.getBoundingClientRect(); if (r.bottom < 0 || r.top > innerHeight) return;
      var p = prog();
      if (bar) bar.style.transform = 'scaleX(' + p.toFixed(4) + ')';
      if (r.top < innerHeight * 0.6) decode(Math.min(pics.length - 1, curF + 1));
      setF(Math.min(pics.length - 1, Math.floor(p * pics.length * 0.999)));
    };
    addEventListener('scroll', tick, { passive: true }); addEventListener('resize', tick); tick();
    navs.forEach(function (b, i) {
      b.addEventListener('click', function () {
        if (!pinned()) { setF(i); return; }
        var top = fin.getBoundingClientRect().top + scrollY, span = fin.offsetHeight - innerHeight;
        scrollToY(top + span * (i + 0.5) / pics.length, 0.9);
      });
    });
    if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { if (es[0].isIntersecting) decode(1); }, { rootMargin: '600px 0px' }).observe(fin);
  }

   
  var nd = $('#newbuilds.hx-nd');
  if (nd && !reduce) {
    var ndPic = $('.hx-nd__pic img', nd), ndRaf = 0;
    var ndTick = function () {
      ndRaf = 0;
      var r = nd.getBoundingClientRect(); if (r.bottom < 0 || r.top > innerHeight) return;
      var p = clamp(1 - r.top / innerHeight, 0, 1);
      ndPic.style.transform = 'scale(' + (1.12 - 0.12 * easeOut(p)).toFixed(4) + ')';
      nd.classList.toggle('is-in', p > 0.55);
    };
    addEventListener('scroll', function () { if (!ndRaf) ndRaf = requestAnimationFrame(ndTick); }, { passive: true });
    ndTick();
  } else if (nd) nd.classList.add('is-in');

  queueScan();
})();

 
(function () {
  var d = document.getElementById('hx-fffd'), btn = document.querySelector('[data-hx-fff]');
  if (!d || !btn || typeof d.showModal !== 'function') return;
  d.removeAttribute('open');
  d.classList.add('is-modal');
  var still = matchMedia('(prefers-reduced-motion: reduce)');
  var shut = function () {
    if (!d.open || d.classList.contains('is-closing')) return;
    if (still.matches) { d.close(); return; }
    d.classList.add('is-closing');
    var done = function () { d.removeEventListener('animationend', done); d.classList.remove('is-closing'); d.close(); };
    d.addEventListener('animationend', done);
    setTimeout(function () { if (d.open && d.classList.contains('is-closing')) done(); }, 450);
  };
  btn.addEventListener('click', function () {
    d.showModal();
    document.documentElement.classList.add('hx-fff-on');
    if (window.ffyTrack) window.ffyTrack('filtered_for_free_open', {});
  });
  d.addEventListener('close', function () { document.documentElement.classList.remove('hx-fff-on'); btn.focus({ preventScroll: true }); });
  d.addEventListener('cancel', function (e) { e.preventDefault(); shut(); });
  d.querySelector('[data-hx-fff-close]').addEventListener('click', shut);
  d.addEventListener('click', function (e) { if (e.target === d) shut(); });
})();
