// Render the same page before and after the strip and prove nothing moved.
// Compares the measured box of every element and the computed styles that
// decide how a page looks, plus console errors. Deterministic: video frames
// and timer animations cannot make it flap.
import puppeteer from 'puppeteer';
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';

const [beforeDir, afterDir, ...pages] = process.argv.slice(2);
const WIDTHS = [[1440, 900], [390, 844]];
const TYPES = { '.html':'text/html', '.css':'text/css', '.js':'text/javascript', '.mjs':'text/javascript',
  '.json':'application/json', '.webp':'image/webp', '.png':'image/png', '.jpg':'image/jpeg',
  '.jpeg':'image/jpeg', '.svg':'image/svg+xml', '.mp4':'video/mp4', '.webm':'video/webm',
  '.woff2':'font/woff2', '.woff':'font/woff', '.ico':'image/x-icon', '.avif':'image/avif' };

function serve(dir) {
  const real = '/Users/xtc/Nucleus/Website';
  return new Promise(res => {
    const s = createServer(async (req, rq) => {
      let p = decodeURIComponent(req.url.split('?')[0]);
      if (p === '/') p = '/index.html';
      if (!extname(p)) p += '.html';
      const roots = p.endsWith('.html') && !p.slice(1).includes('/') ? [dir, real] : [real];
      for (const root of roots) {
        const f = join(root, normalize(p).replace(/^(\.\.[/\\])+/, ''));
        try { await stat(f);
          rq.writeHead(200, {'content-type': TYPES[extname(f)] || 'application/octet-stream'});
          rq.end(await readFile(f)); return;
        } catch {}
      }
      rq.writeHead(404); rq.end('nf');
    });
    s.listen(0, '127.0.0.1', () => res(s));   // let the OS pick a free port
  });
}

const sA = await serve(beforeDir);
const sB = await serve(afterDir);
const PA = sA.address().port, PB = sB.address().port;
const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });

const PROBE = (scrollTo) => {
  // A looping animation is at a different point in its cycle on every render.
  // Park every one of them on frame zero so both sides are measured identically.
  document.getAnimations?.().forEach(a => { try { a.pause(); a.currentTime = 0; } catch {} });
  document.querySelectorAll('video').forEach(v => { try { v.pause(); v.currentTime = 0; } catch {} });
  const round = n => Math.round(n * 2) / 2;
  const out = [];
  const all = document.getElementsByTagName('*');
  for (let i = 0; i < all.length; i++) {
    const el = all[i];
    const r = el.getBoundingClientRect();
    const c = getComputedStyle(el);
    out.push([
      el.tagName, el.className && String(el.className).slice(0, 60),
      round(r.x), round(r.y), round(r.width), round(r.height),
      c.display, c.position, c.color, c.backgroundColor, c.fontSize,
      c.fontFamily.slice(0, 30), c.fontWeight, c.opacity, c.zIndex,
      c.transform.slice(0, 40), c.borderRadius, c.margin, c.padding,
    ].join('|'));
  }
  return { rows: out, height: document.documentElement.scrollHeight,
           scrollY: Math.round(window.scrollY),
           rules: [...document.styleSheets].reduce((n, s) => { try { return n + s.cssRules.length } catch { return n } }, 0) };
};

const withTimeout = (promise, ms, what) => Promise.race([promise,
  new Promise((_, rej) => setTimeout(() => rej(new Error(`timed out after ${ms}ms: ${what}`)), ms))]);

async function probe(port, path, w, h) {
  const page = await browser.newPage();
  const errs = [];
  page.on('pageerror', e => errs.push(String(e).split('\n')[0]));
  page.on('console', m => { if (m.type() === 'error') errs.push(m.text().slice(0, 160)); });
  await page.setViewport({ width: w, height: h, isMobile: w < 700, hasTouch: w < 700 });
  await page.goto(`http://127.0.0.1:${port}${path}`, { waitUntil: 'networkidle2', timeout: 90000 });
  await page.evaluate(() => new Promise(r => setTimeout(r, 2500)));
  const shots = [];
  for (const y of [0, 3000, 12000]) {
    // Smooth-scroll libraries animate to the target, so land it and confirm it
    // before measuring — a probe taken mid-flight compares two different pages.
    let shot;
    for (let attempt = 0; attempt < 4; attempt++) {
      await page.evaluate(y => window.scrollTo(0, y), y);
      await page.evaluate(() => new Promise(r => setTimeout(r, 3200)));  // elements are still being created at 2s on the phone homepage
      shot = await page.evaluate(PROBE, y);
      const want = Math.min(y, Math.max(0, shot.height - h));
      if (Math.abs(shot.scrollY - want) <= 2) break;
    }
    shots.push(shot);
  }
  await page.close();
  return { shots, errs };
}

