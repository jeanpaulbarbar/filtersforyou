// Drives a real Chrome through the attribution scenarios the 12 Sep 2026 audit named.
// NOTHING leaves this machine: every Formspree, GA4, Meta and Google conversion request
// is intercepted and answered locally, so no lead, message or conversion is ever created.
import puppeteer from 'puppeteer';

const BASE = process.env.BASE || 'http://localhost:3000';
const BLOCK = [
  'formspree.io', 'googletagmanager.com', 'google-analytics.com', 'analytics.google.com',
  'facebook.net', 'facebook.com/tr', 'doubleclick.net', 'googleadservices.com',
  'google.com/pagead', 'google.com/ccm', 'googlesyndication.com'
];

// Formspree answers a cross-origin fetch with CORS headers. A stub that omits them
// makes the fetch fail, the page falls back to a native POST, and the test then measures
// the failure path while believing it measured the success path.
const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': '*'
};
const OK = { status: 200, contentType: 'application/json', headers: CORS, body: '{"ok":true}' };
const DOWN = { status: 500, contentType: 'application/json', headers: CORS, body: '{"ok":false}' };

let failures = 0;
const results = [];
function check(label, got, want) {
  const ok = JSON.stringify(got) === JSON.stringify(want);
  if (!ok) failures++;
  results.push(`  ${ok ? 'PASS' : 'FAIL'}  ${label}: ${JSON.stringify(got)}` +
    (ok ? '' : `  (wanted ${JSON.stringify(want)})`));
}

// A stub gtag/fbq installed before any page script runs, so a real event is recorded
// here instead of being sent anywhere.
const SHIM = () => {
  window.__ffyEvents = [];
  window.__ffyMeta = [];
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () {
    if (arguments[0] === 'event') window.__ffyEvents.push([arguments[1], arguments[2] || {}]);
  };
  window.fbq = function () {
    if (arguments[0] === 'track') window.__ffyMeta.push([arguments[1], arguments[2] || {}]);
  };
  window.fbq.queue = [];
};

// document.referrer is read-only and puppeteer's goto referer option only sets the
// header, so the arriving referrer is stubbed on the document itself. That is exactly
// the value the module reads, so the code under test is unchanged.
const READY = { waitUntil: 'domcontentloaded' };
async function goto(page, url, opts) {
  await page.goto(url, { ...READY, ...(opts || {}) });
  await page.evaluate(() => 0).catch(() => {});
  await new Promise(r => setTimeout(r, 350));
}

// Each scenario gets its own browser context. Browser storage is the whole subject
// here, so one shared profile would let scenario one's first visit become scenario
// two's, and every later result would be a lie.
async function newPage(browser, sent) {
  const ctx = await browser.createBrowserContext();
  const page = await ctx.newPage();
  page.__ctx = ctx;
  page.__ref = null;
  await page.setRequestInterception(true);
  page.on('request', req => {
    const url = req.url();
    if (BLOCK.some(b => url.includes(b))) {
      if (url.includes('formspree.io')) {
        if (req.method() === 'OPTIONS') return req.respond(OK);
        let fields = {};
        const data = req.postData() || '';
        // multipart FormData from fetch; read the field names and values back out
        for (const m of data.matchAll(/name="([^"]+)"\r?\n\r?\n([\s\S]*?)\r?\n--/g)) {
          fields[m[1]] = m[2];
        }
        if (!Object.keys(fields).length && data.includes('=')) {
          for (const [k, v] of new URLSearchParams(data)) fields[k] = v;
        }
        sent.push(fields);
      }
      return req.respond(OK);
    }
    req.continue();
  });
  await page.evaluateOnNewDocument(SHIM);
  return page;
}

async function arriveFrom(page, referrer) {
  if (page.__ref) {
    await (page.__ref.remove ? page.__ref.remove()
      : page.removeScriptToEvaluateOnNewDocument(page.__ref.identifier));
  }
  page.__ref = await page.evaluateOnNewDocument(r => {
    Object.defineProperty(document, 'referrer', { get: () => r, configurable: true });
  }, referrer);
}

// The pages define their own gtag and fbq in the head, AFTER the stub, so the stub is
// only a fallback. The real events land in dataLayer and fbq.queue, which is where a
// GA4 or Meta request would be built from — so that is where they are read.
const events = p => p.evaluate(() => {
  const out = (window.__ffyEvents || []).slice();
  for (const row of window.dataLayer || []) {
    const a = Array.from(row || []);
    if (a[0] === 'event') out.push([a[1], a[2] || {}]);
  }
  return out;
});
const meta = p => p.evaluate(() => {
  const out = (window.__ffyMeta || []).slice();
  const q = (window.fbq && (window.fbq.queue || [])) || [];
  for (const row of q) {
    const a = Array.from(row || []);
    if (a[0] === 'track') out.push([a[1], a[2] || {}]);
  }
  return out;
});
const fields = p => p.evaluate(() => {
  const f = document.querySelector('form[action*="formspree"]');
  const out = {};
  if (f) for (const el of f.querySelectorAll('input[type=hidden]')) out[el.name] = el.value;
  return out;
});

