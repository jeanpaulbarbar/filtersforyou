/**
 * nav-sync.js — Syncs nav+ticker HTML and CSS from index.html to all inner pages
 * Run: node nav-sync.js
 */

const fs = require('fs');
const path = require('path');

// ── 1. READ INDEX.HTML AND EXTRACT SOURCES ──────────────────────────────────

const indexHtml = fs.readFileSync('index.html', 'utf8');

// Extract nav HTML: from <!-- TICKER --> to </nav> (first occurrence in body)
const navHtmlStart = indexHtml.indexOf('<!-- TICKER -->');
const navHtmlEnd = indexHtml.indexOf('</nav>', navHtmlStart) + 6;
const NAV_HTML = indexHtml.substring(navHtmlStart, navHtmlEnd);

// Extract main style nav CSS: from /* TICKER */ through end of NAV section
const mainStyleStart = indexHtml.indexOf('<style>') + 7;
const mainStyleEnd = indexHtml.indexOf('</style>');
const mainStyleContent = indexHtml.substring(mainStyleStart, mainStyleEnd);
const tickerNavStart = mainStyleContent.indexOf('/* TICKER */');
const tickerNavEnd = mainStyleContent.indexOf('\n\n/* HERO */');
const MAIN_NAV_CSS = mainStyleContent.substring(tickerNavStart, tickerNavEnd);

// Also extract the .nav-cta-quote line
const ctaQuoteStart = mainStyleContent.indexOf('\n.nav-cta-quote');
const ctaQuoteEnd = mainStyleContent.indexOf('\n', ctaQuoteStart + 1);
const NAV_CTA_QUOTE_CSS = mainStyleContent.substring(ctaQuoteStart + 1, ctaQuoteEnd);

// Extract complete dropdown-nav-css block
const ddStart = indexHtml.indexOf('<style id="dropdown-nav-css">');
const ddEnd = indexHtml.indexOf('</style>', ddStart) + 8;
const DROPDOWN_NAV_BLOCK = indexHtml.substring(ddStart, ddEnd);

// Combined CSS to inject at end of main <style> block
const NAV_CSS_INJECT = `
/* ── HOMEPAGE NAV SYNC ── */
${MAIN_NAV_CSS}
${NAV_CTA_QUOTE_CSS}
`;

console.log('=== Extracted from index.html ===');
console.log('Nav HTML length:', NAV_HTML.length);
console.log('Main nav CSS length:', MAIN_NAV_CSS.length);
console.log('Dropdown nav block length:', DROPDOWN_NAV_BLOCK.length);

// ── 2. DEFINE PATTERNS TO REMOVE FROM INNER PAGE STYLE BLOCKS ───────────────

