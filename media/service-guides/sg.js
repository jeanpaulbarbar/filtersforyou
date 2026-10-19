(() => {
  'use strict';
  const root = document.getElementById('sg-page'); if (!root) return;
  document.documentElement.classList.add('sg-js');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const clamp = (v, a = 0, b = 1) => v < a ? a : (v > b ? b : v);

  
  
  let lenis = null;
  const mph = matchMedia('(max-width:859px)').matches;
  if (!reduce && typeof Lenis !== 'undefined' && matchMedia('(pointer:fine)').matches && !mph) {
    lenis = new Lenis({ duration: 1.35, smoothWheel: true, syncTouch: false, wheelMultiplier: 1.0,
      easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    document.documentElement.classList.add('lenis');
    window.lenis = lenis;
    const raf = t => { lenis.raf(t); requestAnimationFrame(raf); }; requestAnimationFrame(raf);
    
    new MutationObserver(() => { document.body.classList.contains('mopen') ? lenis.stop() : lenis.start(); })
      .observe(document.body, { attributes: true, attributeFilter: ['class'] });
  }
  $$('dialog, .msheet').forEach(d => d.setAttribute('data-lenis-prevent', ''));

  const hdrH = () => (document.getElementById('hdr')?.offsetHeight || 72);
  function goTo(el, gap = 16) {
    if (!el) return;
    const y = el.getBoundingClientRect().top + scrollY - hdrH() - gap;
    if (lenis) { lenis.resize(); lenis.scrollTo(y, { duration: 1.1, force: true }); }
    else scrollTo({ top: y, behavior: reduce ? 'instant' : 'smooth' });
  }
  
  window.ffyGoTo = el => goTo(el, 16);
  root.addEventListener('click', e => {
    const a = e.target.closest('a[href^="#"]'); if (!a || e.defaultPrevented) return;
    const id = a.getAttribute('href').slice(1); const el = id && document.getElementById(id);
    if (!el) return;
    e.preventDefault(); goTo(el, 12);
    if (history.replaceState) history.replaceState(null, '', '#' + id);
  });

  
  
  
  
  const ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  const hooks = [];
  const scenes = $$('[data-sg-scene]', root).map(el => ({ el, p: 0, t0: 0, done: false, mode: el.dataset.mode || 'play',
    dur: parseFloat(el.dataset.dur || '2000'), steps: $$('[data-at]', el) }));
  const lite = (s, st) => { if (!st.classList.contains('is-lit')) { st.classList.add('is-lit'); hooks.forEach(h => h.lit && h.lit(s, st)); } };
  const paint = s => {
    s.el.style.setProperty('--p', s.p.toFixed(4));
    if (s.mode === 'play') s.steps.forEach(st => { if (s.p >= parseFloat(st.dataset.at) - 1e-4) lite(s, st); });
    hooks.forEach(h => h.paint && h.paint(s));
    if (s.p >= 1 && !s.done) { s.done = true; s.el.classList.add('is-done'); s.steps.forEach(st => lite(s, st)); }
  };
  const finish = s => { s.el.classList.add('is-on'); s.p = 1; paint(s); };
  let pending = false;
  const frame = now => {
    pending = false;
    const vh = innerHeight, read = vh * .64; let again = false;
    scenes.forEach(s => {
      if (s.done || reduce) return;
      const r = s.el.getBoundingClientRect(); if (!r.height) return;
      if (r.bottom < 0) { finish(s); return; }
      if (s.mode === 'track') {
        s.steps.forEach(st => { if (st.classList.contains('is-lit')) return; const b = st.getBoundingClientRect(); if (b.top + Math.min(b.height, 160) * .5 < read) lite(s, st); });
        const p = clamp((vh * .82 - r.top) / (r.height + vh * .32));
        hooks.forEach(h => h.track && h.track(s, read));
        if (p > s.p) { s.p = p; paint(s); }
      } else {
        if (!s.t0 && r.top < vh * .8 && r.bottom > vh * .08) { s.t0 = now; s.el.classList.add('is-on'); hooks.forEach(h => h.start && h.start(s)); }
        if (s.t0) { const k = clamp((now - s.t0) / s.dur); s.p = ease(k); paint(s); if (k < 1) again = true; }
      }
    });
    if (again) kick();
  };
  const kick = () => { if (!pending) { pending = true; requestAnimationFrame(frame); } };

  
  
  const year = $('[data-sg-year]', root);
  if (year) {
    const months = [0, 4, 8, 12, 13];
    const clock = $('[data-sg-clock]', year);
    let mNow = -1;
    const setM = m => {
      if (m <= mNow) return; mNow = m;
      const fresh = m >= 12.5;
      year.style.setProperty('--lv', fresh ? 0 : (Math.min(m, 12) / 12).toFixed(4));
      year.style.setProperty('--lm', (Math.min(m, 12) / 12).toFixed(4));
      year.classList.toggle('is-fresh', fresh);
      const txt = fresh ? 'Service day' : (m < .5 ? 'Install day' : 'Month ' + Math.max(1, Math.round(m)));
      if (clock && clock.textContent !== txt) clock.textContent = txt;
    };
    hooks.push({
      track(s, read) {
        if (s.el !== year) return;
        const st = s.steps.map(x => { const b = x.getBoundingClientRect(); return b.top + Math.min(b.height, 160) * .5; });
        let m = 0;
        if (read >= st[st.length - 1]) m = 13;
        else for (let i = 0; i < st.length - 1; i++) if (read >= st[i] && read < st[i + 1]) { m = months[i] + (read - st[i]) / (st[i + 1] - st[i]) * (months[i + 1] - months[i]); break; }
        setM(m);
      },
      paint(s) { if (s.el === year && s.p >= 1) setM(13); }
    });
    $$('.sg-cart', year).forEach((c, i) => c.style.setProperty('--ci', i % 8));
    if (!reduce) { year.classList.add('sg-armed'); year.style.setProperty('--lv', 0); year.style.setProperty('--lm', 0); if (clock) clock.textContent = 'Install day'; }
  }

  
  const valve = $('[data-sg-valve]', root);
  if (valve) {
    hooks.push({
      paint(s) { if (s.el === valve) valve.classList.toggle('is-open', s.p < .2 && !s.done); },
      lit(s, st) { if (s.el === valve && st.dataset.act) valve.classList.add('is-' + st.dataset.act); }
    });
    if (!reduce) { valve.classList.add('sg-armed', 'is-open'); }
  }

  
  const calc = $('[data-sg-calc]', root);
  const ring = calc && $('.sg-ring', calc);
  let ringOn = false, ringDraw = () => {};
  if (calc) {
    const out = k => $(`[data-sg-out="${k}"]`, calc);
    const MEM = { essential: 1, premium: 1, luxe: 1, 'other-ro': 1 };
    const st = { sys: 'premium', other: 'other-ro', people: 4, usage: 'moderate', date: '' };
    const arcAll = $('.sg-ring__arc--all', calc), arcSed = $('.sg-ring__arc--sed', calc), now = $('.sg-ring__now', calc);
    const want = { all: 1, sed: 1, a: 0, has: false };
    ringDraw = () => {
      if (!ringOn) return;
      arcAll.style.strokeDasharray = `${(want.all * 100).toFixed(2)} 200`;
      arcSed.style.strokeDasharray = `${(want.sed * 100).toFixed(2)} 200`;
      now.style.setProperty('--a', want.a.toFixed(1) + 'deg');
      ring.classList.toggle('has-now', want.has);
    };
    const set = (k, v) => { const el = out(k); if (el && el.textContent !== v) el.textContent = v; };
    const months = m => m === 1 ? 'Every month' : `Every ${m} months`;
    const fmt = d => d.toLocaleDateString('en-AU', { month: 'long', year: 'numeric' });
    const res = $('.sg-res', calc);
    let resAnim = null;
    function run() {
      const h0 = res.offsetHeight;
      calcRun();
      const h1 = res.offsetHeight;
      if (resAnim) { resAnim.cancel(); resAnim = null; }
      if (!reduce && h0 && h0 !== h1 && res.animate) {
        res.style.overflow = 'hidden';
        resAnim = res.animate([{ height: h0 + 'px' }, { height: h1 + 'px' }], { duration: 480, easing: 'cubic-bezier(.45,0,.2,1)' });
        resAnim.onfinish = () => { resAnim = null; res.style.overflow = ''; };
        $$('.sg-res__r:not([hidden])', res).forEach(r => { if (r.dataset.was === '0') r.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 380, easing: 'ease-out' }); });
      }
      $$('.sg-res__r', res).forEach(r => { r.dataset.was = r.hidden ? '0' : '1'; });
    }
    function calcRun() {
      const sys = st.sys === 'other' ? st.other : st.sys;
      const mult = st.usage === 'light' ? 1.3 : st.usage === 'heavy' ? .7 : 1;
      const pm = clamp(1 - (st.people - 4) * .06, .5, 1.4);
      const sed = Math.max(6, Math.min(12, Math.round(12 * mult * pm)));
      set('all', 'Every 12 months'); set('sed', months(sed));
      const memRow = $('[data-sg-row="membrane"]', calc); memRow.hidden = !MEM[sys];
      const pr = out('prices');
      if (sys.startsWith('other')) { pr.textContent = 'We quote it first'; pr.setAttribute('href', '#pg-contact'); }
      else { pr.textContent = 'See below'; pr.setAttribute('href', '#care'); }
      want.sed = sed / 12;
      const nextRow = $('[data-sg-row="next"]', calc);
      ring.classList.remove('is-due');
      if (st.date) {
        const d0 = new Date(st.date + 'T00:00:00'), due = new Date(d0); due.setMonth(due.getMonth() + 12);
        const today = new Date(); today.setHours(0, 0, 0, 0);
        const total = (due - d0) / 864e5, gone = clamp((today - d0) / 864e5 / total);
        const left = Math.round((due - today) / 864e5);
        nextRow.hidden = false; set('next', fmt(due));
        want.all = Math.max(gone, .002); want.a = gone * 360; want.has = true;
        if (left < 0) { set('kick', 'Your service is'); set('fig', 'Due'); set('unit', `Overdue by ${-left} days`); ring.classList.add('is-due'); }
        else if (left < 60) { set('kick', 'Next change in'); set('fig', String(left)); set('unit', left === 1 ? 'day' : 'days'); }
        else { const mo = Math.round(left / 30.44); set('kick', 'Next change in'); set('fig', String(mo)); set('unit', mo === 1 ? 'month' : 'months'); }
      } else {
        nextRow.hidden = true; want.all = 1; want.a = 0; want.has = false;
        set('kick', 'Every cartridge'); set('fig', '12'); set('unit', 'months');
      }
      ringDraw();
    }
    
    calc.addEventListener('fb:pick', e => {
      if (!e.target || e.target.id !== 'calc-sys') return;
      st.sys = e.detail.key; run();
      const t = document.querySelector(`[data-fb-picker="care-costs"] [data-fb-pick="${st.sys}"]`);
      if (t && t.getAttribute('aria-pressed') !== 'true') t.click();
    });
    $$('input[name="calc-other"]', calc).forEach(r => r.addEventListener('change', () => { st.other = r.value; run(); }));
    const pv = $('#calc-people', calc), dots = $$('.sg-people i', calc), bMinus = $('[data-sg-people="-1"]', calc), bPlus = $('[data-sg-people="1"]', calc);
    const people = n => {
      st.people = clamp(n, 1, 8);
      pv.innerHTML = `<b>${st.people}</b> <span>${st.people === 1 ? 'person' : 'people'}</span>`;
      dots.forEach((d, i) => d.classList.toggle('is-on', i < st.people));
      bMinus.disabled = st.people <= 1; bPlus.disabled = st.people >= 8; run();
    };
    bMinus.addEventListener('click', () => people(st.people - 1));
    bPlus.addEventListener('click', () => people(st.people + 1));
    $$('input[name="calc-usage"]', calc).forEach(r => r.addEventListener('change', () => {
      st.usage = r.value; $$('[data-usage]', calc).forEach(x => { x.hidden = x.dataset.usage !== st.usage; }); run();
    }));
    const di = $('#calc-date', calc);
    const today = new Date(); di.max = today.toISOString().slice(0, 10);
    di.addEventListener('change', () => { st.date = di.value || ''; run(); });
    di.addEventListener('input', () => { st.date = di.value || ''; run(); });
    people(4);
    
    if (reduce) { ringOn = true; ringDraw(); }
    else {
      ring.classList.add('sg-armed');
      arcAll.style.strokeDasharray = '0 200'; arcSed.style.strokeDasharray = '0 200';
      hooks.push({ start(s) { if (s.el === ring) { ringOn = true; setTimeout(ringDraw, 30); } },
                   paint(s) { if (s.el === ring && s.done && !ringOn) { ringOn = true; ringDraw(); } } });
    }
  }

  
  $$('[data-sg-sym]', root).forEach(box => {
    const tiles = $$('.sg-sym__t', box), wrap = $('.sg-sym__panels', box), panels = $$('.sg-sym__p', box);
    let grow = null, seen = false;
    const show = p => { p.classList.remove('is-shown'); if (reduce) { p.classList.add('is-shown'); return; } requestAnimationFrame(() => requestAnimationFrame(() => p.classList.add('is-shown'))); };
    const set = (t, focus) => {
      const k = t.dataset.key, h0 = wrap.offsetHeight;
      tiles.forEach(x => { const on = x === t; x.setAttribute('aria-checked', on ? 'true' : 'false'); x.tabIndex = on ? 0 : -1; });
      if (focus) t.focus();
      panels.forEach(p => { const on = p.dataset.key === k; p.classList.toggle('is-on', on); if (!on) p.classList.remove('is-shown'); });
      const p = panels.find(x => x.dataset.key === k); if (p && seen) show(p);
      const h1 = wrap.offsetHeight;
      if (grow) { grow.cancel(); grow = null; }
      if (!reduce && h0 && h0 !== h1 && wrap.animate) { grow = wrap.animate([{ height: h0 + 'px' }, { height: h1 + 'px' }], { duration: 420, easing: 'cubic-bezier(.22,1,.36,1)' }); grow.onfinish = () => { grow = null; }; }
      window.ffyTrack && window.ffyTrack('repair_symptom', { key: k });
    };
    tiles.forEach((t, i) => {
      t.addEventListener('click', () => { if (t.getAttribute('aria-checked') !== 'true') set(t, false); });
      t.addEventListener('keydown', e => {
        const k = e.key; let j = null;
        if (k === 'ArrowRight' || k === 'ArrowDown') j = i + 1; else if (k === 'ArrowLeft' || k === 'ArrowUp') j = i - 1;
        else if (k === 'Home') j = 0; else if (k === 'End') j = tiles.length - 1;
        if (j === null) return; e.preventDefault(); set(tiles[(j + tiles.length) % tiles.length], true);
      });
    });
    
    const first = () => { if (seen) return; seen = true; const p = panels.find(x => x.classList.contains('is-on')); if (p) show(p); };
    if (reduce || !('IntersectionObserver' in window)) first();
    else {
      const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting || e.boundingClientRect.bottom < 0) { first(); io.disconnect(); } }), { threshold: .15 });
      io.observe(wrap);
      addEventListener('scroll', function f() { if (wrap.getBoundingClientRect().top < innerHeight * .7) { first(); removeEventListener('scroll', f); } }, { passive: true });
    }
  });

  
  const faqs = $$('.faq-item', root);
  if (faqs.length && !reduce) {
    root.addEventListener('click', e => {
      const q = e.target.closest('.faq-q'); if (!q) return;
      const before = faqs.map(f => { const a = $('.faq-a', f); return a ? a.getBoundingClientRect().height : 0; });
      requestAnimationFrame(() => faqs.forEach((f, i) => {
        const a = $('.faq-a', f); if (!a || !a.animate) return;
        const h = a.getBoundingClientRect().height; if (Math.abs(h - before[i]) < 1) return;
        a.getAnimations().forEach(x => x.cancel());
        a.animate([{ maxHeight: before[i] + 'px', height: before[i] + 'px' }, { maxHeight: h + 'px', height: h + 'px' }],
          { duration: 460, easing: 'cubic-bezier(.22,1,.36,1)' });
      }));
    }, true);
  }

  
  const toc = $('.sg-toc', root);
  if (toc) {
    const links = $$('a[href^="#"]', toc), heads = links.map(a => document.getElementById(a.getAttribute('href').slice(1))).filter(Boolean);
    let cur = null, tp = false;
    const mark = () => {
      tp = false; let on = null;
      heads.forEach((h, i) => { if (h.getBoundingClientRect().top < innerHeight * .35) on = links[i]; });
      if (on !== cur) { links.forEach(a => a.classList.toggle('is-on', a === on)); cur = on; }
    };
    addEventListener('scroll', () => { if (!tp) { tp = true; requestAnimationFrame(mark); } }, { passive: true });
    mark();
  }

  
  if (reduce) scenes.forEach(finish);
  else {
    scenes.forEach(s => {
      s.el.classList.add('sg-armed');
      const r = s.el.getBoundingClientRect();
      if (r.bottom < 0) { finish(s); return; }
      s.p = 0; s.el.style.setProperty('--p', 0);
    });
    addEventListener('scroll', kick, { passive: true }); addEventListener('resize', kick);
    if (lenis) lenis.on('scroll', kick);
    kick(); addEventListener('load', kick);
  }
})();
