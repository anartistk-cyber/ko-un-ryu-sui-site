import math,subprocess,os
NAVY='#15243b'; SKIN='#ffd9b0'; WHITE='#ffffff'
class C:
    def __init__(s): s.e=[]
    def add(s,tag,fill,sw=10,stroke=NAVY,**a):
        s.e.append((tag,fill,sw,stroke,a)); return s
    def path(s,d,fill,sw=10,stroke=NAVY,**a): return s.add('path',fill,sw,stroke,d=d,**a)
    def circ(s,cx,cy,r,fill,sw=10,stroke=NAVY,**a): return s.add('circle',fill,sw,stroke,cx=cx,cy=cy,r=r,**a)
    def ell(s,cx,cy,rx,ry,fill,sw=10,stroke=NAVY,rot=0,**a):
        if rot: a['transform']=f'rotate({rot} {cx} {cy})'
        return s.add('ellipse',fill,sw,stroke,cx=cx,cy=cy,rx=rx,ry=ry,**a)
    def rect(s,x,y,w,h,r,fill,sw=10,stroke=NAVY,rot=0,**a):
        if rot: a['transform']=f'rotate({rot} {x+w/2} {y+h/2})'
        return s.add('rect',fill,sw,stroke,x=x,y=y,width=w,height=h,rx=r,**a)
    def line(s,x1,y1,x2,y2,col,w=12):   # 太い線＋ふち
        s.path(f'M{x1},{y1} L{x2},{y2}','none',w+18,NAVY); s.e.append(('path','none',w,col,{'d':f'M{x1},{y1} L{x2},{y2}','_inner':1})); return s
    def shift(s,start,dx):
        for i in range(start,len(s.e)):
            t,f,w,st,a=s.e[i]; a=dict(a); a['transform']=f'translate({dx},0) '+a.get('transform',''); s.e[i]=(t,f,w,st,a)
        return s
    def svg(s,pass_):
        out=[]
        for tag,fill,sw,stroke,a in s.e:
            a=dict(a); inner=a.pop('_inner',0); deco=a.pop('_deco',0)
            if pass_=='border':
                if inner or deco or stroke=='none': continue
                f='none' if fill=='none' else WHITE; st=WHITE; w=sw+30
            else: f,st,w=fill,stroke,sw
            at=' '.join(f'{k.replace("_","-")}="{v}"' for k,v in a.items())
            out.append(f'<{tag} {at} fill="{f}" stroke="{st}" stroke-width="{w}" stroke-linejoin="round" stroke-linecap="round"/>')
        return '\n'.join(out)
def star(cx,cy,R,r,n=5,rot=-90):
    p=[]
    for i in range(n*2):
        a=math.radians(rot+i*180/n); q=R if i%2==0 else r
        p.append(f'{cx+q*math.cos(a):.1f},{cy+q*math.sin(a):.1f}')
    return 'M'+' L'.join(p)+'Z'
HAIRCAP='M90,178 C84,40 316,40 310,178 C296,146 268,128 236,130 C222,152 184,154 168,130 C138,126 106,144 90,178Z'
def base(c,cl,cld,pants='#3b4760',shoe='#7a4a24',hair=None,hairpath=HAIRCAP):
    # 脚・くつ
    c.rect(160,352,34,62,14,pants); c.rect(206,352,34,62,14,pants)
    c.ell(172,418,30,16,shoe); c.ell(228,418,30,16,shoe)
    # うで
    c.ell(126,314,22,38,cl,rot=24); c.ell(274,314,22,38,cl,rot=-24)
    c.circ(112,348,17,SKIN); c.circ(288,348,17,SKIN)
    # からだ・エプロン
    c.rect(142,262,116,112,34,cl)
    c.rect(166,286,68,88,14,WHITE,8)
    c.rect(180,326,40,30,8,'#e6ebf1',6)
    # 顔
    c.ell(200,172,110,100,SKIN)
    if hair: c.path(hairpath,hair)
def face(c,eye=NAVY):
    for x in (160,240):
        c.ell(x,188,13,19,eye,0,'none'); c.circ(x-4,180,5.5,WHITE,0,'none')
    c.ell(126,216,17,9,'#ff9f9f',0,'none'); c.ell(274,216,17,9,'#ff9f9f',0,'none')
    c.path('M184,218 Q200,234 216,218','none',7)
