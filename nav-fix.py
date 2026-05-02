#!/usr/bin/env python3
"""
Nav fix: restore Online dot, match button sizes, correct order.
- Inserts <div class="online-dot-wrap"><div class="dot"></div>Online</div>
  between hamburger button and Get a Free Quote button in all HTML files.
- Normalises .nav-cta and .nav-cta-quote to font-size:15px; padding:11px 20px
- Ensures .dot and .online-dot-wrap CSS rules are present
"""
import re, os, glob

WEBSITE_DIR = '/Users/xtc/Desktop/FFY Agency Hub/Website'
HTML_FILES = sorted(glob.glob(os.path.join(WEBSITE_DIR, '*.html')))

ONLINE_DOT_HTML = '    <div class="online-dot-wrap"><div class="dot"></div>Online</div>\n'
NAV_CTA_QUOTE_ANCHOR = '    <a href="contact.html#quote" class="nav-cta-quote">'

DOT_CSS = '.dot{width:8px;height:8px;background:#22c55e;border-radius:50%;animation:blink 2s infinite;box-shadow:0 0 0 2px rgba(34,197,94,.2)}'
ONLINE_DOT_WRAP_CSS = '.online-dot-wrap{display:flex;align-items:center;gap:6px;font-size:15px;font-weight:600;color:#16a34a}'

updated = []
no_change = []
errors = []

for filepath in HTML_FILES:
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        original = content

        # 1. Add online-dot-wrap HTML before nav-cta-quote anchor
        if NAV_CTA_QUOTE_ANCHOR in content:
            if '<div class="online-dot-wrap">' not in content:
                content = content.replace(
                    NAV_CTA_QUOTE_ANCHOR,
                    ONLINE_DOT_HTML + NAV_CTA_QUOTE_ANCHOR,
                    1
                )

        # 2. Fix .nav-cta font-size and padding (exact block only, not :hover)
        def fix_nav_cta(m):
            block = m.group(0)
            block = re.sub(r'font-size:\d+px', 'font-size:15px', block)
            block = re.sub(r'padding:\d+px \d+px', 'padding:11px 20px', block)
            return block

        content = re.sub(r'\.nav-cta\{[^}]*\}', fix_nav_cta, content)

        # 3. Fix .nav-cta-quote font-size and padding (exact block only, not :hover)
        def fix_nav_cta_quote(m):
            block = m.group(0)
            block = re.sub(r'font-size:\d+px', 'font-size:15px', block)
            block = re.sub(r'padding:\d+px \d+px', 'padding:11px 20px', block)
            return block

        content = re.sub(r'\.nav-cta-quote\{[^}]*\}', fix_nav_cta_quote, content)

        # 4. Add .dot CSS if missing
        if '.dot{' not in content:
            content = content.replace('.nav-cta{', DOT_CSS + '\n.nav-cta{', 1)

        # 5. Add .online-dot-wrap CSS if missing
        if '.online-dot-wrap{' not in content:
            content = content.replace('.nav-cta{', ONLINE_DOT_WRAP_CSS + '\n.nav-cta{', 1)

        if content != original:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            updated.append(os.path.basename(filepath))
        else:
            no_change.append(os.path.basename(filepath))

    except Exception as exc:
        errors.append(f'{os.path.basename(filepath)}: {exc}')

print(f'\n✅ Updated  : {len(updated)} files')
print(f'⏭  No change: {len(no_change)} files')
if errors:
    print(f'\n❌ Errors ({len(errors)}):')
    for e in errors:
        print(f'   {e}')
print('\nUpdated files:')
for name in updated:
    print(f'  {name}')
