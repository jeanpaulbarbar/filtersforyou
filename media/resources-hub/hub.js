(() => {
  'use strict';
  const root = document.getElementById('rh-page'); if (!root) return;
  document.documentElement.classList.add('rh-js');
  window.__rhReady = true;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

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
    if (!a || !root.contains(a)) return;
    const id = a.getAttribute('href').slice(1); const el = id && document.getElementById(id);
    if (!el) return;
    e.preventDefault(); goTo(el);
    if (history.replaceState) history.replaceState(null, '', '#' + id);
  });

  const strip = $$('[data-rh-anim]', root);
  strip.forEach(el => [...el.children].forEach((c, i) => c.style.setProperty('--i', i)));

  const shelves = $$('.rh-shelf', root);
  const arrive = s => s.classList.add('is-in');
  if (reduce || !('IntersectionObserver' in window)) {
    strip.forEach(el => el.classList.add('is-in')); shelves.forEach(arrive);
    return;
  }
  const once = (els, opts, fn) => {
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { io.unobserve(e.target); fn(e.target); } }), opts);
    els.forEach(el => io.observe(el));
  };
  once(strip, { threshold: 0.2 }, el => el.classList.add('is-in'));
  once(shelves, { rootMargin: '0px 0px -22% 0px', threshold: 0 }, arrive);

  const sweep = () => shelves.forEach(s => { if (!s.classList.contains('is-in') && s.getBoundingClientRect().top < innerHeight * 0.78) arrive(s); });
  addEventListener('scroll', sweep, { passive: true });
  sweep();
})();
