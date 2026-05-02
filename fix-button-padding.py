import os
import re

# Fix pattern: look for the mobile version of nav-cta
old_mobile = r'\.nav-cta\{white-space:nowrap;font-size:15px;padding:11px 20px\}'
new_mobile = '.nav-cta{white-space:nowrap;font-size:13px;padding:8px 12px}'

count = 0
files_modified = []

for filename in os.listdir('.'):
    if filename.endswith('.html'):
        filepath = os.path.join('.', filename)
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            
            original = content
            content = content.replace(
                '.nav-cta{white-space:nowrap;font-size:15px;padding:11px 20px}',
                '.nav-cta{white-space:nowrap;font-size:13px;padding:8px 12px}'
            )
            
            if content != original:
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(content)
                files_modified.append(filename)
                count += 1
        except Exception as e:
            print(f"Error processing {filename}: {e}")

print(f"\n✅ Fixed button padding in {count} HTML files:")
for f in sorted(files_modified)[:10]:
    print(f"  - {f}")
if len(files_modified) > 10:
    print(f"  ... and {len(files_modified) - 10} more")
