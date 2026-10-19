(function () {
  'use strict';
  var root = document.getElementById('rc');
  if (!root) return;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return [].slice.call((r || document).querySelectorAll(s)); };
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var DATA = {};
  try { DATA = JSON.parse(($('#rc-data') || {}).textContent || '{}'); } catch (e) { DATA = {}; }
  var SYS = DATA.systems || {};
  var fmt = function (n) { return '$' + Math.round(n).toLocaleString('en-AU'); };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var ARROW = '<svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M4.5 11.5 11.5 4.5M6 4.5h5.5V10" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var TICK = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  function swap(el, cls) { if (!el || reduce) return; el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls); }
  function press(btns, on) { btns.forEach(function (b) { b.setAttribute('aria-pressed', b === on ? 'true' : 'false'); }); }
  function headerRoom() { return innerWidth < 1080 ? 84 : 100; }
  function goTo(el) {
    if (!el) return;
    var y = el.getBoundingClientRect().top + scrollY - headerRoom() + 20;
    var l = window.__ffyLenis;
    if (l && l.scrollTo) l.scrollTo(y, { duration: 1 });
    else window.scrollTo({ top: y, behavior: reduce ? 'auto' : 'smooth' });
  }
  function priceLabel(s) { return (s.frm ? 'From ' : '') + fmt(s.price); }

  
  var pending = $$('.rc-rise,.rc-pop', root);
  function scan() {
    var h = innerHeight;
    pending = pending.filter(function (el) {
      var r = el.getBoundingClientRect();
      if (r.top < h * 0.92 || r.bottom < 0) { el.classList.add('is-in'); return false; }
      return true;
    });
    if (!pending.length) removeEventListener('scroll', onScroll);
  }
  var raf = 0;
  function onScroll() { if (!raf) raf = requestAnimationFrame(function () { raf = 0; scan(); }); }
  if (reduce) { pending.forEach(function (el) { el.classList.add('is-in'); }); pending = []; }
  else { addEventListener('scroll', onScroll, { passive: true }); addEventListener('resize', onScroll); requestAnimationFrame(scan); }

  
  $$('details', root).forEach(function (d) {
    var sum = $('summary', d); if (!sum) return;
    var anim = null, closing = false;
    if (d.open) d.classList.add('is-open');
    sum.addEventListener('click', function (e) {
      if (reduce || !d.animate) { requestAnimationFrame(function () { d.classList.toggle('is-open', d.open); }); return; }
      e.preventDefault();
      var from = d.offsetHeight, to;
      if (anim) { anim.cancel(); anim = null; }
      d.style.overflow = 'hidden';
      if (!d.open || closing) { closing = false; d.open = true; d.classList.add('is-open'); to = d.offsetHeight; }
      else {
        closing = true; d.classList.remove('is-open');
        var cs = getComputedStyle(d);
        to = sum.offsetHeight + parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom) + parseFloat(cs.borderTopWidth) + parseFloat(cs.borderBottomWidth);
      }
      anim = d.animate({ height: [from + 'px', to + 'px'] }, { duration: 420, easing: 'cubic-bezier(.22,1,.36,1)' });
      anim.onfinish = function () { anim = null; if (closing) { d.open = false; closing = false; } d.style.overflow = ''; };
    });
  });

  
  var railLinks = $$('.rc-est__nav a', root);
  if (railLinks.length && 'IntersectionObserver' in window) {
    var mark = function (id) { railLinks.forEach(function (a) { a.classList.toggle('on', a.getAttribute('href') === '#' + id); }); };
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) mark(e.target.id); }); }, { rootMargin: '-30% 0px -60% 0px' });
    $$('.rc-ch', root).forEach(function (c) { if (c.id) io.observe(c); });
    railLinks.forEach(function (a) {
      a.addEventListener('click', function (e) {
        var t = document.getElementById(a.getAttribute('href').slice(1)); if (!t) return;
        e.preventDefault();
        if (!t.open) { t.open = true; t.classList.add('is-open'); }
        goTo(t);
      });
    });
  }

  
  $$('[data-rc-range]', root).forEach(function (box) {
    var tabs = $$('[data-panel-tab]', box), panels = $$('.rc-panel', box);
    tabs.forEach(function (t) {
      t.addEventListener('click', function () {
        var k = t.getAttribute('data-panel-tab');
        tabs.forEach(function (o) { o.setAttribute('aria-selected', o === t ? 'true' : 'false'); o.tabIndex = o === t ? 0 : -1; });
        panels.forEach(function (p) {
          var on = p.getAttribute('data-panel') === k;
          p.hidden = !on;
          if (on) swap(p, 'is-enter');
        });
      });
      t.addEventListener('keydown', function (e) {
        var i = tabs.indexOf(t), n = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
        if (!n) return;
        e.preventDefault(); var x = tabs[(i + n + tabs.length) % tabs.length]; x.focus(); x.click();
      });
    });
  });

  
  $$('[data-rc-flow]', root).forEach(function (box) {
    var STAGES = DATA.stages || {};
    var chips = $$('[data-flow-sys]', box);
    var shelf = $('.rc-flow__shelf', box), carts = $('.rc-flow__carts', box), drop = $('.rc-flow__drop', box), pipe = $('.rc-flow__pipe', box);
    var info = $('.rc-flow__txt', box), count = $('[data-flow-count]', box), dots = $('.rc-flow__dots', box);
    var outEl = $('[data-flow-out]', box), link = $('[data-flow-link]', box), inEl = $('[data-flow-in]', box);
    var sys = box.getAttribute('data-start'), i = 0;
    function cartsFor(k) {
      var st = STAGES[k];
      return st.stages.map(function (s, n) {
        return '<button class="rc-cart" type="button" aria-pressed="false" data-i="' + n + '" aria-label="Stage ' + (n + 1) + ', ' + esc(s.t) + '">' +
          '<span class="rc-cart__n" aria-hidden="true">' + (n + 1) + '</span><img src="' + s.img + '" alt="" width="' + s.w + '" height="' + s.h + '" style="--h:' + (s.hp || 82) + '%" decoding="async"></button>';
      }).join('');
    }
    function place() {
      var b = $$('.rc-cart', carts)[i]; if (!b) return;
      var sr = shelf.getBoundingClientRect(), br = b.getBoundingClientRect();
      var x = br.left + br.width / 2 - sr.left;
      drop.style.setProperty('--x', x + 'px');
      var pr = pipe.getBoundingClientRect();
      pipe.style.setProperty('--p', Math.max(0, Math.min(1, (x - (pr.left - sr.left)) / pr.width)));
    }
    function stage(n, quiet) {
      var st = STAGES[sys]; if (!st) return;
      i = Math.max(0, Math.min(st.stages.length - 1, n));
      var s = st.stages[i];
      press($$('.rc-cart', carts), $$('.rc-cart', carts)[i]);
      count.textContent = 'Stage ' + (i + 1) + ' of ' + st.stages.length;
      dots.innerHTML = st.stages.map(function (_, k) { return '<i class="' + (k === i ? 'on' : '') + '"></i>'; }).join('');
      var html = '<h3>' + esc(s.t) + '</h3><span class="rc-chip rc-chip--y">' + esc(s.c) + '</span><p>' + esc(s.d) + '</p>';
      place();
      if (quiet || reduce) { info.innerHTML = html; return; }
      clearTimeout(info._t); info.classList.add('is-out');
      info._t = setTimeout(function () { info.innerHTML = html; info.classList.remove('is-out'); swap(info, 'is-swap'); }, 160);
    }
    function system(k, quiet) {
      if (!STAGES[k]) return;
      sys = k;
      press(chips, chips.filter(function (c) { return c.getAttribute('data-flow-sys') === k; })[0]);
      var st = STAGES[k];
      function fill() {
        carts.innerHTML = cartsFor(k);
        outEl.textContent = st.out; inEl.textContent = st.inn;
        link.href = st.href; link.querySelector('span').textContent = 'See ' + st.name;
        $$('img', carts).forEach(function (im) { if (!im.complete) im.addEventListener('load', place, { once: true }); });
        stage(0, quiet);
      }
      if (quiet || reduce) { fill(); return; }
      clearTimeout(carts._t); carts.classList.add('is-out');
      carts._t = setTimeout(function () {
        fill();
        var ims = $$('img', carts).map(function (im) { return im.decode ? im.decode().catch(function () {}) : null; });
        Promise.all(ims).then(function () { requestAnimationFrame(function () { carts.classList.remove('is-out'); place(); }); });
      }, 240);
    }
    box.addEventListener('click', function (e) {
      var c = e.target.closest('.rc-cart'); if (c && box.contains(c)) { stage(+c.getAttribute('data-i')); return; }
      var ch = e.target.closest('[data-flow-sys]'); if (ch) { system(ch.getAttribute('data-flow-sys')); return; }
      if (e.target.closest('[data-flow-prev]')) stage(i - 1);
      if (e.target.closest('[data-flow-next]')) stage(i + 1 >= STAGES[sys].stages.length ? 0 : i + 1);
    });
    carts.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); stage(i + (e.key === 'ArrowRight' ? 1 : -1)); var b = $$('.rc-cart', carts)[i]; if (b) b.focus(); }
    });
    addEventListener('resize', place);
    if ('ResizeObserver' in window) new ResizeObserver(place).observe(shelf);
    system(sys, true);
    addEventListener('load', function () { Object.keys(STAGES).forEach(function (k) { STAGES[k].stages.forEach(function (s) { var im = new Image(); im.src = s.img; }); }); });
    $$('img', carts).forEach(function (im) { if (!im.complete) im.addEventListener('load', place, { once: true }); });
  });

  
  $$('[data-rc-scale]', root).forEach(function (box) {
    var btns = $$('[data-x]', box), knob = $('.rc-scale__knob', box), val = $('[data-scale-v]', box), txt = $('[data-scale-t]', box);
    btns.forEach(function (b) {
      b.addEventListener('click', function () {
        press(btns, b);
        knob.style.setProperty('--x', b.getAttribute('data-x'));
        val.innerHTML = esc(b.getAttribute('data-v')) + '<small>micron</small>';
        txt.textContent = b.getAttribute('data-t');
        swap(val, 'is-bump');
      });
    });
  });

  
  $$('[data-rc-quiz]', root).forEach(function (box) {
    var steps = $$('.rc-quiz__step', box), bars = $$('.rc-quiz__prog i', box), back = $('.rc-quiz__back', box);
    var res = $('.rc-res', box), cards = $$('[data-res]', box), empty = $('.rc-res__empty', box);
    var trail = [];
    function show(id, quiet) {
      steps.forEach(function (s) { var on = s.getAttribute('data-step') === id; s.hidden = !on; if (on && !quiet) swap(s, 'is-enter'); });
      bars.forEach(function (b, k) { b.classList.toggle('on', k <= trail.length); });
      back.hidden = !trail.length;
    }
    function result(k) {
      cards.forEach(function (c) { c.hidden = c.getAttribute('data-res') !== k; });
      if (empty) empty.hidden = true;
      bars.forEach(function (b) { b.classList.add('on'); });
      swap(res, 'is-swap');
      if (innerWidth < 900) goTo(res);
    }
    box.addEventListener('click', function (e) {
      var o = e.target.closest('.rc-quiz__opt'); if (!o) return;
      var step = o.closest('.rc-quiz__step');
      press($$('.rc-quiz__opt', step), o);
      var next = o.getAttribute('data-next'), r = o.getAttribute('data-res-key');
      if (next) { trail.push(step.getAttribute('data-step')); show(next); var f = $('[data-step="' + next + '"] .rc-quiz__opt', box); if (f && e.detail === 0) f.focus(); }
      if (r) result(r);
    });
    back.addEventListener('click', function () { if (trail.length) { var p = trail.pop(); show(p); } });
    var restart = $$('[data-quiz-restart]', box);
    restart.forEach(function (b) {
      b.addEventListener('click', function () {
        trail = []; $$('.rc-quiz__opt', box).forEach(function (o) { o.setAttribute('aria-pressed', 'false'); });
        cards.forEach(function (c) { c.hidden = true; }); if (empty) empty.hidden = false;
        show(steps[0].getAttribute('data-step')); goTo(box);
      });
    });
    show(steps[0].getAttribute('data-step'), true);
  });

  
  function fill(r) { var p = (r.value - r.min) / (r.max - r.min) * 100; r.style.setProperty('--fill', p + '%'); }
  var CARE = { diy: 'DIY kit', service: 'Professional yearly service', life: 'Filtered for Life' };
  var COVER = { life: 'Lifetime warranty: parts, labour and the callout, while you stay on the Filtered for Life plan.', diy: 'The maker’s parts warranty, plus our lifetime promise on our own workmanship.', service: 'The maker’s parts warranty, plus our lifetime promise on our own workmanship.' };
  
  function bump(el, v) {
    if (el.textContent === v) return;
    var re = /^(From )?\$([\d,]+)$/, a = re.exec(el.textContent.trim()), b = re.exec(v);
    if (reduce || !a || !b) { el.textContent = v; swap(el, 'is-bump'); return; }
    var from = +a[2].replace(/,/g, ''), to = +b[2].replace(/,/g, ''), pre = b[1] || '', t0 = performance.now(), dur = 520;
    cancelAnimationFrame(el._raf);
    (function f(now) {
      var k = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - k, 3);
      el.textContent = pre + fmt(from + (to - from) * e);
      if (k < 1) el._raf = requestAnimationFrame(f); else el.textContent = v;
    })(t0);
  }

  
  $$('[data-rc-cost]', root).forEach(function (box) {
    var picks = $$('[data-k]', box), cares = $$('[data-care]', box), yrs = $('input[type=range]', box);
    var k = box.getAttribute('data-start') || 'premium', care = 'life';
    var o = function (n) { return $('[data-o="' + n + '"]', box); };
    function paint() {
      var s = SYS[k]; if (!s) return;
      var y = +yrs.value, yearly = s[care];
      o('img').src = s.img || s.parts_img || ''; o('img').alt = '';
      o('name').textContent = s.name; o('spec').textContent = s.spec;
      bump(o('install'), priceLabel(s));
      o('carelab').textContent = CARE[care] + ', each year';
      bump(o('yearly'), fmt(yearly));
      o('years').textContent = y + (y === 1 ? ' year' : ' years');
      o('yrs').textContent = y === 1 ? 'one year' : y + ' years';
      bump(o('total'), (s.frm ? 'From ' : '') + fmt(s.price + yearly * y));
      o('week').textContent = 'Your yearly care works out at about ' + fmt(yearly / 52) + ' a week.';
      o('cover').textContent = COVER[care];
      o('seal').className = 'rc-seal ' + (care === 'life' ? 'rc-seal--gold' : 'rc-seal--blue');
      var cta = o('cta'); cta.setAttribute('data-rc-sys', k);
      var lk = o('link'); lk.href = s.href; lk.querySelector('span').textContent = 'See ' + s.name;
      fill(yrs);
    }
    picks.forEach(function (b) { b.addEventListener('click', function () { k = b.getAttribute('data-k'); press(picks, b); paint(); }); });
    cares.forEach(function (b) { b.addEventListener('click', function () { care = b.getAttribute('data-care'); press(cares, b); paint(); }); });
    yrs.addEventListener('input', paint);
    paint();
  });

  
  $$('[data-rc-save]', root).forEach(function (box) {
    var picks = $$('[data-k]', box), cares = $$('[data-care]', box), price = $('input[type=range]', box);
    var n = +box.getAttribute('data-bottles') || 12, k = box.getAttribute('data-start') || 'premium', care = 'life';
    var o = function (x) { return $('[data-o="' + x + '"]', box); };
    var lastIcons = 0;
    function paint() {
      var s = SYS[k], p = +price.value, yearly = s[care];
      var bottled = n * p * 52, perYear = n * 52;
      o('n').textContent = n; o('price').textContent = '$' + p.toFixed(2);
      bump(o('bottled'), fmt(bottled));
      o('count').textContent = perYear.toLocaleString('en-AU') + ' bottles a year';
      var icons = Math.min(120, Math.round(perYear / 10)), wall = o('wall');
      if (icons !== lastIcons) {
        var html = '';
        for (var j = 0; j < icons; j++) html += '<i' + (j >= lastIcons ? ' class="is-new" style="--i:' + (j - lastIcons) + '"' : '') + '></i>';
        wall.innerHTML = html + '<small>' + (icons ? 'Each one is 10 bottles.' : '') + '</small>';
        lastIcons = icons;
      }
      o('img').src = s.img; o('name').textContent = s.name; o('spec').textContent = s.spec;
      bump(o('install'), fmt(s.price));
      o('carelab').textContent = CARE[care] + ', each year from your first service';
      bump(o('yearly'), fmt(yearly));
      var five = s.price + yearly * 4, bottled5 = bottled * 5;
      var fiveEl = o('five'); cancelAnimationFrame(fiveEl._raf);
      if (bottled > 0 && bottled5 >= five) bump(fiveEl, fmt(bottled5 - five));
      o('fivecmp').textContent = 'Five years of bottles ' + fmt(bottled5) + '. ' + s.name + ' installed plus four yearly ' + (care === 'diy' ? 'kits' : 'visits') + ' ' + fmt(five) + '.';
      var month = 0, paid = s.price, saved = 0;
      for (var m = 1; m <= 120; m++) { saved += bottled / 12; if (m % 12 === 0) paid += yearly; if (saved >= paid) { month = m; break; } }
      var pb = o('payback');
      if (bottled <= 0) { o('fivelab').textContent = 'Not buying bottles?'; o('five').textContent = 'Then it’s about what’s in the water.'; o('fivecmp').textContent = ''; pb.textContent = ''; }
      else {
        o('fivelab').textContent = bottled5 >= five ? 'Kept over five years' : 'Over five years';
        if (bottled5 < five) { fiveEl.textContent = fmt(five - bottled5) + ' more'; }
        pb.textContent = month ? 'Covers its install and care in about ' + (month < 24 ? month + ' months' : (Math.round(month / 6) / 2) + ' years') + ', if those are the bottles you buy.' : 'At this many bottles, it’s about what’s in the water more than the money.';
      }
      var hy = o('hydro'); if (hy) hy.hidden = !(box.getAttribute('data-kind') === 'hydrogen' && k !== 'premium');
      o('cta').setAttribute('data-rc-sys', k);
      fill(price);
    }
    $$('[data-step-by]', box).forEach(function (b) { b.addEventListener('click', function () { n = Math.max(0, Math.min(80, n + +b.getAttribute('data-step-by'))); paint(); }); });
    picks.forEach(function (b) { b.addEventListener('click', function () { k = b.getAttribute('data-k'); press(picks, b); paint(); }); });
    cares.forEach(function (b) { b.addEventListener('click', function () { care = b.getAttribute('data-care'); press(cares, b); paint(); }); });
    price.addEventListener('input', paint);
    paint();
  });

  
  $$('[data-rc-vs]', root).forEach(function (box) {
    var TYPES = DATA.types || {}, ROWS = DATA.rows || [];
    var sides = { a: box.getAttribute('data-a'), b: box.getAttribute('data-b') };
    function cell(v) { return v === true ? TICK + '<span class="rc-sr">Yes</span>' : v === false ? '<span class="no" aria-hidden="true"></span><span class="rc-sr">No</span>' : esc(v); }
    var outBox = [$('.rc-vs__cards', box), $('tbody', box)];
    function paint(changed) {
      if (changed !== 'none' && !reduce) {
        clearTimeout(box._t); outBox.forEach(function (e) { e.classList.add('is-out'); });
        box._t = setTimeout(function () { draw(changed); outBox.forEach(function (e) { e.classList.remove('is-out'); }); }, 150);
        $$('[data-vs-side] button', box).forEach(function (b) { var s = b.closest('[data-vs-side]').getAttribute('data-vs-side'), k = b.getAttribute('data-t'); b.setAttribute('aria-pressed', k === sides[s] ? 'true' : 'false'); b.disabled = k === sides[s === 'a' ? 'b' : 'a']; });
        return;
      }
      draw(changed);
    }
    function draw(changed) {
      ['a', 'b'].forEach(function (s) {
        var t = TYPES[sides[s]], card = $('[data-vs-card="' + s + '"]', box);
        $$('[data-vs-side="' + s + '"] button', box).forEach(function (b) {
          var k = b.getAttribute('data-t'); b.setAttribute('aria-pressed', k === sides[s] ? 'true' : 'false'); b.disabled = k === sides[s === 'a' ? 'b' : 'a'];
        });
        $('img', card).src = t.img; $('b', card).textContent = t.name; $('small', card).textContent = t.sub; $('em', card).textContent = t.price;
        if (changed === 'none' && false) swap(card, 'is-swap');
      });
      ROWS.forEach(function (r, n) {
        var tr = $$('tbody tr', box)[n]; if (!tr) return;
        var tds = $$('td', tr);
        ['a', 'b'].forEach(function (s, j) { var v = cell(TYPES[sides[s]].rows[n]); if (tds[j].innerHTML !== v) tds[j].innerHTML = v; });
      });
      $$('[data-vs-head]', box).forEach(function (h) { h.textContent = TYPES[sides[h.getAttribute('data-vs-head')]].short; });
    }
    $$('[data-vs-side] button', box).forEach(function (b) {
      b.addEventListener('click', function () { var s = b.closest('[data-vs-side]').getAttribute('data-vs-side'); sides[s] = b.getAttribute('data-t'); paint(s); });
    });
    $('.rc-vs__mid', box).addEventListener('click', function () { var t = sides.a; sides.a = sides.b; sides.b = t; paint(); });
    paint('none');
  });

  
  $$('[data-rc-faqf]', root).forEach(function (box) {
    var input = $('input', box), chips = $$('[data-cat]', box), count = $('.rc-faqf__count', box);
    var list = $('[data-faq-list]', root), qs = $$('.rc-fq', list), cats = $$('.rc-faqcat', list), none = $('.rc-faqnone', list);
    var cat = 'all', tmr = 0;
    var norm = function (s) { return s.toLowerCase().replace(/[^a-z0-9$ ]+/g, ' '); };
    qs.forEach(function (q) { q._t = norm(q.textContent); });
    function run() {
      var words = norm(input.value).split(/\s+/).filter(function (w) { return w.length > 1; }), shown = 0;
      qs.forEach(function (q) {
        var ok = (cat === 'all' || q.getAttribute('data-cat') === cat) && words.every(function (w) { return q._t.indexOf(w) > -1; });
        q.hidden = !ok; if (ok) shown++;
      });
      cats.forEach(function (c) { c.hidden = !$$('.rc-fq', c).some(function (q) { return !q.hidden; }); });
      none.hidden = shown > 0;
      count.textContent = shown === qs.length ? 'All ' + shown + ' questions' : shown + (shown === 1 ? ' question' : ' questions') + ' found';
      if (words.length === 1 || words.length > 1) { var first = qs.filter(function (q) { return !q.hidden; })[0]; if (first && shown <= 3 && !first.open) { first.open = true; first.classList.add('is-open'); } }
    }
    input.addEventListener('input', function () { clearTimeout(tmr); tmr = setTimeout(run, 120); });
    chips.forEach(function (c) { c.addEventListener('click', function () { cat = c.getAttribute('data-cat'); press(chips, c); run(); goTo(list); }); });
    run();
  });

  
  $$('[data-rc-build]', root).forEach(function (box) {
    var R = DATA.build || {};
    var st = { whole: box.getAttribute('data-whole') || 'home', drink: box.getAttribute('data-drink') || 'premium', chill: false, mixer: false, care: 'life' };
    var o = function (x) { return $('[data-o="' + x + '"]', box); };
    var mixT = $('[data-tog="mixer"]', box), chillT = $('[data-tog="chill"]', box), first = true;
    function line(img, name, sub, price, was, key) {
      return '<li data-k="' + esc(key || name) + '"><img src="' + img + '" alt=""><span>' + esc(name) + (sub ? '<small>' + esc(sub) + '</small>' : '') + '</span><b>' + (was ? '<s>' + was + '</s>' : '') + price + '</b></li>';
    }
    function paint() {
      $$('[data-whole]', box).forEach(function (b) { if (b !== box) b.setAttribute('aria-pressed', b.getAttribute('data-whole') === st.whole ? 'true' : 'false'); });
      $$('[data-drink]', box).forEach(function (b) { if (b !== box) b.setAttribute('aria-pressed', b.getAttribute('data-drink') === st.drink ? 'true' : 'false'); });
      var w = st.whole !== 'none' ? SYS[st.whole] : null, d = st.drink !== 'none' ? SYS[st.drink] : null;
      var pack = w && d ? (st.whole === 'home' && st.drink === 'essential' ? 'deluxe' : st.whole === 'reserve' && st.drink === 'premium' ? 'deluxe-reserve' : '') : '';
      var mixOk = !!pack || st.drink === 'essential' || st.drink === 'premium';
      if (!mixOk) st.mixer = false;
      if (!d) st.chill = false;
      mixT.disabled = !mixOk || !!pack; chillT.disabled = !d;
      mixT.setAttribute('aria-pressed', pack || st.mixer ? 'true' : 'false'); chillT.setAttribute('aria-pressed', st.chill ? 'true' : 'false');
      $('small', mixT).textContent = pack ? 'Free in ' + SYS[pack].name : mixOk ? fmt(R.mixer) + ', hot, cold and filtered from one tap' : 'Pairs with Pure Essential or Pure Premium';
      $('small', chillT).textContent = d ? fmt(R.chiller) + ' installed with a system' : 'Choose a drinking water system first';
      var lines = '', total = 0, yearly = 0, notes = [];
      if (pack) {
        var P = SYS[pack];
        lines += line(P.parts_img[0], w.name, 'Whole house', fmt(w.price)) + line(P.parts_img[1], d.name, 'Drinking water', fmt(d.price)) + line(R.mixer_img, 'Classic three way mixer', 'Free in ' + P.name, 'Free', fmt(R.mixer));
        total = P.price; yearly = P[st.care];
        notes.push(P.name + ', the package price.' + (pack === 'deluxe-reserve' ? ' First year of servicing free on both.' : ''));
      } else {
        if (w) { lines += line(w.img, w.name, 'Whole house', fmt(w.price)); total += w.price; yearly += w[st.care]; }
        if (d) { lines += line(d.img, d.name, 'Drinking water', fmt(d.price)); total += d.price; yearly += d[st.care]; }
        if (w && d) {
          total -= R.extra_off; lines += line(R.two_img, 'Two systems at one address', 'Off the extra system’s install', '−' + fmt(R.extra_off));
          if (st.care !== 'diy') { yearly -= R.service_off; notes.push('Two systems: ' + fmt(R.service_off) + ' off the cheaper system’s yearly ' + (st.care === 'life' ? 'plan.' : 'service.')); }
        }
        if (st.mixer) { lines += line(R.mixer_img, 'Classic three way mixer', 'Hot, cold and filtered', fmt(R.mixer)); total += R.mixer; }
      }
      if (st.chill) { lines += line(R.chiller_img, 'Undersink chiller', 'Add on, no yearly servicing', fmt(R.chiller), '', 'chill'); total += R.chiller; }
      var list = o('lines'), before = {};
      $$('li[data-k]', list).forEach(function (li) { before[li.getAttribute('data-k')] = li.textContent; });
      list.innerHTML = lines || '<li class="rc-bill__empty">Choose what you’d like filtered.</li>';
      if (!first) $$('li[data-k]', list).forEach(function (li) { if (before[li.getAttribute('data-k')] !== li.textContent) li.classList.add('is-new'); });
      first = false;
      o('lines').hidden = false;
      bump(o('total'), total ? (w ? 'From ' : '') + fmt(total) : '$0');
      o('carelab').textContent = CARE[st.care] + ', each year';
      bump(o('yearly'), yearly ? fmt(yearly) : '$0');
      o('note').textContent = notes.join(' ');
      o('cover').textContent = COVER[st.care];
      o('seal').className = 'rc-seal ' + (st.care === 'life' ? 'rc-seal--gold' : 'rc-seal--blue');
      o('cta').setAttribute('data-rc-sys', pack || (w && d ? st.whole + '+' + st.drink : st.whole !== 'none' ? st.whole : st.drink !== 'none' ? st.drink : ''));
      o('cta').setAttribute('data-rc-addon', st.chill ? 'chiller' : '');
    }
    box.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b || b.disabled) return;
      if (b.hasAttribute('data-whole') && b !== box) { st.whole = b.getAttribute('data-whole'); paint(); }
      else if (b.hasAttribute('data-drink')) { st.drink = b.getAttribute('data-drink'); paint(); }
      else if (b === mixT) { st.mixer = !st.mixer; paint(); }
      else if (b === chillT) { st.chill = !st.chill; paint(); }
      else if (b.hasAttribute('data-care')) { st.care = b.getAttribute('data-care'); press($$('[data-care]', box), b); paint(); }
    });
    paint();
  });

  
  $$('[data-rc-board]', root).forEach(function (box) {
    var btns = $$('.rc-board__list button', box), cards = $$('.rc-board__show', box);
    btns.forEach(function (b) {
      b.addEventListener('click', function () {
        press(btns, b);
        var k = b.getAttribute('data-show');
        cards.forEach(function (c) { var on = c.getAttribute('data-card') === k; c.hidden = !on; if (on) swap(c, 'is-swap'); });
        if (innerWidth < 1080) goTo(cards.filter(function (c) { return !c.hidden; })[0]);
      });
    });
  });

  
  (function () {
    var wrap = $('#rmq', root); if (!wrap) return;
    var phone = matchMedia('(max-width:859px)');
    var clamp = function (n, a, b) { return Math.max(a, Math.min(b, n)); };
    var lanes = $$('.rrow', wrap).map(function (row) {
      var originals = [].slice.call(row.children);
      var setW = row.scrollWidth, need = Math.max(innerWidth, 1920) + setW + 200;
      for (var n = 0; n < 8 && row.scrollWidth < need; n++) originals.forEach(function (card) { var copy = card.cloneNode(true); copy.inert = true; copy.setAttribute('aria-hidden', 'true'); row.appendChild(copy); });
      return { el: row, first: originals[0], copy: row.children[originals.length], dir: parseInt(row.getAttribute('data-dir') || '-1', 10), pos: 0, half: 0 };
    });
    function measure() { lanes.forEach(function (l) { if (!l.copy) return; l.half = l.copy.offsetLeft - l.first.offsetLeft; if (l.dir > 0 && l.pos === 0) l.pos = -l.half; }); }
    measure(); if ('ResizeObserver' in window) new ResizeObserver(measure).observe(wrap);
    if (reduce) return;
    var visible = false, last = 0, vel = 0, lastY = scrollY, raf = 0;
    function step(t) {
      if (!visible || document.hidden) { raf = 0; last = 0; return; }
      if (last) {
        var dt = Math.min((t - last) / 1000, .05), dy = scrollY - lastY; lastY = scrollY;
        var target = phone.matches ? 0 : clamp(dy / Math.max(dt, .001) / 900, -1, 1);
        vel += (target - vel) * Math.min(1, dt * 6);
        lanes.forEach(function (l) { if (!l.half || l.el.offsetParent === null) return; l.pos += l.dir * (30 + Math.abs(vel) * 260) * dt; if (l.pos <= -l.half) l.pos += l.half; if (l.pos > 0) l.pos -= l.half; l.el.style.transform = 'translateX(' + l.pos.toFixed(2) + 'px) skewX(' + (-vel * 4).toFixed(2) + 'deg)'; });
      }
      last = t; raf = requestAnimationFrame(step);
    }
    function sync() { cancelAnimationFrame(raf); raf = 0; last = 0; lastY = scrollY; if (visible && !document.hidden) raf = requestAnimationFrame(step); }
    new IntersectionObserver(function (es) { visible = es[0].isIntersecting; sync(); }, { rootMargin: '80px 0px' }).observe(wrap);
    document.addEventListener('visibilitychange', sync);
  })();

  
  var ask = $('[data-rc-ask]', root);
  if (ask) (function () {
    var f = $('form', ask), panes = $$('.rc-q__pane', ask), bars = $$('.rc-q__steps i', ask), back = $('.rc-q__back', ask);
    var next = $('[data-next]', ask), nextLabel = $('[data-nextlabel]', ask), err = $('.rc-q__err', ask);
    var opts = $$('.rc-q__opt', ask), whens = $$('[data-when]', ask), chosen = $('.rc-q__chosen', ask), chill = $('[data-q-chill]', ask);
    var step = 0, system = '', picked = false, when = '', addon = false, sending = false, started = false, trail = [];
    var page = ask.getAttribute('data-page') || 'guide';
    var ADDON = 'Undersink chiller, $1,050 installed with a system';
    function hidden(n, v) { var i = f.elements[n]; if (!i) { i = document.createElement('input'); i.type = 'hidden'; i.name = n; f.appendChild(i); } i.value = v; }
    function nameOf(k) { if (!k) return ''; if (SYS[k]) return SYS[k].name; if (k.indexOf('+') > 0) return k.split('+').map(function (x) { return SYS[x] ? SYS[x].name : x; }).join(' and '); return k; }
    function show(n) {
      step = n;
      panes.forEach(function (p, k) { p.hidden = k !== n; if (k === n) swap(p, 'is-enter'); });
      bars.forEach(function (b, k) { b.classList.toggle('on', k <= n); });
      back.hidden = n === 0; nextLabel.textContent = n === 2 ? 'Send my request' : 'Next'; err.hidden = true;
    }
    function summary() {
      var s = SYS[system];
      chosen.hidden = !system;
      if (system) {
        var img = s ? (s.img || (s.parts_img && s.parts_img[0])) : (SYS[system.split('+')[0]] || {}).img;
        $('img', chosen).src = img || '';
        $('b', chosen).textContent = nameOf(system);
        $('small', chosen).textContent = s ? priceLabel(s) + ' installed' + (addon ? ', plus the undersink chiller' : '') : (addon ? 'Plus the undersink chiller' : 'Two systems at one address');
      }
    }
    function pick(k) {
      if (ask.classList.contains('is-sent')) return;
      system = k || '';
      opts.forEach(function (o) { o.setAttribute('aria-pressed', o.getAttribute('data-k') === system ? 'true' : 'false'); });
      summary();
    }
    function setAddon(on) { addon = !!on; if (chill) chill.setAttribute('aria-pressed', addon ? 'true' : 'false'); hidden('add_on', addon ? ADDON : ''); summary(); }
    opts.forEach(function (o) { o.addEventListener('click', function () { pick(o.getAttribute('data-k')); picked = true; err.hidden = true; window.ffyTrack && window.ffyTrack('system_select', { system: system || 'not sure', form: page }); }); });
    whens.forEach(function (b) { b.addEventListener('click', function () { when = when === b.getAttribute('data-when') ? '' : b.getAttribute('data-when'); whens.forEach(function (x) { x.setAttribute('aria-pressed', x.getAttribute('data-when') === when ? 'true' : 'false'); }); }); });
    if (chill) chill.addEventListener('click', function () { setAddon(!addon); });
    $('[data-q-change]', ask).addEventListener('click', function () { trail.push(step); show(1); });
    back.addEventListener('click', function () { show(trail.length ? trail.pop() : Math.max(0, step - 1)); });
    document.addEventListener('click', function (e) {
      var b = e.target.closest('[data-rc-sys],.js-open'); if (!b) return;
      if (b.tagName === 'A' && b.getAttribute('href') && !b.hasAttribute('data-rc-sys')) return;
      e.preventDefault();
      var k = b.getAttribute('data-rc-sys') || b.getAttribute('data-sys') || '';
      if (k && k !== 'Not sure yet') pick(k);
      if (b.getAttribute('data-rc-addon') === 'chiller') setAddon(true);
      var ok = f.elements.suburb.value.trim().length > 1;
      trail = [];
      if (!ask.classList.contains('is-sent')) show(ok ? (system ? 2 : 1) : 0);
      goTo(ask);
      setTimeout(function () { var i = $('.rc-q__pane:not([hidden]) input:not([type=hidden])', ask); if (i && innerWidth > 899) i.focus({ preventScroll: true }); }, 700);
    }, true);
    var message = function () {
      return [(nameOf(system) || 'Not sure yet') + ' installation request.', 'Suburb: ' + f.elements.suburb.value.trim() + '.', when ? 'Timing: ' + when + '.' : '', addon ? 'Add on: ' + ADDON + '.' : '', 'From the ' + (ask.getAttribute('data-title') || 'guide') + ' page.'].filter(Boolean).join(' ');
    };
    f.addEventListener('submit', function (e) {
      e.preventDefault(); if (sending) return;
      if (!started) { started = true; window.ffyTrack && window.ffyTrack('form_start', { form: page }); }
      var ins = $$('input:not([type=hidden])', panes[step]);
      for (var j = 0; j < ins.length; j++) if (!ins[j].reportValidity()) return;
      if (step === 0) { if (f.elements.suburb.value.trim().length < 2) { err.textContent = 'Please add your suburb or postcode.'; err.hidden = false; return; } trail.push(0); show(system ? 2 : 1); return; }
      if (step === 1) { if (!system && !picked) { err.textContent = 'Please choose a system, or Not sure yet.'; err.hidden = false; return; } trail.push(1); show(2); return; }
      hidden('system', nameOf(system) || 'Not sure yet'); hidden('installation_preference', when); hidden('message', message());
      hidden('_subject', (nameOf(system) || 'Installation') + ' request, ' + f.elements.suburb.value.trim());
      if (window.ffyStampForm) window.ffyStampForm(f);
      sending = true; next.disabled = true; nextLabel.textContent = 'Sending…'; err.hidden = true;
      var fail = function () { err.textContent = 'That did not send. Please try again, or call 0430 546 749.'; err.hidden = false; nextLabel.textContent = 'Try again'; };
      fetch(f.action, { method: 'POST', body: new FormData(f), headers: { Accept: 'application/json' } }).then(function (r) {
        if (r.ok) {
          ask.classList.add('is-sent');
          window.ffyLeadSuccess && window.ffyLeadSuccess(f, { form: page, label: page, system: nameOf(system) || 'not chosen' });
          var d = $('.rc-q__done', ask); d.setAttribute('tabindex', '-1'); d.focus({ preventScroll: true });
        } else fail();
      }).catch(fail).then(function () { sending = false; next.disabled = false; });
    });
    show(0);
    var want = new URLSearchParams(location.search).get('system');
    if (want && SYS[want]) pick(want);
  })();
})();
(function () {
  document.querySelectorAll('#rc [data-rc-copy]').forEach(function (b) {
    var box = b.closest('.rc-note'), txt = box && box.querySelector('[data-rc-copytext]'), lab = b.querySelector('span'), orig = lab.textContent;
    b.addEventListener('click', function () {
      var done = function () { lab.textContent = 'Copied'; b.classList.remove('is-done'); void b.offsetWidth; b.classList.add('is-done'); setTimeout(function () { lab.textContent = orig; }, 2200); };
      var text = txt.textContent.trim();
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, function () { sel(); });
      else sel();
      function sel() { var r = document.createRange(); r.selectNodeContents(txt); var s = getSelection(); s.removeAllRanges(); s.addRange(r); lab.textContent = 'Selected, now copy it'; }
    });
  });
})();
