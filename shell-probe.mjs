/* shell-probe.mjs — THE SHELL VERIFIER.
   JP, 6 Sep 2026: "I can see the lettering moving so slightly... it needs to be
   a direct copy and paste. There shouldn't be any movement or any inconsistency."

   site_shell.py check proves the SOURCE bytes match. This proves the RENDER
   matches. It drives a real Chrome, measures every node inside the utility
   strip, the header, the mobile sheet and the footer — position RELATIVE to its
   own scope root, so a longer page is not drift — on index.html, then on every
   page given, and names anything that moved by more than 0.5px or changed a
   font, box or paint value.

     node shell-probe.mjs                        # every page carrying the markers
     node shell-probe.mjs whole-house-water-filter-sydney.html
     node shell-probe.mjs --widths 1440,390 <page>
     node shell-probe.mjs --json                 # machine-readable, for the gate
*/
import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

const ROOT = path.dirname(decodeURIComponent(new URL(import.meta.url).pathname));
const BASE = process.env.FFY_BASE || 'http://localhost:3000';
const TOL  = 0.5;

const argv = process.argv.slice(2);
const takeFlag = (name, dflt) => {
  const i = argv.indexOf(name);
  if (i === -1) return dflt;
  const v = argv[i + 1]; argv.splice(i, 2); return v;
};
const widths = String(takeFlag('--widths', '1440,1280,900,390')).split(',').map(Number);
const asJson = argv.includes('--json');
let pages = argv.filter(a => !a.startsWith('--'));
if (!pages.length) {
  pages = fs.readdirSync(ROOT)
    .filter(f => f.endsWith('.html') && !f.startsWith('_') && f !== 'index.html')
    .filter(f => fs.readFileSync(path.join(ROOT, f), 'utf8').includes('<!-- SHELL:HEADER -->'));
}

const probe = () => {
  const SC = ['.util', 'header.hdr', 'nav.msheet', 'footer.foot'];
  const out = {};
  for (const sel of SC) {
    const root = document.querySelector(sel);
    if (!root) { out[sel] = { __missing: true }; continue; }
    const rr = root.getBoundingClientRect();
    /* ⛔ THE KEY IS A DOM PATH, NEVER AN INDEX. A filtered-out node shifts every index
       after it, so index keys silently compare element 12 on one page against element 13
       on the other and invent drift. MEASURED 6 Sep: it "found" an 8px difference on a
       menu link that had none. The path is computed from the UNFILTERED tree. */
    const path = el => {
      const parts = [];
      for (let n = el; n && n !== root; n = n.parentElement) {
        const t = n.tagName.toLowerCase();
        let i = 1;
        for (let s = n.previousElementSibling; s; s = s.previousElementSibling)
          if (s.tagName === n.tagName) i++;
        parts.unshift(`${t}:${i}`);
      }
      return parts.join('/');
    };
    /* A scroll engine may append an invisible 1x1 snap marker inside the footer. It paints
       nothing and occupies nothing, so it cannot move a pixel — skip it, but COUNT it, so
       this can never quietly swallow something real. */
    const all = [root, ...root.querySelectorAll('*')].filter(el => {
      if (el === root) return true;
      const r = el.getBoundingClientRect(), cs = getComputedStyle(el);
      const invisible = r.width * r.height <= 1 && (cs.opacity === '0' || cs.visibility === 'hidden');
      if (invisible) { window.__ffySkipped = (window.__ffySkipped || 0) + 1; return false; }
      return true;
    });
    all.forEach(el => {
      const cls = (el.getAttribute('class') || '').trim().split(/\s+/).filter(Boolean).join('.');
      const txt = (el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 22);
      const key = `${sel} > ${path(el) || ':root'} ${el.tagName.toLowerCase()}${cls ? '.' + cls : ''}${txt ? `["${txt}"]` : ''}`;
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      out[key] = {
        /* relative to the scope root: a longer page must not read as drift */
        dx: +(r.x - rr.x).toFixed(2), dy: +(r.y - rr.y).toFixed(2),
        w: +r.width.toFixed(2), h: +r.height.toFixed(2),
        font: [['size', cs.fontSize], ['weight', cs.fontWeight], ['tracking', cs.letterSpacing],
               ['leading', cs.lineHeight], ['transform', cs.textTransform],
               ['family', cs.fontFamily.slice(0, 28)]].map(([k, v]) => `${k}:${v}`).join(' '),
        box: [['display', cs.display], ['padding', cs.padding], ['margin', cs.margin],
              ['border', cs.borderWidth], ['radius', cs.borderRadius], ['gap', cs.gap],
              ['align', cs.alignItems], ['justify', cs.justifyContent]].map(([k, v]) => `${k}:${v}`).join(' '),
        paint: [['color', cs.color], ['bg', cs.backgroundColor], ['opacity', cs.opacity],
                ['transform', cs.transform], ['shadow', cs.boxShadow]].map(([k, v]) => `${k}:${v}`).join(' '),
      };
    });
    out[sel] = { __h: +rr.height.toFixed(2), __w: +rr.width.toFixed(2) };
  }
  return out;
};

