#!/usr/bin/env python3
"""Update product card CTAs in water-filter-systems.html to link to product pages."""
import os

BASEDIR = os.path.dirname(os.path.abspath(__file__))

file_path = os.path.join(BASEDIR, "water-filter-systems.html")
with open(file_path, 'r') as f:
    content = f.read()

# Map product IDs to their page links
replacements = [
    # Pure Essential - after id="pure-essential" section
    (
        '<!-- 1. PURE ESSENTIAL -->\n      <div class="pcard" id="pure-essential">',
        '<!-- 1. PURE ESSENTIAL -->\n      <div class="pcard" id="pure-essential"><a href="pure-essential-water-filter-sydney.html" style="display:none"></a>'
    ),
]

# More targeted: update each pcard-cta per product
# Pure Essential CTA
content = content.replace(
    'id="pure-essential">\n        <div class="pcard-img">\n          <img src="/assets/brochure/pure-essential.jpg"',
    'id="pure-essential">\n        <a href="pure-essential-water-filter-sydney.html" style="display:block;position:absolute;inset:0;z-index:1"></a>\n        <div class="pcard-img">\n          <img src="/assets/brochure/pure-essential.jpg"'
)

# Just update the CTA links directly - simpler approach
product_ctamap = [
    # (unique context string, new href)
    ('id="pure-essential"', 'pure-essential-water-filter-sydney.html'),
    ('id="pure-plus"', 'pure-plus-water-filter-sydney.html'),
    ('id="pure-premium"', 'pure-premium-water-filter-sydney.html'),
    ('id="pure-compact"', 'pure-compact-water-filter-sydney.html'),
    ('id="pure-advanced"', 'pure-advanced-water-filter-sydney.html'),
    ('id="pure-luxe"', 'pure-luxe-water-filter-sydney.html'),
    ('id="pure-home"', 'pure-home-water-filter-sydney.html'),
]

# Re-read fresh
with open(file_path, 'r') as f:
    content = f.read()

# For each product card, find it and update the CTA
import re

def update_card_cta(content, card_id, page_href):
    """Find the pcard section and update its pcard-cta href."""
    # Find the card start
    start_marker = f'id="{card_id}"'
    start_idx = content.find(start_marker)
    if start_idx == -1:
        print(f"  Not found: {card_id}")
        return content
    
    # Find the next pcard-cta after this position
    cta_search = 'class="pcard-cta"'
    cta_idx = content.find(cta_search, start_idx)
    if cta_idx == -1:
        print(f"  No CTA found for: {card_id}")
        return content
    
    # Find the href before pcard-cta (it's on the same <a> tag)
    # Look backwards from cta_idx to find the opening <a
    tag_start = content.rfind('<a ', 0, cta_idx)
    tag_end = content.find('>', cta_idx) + 1
    
    old_tag = content[tag_start:tag_end]
    new_tag = re.sub(r'href="[^"]*"', f'href="{page_href}"', old_tag)
    
    if old_tag != new_tag:
        content = content[:tag_start] + new_tag + content[tag_end:]
        print(f"  Updated CTA for {card_id} -> {page_href}")
    else:
        print(f"  No change for {card_id}")
    
    return content

for card_id, page_href in product_ctamap:
    content = update_card_cta(content, card_id, page_href)

with open(file_path, 'w') as f:
    f.write(content)

print(f"\nDone updating {file_path}")
