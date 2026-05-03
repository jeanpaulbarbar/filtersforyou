import os
import re

files_to_fix = [
    "benchtop-water-filter-sydney.html",
    "best-water-filter-for-hard-water-sydney.html",
    "best-water-filter-sydney.html",
    "filter-lifespan-calculator.html",
    "free-assessment.html",
    "how-water-filters-work.html",
    "inline-fridge-water-filter-sydney.html",
    "is-sydney-water-safe.html",
    "licensed-plumber-water-filter-sydney.html",
    "locations-eastern-suburbs.html",
    "locations-inner-city.html",
    "locations-inner-west.html",
    "locations-north-shore.html",
    "locations-south-sydney.html",
    "locations-western-sydney.html",
    "privacy-policy.html",
    "pure-advanced-water-filter-sydney.html",
    "pure-compact-water-filter-sydney.html",
    "pure-essential-water-filter-sydney.html",
    "pure-home-water-filter-sydney.html",
    "pure-luxe-water-filter-sydney.html",
    "pure-plus-water-filter-sydney.html",
    "pure-premium-water-filter-sydney.html",
    "refund-policy.html",
    "reverse-osmosis-installation-bondi.html",
    "reverse-osmosis-installation-chatswood.html",
    "reverse-osmosis-installation-parramatta.html",
    "reverse-osmosis-water-filter-sydney.html",
    "sydney-water-filter-cost-guide.html",
    "sydney-water-quality-guide.html",
    "terms-and-conditions.html",
    "under-sink-water-filter-bondi.html",
    "under-sink-water-filter-parramatta.html",
    "under-sink-water-filter-randwick.html",
    "under-sink-water-filter-sydney.html",
    "under-sink-water-filter-vs-benchtop-sydney.html",
    "water-filter-apartment-sydney.html",
    "water-filter-baby-formula-sydney.html",
    "water-filter-baby-safe-sydney.html",
    "water-filter-chlorine-removal-sydney.html",
    "water-filter-faq-sydney.html",
    "water-filter-for-renters-sydney.html",
    "water-filter-installation-alexandria.html",
    "water-filter-installation-annandale.html",
    "water-filter-installation-arncliffe.html",
    "water-filter-installation-ashfield.html",
    "water-filter-installation-auburn.html",
    "water-filter-installation-balmain.html",
    "water-filter-installation-bankstown.html",
    "water-filter-installation-beaconsfield.html",
    "water-filter-installation-bondi.html",
    "water-filter-installation-botany.html",
    "water-filter-installation-brighton-le-sands.html",
    "water-filter-installation-burwood.html",
    "water-filter-installation-campsie.html",
    "water-filter-installation-canterbury.html",
    "water-filter-installation-chatswood.html",
    "water-filter-installation-chippendale.html",
    "water-filter-installation-concord.html",
    "water-filter-installation-coogee.html",
    "water-filter-installation-croydon-park.html",
    "water-filter-installation-drummoyne.html",
    "water-filter-installation-eastern-suburbs-sydney.html",
    "water-filter-installation-enmore.html",
    "water-filter-installation-erskineville.html",
    "water-filter-installation-fairfield.html",
    "water-filter-installation-five-dock.html",
    "water-filter-installation-glebe.html",
    "water-filter-installation-granville.html",
    "water-filter-installation-homebush-west.html",
    "water-filter-installation-homebush.html",
    "water-filter-installation-hurstville.html",
    "water-filter-installation-kensington.html",
    "water-filter-installation-kogarah.html",
    "water-filter-installation-leichhardt.html",
    "water-filter-installation-lidcombe.html",
    "water-filter-installation-liverpool.html",
    "water-filter-installation-manly.html",
    "water-filter-installation-maroubra.html",
    "water-filter-installation-marrickville.html",
    "water-filter-installation-mascot.html",
    "water-filter-installation-miranda.html",
    "water-filter-installation-newtown.html",
    "water-filter-installation-north-richmond.html",
    "water-filter-installation-paddington.html",
    "water-filter-installation-parramatta.html",
    "water-filter-installation-petersham.html",
    "water-filter-installation-pyrmont.html",
    "water-filter-installation-ramsgate.html",
    "water-filter-installation-randwick.html",
    "water-filter-installation-redfern.html",
    "water-filter-installation-richmond.html",
    "water-filter-installation-rockdale.html",
    "water-filter-installation-rozelle.html",
    "water-filter-installation-same-day-sydney.html",
    "water-filter-installation-st-george.html",
    "water-filter-installation-stanmore.html",
    "water-filter-installation-strathfield.html",
    "water-filter-installation-surry-hills.html",
    "water-filter-installation-sydney-cbd.html",
    "water-filter-installation-tempe.html",
    "water-filter-installation-ultimo.html",
    "water-filter-installation-waterloo.html",
    "water-filter-installation-zetland.html",
    "water-filter-maintenance-guide.html",
    "water-filter-pfas-removal-sydney.html",
    "water-filter-system-sydney-family.html",
    "water-savings-calculator.html",
    "watermark-certified-water-filter-sydney.html",
    "whole-house-vs-under-sink-water-filter.html",
    "whole-house-water-filter-bondi.html",
    "whole-house-water-filter-chatswood.html",
    "whole-house-water-filter-parramatta.html",
    "whole-house-water-filter-sydney.html",
]

nav_inner_rule = "  .nav-inner{padding:0 16px;height:60px}\n"

fixed_count = 0
error_count = 0

for fname in files_to_fix:
    if not os.path.exists(fname):
        print("NOT FOUND: " + fname)
        error_count += 1
        continue

    with open(fname, 'r', encoding='utf-8') as f:
        content = f.read()

    # Double-check it doesn't already have this rule
    if '.nav-inner{padding:0 16px;height:60px}' in content:
        print("ALREADY HAS RULE: " + fname)
        continue

    # Strategy: find first @media(max-width:768px){ block and add nav-inner rule
    # after the html,body line (or right after the opening brace if no html,body)

    # Try to find @media(max-width:768px){ followed by html,body line
    match = re.search(r'(@media\(max-width:768px\)\{[^\n]*\n)([ \t]*html,body\{[^\n]+\n)', content)

    if match:
        # Insert nav-inner rule right after html,body line
        insert_pos = match.end()
        new_content = content[:insert_pos] + nav_inner_rule + content[insert_pos:]
        with open(fname, 'w', encoding='utf-8') as f:
            f.write(new_content)
        fixed_count += 1
    else:
        # Try to find @media(max-width:768px){ without html,body right after
        match2 = re.search(r'(@media\(max-width:768px\)\{)\s*\n', content)
        if match2:
            insert_pos = match2.end()
            new_content = content[:insert_pos] + nav_inner_rule + content[insert_pos:]
            with open(fname, 'w', encoding='utf-8') as f:
                f.write(new_content)
            fixed_count += 1
        else:
            print("PATTERN NOT FOUND: " + fname)
            error_count += 1

print("")
print("Fixed: " + str(fixed_count))
print("Errors: " + str(error_count))
