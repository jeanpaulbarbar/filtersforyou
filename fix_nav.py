#!/usr/bin/env python3
"""
Fix nav across all FFY HTML files:
1. Move "All Water Filter Systems" to FIRST in the Systems dropdown
2. Ensure .nav has position:sticky;top:0;z-index:1000 (upgrade from z-index:100 to 1000 for robustness)
"""

import os
import re
import glob

WEBSITE_DIR = os.path.expanduser("~/Desktop/FFY Agency Hub/Website")
html_files = glob.glob(os.path.join(WEBSITE_DIR, "*.html"))

changes_by_file = {}

for filepath in sorted(html_files):
    filename = os.path.basename(filepath)
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original = content
    file_changes = []

    # ── Fix 1: Move "All Water Filter Systems" to TOP of Systems dropdown ──
    # The Systems dropdown always starts with:
    #   <div class="dropdown">
    # followed by several <a> tags, with "All Water Filter Systems" somewhere inside.
    # We need it FIRST.
    
    # Pattern: find the Systems dropdown block and reorder
    # The dropdown starts after the Systems button and ends at </div>
    # We'll find the specific dropdown block and reorder its links
    
    def move_all_water_filter_to_top(text):
        """
        Find the first .dropdown div (Systems dropdown) and move 
        the All Water Filter Systems link to be first.
        """
        # Find the first dropdown div content (Systems dropdown)
        # It's always the first <div class="dropdown"> in the nav
        
        # Pattern to match the Systems dropdown (first dropdown, not dropdown-2col)
        # Match from <div class="dropdown"> to </div> (greedy but minimal)
        pattern = r'(<div class="dropdown">)((?:\s*<a [^>]*>[^<]*</a>)*\s*)(</div>)'
        
        matches = list(re.finditer(pattern, text))
        if not matches:
            return text, False
        
        # First match is the Systems dropdown
        m = matches[0]
        dropdown_content = m.group(2)
        
        # Find "All Water Filter Systems" link (with or without class="active")
        all_filter_pattern = r'\s*<a href="water-filter-systems\.html"(?:\s+class="active")?>[^<]*All Water Filter Systems[^<]*</a>'
        
        aff_match = re.search(all_filter_pattern, dropdown_content)
        if not aff_match:
            return text, False
        
        aff_link = aff_match.group(0)
        
        # Check if it's already first
        stripped = dropdown_content.lstrip()
        if stripped.startswith('<a href="water-filter-systems.html"'):
            return text, False  # Already first
        
        # Remove the All Water Filter Systems link from its current position
        new_content = re.sub(all_filter_pattern, '', dropdown_content)
        
        # Prepend it at the top (after the opening div tag)
        # Add proper indentation
        new_dropdown_content = aff_link + new_content
        
        new_text = text[:m.start()] + m.group(1) + new_dropdown_content + m.group(3) + text[m.end():]
        return new_text, True

    content, changed = move_all_water_filter_to_top(content)
    if changed:
        file_changes.append("Moved 'All Water Filter Systems' to top of Systems dropdown")

    # ── Fix 2: Ensure .nav has z-index:1000 (upgrade from 100 if needed) ──
    # The reference already has position:sticky;top:0;z-index:100
    # Upgrade to z-index:1000 for robustness across all pages
    if 'z-index:100;box-shadow' in content:
        content = content.replace('z-index:100;box-shadow', 'z-index:1000;box-shadow')
        file_changes.append("Upgraded .nav z-index from 100 to 1000")

    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        changes_by_file[filename] = file_changes

print(f"\n{'='*60}")
print(f"FFY Nav Fix Summary")
print(f"{'='*60}")
print(f"Total HTML files: {len(html_files)}")
print(f"Files modified: {len(changes_by_file)}")
print()

for fname, changes in sorted(changes_by_file.items()):
    print(f"  ✅ {fname}")
    for c in changes:
        print(f"     • {c}")

# Verify
print(f"\n{'='*60}")
print("Verification Check")
print(f"{'='*60}")

issues = []
for filepath in sorted(html_files):
    filename = os.path.basename(filepath)
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check All Water Filter Systems is first in dropdown
    m = re.search(r'<div class="dropdown">\s*(<a [^>]*>)', content)
    if m:
        first_link = m.group(1)
        if 'water-filter-systems.html' not in first_link:
            issues.append(f"  ❌ {filename}: All Water Filter Systems NOT first (first link: {first_link[:60]})")
    
    # Check sticky nav
    if 'position:sticky;top:0' not in content:
        issues.append(f"  ❌ {filename}: Missing sticky nav")

if issues:
    print("ISSUES FOUND:")
    for issue in issues:
        print(issue)
else:
    print("✅ All checks passed!")
    print(f"   • All Water Filter Systems is FIRST in Systems dropdown on all pages")
    print(f"   • All pages have sticky nav")
