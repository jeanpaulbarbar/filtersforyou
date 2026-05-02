import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';

const dir = '/Users/xtc/Desktop/FFY Agency Hub/Website';

const CSS = `<style>
.local-insights-section{background:linear-gradient(135deg,#0b61f4 0%,#0848c0 100%);border-radius:16px;padding:28px 24px;margin:32px 0;}
.li-label{display:flex;align-items:center;gap:8px;margin-bottom:18px;}
.li-label span{font-size:.8rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:#EAAF00;}
.li-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;}
.li-card{background:rgba(255,255,255,0.1);border-radius:10px;padding:14px 16px;font-size:.875rem;line-height:1.65;color:rgba(255,255,255,0.92);border:1px solid rgba(255,255,255,0.15);}
@media(max-width:640px){.li-grid{grid-template-columns:1fr;}.local-insights-section{padding:22px 16px;}}
</style>`;

const PIN_SVG = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#EAAF00" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`;

const files = readdirSync(dir).filter(f =>
  f.startsWith('water-filter-installation-') && f.endsWith('.html')
);

let updated = 0;
let skipped = 0;

for (const filename of files) {
  const filepath = join(dir, filename);
  let html = readFileSync(filepath, 'utf8');

  // Check if it has the old local-knowledge-section
  if (!html.includes('class="local-knowledge-section"')) {
    skipped++;
    continue;
  }

  // Extract suburb name from the h3 "Water Filtration in [Suburb]"
  const h3Match = html.match(/Water Filtration in ([^<]+)</);
  const suburbName = h3Match ? h3Match[1].trim() : '';

  if (!suburbName) {
    console.warn(`  WARNING: Could not extract suburb name from ${filename}`);
    skipped++;
    continue;
  }

  // Extract the 3 <li> texts from within the local-knowledge-section
  const sectionMatch = html.match(/<section class="local-knowledge-section"[\s\S]*?<\/section>/);
  if (!sectionMatch) {
    console.warn(`  WARNING: Could not find section in ${filename}`);
    skipped++;
    continue;
  }

  const sectionHTML = sectionMatch[0];
  const liMatches = [...sectionHTML.matchAll(/<li>([\s\S]*?)<\/li>/g)];

  if (liMatches.length < 3) {
    console.warn(`  WARNING: Found ${liMatches.length} bullets (expected 3) in ${filename}`);
    skipped++;
    continue;
  }

  const bullets = liMatches.slice(0, 3).map(m => m[1].trim());

  // Build new section
  const newSection = `<section class="local-insights-section">
  <div class="li-label">
    ${PIN_SVG}
    <span>${suburbName} Local Insights</span>
  </div>
  <div class="li-grid">
    <div class="li-card">${bullets[0]}</div>
    <div class="li-card">${bullets[1]}</div>
    <div class="li-card">${bullets[2]}</div>
  </div>
</section>`;

  // Replace old section with new
  html = html.replace(sectionMatch[0], newSection);

  // Inject CSS into <head> if not already present
  if (!html.includes('local-insights-section{')) {
    html = html.replace('</head>', `${CSS}\n</head>`);
  }

  writeFileSync(filepath, html, 'utf8');
  console.log(`  ✓ ${filename} → "${suburbName} Local Insights"`);
  updated++;
}

console.log(`\nDone: ${updated} updated, ${skipped} skipped.`);