def creator():
    c=C(); base(c,'#e9a514','#b97c08',hair='#d9662b'); face(c)
    c.ell(88,150,22,30,'#d9662b',rot=20); c.ell(312,150,22,30,'#d9662b',rot=-20)
    c.path('M112,84 L190,-36 Q212,-64 256,-46 Q228,-36 234,-10 L288,84 Z','#3b3f8f')
    c.ell(200,90,142,28,'#3b3f8f'); c.path('M122,74 Q200,98 278,74 L270,56 Q200,78 130,56Z','#ffd23f',7)
    c.path(star(196,10,20,8),'#ffd23f',6)
    n=len(c.e); c.line(300,356,318,238,'#a66a2c',12); c.path(star(322,196,46,20),'#ffd23f'); c.shift(n,18)
    return c
def innovator():
    c=C(); base(c,'#58b368','#3d8a4c',hair='#2f8f88'); face(c)
    c.path('M96,112 L112,48 L140,86 L160,26 L190,78 L214,20 L236,80 L262,34 L276,90 L300,58 L304,116 Q200,60 96,112Z','#2f8f88')
    c.path('M92,128 Q200,92 308,128 L306,150 Q200,116 94,150Z','#3a3f55',8)
    c.circ(160,128,30,'#7fe3ff'); c.circ(240,128,30,'#7fe3ff'); c.path('M146,118 Q156,108 168,112','none',6,WHITE,_deco=1); c.path('M226,118 Q236,108 248,112','none',6,WHITE,_deco=1)
    c.path('M300,236 L300,278 L270,330 Q262,356 290,360 L340,360 Q368,356 360,330 L330,278 L330,236Z','#e3f6fc')
    c.path('M282,312 L348,312 L358,332 Q364,352 340,354 L290,354 Q266,352 272,332Z','#5ed16a',0,'none')
    c.rect(292,226,46,14,6,'#9fb0c3',8); c.circ(322,196,9,'#5ed16a',6); c.circ(344,168,6,'#5ed16a',5)
    return c
def artist():
    c=C(); c.rect(84,120,232,230,70,'#8a5a2b'); base(c,'#8a5fc0','#68439a',hair='#8a5a2b'); face(c)
    c.ell(196,76,118,46,'#d9553f',rot=-8); c.circ(206,30,12,'#d9553f',8)
    c.ell(92,354,44,32,'#f1dfb5',rot=-12); c.circ(74,346,7,'#e23c3c',0,'none'); c.circ(94,340,7,'#2f6fb0',0,'none'); c.circ(112,352,7,'#e9a514',0,'none'); c.circ(90,366,7,'#2f8f83',0,'none')
    n=len(c.e); c.line(298,360,316,236,'#c98f4e',12); c.path('M306,236 L326,238 L326,206 Q318,176 310,206Z','#e23c3c',8); c.rect(304,226,24,16,4,'#c9d3dc',7); c.shift(n,12)
    return c
def meister():
    c=C(); base(c,'#2f6fb0','#1f4f85',hair='#2a3b57'); face(c)
    c.path('M92,116 Q200,74 308,116 L306,142 Q200,102 94,142Z',WHITE,8)
    c.path('M96,124 L62,150 L80,160Z',WHITE,8); c.path('M96,132 L58,176 L84,176Z',WHITE,8)
    n=len(c.e); c.path('M304,306 L286,178 Q296,168 306,186 L322,300Z','#e3e9ef',8); c.path('M320,306 L340,178 Q330,168 320,186 L302,300Z','#c3ccd6',8)
    c.circ(312,304,7,'#8a8f98',5)
    c.circ(292,340,20,'none',26); c.circ(292,340,20,'none',10,'#e9a514',_inner=1); c.circ(334,340,20,'none',26); c.circ(334,340,20,'none',10,'#e9a514',_inner=1); c.shift(n,18)
    return c
