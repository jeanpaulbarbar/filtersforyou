#!/usr/bin/env python3
"""
Nav update script for Filters For You website.
Handles 4 nav template variants across all pages.
"""
import os
import glob

WEBSITE_DIR = '/Users/xtc/Desktop/FFY Agency Hub/Website'
SKIP_FILES = {'shower-filter-installation-sydney.html', 'update_nav.py'}


def in_nav(content, href):
    """Check if href already exists in the main nav section (before </nav>)."""
    nav_end = content.find('</nav>')
    if nav_end == -1:
        nav_end = 6000  # fallback
    nav_section = content[:nav_end]
    return f'href="{href}"' in nav_section


def update_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content

    # ================================================================
    # GROUP A: Standard nav — .html links, nav-link-btn class, 2-col
    # ================================================================

    # A1: Desktop Systems — add Alkaline + Cartridge after Pure Compact (col 2)
    a1_old = (
        '            <a href="pure-compact-water-filter-sydney.html">Pure Compact</a>\n'
        '          </div>\n'
        '        </div>\n'
        '      </li>\n'
        '      <li class="nav-item has-dropdown">\n'
        '        <button class="nav-link-btn" aria-haspopup="true" aria-expanded="false">Locations'
    )
    a1_new = (
        '            <a href="pure-compact-water-filter-sydney.html">Pure Compact</a>\n'
        '            <a href="alkaline-water-filter-sydney.html">Alkaline Water Filter</a>\n'
        '            <a href="water-filter-cartridge-replacement-sydney.html">Cartridge Replacement</a>\n'
        '          </div>\n'
        '        </div>\n'
        '      </li>\n'
        '      <li class="nav-item has-dropdown">\n'
        '        <button class="nav-link-btn" aria-haspopup="true" aria-expanded="false">Locations'
    )
    if a1_old in content:
        content = content.replace(a1_old, a1_new)

    # A2: Desktop Resources — add 5 new items after Best Water Filter Sydney
    a2_old = (
        '          <a href="best-water-filter-sydney.html">Best Water Filter Sydney</a>\n'
        '        </div>\n'
        '      </li>\n'
        '      <li class="nav-item has-dropdown">\n'
        '        <button class="nav-link-btn" aria-haspopup="true" aria-expanded="false">Company'
    )
    res_pairs_a = [
        ('how-to-choose-water-filter-sydney.html', 'How to Choose a Water Filter'),
        ('reverse-osmosis-vs-whole-house-water-filter-sydney.html', 'RO vs Whole House'),
        ('water-filter-brand-comparison-sydney.html', 'Brand Comparison'),
        ('fluoride-in-sydney-water.html', 'Fluoride in Sydney Water'),
        ('what-is-in-sydney-water.html', "What's in Sydney Water?"),
    ]
    if a2_old in content:
        a2_new_items = []
        for href, label in res_pairs_a:
            if not in_nav(content, href):
                a2_new_items.append(f'          <a href="{href}">{label}</a>')
        if a2_new_items:
            a2_new = (
                '          <a href="best-water-filter-sydney.html">Best Water Filter Sydney</a>\n'
                + '\n'.join(a2_new_items) + '\n'
                '        </div>\n'
                '      </li>\n'
                '      <li class="nav-item has-dropdown">\n'
                '        <button class="nav-link-btn" aria-haspopup="true" aria-expanded="false">Company'
            )
            content = content.replace(a2_old, a2_new)

    # A3: Reviews link — Desktop Company + Mobile plain links
    content = content.replace(
        '<a href="index.html#reviews">Reviews</a>',
        '<a href="reviews-testimonials.html">Reviews &amp; Testimonials</a>'
    )

    # A4: Mobile Systems — add Alkaline + Cartridge after Pure Compact
    a4_old = (
        '        <a href="pure-compact-water-filter-sydney.html">Pure Compact</a>\n'
        '      </div>\n'
        '    </div>\n'
        '    <div class="mobile-section">\n'
        '      <button class="mobile-section-btn">Locations'
    )
    a4_new = (
        '        <a href="pure-compact-water-filter-sydney.html">Pure Compact</a>\n'
        '        <a href="alkaline-water-filter-sydney.html">Alkaline Water Filter</a>\n'
        '        <a href="water-filter-cartridge-replacement-sydney.html">Cartridge Replacement</a>\n'
        '      </div>\n'
        '    </div>\n'
        '    <div class="mobile-section">\n'
        '      <button class="mobile-section-btn">Locations'
    )
    if a4_old in content:
        content = content.replace(a4_old, a4_new)

    # A5: Mobile Resources — add 5 new items after Best Water Filter Sydney
    a5_old = (
        '        <a href="best-water-filter-sydney.html">Best Water Filter Sydney</a>\n'
        '      </div>\n'
        '    </div>\n'
        '    <div class="mobile-section">'
    )
    if a5_old in content:
        a5_new_items = []
        for href, label in res_pairs_a:
            if not in_nav(content, href):
                a5_new_items.append(f'        <a href="{href}">{label}</a>')
        if a5_new_items:
            a5_new = (
                '        <a href="best-water-filter-sydney.html">Best Water Filter Sydney</a>\n'
                + '\n'.join(a5_new_items) + '\n'
                '      </div>\n'
                '    </div>\n'
                '    <div class="mobile-section">'
            )
            content = content.replace(a5_old, a5_new)

    # ================================================================
    # GROUP B: Newer nav — root-relative paths, similar structure
    # ================================================================

    # B1: Desktop Systems — add Alkaline + Cartridge after Pure Compact
    b1_old = (
        '            <a href="/pure-compact-water-filter-sydney">Pure Compact</a>\n'
        '          </div>\n'
        '        </div>\n'
        '      </li>\n'
        '      <li class="nav-item has-dropdown">\n'
        '        <button class="nav-link-btn" aria-haspopup="true" aria-expanded="false">Locations'
    )
    b1_new = (
        '            <a href="/pure-compact-water-filter-sydney">Pure Compact</a>\n'
        '            <a href="/alkaline-water-filter-sydney">Alkaline Water Filter</a>\n'
        '            <a href="/water-filter-cartridge-replacement-sydney">Cartridge Replacement</a>\n'
        '          </div>\n'
        '        </div>\n'
        '      </li>\n'
        '      <li class="nav-item has-dropdown">\n'
        '        <button class="nav-link-btn" aria-haspopup="true" aria-expanded="false">Locations'
    )
    if b1_old in content:
        content = content.replace(b1_old, b1_new)

    # B2: Desktop Resources — add 5 new items after Best Water Filter Sydney
    b2_old = (
        '          <a href="/best-water-filter-sydney">Best Water Filter Sydney</a>\n'
        '        </div>\n'
        '      </li>\n'
        '      <li class="nav-item has-dropdown">\n'
        '        <button class="nav-link-btn" aria-haspopup="true" aria-expanded="false">Company'
    )
    res_pairs_b = [
        ('/how-to-choose-water-filter-sydney', 'How to Choose a Water Filter'),
        ('/reverse-osmosis-vs-whole-house-water-filter-sydney', 'RO vs Whole House'),
        ('/water-filter-brand-comparison-sydney', 'Brand Comparison'),
        ('/fluoride-in-sydney-water', 'Fluoride in Sydney Water'),
        ('/what-is-in-sydney-water', "What's in Sydney Water?"),
    ]
    if b2_old in content:
        b2_new_items = []
        for href, label in res_pairs_b:
            if not in_nav(content, href):
                b2_new_items.append(f'          <a href="{href}">{label}</a>')
        if b2_new_items:
            b2_new = (
                '          <a href="/best-water-filter-sydney">Best Water Filter Sydney</a>\n'
                + '\n'.join(b2_new_items) + '\n'
                '        </div>\n'
                '      </li>\n'
                '      <li class="nav-item has-dropdown">\n'
                '        <button class="nav-link-btn" aria-haspopup="true" aria-expanded="false">Company'
            )
            content = content.replace(b2_old, b2_new)

    # B3: Reviews link — root-relative
    content = content.replace(
        '<a href="/#reviews">Reviews</a>',
        '<a href="/reviews-testimonials">Reviews &amp; Testimonials</a>'
    )

    # B4: Mobile Systems — add Cartridge after Pure Compact
    b4_old = (
        '        <a href="/pure-compact-water-filter-sydney">Pure Compact</a>\n'
        '      </div>\n'
        '    </div>\n'
        '    <div class="mobile-section">'
    )
    if b4_old in content:
        if not in_nav(content, '/water-filter-cartridge-replacement-sydney'):
            b4_new = (
                '        <a href="/pure-compact-water-filter-sydney">Pure Compact</a>\n'
                '        <a href="/water-filter-cartridge-replacement-sydney">Cartridge Replacement</a>\n'
                '      </div>\n'
                '    </div>\n'
                '    <div class="mobile-section">'
            )
            content = content.replace(b4_old, b4_new)

    # B5: Mobile Resources — add 5 new items after Best Water Filter Sydney
    b5_old = (
        '        <a href="/best-water-filter-sydney">Best Water Filter Sydney</a>\n'
        '      </div>\n'
        '    </div>\n'
        '    <div class="mobile-section">'
    )
    if b5_old in content:
        b5_new_items = []
        for href, label in res_pairs_b:
            if not in_nav(content, href):
                b5_new_items.append(f'        <a href="{href}">{label}</a>')
        if b5_new_items:
            b5_new = (
                '        <a href="/best-water-filter-sydney">Best Water Filter Sydney</a>\n'
                + '\n'.join(b5_new_items) + '\n'
                '      </div>\n'
                '    </div>\n'
                '    <div class="mobile-section">'
            )
            content = content.replace(b5_old, b5_new)

    # ================================================================
    # GROUP C: Simplified nav (button without nav-link-btn class, .html)
    # Already has alkaline-water-filter-sydney.html in Systems
    # ================================================================

    # C1: Desktop Systems — add Cartridge after Service Plans
    c1_old = (
        '            <a href="service-plans.html">Service Plans</a>\n'
        '          </div>\n'
        '        </li>\n'
        '        <li>\n'
        '          <button aria-haspopup="true" aria-expanded="false">Locations'
    )
    c1_new = (
        '            <a href="service-plans.html">Service Plans</a>\n'
        '            <a href="water-filter-cartridge-replacement-sydney.html">Cartridge Replacement</a>\n'
        '          </div>\n'
        '        </li>\n'
        '        <li>\n'
        '          <button aria-haspopup="true" aria-expanded="false">Locations'
    )
    if c1_old in content:
        if not in_nav(content, 'water-filter-cartridge-replacement-sydney.html'):
            content = content.replace(c1_old, c1_new)

    # C2: Desktop Resources — add 5 new items after Best Water Filter Sydney
    c2_old = (
        '            <a href="best-water-filter-sydney.html">Best Water Filter Sydney</a>\n'
        '          </div>\n'
        '        </li>\n'
        '        <li><a href="about.html">About</a></li>'
    )
    if c2_old in content:
        c2_new_items = []
        for href, label in res_pairs_a:
            if not in_nav(content, href):
                c2_new_items.append(f'            <a href="{href}">{label}</a>')
        if c2_new_items:
            c2_new = (
                '            <a href="best-water-filter-sydney.html">Best Water Filter Sydney</a>\n'
                + '\n'.join(c2_new_items) + '\n'
                '          </div>\n'
                '        </li>\n'
                '        <li><a href="about.html">About</a></li>'
            )
            content = content.replace(c2_old, c2_new)

    # C3: Mobile Systems — add Cartridge after Alkaline (Group C mobile format)
    c3_old = (
        '        <a href="alkaline-water-filter-sydney.html">Alkaline Water Filter</a>\n'
        '        <a href="water-filter-systems.html">View All Systems</a>'
    )
    c3_new = (
        '        <a href="alkaline-water-filter-sydney.html">Alkaline Water Filter</a>\n'
        '        <a href="water-filter-cartridge-replacement-sydney.html">Cartridge Replacement</a>\n'
        '        <a href="water-filter-systems.html">View All Systems</a>'
    )
    if c3_old in content:
        if not in_nav(content, 'water-filter-cartridge-replacement-sydney.html'):
            content = content.replace(c3_old, c3_new)

    # C4: Mobile Resources for Group C — add items before mobile-plain-links
    c4_old = (
        '        <a href="best-water-filter-sydney.html">Best Water Filter Sydney</a>\n'
        '      </div>\n'
        '    </div>\n'
        '    <div class="mobile-plain-links">'
    )
    if c4_old in content:
        c4_new_items = []
        for href, label in res_pairs_a:
            if not in_nav(content, href):
                c4_new_items.append(f'        <a href="{href}">{label}</a>')
        if c4_new_items:
            c4_new = (
                '        <a href="best-water-filter-sydney.html">Best Water Filter Sydney</a>\n'
                + '\n'.join(c4_new_items) + '\n'
                '      </div>\n'
                '    </div>\n'
                '    <div class="mobile-plain-links">'
            )
            content = content.replace(c4_old, c4_new)

    # ================================================================
    # GROUP D: Cartridge page — very old nav (caret spans)
    # Remove shower filter link from Systems
    # ================================================================

    # D1: Remove shower filter from Systems dropdown
    content = content.replace(
        '              <a href="/shower-filter-installation-sydney">Shower Filter Installation</a>\n',
        ''
    )
    content = content.replace(
        '              <div class="drop-col-label" style="margin-top:8px;">Shower</div>\n',
        ''
    )

    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    return False


# ================================================================
# Main execution
# ================================================================
if __name__ == '__main__':
    html_files = sorted([
        f for f in glob.glob(os.path.join(WEBSITE_DIR, '*.html'))
        if 'node_modules' not in f
        and os.path.basename(f) not in SKIP_FILES
    ])

    updated = []
    skipped = []

    for filepath in html_files:
        result = update_file(filepath)
        basename = os.path.basename(filepath)
        if result:
            updated.append(basename)
        else:
            skipped.append(basename)

    print(f"Updated: {len(updated)} files")
    print(f"Skipped (no matching patterns): {len(skipped)} files")
    print("\nUpdated files:")
    for f in updated:
        print(f"  {f}")
    if skipped:
        print("\nSkipped files:")
        for f in skipped:
            print(f"  {f}")