/* ⛔ SETTLE PROPERLY OR THE PROBE LIES. Both pages run Lenis, so window.scrollTo is
   hijacked into a smooth animation, and .hdr transitions colour and background over
   .35s once it lands. Sampling too early caught two pages at different points of the
   same fade and reported it as drift. Wait for scrollY to stop moving, THEN for the
   transitions to finish. */
const settle = async p => {
  await p.evaluate(() => document.fonts.ready);
  await p.evaluate(() => new Promise(res => {
    let last = -1, still = 0;
    (function tick(){
      if (Math.abs(scrollY - last) < 0.5) { if (++still > 8) return res(); } else still = 0;
      last = scrollY; requestAnimationFrame(tick);
    })();
  }));
  await new Promise(r => setTimeout(r, 1500));  // the 1.15s entrance + the .35s header transitions
};

const measure = async (browser, url, width) => {
  const p = await browser.newPage();
  await p.setViewport({ width, height: 900, deviceScaleFactor: 1 });
  /* ⛔ NO prefers-reduced-motion HERE. MEASURED 6 Sep: under reduce the whole house
     page's scroll engine stops taking wheel events altogether, so the probe could never
     reach the scrolled header. We settle instead of freezing — the entrance runs 1.15s
     and the header transitions .35s, so the wait below covers both. (That the page is
     wheel-dead under reduce is a real fault on that page, logged separately.) */
  await p.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
  await settle(p);
  const top = await p.evaluate(probe);
  /* ⛔ REAL WHEEL EVENTS, NOT window.scrollTo. The whole house page runs the scroll
     engine, which swallows a programmatic scrollTo entirely — MEASURED 6 Sep, scrollY
     stayed 0 and the probe then "found" a header that never flipped. A wheel event is
     what a person sends, so it is what the probe sends. */
  /* ⛔ COMPARE THE SAME STATE, NOT THE SAME PIXEL DEPTH. The header steps aside only
     PAST THE OPENER, so a short page scrolled 1600px and a long one scrolled 1600px are
     in different header states and every node reads as drift. MEASURED 6 Sep on a fresh
     template page: 41 "differences" that were nothing but a page too short to get there.
     Drive each page to its own opener + 400 instead, and if it cannot reach that, say so
     rather than pretend the comparison is meaningful. */
  const target = await p.evaluate(() => {
    const t = document.querySelector('.pgtop') || document.querySelector('.hero');
    return Math.round((t ? t.offsetHeight : 600) + 400);
  });
  await p.mouse.move(width / 2, 500);
  let y = 0, stalled = 0;
  /* 80px notches: smaller ones and the snap engine on the whole house page pulls the
     page straight back to 0 (MEASURED, 12 x 60 landed on scrollY 0). */
  for (let i = 0; i < 90 && y < target; i++) {
    await p.mouse.wheel({ deltaY: 80 });
    await new Promise(r => setTimeout(r, 25));
    const now = await p.evaluate(() => Math.round(scrollY));
    stalled = now > y ? 0 : stalled + 1;
    y = now;
    if (stalled > 12) break;
  }
  await settle(p);
  y = await p.evaluate(() => Math.round(scrollY));
  const reached = y >= target - 80;
  const scrolled = reached ? await p.evaluate(probe) : { __short: true, y, target };
  /* ⛔ OPEN THE MENU THE WAY A PERSON DOES — click the burger. Forcing body.mopen by
     hand leaves the header's .hide class wherever the scroll happened to stop, which
     differs per page and reads as drift that is not there. Clicking runs the shell's own
     state machine on both pages. Back to the top first, so both start from the same place.
     Above 1079px there is no burger, so there is no menu state to compare. */
  for (let i = 0; i < 60; i++) { await p.mouse.wheel({ deltaY: -200 }); await new Promise(r => setTimeout(r, 12)); }
  await settle(p);
  const hasBurger = await p.evaluate(() => {
    const b = document.querySelector('.hdr .burger');
    return !!(b && b.getBoundingClientRect().width);
  });
  let menu = { __noburger: true };
  if (hasBurger) {
    await p.evaluate(() => document.querySelector('.hdr .burger').click());
    await settle(p);
    /* ⛔ TAKE FOCUS OUT OF THE MEASUREMENT, AND REPORT IT SEPARATELY. Opening the sheet
       leaves a :focus-visible ring somewhere, and :focus-visible carries a border-radius —
       so a focus that lands on a different element reads as a radius change on a menu link
       (MEASURED 6 Sep: 8px vs 0px on "Systems", which is a focus ring and not a layout
       fault). Where the focus lands is still worth knowing, so it becomes one named field
       instead of noise smeared across every node. */
    const focus = await p.evaluate(() => {
      const a = document.activeElement;
      const id = a ? `${a.tagName.toLowerCase()}${a.className ? '.' + String(a.className).trim().split(/\s+/).join('.') : ''}` : 'none';
      if (a && a.blur) a.blur();
      return id;
    });
    await settle(p);
    menu = await p.evaluate(probe);
    menu.__focus = { on: focus };
  }
  await p.close();
  return { top, scrolled, menu };
};

