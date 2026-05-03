import os
import re

# Ensure .nav has position:sticky in @media(max-width:768px) blocks
count = 0
files_fixed = []

for filename in os.listdir('.'):
    if filename.endswith('.html'):
        filepath = os.path.join('.', filename)
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            
            original = content
            
            # Find @media(max-width:768px) block and ensure .nav or header has position:sticky
            # Look for the pattern and add position:sticky;top:0 to the nav
            if '@media(max-width:768px)' in content:
                # Check if nav already has sticky in mobile
                if 'position:sticky' not in content or 'position:sticky' not in content[content.find('@media(max-width:768px)'):]:
                    # Add position:sticky to .nav in mobile media query
                    content = re.sub(
                        r'(@media\(max-width:768px\)\{[^}]*\.nav\{[^}]*?)(padding:[^}]*?\})',
                        r'\1position:sticky;top:0;\2',
                        content,
                        flags=re.DOTALL
                    )
                    
            if content != original:
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(content)
                files_fixed.append(filename)
                count += 1
        except Exception as e:
            print(f"Error: {filename} - {e}")

print(f"✅ Fixed {count} files")
for f in sorted(files_fixed)[:10]:
    print(f"  - {f}")
if len(files_fixed) > 10:
    print(f"  ... and {len(files_fixed) - 10} more")
