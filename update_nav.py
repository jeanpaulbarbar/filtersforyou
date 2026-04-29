#!/usr/bin/env python3
"""Update nav dropdown and mobile nav in all existing HTML files to include new product pages."""
import os
import glob

BASEDIR = os.path.dirname(os.path.abspath(__file__))

# The old dropdown pattern (desktop nav) - replace this block
OLD_DESKTOP = '''          <a href="under-sink-water-filter-sydney.html">Under Sink Water Filter</a>
          <a href="pure-essential-water-filter-sydney.html">Pure Essential Filter</a>
          <a href="whole-house-water-filter-sydney.html">Whole House Water Filter</a>
          <a href="reverse-osmosis-water-filter-sydney.html">Reverse Osmosis System</a>
          <a href="inline-fridge-water-filter-sydney.html">Inline Fridge Filter</a>
          <a href="best-water-filter-sydney.html">Best Water Filter Sydney</a>
          <a href="sydney-water-filter-cost-guide.html">Water Filter Pricing Guide</a>'''

NEW_DESKTOP = '''          <a href="under-sink-water-filter-sydney.html">Under Sink Water Filter</a>
          <a href="pure-essential-water-filter-sydney.html">Pure Essential — $550</a>
          <a href="pure-plus-water-filter-sydney.html">Pure Plus+ — $840</a>
          <a href="pure-compact-water-filter-sydney.html">Pure Compact — $930</a>
          <a href="pure-premium-water-filter-sydney.html">Pure Premium — $1,180</a>
          <a href="pure-advanced-water-filter-sydney.html">Pure Advanced — $1,280</a>
          <a href="pure-luxe-water-filter-sydney.html">Pure Luxe — $1,740</a>
          <a href="pure-home-water-filter-sydney.html">Pure Home — $3,150</a>
          <a href="whole-house-water-filter-sydney.html">Whole House Water Filter</a>
          <a href="reverse-osmosis-water-filter-sydney.html">Reverse Osmosis System</a>
          <a href="inline-fridge-water-filter-sydney.html">Inline Fridge Filter</a>
          <a href="best-water-filter-sydney.html">Best Water Filter Sydney</a>
          <a href="sydney-water-filter-cost-guide.html">Water Filter Pricing Guide</a>'''

# Old mobile nav systems links
OLD_MOBILE = '''        <a href="under-sink-water-filter-sydney.html">Under Sink Water Filter</a>
        <a href="pure-essential-water-filter-sydney.html">Pure Essential Filter</a>
        <a href="whole-house-water-filter-sydney.html">Whole House Water Filter</a>
        <a href="reverse-osmosis-water-filter-sydney.html">Reverse Osmosis System</a>
        <a href="inline-fridge-water-filter-sydney.html">Inline Fridge Filter</a>
        <a href="best-water-filter-sydney.html">Best Water Filter Sydney</a>
        <a href="sydney-water-filter-cost-guide.html">Water Filter Pricing Guide</a>'''

NEW_MOBILE = '''        <a href="under-sink-water-filter-sydney.html">Under Sink Water Filter</a>
        <a href="pure-essential-water-filter-sydney.html">Pure Essential — $550</a>
        <a href="pure-plus-water-filter-sydney.html">Pure Plus+ — $840</a>
        <a href="pure-compact-water-filter-sydney.html">Pure Compact — $930</a>
        <a href="pure-premium-water-filter-sydney.html">Pure Premium — $1,180</a>
        <a href="pure-advanced-water-filter-sydney.html">Pure Advanced — $1,280</a>
        <a href="pure-luxe-water-filter-sydney.html">Pure Luxe — $1,740</a>
        <a href="pure-home-water-filter-sydney.html">Pure Home — $3,150</a>
        <a href="whole-house-water-filter-sydney.html">Whole House Water Filter</a>
        <a href="reverse-osmosis-water-filter-sydney.html">Reverse Osmosis System</a>
        <a href="inline-fridge-water-filter-sydney.html">Inline Fridge Filter</a>
        <a href="best-water-filter-sydney.html">Best Water Filter Sydney</a>
        <a href="sydney-water-filter-cost-guide.html">Water Filter Pricing Guide</a>'''

# Skip the new pages we just built (they already have the new nav)
SKIP_PAGES = {
    "pure-plus-water-filter-sydney.html",
    "pure-premium-water-filter-sydney.html",
    "pure-compact-water-filter-sydney.html",
    "pure-advanced-water-filter-sydney.html",
    "pure-luxe-water-filter-sydney.html",
    "pure-home-water-filter-sydney.html",
    "generate_pages.py",
    "update_nav.py",
}

updated = 0
skipped = 0
no_match = 0

for filepath in sorted(glob.glob(os.path.join(BASEDIR, "*.html"))):
    filename = os.path.basename(filepath)
    if filename in SKIP_PAGES:
        skipped += 1
        continue
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original = content
    
    # Replace desktop nav
    if OLD_DESKTOP in content:
        content = content.replace(OLD_DESKTOP, NEW_DESKTOP)
    
    # Replace mobile nav
    if OLD_MOBILE in content:
        content = content.replace(OLD_MOBILE, NEW_MOBILE)
    
    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        updated += 1
        print(f"Updated: {filename}")
    else:
        no_match += 1

print(f"\nDone. Updated: {updated} | Skipped: {skipped} | No match: {no_match}")