// The homepage drawer form, three steps.
async function fillHomepage(page, who = {}) {
  const d = { suburb: 'Earlwood', name: 'ZZ TEST', phone: '0400000000',
              email: 'zz@example.com', ...who };
  // ONE form. The page carries an inline enquiry form and a second one in the drawer;
  // driving "every [data-next] on the page" submits both and the count stops meaning
  // anything.
  await page.evaluate(v => {
    const root = document.querySelector('[data-qform]');
    root.setAttribute('data-test-root', '1');
    root.querySelector('input[name="suburb"]').value = v.suburb;
    root.querySelector('[data-next]').click();
  }, d);
  await new Promise(r => setTimeout(r, 400));
  await page.evaluate(() => {
    document.querySelector('[data-test-root] .sysopt').click();
  });
  await new Promise(r => setTimeout(r, 500));
  await page.evaluate(v => {
    const root = document.querySelector('[data-test-root]');
    root.querySelector('input[name="name"]').value = v.name;
    const tel = root.querySelector('input[type="tel"]');
    tel.value = v.phone; tel.dispatchEvent(new Event('input', { bubbles: true }));
    const mail = root.querySelector('input[type="email"]');
    mail.value = v.email; mail.dispatchEvent(new Event('input', { bubbles: true }));
    root.querySelector('[data-next]').click();
  }, d);
  await new Promise(r => setTimeout(r, 1200));
}

const ONLY = process.env.ONLY ? process.env.ONLY.split(',') : null;
const run = n => !ONLY || ONLY.includes(String(n));
const step = (n, what) => { if (run(n)) console.error(`  … ${n} ${what}`); };

const browser = await puppeteer.launch({
  headless: 'new',
  protocolTimeout: 30000,
  args: ['--no-sandbox', '--disable-features=Prerender2,PrerenderFallbackToPreconnect']
});

