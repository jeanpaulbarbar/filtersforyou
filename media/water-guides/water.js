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
  if (window.Lenis && !reduce && matchMedia('(pointer:fine)').matches) {
    lenis = new Lenis({ duration: 1.25, smoothWheel: true, syncTouch: false });
    const raf = t => { lenis.raf(t); requestAnimationFrame(raf); }; requestAnimationFrame(raf);
  }
  const hdrH = () => (document.getElementById('hdr')?.offsetHeight || 72);
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

  // count up, only the first time a number comes into view
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

  // reveal
  const anims = $$('[data-wg-anim]', root), ios = $$('[data-wg-io]', root);
  anims.forEach(el => [...el.children].forEach((c, i) => { if (!c.style.getPropertyValue('--i')) c.style.setProperty('--i', i); }));
  const reveal = el => { el.classList.add('is-in'); $$('[data-count]', el).forEach(countUp); };
  const all = [...anims, ...ios, ...$$('[data-wy-anim]', root)];
  if (reduce || !('IntersectionObserver' in window)) all.forEach(reveal);
  else {
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { reveal(e.target); io.unobserve(e.target); } }), { threshold: 0.2 });
    all.forEach(el => io.observe(el));
    const sweep = () => all.forEach(el => { if (!el.classList.contains('is-in') && el.getBoundingClientRect().top < innerHeight * 0.6) reveal(el); });
    addEventListener('scroll', sweep, { passive: true }); sweep();
  }

  // a radio group of buttons with roving focus and arrow keys
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

  // explorers: one JSON section per board, chips pick the key, fields follow
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
      $$('tr[data-row]', box).forEach(tr => tr.classList.toggle('is-on', tr.dataset.row === key));
    };
    const group = $('[data-wg-pick]', box);
    if (group) radios(group, '[data-key]', b => { apply(b.dataset.key, true); window.ffyTrack && window.ffyTrack('water_explorer', { page, board: box.dataset.wgX, key: b.dataset.key }); });
    const start = $('[data-key][aria-checked="true"]', box); if (start) apply(start.dataset.key, false);
  });

  // what is in your glass
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

  // the chooser
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

  // flip cards
  $$('[data-wg-flip]', root).forEach(b => b.addEventListener('click', () => b.setAttribute('aria-pressed', b.getAttribute('aria-pressed') === 'true' ? 'false' : 'true')));

  // soft open and close on every disclosure
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

  // reviews lane
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

  // the three step request form
  (() => {
    const q = $('[data-qform]', root); if (!q) return;
    const f = $('form', q), panes = $$('[data-step]', q), dots = $$('.steps i', q);
    const nextLabel = $('[data-nextlabel]', q), back = $('[data-back]', q), send = $('[data-next]', q), error = $('[role=alert]', q);
    const card = $('[data-wy-chosen]', q);
    const sysBtns = $$('[data-step="0"] .sysopt', q), whenBtns = $$('[data-when]', q);
    const finalLabel = q.dataset.final || 'Get my fixed price';
    let step = 0, system = '', when = '', sending = false, started = false, ready = false, formAnim = null;
    const hidden = (n, v) => { let i = f.elements[n]; if (!i) { i = document.createElement('input'); i.type = 'hidden'; i.name = n; f.append(i); } i.value = v; };
    function show(n) {
      const moved = n !== step && !reduce && ready;
      const from = moved ? f.offsetHeight : 0;
      step = n; panes.forEach((p, i) => { p.hidden = i !== n; }); dots.forEach((d, i) => d.classList.toggle('on', i <= n));
      back.hidden = n === 0; nextLabel.textContent = n === 2 ? finalLabel : 'Next';
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
      card.hidden = !real || step === 0;
      if (real) { $('img', card).src = $('img', b).getAttribute('src'); $('[data-wy-chosen-name]', card).textContent = b.dataset.name; $('[data-wy-chosen-price]', card).textContent = b.dataset.price; }
    }
    function pick(v) {
      q.classList.remove('finished'); system = v || '';
      sysBtns.forEach(b => { const on = b.dataset.v === system; b.classList.toggle('on', on); b.setAttribute('aria-pressed', on ? 'true' : 'false'); });
      summary();
    }
    sysBtns.forEach(b => b.addEventListener('click', () => { pick(b.dataset.v); error.hidden = true; window.ffyTrack && window.ffyTrack('system_select', { system, form: 'water-' + page }); }));
    whenBtns.forEach(b => b.addEventListener('click', () => {
      when = b.getAttribute('aria-pressed') === 'true' ? '' : b.dataset.when;
      whenBtns.forEach(o => { const on = o.dataset.when === when; o.classList.toggle('on', on); o.setAttribute('aria-pressed', on ? 'true' : 'false'); });
    }));
    // a chooser card can preselect the form
    root.addEventListener('click', e => { const a = e.target.closest('[data-ask]'); if (a) pick(a.dataset.ask); });
    back.addEventListener('click', () => { show(Math.max(0, step - 1)); summary(); });
    $('[data-wy-change]', q)?.addEventListener('click', () => { show(0); summary(); });
    f.elements.phone && (f.elements.phone.pattern = '[0-9 +()]{8,18}');
    const from = q.dataset.from || 'a water guide';
    const message = () => [`${system || 'Not sure yet'} quote request.`, `Suburb: ${f.elements.suburb?.value || ''}.`, when ? `Timing: ${when}.` : '', `From the ${from} page.`].filter(Boolean).join(' ');
    f.addEventListener('submit', async e => {
      e.preventDefault(); if (sending) return;
      if (!started) { started = true; window.ffyTrack && window.ffyTrack('form_start', { form: 'water-' + page }); }
      if (step === 0) { if (!system) { error.textContent = 'Please choose a system, or Help me choose.'; error.hidden = false; return; } show(1); summary(); return; }
      for (const i of $$('input:not([type=hidden])', panes[step])) if (!i.reportValidity()) return;
      if (step === 1) { show(2); summary(); return; }
      if (!f.elements.suburb.checkValidity()) { show(1); f.elements.suburb.reportValidity(); return; }
      hidden('system', system || 'Not sure yet'); hidden('installation_preference', when); hidden('message', message());
      hidden('_subject', `${system || 'Water filter'} quote request, ${f.elements.suburb.value}`);
      if (window.ffyStampForm) window.ffyStampForm(f);
      sending = true; send.disabled = true; nextLabel.textContent = 'Sending…'; error.hidden = true;
      const done = () => { q.classList.add('finished'); $('.done', q)?.setAttribute('role', 'status'); window.ffyLeadSuccess && window.ffyLeadSuccess(f, { form: 'water-' + page, label: page.replace(/-/g, '_'), system: system || 'not chosen' }); };
      const fail = () => { error.textContent = 'That did not send. Please try again, or call 0430 546 749.'; error.hidden = false; nextLabel.textContent = 'Try again'; };
      try {
        const r = await fetch(f.action, { method: 'POST', body: new FormData(f), headers: { Accept: 'application/json' } });
        r.ok ? done() : fail();
      } catch (err) {
        try { f.submit(); return; } catch (x) {}
        fail();
      } finally { sending = false; send.disabled = false; if (!q.classList.contains('finished') && nextLabel.textContent === 'Sending…') nextLabel.textContent = finalLabel; }
    });
    show(0); pick(''); ready = true;
  })();
})();
