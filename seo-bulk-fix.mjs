// FFY SEO Bulk Fix Script — 2026-05-02
// Handles: sameAs, Service schema, SpeakableSpecification, date meta tags,
//          title fixes, description fixes, FAQPage schema for calculator

import fs from 'fs';
import path from 'path';

const DIR = '/Users/xtc/Desktop/FFY Agency Hub/Website';

const SAME_AS = [
  "https://www.facebook.com/filtersforyouau",
  "https://www.instagram.com/filtersforyouau",
  "https://www.tiktok.com/@filtersforyouau"
];

// Pages to skip entirely
const SKIP = new Set(['about.html', 'pfas-water-filter-sydney.html', 'water-filter-installation-price-sydney.html']);

// Pages that should NOT get Service schema
const NO_SERVICE = new Set([
  'privacy-policy.html','refund-policy.html','terms-and-conditions.html',
  'filter-lifespan-calculator.html','water-savings-calculator.html',
  'how-water-filters-work.html','sydney-water-quality-guide.html',
  'water-filter-faq-sydney.html','water-filter-maintenance-guide.html',
  'is-sydney-water-safe.html',
  'under-sink-water-filter-vs-benchtop-sydney.html',
  'whole-house-vs-under-sink-water-filter.html',
]);

// Guide/educational pages — get Article schema + date meta tags
const GUIDE_PAGES = new Set([
  'how-water-filters-work.html','sydney-water-quality-guide.html',
  'sydney-water-filter-cost-guide.html','water-filter-faq-sydney.html',
  'water-filter-maintenance-guide.html','is-sydney-water-safe.html',
  'water-filter-pfas-removal-sydney.html','best-water-filter-sydney.html',
  'best-water-filter-for-hard-water-sydney.html',
  'watermark-certified-water-filter-sydney.html',
  'water-filter-baby-safe-sydney.html','water-filter-baby-formula-sydney.html',
  'water-filter-chlorine-removal-sydney.html',
  'water-filter-apartment-sydney.html','water-filter-for-renters-sydney.html',
  'water-filter-system-sydney-family.html',
  'licensed-plumber-water-filter-sydney.html',
  'under-sink-water-filter-vs-benchtop-sydney.html',
  'whole-house-vs-under-sink-water-filter.html',
  'water-filter-installation-same-day-sydney.html',
  'free-assessment.html'
]);

// Top 20 pages for SpeakableSpecification (index, under-sink, whole-house already have it)
const SPEAKABLE_PAGES = new Set([
  'reverse-osmosis-water-filter-sydney.html',
  'water-filter-systems.html',
  'water-filter-faq-sydney.html',
  'sydney-water-filter-cost-guide.html',
  'best-water-filter-sydney.html',
  'water-filter-installation-homebush.html',
  'water-filter-installation-newtown.html',
  'water-filter-installation-burwood.html',
  'water-filter-installation-strathfield.html',
  'water-filter-installation-parramatta.html',
  'water-filter-installation-bondi.html',
  'water-filter-installation-chatswood.html',
  'water-filter-installation-ashfield.html',
  'water-filter-installation-leichhardt.html',
  'water-filter-installation-marrickville.html',
  'water-filter-installation-randwick.html',
  'water-filter-installation-manly.html',
]);

// Title fixes
const TITLE_FIXES = {
  'filter-lifespan-calculator.html': 'Filter Lifespan Calculator Sydney | Filters For You',
  'water-savings-calculator.html': 'Water Savings Calculator Sydney | Filters For You',
};

