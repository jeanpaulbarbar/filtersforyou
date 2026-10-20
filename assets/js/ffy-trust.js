(function () {
  'use strict';
  var rows = [].slice.call(document.querySelectorAll('.fb-seals'));
  if (!rows.length) return;
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduce && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -6% 0px' });
    rows.forEach(function (row) {
      var r = row.getBoundingClientRect();
      if (r.top < innerHeight && r.bottom > 0) return;
      row.classList.add('is-wait');
      io.observe(row);
      row.addEventListener('focusin', function () { row.classList.add('is-in'); io.unobserve(row); });
    });
  }
  var MIN = 150;
  function press(a) {
    if (!a || a.classList.contains('is-press')) return;
    var t0 = Date.now();
    a.classList.add('is-press');
    function up() {
      removeEventListener('pointerup', up, true);
      removeEventListener('pointercancel', up, true);
      removeEventListener('keyup', up, true);
      setTimeout(function () { a.classList.remove('is-press'); }, Math.max(0, MIN - (Date.now() - t0)));
    }
    addEventListener('pointerup', up, true);
    addEventListener('pointercancel', up, true);
    addEventListener('keyup', up, true);
  }
  rows.forEach(function (row) {
    row.addEventListener('pointerdown', function (ev) {
      if (ev.button > 0) return;
      press(ev.target.closest('.fb-seals__a'));
    });
    row.addEventListener('keydown', function (ev) {
      if (ev.key === 'Enter') press(ev.target.closest('.fb-seals__a'));
    });
  });
  addEventListener('pageshow', function () {
    [].forEach.call(document.querySelectorAll('.fb-seals__a.is-press'), function (a) { a.classList.remove('is-press'); });
  });
})();
