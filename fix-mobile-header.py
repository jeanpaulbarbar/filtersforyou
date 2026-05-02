import os
import re

# Mobile header CSS fixes
old_pattern = r'\.nav-logo img\{height:34px\}'
new_pattern = '.nav-logo img{height:40px}'

old_cta = r'\.nav-cta\{font-size:15px;padding:11px 20px\}'
new_cta = '.nav-cta{font-size:13px;padding:8px 12px}'

# Also fix the inline version in mobile media query
old_mobile_cta = r'\.nav-cta\{font-size:15px;padding:11px 20px\}'
new_mobile_cta = '.nav-cta{font-size:13px;padding:8px 12px}'

count = 0
files_modified = []

for filename in os.listdir('.'):
    if filename.endswith('.html'):
        filepath = os.path.join('.', filename)
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            
            original = content
            
            # Fix logo height
            content = re.sub(r'\.nav-logo img\{height:34px\}', '.nav-logo img{height:40px}', content)
            
            # Fix button padding/font in mobile media query
            content = re.sub(
                r'\.nav-cta\{font-size:15px;padding:11px 20px\}(?=\s*(?:/\*|\.|\}))',
                '.nav-cta{font-size:13px;padding:8px 12px}',
                content
            )
            
            if content != original:
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(content)
                files_modified.append(filename)
                count += 1
        except Exception as e:
            print(f"Error processing {filename}: {e}")

print(f"✅ Fixed {count} HTML files:")
for f in sorted(files_modified):
    print(f"  - {f}")
