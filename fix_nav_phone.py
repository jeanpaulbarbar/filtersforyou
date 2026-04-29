#!/usr/bin/env python3
"""
Fix nav phone button wrapping on mobile.
Adds white-space:nowrap + mobile sizing to .nav-cta across all HTML files.
"""

import os
import glob

WEBSITE_DIR = os.path.expanduser("~/Desktop/FFY Agency Hub/Website")
html_files = glob.glob(os.path.join(WEBSITE_DIR, "*.html"))

# Pattern to find in base .nav-cta definition (without white-space:nowrap)
# We'll add white-space:nowrap to the existing definition

# The mobile nav-cta fix to inject into @media(max-width:900px) block
MOBILE_NAV_CTA_RULE = "  .nav-cta{white-space:nowrap;font-size:13px;padding:8px 12px}\n"

fixed_count = 0
skipped_count = 0

for filepath in sorted(html_files):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content
    changed = False

    # 1. Add white-space:nowrap to base .nav-cta definition if missing
    if '.nav-cta{' in content and 'white-space:nowrap' not in content.split('.nav-cta{')[1].split('}')[0]:
        # Insert white-space:nowrap before the closing } of .nav-cta{...}
        # Find the .nav-cta{ definition and add white-space:nowrap
        idx = content.find('.nav-cta{')
        end_idx = content.find('}', idx)
        if idx != -1 and end_idx != -1:
            content = content[:end_idx] + ';white-space:nowrap' + content[end_idx:]
            changed = True

    # 2. Add .nav-cta mobile rule inside @media(max-width:900px) block
    # Target the specific block in the dropdown-nav-css style
    TARGET_BLOCK = "@media(max-width:900px){\n  .nav-links{display:none!important}\n  .nav-hamburger{display:flex!important;order:99}\n  .mobile-nav{display:block}\n  .online-dot-wrap{display:none!important}\n}"
    
    if TARGET_BLOCK in content and MOBILE_NAV_CTA_RULE.strip() not in content:
        # Inject .nav-cta rule before closing } of this media block
        replacement = "@media(max-width:900px){\n  .nav-links{display:none!important}\n  .nav-hamburger{display:flex!important;order:99}\n  .mobile-nav{display:block}\n  .online-dot-wrap{display:none!important}\n" + MOBILE_NAV_CTA_RULE + "}"
        content = content.replace(TARGET_BLOCK, replacement)
        changed = True
    elif MOBILE_NAV_CTA_RULE.strip() in content:
        # Already has the rule, just make sure white-space is there
        pass

    if changed:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        fixed_count += 1
        print(f"  ✅ Fixed: {os.path.basename(filepath)}")
    else:
        skipped_count += 1
        print(f"  ⏭️  Skipped (already fixed or no match): {os.path.basename(filepath)}")

print(f"\nDone! Fixed: {fixed_count}, Skipped: {skipped_count}, Total: {len(html_files)}")
