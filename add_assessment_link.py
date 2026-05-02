#!/usr/bin/env python3
import os
import re
from pathlib import Path

website_dir = Path('/Users/xtc/Desktop/FFY Agency Hub/Website')
html_files = list(website_dir.glob('*.html'))

# Pattern to find the Resources dropdown section
pattern = r'(<div class="dropdown">\s*<a href="how-water-filters-work\.html">How Water Filters Work</a>)'

replacement = r'<div class="dropdown">\n          <a href="free-assessment.html">Free Water Assessment</a>\n          <a href="how-water-filters-work.html">How Water Filters Work</a>'

updated_count = 0
skip_count = 0

for html_file in sorted(html_files):
    with open(html_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check if file already has the free-assessment link
    if 'href="free-assessment.html"' in content:
        skip_count += 1
        continue
    
    # Replace using the pattern
    new_content = re.sub(pattern, replacement, content)
    
    if new_content != content:
        with open(html_file, 'w', encoding='utf-8') as f:
            f.write(new_content)
        updated_count += 1
        print(f"✓ Updated: {html_file.name}")
    else:
        print(f"  No dropdown found: {html_file.name}")

print(f"\n✓ Updated {updated_count} files")
print(f"⊘ Skipped {skip_count} files (already have link)")
print(f"Total HTML files: {len(html_files)}")