const NAV_TICKER_PATTERNS = [
  /^\/\* NAV \*\//,
  /^\/\* TICKER \*\//,
  /^\/\* === DROPDOWN NAV === \*\//,
  /^\/\* ── HOMEPAGE NAV SYNC ── \*\//,
  /^\.nav([^a-z]|$)/,
  /^\.nav-/,
  /^\.ticker/,
  /^\.dot\{/,
  /^\.online-dot-wrap/,
  /^@keyframes tick\b/,
  /^@keyframes blink\b/,
  /^\.ham-bar/,
  /^\.mobile-nav/,
  /^\.mobile-section/,
  /^\.mobile-plain-links/,
  /^\.mobile-cta/,
  /^\.nav-hamburger/,
  /^\.nav-item/,
  /^\.nav-link-btn/,
  /^\.nav-link-plain/,
  /^\.dropdown/,
  /^\.chevron\{/,
];

// Patterns for nav lines inside media queries (with indentation)
const NAV_INLINE_PATTERNS = [
  /\.nav\{position:fixed/,
  /\.nav-inner\{padding:0 16px/,
  /\.nav-links\{display:none/,
  /\.nav-cta-quote/,
];

function stripNavCss(styleContent) {
  const lines = styleContent.split('\n');
  const filtered = lines.filter(line => {
    const trimmed = line.trim();
    if (!trimmed) return true;

    for (const pat of NAV_TICKER_PATTERNS) {
      if (pat.test(trimmed)) return false;
    }
    for (const pat of NAV_INLINE_PATTERNS) {
      if (pat.test(trimmed)) return false;
    }
    return true;
  });
  return filtered.join('\n');
}

// ── 3. FIND NAV BLOCK BOUNDARIES ────────────────────────────────────────────

/**
 * Finds the start of the nav/ticker block in a page's body.
 * Handles multiple variants from prior injection attempts:
 *   - <!-- TICKER --> comment (clean injection)
 *   - <!-- NAV --> comment followed by <div class="ticker"
 *   - <div class="ticker" (no comment)
 *
 * Returns the earliest position after <body>.
 */
function findNavBlockStart(content) {
  const bodyPos = content.indexOf('<body>');
  if (bodyPos === -1) return -1;

  const candidates = [
    content.indexOf('<!-- TICKER -->', bodyPos),
    content.indexOf('<!-- NAV -->', bodyPos),
    content.indexOf('<div class="ticker"', bodyPos),
    content.indexOf('<nav class="nav">', bodyPos),
  ].filter(pos => pos !== -1);

  if (candidates.length === 0) return -1;
  return Math.min(...candidates);
}

/**
 * Finds the end of the nav block (i.e. right before the hero/main content).
 * Returns the position immediately after the last </nav> tag that belongs to
 * the nav block.
 *
 * Strategy: find the first <section or <!-- HERO --> after navStart,
 * then find the last </nav> before that point.
 */
function findNavBlockEnd(content, navStart) {
  // Find where the main content begins
  const heroComment = content.indexOf('<!-- HERO -->', navStart);
  const heroSection = content.indexOf('<section class="hero"', navStart);
  const firstSection = content.indexOf('<section', navStart);

  const candidates = [heroComment, heroSection, firstSection].filter(p => p !== -1);
  if (candidates.length === 0) return -1;
  const mainContentStart = Math.min(...candidates);

  // Find the last </nav> before mainContentStart
  let lastNavClose = -1;
  let searchPos = navStart;
  while (true) {
    const pos = content.indexOf('</nav>', searchPos);
    if (pos === -1 || pos >= mainContentStart) break;
    lastNavClose = pos;
    searchPos = pos + 6;
  }

  if (lastNavClose === -1) {
    // No </nav> found before main content — just return mainContentStart
    // and we'll place the nav right before it
    return mainContentStart;
  }

  // Return position right after </nav> + skip any trailing whitespace/comments up to main content
  // We'll include the whitespace between </nav> and <!-- HERO --> in the replacement area
  return mainContentStart;
}

// ── 4. PROCESS EACH INNER HTML FILE ─────────────────────────────────────────

const files = fs.readdirSync('.').filter(f =>
  f.endsWith('.html') && f !== 'index.html'
);

console.log(`\nProcessing ${files.length} inner pages...`);

let updatedCount = 0;
let errorCount = 0;
const skipped = [];

for (const file of files) {
  try {
    let content = fs.readFileSync(file, 'utf8');

    // ── a) Find and replace nav HTML ──────────────────────────────────────
    const navStart = findNavBlockStart(content);
    if (navStart === -1) {
      skipped.push(`${file}: no nav block found`);
      continue;
    }

    const navEnd = findNavBlockEnd(content, navStart);
    if (navEnd === -1) {
      skipped.push(`${file}: could not find nav block end`);
      continue;
    }

    // Replace the entire nav block area with homepage nav + newlines
    content = content.substring(0, navStart) + NAV_HTML + '\n\n' + content.substring(navEnd);

    // ── b) Strip old nav CSS from main <style> block ───────────────────────
    const styleOpenPos = content.indexOf('<style>');
    const styleClosePos = content.indexOf('</style>');
    if (styleOpenPos === -1 || styleClosePos === -1) {
      skipped.push(`${file}: no <style> block`);
      continue;
    }

    const before = content.substring(0, styleOpenPos + 7);
    const oldStyleContent = content.substring(styleOpenPos + 7, styleClosePos);
    const after = content.substring(styleClosePos);

    const cleanedStyle = stripNavCss(oldStyleContent);

    // ── c) Append homepage nav CSS at end of main <style> ─────────────────
    content = before + cleanedStyle + NAV_CSS_INJECT + after;

    // ── d) Replace/inject dropdown-nav-css block ───────────────────────────
    const ddOldStart = content.indexOf('<style id="dropdown-nav-css">');
    if (ddOldStart !== -1) {
      const ddOldEnd = content.indexOf('</style>', ddOldStart) + 8;
      content = content.substring(0, ddOldStart) + DROPDOWN_NAV_BLOCK + content.substring(ddOldEnd);
    } else {
      // Inject after the first </style>
      const firstClose = content.indexOf('</style>');
      if (firstClose !== -1) {
        content = content.substring(0, firstClose + 8) + '\n' + DROPDOWN_NAV_BLOCK + content.substring(firstClose + 8);
      }
    }

    fs.writeFileSync(file, content, 'utf8');
    updatedCount++;

    if (updatedCount % 20 === 0) {
      console.log(`  ${updatedCount} files done...`);
    }
  } catch (err) {
    console.error(`  ERROR ${file}:`, err.message);
    errorCount++;
  }
}

console.log(`\nDone! Updated ${updatedCount} files, ${errorCount} errors.`);
if (skipped.length > 0) {
  console.log('\nSkipped files:');
  skipped.forEach(s => console.log('  SKIP', s));
}
