(() => {
  'use strict';
  const root = document.getElementById('water-page'); if (!root) return;
  document.documentElement.classList.add('wg-js', 'wy-js');
  window.__wgReady = true;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  let DATA = {};
  try { DATA = JSON.parse($('#wg-data')?.textContent || '{}'); } catch (e) { DATA = {}; }
  const page = root.dataset.page || '';

  
  
  let lenis = null;
  const mph = matchMedia('(max-width:859px)').matches;
  if (!reduce && typeof Lenis !== 'undefined' && matchMedia('(pointer:fine)').matches && !mph) {
    lenis = new Lenis({ duration: 1.35, smoothWheel: true, syncTouch: false, wheelMultiplier: 1.0,
      easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    document.documentElement.classList.add('lenis');
    window.lenis = lenis;
    const raf = t => { lenis.raf(t); requestAnimationFrame(raf); }; requestAnimationFrame(raf);
  }
  const hdrH = () => (document.getElementById('hdr')?.offsetHeight || 72);
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

  
  const fmt = (n, d) => d ? n.toFixed(d) : Math.round(n).toLocaleString('en-AU');
  function countUp(el) {
    if (el.dataset.done) return; el.dataset.done = '1';
    const to = parseFloat(el.dataset.count), d = parseInt(el.dataset.dec || '0', 10);
    const node = el.firstChild && el.firstChild.nodeType === 3 ? el.firstChild : null;
    if (!node || reduce || !isFinite(to)) return;
    const t0 = performance.now(), dur = 1100;
    const tick = t => { const p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 3); node.textContent = fmt(to * e, d); if (p < 1) requestAnimationFrame(tick); else node.textContent = fmt(to, d); };
    node.textContent = fmt(0, d); requestAnimationFrame(tick);
  }

  
  const anims = $$('[data-wg-anim]', root), ios = $$('[data-wg-io]', root);
  anims.forEach(el => [...el.children].forEach((c, i) => { if (!c.style.getPropertyValue('--i')) c.style.setProperty('--i', i); }));
  const reveal = el => { el.classList.add('is-in'); $$('[data-count]', el).forEach(countUp); };
  const all = [...anims, ...ios, ...$$('[data-wy-anim]', root)];
  if (reduce || !('IntersectionObserver' in window)) all.forEach(reveal);
  else {
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { reveal(e.target); io.unobserve(e.target); } }), { threshold: 0.01 });
    all.forEach(el => io.observe(el));
    const sweep = () => all.forEach(el => { if (!el.classList.contains('is-in') && el.getBoundingClientRect().top < innerHeight * 0.6) reveal(el); });
    addEventListener('scroll', sweep, { passive: true }); sweep();
  }

  
  
  
  const clamp = (v, a = 0, b = 1) => v < a ? a : (v > b ? b : v);
  const ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  const scenes = $$('[data-wg-scene]', root).map(el => ({ el, p: 0, t0: 0, from: 0, done: false, dur: parseFloat(el.dataset.dur || '2400'),
    steps: $$('[data-at]', el), segs: $$('[data-seg]', el), mode: el.dataset.mode || '' }));
  
  const lite = (s, st) => { st.classList.add('is-lit'); if (st.dataset.pair != null) $$(`[data-pair-of="${st.dataset.pair}"]`, s.el).forEach(x => x.classList.add('is-lit')); };
  const paint = s => {
    s.el.style.setProperty('--p', s.p.toFixed(4));
    s.steps.forEach(st => { if (!st.classList.contains('is-lit') && s.p >= parseFloat(st.dataset.at) - 1e-4) lite(s, st); });
    if (s.el.dataset.minp && s.p >= parseFloat(s.el.dataset.minp)) s.el.classList.add('is-min');
    if (s.p >= 1 && !s.done) { s.done = true; s.el.classList.add('is-done'); s.segs.forEach(g => g.style.setProperty('--s', 1)); s.steps.forEach(st => lite(s, st)); }
  };
  const finish = s => { s.p = 1; paint(s); };
  const replay = s => {
    if (!s) return;
    s.done = false; s.el.classList.remove('is-done', 'is-min'); $$('.is-lit', s.el).forEach(st => st.classList.remove('is-lit'));
    if (reduce) { finish(s); return; }
    s.p = 0; s.from = 0; s.t0 = performance.now(); paint(s); kick();
  };
  let pending = false;
  const frame = now => {
    pending = false;
    const vh = innerHeight, read = vh * .64; let again = false;
    scenes.forEach(s => {
      if (s.done || reduce) return;
      const r = s.el.getBoundingClientRect(); if (!r.height) return;
      if (r.bottom < 0) { finish(s); return; }
      const follow = s.mode === 'scroll' || (s.mode !== 'play' && r.height > vh * .78);
      if (follow) {
        
        s.steps.forEach(st => { if (st.classList.contains('is-lit')) return; const b = st.getBoundingClientRect(); if (b.top + Math.min(b.height, 120) * .5 < read) lite(s, st); });
        s.segs.forEach((g, i) => {
          const a = g.querySelector('[data-node]') || g, nx = s.segs[i + 1] && (s.segs[i + 1].querySelector('[data-node]') || s.segs[i + 1]);
          if (!nx) return;
          const y0 = a.getBoundingClientRect().top + a.offsetHeight / 2, y1 = nx.getBoundingClientRect().top + nx.offsetHeight / 2;
          const f = clamp((read - y0) / Math.max(1, y1 - y0)); if (f > (g._s || 0)) { g._s = f; g.style.setProperty('--s', f.toFixed(4)); }
        });
        const p = clamp((vh * .82 - r.top) / (r.height + vh * .32));
        if (p > s.p) { s.p = p; paint(s); }
      } else {
        if (!s.t0 && r.top < vh * .74 && r.bottom > vh * .1) { s.t0 = now; s.from = s.p; }
        if (s.t0) {
          const k = clamp((now - s.t0) / s.dur); s.p = s.from + (1 - s.from) * ease(k);
          const n = s.segs.length; s.segs.forEach((g, i) => g.style.setProperty('--s', clamp(s.p * (n - 1 || 1) * 1.08 - i).toFixed(4)));
          paint(s); if (k < 1) again = true;
        }
      }
    });
    if (again) kick();
  };
  const kick = () => { if (!pending) { pending = true; requestAnimationFrame(frame); } };
  if (reduce) scenes.forEach(finish);
  else {
    scenes.forEach(s => { s.p = 0; s.segs.forEach(g => g.style.setProperty('--s', 0)); paint(s); });
    addEventListener('scroll', kick, { passive: true }); addEventListener('resize', kick);
    if (lenis) lenis.on('scroll', kick);
    kick(); addEventListener('load', kick);
  }
  
  const warm = $$('[data-wg-warm]', root);
  const heat = box => $$('img[loading="lazy"]', box).forEach(im => { im.loading = 'eager'; if (im.decode) im.decode().catch(() => {}); });
  if ('IntersectionObserver' in window) { const wo = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { heat(e.target); wo.unobserve(e.target); } }), { rootMargin: '900px 0px' }); warm.forEach(b => wo.observe(b)); }
  else warm.forEach(heat);
  
  root.addEventListener('fb:pick', e => {
    const box = e.target; if (!box || !box.querySelector) return;
    const on = box.querySelector(':scope > .is-on [data-wg-scene]'); if (!on) return;
    replay(scenes.find(s => s.el === on));
  });

  
  $$('[data-wg-tcols]', root).forEach(g => {
    const wrap = document.getElementById(g.dataset.wgTcols); if (!wrap) return;
    const btns = $$('.wg-tcol', g);
    btns.forEach(b => b.addEventListener('click', () => {
      if (b.getAttribute('aria-pressed') === 'true') return;
      btns.forEach(x => x.setAttribute('aria-pressed', x === b ? 'true' : 'false'));
      if (reduce) { wrap.dataset.col = b.dataset.col; return; }
      clearTimeout(wrap._t); wrap.classList.remove('is-swap'); wrap.classList.add('is-out');   
      wrap._t = setTimeout(() => { wrap.dataset.col = b.dataset.col; wrap.classList.remove('is-out'); void wrap.offsetWidth; wrap.classList.add('is-swap'); }, 170);
    }));
  });

  
  function radios(group, sel, onPick) {
    const btns = $$(sel, group);
    const set = (b, focus) => {
      btns.forEach(x => { const on = x === b; x.setAttribute('aria-checked', on ? 'true' : 'false'); x.tabIndex = on ? 0 : -1; });
      if (focus) { b.focus(); b.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: reduce ? 'instant' : 'smooth' }); }
      onPick(b);
    };
    btns.forEach((b, i) => {
      b.addEventListener('click', () => set(b, false));
      b.addEventListener('keydown', e => {
        const k = e.key; let n = null;
        if (k === 'ArrowRight' || k === 'ArrowDown') n = btns[(i + 1) % btns.length];
        if (k === 'ArrowLeft' || k === 'ArrowUp') n = btns[(i - 1 + btns.length) % btns.length];
        if (k === 'Home') n = btns[0]; if (k === 'End') n = btns[btns.length - 1];
        if (n) { e.preventDefault(); set(n, true); }
      });
    });
    return btns;
  }

  
  $$('[data-wg-x]', root).forEach(box => {
    const section = DATA[box.dataset.wgX] || {};
    const apply = (key, flash) => {
      const d = section[key]; if (!d) return;
      Object.entries(d.t || {}).forEach(([k, v]) => $$(`[data-t="${k}"]`, box).forEach(el => { if (el.textContent !== v) { el.textContent = v; if (flash && el.classList.contains('wg-m__v')) { el.classList.remove('is-flash'); void el.offsetWidth; el.classList.add('is-flash'); } } }));
      Object.entries(d.v || {}).forEach(([k, v]) => $$(`[data-v="${k}"]`, box).forEach(el => {
        const vt = el.querySelector('[data-vt]'); const small = el.querySelector('small');
        if (vt) vt.textContent = v; else el.firstChild.textContent = v;
        if (small && d.u && d.u[k] !== undefined) small.textContent = d.u[k];
        if (flash) { el.classList.remove('is-flash'); void el.offsetWidth; el.classList.add('is-flash'); }
      }));
      Object.entries(d.f || {}).forEach(([k, v]) => $$(`[data-f="${k}"]`, box).forEach(el => el.style.setProperty('--f', v)));
      Object.entries(d.a || {}).forEach(([k, v]) => $$(`[data-a="${k}"]`, box).forEach(el => el.style.setProperty('--at', v + '%')));
      Object.entries(d.h || {}).forEach(([k, v]) => $$(`[data-h="${k}"]`, box).forEach(el => { el.hidden = !!v; }));
      Object.entries(d.l || {}).forEach(([k, v]) => $$(`[data-l="${k}"]`, box).forEach(el => { el.href = v; }));
      Object.entries(d.r || {}).forEach(([k, v]) => $$(`[data-r="${k}"]`, box).forEach(el => el.style.setProperty('--r', v)));
      Object.entries(d.sk || {}).forEach(([k, v]) => $$(`[data-sk="${k}"]`, box).forEach(el => { el.textContent = v; }));
      $$('tr[data-row]', box).forEach(tr => tr.classList.toggle('is-on', tr.dataset.row === key));
    };
    const group = $('[data-wg-pick]', box);
    if (group) radios(group, '[data-key]', b => { apply(b.dataset.key, true); window.ffyTrack && window.ffyTrack('water_explorer', { page, board: box.dataset.wgX, key: b.dataset.key }); });
    const start = $('[data-key][aria-checked="true"]', box); if (start) apply(start.dataset.key, false);
  });

  
  $$('[data-wg-glass]', root).forEach(box => {
    const sect = DATA.glass || {};
    let sys = $('[data-gsys][aria-checked="true"]', box)?.dataset.gsys || Object.keys(sect)[0];
    let ing = $('[data-ing][aria-checked="true"]', box)?.dataset.ing;
    const dots = $$('.wg-glass__p', box), card = $('.wg-ingcard', box);
    const paint = (swap) => {
      const s = sect[sys]; if (!s) return;
      $$('[data-ing]', box).forEach(b => { const d = s[b.dataset.ing]; if (!d) return; const sp = b.querySelector('span'); if (sp) sp.textContent = d.chip; const nm = b.querySelector('b'); if (nm) nm.textContent = d.name; });
      const d = s[ing]; if (!d || !card) return;
      $$('[data-ic]', card).forEach(el => { const k = el.dataset.ic; if (k === 'link') { el.href = d.href; el.textContent = d.link; el.hidden = !d.href; } else el.textContent = d[k] || ''; });
      if (swap && !reduce) { card.classList.remove('is-swap'); void card.offsetWidth; card.classList.add('is-swap'); }
      dots.forEach((p, i) => { p.style.fill = d.color; p.style.opacity = i < (d.dots || 0) ? 1 : 0; if (swap && !reduce) { p.classList.remove('is-pop'); void p.getBoundingClientRect(); p.style.setProperty('--i', i); p.classList.add('is-pop'); } });
      const cap = $('[data-gcap]', box); if (cap) cap.textContent = d.cap || '';
    };
    const sg = $('[data-wg-gsys]', box); if (sg) radios(sg, '[data-gsys]', b => { sys = b.dataset.gsys; paint(true); });
    const ig = $('[data-wg-ings]', box); if (ig) radios(ig, '[data-ing]', b => { ing = b.dataset.ing; paint(true); window.ffyTrack && window.ffyTrack('water_explorer', { page, board: 'glass', key: ing }); });
    paint(false);
  });

  
  $$('[data-wg-paths]', root).forEach(box => {
    const cards = $$('[data-paths]', box);
    const show = (path, animate) => {
      let i = 0;
      cards.forEach(c => {
        const on = c.dataset.paths.split(' ').includes(path);
        if (on) { const was = c.hidden; c.hidden = false; if (animate && was !== false && !reduce) { c.classList.remove('is-enter'); void c.offsetWidth; c.style.setProperty('--i', i); c.classList.add('is-enter'); } else if (animate && !reduce) { c.classList.remove('is-enter'); void c.offsetWidth; c.style.setProperty('--i', i); c.classList.add('is-enter'); } i++; }
        else c.hidden = true;
      });
      $$('[data-pathline]', box).forEach(el => { el.hidden = el.dataset.pathline !== path; });
    };
    const g = $('[data-wg-pick]', box);
    if (g) radios(g, '[data-path]', b => { show(b.dataset.path, true); window.ffyTrack && window.ffyTrack('water_chooser', { page, path: b.dataset.path }); });
    const s = $('[data-path][aria-checked="true"]', box); if (s) show(s.dataset.path, false);
  });

  
  $$('[data-wg-flip]', root).forEach(b => b.addEventListener('click', () => b.setAttribute('aria-pressed', b.getAttribute('aria-pressed') === 'true' ? 'false' : 'true')));

  
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
    function measure() { lanes.forEach(l => { if (!l.copy) return; l.half = l.copy.offsetLeft - l.first.offsetLeft; if (l.dir > 0 && l.pos === 0) l.pos = -l.half; }); }
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
