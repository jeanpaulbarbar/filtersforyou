 
(() => {
  'use strict';
  const doc = document.documentElement; doc.classList.add('lp-js', 'hx-js');
  const main = document.querySelector('main.lp'); if (!main) return;
  const slug = main.dataset.location || '';
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const clamp = (v, a, b) => v < a ? a : (v > b ? b : v);
  const mod = (a, n) => ((a % n) + n) % n;
  const now = () => (window.performance && performance.now) ? performance.now() : Date.now();
  const easeOut = t => 1 - Math.pow(1 - t, 3);

  
  let lenis = null;
  if (window.Lenis && !reduce && matchMedia('(pointer:fine)').matches) {
    lenis = new Lenis({ duration: 1.35, smoothWheel: true, syncTouch: false });
    const raf = t => { lenis.raf(t); requestAnimationFrame(raf); }; requestAnimationFrame(raf);
  }
  const hdrH = () => (document.getElementById('hdr')?.offsetHeight || 72);
  function goTo(el, gap = 16) {
    if (!el) return;
    const y = el.getBoundingClientRect().top + scrollY - hdrH() - gap;
    if (lenis) { lenis.resize(); lenis.scrollTo(y, { duration: 1.1, force: true }); }
    else scrollTo({ top: y, behavior: reduce ? 'instant' : 'smooth' });
  }

  
  let DATA = {};
  try { DATA = JSON.parse($('#lp-data')?.textContent || '{}'); } catch (e) { DATA = {}; }
  const byKey = {}, bySys = {};
  Object.values(DATA.range || {}).forEach(r => { byKey[r.key] = r; bySys[r.sys] = r; });
  const PATH_OF = DATA.paths || { every: 'home', drink: 'drink', both: 'deluxe' };
  const MODE_OF = {}; Object.keys(PATH_OF).forEach(m => { MODE_OF[PATH_OF[m]] = m; });
  const chosen = Object.assign({}, DATA.defaults || {});
  let mode = 'every', model = chosen.every;

  function setMode(m, opts = {}) { if (!chosen[m]) return; mode = m; setModel(chosen[m], opts); }
  function setModel(k, opts = {}) {
    const r = byKey[k]; if (!r) return;
    chosen[r.mode] = k; model = k; mode = r.mode;
    hero(r); bar(r); form.pick(r.sys, true);
  }

  
  const heroTabs = $$('.ocdots [data-lp-mode]');
  function hero(r) {
    const tab = heroTabs.find(a => a.dataset.lpMode === r.mode); if (!tab) return;
    heroTabs.forEach(a => { const on = a === tab; a.classList.toggle('on', on); on ? a.setAttribute('aria-current', 'true') : a.removeAttribute('aria-current'); });
    const t = $('#cp-hero-product-title'); if (t) t.textContent = tab.dataset.title;
    const l = $('#cp-hero-product-link'); if (l) { l.href = r.url; l.textContent = r.name + ' ↗'; }
    const p = $('#cp-hero-product-price'); if (p) p.innerHTML = r.price + ' <i>installed</i>';
    const im = $('#cp-hero-product-image'); if (im && im.getAttribute('src') !== r.img) { im.src = r.img; im.alt = r.name; }
    const tk = $('[data-lp-hero-tick]'); if (tk) { tk.textContent = tab.dataset.tick; tk.nextSibling.textContent = ' ' + tab.dataset.title + '.'; }
  }
  heroTabs.forEach(a => a.addEventListener('click', e => { e.preventDefault(); setMode(a.dataset.lpMode); }));
  const heroCard = $('.ocard');
  function lockHero() {
    if (!heroCard || !heroTabs.length) return;
    const t = $('#cp-hero-product-title'), l = $('#cp-hero-product-link'), p = $('#cp-hero-product-price'), tk = $('[data-lp-hero-tick]');
    const keep = [t && t.textContent, l && l.textContent, p && p.innerHTML, tk && tk.textContent, tk && tk.nextSibling && tk.nextSibling.textContent];
    heroCard.style.minHeight = '';
    let max = heroCard.offsetHeight;
    Object.values(byKey).forEach(r => {
      const tab = heroTabs.find(a => a.dataset.lpMode === r.mode); if (!tab) return;
      if (t) t.textContent = tab.dataset.title;
      if (l) l.textContent = r.name + ' ↗';
      if (p) p.innerHTML = r.price + ' <i>installed</i>';
      if (tk) { tk.textContent = tab.dataset.tick; tk.nextSibling.textContent = ' ' + tab.dataset.title + '.'; }
      max = Math.max(max, heroCard.offsetHeight);
    });
    if (t) t.textContent = keep[0]; if (l) l.textContent = keep[1]; if (p) p.innerHTML = keep[2];
    if (tk) { tk.textContent = keep[3]; tk.nextSibling.textContent = keep[4]; }
    heroCard.style.minHeight = max + 'px';
  }
  let lockQueued = 0;
  addEventListener('resize', () => { cancelAnimationFrame(lockQueued); lockQueued = requestAnimationFrame(lockHero); });
  document.fonts?.ready.then(lockHero);
  $('[data-lp-choose]')?.addEventListener('click', e => {
    e.preventDefault();
    const path = PATH_OF[mode], rack = racks[path];
    if (rack) selectPath(path, { noScroll: true, index: rack.indexOf(chosen[mode]) });
    goTo($('#lp-fit-title'), 20);
  });

  
  const find = $('#fit.hx-find');
  const stage = find && $('#hx-stage', find);
  const paths = find ? $$('.hx-path', find) : [];
  const racks = {};
  let curPath = null;

  function Rack(panel) {
    const frame = $('.hx-rack__frame', panel), track = $('.hx-rack__track', panel);
    const real = $$('.hx-card', panel), caps = $$('.hx-cap', panel), dots = $$('.hx-dots button', panel);
    const prev = $('.hx-nav [data-step="-1"]', panel), next = $('.hx-nav [data-step="1"]', panel);
    const n = real.length, copies = Math.max(2, Math.ceil(10 / n)), m = n * copies;
    const all = real.slice();
    for (let c = 1; c < copies; c++) real.forEach(card => {
      const k = card.cloneNode(true);
      k.setAttribute('aria-hidden', 'true'); k.tabIndex = -1; k.removeAttribute('aria-roledescription');
      $$('img', k).forEach(im => { im.alt = ''; });
      track.appendChild(k); all.push(k);
    });
    const start = +panel.getAttribute('data-start') || 0;
    let pos = start, target = start, width = 0, raf = 0, last = 0, drag = null, sel = -1, moved = false, wheelT = 0;
    const phone = () => innerWidth < 600;
    const GAP = 22, SMALL = 0.82;
    function cfWidth() {
      const w = frame.clientWidth;
      const cf = phone() ? clamp(w * 0.56, 180, 236) : innerWidth >= 1280 ? clamp(w * 0.62, 240, 290) : clamp(w * 0.3, 220, 270);
      const fe = Math.max(36, Math.min((w - cf) / 2 - 8, Math.max(72, w * 0.24)));
      frame.style.setProperty('--cf', cf + 'px'); frame.style.setProperty('--fe', fe.toFixed(1) + 'px'); panel.style.setProperty('--cf', cf + 'px');
    }
    const shown = o => n <= 2 ? (o < 0 ? clamp(1 + o, 0, 1) : clamp(2 - o, 0, 1)) : clamp((n / 2 - Math.abs(o)) * 2, 0, 1);
    const d1 = () => width * (1 + SMALL) / 2 + GAP, d2 = () => width * SMALL + GAP;
    const xAt = o => { const a = Math.abs(o), sg = o < 0 ? -1 : 1; return sg * (Math.min(a, 1) * d1() + Math.max(a - 1, 0) * d2()); };
    function equalise() {
      ['.hx-cap__title', '.hx-feats', '.hx-inside', '.hx-cap__note'].forEach(s => {
        const els = caps.map(c => $(s, c)).filter(Boolean);
        els.forEach(e => { e.style.minHeight = ''; });
        const h = Math.max(...els.map(e => e.offsetHeight));
        if (h > 0) els.forEach(e => { e.style.minHeight = h + 'px'; });
      });
    }
    function measure() { if (!frame.clientWidth) return; cfWidth(); width = real[0].offsetWidth; equalise(); paint(); }
    const off = j => mod(j - pos + m / 2, m) - m / 2;
    function paint() {
      if (!width) return;
      const half = frame.clientWidth / 2 + width;
      for (let j = 0; j < m; j++) {
        const o = off(j), d = Math.abs(o), x = xAt(o), sc = 1 - (1 - SMALL) * Math.min(d, 1);
        const op = shown(o), card = all[j], out = Math.abs(x) > half || op < 0.002;
        card.style.transform = 'translate3d(calc(-50% + ' + x.toFixed(2) + 'px),0,0) scale(' + sc.toFixed(4) + ')';
        card.style.opacity = op < 1 ? op.toFixed(3) : '';
        card.style.zIndex = String(100 - Math.round(d * 10));
        card.style.visibility = out ? 'hidden' : '';
        card.style.pointerEvents = out ? 'none' : '';
      }
      setSel(mod(Math.round(pos), m) % n);
    }
    function setSel(i) {
      const j0 = mod(Math.round(pos), m);
      all.forEach((card, j) => card.classList.toggle('is-active', j === j0));
      if (i === sel) return;
      sel = i;
      real.forEach((card, k) => { card.setAttribute('aria-current', k === i ? 'true' : 'false'); card.tabIndex = -1; });
      $$('details.hx-feat[open], details.hx-inc[open]', panel).forEach(d => { d.open = false; });
      caps.forEach((cap, k) => { cap.classList.toggle('is-on', k === i); cap.setAttribute('aria-hidden', k === i ? 'false' : 'true'); cap.inert = k !== i; });
      dots.forEach((d, k) => d.setAttribute('aria-current', k === i ? 'true' : 'false'));
      if (panel.classList.contains('is-on')) setModel(real[i].getAttribute('data-key'));
    }
    function normalise() { const base = Math.floor(target / m) * m; target -= base; pos -= base; }
    function loop(t) {
      const dt = last ? Math.min(t - last, 64) : 16.7; last = t;
      const diff = target - pos;
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
    function goToCard(i, instant) {
      const cur = mod(Math.round(target), m) % n; let delta = mod(i - cur, n);
      if (delta > n / 2) delta -= n;
      settle(Math.round(target) + delta, instant);
    }
    const nudge = by => settle(Math.round(target) + by);
    const choose = () => { const b = $('.hx-cap.is-on .hx-choose', panel); if (b) b.click(); };
    if (prev) prev.addEventListener('click', () => nudge(-1));
    if (next) next.addEventListener('click', () => nudge(1));
    dots.forEach(d => d.addEventListener('click', () => goToCard(+d.getAttribute('data-go'))));
    frame.addEventListener('keydown', e => {
      if (e.key === 'ArrowLeft') { e.preventDefault(); nudge(-1); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); nudge(1); }
      else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); choose(); }
    });
    frame.addEventListener('pointerdown', e => {
      if (e.button !== 0) return;
      if (raf) { cancelAnimationFrame(raf); raf = 0; }
      target = pos; moved = false;
      drag = { id: e.pointerId, x: e.clientX, y: e.clientY, pos, v: 0, t: now(), cap: false };
    });
    frame.addEventListener('pointermove', e => {
      if (!drag || drag.id !== e.pointerId) return;
      const dx = e.clientX - drag.x;
      if (!drag.cap) {
        if (Math.abs(dx) < 6) return;
        if (Math.abs(e.clientY - drag.y) > Math.abs(dx)) { drag = null; return; }
        drag.cap = true; moved = true;
        try { frame.setPointerCapture(e.pointerId); } catch (err) {}
      }
      const pitch = d2() || 1, t = now(), before = pos;
      pos = drag.pos - dx / pitch;
      drag.v = (pos - before) / Math.max(t - drag.t, 1) * 1000; drag.t = t;
      target = pos; paint();
    });
    function endDrag(e) {
      if (!drag || drag.id !== e.pointerId) return;
      const carried = clamp(drag.v * 0.16, -2, 2), wasDrag = drag.cap; drag = null;
      if (wasDrag) settle(Math.round(pos + carried));
    }
    frame.addEventListener('pointerup', endDrag);
    frame.addEventListener('pointercancel', e => { if (drag && drag.id === e.pointerId) { drag = null; settle(Math.round(pos)); } });
    frame.addEventListener('wheel', e => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY) || Math.abs(e.deltaX) < 2) return;
      e.preventDefault();
      if (raf) { cancelAnimationFrame(raf); raf = 0; }
      pos += e.deltaX / (d2() || 1); target = pos; paint();
      clearTimeout(wheelT); wheelT = setTimeout(() => settle(Math.round(pos)), 110);
    }, { passive: false });
    all.forEach((card, j) => card.addEventListener('click', e => {
      if (moved) { e.preventDefault(); moved = false; return; }
      const o = Math.round(off(j));
      if (o !== 0) settle(Math.round(target) + o); else choose();
    }));
    if ('ResizeObserver' in window) new ResizeObserver(() => { if (panel.classList.contains('is-on') && frame.clientWidth) measure(); }).observe(frame);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { if (panel.classList.contains('is-on')) measure(); });
    setSel(start);
    return { panel, measure, goTo: goToCard, index: () => sel, keyAt: i => real[i].getAttribute('data-key'),
             indexOf: k => real.findIndex(c => c.getAttribute('data-key') === k) };
  }

  function progress(step) { $$('.hx-progress li', find).forEach((li, i) => li.classList.toggle('on', i < step)); }
  function setStageHeight(change) {
    const from = stage.classList.contains('is-open') ? stage.offsetHeight : 0;
    change();
    stage.style.height = 'auto';
    const to = stage.offsetHeight;
    if (reduce || from === to) { stage.style.height = ''; return; }
    stage.style.height = from + 'px';
    void stage.offsetHeight;
    stage.style.height = to + 'px';
    const done = e => { if (e && e.target !== stage) return; stage.style.height = ''; stage.removeEventListener('transitionend', done); };
    stage.addEventListener('transitionend', done);
    setTimeout(done, 800);
  }
  const warmed = {};
  function warm(path) {
    if (warmed[path]) return; warmed[path] = true;
    $$('#hx-panel-' + path + ' img').forEach(img => { img.loading = 'eager'; if (img.decode) img.decode().catch(() => {}); });
  }
  function selectPath(path, opts = {}) {
    const rack = racks[path]; if (!rack) return;
    const same = path === curPath;
    curPath = path;
    paths.forEach(b => b.setAttribute('aria-pressed', b.getAttribute('data-path') === path ? 'true' : 'false'));
    $('.hx-paths', find).classList.add('has-choice');
    if (!same) {
      $$('.hx-flip', find).forEach(f => f.classList.remove('is-flipped'));
      setStageHeight(() => {
        stage.classList.add('is-open');
        $$('.hx-panel', stage).forEach(p => p.classList.toggle('is-on', p.getAttribute('data-path') === path));
        rack.measure();
        if (opts.index != null && opts.index >= 0) rack.goTo(opts.index, true);
      });
      warm(path);
    } else if (opts.index != null && opts.index >= 0) rack.goTo(opts.index, true);
    setModel(rack.keyAt(rack.index()));
    progress(2);
    if (!opts.noScroll) setTimeout(() => goTo($('#hx-panel-' + path), 8), reduce ? 0 : 60);
    if (window.ffyTrack) window.ffyTrack('guide_path', { path, page: 'location' });
  }
  if (find) {
    $$('.hx-panel', find).forEach(p => { racks[p.getAttribute('data-path')] = Rack(p); });
    paths.forEach(b => b.addEventListener('click', () => selectPath(b.getAttribute('data-path'))));
    $$('.hx-choose', find).forEach(b => b.addEventListener('click', () => {
      progress(3);
      if (window.ffyTrack) window.ffyTrack('guide_choose', { system: b.getAttribute('data-sys'), page: 'location' });
    }));
    if ('IntersectionObserver' in window) {
      const near = new IntersectionObserver(es => {
        if (!es[0].isIntersecting) return; near.disconnect();
        warm('drink');
        const idle = window.requestIdleCallback || (f => setTimeout(f, 600));
        idle(() => { warm('home'); warm('deluxe'); }, { timeout: 3000 });
      }, { rootMargin: '0px 0px 200px 0px' });
      near.observe($('.hx-paths', find));
    }
    
    const POPS = 'details.hx-feat, details.hx-inc';
    const closeAll = keep => $$(POPS, find).forEach(o => { if (o !== keep) o.open = false; });
    $$(POPS, find).forEach(d => {
      d.addEventListener('toggle', () => { if (d.open) closeAll(d); });
      if (d.classList.contains('hx-inc') && matchMedia('(hover:hover) and (pointer:fine)').matches) {
        let t = 0;
        d.addEventListener('mouseenter', () => { clearTimeout(t); d.open = true; });
        d.addEventListener('mouseleave', () => { clearTimeout(t); t = setTimeout(() => { d.open = false; }, 160); });
        $('summary', d).addEventListener('click', e => { if (d.open) e.preventDefault(); });
      }
    });
    document.addEventListener('click', e => { if (!e.target.closest('.hx-feat, .hx-inc')) closeAll(null); });
    document.addEventListener('keydown', e => {
      if (e.key !== 'Escape') return;
      const open = $$(POPS + '[open]', find)[0];
      if (open) { open.open = false; $('summary', open).focus(); }
    });
    
    const flip = (panel, on) => {
      const box = $('.hx-flip', panel), front = $('.hx-flip__front', box), back = $('.hx-flip__back', box);
      const btn = $('[data-hx-compare]', panel);
      if (box.classList.contains('is-flipped') === on || box.dataset.turning) return;
      if (btn) btn.setAttribute('aria-expanded', on ? 'true' : 'false');
      const outgoing = on ? front : back, incoming = on ? back : front;
      if (reduce || !box.animate) { box.classList.toggle('is-flipped', on); if (!on) racks[panel.getAttribute('data-path')].measure(); return; }
      box.dataset.turning = '1';
      const h0 = box.getBoundingClientRect().height;
      const a = outgoing.animate([{ transform: 'rotateY(0deg)', opacity: 1 }, { transform: 'rotateY(' + (on ? -90 : 90) + 'deg)', opacity: .6 }], { duration: 240, easing: 'cubic-bezier(.55,0,.8,.45)' });
      a.onfinish = () => {
        box.classList.toggle('is-flipped', on);
        if (!on) racks[panel.getAttribute('data-path')].measure();
        const h1 = box.getBoundingClientRect().height;
        box.style.overflow = 'hidden';
        const hA = box.animate([{ height: h0 + 'px' }, { height: h1 + 'px' }], { duration: 560, easing: 'cubic-bezier(.22,1,.36,1)' });
        hA.onfinish = hA.oncancel = () => { box.style.overflow = ''; };
        const b = incoming.animate([{ transform: 'rotateY(' + (on ? 90 : -90) + 'deg)', opacity: .6 }, { transform: 'rotateY(0deg)', opacity: 1 }], { duration: 620, easing: 'cubic-bezier(.2,1.25,.35,1)' });
        b.onfinish = b.oncancel = () => { delete box.dataset.turning; };
        const top = panel.getBoundingClientRect().top;
        if (top < 0 || top > innerHeight * 0.4) goTo(panel, 8);
      };
      if (window.ffyTrack && on) window.ffyTrack('guide_compare', { path: panel.getAttribute('data-path'), page: 'location' });
    };
    $$('.hx-panel', find).forEach(panel => {
      const open = $('[data-hx-compare]', panel), close = $('[data-hx-compare-close]', panel);
      if (open) open.addEventListener('click', () => flip(panel, true));
      if (close) close.addEventListener('click', () => flip(panel, false));
      $$('[data-cmp]', panel).forEach(b => b.addEventListener('click', () => {
        const rack = racks[panel.getAttribute('data-path')];
        flip(panel, false);
        setTimeout(() => rack.goTo(rack.indexOf(b.getAttribute('data-cmp')), true), reduce ? 0 : 260);
      }));
      $$('.hx-cmp tbody tr', panel).forEach((tr, r) => $$('.hx-yes', tr).forEach(y => y.style.setProperty('--r', r)));
    });
  }

  
  let pending = $$('.lp3 .hx-rise, .lp3 .hx-pop, .lp3 [data-hx-count]');
  function count(el) {
    const to = parseFloat(el.getAttribute('data-hx-count')), from = parseFloat(el.getAttribute('data-hx-from') || '0');
    const pre = el.getAttribute('data-hx-prefix') || '', dur = parseFloat(el.getAttribute('data-hx-dur') || '1500');
    const show = v => { el.textContent = pre + Math.round(v).toLocaleString('en-AU'); };
    show(from); el.style.visibility = '';
    const t0 = now() + 120;
    (function tick() { const p = clamp((now() - t0) / dur, 0, 1); show(from + (to - from) * easeOut(p)); if (p < 1) requestAnimationFrame(tick); })();
  }
  const reveal = el => el.hasAttribute('data-hx-count') ? count(el) : el.classList.add('is-in');
  function scan() {
    if (!pending.length) return;
    const line = innerHeight * 0.9;
    pending = pending.filter(el => {
      if (!el.isConnected) return false;
      if (!el.offsetParent && el.getClientRects().length === 0) return true;
      const r = el.getBoundingClientRect();
      if (r.top < line || r.bottom < 0) { reveal(el); return false; }
      return true;
    });
  }
  let scanRaf = 0;
  const queueScan = () => { if (!scanRaf) scanRaf = requestAnimationFrame(() => { scanRaf = 0; scan(); }); };
  if (reduce) { pending.forEach(el => el.classList.add('is-in')); pending = []; }
  else {
    pending.forEach(el => { if (el.hasAttribute('data-hx-count')) el.style.visibility = 'hidden'; });
    addEventListener('scroll', queueScan, { passive: true });
    addEventListener('resize', queueScan);
    queueScan(); setTimeout(queueScan, 600);
  }

  
  const barEl = $('#lp-bar');
  function bar(r) {
    if (!barEl) return;
    $('small', barEl).textContent = r.price.replace('From ', 'from ') + (matchMedia('(min-width:860px)').matches ? ' installed' : ''); $('[data-lp-bar-name]', barEl).textContent = r.name;
    const im = $('.lp-bar__img img', barEl); if (im.getAttribute('src') !== r.img) im.src = r.img;
    $('[data-lp-bar-cta]', barEl).dataset.sys = r.sys;
  }
  let barQueued = false;
  function barCheck() {
    barQueued = false; if (!barEl) return;
    const vh = innerHeight, inView = el => { if (!el) return false; const b = el.getBoundingClientRect(); return b.top < vh && b.bottom > 0; };
    const fr = find?.getBoundingClientRect();
    const past = fr && fr.top < vh * 0.2;
    const cta = $('.hx-panel.is-on .hx-cap.is-on .hx-choose', find || document);
    const off = !past || inView(cta) || inView($('.hx-paths', find || document)) || inView($('#quote')) || inView($('footer'));
    barEl.hidden = false; barEl.classList.toggle('off', off);
  }
  addEventListener('scroll', () => { if (!barQueued) { barQueued = true; requestAnimationFrame(barCheck); } }, { passive: true });
  addEventListener('resize', barCheck);

  
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } }), { threshold: 0.35 });
  $$('.lp .lp-seals, [data-lp-steps], [data-lp-years], [data-lp-map], [data-lp-visits]').forEach(el => reduce ? el.classList.add('is-in') : io.observe(el));
  
  $$('.lp-flow2').forEach(el => { const set = () => el.style.setProperty('--flow-h', el.offsetHeight + 'px'); set(); addEventListener('resize', set); });
  
  addEventListener('scroll', () => { $$('.lp .lp-seals:not(.is-in), [data-lp-steps]:not(.is-in), [data-lp-years]:not(.is-in), [data-lp-map]:not(.is-in), [data-lp-visits]:not(.is-in)').forEach(el => { if (el.getBoundingClientRect().bottom < 0) el.classList.add('is-in'); }); }, { passive: true });

  
  const form = (() => {
    const q = $('[data-qform]'); if (!q) return { pick() {} };
    const f = $('form', q), panes = $$('[data-step]', q), dots = $$('.steps i', q);
    const nextLabel = $('[data-nextlabel]', q), back = $('[data-back]', q), send = $('[data-next]', q), error = $('[role=alert]', q);
    const card = $('[data-lp-chosen]', q), preview = f.hasAttribute('data-preview');
    const sysBtns = $$('[data-step="1"] .sysopt', q), whenBtns = $$('.lp-when__b', q);
    let step = 0, system = '', when = '', sending = false, started = false;
    const hidden = (n, v) => { let i = f.elements[n]; if (!i) { i = document.createElement('input'); i.type = 'hidden'; i.name = n; f.append(i); } i.value = v; };
    let formAnim = null;
    function show(n) {
      const moved = n !== step && !reduce && started0;
      const from = moved ? f.offsetHeight : 0;
      step = n; panes.forEach((p, i) => p.hidden = i !== n); dots.forEach((d, i) => d.classList.toggle('on', i <= n));
      back.hidden = n === 0; nextLabel.textContent = n === 2 ? 'Request my installation date' : 'Next';
      error.hidden = true;
      if (!moved) return;
      const pane = panes[n]; pane.classList.remove('is-enter'); void pane.offsetWidth; pane.classList.add('is-enter');
      if (formAnim) formAnim.cancel();
      const to = f.offsetHeight; f.style.overflow = 'hidden';
      formAnim = f.animate({ height: [from + 'px', to + 'px'] }, { duration: 420, easing: 'cubic-bezier(.22,1,.36,1)' });
      formAnim.onfinish = formAnim.oncancel = () => { f.style.overflow = ''; formAnim = null; };
    }
    let started0 = false;
    function summary() {
      const r = bySys[system];
      const appear = r && card.hidden && started0 && !reduce;
      card.hidden = !r;
      if (appear) { card.classList.remove('is-enter'); void card.offsetWidth; card.classList.add('is-enter'); }
      if (r) { $('img', card).src = r.img; $('[data-lp-chosen-name]', card).textContent = r.name; $('[data-lp-chosen-price]', card).textContent = r.price + ' installed'; }
    }
    function pick(v, quiet) {
      q.classList.remove('finished'); system = v || '';
      sysBtns.forEach(b => { const on = b.dataset.v === system; b.classList.toggle('on', on); b.setAttribute('aria-pressed', on); });
      summary();
    }
    sysBtns.forEach(b => b.addEventListener('click', () => { pick(b.dataset.v); error.hidden = true; window.ffyTrack && window.ffyTrack('system_select', { system, form: 'location' }); }));
    whenBtns.forEach(b => b.addEventListener('click', () => {
      when = b.getAttribute('aria-pressed') === 'true' ? '' : b.dataset.when;
      whenBtns.forEach(o => { const on = o.dataset.when === when; o.classList.toggle('on', on); o.setAttribute('aria-pressed', on); });
    }));
    back.addEventListener('click', () => show(Math.max(0, step === 2 && system && bySys[system] ? 0 : step - 1)));
    $('[data-lp-change]', q)?.addEventListener('click', () => show(1));
    document.addEventListener('click', e => {
      const b = e.target.closest('.js-open, [data-lp-help]'); if (!b) return;
      e.preventDefault(); e.stopImmediatePropagation();
      const v = b.dataset.sys || ''; if (v || b.hasAttribute('data-lp-help')) pick(v);
      const suburbOk = f.elements.suburb?.checkValidity();
      show(system ? (suburbOk ? 2 : 0) : (suburbOk ? 1 : 0));
      goTo($('#quote'), 0);
    }, true);
    f.elements.phone && (f.elements.phone.pattern = '[0-9 +()]{8,18}');
    const message = () => [`${system || 'Not sure yet'} installation request.`, `Suburb: ${f.elements.suburb?.value || ''}.`, when ? `Timing: ${when}.` : '', `From the ${main.querySelector('h1 .cp-place')?.textContent.replace('.', '') || slug} page.`].filter(Boolean).join(' ');
    f.addEventListener('submit', async e => {
      e.preventDefault(); if (sending) return;
      if (!started) { started = true; window.ffyTrack && window.ffyTrack('form_start', { form: 'location' }); }
      for (const i of $$('input:not([type=hidden])', panes[step])) if (!i.reportValidity()) return;
      if (step === 0) { show(system ? 2 : 1); return; }
      if (step === 1) { if (!system) { error.textContent = 'Please choose a system, or Help me choose.'; error.hidden = false; return; } show(2); return; }
      if (!f.elements.suburb.checkValidity()) { show(0); f.elements.suburb.reportValidity(); return; }
      hidden('system', system || 'Not sure yet'); hidden('installation_preference', when); hidden('message', message());
      hidden('_subject', `${system || 'Installation'} request, ${f.elements.suburb.value}`);
      if (window.ffyStampForm) window.ffyStampForm(f);
      sending = true; send.disabled = true; nextLabel.textContent = 'Sending…'; error.hidden = true;
      const done = () => { q.classList.add('finished'); $('.done', q)?.setAttribute('role', 'status'); window.ffyLeadSuccess && window.ffyLeadSuccess(f, { form: 'location', label: 'location_' + slug, system: system || 'not chosen' }); };
      if (preview && !window.__LP_QA) {
        q.classList.add('finished'); const d = $('.done', q);
        $('b', d).textContent = 'Preview only. Nothing was sent.'; $('p', d).textContent = message();
        d.setAttribute('role', 'status'); sending = false; send.disabled = false; nextLabel.textContent = 'Request my installation date'; return;
      }
      const fail = () => { error.textContent = 'That did not send. Please try again, or call 0430 546 749.'; error.hidden = false; nextLabel.textContent = 'Try again'; };
      try {
        const r = await fetch(f.action, { method: 'POST', body: new FormData(f), headers: { Accept: 'application/json' } });
        r.ok ? done() : fail();
      } catch (err) {
        
        if (!preview) { try { f.submit(); return; } catch (x) {} }
        fail();
      } finally { sending = false; send.disabled = false; }
    });
    show(0); started0 = true;
    return { pick };
  })();

  
  
  $$('details:not(.hx-feat):not(.hx-inc)', main).forEach(d => {
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
      if (!d.open || closing) { closing = false; d.open = true; to = d.offsetHeight; d.classList.add('is-open'); }
      else { closing = true; to = closedH(); d.classList.remove('is-open'); }
      anim = d.animate({ height: [from + 'px', to + 'px'] }, { duration: 420, easing: 'cubic-bezier(.22,1,.36,1)' });
      anim.onfinish = () => { anim = null; if (closing) { d.open = false; closing = false; } d.style.overflow = ''; };
    });
    if (d.open) d.classList.add('is-open');
  });

  
  if (!reduce) {
    const drift = $$('[data-lp-parallax]', main), grow = $$('.lp-near3 .syd__fr', main), live = new Set();
    const seen = new IntersectionObserver(es => es.forEach(e => e.isIntersecting ? live.add(e.target) : live.delete(e.target)), { rootMargin: '10% 0px' });
    drift.forEach(el => seen.observe(el)); grow.forEach(el => seen.observe(el));
    let queued = false;
    const frame = () => {
      queued = false; const vh = innerHeight;
      live.forEach(el => {
        const box = (el.closest('.lp-sys__img, .lp-water2__photo, .lp-visit--photo, .syd__fr, .lp-intro__local') || el).getBoundingClientRect();
        if (el.matches('.syd__fr')) { const k = Math.min(1, Math.max(0, (vh - box.top) / (vh * .7))); el.style.setProperty('--lp-s', (.94 + .06 * k).toFixed(4)); return; }
        const p = ((box.top + box.height / 2) - vh / 2) / (vh / 2 + box.height / 2);
        el.style.setProperty('--lp-p', Math.max(-1, Math.min(1, p)).toFixed(4));
      });
    };
    const ask = () => { if (!queued) { queued = true; requestAnimationFrame(frame); } };
    addEventListener('scroll', ask, { passive: true }); addEventListener('resize', ask); ask();
    const rise = $$('.lp-intro__copy > .lp-kick, .lp-intro__copy > .d2, .lp-sysband__head > *, .lp-water2__copy > .lp-kick, .lp-water2__copy > .d2, .lp-care2__head > div > .lp-kick, .lp-care2__head > div > .d2, .lp-near__copy > .lp-kick, .lp-near__copy > .d2', main);
    const rio = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-in'); rio.unobserve(e.target); } }), { threshold: 0.2 });
    rise.forEach(el => { el.classList.add('lp-rise'); rio.observe(el); });
    addEventListener('scroll', () => rise.forEach(el => { if (!el.classList.contains('is-in') && el.getBoundingClientRect().bottom < 0) el.classList.add('is-in'); }), { passive: true });
  }


  
  const want = new URLSearchParams(location.search).get('system');
  const start = want && byKey[want] ? byKey[want] : null;
  if (start) {
    chosen[start.mode] = start.key; setMode(start.mode);
    const path = PATH_OF[start.mode];
    if (racks[path]) selectPath(path, { noScroll: true, index: racks[path].indexOf(start.key) });
  } else setMode('every');
  form.pick('', true);
  barCheck();
  lockHero();
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
    if (window.ffyTrack) window.ffyTrack('filtered_for_free_open', { page: 'location' });
  });
  d.addEventListener('close', function () { document.documentElement.classList.remove('hx-fff-on'); btn.focus({ preventScroll: true }); });
  d.addEventListener('cancel', function (e) { e.preventDefault(); shut(); });
  d.querySelector('[data-hx-fff-close]').addEventListener('click', shut);
  d.addEventListener('click', function (e) { if (e.target === d) shut(); });
})();