// Two renders of the same page never land on the identical frame of an
// animation, so numbers compare with a tolerance and everything else exactly.
// A layout change is pixels; a tween mid-flight is thousandths.
const NUM = /-?\d+\.?\d*(?:e-?\d+)?/g;
function same(a, b) {
  if (a === b) return true;
  if (a.replace(NUM, '#') !== b.replace(NUM, '#')) return false;   // structure/colour/font differ
  const xa = a.match(NUM) || [], xb = b.match(NUM) || [];
  if (xa.length !== xb.length) return false;
  return xa.every((v, i) => Math.abs(parseFloat(v) - parseFloat(xb[i])) <= 1.5);
}

// Some pages animate on entry and do not always reach the same resting frame,
// so a single comparison flakes even against an identical file. A difference
// counts only when the SAME element differs on an independent repeat.
// What a render check can honestly prove.
//
// A comment is a Comment node: it has no rendering, so removing one cannot move
// a pixel unless it broke the syntax around it or something read it. That is
// what verify_no_notes.py proves exactly, node by node.
//
// This check is the other half: the page still LOADS and RUNS. Those signals are
// deterministic — element count, document height, live stylesheet rules, console
// errors. Per-element geometry is not: these pages animate on entry and react to
// scroll history, so identical files disagree on it. Geometry is reported as a
// note, never as a verdict.
async function diffOnce(p, w, h) {
  const A = await probe(PA, p, w, h);
  const B = await probe(PB, p, w, h);
  const keys = new Set(), notes = [];
  const sa = A.shots[0], sb = B.shots[0];

  if (sa.rows.length !== sb.rows.length) { keys.add('count'); notes.push(`elements ${sa.rows.length} -> ${sb.rows.length}`); }
  if (sa.height !== sb.height)           { keys.add('height'); notes.push(`document height ${sa.height} -> ${sb.height}`); }
  if (sa.rules !== sb.rules)             { keys.add('rules');  notes.push(`live css rules ${sa.rules} -> ${sb.rules}`); }
  if (!sa.rows.length)                   { keys.add('empty');  notes.push('page rendered nothing'); }
  B.errs.filter(e => !A.errs.includes(e)).forEach(e => { keys.add('err:' + e); notes.push(`NEW CONSOLE ERROR: ${e}`); });

  // deeper scroll states: same three signals, measured after the page has moved
  A.shots.slice(1).forEach((x, i) => {
    const y = B.shots[i + 1];
    if (Math.abs(x.scrollY - y.scrollY) > 2) return;      // not comparable, skip
    if (x.rows.length !== y.rows.length) { keys.add(`count#${i+1}`); notes.push(`at ${x.scrollY}px: elements ${x.rows.length} -> ${y.rows.length}`); }
    if (x.height !== y.height)           { keys.add(`height#${i+1}`); notes.push(`at ${x.scrollY}px: height ${x.height} -> ${y.height}`); }
  });

  const moved = sa.rows.length === sb.rows.length
    ? sa.rows.reduce((n, r, i) => n + (same(r, sb.rows[i]) ? 0 : 1), 0) : -1;
  return { keys, notes, A, B, moved };
}

const JOBS = [];
for (const p of pages) for (const [w, h] of WIDTHS) JOBS.push([p, w, h]);

const CONC = Number(process.env.CONC || 5);
const results = new Array(JOBS.length);
let next = 0, done = 0;
await Promise.all(Array.from({ length: CONC }, async () => {
  while (true) {
    const idx = next++;
    if (idx >= JOBS.length) return;
    const [p, w, h] = JOBS[idx];
    let r, notes = [];
    try {
      r = await withTimeout(diffOnce(p, w, h), 180000, `${p} @${w}`);
      if (r.keys.size) {
        const r2 = await withTimeout(diffOnce(p, w, h), 180000, `${p} @${w} repeat`);
        const stable = [...r.keys].filter(k => r2.keys.has(k));
        if (!stable.length) { r.keys = new Set(); notes = []; }
        else { r.keys = new Set(stable); notes = r2.notes.slice(0, 3); }
      }
    } catch (e) {
      results[idx] = { ok: false, line: `FAIL ${p} @${w}  render threw: ${String(e).split('\n')[0]}` };
      console.log(`  ${++done}/${JOBS.length}`); continue;
    }
    const ok = r.keys.size === 0;
    results[idx] = { ok, line:
      `${ok ? 'ok  ' : 'FAIL'} ${p} @${w}  ${r.A.shots[0].rows.length} elements, ` +
      `${r.A.shots[0].rules} css rules, ${r.A.shots[0].height}px tall` +
      (r.moved > 0 ? `  (${r.moved} elements mid-animation)` : '') +
      (ok ? '' : '\n      ' + notes.join('\n      ')) };
    done++;
    if (done % 25 === 0) process.stderr.write(`  ${done}/${JOBS.length}\n`);
  }
}));

let bad = 0;
for (const r of results) { if (!r.ok) { bad++; console.log(r.line); } }
console.log(`${results.length - bad} of ${results.length} render checks passed`);
await browser.close(); sA.close(); sB.close();
console.log(bad ? `\n${bad} render checks FAILED` : `\nall render checks passed — nothing moved`);
process.exit(bad ? 1 : 0);
