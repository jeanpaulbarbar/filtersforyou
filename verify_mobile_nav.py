import os
import re

files = sorted([f for f in os.listdir('.') if f.endswith('.html')])

results = []

for fname in files:
    with open(fname, 'r', encoding='utf-8') as f:
        content = f.read()

    # Skip redirect pages (no real nav)
    if 'class="nav-inner"' not in content and '<nav class="nav">' not in content:
        results.append((fname, 'N/A', 'N/A', 'N/A', 'REDIRECT/NO-NAV'))
        continue

    # 1. Logo height at mobile
    # Check if nav-logo img has height:40px in CSS (desktop or mobile)
    has_logo_40 = bool(re.search(r'\.nav-logo img\{height:40px', content))
    # Also check if mobile media query sets it to 40px
    has_logo_40_mobile = bool(re.search(r'\.nav-logo img\{height:40px\}', content))
    # For homepage: has height:42px desktop + height:40px in media query
    has_logo_42_desktop_40_mobile = bool(re.search(r'\.nav-logo img\{height:42px', content)) and bool(re.search(r'\.nav-logo img\{height:40px\}', content))

    if has_logo_40 or has_logo_42_desktop_40_mobile:
        logo_height = '40px'
        logo_ok = True
    else:
        # Check HTML attribute
        html_height = re.search(r'nav-logo.*?height="(\d+)"', content, re.DOTALL)
        if html_height:
            logo_height = html_height.group(1) + 'px'
            logo_ok = (html_height.group(1) == '40')
        else:
            logo_height = 'UNKNOWN'
            logo_ok = False

    # 2. Button font-size at mobile (13px in 900px or 768px block)
    has_btn_13 = bool(re.search(r'nav-cta\{[^}]*font-size:13px', content))
    has_btn_13_explicit = bool(re.search(r'\.nav-cta\{white-space:nowrap;font-size:13px;padding:8px 12px\}', content))
    has_btn_13_768 = bool(re.search(r'\.nav-cta\{font-size:13px;padding:8px 12px\}', content))
    btn_fontsize = '13px' if (has_btn_13_explicit or has_btn_13_768 or has_btn_13) else '15px'
    btn_ok = btn_fontsize == '13px'

    # 3. Button padding at mobile (8px 12px)
    has_btn_pad = bool(re.search(r'nav-cta[^}]*padding:8px 12px', content))
    btn_padding = '8px 12px' if has_btn_pad else '11px 20px'
    pad_ok = btn_padding == '8px 12px'

    # 4. Nav-inner mobile height (60px)
    has_nav_inner_60 = bool(re.search(r'\.nav-inner\{padding:0 16px;height:60px\}', content))
    nav_inner = '60px' if has_nav_inner_60 else '68px'
    nav_inner_ok = has_nav_inner_60

    # 5. Online dot hidden at mobile
    has_online_hidden = bool(re.search(r'online-dot-wrap\{display:none', content))
    online_ok = has_online_hidden

    # Overall match
    if logo_ok and btn_ok and pad_ok and nav_inner_ok and online_ok:
        status = 'MATCH'
    else:
        issues = []
        if not logo_ok: issues.append('logo:' + logo_height)
        if not btn_ok: issues.append('btn:' + btn_fontsize)
        if not pad_ok: issues.append('pad:' + btn_padding)
        if not nav_inner_ok: issues.append('nav-h:68px')
        if not online_ok: issues.append('dot:visible')
        status = 'MISMATCH(' + ','.join(issues) + ')'

    results.append((fname, logo_height, btn_fontsize, btn_padding, status))

# Print report
print('MOBILE HEADER VERIFICATION REPORT')
print('Reference: logo=40px | btn=13px | padding=8px 12px | nav-h=60px | dot=hidden')
print('=' * 90)
print(f"{'FILE':<55} {'LOGO':>6} {'BTN':>5} {'PADDING':>10} {'STATUS'}")
print('-' * 90)

match_count = 0
mismatch_count = 0

for fname, logo, btn, pad, status in results:
    if status == 'MATCH':
        match_count += 1
        print(f"{fname:<55} {logo:>6} {btn:>5} {pad:>10} {'OK'}")
    elif status == 'REDIRECT/NO-NAV':
        print(f"{fname:<55} {'---':>6} {'---':>5} {'---':>10} REDIRECT")
    else:
        mismatch_count += 1
        print(f"{fname:<55} {logo:>6} {btn:>5} {pad:>10} MISMATCH -> {status}")

print('=' * 90)
print(f"MATCH: {match_count}  |  MISMATCH: {mismatch_count}  |  TOTAL: {len(results)}")
