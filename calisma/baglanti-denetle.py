"""Derlenmiş sitede (docs/.vitepress/dist) sayfa içi bağlantıları, çapaları ve görselleri denetler."""
import re, os, glob, urllib.parse
D = 'docs/.vitepress/dist'
ids = {os.path.basename(f)[:-5]: set(re.findall(r'id="([^"]+)"', open(f, encoding='utf-8').read())) for f in glob.glob(D + '/*.html')}
bad = 0
for md in glob.glob('docs/*.md'):
    s = open(md, encoding='utf-8').read()
    for link in re.findall(r'\]\((/[^)\s]*)\)', s):
        page, _, anchor = link[1:].partition('#')
        page = page or 'index'
        if page not in ids: print(md, 'SAYFA YOK', link); bad += 1
        elif anchor and urllib.parse.unquote(anchor) not in ids[page]: print(md, 'ÇAPA YOK', link); bad += 1
    for link in re.findall(r'\]\((#[^)\s]*)\)', s):
        if link[1:] not in ids[os.path.basename(md)[:-3]]: print(md, 'ÇAPA YOK', link); bad += 1
    for img in re.findall(r'!\[[^\]]*\]\(([^)]+)\)', s):
        if not os.path.exists(os.path.join('docs', img)): print(md, 'GÖRSEL YOK', img); bad += 1
print('sorun:', bad)
