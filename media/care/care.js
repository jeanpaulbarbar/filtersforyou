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
  root.addEventListener('click', e => {
    const a = e.target.closest('a[href^="#"]'); if (!a) return;
    const id = a.getAttribute('href').slice(1); const el = id && document.getElementById(id);
    if (!el) return;
    e.preventDefault(); goTo(el, 12);
    if (history.replaceState) history.replaceState(null, '', '#' + id);
  });
  const anims = $$('[data-cp-anim], [data-wy-anim], [data-cp-carts]', root);
  anims.forEach(el => $$(':scope > li, :scope > article', el).forEach((c, i) => { if (!c.style.getPropertyValue('--i')) c.style.setProperty('--i', i); }));
  const reveal = el => {
    el.classList.add('is-in');
    const z = el.matches('.cp-member') ? $('[data-cp-count]', el) : null;
    if (z) countDown(z);
  };
  if (reduce || !('IntersectionObserver' in window)) anims.forEach(reveal);
  else {
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { reveal(e.target); io.unobserve(e.target); } }), { threshold: 0.25 });
    anims.forEach(el => io.observe(el));
    const sweep = () => anims.forEach(el => { if (!el.classList.contains('is-in') && el.getBoundingClientRect().bottom < innerHeight * 0.5) reveal(el); });
    addEventListener('scroll', sweep, { passive: true });
  }

  function countDown(el) {
    if (el.dataset.done) return; el.dataset.done = '1';
    const from = parseInt(el.dataset.cpFrom || '0', 10);
    if (reduce || !from) { el.textContent = '$0'; return; }
    const t0 = performance.now(), dur = 1700;
    const tick = t => {
      const p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 3);
      el.textContent = '$' + Math.round(from * (1 - e)).toLocaleString('en-AU');
      if (p < 1) requestAnimationFrame(tick);
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
  const form = { pick: null, started: false };
  const imgTag = (src, w, h, alt = '') => { const i = new Image(w, h); i.src = src; i.alt = alt; i.decoding = 'async'; return i; };
  const warm = new Set();
  function preload(k) {
    const d = DATA[k]; if (!d || warm.has(k)) return; warm.add(k);
    (d.parts.length ? d.parts : [k]).forEach(p => { new Image().src = `/media/warranty/r-${p}-480.webp`; new Image().src = `/media/warranty/r-${p}.webp`; });
    (d.carts || []).forEach(c => { new Image().src = c; });
  }
  function roll(el, text) {
    if (!el || el.textContent === text) return;
    el.textContent = text;
    if (reduce) return;
    el.classList.remove('is-roll'); void el.offsetWidth; el.classList.add('is-roll');
  }
  function paintPic(pic, k) {
    const d = DATA[k]; if (!pic || !d) return;
    pic.classList.toggle('cp-stage__pic--parts', d.parts.length > 0);
    const imgs = d.parts.length
      ? d.parts.map(p => imgTag(`/media/warranty/r-${p}.webp`, 240, 240))
      : [(() => { const i = imgTag(`/media/warranty/r-${k}-480.webp`, 480, 480, d.name); i.srcset = `/media/warranty/r-${k}.webp 240w, /media/warranty/r-${k}-480.webp 480w`; i.sizes = '(max-width:859px) 96px, 160px'; return i; })()];
    pic.replaceChildren(...imgs);
    if (!reduce) { pic.classList.remove('is-swap'); void pic.offsetWidth; pic.classList.add('is-swap'); }
  }
  function paintCarts(list, k) {
    const d = DATA[k]; if (!list || !d) return;
    const items = d.carts.map((c, i) => {
      const li = document.createElement('li'); li.style.setProperty('--i', i);
      li.append(imgTag(c, 300, 1209)); return li;
    });
    if (d.split && items.length > d.split) { const gap = document.createElement('li'); gap.className = 'is-gap'; items.splice(d.split, 0, gap); }
    list.classList.remove('is-in');
    list.replaceChildren(...items);
    if (reduce) { list.classList.add('is-in'); return; }
    void list.offsetWidth;
    requestAnimationFrame(() => list.classList.add('is-in'));
  }
  $$('[data-cp-chips]', root).forEach(group => {
    const chips = $$('.cp-chip', group);
    const stage = group.parentElement.querySelector('[data-cp-stage]');
    function select(chip, focus) {
      const k = chip.dataset.k, d = DATA[k]; if (!d) return;
      chips.forEach(c => { const on = c === chip; c.setAttribute('aria-checked', on ? 'true' : 'false'); c.tabIndex = on ? 0 : -1; });
      if (focus) chip.focus();
      if (!stage || stage.dataset.k === k) return;
      stage.dataset.k = k;
      const a = $('[data-cp-href]', stage); if (a) a.href = d.parts.length ? '/water-filter-systems' : d.href;
      roll($('[data-cp-name]', stage), d.name);
      const spec = $('[data-cp-spec]', stage); if (spec) spec.textContent = d.spec;
      const note = $('[data-cp-note]', stage); if (note) { note.textContent = d.note; note.hidden = !d.note; }
      ['life', 'service', 'diy'].forEach(o => roll($(`[data-cp-p="${o}"]`, stage), d[o]));
      paintPic($('[data-cp-pic]', stage), k);
      const cl = $('[data-cp-cartlabel]', stage); if (cl) cl.textContent = d.cartLabel;
      paintCarts($('[data-cp-carts]', stage), k);
      if (form.pick && !form.started) form.pick(d.name, false);
      window.ffyTrack && window.ffyTrack('system_select', { system: d.name, form: page + '_chooser' });
    }
    chips.forEach((c, i) => {
      c.addEventListener('click', () => select(c, false));
      c.addEventListener('pointerenter', () => preload(c.dataset.k));
      c.addEventListener('focus', () => preload(c.dataset.k));
      c.addEventListener('keydown', e => {
        const n = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
        if (n) { e.preventDefault(); select(chips[(i + n + chips.length) % chips.length], true); }
        else if (e.key === 'Home') { e.preventDefault(); select(chips[0], true); }
        else if (e.key === 'End') { e.preventDefault(); select(chips[chips.length - 1], true); }
      });
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
  (() => {
    const q = $('[data-qform]', root); if (!q) return;
    const f = $('form', q), panes = $$('[data-step]', q), dots = $$('.steps i', q);
    const nextLabel = $('[data-nextlabel]', q), back = $('[data-back]', q), send = $('[data-next]', q), error = $('[role=alert]', q);
    const card = $('[data-wy-chosen]', q);
    const sysBtns = $$('[data-step="0"] .sysopt', q), optBtns = $$('[data-opt]', q);
    const byName = name => Object.keys(DATA).find(k => DATA[k].name === name);
    const sendLabel = page === 'service-plans' ? 'Book my service' : 'Book my cartridge change';
    let step = 0, system = '', option = '', sending = false, ready = false, formAnim = null;
    const hidden = (n, v) => { let i = f.elements[n]; if (!i) { i = document.createElement('input'); i.type = 'hidden'; i.name = n; f.append(i); } i.value = v; };
    const priceOf = o => { const k = byName(system); return k && o ? DATA[k][o] : ''; };
    function show(n) {
      const moved = n !== step && !reduce && ready;
      const from = moved ? f.offsetHeight : 0;
      step = n; panes.forEach((p, i) => { p.hidden = i !== n; }); dots.forEach((d, i) => d.classList.toggle('on', i <= n));
      back.hidden = n === 0; nextLabel.textContent = n === 2 ? sendLabel : 'Next';
      error.hidden = true;
      if (!moved) return;
      const pane = panes[n]; pane.classList.remove('is-enter'); void pane.offsetWidth; pane.classList.add('is-enter');
      if (formAnim) formAnim.cancel();
      const to = f.offsetHeight; f.style.overflow = 'hidden';
      formAnim = f.animate({ height: [from + 'px', to + 'px'] }, { duration: 420, easing: 'cubic-bezier(.22,1,.36,1)' });
      formAnim.onfinish = formAnim.oncancel = () => { f.style.overflow = ''; formAnim = null; };
    }
    function summary() {
      const b = sysBtns.find(x => x.dataset.v === system);
      const real = b && !b.hasAttribute('data-help');
      card.hidden = !b || step === 0;
      if (b) {
        $('.wy-chosen__img', card).hidden = !real;
        if (real) $('img', card).src = $('img', b).getAttribute('src');
        $('[data-wy-chosen-name]', card).textContent = b.dataset.name || b.dataset.v;
        const p = priceOf(optBtns.find(x => x.dataset.opt === option)?.dataset.o);
        $('[data-wy-chosen-price]', card).textContent = option && option !== 'Not sure yet' ? `${option}${p ? ', ' + p + ' a year' : ''}` : 'We confirm your price with you';
      }
      optBtns.forEach(o => { const s = $('[data-cp-optprice]', o); if (s) s.textContent = priceOf(o.dataset.o) ? priceOf(o.dataset.o) + ' a year' : 'We quote it first'; });
    }
    function pick(v, user = true) {
      q.classList.remove('finished'); system = v || '';
      sysBtns.forEach(b => { const on = b.dataset.v === system; b.classList.toggle('on', on); b.setAttribute('aria-pressed', on ? 'true' : 'false'); });
      summary();
      if (user) window.ffyTrack && window.ffyTrack('system_select', { system, form: page });
    }
    form.pick = pick;
    function choose(v) {
      option = option === v ? '' : v;
      optBtns.forEach(o => { const on = o.dataset.opt === option; o.classList.toggle('on', on); o.setAttribute('aria-pressed', on ? 'true' : 'false'); });
      summary();
    }
    sysBtns.forEach(b => b.addEventListener('click', () => { form.started = true; pick(b.dataset.v); error.hidden = true; }));
    optBtns.forEach(b => b.addEventListener('click', () => { form.started = true; choose(b.dataset.opt); error.hidden = true; }));
    back.addEventListener('click', () => { show(Math.max(0, step - 1)); summary(); });
    $('[data-wy-change]', q)?.addEventListener('click', () => { show(0); summary(); });
    f.elements.phone && (f.elements.phone.pattern = '[0-9 +()]{8,18}');
    const where = page === 'service-plans' ? 'From the service plans page.' : 'From the cartridge replacement page.';
    const message = () => {
      const p = priceOf(optBtns.find(x => x.dataset.opt === option)?.dataset.o);
      return [`${system || 'Not sure yet'}.`, option ? `Option: ${option}${p ? ` (${p} a year)` : ''}.` : 'Option: not chosen.', `Suburb: ${f.elements.suburb?.value || ''}.`, where].join(' ');
    };
    f.addEventListener('submit', async e => {
      e.preventDefault(); if (sending) return;
      if (!form.started) { form.started = true; }
      window.ffyTrack && window.ffyTrack('form_start', { form: page });
      if (step === 0) { if (!system) { error.textContent = 'Please choose a system, or Not sure.'; error.hidden = false; return; } show(1); summary(); return; }
      for (const i of $$('input:not([type=hidden])', panes[step])) if (!i.reportValidity()) return;
      if (step === 1) { show(2); summary(); return; }
      if (!f.elements.suburb.checkValidity()) { show(1); f.elements.suburb.reportValidity(); return; }
      hidden('system', system || 'Not sure yet'); hidden('service_option', option); hidden('message', message());
      hidden('_subject', `${system || 'Service'}${option ? ', ' + option : ''}, ${f.elements.suburb.value}`);
      if (window.ffyStampForm) window.ffyStampForm(f);
      sending = true; send.disabled = true; nextLabel.textContent = 'Sending…'; error.hidden = true;
      const done = () => { q.classList.add('finished'); $('.done', q)?.setAttribute('role', 'status'); window.ffyLeadSuccess && window.ffyLeadSuccess(f, { form: page, label: page.replace(/-/g, '_'), system: system || 'not chosen' }); };
      const fail = () => { error.textContent = 'That did not send. Please try again, or call 0430 546 749.'; error.hidden = false; nextLabel.textContent = 'Try again'; };
      try {
        const r = await fetch(f.action, { method: 'POST', body: new FormData(f), headers: { Accept: 'application/json' } });
        r.ok ? done() : fail();
      } catch (err) {
        try { f.submit(); return; } catch (x) {}
        fail();
      } finally { sending = false; send.disabled = false; if (!q.classList.contains('finished') && nextLabel.textContent === 'Sending…') nextLabel.textContent = sendLabel; }
    });
    show(0); pick('', false); ready = true;
  })();
})();
