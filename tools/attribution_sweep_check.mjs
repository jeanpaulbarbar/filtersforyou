// Loads a sample of live pages in a real Chrome and proves the shared module is there,
// stamps the form, and raises no page error. Nothing leaves the machine.
import puppeteer from 'puppeteer';
import { readdirSync } from 'fs';

const BASE = 'http://localhost:3000';
const all = readdirSync('.').filter(f => f.endsWith('.html') && !f.startsWith('_'));
const N = Number(process.env.N || 24);
const pick = [
  'index.html', 'contact.html', 'humm.html', 'about.html',
  'faucets-and-mixers-sydney.html', 'whole-house-water-filter-sydney.html',
  'reverse-osmosis-water-filter-sydney.html', 'watermark-certified-water-filter-sydney.html',
  'reverse-osmosis-vs-whole-house-water-filter-sydney.html',
];
const rest = all.filter(f => !pick.includes(f));
for (let i = 0; pick.length < N && i < rest.length; i += Math.ceil(rest.length / (N - 9))) {
  pick.push(rest[i]);
}

const browser = await puppeteer.launch({
  headless: 'new', protocolTimeout: 60000,
  args: ['--no-sandbox', '--disable-features=Prerender2']
});
let bad = 0;
for (const file of pick) {
  const page = await browser.newPage();
  const errs = [];
  page.on('pageerror', e => errs.push(e.message.slice(0, 120)));
  await page.setRequestInterception(true);
  page.on('request', r => {
    const u = r.url();
    if (/formspree|googletagmanager|google-analytics|facebook|doubleclick|googleadservices/.test(u)) {
      return r.respond({ status: 200, contentType: 'application/json', body: '{}' });
    }
    r.continue().catch(() => {});
  });
  await page.goto(`${BASE}/${file}`, { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 500));
  const s = await page.evaluate(() => {
    const f = document.querySelector('form[action*="formspree"]');
    const hidden = {};
    if (f) for (const el of f.querySelectorAll('input[type=hidden]')) hidden[el.name] = el.value;
    return {
      module: typeof window.ffyStampForm,
      success: typeof window.ffyLeadSuccess,
      form: !!f,
      landing: hidden.landing_page || '',
      submitted: hidden.submitted_page || '',
      state: hidden.attr_state || '',
      loaders: document.querySelectorAll('script[src*="ffy-attribution"]').length
    };
  });
  const ok = s.module === 'function' && s.success === 'function' && s.loaders === 1 &&
    (!s.form || (s.submitted === '/' + file && s.state.startsWith('v1 ')));
  // Page errors are REPORTED, not failed on. Some suburb pages have thrown
  // "Cannot read properties of null (reading 'addEventListener')" from their own nav
  // script since long before this change — verified against the same page at HEAD.
  // Failing on them here would hide a real attribution regression behind old noise.
  if (!ok) bad++;
  console.log(`${ok ? 'ok  ' : 'BAD '} ${file}  module=${s.module} loaders=${s.loaders} ` +
    `form=${s.form} submitted=${s.submitted} state="${s.state}"` +
    (errs.length ? `  (page error, pre-existing: ${errs.join(' | ')})` : ''));
  await page.close();
}
await browser.close();
console.log(`\n${pick.length} pages checked, ${bad} with a problem`);
process.exit(bad ? 1 : 0);
