#!/usr/bin/env python3
"""Remove breadcrumb HTML and CSS from all pages."""
import re
import glob
import os

HTML_DIR = os.path.dirname(os.path.abspath(__file__))


def remove_breadcrumbs(text):
    # --- CSS removal ---

    # Remove CSS comment
    text = re.sub(r'[ \t]*/\* BREADCRUMB \*/[ \t]*\n?', '', text)

    # Remove .breadcrumb CSS rules (handles minified or expanded lines)
    # Most specific first
    text = re.sub(r'\.breadcrumb a:hover\{[^}]*\}', '', text)
    text = re.sub(r'\.breadcrumb a\{[^}]*\}', '', text)
    text = re.sub(r'\.breadcrumb\{[^}]*\}', '', text)

    # Remove .page-breadcrumb CSS rules (used on terms/policy pages)
    text = re.sub(r'\.page-breadcrumb span\{[^}]*\}', '', text)
    text = re.sub(r'\.page-breadcrumb a:hover\{[^}]*\}', '', text)
    text = re.sub(r'\.page-breadcrumb a\{[^}]*\}', '', text)
    text = re.sub(r'\.page-breadcrumb\{[^}]*\}', '', text)

    # --- HTML removal ---

    # Remove HTML comment
    text = re.sub(r'<!-- BREADCRUMB -->\n?', '', text)

    # Remove breadcrumb div (single-line or multi-line, no nested divs)
    text = re.sub(r'<div class="breadcrumb">.*?</div>\n?', '', text, flags=re.DOTALL)

    # Remove breadcrumb nav element
    text = re.sub(r'<nav class="breadcrumb"[^>]*>.*?</nav>\n?', '', text, flags=re.DOTALL)

    # Remove page-breadcrumb div
    text = re.sub(r'<div class="page-breadcrumb">.*?</div>\n?', '', text, flags=re.DOTALL)

    return text


files = sorted(glob.glob(os.path.join(HTML_DIR, '*.html')))
changed = 0
unchanged = 0

for path in files:
    with open(path, 'r', encoding='utf-8') as f:
        original = f.read()

    text = remove_breadcrumbs(original)

    if text != original:
        with open(path, 'w', encoding='utf-8') as f:
            f.write(text)
        changed += 1
        print(f'  CLEANED: {os.path.basename(path)}')
    else:
        unchanged += 1

print(f'\nDone. {changed} files cleaned, {unchanged} files unchanged.')