// Description fixes (trim to ≤155 chars)
const DESC_FIXES = {
  'water-savings-calculator.html': 'Calculate your annual savings from filtered vs bottled water. Free calculator from Filters For You Sydney — systems from $550. Call 0430 546 749.',
  'filter-lifespan-calculator.html': 'Find out when your water filter needs replacing based on household size. Free filter lifespan calculator from Filters For You Sydney. Call 0430 546 749.',
  'free-assessment.html': 'Free water assessment Sydney — test your water quality for chlorine, TDS & pH. Jean-Paul recommends the right filter. Call 0430 546 749 today.',
  'water-filter-installation-glebe.html': 'Water filter installation Glebe by Jean-Paul — licensed plumber 10km away. Under sink, RO & whole house systems from $550. Fixed price. Call 0430 546 749.',
  'water-filter-installation-north-richmond.html': 'PFAS chemicals detected near North Richmond. Professional water filter installation by Jean-Paul — RO & whole house from $550. Call 0430 546 749.',
  'water-filter-installation-homebush-west.html': 'Water filter installation Homebush West by Jean-Paul — licensed plumber 4km away. Under sink, RO & whole house from $550. Fixed price. Call 0430 546 749.',
  'pure-essential-water-filter-sydney.html': 'Pure Essential twin-stage under sink filter. Removes chloramine & chlorine from Sydney tap water. $550 installed. WaterMark certified. Call 0430 546 749.',
  'locations-inner-city.html': 'Water filter installation in Sydney\'s Inner City. Jean-Paul covers Redfern, Pyrmont, Chippendale, Ultimo & CBD. Licensed plumber. Call 0430 546 749.',
  'locations-inner-west.html': 'Water filter installation in Sydney\'s Inner West. Jean-Paul covers Ashfield, Burwood, Newtown & more. Licensed plumber. Fixed price. Call 0430 546 749.',
  'locations-western-sydney.html': 'Water filter installation across Western Sydney. Jean-Paul covers Parramatta, Bankstown, Auburn, Liverpool & more. Licensed plumber. Call 0430 546 749.',
  'locations-south-sydney.html': 'Water filter installation across South Sydney. Jean-Paul covers Hurstville, Rockdale, Mascot, Kogarah & more. Licensed plumber. Call 0430 546 749.',
  'locations-eastern-suburbs.html': 'Water filter installation in Sydney\'s Eastern Suburbs. Jean-Paul covers Bondi, Randwick, Coogee, Paddington & more. Licensed plumber. Call 0430 546 749.',
  'locations-north-shore.html': 'Water filter installation in Sydney\'s North Shore. Jean-Paul covers Chatswood, Manly, North Richmond & Richmond. Licensed plumber. Call 0430 546 749.',
};

// FAQPage schema for water-savings-calculator
const CALCULATOR_FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How long do water filters last?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Most under-sink filters need replacement every 12 months. Reverse osmosis membranes typically last 2–3 years depending on water quality and household usage."
      }
    },
    {
      "@type": "Question",
      "name": "How much does bottled water cost per year?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "A family of 4 buying 2L bottles spends approximately $600–$1,200 per year on bottled water. That's before considering the environmental impact of single-use plastic."
      }
    },
    {
      "@type": "Question",
      "name": "How quickly does a water filter pay for itself?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Most Filters For You systems pay back within 12–18 months compared to bottled water costs. The Pure Essential system at $550 typically breaks even in under a year for a family of 4."
      }
    },
    {
      "@type": "Question",
      "name": "Does filtered water save money long term?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes — over 5 years, a filtered water system typically saves Sydney families $2,000–$4,000 compared to buying bottled water. Annual filter replacement costs are $50–$150, far less than bottled water expenses."
      }
    }
  ]
};

function getAreaFromFilename(filename) {
  const suburbMatch = filename.match(/water-filter-installation-([^.]+)\.html/);
  if (suburbMatch) {
    return suburbMatch[1].split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  }
  const roMatch = filename.match(/reverse-osmosis-installation-([^.]+)\.html/);
  if (roMatch) return roMatch[1].split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  const whMatch = filename.match(/whole-house-water-filter-([^.]+)\.html/);
  if (whMatch) {
    const suburb = whMatch[1].replace('-sydney','');
    if (!['sydney'].includes(suburb)) return suburb.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  }
  const usMatch = filename.match(/under-sink-water-filter-([^.]+)\.html/);
  if (usMatch) {
    const suburb = usMatch[1].replace('-sydney','');
    if (!['sydney','vs','bondi','parramatta','randwick'].includes(suburb)) return suburb;
    if (['bondi','parramatta','randwick'].includes(suburb)) return suburb.charAt(0).toUpperCase() + suburb.slice(1);
  }
  const locMatch = filename.match(/locations-([^.]+)\.html/);
  if (locMatch) return locMatch[1].split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') + ' Sydney';
  return 'Sydney';
}

function getServiceName(html, filename) {
  const h1Match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
  if (h1Match) {
    return h1Match[1].replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ').trim();
  }
  return 'Water Filter Installation Sydney';
}

function getServiceDesc(html) {
  const descM = html.match(/<meta name="description" content="([^"]+)"/);
  if (descM) {
    const d = descM[1].replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ');
    return d.length > 200 ? d.substring(0, 200) : d;
  }
  return 'Professional water filter installation service in Sydney by Jean-Paul Barber, licensed plumber (Licence: 461511C). Under sink, reverse osmosis and whole house systems from $550.';
}

