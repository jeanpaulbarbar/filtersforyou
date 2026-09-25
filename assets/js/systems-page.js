(() => {
  'use strict';
  const doc = document.documentElement; doc.classList.add('fs-js'); window.__fsReady = true;
  const main = document.querySelector('main#systems-hub'); if (!main) return;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const phone = matchMedia('(max-width:859px)');
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  let lenis = null;
  if (window.Lenis && !reduce && matchMedia('(pointer:fine)').matches && !phone.matches) {
    lenis = new Lenis({ duration: 1.35, smoothWheel: true, syncTouch: false });
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
  const sc = window.ScrollCraft ? window.ScrollCraft.mount(main) : null;
  const relayout = () => { try { sc && sc.layout && sc.layout(); } catch (e) {} if (lenis) lenis.resize(); };
  const heroSec = $('.fs-hero');
  if (window.gsap && !reduce && heroSec) {
    const h = $('h1', heroSec); h.setAttribute('aria-label', h.textContent.replace(/\s+/g, ' ').trim());
    const walk = document.createTreeWalker(h, NodeFilter.SHOW_TEXT), nodes = [];
    while (walk.nextNode()) nodes.push(walk.currentNode);
    nodes.forEach(t => {
      const frag = document.createDocumentFragment();
      t.textContent.split(/(\s+)/).forEach(word => {
        if (!word.trim()) { frag.append(word); return; }
        const w = document.createElement('span'); w.className = 'hw'; w.setAttribute('aria-hidden', 'true');
        [...word].forEach(c => { const s = document.createElement('span'); s.className = 'hch'; s.textContent = c; w.append(s); });
        frag.append(w);
      });
      t.replaceWith(frag);
    });
    heroSec.classList.add('fs-animated');
    gsap.to($$('.hch', h), { opacity: 1, y: 0, duration: .55, ease: 'power3.out', stagger: .018, delay: .8 });
  }
  const offers = $$('.fs-offer', main);
  const byKey = {}, bySys = {};
  offers.forEach(o => {
    const r = { key: o.dataset.key, mode: o.dataset.mode, sys: o.dataset.sys, name: o.dataset.name, price: o.dataset.price,
      url: $('.fs-offer__name a', o).getAttribute('href'), el: o,
      thumb: '/media/systems-hub/range/' + o.dataset.key + '-thumb.webp', card: '/media/systems-hub/range/' + o.dataset.key + '-card.webp' };
    byKey[r.key] = r; bySys[r.sys] = r;
  });
  const chosen = {};
  $$('.fs-group').forEach(g => { chosen[g.dataset.group] = $('.fs-row[aria-pressed=true]', g)?.dataset.fsModel; });
  let mode = 'every', model = chosen.every;
  const house = $('[data-fs-house]'), tabs = $$('.fs-modes [role=tab]'), glide = $('.fs-modes__glide');
  function placeGlide() {
    const on = tabs.find(t => t.getAttribute('aria-selected') === 'true'); if (!on || !glide) return;
    glide.style.setProperty('--gx', on.offsetLeft + 'px'); glide.style.setProperty('--gw', on.offsetWidth + 'px');
  }
  function setMode(m, opts = {}) {
    if (!chosen[m]) return;
    mode = m;
    tabs.forEach(t => { const on = t.dataset.fsMode === m; t.setAttribute('aria-selected', on); t.tabIndex = on ? 0 : -1; });
    $('#fs-pick')?.setAttribute('aria-labelledby', 'fs-tab-' + m);
    placeGlide();
    $$('.fs-fit__line').forEach(l => l.toggleAttribute('data-idle', l.dataset.line !== m));
    if (house) house.dataset.mode = m;
    $$('.fs-group').forEach(g => g.toggleAttribute('data-idle', g.dataset.group !== m));
    setModel(chosen[m], opts);
  }
  function setModel(k, opts = {}) {
    const r = byKey[k]; if (!r) return;
    chosen[r.mode] = k; model = k;
    $$(`.fs-group[data-group="${r.mode}"] .fs-row`).forEach(b => b.setAttribute('aria-pressed', b.dataset.fsModel === k));
    offers.filter(o => o.dataset.mode === r.mode).forEach(o => {
      const on = o === r.el, was = !o.hasAttribute('data-idle');
      o.toggleAttribute('data-idle', !on);
      if (on && !was && !opts.quiet && !reduce) { o.classList.remove('is-new'); void o.offsetWidth; o.classList.add('is-new'); }
    });
    hero(r); bar(r); deluxe.sync(r.key); if (!opts.keepForm) form.pick(r.sys, true);
    if (!opts.quiet) relayout();
  }
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => setMode(t.dataset.fsMode));
    t.addEventListener('keydown', e => {
      const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0; if (!d) return;
      e.preventDefault(); const n = tabs[(i + d + tabs.length) % tabs.length]; n.focus(); setMode(n.dataset.fsMode);
    });
  });
  $$('.fs-row', main).forEach(b => b.addEventListener('click', () => {
    setModel(b.dataset.fsModel);
    const card = byKey[model] && byKey[model].el; if (!card) return;
    const box = card.getBoundingClientRect();
    if (box.top < hdrH() + 8) goTo(card, 44);
  }));
  addEventListener('resize', placeGlide);
  document.fonts?.ready.then(placeGlide);
  const heroTabs = $$('.ocdots [data-fs-mode]');
  function hero(r) {
    const tab = heroTabs.find(a => a.dataset.fsMode === r.mode); if (!tab) return;
    heroTabs.forEach(a => { const on = a === tab; a.classList.toggle('on', on); on ? a.setAttribute('aria-current', 'true') : a.removeAttribute('aria-current'); });
    $('#fsHeroTitle').textContent = tab.dataset.title;
    const l = $('#fsHeroLink'); l.href = r.url; l.textContent = r.name + ' ↗';
    $('#fsHeroPrice').innerHTML = r.price + '<i> installed</i>';
    const im = $('#fsHeroImg'); if (im.getAttribute('src') !== r.card) { im.src = r.card; im.alt = r.name; }
    $('[data-fs-hero-tick]').textContent = tab.dataset.tick; $('[data-fs-hero-sub]').textContent = tab.dataset.title + '.';
  }
  heroTabs.forEach(a => a.addEventListener('click', e => { e.preventDefault(); setMode(a.dataset.fsMode); }));
  const heroCard = $('.ocard');
  function lockHero() {
    if (!heroCard || !heroTabs.length) return;
    const t = $('#fsHeroTitle'), l = $('#fsHeroLink'), p = $('#fsHeroPrice'), tk = $('[data-fs-hero-tick]'), sub = $('[data-fs-hero-sub]');
    const keep = [t.textContent, l.textContent, p.innerHTML, tk.textContent, sub.textContent];
    heroCard.style.minHeight = '';
    let max = heroCard.offsetHeight;
    offers.forEach(o => {
      const r = byKey[o.dataset.key], tab = heroTabs.find(a => a.dataset.fsMode === r.mode); if (!tab) return;
      t.textContent = tab.dataset.title; l.textContent = r.name + ' ↗'; p.innerHTML = r.price + '<i> installed</i>';
      tk.textContent = tab.dataset.tick; sub.textContent = tab.dataset.title + '.';
      max = Math.max(max, heroCard.offsetHeight);
    });
    t.textContent = keep[0]; l.textContent = keep[1]; p.innerHTML = keep[2]; tk.textContent = keep[3]; sub.textContent = keep[4];
    heroCard.style.minHeight = max + 'px';
  }
  let lockQueued = 0;
  addEventListener('resize', () => { cancelAnimationFrame(lockQueued); lockQueued = requestAnimationFrame(lockHero); });
  document.fonts?.ready.then(lockHero);
  $('[data-fs-choose]')?.addEventListener('click', e => { e.preventDefault(); goTo($('#fs-fit-title'), 20); });
  $('#fsHeroLink')?.addEventListener('click', e => {
    const h = e.currentTarget.getAttribute('href'); if (!h || h[0] !== '#') return;
    e.preventDefault(); deluxe.sync(model); goTo($(h), 12);
  });
  const deluxe = (() => {
    const btns = $$('[data-fs-deluxe]'), shots = $$('.fs-deluxe__shot'), packs = $$('.fs-deluxe__pack');
    if (!btns.length) return { sync() {} };
    let current = btns[0].dataset.fsDeluxe, ticket = 0;
    const decoded = new Map();
    const decode = k => {
      if (!decoded.has(k)) {
        const img = $(`.fs-deluxe__shot[data-pack="${k}"] img`);
        if (!img) return Promise.resolve();
        img.loading = 'eager';
        decoded.set(k, (img.decode ? img.decode() : Promise.resolve()).catch(() => {}));
      }
      return decoded.get(k);
    };
    async function show(k, opts = {}) {
      if (!k || k === current && !opts.force) return;
      current = k; const mine = ++ticket;
      btns.forEach(b => b.setAttribute('aria-pressed', b.dataset.fsDeluxe === k));
      packs.forEach(p => {
        const on = p.dataset.pack === k, was = !p.hasAttribute('data-idle');
        p.toggleAttribute('data-idle', !on);
        if (on && !was && !reduce && !opts.quiet) { p.classList.remove('is-new'); void p.offsetWidth; p.classList.add('is-new'); }
      });
      await decode(k); if (mine !== ticket) return;
      shots.forEach(s => s.toggleAttribute('data-idle', s.dataset.pack !== k));
    }
    btns.forEach(b => b.addEventListener('click', () => { show(b.dataset.fsDeluxe); setModel(b.dataset.fsDeluxe, { keepForm: false }); }));
    btns.forEach(b => b.addEventListener('pointerenter', () => decode(b.dataset.fsDeluxe), { once: true }));
    $$('[data-fs-pack]').forEach(a => a.addEventListener('click', e => { e.preventDefault(); show(a.dataset.fsPack); goTo($('#deluxe'), 12); }));
    return { sync(k) { if (byKey[k] && byKey[k].mode === 'both') show(k, { quiet: true }); } };
  })();
  const barEl = $('#fs-bar');
  function bar(r) {
    if (!barEl) return;
    $('[data-fs-bar-price]', barEl).textContent = r.price.replace('From ', 'from ');
    $('[data-fs-bar-name]', barEl).textContent = r.name;
    const im = $('.fs-bar__img img', barEl); if (im.getAttribute('src') !== r.thumb) im.src = r.thumb;
    $('[data-fs-bar-cta]', barEl).dataset.sys = r.sys;
  }
  let barQueued = false;
  function barCheck() {
    barQueued = false; if (!barEl) return;
    const vh = innerHeight, inView = el => { if (!el || !el.offsetParent) return false; const b = el.getBoundingClientRect(); return b.top < vh && b.bottom > 0; };
    const fit = $('#systems')?.getBoundingClientRect();
    const past = fit && fit.top < vh * 0.2;
    const cta = byKey[model] && $('.fs-offer__cta', byKey[model].el);
    const busy = inView(cta) || $$('.fs-deluxe__cta, .ts-studio .ts-action, .est .fs-call').some(inView) || inView($('#ask')) || inView($('footer'));
    barEl.hidden = false; barEl.classList.toggle('off', !past || busy);
  }
  addEventListener('scroll', () => { if (!barQueued) { barQueued = true; requestAnimationFrame(barCheck); } }, { passive: true });
  addEventListener('resize', barCheck);
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } }), { threshold: 0.35 });
  const staged = $$('[data-fs-seals], [data-fs-years], [data-fs-visits]', main);
  staged.forEach(el => reduce ? el.classList.add('is-in') : io.observe(el));
  const rise = reduce ? [] : $$('.fs-answer .kick, .fs-answer .d2, .fs-fit__head > *, .fs-deluxe__head > *, .fs-care__head > div > *', main);
  const rio = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-in'); rio.unobserve(e.target); } }), { threshold: 0.2 });
  rise.forEach(el => { el.classList.add('fs-rise'); rio.observe(el); });
  addEventListener('scroll', () => {
    staged.concat(rise).forEach(el => { if (!el.classList.contains('is-in') && el.getBoundingClientRect().bottom < 0) el.classList.add('is-in'); });
  }, { passive: true });
  if (!reduce) {
    const drift = $$('.fs-care__photo img, .fs-answer__photo img', main); drift.forEach(el => el.setAttribute('data-fs-drift', ''));
    const live = new Set(), seen = new IntersectionObserver(es => es.forEach(e => e.isIntersecting ? live.add(e.target) : live.delete(e.target)), { rootMargin: '10% 0px' });
    drift.forEach(el => seen.observe(el));
    let queued = false;
    const frame = () => {
      queued = false; const vh = innerHeight;
      live.forEach(el => { const box = el.parentElement.getBoundingClientRect(); const p = ((box.top + box.height / 2) - vh / 2) / (vh / 2 + box.height / 2); el.style.setProperty('--fs-p', Math.max(-1, Math.min(1, p)).toFixed(4)); });
    };
    const ask = () => { if (!queued) { queued = true; requestAnimationFrame(frame); } };
    addEventListener('scroll', ask, { passive: true }); addEventListener('resize', ask); ask();
  }
  (() => {
    const rmq = $('#rmq'), pause = $('.sg-review-pause'); if (!rmq || reduce) return;
    doc.classList.add('sg-review-motion'); if (pause) pause.hidden = false;
    const lanes = $$('.rrow', rmq).map(row => {
      const original = [...row.children];
      original.forEach(el => { const c = el.cloneNode(true); c.inert = true; c.setAttribute('aria-hidden', 'true'); row.append(c); });
      return { el: row, first: original[0], copy: row.children[original.length], dir: Number(row.dataset.dir) || -1, x: 0, width: 0 };
    });
    const size = () => lanes.forEach(l => { l.width = l.copy.offsetLeft - l.first.offsetLeft; if (l.dir > 0 && l.x === 0) l.x = -l.width; });
    new ResizeObserver(size).observe(rmq); size();
    let paused = false, visible = false;
    pause && pause.addEventListener('click', () => { paused = !paused; pause.textContent = paused ? 'Play reviews' : 'Pause reviews'; });
    new IntersectionObserver(es => visible = es[0].isIntersecting).observe(rmq);
    let last = performance.now(), lastY = scrollY, v = 0;
    const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
    function tick(t) {
      const dt = Math.min((t - last) / 1000, .05); last = t;
      const dy = scrollY - lastY; lastY = scrollY;
      v += ((phone.matches ? 0 : clamp(dy / Math.max(dt, .001) / 900, -1, 1)) - v) * Math.min(1, dt * 6);
      if (visible && !paused && !document.hidden) lanes.forEach(l => {
        if (!l.width) return;
        l.x += l.dir * (30 + Math.abs(v) * 260) * dt;
        if (l.x <= -l.width) l.x += l.width; if (l.x > 0) l.x -= l.width;
        l.el.style.transform = `translateX(${l.x}px) skewX(${-v * 4}deg)`;
      });
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  })();
  const form = (() => {
    const q = $('[data-qform]'); if (!q) return { pick() {} };
    const f = $('form', q), panes = $$('[data-step]', q), dots = $$('.steps i', q);
    const nextLabel = $('[data-nextlabel]', q), back = $('[data-back]', q), send = $('[data-next]', q), error = $('[role=alert]', q);
    const card = $('[data-fs-chosen]', q), tapRow = $('[data-fs-tap]', q);
    const sysBtns = $$('[data-step="1"] .sysopt', q), whenBtns = $$('.fs-when__b', q);
    let step = 0, system = '', when = '', tap = null, sending = false, started = false, ready = false, formAnim = null;
    const hidden = (n, v) => { let i = f.elements[n]; if (!i) { i = document.createElement('input'); i.type = 'hidden'; i.name = n; f.append(i); } i.value = v; };
    function show(n) {
      const moved = n !== step && !reduce && ready;
      const from = moved ? f.offsetHeight : 0;
      step = n; panes.forEach((p, i) => p.hidden = i !== n); dots.forEach((d, i) => d.classList.toggle('on', i <= n));
      back.hidden = n === 0; nextLabel.textContent = n === 2 ? 'Request my installation date' : 'Next';
      error.hidden = true;
      if (!moved) { relayout(); return; }
      const pane = panes[n]; pane.classList.remove('is-enter'); void pane.offsetWidth; pane.classList.add('is-enter');
      if (formAnim) formAnim.cancel();
      const to = f.offsetHeight; f.style.overflow = 'hidden';
      formAnim = f.animate({ height: [from + 'px', to + 'px'] }, { duration: 420, easing: 'cubic-bezier(.22,1,.36,1)' });
      formAnim.onfinish = formAnim.oncancel = () => { f.style.overflow = ''; formAnim = null; relayout(); };
    }
    function enter(el) { if (!reduce && ready) { el.classList.remove('is-enter'); void el.offsetWidth; el.classList.add('is-enter'); } }
    function summary() {
      const r = bySys[system], was = card.hidden;
      card.hidden = !r;
      if (r) {
        const im = $('img', card); if (im.getAttribute('src') !== r.thumb) im.src = r.thumb;
        $('[data-fs-chosen-name]', card).textContent = r.name; $('[data-fs-chosen-price]', card).textContent = r.price + ' installed';
        if (was) enter(card);
      }
    }
    function pick(v) {
      if (q.classList.contains('sent')) return;
      system = v || '';
      sysBtns.forEach(b => { const on = b.dataset.v === system; b.classList.toggle('on', on); b.setAttribute('aria-pressed', on); });
      summary();
    }
    function setTap(t) {
      tap = t && t.label ? t : null;
      const included = tap && (!tap.price || /included/i.test(tap.price));
      tapRow.hidden = !tap;
      if (tap) {
        $('[data-fs-tap-name]', tapRow).textContent = tap.label;
        $('[data-fs-tap-price]', tapRow).textContent = included ? 'Included with your system' : tap.price + ', installed with your system';
        if (tap.image) $('img', tapRow).src = tap.image;
        enter(tapRow);
      }
      hidden('tap_choice', tap ? tap.label + (included ? ' (included)' : ', ' + tap.price + ' upgrade') : '');
    }
    document.addEventListener('ffy:tap', e => setTap(e.detail));
    $('[data-fs-tap-remove]', q)?.addEventListener('click', () => setTap(null));
    sysBtns.forEach(b => b.addEventListener('click', () => {
      pick(b.dataset.v); error.hidden = true;
      window.ffyTrack && window.ffyTrack('system_select', { system, form: 'systems' });
      const r = bySys[system]; if (r) { chosen[r.mode] = r.key; setMode(r.mode, { quiet: true, keepForm: true }); }
    }));
    whenBtns.forEach(b => b.addEventListener('click', () => {
      when = b.getAttribute('aria-pressed') === 'true' ? '' : b.dataset.when;
      whenBtns.forEach(o => { const on = o.dataset.when === when; o.classList.toggle('on', on); o.setAttribute('aria-pressed', on); });
    }));
    const trail = [];
    const go = n => { if (n !== step) trail.push(step); show(n); };
    back.addEventListener('click', () => { show(trail.length ? trail.pop() : Math.max(0, step - 1)); });
    $('[data-fs-change]', q)?.addEventListener('click', () => { go(1); $('.fs-tile.on', q)?.focus({ preventScroll: true }); });
    document.addEventListener('click', e => {
      const b = e.target.closest('[data-fs-cta]'); if (!b) return;
      e.preventDefault();
      const v = b.dataset.sys || '';
      if (v) { pick(v); const r = bySys[v]; if (r && !b.closest('.fs-offer')) { chosen[r.mode] = r.key; setMode(r.mode, { quiet: true, keepForm: true }); } }
      const suburbOk = f.elements.suburb.checkValidity();
      trail.length = 0; if (!q.classList.contains('finished')) show(system ? (suburbOk ? 2 : 0) : (suburbOk ? 1 : 0));
      goTo($('#ask'), 0);
    });
    const message = () => [`${system || 'Not sure yet'} installation request.`, `Suburb: ${f.elements.suburb.value.trim()}.`,
      when ? `Timing: ${when}.` : '', tap ? `Tap: ${f.elements.tap_choice.value}.` : '', 'From the water filter systems page.'].filter(Boolean).join(' ');
    f.addEventListener('submit', async e => {
      e.preventDefault(); if (sending) return;
      if (!started) { started = true; window.ffyTrack && window.ffyTrack('form_start', { form: 'systems' }); }
      for (const i of $$('input:not([type=hidden])', panes[step])) if (!i.reportValidity()) return;
      if (step === 0) { go(system ? 2 : 1); return; }
      if (step === 1) { if (!system) { error.textContent = 'Please choose a system, or Help me choose.'; error.hidden = false; return; } go(2); return; }
      if (!f.elements.suburb.checkValidity()) { go(0); f.elements.suburb.reportValidity(); return; }
      hidden('system', system || 'Not sure yet'); hidden('installation_preference', when); hidden('message', message());
      hidden('_subject', `${system || 'Installation'} request, ${f.elements.suburb.value.trim()}`);
      if (window.ffyStampForm) window.ffyStampForm(f);
      sending = true; send.disabled = true; nextLabel.textContent = 'Sending…'; error.hidden = true;
      const fail = () => { error.textContent = 'That did not send. Please try again, or call 0430 546 749.'; error.hidden = false; nextLabel.textContent = 'Try again'; };
      try {
        const r = await fetch(f.action, { method: 'POST', body: new FormData(f), headers: { Accept: 'application/json' } });
        if (r.ok) {
          q.classList.add('finished', 'sent');
          window.ffyLeadSuccess && window.ffyLeadSuccess(f, { form: 'systems', label: 'systems_page', system: system || 'not chosen' });
          const d = $('.done', q); d.setAttribute('tabindex', '-1'); d.focus({ preventScroll: true });
        } else fail();
      } catch (err) { fail(); }
      finally { sending = false; send.disabled = false; relayout(); }
    });
    show(0); ready = true;
    return { pick };
  })();
  $$('details', main).forEach(d => {
    const sum = $('summary', d); if (!sum) return;
    let anim = null, closing = false;
    const closedH = () => { const cs = getComputedStyle(d); return sum.offsetHeight + parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom) + parseFloat(cs.borderTopWidth) + parseFloat(cs.borderBottomWidth); };
    sum.addEventListener('click', e => {
      if (reduce) { requestAnimationFrame(relayout); return; }
      e.preventDefault();
      const from = d.offsetHeight;
      if (anim) { anim.cancel(); anim = null; }
      d.style.overflow = 'hidden';
      let to;
      if (!d.open || closing) { closing = false; d.open = true; to = d.offsetHeight; d.classList.add('is-open'); }
      else { closing = true; to = closedH(); d.classList.remove('is-open'); }
      anim = d.animate({ height: [from + 'px', to + 'px'] }, { duration: 420, easing: 'cubic-bezier(.22,1,.36,1)' });
      anim.onfinish = () => { anim = null; if (closing) { d.open = false; closing = false; } d.style.overflow = ''; relayout(); };
    });
    if (d.open) d.classList.add('is-open');
  });
  (() => {
    const st = $('#studio'); if (!st || !st.dataset.fsSrc) return;
    let done = false;
    const load = () => { if (done) return; done = true; const x = document.createElement('script'); x.src = st.dataset.fsSrc; x.onload = relayout; document.body.append(x); };
    if (!('IntersectionObserver' in window)) { load(); return; }
    const o = new IntersectionObserver(es => { if (es.some(e => e.isIntersecting)) { o.disconnect(); load(); } }, { rootMargin: '150% 0px' });
    o.observe(st);
    addEventListener('hashchange', () => { if (location.hash === '#studio' || location.hash === '#MixerTapStudio') load(); });
  })();
  const want = new URLSearchParams(location.search).get('system') || (location.hash === '#deluxe-reserve' ? 'deluxe-reserve' : '');
  const start = want && byKey[want] ? byKey[want] : null;
  if (start) { chosen[start.mode] = start.key; setMode(start.mode, { quiet: true, keepForm: true }); }
  else setMode('every', { quiet: true, keepForm: true });
  form.pick('');
  barCheck(); lockHero(); placeGlide();
  addEventListener('load', () => { relayout(); barCheck(); });
})();
