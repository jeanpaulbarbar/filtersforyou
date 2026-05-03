import os

count = 0
files_fixed = []

for filename in os.listdir('.'):
    if filename.endswith('.html'):
        filepath = os.path.join('.', filename)
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            
            original = content
            
            # Add position:sticky;top:0;z-index:1000 to .nav in @media(max-width:767px) or @media(max-width:768px)
            # Look for the pattern: "/* Nav */" or ".nav-inner{padding:0 16px"
            if '@media(max-width:767px)' in content or '@media(max-width:768px)' in content:
                # Replace the nav section in mobile media query
                content = content.replace(
                    '  .nav-inner{padding:0 16px;height:60px}',
                    '  .nav{position:sticky;top:0;z-index:1000}\n  .nav-inner{padding:0 16px;height:60px}'
                )
                
                # Handle the 900px breakpoint as well
                content = content.replace(
                    '@media(max-width:900px){\n  .nav-links{display:none',
                    '@media(max-width:900px){\n  .nav{position:sticky;top:0;z-index:1000}\n  .nav-links{display:none'
                )
            
            if content != original:
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(content)
                files_fixed.append(filename)
                count += 1
        except Exception as e:
            print(f"Error: {filename} - {e}")

print(f"✅ Fixed {count} files for sticky mobile header")
for f in sorted(files_fixed)[:15]:
    print(f"  ✓ {f}")
if len(files_fixed) > 15:
    print(f"  ... and {len(files_fixed) - 15} more")