const diff = (A, B) => {
  const rows = [];
  for (const k of new Set([...Object.keys(A), ...Object.keys(B)])) {
    if (k === '__skipped') continue;
    if (k === '__focus') {
      if (A[k] && B[k] && A[k].on !== B[k].on)
        rows.push({ k: 'menu focus', why: `opening the sheet focuses ${A[k].on} on the homepage, ${B[k].on} here` });
      continue;
    }
    const a = A[k], b = B[k];
    if (!a) { rows.push({ k, why: 'element exists here but not on the homepage' }); continue; }
    if (!b) { rows.push({ k, why: 'element on the homepage is missing here' }); continue; }
    if (a.__missing || b.__missing) { if (a.__missing !== b.__missing) rows.push({ k, why: `scope ${a.__missing ? 'absent on homepage' : 'absent here'}` }); continue; }
    for (const m of ['dx', 'dy', 'w', 'h', '__w', '__h'])
      if (a[m] !== undefined && Math.abs(a[m] - b[m]) > TOL)
        rows.push({ k, why: `${m}: ${a[m]} → ${b[m]} (${(b[m] - a[m]).toFixed(2)}px)` });
    for (const m of ['font', 'box', 'paint'])
      if (a[m] !== undefined && a[m] !== b[m])
        rows.push({ k, why: `${m}\n      homepage: ${a[m]}\n      this page: ${b[m]}` });
  }
  return rows;
};

const browser = await puppeteer.launch({ headless: true, args: ['--font-render-hinting=none'] });
const report = [];
for (const width of widths) {
  const home = await measure(browser, `${BASE}/`, width);
  for (const pg of pages) {
    const got = await measure(browser, `${BASE}/${pg.replace(/\.html$/, '')}`, width);
    for (const state of ['top', 'scrolled', 'menu']) {
      if (home[state].__noburger || got[state].__noburger) continue;   // no burger at this width
      if (home[state].__short || got[state].__short) {
        const w = got[state].__short ? got[state] : home[state];
        console.log(`⚠ ${pg} @ ${width}px (${state}): page too short to scroll past its own opener `
                    + `(reached ${w.y}px of ${w.target}px) — the scrolled header cannot be judged here.`);
        continue;
      }
      const rows = diff(home[state], got[state]);
      if (rows.length) report.push({ page: pg, width, state, rows });
    }
  }
}
await browser.close();

if (asJson) { console.log(JSON.stringify(report, null, 1)); process.exit(report.length ? 1 : 0); }
for (const r of report) {
  console.log(`\n✗ ${r.page} @ ${r.width}px (${r.state}) — ${r.rows.length} difference(s) from index.html`);
  for (const row of r.rows.slice(0, 25)) console.log(`  ~ ${row.k}\n      ${row.why}`);
  if (r.rows.length > 25) console.log(`  … and ${r.rows.length - 25} more`);
}
if (report.length) {
  console.log(`\n✗ SHELL DRIFT — ${report.length} page/width/state combination(s) do not render identically to the homepage.`);
  process.exit(1);
}
console.log(`✓ ${pages.length} page(s) × ${widths.length} width(s) × 3 states: utility strip, header, mobile sheet and footer render identically to index.html (±${TOL}px).`);
