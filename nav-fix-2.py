#!/usr/bin/env python3
"""Fix nav header across all 121 HTML pages.

Desired nav actions (after hamburger, before closing </div></nav>):
  <div class="online-dot-wrap"><div class="dot"></div>Online</div>
  <a href="contact.html" class="nav-cta-quote">Get a Free Quote</a>
  <a href="tel:0430546749" class="nav-cta">...</a>
"""
import re
import os
import glob

HTML_DIR = '/Users/xtc/Desktop/FFY Agency Hub/Website'

# Correct CSS blocks
CSS_ONLINE_DOT_WRAP = '.online-dot-wrap{display:flex;align-items:center;gap:6px;font-size:15px;font-weight:600;color:#16a34a}'
CSS_DOT = '.dot{width:8px;height:8px;background:#22c55e;border-radius:50%;animation:blink 2s infinite;box-shadow:0 0 0 2px rgba(34,197,94,.2)}'
CSS_BLINK = '@keyframes blink{0%,100%{box-shadow:0 0 0 2px rgba(34,197,94,.2)}50%{box-shadow:0 0 0 5px rgba(34,197,94,.08)}}'
CSS_NAV_CTA_QUOTE = '.nav-cta-quote{display:flex;align-items:center;background:#EAAF00;color:#1a2235;font-weight:700;font-size:15px;padding:11px 20px;border-radius:8px;transition:background .2s,transform .2s;white-space:nowrap;text-decoration:none;-webkit-tap-highlight-color:transparent}'
CSS_NAV_CTA_QUOTE_HOVER = '.nav-cta-quote:hover{background:#d4990a;transform:translateY(-1px)}'
CSS_MOBILE_HIDE = '@media(max-width:900px){.nav-cta-quote{display:none}.online-dot-wrap{display:none}}'

processed = 0
skipped = 0
unchanged = 0

html_files = sorted(glob.glob(os.path.join(HTML_DIR, '*.html')))
print(f"Found {len(html_files)} HTML files")

for filepath in html_files:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content
    filename = os.path.basename(filepath)

    # Skip redirect-only pages (no nav-hamburger HTML element)
    if '<button class="nav-hamburger"' not in content:
        print(f"  SKIP (no nav): {filename}")
        skipped += 1
        continue

    # =========================================================
    # 1. Fix the nav actions area HTML
    # =========================================================
    # Pattern: hamburger button block → [anything] → phone link opening tag
    nav_section_pattern = re.compile(
        r'(<button class="nav-hamburger"[^>]*>[\s\S]*?</button>)'
        r'[\s\S]*?'
        r'(<a href="tel:0430546749" class="nav-cta">)',
        re.MULTILINE
    )

    def fix_nav_actions(m):
        hamburger = m.group(1)
        phone_open = m.group(2)
        return (
            hamburger + '\n'
            '    <div class="online-dot-wrap"><div class="dot"></div>Online</div>\n'
            '    <a href="contact.html" class="nav-cta-quote">Get a Free Quote</a>\n'
            '    ' + phone_open
        )

    content = nav_section_pattern.sub(fix_nav_actions, content, count=1)

    # =========================================================
    # 2. Remove "Get a Free Quote" <li> from nav-links (if any)
    # =========================================================
    li_gfq = re.compile(r'\s*<li>\s*<a[^>]*>\s*Get a Free Quote\s*</a>\s*</li>', re.IGNORECASE)
    content = li_gfq.sub('', content)

    # =========================================================
    # 3. Fix .nav-cta-quote CSS block (replace entire block)
    # =========================================================
    nav_cta_quote_css = re.compile(r'\.nav-cta-quote\{[^}]+\}')
    if nav_cta_quote_css.search(content):
        content = nav_cta_quote_css.sub(CSS_NAV_CTA_QUOTE, content, count=1)
    else:
        # Add before </style>
        content = content.replace('</style>', CSS_NAV_CTA_QUOTE + '\n</style>', 1)

    # Fix .nav-cta-quote:hover
    nav_cta_quote_hover_css = re.compile(r'\.nav-cta-quote:hover\{[^}]+\}')
    if nav_cta_quote_hover_css.search(content):
        content = nav_cta_quote_hover_css.sub(CSS_NAV_CTA_QUOTE_HOVER, content, count=1)
    else:
        content = content.replace('</style>', CSS_NAV_CTA_QUOTE_HOVER + '\n</style>', 1)

    # =========================================================
    # 4. Fix .nav-cta CSS — ensure font-size:15px, padding:11px 20px
    # =========================================================
    def fix_nav_cta_block(m):
        block = m.group(0)
        block = re.sub(r'font-size:\d+px', 'font-size:15px', block)
        # Fix padding if it's not already 11px 20px
        block = re.sub(r'padding:\d+px \d+px', 'padding:11px 20px', block)
        return block

    nav_cta_css_pattern = re.compile(r'\.nav-cta\{[^}]+\}')
    content = nav_cta_css_pattern.sub(fix_nav_cta_block, content, count=1)

    # Also fix .nav-cta in media queries (e.g. @media(max-width:900px){...nav-cta...})
    def fix_nav_cta_media(m):
        block = m.group(0)
        block = re.sub(r'(\.nav-cta\{[^}]*)font-size:\d+px', r'\1font-size:15px', block)
        block = re.sub(r'(\.nav-cta\{[^}]*)padding:\d+px \d+px', r'\1padding:11px 20px', block)
        return block
    # (handled by the general fix above for now)

    # =========================================================
    # 5. Ensure .online-dot-wrap CSS exists
    # =========================================================
    if '.online-dot-wrap{' not in content:
        content = content.replace('</style>', CSS_ONLINE_DOT_WRAP + '\n</style>', 1)
    else:
        # Replace existing to ensure correct values
        content = re.sub(r'\.online-dot-wrap\{[^}]+\}', CSS_ONLINE_DOT_WRAP, content, count=1)

    # =========================================================
    # 6. Ensure .dot CSS exists
    # =========================================================
    if re.search(r'^\.dot\{', content, re.MULTILINE) is None and '\n.dot{' not in content:
        content = content.replace('</style>', CSS_DOT + '\n</style>', 1)

    # =========================================================
    # 7. Ensure @keyframes blink exists
    # =========================================================
    if '@keyframes blink' not in content:
        content = content.replace('</style>', CSS_BLINK + '\n</style>', 1)

    # =========================================================
    # 8. Ensure mobile media query hides nav-cta-quote + online-dot-wrap
    # =========================================================
    # Check if there's already a media query that hides nav-cta-quote
    if 'nav-cta-quote{display:none}' not in content:
        content = content.replace('</style>', CSS_MOBILE_HIDE + '\n</style>', 1)
    else:
        # Make sure online-dot-wrap is also hidden in the same media query
        existing_mobile = re.search(r'@media\(max-width:900px\)\{[^}]*nav-cta-quote\{display:none\}[^}]*\}', content)
        if existing_mobile and '.online-dot-wrap{display:none}' not in existing_mobile.group(0):
            # Replace with version that includes both
            old = existing_mobile.group(0)
            new = old.replace('nav-cta-quote{display:none}', 'nav-cta-quote{display:none}.online-dot-wrap{display:none}')
            content = content.replace(old, new, 1)

    # =========================================================
    # Write if changed
    # =========================================================
    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        processed += 1
        print(f"  FIXED: {filename}")
    else:
        unchanged += 1
        print(f"  OK: {filename}")

print(f"\nDone. Fixed: {processed}, Skipped: {skipped}, Unchanged: {unchanged}, Total: {len(html_files)}")
