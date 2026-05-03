import os

# Change position:sticky to position:fixed for mobile nav
count = 0

for filename in os.listdir('.'):
    if filename.endswith('.html'):
        filepath = os.path.join('.', filename)
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            
            original = content
            
            # In @media blocks for mobile, change .nav to position:fixed instead of sticky
            # But keep top:0, z-index:1000
            content = content.replace(
                '  .nav{position:sticky;top:0;z-index:1000}',
                '  .nav{position:fixed;top:0;z-index:1000;left:0;right:0;width:100%}'
            )
            
            if content != original:
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(content)
                count += 1
        except Exception as e:
            pass

print(f"✅ Changed {count} files from sticky to fixed for mobile nav")
