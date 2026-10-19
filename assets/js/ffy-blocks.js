(function () {
  'use strict';
  var doc = document.documentElement;
  if (!document.querySelector('.fb')) return;
  doc.classList.add('fb-js');
  window.__fbReady = true;
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return [].slice.call((r || document).querySelectorAll(s)); };
  var mod = function (a, n) { return ((a % n) + n) % n; };
  var pending = $$('.fb .fb-rise');
  function scan() {
    if (!pending.length) return;
    var line = innerHeight * 0.9;
    pending = pending.filter(function (el) {
      if (!el.isConnected) return false;
      if (!el.offsetParent && el.getClientRects().length === 0) return true;
      if (el.getBoundingClientRect().top < line) { el.classList.add('is-in'); return false; }
      return true;
    });
  }
  var raf = 0;
  function queue() { if (!raf) raf = requestAnimationFrame(function () { raf = 0; scan(); }); }
  if (reduce) { pending.forEach(function (el) { el.classList.add('is-in'); }); pending = []; }
  else {
    addEventListener('scroll', queue, { passive: true });
    addEventListener('resize', queue);
    queue(); setTimeout(queue, 600);
  }
  $$('[data-fb-hcard]').forEach(function (card) {
    var hero = card.closest('.fb-hero');
    if (!hero) return;
    var fit = function () { hero.style.setProperty('--fb-card-h', card.offsetHeight + 'px'); };
    fit();
    if ('ResizeObserver' in window) new ResizeObserver(fit).observe(card); else addEventListener('resize', fit);
  });
  $$('.fb-rmq').forEach(function (rmq) {
    if (reduce) return;
    var rows = $$('.fb-rrow', rmq).map(function (row) {
      var track = $('.fb-rrow__track', row), kids = [].slice.call(track.children);
      kids.forEach(function (el) { var c = el.cloneNode(true); c.setAttribute('aria-hidden', 'true'); c.inert = true; track.appendChild(c); });
      return { track: track, dir: +row.getAttribute('data-dir') || -1, span: 0, n: kids.length };
    });
    if (!rows.length) return;
    var measure = function () { rows.forEach(function (r) { var k = r.track.children; r.span = k[r.n] ? k[r.n].offsetLeft - k[0].offsetLeft : 0; }); };
    measure(); addEventListener('resize', measure);
    rmq.classList.add('is-moving');
    var vis = false, shown = 0, lastT = 0, drift = 0;
    if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { vis = es[0].isIntersecting; }, { rootMargin: '120px 0px' }).observe(rmq);
    else vis = true;
    (function frame(t) {
      var dt = lastT ? Math.min((t - lastT) / 1000, 0.05) : 0; lastT = t;
      if (vis && !document.hidden) {
        var r = rmq.getBoundingClientRect();
        var wanted = (innerHeight - r.top) * 0.42;
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
  });
  $$('[data-fb-fff]').forEach(function (btn) {
    var d = document.getElementById(btn.getAttribute('aria-controls'));
    if (!d || typeof d.showModal !== 'function') return;
    d.removeAttribute('open');
    d.classList.add('is-modal');
    var shut = function () {
      if (!d.open || d.classList.contains('is-closing')) return;
      if (reduce) { d.close(); return; }
      d.classList.add('is-closing');
      var done = function () { d.removeEventListener('animationend', done); d.classList.remove('is-closing'); d.close(); };
      d.addEventListener('animationend', done);
      setTimeout(function () { if (d.open && d.classList.contains('is-closing')) done(); }, 450);
    };
    btn.addEventListener('click', function () {
      d.showModal();
      doc.classList.add('fb-fff-on');
      if (window.ffyTrack) window.ffyTrack('filtered_for_free_open', {});
    });
    d.addEventListener('close', function () { doc.classList.remove('fb-fff-on'); btn.focus({ preventScroll: true }); });
    d.addEventListener('cancel', function (e) { e.preventDefault(); shut(); });
    var x = d.querySelector('[data-fb-fff-close]'); if (x) x.addEventListener('click', shut);
    d.addEventListener('click', function (e) { if (e.target === d) shut(); });
  });
  $$('.fb [data-fb-more]').forEach(function (box) {
    var btn = box.querySelector('.fb-more__btn'), body = box.querySelector('.fb-more__body'), anim = null;
    if (!btn || !body) return;
    btn.setAttribute('aria-expanded', 'false'); body.hidden = true;
    btn.addEventListener('click', function () {
      var opening = btn.getAttribute('aria-expanded') !== 'true';
      btn.setAttribute('aria-expanded', opening ? 'true' : 'false');
      var from = body.hidden ? 0 : body.getBoundingClientRect().height;
      if (anim) { anim.cancel(); anim = null; }
      body.hidden = false;
      var to = opening ? body.scrollHeight : 0;
      if (reduce || !body.animate) { body.hidden = !opening; return; }
      anim = body.animate([{ height: from + 'px' }, { height: to + 'px' }], { duration: 420, easing: 'cubic-bezier(.22,1,.36,1)' });
      anim.onfinish = function () { anim = null; if (!opening) body.hidden = true; };
    });
  });
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('.fb [data-fb-sys]');
    if (!a) return;
    var form = document.querySelector(a.getAttribute('href') || '#ask'), name = a.getAttribute('data-fb-sys');
    if (!form || !name) return;
    var opt = [].slice.call(form.querySelectorAll('[data-v]')).filter(function (b) { return b.getAttribute('data-v') === name; })[0];
    if (opt && opt.getAttribute('aria-pressed') !== 'true') setTimeout(function () { opt.click(); }, 60);
  });
  $$('.fb-care').forEach(function (sec) {
    var tier = $('[data-fb-care]', sec), pick = $('.fb-pick', sec), raw = $('[data-fb-care-data]', sec);
    if (!tier || !pick || !raw) return;
    var data = {};
    try { data = JSON.parse(raw.textContent); } catch (e) { return; }
    var btns = $$('.fb-pick__b', pick);
    var set = function (k, focus) {
      var d = data[k]; if (!d) return;
      btns.forEach(function (b) { var on = b.getAttribute('data-k') === k; b.setAttribute('aria-checked', on ? 'true' : 'false'); b.tabIndex = on ? 0 : -1; if (on && focus) b.focus(); });
      tier.setAttribute('data-k', k);
      var swap = function () {
        $$('[data-fb-from]', tier).forEach(function (el) { el.textContent = ''; });
        $$('[data-fb-p]', tier).forEach(function (el) { el.textContent = d[el.getAttribute('data-fb-p')]; });
      };
      if (reduce) { swap(); return; }
      tier.classList.add('is-swap');
      setTimeout(function () { swap(); tier.classList.remove('is-swap'); }, 180);
    };
    btns.forEach(function (b, i) {
      b.addEventListener('click', function () { set(b.getAttribute('data-k'), false); });
      b.addEventListener('keydown', function (e) {
        var step = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : (e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0);
        if (!step) return;
        e.preventDefault();
        set(btns[mod(i + step, btns.length)].getAttribute('data-k'), true);
      });
    });
  });
})();
