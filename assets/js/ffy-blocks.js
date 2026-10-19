(function () {
  'use strict';
  var doc = document.documentElement;
  if (!document.querySelector('.fb')) return;
  doc.classList.add('fb-js');
  window.__fbReady = true;
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return [].slice.call((r || document).querySelectorAll(s)); };
  var mod = function (a, n) { return ((a % n) + n) % n; };
  var pending = $$('.fb .fb-rise');
  function scan() {
    if (!pending.length) return;
    var line = innerHeight * 0.9;
    pending = pending.filter(function (el) {
      if (!el.isConnected) return false;
      if (!el.offsetParent && el.getClientRects().length === 0) return true;
      if (el.getBoundingClientRect().top < line) { el.classList.add('is-in'); return false; }
      return true;
    });
  }
  var raf = 0;
  function queue() { if (!raf) raf = requestAnimationFrame(function () { raf = 0; scan(); }); }
  if (reduce) { pending.forEach(function (el) { el.classList.add('is-in'); }); pending = []; }
  else {
    addEventListener('scroll', queue, { passive: true });
    addEventListener('resize', queue);
    queue(); setTimeout(queue, 600);
  }
  $$('[data-fb-hcard]').forEach(function (card) {
    var hero = card.closest('.fb-hero');
    if (!hero) return;
    var fit = function () { hero.style.setProperty('--fb-card-h', card.offsetHeight + 'px'); };
    fit();
    if ('ResizeObserver' in window) new ResizeObserver(fit).observe(card); else addEventListener('resize', fit);
  });
  $$('.fb-rmq').forEach(function (rmq) {
    if (reduce) return;
    var rows = $$('.fb-rrow', rmq).map(function (row) {
      var track = $('.fb-rrow__track', row), kids = [].slice.call(track.children);
      kids.forEach(function (el) { var c = el.cloneNode(true); c.setAttribute('aria-hidden', 'true'); c.inert = true; track.appendChild(c); });
      return { track: track, dir: +row.getAttribute('data-dir') || -1, span: 0, n: kids.length };
    });
    if (!rows.length) return;
    var measure = function () { rows.forEach(function (r) { var k = r.track.children; r.span = k[r.n] ? k[r.n].offsetLeft - k[0].offsetLeft : 0; }); };
    measure(); addEventListener('resize', measure);
    rmq.classList.add('is-moving');
    var vis = false, shown = 0, lastT = 0, drift = 0;
    if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { vis = es[0].isIntersecting; }, { rootMargin: '120px 0px' }).observe(rmq);
    else vis = true;
    (function frame(t) {
      var dt = lastT ? Math.min((t - lastT) / 1000, 0.05) : 0; lastT = t;
      if (vis && !document.hidden) {
        var r = rmq.getBoundingClientRect();
        var wanted = (innerHeight - r.top) * 0.42;
        drift += dt * 14;
        shown += (wanted - shown) * (1 - Math.pow(1 - 0.12, dt * 60));
        rows.forEach(function (row, i) {
          if (!row.span) return;
          var x = (shown + drift) * row.dir * (i === 1 ? 0.85 : 1);
          x = -mod(-x, row.span);
          row.track.style.transform = 'translate3d(' + x.toFixed(2) + 'px,0,0)';
        });
      }
      requestAnimationFrame(frame);
    })(0);
  });
  $$('[data-fb-fff]').forEach(function (btn) {
    var d = document.getElementById(btn.getAttribute('aria-controls'));
    if (!d || typeof d.showModal !== 'function') return;
    d.removeAttribute('open');
    d.classList.add('is-modal');
    var shut = function () {
      if (!d.open || d.classList.contains('is-closing')) return;
      if (reduce) { d.close(); return; }
      d.classList.add('is-closing');
      var done = function () { d.removeEventListener('animationend', done); d.classList.remove('is-closing'); d.close(); };
      d.addEventListener('animationend', done);
      setTimeout(function () { if (d.open && d.classList.contains('is-closing')) done(); }, 450);
    };
    btn.addEventListener('click', function () {
      d.showModal();
      doc.classList.add('fb-fff-on');
      if (window.ffyTrack) window.ffyTrack('filtered_for_free_open', {});
    });
    d.addEventListener('close', function () { doc.classList.remove('fb-fff-on'); btn.focus({ preventScroll: true }); });
    d.addEventListener('cancel', function (e) { e.preventDefault(); shut(); });
    var x = d.querySelector('[data-fb-fff-close]'); if (x) x.addEventListener('click', shut);
    d.addEventListener('click', function (e) { if (e.target === d) shut(); });
  });
  $$('.fb [data-fb-more]').forEach(function (box) {
    var btn = box.querySelector('.fb-more__btn'), body = box.querySelector('.fb-more__body'), anim = null;
    if (!btn || !body) return;
    btn.setAttribute('aria-expanded', 'false'); body.hidden = true;
    btn.addEventListener('click', function () {
      var opening = btn.getAttribute('aria-expanded') !== 'true';
      btn.setAttribute('aria-expanded', opening ? 'true' : 'false');
      var from = body.hidden ? 0 : body.getBoundingClientRect().height;
      if (anim) { anim.cancel(); anim = null; }
      body.hidden = false;
      var to = opening ? body.scrollHeight : 0;
      if (reduce || !body.animate) { body.hidden = !opening; return; }
      anim = body.animate([{ height: from + 'px' }, { height: to + 'px' }], { duration: 420, easing: 'cubic-bezier(.22,1,.36,1)' });
      anim.onfinish = function () { anim = null; if (!opening) body.hidden = true; };
    });
  });
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('.fb [data-fb-sys]');
    if (!a) return;
    var form = document.querySelector(a.getAttribute('href') || '#ask'), name = a.getAttribute('data-fb-sys');
    if (!form || !name) return;
    var opt = [].slice.call(form.querySelectorAll('[data-v]')).filter(function (b) { return b.getAttribute('data-v') === name; })[0];
    if (opt && opt.getAttribute('aria-pressed') !== 'true') setTimeout(function () { opt.click(); }, 60);
  });
  $$('.fb-care').forEach(function (sec) {
    var tier = $('[data-fb-care]', sec), pick = $('.fb-pick', sec), raw = $('[data-fb-care-data]', sec);
    if (!tier || !pick || !raw) return;
    var data = {};
    try { data = JSON.parse(raw.textContent); } catch (e) { return; }
    var btns = $$('.fb-pick__b', pick);
    var set = function (k, focus) {
      var d = data[k]; if (!d) return;
      btns.forEach(function (b) { var on = b.getAttribute('data-k') === k; b.setAttribute('aria-checked', on ? 'true' : 'false'); b.tabIndex = on ? 0 : -1; if (on && focus) b.focus(); });
      tier.setAttribute('data-k', k);
      var swap = function () {
        $$('[data-fb-from]', tier).forEach(function (el) { el.textContent = ''; });
        $$('[data-fb-p]', tier).forEach(function (el) { el.textContent = d[el.getAttribute('data-fb-p')]; });
      };
      if (reduce) { swap(); return; }
      tier.classList.add('is-swap');
      setTimeout(function () { swap(); tier.classList.remove('is-swap'); }, 180);
    };
    btns.forEach(function (b, i) {
      b.addEventListener('click', function () { set(b.getAttribute('data-k'), false); });
      b.addEventListener('keydown', function (e) {
        var step = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : (e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0);
        if (!step) return;
        e.preventDefault();
        set(btns[mod(i + step, btns.length)].getAttribute('data-k'), true);
      });
    });
  });
})();
(function () {
  'use strict';
  if (!document.querySelector('.fb')) return;
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $$ = function (s, r) { return [].slice.call((r || document).querySelectorAll(s)); };
  var mod = function (a, n) { return ((a % n) + n) % n; };
  var now = function () { return window.performance && performance.now ? performance.now() : Date.now(); };
  var easeOut = function (t) { return 1 - Math.pow(1 - t, 3); };
  $$('[data-fb-picker]').forEach(function (pk) {
    var box = document.getElementById(pk.getAttribute('data-fb-picker'));
    var tiles = $$('[data-fb-pick]', pk);
    if (!box || !tiles.length) return;
    var panels = $$('[data-fb-panel]', box).filter(function (p) { return p.parentNode === box; });
    var grow = null;
    var set = function (k, focus, still) {
      var h0 = box.offsetHeight;
      tiles.forEach(function (t) {
        var on = t.getAttribute('data-fb-pick') === k;
        t.setAttribute('aria-pressed', on ? 'true' : 'false');
        if (on && focus) t.focus();
      });
      panels.forEach(function (p) { p.classList.toggle('is-on', p.getAttribute('data-fb-panel') === k); });
      box.setAttribute('data-fb-on', k);
      var h1 = box.offsetHeight;
      if (grow) { grow.cancel(); grow = null; }
      if (!still && !reduce && h0 && h0 !== h1 && box.animate) {
        grow = box.animate([{ height: h0 + 'px' }, { height: h1 + 'px' }], { duration: 420, easing: 'cubic-bezier(.22,1,.36,1)' });
        grow.onfinish = function () { grow = null; };
      }
      try { box.dispatchEvent(new CustomEvent('fb:pick', { detail: { key: k }, bubbles: true })); } catch (e) {}
    };
    var first = tiles.filter(function (t) { return t.getAttribute('aria-pressed') === 'true'; })[0] || tiles[0];
    set(first.getAttribute('data-fb-pick'), false, true);
    tiles.forEach(function (t, i) {
      t.addEventListener('click', function () {
        if (t.getAttribute('aria-pressed') !== 'true') set(t.getAttribute('data-fb-pick'), false);
      });
      t.addEventListener('keydown', function (e) {
        var k = e.key, j = null;
        if (k === 'ArrowRight' || k === 'ArrowDown') j = i + 1;
        else if (k === 'ArrowLeft' || k === 'ArrowUp') j = i - 1;
        else if (k === 'Home') j = 0;
        else if (k === 'End') j = tiles.length - 1;
        if (j === null) return;
        e.preventDefault();
        set(tiles[mod(j, tiles.length)].getAttribute('data-fb-pick'), true);
      });
    });
  });
  var movers = $$('.fb [data-fb-count], .fb [data-fb-fig]');
  if (reduce || !movers.length) return;
  var fig = function (v, dec) {
    if (v >= 10) return String(Math.round(v));
    if (v >= 1) return v.toFixed(1);
    var d = Math.min(dec, Math.max(1, 1 - Math.floor(Math.log(v) / Math.LN10)));
    return v.toFixed(d);
  };
  var start = function (el) {
    var done = el.textContent.trim(), t0 = now() + 120, tick;
    el.style.visibility = '';
    if (el.hasAttribute('data-fb-count')) {
      var to = parseFloat(el.getAttribute('data-fb-count')), from = parseFloat(el.getAttribute('data-fb-from') || '0');
      var pre = el.getAttribute('data-fb-prefix') || '', dur = parseFloat(el.getAttribute('data-fb-dur') || '1500');
      var show = function (v) { el.textContent = pre + Math.round(v).toLocaleString('en-AU'); };
      show(from);
      tick = function () {
        var p = Math.min(1, Math.max(0, (now() - t0) / dur));
        if (p >= 1) { el.textContent = done; return; }
        show(from + (to - from) * easeOut(p)); requestAnimationFrame(tick);
      };
    } else {
      var raw = el.getAttribute('data-fb-fig'), target = parseFloat(raw), dec = (raw.split('.')[1] || '').length;
      if (!dec && target >= 1) {
        el.textContent = '0';
        tick = function () {
          var p = Math.min(1, Math.max(0, (now() - t0) / 1200));
          if (p >= 1) { el.textContent = done; return; }
          el.textContent = String(Math.round(target * easeOut(p))); requestAnimationFrame(tick);
        };
      } else {
      var a = Math.log(70), b = Math.log(target), dur2 = 1900;
      el.textContent = '70';
      tick = function () {
        var p = Math.min(1, Math.max(0, (now() - t0) / dur2));
        if (p >= 1) { el.textContent = done; return; }
        el.textContent = fig(Math.exp(a + (b - a) * easeOut(p)), dec); requestAnimationFrame(tick);
      };
      }
    }
    requestAnimationFrame(tick);
  };
  movers.forEach(function (el) { el.style.visibility = 'hidden'; });
  var pending = movers.slice();
  var scan = function () {
    if (!pending.length) return;
    pending = pending.filter(function (el) {
      if (!el.isConnected) return false;
      if (el.getClientRects().length === 0) return true;
      var panel = el.closest('[data-fb-panel]');
      if (panel && getComputedStyle(panel).visibility === 'hidden') return true;
      var r = el.getBoundingClientRect(), line = innerHeight * (el.hasAttribute('data-fb-fig') ? 0.8 : 0.9);
      if (r.top < line || r.bottom < 0) { start(el); return false; }
      return true;
    });
  };
  var raf = 0;
  var queue = function () { if (!raf) raf = requestAnimationFrame(function () { raf = 0; scan(); }); };
  addEventListener('scroll', queue, { passive: true });
  addEventListener('resize', queue);
  queue(); setTimeout(queue, 600);
  document.addEventListener('fb:pick', function () { setTimeout(queue, 60); });
})();
(function () {
  'use strict';
  var boxes = [].slice.call(document.querySelectorAll('[data-fb-ask]'));
  if (!boxes.length) return;
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var EASE = 'cubic-bezier(.22,1,.36,1)';
  var CALL = '0430 546 749';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return [].slice.call((r || document).querySelectorAll(s)); };
  var low = function (s) { return String(s == null ? '' : s).trim().toLowerCase(); };
  var track = function (n, p) { try { if (window.ffyTrack) window.ffyTrack(n, p); } catch (e) {} };
  var phoneOk = function (v) { var d = String(v || '').replace(/\D/g, ''); return /^(?:0\d{9}|61\d{9})$/.test(d); };
  function fill(tpl, v) {
    var tok = /\{([\w-]+)(?:\|([^}]*))?\}/g;
    var one = function (s) {
      var empty = false;
      var out = s.replace(tok, function (m, k, d) { var x = v[k] || d || ''; if (!x) empty = true; return x; });
      return [out, empty];
    };
    var s = String(tpl || '').replace(/\[([^\[\]]*)\]/g, function (m, inner) { var r = one(inner); return r[1] ? '' : r[0]; });
    return one(s)[0].replace(/\s+/g, ' ').trim();
  }
  function goTo(el) {
    var hdr = document.getElementById('hdr');
    var y = Math.max(0, el.getBoundingClientRect().top + scrollY - (hdr ? hdr.offsetHeight : 72) - 16);
    if (typeof window.ffyGoTo === 'function') { window.ffyGoTo(el); return; }
    if (window.lenis && typeof window.lenis.scrollTo === 'function') { window.lenis.scrollTo(y, { duration: 1.1, force: true }); return; }
    scrollTo({ top: y, behavior: reduce ? 'auto' : 'smooth' });
  }
  function init(box, n) {
    var f = $('form', box);
    var steps = $$('[data-fb-step]', f), names = steps.map(function (s) { return s.getAttribute('data-fb-step'); });
    var bars = $$('.fb-ask__bar i', box), next = $('[data-fb-ask-next]', box), label = $('[data-fb-ask-label]', box);
    var back = $('[data-fb-ask-back]', box), err = $('.fb-ask__err', box), chosen = $('[data-fb-ask-chosen]', box), done = $('[data-fb-ask-done]', box);
    var final = box.getAttribute('data-final') || label.textContent, preview = box.hasAttribute('data-preview');
    var formName = box.getAttribute('data-form') || 'website', metaLabel = box.getAttribute('data-label') || formName;
    var suburb = $('input[name="suburb"]', f);
    var cur = 0, trail = [], sending = false, sent = false, started = false, native = false, custom = null, ready = false, anim = null;
    if (!box.id) box.id = 'fb-ask-' + n;
    f.noValidate = true;
    var fields = {};
    function hidden(name) {
      var i = $$('input[type="hidden"]', f).filter(function (x) { return x.name === name; })[0];
      if (!i) { i = document.createElement('input'); i.type = 'hidden'; i.name = name; f.appendChild(i); }
      return i;
    }
    $$('[data-fb-field]', f).forEach(function (i) {
      var name = i.getAttribute('data-fb-field');
      i.name = box.id + '-' + name;
      i.setAttribute('form', box.id + '-off');
      i.required = false;
      if (!fields[name]) fields[name] = hidden(name);
    });
    var group = function (name) { return $$('[data-fb-field="' + name + '"]', f); };
    var picked = function (name) { return group(name).filter(function (i) { return i.checked; })[0] || null; };
    var value = function (name) { var r = picked(name); return r ? r.value : ''; };
    var sysEl = function () { return picked('system'); };
    var system = function () { var r = sysEl(); return r ? r.value : (custom ? custom.value : ''); };
    function state() {
      var v = {}, r = sysEl();
      Object.keys(fields).forEach(function (k) { v[k] = value(k); });
      v.system = system();
      v.suburb = suburb ? suburb.value.trim() : '';
      v.when = v.installation_preference || '';
      var d = $('[name="details"]', f); v.details = d ? d.value.trim() : '';
      $$('input[type="hidden"]', f).forEach(function (h) { if (h.name && !(h.name in v) && !/^(message|_subject)$/.test(h.name)) v[h.name] = h.value; });
      var o = $$('[data-fb-price]', f).filter(function (i) { return i.checked; })[0];
      v.price = (o && r && r.getAttribute('data-' + o.getAttribute('data-fb-price'))) || '';
      return v;
    }
    function summary() {
      var r = sysEl(), name = '', price = '', img = '';
      if (r) { name = r.getAttribute('data-name') || r.value; img = r.getAttribute('data-img') || ''; price = r.getAttribute('data-price') || ''; }
      else if (custom) { name = custom.name; img = custom.img || ''; price = custom.price || ''; }
      var o = $$('[data-fb-price]', f).filter(function (i) { return i.checked; })[0];
      if (o) {
        var p = r && r.getAttribute('data-' + o.getAttribute('data-fb-price'));
        price = o.value + (p ? ', ' + p + ' a year' : '');
      }
      $$('[data-fb-price]', f).forEach(function (i) {
        var s = $('[data-fb-ask-osub]', i.parentNode), p = r && r.getAttribute('data-' + i.getAttribute('data-fb-price'));
        if (s) s.textContent = p ? p + ' a year' : s.getAttribute('data-sub');
      });
      $$('.fb-ask__t, .fb-ask__x, .fb-ask__o', f).forEach(function (t) { var i = $('.fb-ask__r', t); t.classList.toggle('is-on', !!(i && i.checked)); });
      var at = names.indexOf('system');
      var show = !!name && at >= 0 && cur !== at && !sent;
      var was = chosen.hidden;
      chosen.hidden = !show;
      if (!show) return;
      var ci = $('.fb-ask__ci', chosen), im = $('img', chosen);
      ci.hidden = !img;
      if (img && im.getAttribute('src') !== img) im.src = img;
      $('[data-fb-ask-name]', chosen).textContent = name;
      $('[data-fb-ask-price]', chosen).textContent = price;
      if (was && ready && !reduce) { chosen.classList.remove('is-enter'); void chosen.offsetWidth; chosen.classList.add('is-enter'); }
    }
    function emit() {
      var r = sysEl();
      try { box.dispatchEvent(new CustomEvent('fb:ask', { bubbles: true, detail: { key: r ? r.getAttribute('data-k') : '', system: system(), add_on: value('add_on') } })); } catch (e) {}
    }
    function show(i, how) {
      if (i < 0 || i >= steps.length) return;
      var moved = i !== cur && ready && !reduce && !!how && box.animate;
      var h0 = moved ? box.offsetHeight : 0;
      cur = i;
      steps.forEach(function (s, k) { s.hidden = k !== i; s.classList.remove('is-enter', 'is-back'); });
      bars.forEach(function (b, k) { b.classList.toggle('is-on', k <= i); });
      back.hidden = i === 0;
      label.textContent = i === steps.length - 1 ? final : 'Next';
      err.hidden = true;
      summary();
      if (moved) {
        var s = steps[i]; void s.offsetWidth; s.classList.add(how === 'back' ? 'is-back' : 'is-enter');
        var h1 = box.offsetHeight;
        if (anim) anim.cancel();
        if (h0 && h1 && h0 !== h1) {
          box.style.overflow = 'hidden';
          anim = box.animate([{ height: h0 + 'px' }, { height: h1 + 'px' }], { duration: 420, easing: EASE });
          anim.onfinish = anim.oncancel = function () { box.style.overflow = ''; anim = null; };
        }
      }
      try { box.dispatchEvent(new CustomEvent('fb:ask-step', { bubbles: true, detail: { step: names[i] } })); } catch (e) {}
      if (how && how !== 'jump') {
        var q = $('.fb-ask__q', steps[i]); if (q) q.focus({ preventScroll: true });
        var top = box.getBoundingClientRect().top;
        if (top < 0) goTo(box);
      }
    }
    function go(i, how) { if (i !== cur) trail.push(cur); show(i, how || 'next'); }
    function bad(el, msg) {
      err.textContent = msg; err.hidden = false;
      if (el) { el.setAttribute('aria-invalid', 'true'); try { el.focus({ preventScroll: true }); } catch (e) {} }
      return false;
    }
    function valid(i) {
      var s = steps[i], name = names[i];
      $$('[aria-invalid]', s).forEach(function (e) { e.removeAttribute('aria-invalid'); });
      if (name === 'where' && suburb && suburb.value.trim().length < 2) return bad(suburb, 'Please add your suburb or postcode.');
      if (name === 'system' && !system()) return bad(group('system')[0], 'Please choose a system, or Not sure yet.');
      if (s.hasAttribute('data-fb-required') && !value(name)) return bad(group(name)[0], s.getAttribute('data-fb-required'));
      if (name === 'contact') {
        var nm = $('[name="name"]', f), ph = $('[name="phone"]', f), em = $('[name="email"]', f);
        if (nm && nm.value.trim().length < 2) return bad(nm, 'Please add your name.');
        if (ph && !phoneOk(ph.value)) return bad(ph, 'Please check your mobile number.');
        if (em && !(em.value.trim() && em.checkValidity())) return bad(em, 'Please check your email address.');
      }
      return true;
    }
    function begin() { if (!started) { started = true; track('form_start', { form: formName }); } }
    f.addEventListener('input', function (e) {
      begin();
      var t = e.target;
      if (t.getAttribute && t.getAttribute('aria-invalid') === 'true') { t.removeAttribute('aria-invalid'); err.hidden = true; }
    });
    f.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && e.target.classList && e.target.classList.contains('fb-ask__r')) { e.preventDefault(); next.click(); }
    });
    f.addEventListener('change', function (e) {
      var t = e.target;
      if (!t.classList || !t.classList.contains('fb-ask__r')) return;
      begin();
      if (t.getAttribute('data-fb-field') === 'system') { custom = null; track('system_select', { system: t.value, form: formName }); }
      $$('[aria-invalid]', t.closest('[data-fb-step]') || f).forEach(function (x) { x.removeAttribute('aria-invalid'); });
      err.hidden = true;
      summary();
      if (t.getAttribute && /^(system|add_on)$/.test(t.getAttribute('data-fb-field') || '')) emit();
    });
    back.addEventListener('click', function () { if (!sending) show(trail.length ? trail.pop() : Math.max(0, cur - 1), 'back'); });
    $('[data-fb-ask-change]', box).addEventListener('click', function () {
      var at = names.indexOf('system'); if (at < 0 || sending) return;
      go(at, 'back');
      var r = sysEl() || group('system')[0]; if (r) try { r.focus({ preventScroll: true }); } catch (e) {}
    });
    function write() {
      var v = state();
      Object.keys(fields).forEach(function (k) { fields[k].value = v[k] || ''; });
      if (fields.system) fields.system.value = v.system || 'Not sure yet';
      hidden('message').value = fill(box.getAttribute('data-message'), v);
      hidden('_subject').value = fill(box.getAttribute('data-subject'), v);
      return v;
    }
    function fail() {
      err.textContent = 'That did not send. Please try again, or call ' + CALL + '.'; err.hidden = false;
      label.textContent = 'Try again';
    }
    function success(v) {
      var h0 = box.offsetHeight;
      sent = true; box.classList.add('is-sent'); chosen.hidden = true;
      done.setAttribute('role', 'status');
      if (!reduce && box.animate) {
        var h1 = box.offsetHeight;
        if (h0 !== h1) { box.style.overflow = 'hidden'; var a = box.animate([{ height: h0 + 'px' }, { height: h1 + 'px' }], { duration: 480, easing: EASE }); a.onfinish = a.oncancel = function () { box.style.overflow = ''; }; }
      }
      try { done.focus({ preventScroll: true }); } catch (e) {}
      if (window.ffyLeadSuccess) window.ffyLeadSuccess(f, { form: formName, label: metaLabel, system: v.system || 'not chosen' });
      try { box.dispatchEvent(new CustomEvent('fb:ask-sent', { bubbles: true, detail: v })); } catch (e) {}
    }
    function send() {
      var v = write();
      if (window.ffyStampForm) window.ffyStampForm(f);
      sending = true; next.disabled = true; back.disabled = true; label.textContent = 'Sending…'; err.hidden = true;
      var end = function () { sending = false; next.disabled = false; back.disabled = false; if (label.textContent === 'Sending…') label.textContent = final; };
      if (preview && !window.__LP_QA) {
        end(); sent = true; box.classList.add('is-sent');
        $('b', done).textContent = 'Preview only. Nothing was sent.'; $('p', done).textContent = hidden('message').value;
        done.setAttribute('role', 'status');
        return;
      }
      fetch(f.action, { method: 'POST', body: new FormData(f), headers: { Accept: 'application/json' } }).then(function (r) {
        end();
        if (r.ok) success(v); else fail();
      }, function () {
        end();
        if (!preview && typeof f.requestSubmit === 'function') { native = true; try { f.requestSubmit(); return; } catch (x) { native = false; } }
        fail();
      });
    }
    f.addEventListener('submit', function (e) {
      if (native) return;
      e.preventDefault();
      if (sending || sent) return;
      begin();
      if (!valid(cur)) return;
      if (cur < steps.length - 1) { go(cur + 1, 'next'); return; }
      for (var i = 0; i < steps.length; i++) {
        if (!valid(i)) { var m = err.textContent; show(i, 'jump'); valid(i); err.textContent = m; err.hidden = false; return; }
      }
      send();
    });
    function find(v, any) {
      var w = low(v); if (!w) return null;
      return $$(any ? '[data-fb-field]:not([data-fb-field="system"])' : '[data-fb-field="system"]', f).filter(function (i) {
        return [i.value, i.getAttribute('data-k')].concat((i.getAttribute('data-alias') || '').split('|')).some(function (a) { return low(a) === w; });
      })[0] || null;
    }
    function pick(v) {
      if (sent || v == null) return;
      v = String(v).trim(); if (!v) return;
      var cold = /^undersink chiller with (.+)$/i.exec(v);
      if (cold && group('add_on')[0] && find(cold[1])) { group('add_on')[0].checked = true; v = cold[1]; }
      var r = find(v), o = r ? null : find(v, true);
      if (o) { o.checked = true; summary(); return; }   // a page button that answers another question (the kind of project)
      if (r) { r.checked = true; custom = null; }
      else {
        group('system').forEach(function (i) { i.checked = false; });
        var parts = v.split('+').map(function (part) { return find(part); });
        if (parts.length > 1 && parts.every(Boolean)) {
          var nm = parts.map(function (p) { return p.getAttribute('data-name'); }).join(' and ');
          custom = { value: nm, name: nm, img: parts[0].getAttribute('data-img'), price: 'Two systems at one address' };
        } else custom = { value: v, name: v, img: '', price: '' };
      }
      summary(); emit();
    }
    function addon(on) {
      var c = group('add_on')[0]; if (!c || sent) return;
      c.checked = !!on; summary(); emit();
    }
    function resume() {
      if (sent) return;
      var i = 0;
      for (; i < steps.length - 1; i++) {
        var name = names[i];
        if (name === 'where' && (!suburb || suburb.value.trim().length < 2)) break;
        if (name === 'system' && !system()) break;
        var fld = name === 'when' ? 'installation_preference' : name;
        if (name !== 'where' && name !== 'system' && fields[fld] && !value(fld)) break;
        if (name === 'contact') break;
      }
      trail = [];
      show(i, i === cur ? '' : 'jump');
    }
    var want = box.getAttribute('data-start');
    try { want = new URLSearchParams(location.search).get('system') || want; } catch (e) {}
    if (want) pick(want);
    show(0, '');
    summary();
    ready = true;
    box.ffyAsk = { pick: pick, addon: addon, resume: resume, state: state, box: box, form: f };
    return box.ffyAsk;
  }
  var apis = boxes.map(init);
  window.ffyAsk = { forms: apis };
  var SEL = '[data-fb-ask-sys], .js-open, [data-fb-sys], [data-rc-sys], [data-ask], [data-lp-help], [data-fs-cta]';
  var mainForm = function () { return apis.filter(function (a) { return !a.box.closest('[role="dialog"], dialog, [aria-modal="true"]'); })[0] || null; };
  document.addEventListener('click', function (e) {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var t = e.target && e.target.closest && e.target.closest(SEL);
    if (!t || t.closest('[data-fb-ask]')) return;
    if (t.classList.contains('js-open') && apis.some(function (a) { return a.box.closest('[role="dialog"], dialog, [aria-modal="true"]'); })) return;
    var href = t.getAttribute('href') || '', to = null;
    if (href.charAt(0) === '#' && href.length > 1) {
      var el = document.getElementById(href.slice(1));
      var box = el && (el.matches('[data-fb-ask]') ? el : el.querySelector('[data-fb-ask]'));
      if (box && box.ffyAsk) to = box.ffyAsk;
    }
    if (!to) {
      if (href && href.charAt(0) !== '#' && !t.classList.contains('js-open') && href.indexOf('#ask') < 0 && href.indexOf('#quote') < 0) return;
      to = mainForm();
    }
    if (!to) return;
    e.preventDefault(); e.stopPropagation();
    var v = t.getAttribute('data-fb-ask-sys') || t.getAttribute('data-sys') || t.getAttribute('data-fb-sys') || t.getAttribute('data-rc-sys') || t.getAttribute('data-ask') || '';
    if (t.hasAttribute('data-lp-help')) v = 'Not sure yet';
    if (v) to.pick(v);
    if (t.getAttribute('data-rc-addon') || t.getAttribute('data-fb-ask-addon')) to.addon(true);
    to.resume();
    var menu = document.body.classList.contains('mopen') && t.closest('#msheet');
    if (menu) { var b = document.getElementById('burger'); if (b) b.click(); setTimeout(function () { goTo(to.box); }, 90); }
    else goTo(to.box);
  }, true);
})();
