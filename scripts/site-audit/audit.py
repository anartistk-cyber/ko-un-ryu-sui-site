import sys,os,re,json,collections
from html.parser import HTMLParser
site=sys.argv[1];base=sys.argv[2]
class P(HTMLParser):
    def __init__(s):
        super().__init__();s.title='';s._t=False;s.meta={};s.link={};s.h=[];s._h=None;s.imgs=[];s.a=[];s.ld=[];s._ld=False;s.lang=None;s.txt=[]
    def handle_starttag(s,t,a):
        d=dict(a)
        if t=='html':s.lang=d.get('lang')
        if t=='title':s._t=True
        if t=='meta':
            k=d.get('name') or d.get('property')
            if k:s.meta[k]=d.get('content','')
        if t=='link' and d.get('rel'):s.link[d['rel']]=d.get('href')
        if t in('h1','h2','h3','h4'):s._h=[t,'']
        if t=='img':s.imgs.append(d)
        if t=='a' and d.get('href'):s.a.append(d['href'])
        if t=='script' and d.get('type')=='application/ld+json':s._ld=True;s.ld.append('')
    def handle_endtag(s,t):
        if t=='title':s._t=False
        if s._h and t==s._h[0]:s.h.append(tuple(s._h));s._h=None
        if t=='script':s._ld=False
    def handle_data(s,x):
        if s._t:s.title+=x
        if s._h:s._h[1]+=x
        if s._ld:s.ld[-1]+=x
pages={}
for r,_,fs in os.walk(site):
    for f in fs:
        if f.endswith('.html'):
            p=os.path.join(r,f);rel=os.path.relpath(p,site)
            pages[rel]=p
issues=collections.defaultdict(list);titles={};descs={}
def exists(href):
    h=href.split('#')[0].split('?')[0]
    if not h:return True
    if h.startswith(('http','mailto:','tel:','data:','javascript:')):return True
    if h.startswith('/'):
        c=[os.path.join(site,h.lstrip('/')),os.path.join(site,h.lstrip('/'),'index.html'),os.path.join(site,h.lstrip('/'))+'.html']
        return any(os.path.isfile(x) for x in c)
    return True
ext_ok=('/cms/','/wp-content/','/news_blog','/wp-')
for rel,p in sorted(pages.items()):
    s=open(p,encoding='utf-8').read();q=P();q.feed(s)
    url=rel.replace('index.html','').replace('.html','')
    t=q.title.strip();d=q.meta.get('description','')
    titles.setdefault(t,[]).append(rel);descs.setdefault(d,[]).append(rel)
    if not 18<=len(t)<=75:issues['title長さ'].append((rel,len(t)))
    if not 60<=len(d)<=170:issues['description長さ'].append((rel,len(d)))
    if not q.link.get('canonical') and not rel.startswith(('404','google')):issues['canonicalなし'].append(rel)
    if not q.meta.get('og:image') and not rel.startswith(('404','google')):issues['og:imageなし'].append(rel)
    h1=[x for x in q.h if x[0]=='h1']
    if len(h1)!=1 and not rel.startswith(('404','google')):issues['h1数'].append((rel,len(h1)))
    for x in q.h:
        if not x[1].strip():issues['空の見出し'].append((rel,x[0]))
    prev=1
    for x in q.h:
        lv=int(x[0][1]);
        if lv>prev+1:issues['見出し飛び'].append((rel,x[0],x[1][:20]));break
        prev=lv
    for im in q.imgs:
        if 'alt' not in im:issues['alt欠落'].append((rel,im.get('src','')[:60]))
        elif not im['alt'].strip() and im.get('aria-hidden')!='true':issues['alt空'].append((rel,im.get('src','')[:60]))
        if not im.get('width') and not im.get('height') and 'style' not in im:issues['img寸法なし'].append((rel,im.get('src','')[:50]))
        src=im.get('src','')
        if src.startswith('/') and not src.startswith(ext_ok) and not exists(src):issues['画像リンク切れ'].append((rel,src))
    for h in q.a:
        if not exists(h) and not h.startswith(ext_ok):issues['内部リンク切れ'].append((rel,h))
    for j in q.ld:
        try:json.loads(j)
        except Exception as e:issues['JSON-LD不正'].append((rel,str(e)[:50]))
    if not q.ld and not rel.startswith(('404','google')):issues['JSON-LDなし'].append(rel)
    if not q.lang:issues['lang無'].append(rel)
for t,v in titles.items():
    if len(v)>1:issues['title重複'].append((t[:30],v[:4]))
for d,v in descs.items():
    if len(v)>1 and d:issues['description重複'].append((d[:30],v[:4]))
print(site,'pages',len(pages))
for k,v in issues.items():print(' ',k,len(v),v[:6])
if not issues:print('  no issues')
for f in ['robots.txt','sitemap.xml','llms.txt','llms-full.txt']:
    print(' ',f,'OK' if os.path.isfile(os.path.join(site,f)) else 'MISSING')
