 
(() => {
  'use strict';
  const doc = document.documentElement; doc.classList.add('lp-js');
  const main = document.querySelector('main.lp'); if (!main) return;
  const slug = main.dataset.location || '';
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];

  
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

  
  const offers = $$('.lp-offer');
  const bySys = {}, byKey = {};
  offers.forEach(o => { const r = { key: o.dataset.key, mode: o.dataset.mode, sys: o.dataset.sys, name: o.dataset.name, price: o.dataset.price, img: $('.lp-offer__img img', o)?.getAttribute('src'), url: $('.lp-offer__name a', o)?.getAttribute('href'), el: o }; bySys[r.sys] = r; byKey[r.key] = r; });
  const chosen = {};
  $$('.lp-models').forEach(g => { chosen[g.dataset.group] = $('button[aria-pressed=true]', g)?.dataset.lpModel; });
  let mode = 'every', model = chosen.every;

  
  const fit = $('#fit'), house = $('[data-lp-house]'), tabs = $$('.lp-modes [role=tab]'), glide = $('.lp-modes__glide');
  function placeGlide() {
    const on = tabs.find(t => t.getAttribute('aria-selected') === 'true'); if (!on || !glide) return;
    glide.style.setProperty('--gx', on.offsetLeft + 'px'); glide.style.setProperty('--gw', on.offsetWidth + 'px');
  }
  function setMode(m, opts = {}) {
    if (!chosen[m]) return;
    mode = m;
    tabs.forEach(t => { const on = t.dataset.lpMode === m; t.setAttribute('aria-selected', on); t.tabIndex = on ? 0 : -1; });
    $('#lp-fit-panel')?.setAttribute('aria-labelledby', 'lp-tab-' + m);
    placeGlide();
    $$('.lp-fit__line').forEach(l => l.toggleAttribute('data-idle', l.dataset.line !== m));
    if (house) house.dataset.mode = m;
    $$('.lp-models').forEach(g => g.toggleAttribute('data-idle', g.dataset.group !== m));
    setModel(chosen[m], opts);
  }
  function setModel(k, opts = {}) {
    const r = byKey[k]; if (!r) return;
    chosen[r.mode] = k; model = k;
    $$(`.lp-models[data-group="${r.mode}"] button`).forEach(b => b.setAttribute('aria-pressed', b.dataset.lpModel === k));
    offers.forEach(o => {
      const on = o === r.el, was = !o.hasAttribute('data-idle');
      o.toggleAttribute('data-idle', !on);
      if (on && !was && !opts.quiet) { o.classList.remove('is-new'); void o.offsetWidth; o.classList.add('is-new'); }
    });
    hero(r); bar(r); form.pick(r.sys, true);
  }
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => { setMode(t.dataset.lpMode); keepInView(); });
    t.addEventListener('keydown', e => {
      const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0; if (!d) return;
      e.preventDefault(); const n = tabs[(i + d + tabs.length) % tabs.length]; n.focus(); setMode(n.dataset.lpMode);
    });
  });
  $$('[data-lp-model]').forEach(b => b.addEventListener('click', () => { setModel(b.dataset.lpModel); keepInView(); }));
  
  function keepInView() {
    if (!matchMedia('(max-width:859px)').matches) return;
    const card = byKey[model] && byKey[model].el; if (!card) return;
    const r = card.getBoundingClientRect(), top = hdrH() + 8;
    if (r.top < top || r.top + 220 > innerHeight) goTo($('.lp-modes'), 12);
  }
  addEventListener('resize', placeGlide);
  document.fonts?.ready.then(placeGlide);

  
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
  $('[data-lp-choose]')?.addEventListener('click', e => { e.preventDefault(); goTo($('#lp-fit-title'), 20); });

  
  const barEl = $('#lp-bar');
  function bar(r) {
    if (!barEl) return;
    $('small', barEl).textContent = r.price.replace('From ', 'from ') + (matchMedia('(min-width:860px)').matches ? ' installed' : ''); $('[data-lp-bar-name]', barEl).textContent = r.name;
    const im = $('.lp-bar__img img', barEl); if (im.getAttribute('src') !== r.img) im.src = r.img;
    $('[data-lp-bar-cta]', barEl).dataset.sys = r.sys;
  }
  const phone = matchMedia('(max-width:859px)');
  let barQueued = false;
  function barCheck() {
    barQueued = false; if (!barEl) return;

    const vh = innerHeight, inView = el => { if (!el) return false; const b = el.getBoundingClientRect(); return b.top < vh && b.bottom > 0; };
    const fr = fit?.getBoundingClientRect();
    const past = fr && fr.top < vh * 0.2;
    const cta = byKey[model] && $('.lp-offer__cta', byKey[model].el);
    const off = !past || inView(cta) || inView($('#quote')) || inView($('footer'));
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
    function show(n) {
      step = n; panes.forEach((p, i) => p.hidden = i !== n); dots.forEach((d, i) => d.classList.toggle('on', i <= n));
      back.hidden = n === 0; nextLabel.textContent = n === 2 ? 'Request my installation date' : 'Next';
      error.hidden = true;
    }
    function summary() {
      const r = bySys[system];
      card.hidden = !r;
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
    show(0);
    return { pick };
  })();

  
  
  $$('details', main).forEach(d => {
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

  
  const want = new URLSearchParams(location.search).get('system');
  const start = want && byKey[want] ? byKey[want] : null;
  if (start) { chosen[start.mode] = start.key; setMode(start.mode, { quiet: true }); }
  else setMode('every', { quiet: true });
  form.pick('', true);
  barCheck();
})();