try {
  if (run(1))
  // ── 1 · fresh search, then internal navigation, then submit ───────────────
  {
    const sent = [];
    const page = await newPage(browser, sent);
    await arriveFrom(page, 'https://www.google.com/');
    await goto(page, `${BASE}/index.html`, { waitUntil: 'networkidle2' });
    await arriveFrom(page, '');
    await goto(page, `${BASE}/reverse-osmosis-water-filter-sydney.html`, { waitUntil: 'networkidle2' });
    const f = await fields(page);
    results.push('1 · Google search, then internal navigation to another page');
    check('landing_page is the first page', f.landing_page, '/index.html');
    check('submitted_page is where they are now', f.submitted_page, '/reverse-osmosis-water-filter-sydney.html');
    check('referrer is the external one', f.referrer, 'https://www.google.com/');
    check('first_referrer_state', f.first_referrer_state, 'external');
    check('internal navigation did not restart the visit', f.visit_page, '/index.html');
    check('so this visit is still the first one', f.visit_referrer, 'https://www.google.com/');
    check('and shares its timestamp', f.visit_seen_at === f.first_seen_at, true);
    check('capture health recorded', f.attr_state, 'v1 store=local');
    await page.close(); await page.__ctx.close();
  }

  if (run(2))
  // ── 2 · social first, search on a later visit ─────────────────────────────
  {
    const sent = [];
    const page = await newPage(browser, sent);
    await arriveFrom(page, 'https://www.instagram.com/');
    await goto(page, `${BASE}/index.html?utm_source=ig&utm_medium=social&utm_campaign=spring`,
      { waitUntil: 'networkidle2' });
    // a NEW visit: same storage, new tab session
    await page.evaluate(() => sessionStorage.clear());
    await arriveFrom(page, 'https://www.google.com/');
    await goto(page, `${BASE}/contact.html`, { waitUntil: 'networkidle2' });
    const f = await fields(page);
    results.push('\n2 · Instagram first, Google on the visit they submitted in');
    check('first visit page kept', f.landing_page, '/index.html');
    check('first visit referrer kept', f.referrer, 'https://www.instagram.com/');
    check('this visit page', f.visit_page, '/contact.html');
    check('this visit referrer', f.visit_referrer, 'https://www.google.com/');
    check('the tags are timestamped', !!f.utm_at, true);
    check('the first visit is timestamped', !!f.first_seen_at, true);
    check('this visit is timestamped', !!f.visit_seen_at, true);
    check('the two timestamps differ', f.first_seen_at !== f.visit_seen_at, true);
    await page.close(); await page.__ctx.close();
  }

  if (run(3))
  // ── 3 · a paid click, then a later social visit ───────────────────────────
  {
    const sent = [];
    const page = await newPage(browser, sent);
    await goto(page, `${BASE}/index.html?gclid=TESTCLICK123`, { waitUntil: 'networkidle2' });
    await page.evaluate(() => sessionStorage.clear());
    await goto(page, `${BASE}/index.html?utm_source=ig&utm_medium=social`, { waitUntil: 'networkidle2' });
    const f = await fields(page);
    results.push('\n3 · Google Ads click, then an Instagram link a day later');
    check('the paid click survived the social visit', f.gclid, 'TESTCLICK123');
    check('and is labelled', f.click_source, 'gclid');
    check('and is timestamped', !!f.click_at, true);
    check('the social tag is stored too', f.utm_source, 'ig');
    check('with its own timestamp', !!f.utm_at, true);
    await page.close(); await page.__ctx.close();
  }

  if (run(4))
  // ── 4 · direct, no referrer at all ────────────────────────────────────────
  {
    const sent = [];
    const page = await newPage(browser, sent);
    await goto(page, `${BASE}/index.html`, { waitUntil: 'networkidle2' });
    const f = await fields(page);
    results.push('\n4 · Direct arrival, nothing to go on');
    check('empty referrer is not sent as a field', f.referrer, undefined);
    check('but the state says it was captured and empty', f.first_referrer_state, 'empty');
    check('landing page still recorded', f.landing_page, '/index.html');
    await page.close(); await page.__ctx.close();
  }

  if (run(5))
  // ── 5 · the homepage form actually submits, once ──────────────────────────
  {
    const sent = [];
    const page = await newPage(browser, sent);
    await arriveFrom(page, 'https://www.google.com/');
    await goto(page, `${BASE}/index.html?gclid=ABC999`, { waitUntil: 'networkidle2' });
    await fillHomepage(page);
    const ev = await events(page), mt = await meta(page);
    results.push('\n5 · Homepage enquiry, accepted');
    check('one submission reached Formspree', sent.length, 1);
    check('it carried the landing page', sent[0]?.landing_page, '/index.html');
    check('it carried the referrer', sent[0]?.referrer, 'https://www.google.com/');
    check('it carried the click id', sent[0]?.gclid, 'ABC999');
    check('it carried the capture health', sent[0]?.attr_state, 'v1 store=local');
    check('exactly one form_submit', ev.filter(e => e[0] === 'form_submit').length, 1);
    check('exactly one Meta Lead', mt.filter(e => e[0] === 'Lead').length, 1);
    check('the event names the page', ev.find(e => e[0] === 'form_submit')?.[1]?.landing_page, '/index.html');
    await page.close(); await page.__ctx.close();
  }

  if (run(6))
  // ── 6 · the contact page: success must produce the conversion ─────────────
  {
    const sent = [];
    const page = await newPage(browser, sent);
    await goto(page, `${BASE}/contact.html`, { waitUntil: 'networkidle2' });
    await page.type('#contactForm input[name="full-name"]', 'ZZ TEST');
    await page.type('#contactForm input[name="phone"]', '0400000000');
    await page.type('#contactForm input[name="email"]', 'zz@example.com');
    await page.evaluate(() => document.querySelector('#contactForm .form-submit').click());
    await new Promise(r => setTimeout(r, 900));
    const ev = await events(page), mt = await meta(page);
    const shown = await page.evaluate(() =>
      getComputedStyle(document.querySelector('#formSuccess')).display);
    results.push('\n6 · Contact page enquiry, accepted');
    check('the success message is shown', shown, 'flex');
    check('one submission reached Formspree', sent.length, 1);
    check('it carried the landing page', sent[0]?.landing_page, '/contact.html');
    check('a form_submit fired', ev.filter(e => e[0] === 'form_submit').length, 1);
    check('a Meta Lead fired', mt.filter(e => e[0] === 'Lead').length, 1);
    await page.close(); await page.__ctx.close();
  }

  if (run(7))
  // ── 7 · a failed send, then a retry that works ────────────────────────────
  {
    const sent = [];
    const ctx = await browser.createBrowserContext();
    const page = await ctx.newPage();
    page.__ctx = ctx;
    page.__ref = null;
    let failNext = true;
    await page.setRequestInterception(true);
    page.on('request', req => {
      const url = req.url();
      if (BLOCK.some(b => url.includes(b))) {
        if (url.includes('formspree.io')) {
          if (req.method() === 'OPTIONS') return req.respond(OK);
          if (failNext) { failNext = false; return req.respond(DOWN); }
          sent.push(1);
        }
        return req.respond(OK);
      }
      req.continue();
    });
    await page.evaluateOnNewDocument(SHIM);
    await goto(page, `${BASE}/contact.html`, { waitUntil: 'networkidle2' });
    page.on('dialog', d => d.dismiss());
    await page.type('#contactForm input[name="full-name"]', 'ZZ TEST');
    await page.type('#contactForm input[name="phone"]', '0400000000');
    await page.type('#contactForm input[name="email"]', 'zz@example.com');
    await page.evaluate(() => document.querySelector('#contactForm .form-submit').click());
    await new Promise(r => setTimeout(r, 700));
    const afterFail = (await events(page)).filter(e => e[0] === 'form_submit').length;
    await page.evaluate(() => document.querySelector('#contactForm .form-submit').click());
    await new Promise(r => setTimeout(r, 900));
    const afterRetry = (await events(page)).filter(e => e[0] === 'form_submit').length;
    results.push('\n7 · A failed send, then a retry that is accepted');
    check('a rejected send fires no conversion', afterFail, 0);
    check('the retry fires exactly one', afterRetry, 1);
    check('and only one submission was accepted', sent.length, 1);
    await page.close(); await page.__ctx.close();
  }

  if (run(8))
  // ── 8 · the comparison page, which had no capture at all before today ─────
  {
    const sent = [];
    const page = await newPage(browser, sent);
    await arriveFrom(page, 'https://chatgpt.com/');
    await goto(page, `${BASE}/reverse-osmosis-vs-whole-house-water-filter-sydney.html`,
      { waitUntil: 'networkidle2' });
    const f = await fields(page);
    results.push('\n8 · The RO versus whole house page');
    check('it captures a landing page now', f.landing_page,
      '/reverse-osmosis-vs-whole-house-water-filter-sydney.html');
    check('it captures the referrer now', f.referrer, 'https://chatgpt.com/');
    check('and it loads the shared module', await page.evaluate(() => typeof window.ffyStampForm), 'function');
    check('the page does not redefine the stamper', await page.evaluate(
      () => window.ffyStampForm === window.ffyStampClick), true);
    await page.close(); await page.__ctx.close();
  }

  if (run(9))
  // ── 9 · storage switched off entirely ─────────────────────────────────────
  {
    const sent = [];
    const page = await newPage(browser, sent);
    await page.evaluateOnNewDocument(() => {
      const boom = { getItem() { throw new Error('off'); }, setItem() { throw new Error('off'); },
                     removeItem() { throw new Error('off'); } };
      Object.defineProperty(window, 'localStorage', { get: () => boom });
      Object.defineProperty(window, 'sessionStorage', { get: () => boom });
    });
    await arriveFrom(page, 'https://www.bing.com/');
    await goto(page, `${BASE}/index.html`, { waitUntil: 'networkidle2' });
    const f = await fields(page);
    results.push('\n9 · Browser storage unavailable');
    check('the page still submits its pages', f.submitted_page, '/index.html');
    check('the referrer is still captured', f.referrer, 'https://www.bing.com/');
    check('and the record says so', f.attr_state, 'v1 store=memory');
    await page.close(); await page.__ctx.close();
  }

  if (run(10))
  // ── 10 · a legacy suburb page, which posts natively ───────────────────────
  {
    const sent = [];
    const page = await newPage(browser, sent);
    await arriveFrom(page, 'https://www.google.com/');
    await goto(page, `${BASE}/water-filter-installation-bayview.html`, { waitUntil: 'networkidle2' });
    const f = await fields(page);
    results.push('\n10 · A suburb page (native POST, 537 of them)');
    check('landing page', f.landing_page, '/water-filter-installation-bayview.html');
    check('referrer', f.referrer, 'https://www.google.com/');
    check('the subject directive is untouched', f._subject, 'Water Filter Quote Request, Bayview');
    await page.evaluate(() => {
      const f = document.querySelector('form[action*="formspree"]');
      f.querySelector('input[name=name]').value = 'ZZ TEST';
      f.querySelector('input[name=phone]').value = '0400000000';
      f.querySelector('input[name=consent]').checked = true;
      // The real thing navigates away on submit, which would take the page with it.
      // Cancelling AFTER the module's listener has run measures the same decision.
      document.addEventListener('submit', e => e.preventDefault(), false);
      f.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
      f.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    });
    await new Promise(r => setTimeout(r, 300));
    const ev = (await events(page)).filter(e => e[0] === 'form_submit');
    check('a native submit fires one conversion', ev.length, 1);
    check('and says how it was delivered', ev[0]?.[1]?.delivery, 'navigate');
    check('a second submit of the same form does not double it', ev.length, 1);
    await page.close(); await page.__ctx.close();
  }
} finally {
  await browser.close();
}

console.log(results.join('\n'));
console.log('\n' + (failures ? `${failures} CHECK(S) FAILED` : 'ALL CHECKS PASSED'));
process.exit(failures ? 1 : 0);
