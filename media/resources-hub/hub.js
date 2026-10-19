(() => {
  'use strict';
  const root = document.getElementById('rh-page'); if (!root) return;
  document.documentElement.classList.add('rh-js');
  window.__rhReady = true;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const nav = document.getElementById('rh-nav');
  const dock = document.getElementById('rh-dock');
  const end = root.querySelector('.rh-end');

  let lenis = null;
  if (window.Lenis && !reduce && matchMedia('(pointer:fine)').matches) {
    lenis = new Lenis({ duration: 1.35, smoothWheel: true, syncTouch: false });
    const raf = t => { lenis.raf(t); requestAnimationFrame(raf); }; requestAnimationFrame(raf);
  }

  function goTo(el) {
    const y = el.getBoundingClientRect().top + scrollY - (el.matches('.rh-shelf') ? 84 : 72);
    if (lenis) { lenis.resize(); lenis.scrollTo(y, { duration: 1.2, force: true }); }
    else scrollTo({ top: y, behavior: reduce ? 'instant' : 'smooth' });
  }
  document.addEventListener('click', e => {
    const a = e.target.closest && e.target.closest('a[href^="#"]');
    if (!a || !(root.contains(a) || dock && dock.contains(a))) return;
    const id = a.getAttribute('href').slice(1); const el = id && document.getElementById(id);
    if (!el) return;
    e.preventDefault(); goTo(el);
    if (history.replaceState) history.replaceState(null, '', '#' + id);
  });

  const strip = $$('[data-rh-anim]', root);
  strip.forEach(el => [...el.children].forEach((c, i) => c.style.setProperty('--i', i)));
  const shelves = $$('.rh-shelf', root);
  const cards = $$('.rh-grid > li', root);
  const isRail = li => getComputedStyle(li.parentElement).overflowX !== 'visible';
  function show(li, d) { if (li.classList.contains('is-in')) return; li.style.setProperty('--d', (reduce ? 0 : d) + 'ms'); li.classList.add('is-in'); }
  if (reduce || !('IntersectionObserver' in window)) {
    strip.forEach(el => el.classList.add('is-in')); shelves.forEach(s => s.classList.add('is-in')); cards.forEach(li => show(li, 0));
  } else {
    const once = (els, opts, fn) => { const io = new IntersectionObserver(es => { fn(es.filter(e => e.isIntersecting).map(e => { io.unobserve(e.target); return e.target; })); }, opts); els.forEach(el => io.observe(el)); };
    once(strip, { threshold: 0.2 }, els => els.forEach(el => el.classList.add('is-in')));
    once(shelves.map(s => s.querySelector('.rh-shelf__head')), { threshold: 0.35 }, els => els.forEach(h => h.closest('.rh-shelf').classList.add('is-in')));

    once(cards, { threshold: 0.12 }, els => {
      els.sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top || a.getBoundingClientRect().left - b.getBoundingClientRect().left);
      els.forEach((li, k) => {
        if (isRail(li)) [...li.parentElement.children].forEach((c, i) => show(c, Math.min(i, 3) * 80));
        else show(li, Math.min(k, 5) * 75);
      });
    });

    const sweep = () => {
      cards.forEach(li => { if (!li.classList.contains('is-in') && li.getBoundingClientRect().bottom < 0) show(li, 0); });
      shelves.forEach(s => { if (!s.classList.contains('is-in') && s.getBoundingClientRect().top < innerHeight * 0.5) s.classList.add('is-in'); });
    };
    addEventListener('scroll', sweep, { passive: true });
  }

  const chips = $$('.rh-chip');
  if (dock) { dock.hidden = false; dock.inert = true; }
  let current = '', docked = false, ticking = false;
  function setCurrent(id) {
    if (id === current) return; current = id;
    chips.forEach(c => { if (c.dataset.shelf === id) c.setAttribute('aria-current', 'true'); else c.removeAttribute('aria-current'); });
    if (dock && id) {
      const c = dock.querySelector(`.rh-chip[data-shelf="${id}"]`), row = c && c.closest('.rh-chips');
      if (c && row && row.scrollWidth > row.clientWidth) {
        const left = c.offsetLeft - (row.clientWidth - c.offsetWidth) / 2;
        row.scrollTo({ left: Math.max(0, left), behavior: reduce ? 'instant' : 'smooth' });
      }
    }
  }
  function setDock(on) {
    if (!dock || on === docked) return; docked = on;
    dock.classList.toggle('is-on', on); dock.inert = !on;
  }
  function update() {
    ticking = false;
    const mark = innerHeight * 0.38;
    let id = '';
    for (const s of shelves) { if (s.getBoundingClientRect().top <= mark) id = s.id; }
    if (end && end.getBoundingClientRect().top < mark) id = '';
    setCurrent(id);
    const navGone = nav && nav.getBoundingClientRect().bottom < 0;
    const endNear = end && end.getBoundingClientRect().top < innerHeight * 0.7;
    setDock(!!(navGone && !endNear && !document.body.classList.contains('mopen')));
  }
  const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll);
  update();
})();
