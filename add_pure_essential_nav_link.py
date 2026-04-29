#!/usr/bin/env python3
"""
Add Pure Essential link to the Systems dropdown nav on all existing HTML pages.

Strategy: Anchor to the "Under Sink Water Filter" nav link that exists in every page.
Insert the Pure Essential link after it, in both desktop dropdown and mobile nav.
Idempotent — skips files that already contain the link.
"""

import os
import glob
import re

WEBSITE_DIR = os.path.expanduser("~/Desktop/FFY Agency Hub/Website/")
HTML_FILES = sorted(glob.glob(os.path.join(WEBSITE_DIR, "*.html")))

# Skip the Pure Essential page itself (it already has it)
SKIP_SELF = "pure-essential-water-filter-sydney.html"

# --- Desktop dropdown ---
# Matches: <a href="under-sink-water-filter-sydney.html">Under Sink Water Filter</a>
# Inserts Pure Essential link after it
DESKTOP_PATTERN = re.compile(
    r'^( +)<a href="under-sink-water-filter-sydney\.html">Under Sink Water Filter</a>$',
    re.MULTILINE
)

def desktop_replacement(m):
    indent = m.group(1)
    return (
        f'{indent}<a href="under-sink-water-filter-sydney.html">Under Sink Water Filter</a>\n'
        f'{indent}<a href="pure-essential-water-filter-sydney.html">Pure Essential Filter</a>'
    )

# --- Mobile nav ---
# Same pattern but in mobile-section-links
# The pattern is identical in structure so reuse DESKTOP_PATTERN above.

updated = []
skipped = []

for filepath in sorted(HTML_FILES):
    filename = os.path.basename(filepath)

    if filename == SKIP_SELF:
        skipped.append(f"SKIP (self): {filename}")
        continue

    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    # Idempotency check
    if 'href="pure-essential-water-filter-sydney.html"' in content:
        skipped.append(f"SKIP (already has link): {filename}")
        continue

    # Check pattern exists
    if not DESKTOP_PATTERN.search(content):
        skipped.append(f"SKIP (pattern not found): {filename}")
        continue

    original = content
    # This handles both desktop dropdown and mobile nav in one pass
    # (pattern matches both because indent varies)
    new_content = DESKTOP_PATTERN.sub(desktop_replacement, content)

    if new_content != original:
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(new_content)
        count = new_content.count('href="pure-essential-water-filter-sydney.html"')
        updated.append(f"{filename} ({count} insertion{'s' if count != 1 else ''})")
    else:
        skipped.append(f"SKIP (no change after sub): {filename}")

print(f"\n✅ Updated {len(updated)} files:")
for f in updated:
    print(f"   {f}")

print(f"\n⚠️  Skipped {len(skipped)} files:")
for f in skipped:
    print(f"   {f}")