def entertainer():
    c=C(); c.circ(112,70,44,'#f08a3c'); c.circ(288,70,44,'#f08a3c'); base(c,'#ff7fb0','#d9558a',hair='#f08a3c'); face(c)
    c.path('M98,60 Q108,46 122,50','none',7,WHITE,_deco=1); c.path('M274,60 Q284,46 298,50','none',7,WHITE,_deco=1)
    c.line(300,360,312,296,'#3a3f55',14); c.circ(316,266,28,'#dfe6ee'); c.path('M298,258 Q316,246 334,258','none',5,'#8a8f98',_deco=1); c.path('M296,272 Q316,262 336,272','none',5,'#8a8f98',_deco=1)
    c.path('M356,196 L356,130 L392,120 L392,182','none',9); c.ell(344,198,15,11,'#e23c8a',8,rot=-20); c.ell(380,186,15,11,'#e23c8a',8,rot=-20)
    return c
def producer():
    c=C(); c.ell(72,196,36,66,'#6b4423',rot=14); base(c,'#d9553f','#a83a28',hair='#6b4423'); face(c)
    c.circ(98,140,13,'#ffd23f',7)
    c.line(304,362,304,96,'#9aa3ad',12); c.circ(304,90,11,'#ffd23f',7)
    c.path('M312,104 L396,116 L368,146 L396,178 L312,186Z','#e23c3c'); c.path(star(342,145,17,7),'#ffd23f',0,'none')
    return c
def partner():
    c=C(); c.ell(200,196,128,112,'#7a56a0'); c.circ(200,42,44,'#7a56a0'); base(c,'#2f8f83','#1f6b62',hair='#7a56a0'); face(c)
    c.rect(166,74,68,18,9,'#ff6f9c',7)
    n=len(c.e); c.line(302,362,316,262,'#f4e9c8',12)
    c.path('M320,250 C262,206 286,150 320,182 C354,150 378,206 320,250Z','#ff6f9c'); c.path('M298,186 Q304,176 314,180','none',7,WHITE,_deco=1); c.shift(n,18)
    return c
def advisor():
    c=C(); c.ell(200,190,126,112,'#9aa6ba'); base(c,'#4a5fa8','#34457f',hair='#9aa6ba',hairpath='M90,178 C84,40 316,40 310,178 C300,150 280,134 252,130 Q200,150 148,130 C120,134 100,150 90,178Z'); face(c)
    c.circ(160,190,30,'none',7,'#d4930c'); c.circ(240,190,30,'none',7,'#d4930c'); c.path('M190,186 Q200,180 210,186','none',7,'#d4930c')
    c.rect(270,300,96,68,10,'#7a4a24',rot=-8); c.rect(278,304,80,56,6,WHITE,6,rot=-8)
    c.path('M318,304 L322,362','none',5,'#9fb0c3',_deco=1)
    for y in (322,338): c.path(f'M288,{y+4} L310,{y+1}','none',4,'#9fb0c3',_deco=1); c.path(f'M330,{y-1} L352,{y-4}','none',4,'#9fb0c3',_deco=1)
    return c
CH=[('creator','クリエイター',creator),('innovator','イノベーター',innovator),('artist','アーティスト',artist),('meister','マイスター',meister),('entertainer','エンターテイナー',entertainer),('producer','プロデューサー',producer),('partner','パートナー',partner),('advisor','アドバイザー',advisor)]
VB='0 -100 460 560'
def doc(c,sticker=True):
    g=c.svg('main'); b=c.svg('border') if sticker else ''
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{VB}" width="920" height="1120"><g transform="translate(20,0)">{b}\n{g}</g></svg>'
for k,jp,fn in CH:
    c=fn(); open(f'{k}.svg','w').write(doc(c)); open(f'{k}_plain.svg','w').write(doc(c,False))
    subprocess.run(['rsvg-convert','-w','1840',f'{k}.svg','-o',f'{k}.png'],check=True)
from PIL import Image
sheet=Image.new('RGB',(4*460,2*560),(191,227,245))
for n,(k,jp,fn) in enumerate(CH):
    im=Image.open(f'{k}.png').convert('RGBA').resize((460,560),Image.LANCZOS); sheet.paste(im,((n%4)*460,(n//4)*560),im)
sheet.save('sheet_v2.png'); print('ok')
