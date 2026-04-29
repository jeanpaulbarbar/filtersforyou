#!/usr/bin/env python3
"""Add water-filter-systems.html to the Systems dropdown nav on all HTML pages.

Strategy: use regex anchored to line-start/end to avoid substring matching issues
between 8-space (mobile) and 10-space (desktop) indent patterns.
Appends the new link after the last item in the Systems dropdown.
"""

import os
import glob
import re

WEBSITE_DIR = os.path.expanduser("~/Desktop/FFY Agency Hub/Website/")
HTML_FILES = glob.glob(os.path.join(WEBSITE_DIR, "*.html"))

# Single regex that matches the cost-guide line with either 8 or 10 leading spaces.
# Captures the indent so we can preserve it in the replacement.
# ^ and $ anchored with re.MULTILINE ensures exact line match (no substring hits).
PATTERN = re.compile(
    r'^( +)<a href="sydney-water-filter-cost-guide\.html">Water Filter Pricing Guide</a>$',
    re.MULTILINE
)

def replacement(m):
    indent = m.group(1)
    return (
        f'{indent}<a href="sydney-water-filter-cost-guide.html">Water Filter Pricing Guide</a>\n'
        f'{indent}<a href="water-filter-systems.html">All Water Filter Systems</a>'
    )

updated = []
skipped = []

for filepath in sorted(HTML_FILES):
    filename = os.path.basename(filepath)

    # Skip the page itself
    if filename == "water-filter-systems.html":
        skipped.append(f"SKIP (self): {filename}")
        continue

    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    # Idempotency check
    if 'href="water-filter-systems.html"' in content:
        skipped.append(f"SKIP (already has link): {filename}")
        continue

    original = content

    # Check that the pattern exists before modifying
    if not PATTERN.search(content):
        skipped.append(f"SKIP (pattern not found): {filename}")
        continue

    new_content = PATTERN.sub(replacement, content)

    if new_content != original:
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(new_content)
        count = new_content.count('href="water-filter-systems.html"')
        updated.append(f"{filename} ({count} insertion{'s' if count!=1 else ''})")
    else:
        skipped.append(f"SKIP (no change after sub): {filename}")

print(f"\n✅ Updated {len(updated)} files:")
for f in updated:
    print(f"   {f}")

print(f"\n⚠️  Skipped {len(skipped)} files:")
for f in skipped:
    print(f"   {f}")
