(() => {
  'use strict';
  const root = document.getElementById('care-page'); if (!root) return;
  document.documentElement.classList.add('cp-js');
  window.__cpReady = true;
  const page = root.dataset.page || '';
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  let DATA = {};
  try { DATA = JSON.parse($('#cp-data').textContent); } catch (e) { DATA = {}; }

  let lenis = null;
  if (window.Lenis && !reduce && matchMedia('(pointer:fine)').matches) {
    lenis = new Lenis({ duration: 1.35, smoothWheel: true, syncTouch: false });
    const raf = t => { lenis.raf(t); requestAnimationFrame(raf); }; requestAnimationFrame(raf);
  }
  const hdrH = () => (document.querySelector('header')?.offsetHeight || 72);
  function goTo(el, gap = 16) {
    if (!el) return;
    const y = el.getBoundingClientRect().top + scrollY - hdrH() - gap;
    if (lenis) { lenis.resize(); lenis.scrollTo(y, { duration: 1.1, force: true }); }
    else scrollTo({ top: y, behavior: reduce ? 'instant' : 'smooth' });
  }
  window.ffyGoTo = el => goTo(el, 16);
  root.addEventListener('click', e => {
    const a = e.target.closest('a[href^="#"]'); if (!a) return;
    const id = a.getAttribute('href').slice(1); const el = id && document.getElementById(id);
    if (!el) return;
    e.preventDefault(); goTo(el, 12);
    if (history.replaceState) history.replaceState(null, '', '#' + id);
  });
  const anims = $$('[data-cp-anim], [data-wy-anim], [data-cp-in]', root);
  anims.forEach(el => $$(':scope > li, :scope > article', el).forEach((c, i) => { if (!c.style.getPropertyValue('--i')) c.style.setProperty('--i', i); }));
  const reveal = el => {
    if (el.classList.contains('is-in')) return;
    el.classList.add('is-in');
    const m = $('[data-cp-months]', el);
    if (m) months(m);
  };
  if (reduce || !('IntersectionObserver' in window)) anims.forEach(reveal);
  else {
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { reveal(e.target); io.unobserve(e.target); } }), { threshold: 0.25 });
    anims.forEach(el => io.observe(el));
    const sweep = () => anims.forEach(el => { if (!el.classList.contains('is-in') && el.getBoundingClientRect().bottom < innerHeight * 0.5) reveal(el); });
    addEventListener('scroll', sweep, { passive: true });
  }

  function months(el) {
    const to = parseInt(el.textContent, 10) || 12;
    if (reduce) { el.textContent = to; return; }
    const t0 = performance.now() + 100, step = 110;
    el.textContent = '1';
    const tick = t => {
      const n = Math.max(1, Math.min(to, Math.floor((t - t0) / step) + 1));
      el.textContent = n;
      if (n < to) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }
  $$('details', root).forEach(d => {
    const sum = $('summary', d); if (!sum) return;
    let anim = null, closing = false;
    const closedH = () => { const cs = getComputedStyle(d); return sum.offsetHeight + parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom) + parseFloat(cs.borderTopWidth) + parseFloat(cs.borderBottomWidth); };
    sum.addEventListener('click', e => {
      if (reduce) return;
      e.preventDefault();
      const from = d.offsetHeight;
      if (anim) { anim.cancel(); anim = null; }
      d.style.overflow = 'hidden';
      let to;
      if (!d.open || closing) { closing = false; d.open = true; to = d.offsetHeight; }
      else { closing = true; to = closedH(); }
      anim = d.animate({ height: [from + 'px', to + 'px'] }, { duration: 420, easing: 'cubic-bezier(.22,1,.36,1)' });
      anim.onfinish = () => { anim = null; if (closing) { d.open = false; closing = false; } d.style.overflow = ''; };
    });
  });
  const form = { started: false, pick(v) { const a = $('[data-fb-ask]', root); if (a && a.ffyAsk) a.ffyAsk.pick(v); } };
  root.addEventListener('change', e => { if (e.target.closest && e.target.closest('[data-fb-ask]')) form.started = true; });
  let touched = false, following = false;
  root.addEventListener('pointerdown', e => { if (e.target.closest('[data-fb-pick]')) touched = true; }, true);
  root.addEventListener('keydown', e => { if (e.target.closest('[data-fb-pick]')) touched = true; }, true);
  root.addEventListener('fb:pick', e => {
    const k = e.detail && e.detail.key, d = DATA[k];
    if (!touched || following || !d) return;
    if (e.target.id === 'cr-carts') {
      const t = $('#care [data-fb-pick="' + k + '"]');
      if (t && t.getAttribute('aria-pressed') !== 'true') { following = true; t.click(); following = false; }
    }
    if (form.pick && !form.started) form.pick(d.name, false);
    window.ffyTrack && window.ffyTrack('system_select', { system: d.name, form: page + '_chooser' });
  });
  (() => {
    const wrap = $('#rmq', root); if (!wrap) return;
    const phone = matchMedia('(max-width:859px)');
    const clamp = (n, a = 0, b = 1) => Math.max(a, Math.min(b, n));
    const lanes = $$('.rrow', wrap).map(row => {
      const originals = [...row.children];
      const setW = row.scrollWidth, need = Math.max(innerWidth, 1920) + setW + 200;
      for (let n = 0; n < 8 && row.scrollWidth < need; n++) originals.forEach(card => { const copy = card.cloneNode(true); copy.inert = true; copy.setAttribute('aria-hidden', 'true'); row.append(copy); });
      return { el: row, first: originals[0], copy: row.children[originals.length], dir: parseInt(row.dataset.dir || '-1', 10), pos: 0, half: 0 };
    });
    function measure() { lanes.forEach(l => { l.half = l.copy.offsetLeft - l.first.offsetLeft; if (l.dir > 0 && l.pos === 0) l.pos = -l.half; }); }
    measure(); if ('ResizeObserver' in window) new ResizeObserver(measure).observe(wrap);
    if (reduce) return;
    let visible = false, last = 0, vel = 0, lastY = scrollY, raf = 0;
    function step(t) {
      if (!visible || document.hidden) { raf = 0; last = 0; return; }
      if (last) {
        const dt = Math.min((t - last) / 1000, .05), dy = scrollY - lastY; lastY = scrollY;
        const target = phone.matches ? 0 : clamp(dy / Math.max(dt, .001) / 900, -1, 1);
        vel += (target - vel) * Math.min(1, dt * 6);
        lanes.forEach(l => { if (!l.half || l.el.offsetParent === null) return; l.pos += l.dir * (30 + Math.abs(vel) * 260) * dt; if (l.pos <= -l.half) l.pos += l.half; if (l.pos > 0) l.pos -= l.half; l.el.style.transform = `translateX(${l.pos.toFixed(2)}px) skewX(${(-vel * 4).toFixed(2)}deg)`; });
      }
      last = t; raf = requestAnimationFrame(step);
    }
    function sync() { cancelAnimationFrame(raf); raf = 0; last = 0; lastY = scrollY; if (visible && !document.hidden) raf = requestAnimationFrame(step); }
    new IntersectionObserver(es => { visible = es[0].isIntersecting; sync(); }, { rootMargin: '80px 0px' }).observe(wrap);
    document.addEventListener('visibilitychange', sync);
  })();
})();
