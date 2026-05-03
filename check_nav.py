import re, os

os.chdir('/Users/xtc/Desktop/FFY Agency Hub/Website')

pages_checked = 0
pages_sticky = 0
pages_not_sticky = []

for fn in sorted(os.listdir('.')):
    if not fn.endswith('.html'):
        continue
    content = open(fn).read()
    has_sticky = bool(re.search(r'\.nav\{[^}]*position:sticky', content))
    has_nav = 'class="nav"' in content or "class='nav'" in content
    if has_nav:
        pages_checked += 1
        if has_sticky:
            pages_sticky += 1
        else:
            pages_not_sticky.append(fn)

print(f'Pages with nav element: {pages_checked}')
print(f'Pages with sticky nav: {pages_sticky}')
print(f'Pages NOT sticky: {pages_not_sticky}')
