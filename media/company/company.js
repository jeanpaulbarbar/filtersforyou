(() => {
  'use strict';
  const root = document.getElementById('co-page'); if (!root) return;
  document.documentElement.classList.add('co-js');
  window.__coReady = true;
  const page = root.dataset.page || '';
  const label = root.dataset.label || page;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const track = (ev, data) => { try { window.ffyTrack && window.ffyTrack(ev, data); } catch (e) {} };

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

  const anims = $$('[data-co-anim], [data-wy-anim]', root);
  anims.forEach(el => [...el.children].forEach((c, i) => { if (!c.style.getPropertyValue('--i')) c.style.setProperty('--i', i); }));
  function countUp(el) {
    if (el.dataset.done) return; el.dataset.done = '1';
    const to = parseInt(el.dataset.coCount || '0', 10), from = parseInt(el.dataset.coFrom || '0', 10);
    const pre = el.dataset.coPre || '';
    if (reduce || to === from) { el.textContent = pre + to.toLocaleString('en-AU'); return; }
    const t0 = performance.now(), dur = 1500;
    const tick = t => {
      const p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 3);
      el.textContent = pre + Math.round(from + (to - from) * e).toLocaleString('en-AU');
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }
  if (!reduce && 'IntersectionObserver' in window) $$('[data-co-count]', root).forEach(el => { el.textContent = (el.dataset.coPre || '') + parseInt(el.dataset.coFrom || '0', 10).toLocaleString('en-AU'); });
  const reveal = el => { el.classList.add('is-in'); $$('[data-co-count]', el).forEach(countUp); if (el.matches('[data-co-count]')) countUp(el); };
  if (reduce || !('IntersectionObserver' in window)) anims.forEach(reveal);
  else {
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { reveal(e.target); io.unobserve(e.target); } }), { threshold: 0.2 });
    anims.forEach(el => io.observe(el));
    const sweep = () => anims.forEach(el => { if (!el.classList.contains('is-in') && el.getBoundingClientRect().bottom < innerHeight * 0.6) reveal(el); });
    addEventListener('scroll', sweep, { passive: true });
  }

  const fills = $$('[data-co-fill]', root);
  if (fills.length) {
    const set = () => fills.forEach(el => {
      if (reduce) { el.style.setProperty('--p', 1); $$('li', el).forEach(li => li.classList.add('is-wet')); return; }
      const r = el.getBoundingClientRect(), vh = innerHeight;
      const p = Math.max(0, Math.min(1, (vh * 0.72 - r.top) / Math.max(1, r.height)));
      el.style.setProperty('--p', p.toFixed(3));
      $$('li', el).forEach(li => { const lr = li.getBoundingClientRect(); li.classList.toggle('is-wet', lr.top + lr.height * 0.35 < vh * 0.72); });
    });
    let busy = false;
    const onScroll = () => { if (busy) return; busy = true; requestAnimationFrame(() => { busy = false; set(); }); };
    addEventListener('scroll', onScroll, { passive: true }); addEventListener('resize', onScroll); set();
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

  const MORE = '<svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="m4 6 4 4 4-4" stroke="currentColor" stroke-width="2"/></svg>';
  $$('.rvl--rail', root).forEach(rail => {
    const clampAll = () => $$('.rvl__card', rail).forEach(card => {
      const t = $('.rvl__text', card); if (!t || card.classList.contains('is-open')) return;
      const over = t.scrollHeight > t.clientHeight + 6;
      card.classList.toggle('is-clamped', over);
      let b = $('.rvl__more', card);
      if (over && !b) {
        b = document.createElement('button'); b.type = 'button'; b.className = 'rvl__more'; b.setAttribute('aria-expanded', 'false');
        b.innerHTML = '<span>Read more</span>' + MORE; t.after(b);
        b.addEventListener('click', () => {
          const open = !card.classList.contains('is-open');
          if (open) { t.style.maxHeight = t.scrollHeight + 'px'; card.classList.add('is-open'); }
          else { t.style.maxHeight = t.scrollHeight + 'px'; void t.offsetHeight; t.style.maxHeight = ''; card.classList.remove('is-open'); }
          b.setAttribute('aria-expanded', open ? 'true' : 'false'); $('span', b).textContent = open ? 'Show less' : 'Read more';
        });
      } else if (!over && b && !card.classList.contains('is-open')) { b.remove(); }
    });
    clampAll(); addEventListener('load', clampAll); if (document.fonts && document.fonts.ready) document.fonts.ready.then(clampAll);
    const id = rail.id, prev = id && $(`[data-rail-prev="${id}"]`), next = id && $(`[data-rail-next="${id}"]`);
    if (!prev || !next) return;
    const step = () => { const c = $('.rvl__card', rail); return c ? c.getBoundingClientRect().width + 16 : rail.clientWidth * 0.8; };
    const sync = () => { prev.disabled = rail.scrollLeft < 8; next.disabled = rail.scrollLeft + rail.clientWidth > rail.scrollWidth - 8; };
    prev.addEventListener('click', () => rail.scrollBy({ left: -step(), behavior: reduce ? 'instant' : 'smooth' }));
    next.addEventListener('click', () => rail.scrollBy({ left: step(), behavior: reduce ? 'instant' : 'smooth' }));
    rail.addEventListener('scroll', sync, { passive: true }); addEventListener('resize', sync); sync();
  });

  (() => {
    const q = $('[data-qform]', root); if (!q) return;
    const f = $('form', q), panes = $$('[data-step]', q), dots = $$('.steps i', q);
    const nextLabel = $('[data-nextlabel]', q), back = $('[data-back]', q), send = $('[data-next]', q), error = $('[role=alert]', q);
    const card = $('[data-wy-chosen]', q);
    const sendLabel = q.dataset.send || 'Send it';
    const picks = {};
    let step = 0, sending = false, ready = false, started = false, formAnim = null;
    const hidden = (n, v) => { let i = f.elements[n]; if (!i) { i = document.createElement('input'); i.type = 'hidden'; i.name = n; f.append(i); } i.value = v; };
    const begin = () => { if (!started) { started = true; track('form_start', { form: page }); } };
    function show(n) {
      const moved = n !== step && !reduce && ready;
      const from = moved ? f.offsetHeight : 0;
      step = n; panes.forEach((p, i) => { p.hidden = i !== n; }); dots.forEach((d, i) => d.classList.toggle('on', i <= n));
      back.hidden = n === 0; nextLabel.textContent = n === panes.length - 1 ? sendLabel : 'Next';
      error.hidden = true;
      if (card) {
        const b = $(`[data-pick="system"] .sysopt.on`, q);
        card.hidden = !b || n === 0 || !$('[data-pick="system"]', panes[0]);
        if (b) {
          const img = $('img', b), box = $('.wy-chosen__img', card);
          box.hidden = !img; if (img) $('img', card).src = img.getAttribute('src');
          $('[data-wy-chosen-name]', card).textContent = b.dataset.v;
          $('[data-wy-chosen-price]', card).textContent = b.dataset.price || 'We help you choose';
        }
      }
      if (!moved) return;
      const pane = panes[n]; pane.classList.remove('is-enter'); void pane.offsetWidth; pane.classList.add('is-enter');
      if (formAnim) formAnim.cancel();
      const to = f.offsetHeight; f.style.overflow = 'hidden';
      formAnim = f.animate({ height: [from + 'px', to + 'px'] }, { duration: 420, easing: 'cubic-bezier(.22,1,.36,1)' });
      formAnim.onfinish = formAnim.oncancel = () => { f.style.overflow = ''; formAnim = null; };
    }
    $$('[data-pick]', q).forEach(group => {
      const field = group.dataset.pick;
      $$('.sysopt', group).forEach(b => b.addEventListener('click', () => {
        begin();
        picks[field] = picks[field] === b.dataset.v ? '' : b.dataset.v;
        $$('.sysopt', group).forEach(x => { const on = x.dataset.v === picks[field]; x.classList.toggle('on', on); x.setAttribute('aria-pressed', on ? 'true' : 'false'); });
        error.hidden = true;
        if (field === 'system' && picks[field]) track('system_select', { system: picks[field], form: page });
      }));
    });
    $$('input, textarea', f).forEach(i => i.addEventListener('input', begin, { once: true }));
    back.addEventListener('click', () => show(Math.max(0, step - 1)));
    $('[data-wy-change]', q)?.addEventListener('click', () => show(0));
    if (f.elements.phone) f.elements.phone.pattern = '[0-9 +()]{8,18}';
    const message = () => {
      const v = n => (f.elements[n]?.value || '').trim();
      return [picks.need ? `Help with: ${picks.need}.` : '', `System: ${picks.system || 'Not sure yet'}.`, v('suburb') ? `Suburb: ${v('suburb')}.` : '',
        v('details') ? `Message: ${v('details')}` : '', `From the ${label} page.`].filter(Boolean).join(' ');
    };
    f.addEventListener('submit', async e => {
      e.preventDefault(); if (sending) return;
      begin();
      const pane = panes[step];
      for (const g of $$('[data-pick][data-required]', pane)) if (!picks[g.dataset.pick]) { error.textContent = g.dataset.required; error.hidden = false; return; }
      for (const i of $$('input:not([type=hidden]), textarea', pane)) if (!i.reportValidity()) return;
      if (step < panes.length - 1) { show(step + 1); return; }
      hidden('system', picks.system || 'Not sure yet');
      if (picks.need) hidden('subject', picks.need);
      hidden('message', message());
      const sub = f.elements.suburb?.value || '';
      hidden('_subject', [picks.need || 'Enquiry', picks.system, sub].filter(Boolean).join(', ') + ` (${label})`);
      if (window.ffyStampForm) window.ffyStampForm(f);
      sending = true; send.disabled = true; nextLabel.textContent = 'Sending…'; error.hidden = true;
      const done = () => { q.classList.add('finished'); $('.done', q)?.setAttribute('role', 'status'); window.ffyLeadSuccess && window.ffyLeadSuccess(f, { form: page, label: page.replace(/-/g, '_'), system: picks.system || 'not chosen' }); };
      const fail = () => { error.textContent = 'That did not send. Please try again, or call 0430 546 749.'; error.hidden = false; nextLabel.textContent = 'Try again'; };
      try {
        const r = await fetch(f.action, { method: 'POST', body: new FormData(f), headers: { Accept: 'application/json' } });
        r.ok ? done() : fail();
      } catch (err) { fail(); }
      finally { sending = false; send.disabled = false; if (!q.classList.contains('finished') && nextLabel.textContent === 'Sending…') nextLabel.textContent = sendLabel; }
    });
    show(0); ready = true;
  })();
})();
