#!/usr/bin/env python3
"""Update product card CTAs in water-filter-systems.html to link to product pages."""
import os
import re

BASEDIR = os.path.dirname(os.path.abspath(__file__))
file_path = os.path.join(BASEDIR, "water-filter-systems.html")

with open(file_path, 'r') as f:
    content = f.read()

product_map = [
    ("pure-essential", "pure-essential-water-filter-sydney.html"),
    ("pure-plus", "pure-plus-water-filter-sydney.html"),
    ("pure-premium", "pure-premium-water-filter-sydney.html"),
    ("pure-compact", "pure-compact-water-filter-sydney.html"),
    ("pure-advanced", "pure-advanced-water-filter-sydney.html"),
    ("pure-luxe", "pure-luxe-water-filter-sydney.html"),
    ("pure-home", "pure-home-water-filter-sydney.html"),
]

for card_id, page_href in product_map:
    start_marker = f'id="{card_id}"'
    start_idx = content.find(start_marker)
    if start_idx == -1:
        print(f"Not found: {card_id}")
        continue
    
    # Find the pcard-cta in this card section (look for next </div> after the CTA)
    cta_pattern = '<a href="tel:0430546749" class="pcard-cta">Get a Quote</a>'
    cta_idx = content.find(cta_pattern, start_idx)
    if cta_idx == -1:
        print(f"CTA not found for: {card_id}")
        continue
    
    # Make sure it's within this card (not next card)
    next_card_idx = content.find('class="pcard', start_idx + len(start_marker))
    if cta_idx > next_card_idx and next_card_idx != -1:
        print(f"CTA too far for: {card_id}")
        continue
    
    new_cta = f'<a href="{page_href}" class="pcard-cta">View System</a>'
    content = content[:cta_idx] + new_cta + content[cta_idx + len(cta_pattern):]
    print(f"Updated: {card_id} -> {page_href}")

with open(file_path, 'w') as f:
    f.write(content)

print("Done!")
