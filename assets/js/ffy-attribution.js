(function () {
  if (window.ffyAttrFields) return;

  var P = 'ffy1_';
  var K_FIRST = P + 'first', K_LAST = P + 'last', K_TAG = P + 'tag';
  var K_CLICK = P + 'click', K_VISIT = P + 'visit';
  var LEGACY_CLICK = 'ffy_click';
  var DAY = 864e5, CLICK_DAYS = 90;
  var CLICK_KEYS = ['gclid', 'gbraid', 'wbraid'];
  var UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign'];
  var MAX_PATH = 300, MAX_REF = 300, MAX_CLICK = 512;
  var hadTrack = typeof window.ffyTrack === 'function';

  function probe(kind) {
    try {
      var s = window[kind], t = P + 'probe';
      s.setItem(t, '1'); s.removeItem(t);
      return s;
    } catch (e) { return null; }
  }

  var mem = {};
  var local = probe('localStorage');
  var session = probe('sessionStorage');
  var box = local || session || null;
  var mode = local ? 'local' : (session ? 'session' : 'memory');

  function get(k) {
    if (!box) return Object.prototype.hasOwnProperty.call(mem, k) ? mem[k] : null;
    try { return box.getItem(k); } catch (e) { return null; }
  }
  function put(k, v) {
    if (!box) { mem[k] = v; return; }
    try { box.setItem(k, v); } catch (e) { mem[k] = v; }
  }
  function readRec(k) {
    var raw = get(k);
    if (!raw) return null;
    try {
      var o = JSON.parse(raw);
      return (o && typeof o === 'object' && !(o instanceof Array)) ? o : null;
    } catch (e) { return null; }
  }
  function writeRec(k, o) {
    try { put(k, JSON.stringify(o)); } catch (e) {}
  }
  function within(rec, days) {
    if (!rec || typeof rec.t !== 'number') return null;
    return (Date.now() - rec.t > days * DAY) ? null : rec;
  }
  function iso(ms) {
    try { return new Date(ms).toISOString().replace(/\.\d{3}Z$/, 'Z'); }
    catch (e) { return ''; }
  }
  function pagePath() {
    var p = '/';
    try { p = location.pathname || '/'; } catch (e) {}
    return p.slice(0, MAX_PATH);
  }
  function query() {
    var out = {}, q = '';
    try { q = (location.search || '').replace(/^\?/, ''); } catch (e) { return out; }
    if (!q) return out;
    q.split('&').forEach(function (pair) {
      if (!pair) return;
      var i = pair.indexOf('=');
      var k = i < 0 ? pair : pair.slice(0, i);
      var v = i < 0 ? '' : pair.slice(i + 1);
      try { out[decodeURIComponent(k)] = decodeURIComponent(v.replace(/\+/g, ' ')); }
      catch (e) {}
    });
    return out;
  }
  function referrer() {
    var r = '';
    try { r = document.referrer || ''; } catch (e) { return { url: '', state: 'unavailable' }; }
    if (!r) return { url: '', state: 'empty' };
    var host = '';
    try { host = new URL(r).host; } catch (e) { host = ''; }
    if (!host) return { url: '', state: 'unreadable' };
    if (host === location.host) return { url: '', state: 'internal' };
    return { url: r.slice(0, MAX_REF), state: 'external' };
  }

  if (!get(K_CLICK) && !get(K_TAG)) {
    var old = readRec(LEGACY_CLICK);
    if (old && typeof old.t === 'number') {
      if (old.id) {
        writeRec(K_CLICK, {
          id: String(old.id).slice(0, MAX_CLICK),
          param: String(old.src || 'gclid').slice(0, 16),
          t: old.t, page: ''
        });
      }
      if (old.utm && typeof old.utm === 'object') {
        var carried = {}, any = false;
        UTM_KEYS.forEach(function (k) {
          if (old.utm[k]) { carried[k] = String(old.utm[k]).slice(0, MAX_PATH); any = true; }
        });
        if (any) writeRec(K_TAG, { utm: carried, t: old.t, page: '' });
      }
    }
  }

  var q = query();
  var utm = {}, taggedNow = false;
  UTM_KEYS.forEach(function (k) {
    if (q[k]) { utm[k] = String(q[k]).slice(0, MAX_PATH); taggedNow = true; }
  });
  var clickNow = null;
  for (var i = 0; i < CLICK_KEYS.length; i++) {
    if (q[CLICK_KEYS[i]]) {
      clickNow = { id: String(q[CLICK_KEYS[i]]).slice(0, MAX_CLICK), param: CLICK_KEYS[i] };
      break;
    }
  }

  var ref = referrer();
  var now = Date.now();
  var here = pagePath();
  var visit = { t: now, page: here, ref: ref.url, rs: ref.state, utm: utm };

  var newVisit;
  if (session) {
    newVisit = !session.getItem(K_VISIT);
    if (newVisit) { try { session.setItem(K_VISIT, String(now)); } catch (e) {} }
  } else {
    newVisit = ref.state === 'external' || taggedNow || !!clickNow;
  }

  if (!readRec(K_FIRST)) writeRec(K_FIRST, visit);
  if (newVisit || !readRec(K_LAST)) writeRec(K_LAST, visit);
  if (taggedNow) writeRec(K_TAG, { utm: utm, t: now, page: here });
  if (clickNow) writeRec(K_CLICK, { id: clickNow.id, param: clickNow.param, t: now, page: here });

  function fields() {
    var first = readRec(K_FIRST) || visit;
    var last = readRec(K_LAST) || visit;
    var tag = within(readRec(K_TAG), CLICK_DAYS);
    var clk = within(readRec(K_CLICK), CLICK_DAYS);
    var tu = (tag && tag.utm) || {};
    return {
      landing_page: first.page || here,
      submitted_page: pagePath(),
      referrer: first.ref || '',
      first_seen_at: iso(first.t),
      first_referrer_state: first.rs || 'unknown',
      visit_page: last.page || here,
      visit_referrer: last.ref || '',
      visit_referrer_state: last.rs || 'unknown',
      visit_seen_at: iso(last.t),
      utm_source: tu.utm_source || '',
      utm_medium: tu.utm_medium || '',
      utm_campaign: tu.utm_campaign || '',
      utm_at: tag ? iso(tag.t) : '',
      gclid: clk ? clk.id : '',
      click_source: clk ? clk.param : '',
      click_at: clk ? iso(clk.t) : '',
      attr_state: 'v1 store=' + mode
    };
  }

  var MANAGED = Object.keys(fields());

  function isLeadForm(f) {
    if (!f || f.tagName !== 'FORM') return false;
    if (f.getAttribute('data-ffy-skip') !== null) return false;
    var a = f.getAttribute('action') || '';
    return a.indexOf('formspree') !== -1 || f.id === 'bookingForm';
  }

  function stamp(form) {
    if (!isLeadForm(form)) return;
    var v = fields();
    MANAGED.forEach(function (name) {
      var el = form.querySelector('input[name="' + name + '"]');
      var val = v[name];
      if (!val) {
        if (el && el.type === 'hidden' && el.getAttribute('data-ffy') !== null && el.parentNode) {
          el.parentNode.removeChild(el);
        }
        return;
      }
      if (!el) {
        el = document.createElement('input');
        el.type = 'hidden';
        el.name = name;
        el.setAttribute('data-ffy', '1');
        form.appendChild(el);
      }
      el.value = val;
    });
  }

  function stampAll() {
    var forms = document.querySelectorAll('form');
    for (var n = 0; n < forms.length; n++) stamp(forms[n]);
  }

  var done = [];
  function success(form, meta) {
    if (!form || done.indexOf(form) !== -1) return;
    done.push(form);
    var m = meta || {};
    var v = fields();
    var p = {
      page_path: v.submitted_page,
      landing_page: v.landing_page,
      form: String(m.form || form.id || 'website_form').slice(0, 60),
      delivery: m.delivery || 'ajax'
    };
    if (m.system) p.system = String(m.system).slice(0, 60);
    try { if (typeof gtag === 'function') gtag('event', 'form_submit', p); } catch (e) {}
    try {
      if (typeof fbq === 'function') {
        fbq('track', 'Lead', {
          content_name: String(m.label || p.form).slice(0, 60),
          content_category: 'website_form',
          source_page: p.page_path
        }, { eventID: 'web-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8) });
      }
    } catch (e) {}
  }

  document.addEventListener('submit', function (e) {
    if (isLeadForm(e.target)) stamp(e.target);
  }, true);

  document.addEventListener('submit', function (e) {
    var f = e.target;
    if (!isLeadForm(f)) return;
    if (e.defaultPrevented) return;
    success(f, { delivery: 'navigate' });
  }, false);

  if (!hadTrack) {
    window.ffyTrack = function (name, params) {
      try {
        if (typeof gtag !== 'function') return;
        var p = params || {};
        p.page_path = pagePath();
        gtag('event', name, p);
      } catch (e) {}
    };
    document.addEventListener('click', function (e) {
      var t = e.target;
      while (t && t !== document) {
        if (t.tagName === 'A' && (t.getAttribute('href') || '').indexOf('tel:') === 0) {
          window.ffyTrack('phone_click', {});
          return;
        }
        t = t.parentNode;
      }
    }, true);
  }

  window.ffyAttrFields = fields;
  window.ffyStampForm = stamp;
  window.ffyStampClick = stamp;
  window.ffyLeadSuccess = success;
  window.ffyClickFields = function () {
    var v = fields(), out = {};
    ['gclid', 'click_source', 'utm_source', 'utm_medium', 'utm_campaign'].forEach(function (k) {
      if (v[k]) out[k] = v[k];
    });
    return out;
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', stampAll);
  } else {
    stampAll();
  }
})();