function processFile(filename) {
  const filepath = path.join(DIR, filename);
  let html = fs.readFileSync(filepath, 'utf8');
  let changed = false;
  const log = [];

  // 1. Title fix
  if (TITLE_FIXES[filename]) {
    const currentTitle = html.match(/<title>([^<]+)<\/title>/);
    if (currentTitle && currentTitle[1] !== TITLE_FIXES[filename]) {
      html = html.replace(/<title>[^<]+<\/title>/, `<title>${TITLE_FIXES[filename]}</title>`);
      // Also fix og:title and twitter:title
      html = html.replace(/<meta property="og:title" content="[^"]*"/, `<meta property="og:title" content="${TITLE_FIXES[filename]}"`);
      html = html.replace(/<meta name="twitter:title" content="[^"]*"/, `<meta name="twitter:title" content="${TITLE_FIXES[filename]}"`);
      changed = true;
      log.push('fixed title');
    }
  }

  // 2. Description fix
  if (DESC_FIXES[filename]) {
    const newDesc = DESC_FIXES[filename];
    const currentDesc = html.match(/<meta name="description" content="([^"]+)"/);
    if (currentDesc && currentDesc[1] !== newDesc) {
      html = html.replace(/<meta name="description" content="[^"]*"/, `<meta name="description" content="${newDesc}"`);
      html = html.replace(/<meta property="og:description" content="[^"]*"/, `<meta property="og:description" content="${newDesc}"`);
      html = html.replace(/<meta name="twitter:description" content="[^"]*"/, `<meta name="twitter:description" content="${newDesc}"`);
      changed = true;
      log.push('fixed description (' + newDesc.length + ' chars)');
    }
  }

  // 3. Date meta tags for guide pages
  if (GUIDE_PAGES.has(filename) && !html.includes('article:published_time')) {
    const headClose = html.indexOf('</head>');
    if (headClose > -1) {
      const dateMeta = `
    <meta property="article:published_time" content="2026-04-01T00:00:00+10:00">
    <meta property="article:modified_time" content="2026-05-02T00:00:00+10:00">`;
      html = html.slice(0, headClose) + dateMeta + '\n' + html.slice(headClose);
      changed = true;
      log.push('added date meta tags');
    }
  }

  // Now process JSON-LD schemas
  // Find all JSON-LD script blocks and their positions
  const schemaRegex = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g;
  let schemaMatches = [];
  let m;
  while ((m = schemaRegex.exec(html)) !== null) {
    schemaMatches.push({ fullMatch: m[0], content: m[1], index: m.index });
  }

  // Process the main schema block (first one, usually @graph or main LocalBusiness)
  let mainSchemaIdx = -1;
  let mainSchema = null;
  let usesGraph = false;

  for (let i = 0; i < schemaMatches.length; i++) {
    try {
      const obj = JSON.parse(schemaMatches[i].content.trim());
      if (obj['@graph']) {
        mainSchemaIdx = i;
        mainSchema = obj;
        usesGraph = true;
        break;
      }
      if (obj['@type'] && (Array.isArray(obj['@type']) ? obj['@type'].includes('LocalBusiness') : obj['@type'] === 'LocalBusiness' || obj['@type'].includes('LocalBusiness'))) {
        mainSchemaIdx = i;
        mainSchema = obj;
        usesGraph = false;
        break;
      }
    } catch (e) { /* skip */ }
  }

  if (mainSchema) {
    let schemaChanged = false;

    if (usesGraph) {
      const graph = mainSchema['@graph'];
      const lb = graph.find(item => {
        const t = Array.isArray(item['@type']) ? item['@type'] : [item['@type']];
        return t.includes('LocalBusiness') || t.includes('Plumber');
      });

      // 4. Add sameAs to LocalBusiness
      if (lb && !lb.sameAs) {
        lb.sameAs = SAME_AS;
        schemaChanged = true;
        log.push('added sameAs');
      }

      // 5. Add Service schema to @graph
      const hasService = graph.some(item => {
        const t = Array.isArray(item['@type']) ? item['@type'] : [item['@type']];
        return t.includes('Service');
      });

      if (!hasService && !NO_SERVICE.has(filename)) {
        const area = getAreaFromFilename(filename);
        const serviceSchema = {
          "@type": "Service",
          "name": getServiceName(html, filename),
          "provider": { "@type": "LocalBusiness", "name": "Filters For You" },
          "serviceType": "Water Filter Installation",
          "areaServed": { "@type": "City", "name": area },
          "description": getServiceDesc(html)
        };
        // Insert after LocalBusiness (at index 1)
        const lbIdx = graph.findIndex(item => {
          const t = Array.isArray(item['@type']) ? item['@type'] : [item['@type']];
          return t.includes('LocalBusiness') || t.includes('Plumber');
        });
        graph.splice(lbIdx + 1, 0, serviceSchema);
        schemaChanged = true;
        log.push('added Service schema');
      }
    } else {
      // Non-@graph (index.html style): add sameAs directly to LocalBusiness object
      if (!mainSchema.sameAs) {
        mainSchema.sameAs = SAME_AS;
        schemaChanged = true;
        log.push('added sameAs (non-graph)');
      }
    }

    if (schemaChanged) {
      // Serialize the updated schema (compact)
      const newSchemaContent = JSON.stringify(mainSchema);
      const oldBlock = schemaMatches[mainSchemaIdx].fullMatch;
      const newBlock = `<script type="application/ld+json">${newSchemaContent}</script>`;
      html = html.replace(oldBlock, newBlock);
      changed = true;
    }
  }

  // 6. Add Service schema to non-@graph index.html as separate script block
  if (filename === 'index.html' && !html.includes('"@type":"Service"') && !html.includes('"@type": "Service"')) {
    const serviceBlock = `<script type="application/ld+json">{"@context":"https://schema.org","@type":"Service","name":"Water Filter Installation Sydney","provider":{"@type":"LocalBusiness","name":"Filters For You"},"serviceType":"Water Filter Installation","areaServed":{"@type":"City","name":"Sydney"},"description":"Professional water filter installation service across Greater Sydney. Under sink, reverse osmosis and whole house water filter systems supplied and installed by Jean-Paul Barber, licensed plumber (Licence: 461511C). Fixed pricing from $550."}</script>`;
    const lastScriptClose = html.lastIndexOf('</script>');
    if (lastScriptClose > -1) {
      html = html.slice(0, lastScriptClose + 9) + '\n' + serviceBlock + html.slice(lastScriptClose + 9);
      changed = true;
      log.push('added Service schema to index (non-graph)');
    }
  }

  // 7. Add SpeakableSpecification (as separate script block after last </script>)
  if (SPEAKABLE_PAGES.has(filename) && !html.includes('SpeakableSpecification')) {
    const canonicalM = html.match(/<link rel="canonical" href="([^"]+)"/);
    const pageUrl = canonicalM ? canonicalM[1] : `https://filtersforyou.com.au/${filename.replace('.html','')}`;
    const speakableBlock = `<script type="application/ld+json">{"@context":"https://schema.org","@type":"WebPage","url":"${pageUrl}","speakable":{"@type":"SpeakableSpecification","cssSelector":["h1","h2",".faq-answer",".intro-text"]}}</script>`;
    // Insert before </head>
    const headClose = html.indexOf('</head>');
    if (headClose > -1) {
      html = html.slice(0, headClose) + speakableBlock + '\n' + html.slice(headClose);
      changed = true;
      log.push('added SpeakableSpecification');
    }
  }

  // 8. FAQPage schema for water-savings-calculator
  if (filename === 'water-savings-calculator.html' && !html.includes('"FAQPage"')) {
    const faqBlock = `<script type="application/ld+json">${JSON.stringify(CALCULATOR_FAQ_SCHEMA)}</script>`;
    const headClose = html.indexOf('</head>');
    if (headClose > -1) {
      html = html.slice(0, headClose) + faqBlock + '\n' + html.slice(headClose);
      changed = true;
      log.push('added FAQPage schema');
    }
  }

  if (changed) {
    fs.writeFileSync(filepath, html, 'utf8');
    console.log(`✅ ${filename}: ${log.join(', ')}`);
  }

  return changed;
}

// Get all HTML files
const files = fs.readdirSync(DIR)
  .filter(f => f.endsWith('.html') && !SKIP.has(f) && !f.startsWith('node_modules'));

console.log(`Processing ${files.length} HTML files...\n`);

let total = 0;
for (const f of files.sort()) {
  if (processFile(f)) total++;
}

console.log(`\nDone. Modified ${total}/${files.length} files.`);
