import json,re,random,colorsys,math
from PIL import Image,ImageDraw,ImageFont,ImageFilter,ImageChops
h=open('/home/claude/ko-un-ryu-sui-site/client/public/type-shindan/index.html').read()
T=json.loads(re.search(r'const TYPES=(\{.*?\});\n',h,re.S).group(1))
V2={'TCF':'creator','TCL':'innovator','TSF':'artist','TSL':'meister','HCF':'entertainer','HCL':'producer','HSF':'partner','HSL':'advisor'}
# 属性・じゃんけん・基本BP・必殺技（名前, 攻撃力, 防御）
G={'TCF':('火','チョキ',500,[('ひらめきカット',180,80),('トレンド先取り',150,100)]),
   'TCL':('金','グー',550,[('薬剤コントロール',160,120),('原因つきとめ分析',110,170)]),
   'TSF':('木','チョキ',500,[('色彩マジック',190,70),('世界観メイク',140,120)]),
   'TSL':('金','チョキ',550,[('ミリ単位カット',180,90),('艶出しブロー',120,160)]),
   'HCF':('火','グー',450,[('笑顔トーク',150,110),('場をあたためる一言',100,160)]),
   'HCL':('土','グー',600,[('チーム号令',170,110),('段取りマスター',110,180)]),
   'HSF':('水','パー',500,[('寄りそいヒアリング',100,200),('いやしのシャンプー',130,170)]),
   'HSL':('水','パー',550,[('見立てカウンセリング',140,160),('ホームケア処方',110,180)])}
BONUS=[0,150,250,350,None]   # 最強は一律1000
FB='/usr/share/fonts/opentype/noto/NotoSansCJK-Black.ttc'; FM='/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc'; FR='/usr/share/fonts/opentype/noto/NotoSansCJK-Medium.ttc'
f=lambda p,s:ImageFont.truetype(p,s,index=0)
INK=(21,36,59);WHITE=(255,255,255);YEL=(255,210,63);DEEP=(29,78,120);ACC=(233,165,20)
W=1080
ELEM={'火':(226,60,60),'水':(47,111,176),'木':(47,143,91),'金':(212,160,23),'土':(150,104,58)}
_rb={}
def rainbow(w,h,phase=0,sat=0.55,rep_=1.6):
    k=(w,h,phase,sat,rep_)
    if k in _rb: return _rb[k].copy()
    sm=Image.new('RGB',(w//8+1,h//8+1)); px=sm.load()
    for y in range(sm.height):
        for x in range(sm.width):
            r,g,b=colorsys.hsv_to_rgb(((x+y)/(sm.width+sm.height)*rep_+phase)%1,sat,1); px[x,y]=(int(r*255),int(g*255),int(b*255))
    _rb[k]=sm.resize((w,h),Image.BILINEAR); return _rb[k].copy()
def sparkle(d,x,y,s):
    d.polygon([(x,y-s),(x+s*0.22,y-s*0.22),(x+s,y),(x+s*0.22,y+s*0.22),(x,y+s),(x-s*0.22,y+s*0.22),(x-s,y),(x-s*0.22,y-s*0.22)],fill=WHITE)
def spk(pts,col=WHITE):
    return pts,col
def draw_sparks(im,items,glow=10,glowcol=None):
    L=Image.new('RGBA',im.size,(0,0,0,0)); ld=ImageDraw.Draw(L)
    for x,y,s_,col in items:
        ld.polygon([(x,y-s_),(x+s_*0.2,y-s_*0.2),(x+s_,y),(x+s_*0.2,y+s_*0.2),(x,y+s_),(x-s_*0.2,y+s_*0.2),(x-s_,y),(x-s_*0.2,y-s_*0.2)],fill=col+(255,))
        if s_>=26:
            r=s_*0.55; ld.line((x-r,y-r,x+r,y+r),fill=col+(255,),width=3); ld.line((x-r,y+r,x+r,y-r),fill=col+(255,),width=3)
    G_=L.filter(ImageFilter.GaussianBlur(glow))
    if glowcol:
        a=G_.split()[3]; G_=Image.new('RGBA',im.size,glowcol+(0,)); G_.putalpha(a)
    im.paste(G_,(0,0),G_); im.paste(G_,(0,0),G_); im.paste(L,(0,0),L)
def shine(im,box,alpha=70,n=3):
    x0,y0,x1,y1=box; L=Image.new('RGBA',im.size,(0,0,0,0)); ld=ImageDraw.Draw(L); h=y1-y0; w=x1-x0
    for i in range(n):
        bx=x0+int(w*(0.12+0.34*i)); bw=70 if i%2==0 else 28
        ld.polygon([(bx+h*0.5,y0),(bx+h*0.5+bw,y0),(bx+bw,y1),(bx,y1)],fill=(255,255,255,alpha))
    m=Image.new('L',im.size,0); ImageDraw.Draw(m).rectangle(box,fill=255); L.putalpha(ImageChops.multiply(L.split()[3],m))
    im.paste(L,(0,0),L)
def glowspot(im,cx,cy,r,col=(255,255,255),a=200):
    L=Image.new('RGBA',im.size,col+(0,)); m=Image.new('L',im.size,0); ImageDraw.Draw(m).ellipse((cx-r,cy-r,cx+r,cy+r),fill=a); m=m.filter(ImageFilter.GaussianBlur(r*0.35)); c=Image.new('L',im.size,0); ImageDraw.Draw(c).rectangle((90,150,990,720),fill=255); L.putalpha(ImageChops.multiply(m,c)); im.paste(L,(0,0),L)
def metal(w,h,c0,c1,bands=7):
    sm=Image.new('RGB',(w//8+1,h//8+1)); px=sm.load()
    for y in range(sm.height):
        for x in range(sm.width):
            t=(math.sin((x*1.3+y)/(sm.width+sm.height)*bands*math.pi)+1)/2; px[x,y]=tuple(int(c0[i]+(c1[i]-c0[i])*t) for i in range(3))
    return sm.resize((w,h),Image.BILINEAR)
def hand(d,cx,cy,kind):
    sk=(255,217,176)
    def rr(x0,y0,x1,y1,r=18): d.rounded_rectangle((x0,y0,x1,y1),radius=r,fill=sk,outline=INK,width=6)
    if kind=='グー':
        rr(cx-46,cy-26,cx+46,cy+48,26)
        for i in range(4): rr(cx-46+i*23,cy-42,cx-46+i*23+23,cy-4,10)
        rr(cx-60,cy-2,cx-30,cy+32,12)
    elif kind=='チョキ':
        for sx in (-1,1):
            d.line((cx+sx*14,cy+12,cx+sx*32,cy-56),fill=INK,width=36); d.line((cx+sx*14,cy+12,cx+sx*32,cy-56),fill=sk,width=24)
        rr(cx-40,cy+4,cx+40,cy+54,24)
    else:
        for dx,top in ((-36,-38),(-12,-56),(12,-56),(36,-42)): rr(cx+dx-11,cy+top,cx+dx+11,cy+12,10)
        rr(cx-66,cy-6,cx-40,cy+26,12); rr(cx-48,cy-4,cx+48,cy+56,26)
def wrap(d,t,font,w):
    out=[];cur=''
    for ch in t:
        if d.textlength(cur+ch,font=font)>w and cur:
            if ch in '、。）」': cur+=ch; continue
            out.append(cur);cur=ch
        else: cur+=ch
    if cur: out.append(cur)
    return out
def ctext(d,y,t,font,fill,**k):
    w=d.textlength(t,font=font); d.text(((W-w)/2,y),t,font=font,fill=fill,**k)
def card(k,tier):
    t=T[k]; elem,jk,bp0,moves=G[k]; bp=1000 if tier==4 else bp0+BONUS[tier]
    Hh=2400; im=Image.new('RGB',(W,Hh),(234,241,244)); d=ImageDraw.Draw(im)
    x0,y0,x1,y1=90,150,990,720
    if tier==4:
        st=Image.new('RGB',(x1-x0,y1-y0),(255,244,190)); sd=ImageDraw.Draw(st); cx,cy=(x1-x0)//2,(y1-y0)//2+30
        for i in range(36):
            r_,g_,b_=colorsys.hsv_to_rgb(i/36,0.62,1); sd.pieslice((cx-900,cy-900,cx+900,cy+900),i*10,i*10+5,fill=(int(r_*255),int(g_*255),int(b_*255)))
        im.paste(st,(x0,y0)); glowspot(im,W//2,y0+cy,330,(255,255,255),255); glowspot(im,W//2,y0+cy,230,(255,246,170),230); shine(im,(x0,y0,x1,y1),60,3)
    elif tier==3: im.paste(rainbow(x1-x0,y1-y0,0.5).point(lambda v:int(v*0.35+165)),(x0,y0))
    else:
        d.rectangle((x0,y0,x1,y1),fill=(207,234,248)); d.rectangle((x0,y0+int((y1-y0)*0.74),x1,y1),fill=(243,223,174))
        if tier==2:
            sky=metal(x1-x0,int((y1-y0)*0.74),(178,222,246),(255,246,205),5); im.paste(sky,(x0,y0)); glowspot(im,W//2,y0+300,300,(255,250,215),235); shine(im,(x0,y0,x1,y1),95,3)
    d=ImageDraw.Draw(im); d.rectangle((x0,y0,x1,y1),outline=INK,width=8)
    s=Image.open(f'/home/claude/work/v2/{V2[k]}.png').convert('RGBA').resize((427,520),Image.LANCZOS); im.paste(s,(327,196),s)
    random.seed(tier*7+sum(map(ord,k)))
    items=[]
    for i in range({0:0,1:8,2:34,3:40,4:90}[tier]):
        while True:
            sx,sy=random.randint(x0+26,x1-26),random.randint(y0+84,y1-84)
            if not ((380<sx<700) if tier==4 else (330<sx<760)): break
        big=(tier==4 and i<14) or (tier==2 and i<7) or (tier==3 and i<6)
        col=WHITE if (tier!=2 or i%3) else (255,236,130)
        items.append((sx,sy,random.randint(34,54) if big else random.randint(9,26),col))
    if tier==1:
        for it in items: sparkle(d,it[0],it[1],it[2])
    elif tier>=2:
        draw_sparks(im,items,9 if tier==4 else 8,{2:(255,244,180),3:(255,255,255),4:(255,170,30)}[tier]); d=ImageDraw.Draw(im)
    d.ellipse((x0-34,y0-34,x0+96,y0+96),fill=ELEM[elem],outline=INK,width=8); w=d.textlength(elem,font=f(FB,76)); d.text((x0+31-w/2,y0-22),elem,font=f(FB,76),fill=WHITE)
    d.ellipse((x1-96,y0-34,x1+34,y0+96),fill=WHITE,outline=INK,width=8); hand(d,x1-31,y0+30,jk)
    ctext(d,y0-(44 if tier==4 else 30),f'BP {bp}',f(FB,104 if tier==4 else 84),YEL,stroke_width=11 if tier==4 else 9,stroke_fill=INK)
    lab={0:'',1:'★ 少しキラキラ',2:'★★ まぁまぁキラキラ',3:'★★★ メッチャキラキラ',4:'★★★★★ 最強キラキラ'}[tier]
    if lab:
        if tier==4:
            w=d.textlength(lab,font=f(FB,46)); d.rounded_rectangle(((W-w)/2-34,y1-84,(W+w)/2+34,y1-12),radius=36,fill=YEL,outline=INK,width=6); d.text(((W-w)/2,y1-82),lab,font=f(FB,46),fill=INK)
        else:
            w=d.textlength(lab,font=f(FB,40)); d.rounded_rectangle(((W-w)/2-26,y1-74,(W+w)/2+26,y1-14),radius=30,fill=INK,outline=(YEL if tier==2 else INK),width=4); d.text(((W-w)/2,y1-72),lab,font=f(FB,40),fill=YEL)
    ctext(d,746,'ジョブ：'+t['job'],f(FM,38),DEEP); ctext(d,798,t['name'],f(FB,68),INK)
    y=892
    for ln in wrap(d,t['catch'],f(FM,34),880): ctext(d,y,ln,f(FM,34),DEEP); y+=50
    y+=22
    # 必殺技（小さめ）
    d.rectangle((90,y,104,y+40),fill=ACC); d.text((118,y-6),'必殺技',font=f(FB,34),fill=INK); y+=58
    for name,atk,dfn in moves:
        d.rounded_rectangle((90,y,990,y+70),radius=18,fill=WHITE,outline=INK,width=4)
        d.text((112,y+13),name,font=f(FB,32),fill=INK)
        d.text((560,y+18),'攻撃力',font=f(FM,24),fill=(226,60,60)); d.text((640,y+10),str(atk),font=f(FB,34),fill=INK)
        d.text((770,y+18),'防御',font=f(FM,24),fill=(47,111,176)); d.text((826,y+10),str(dfn),font=f(FB,34),fill=INK)
        y+=82
    y+=18
    def sec(title,items,y,bullet=True):
        d.rectangle((90,y,108,y+50),fill=ACC); d.text((124,y-4),title,font=f(FB,40),fill=INK); y+=72
        for it in items:
            for i,ln in enumerate(wrap(d,it,f(FR,35),820 if bullet else 880)):
                if bullet and i==0: d.rectangle((104,y+18,122,y+36),fill=DEEP)
                d.text((146 if bullet else 100,y),ln,font=f(FR,35),fill=INK); y+=54
        return y+26
    y=sec('強み',t['strong'],y); y=sec('力を出しやすい働き方',t['fit'],y); y=sec('気をつけたいこと',[t['care']],y,False)
    d.line((90,y,990,y),fill=(207,219,227),width=3); y+=24
    ctext(d,y,'運営：株式会社行雲流水（大阪・泉大津｜FLOWCLOUD／glow）',f(FR,28),(90,107,128)); y+=84
    body=im.crop((0,0,W,y))
    # 枠
    if tier==4:
        out=rainbow(W,y,0.4,0.9,3.2); dd=ImageDraw.Draw(out)
        gold=metal(W,y,(214,158,18),(255,240,165),9); gm=Image.new('L',(W,y),0); ImageDraw.Draw(gm).rounded_rectangle((26,26,W-26,y-26),radius=44,fill=255); out.paste(gold,(0,0),gm)
        holo=rainbow(W,y,0.15,0.5,2.4).point(lambda v:int(v*0.16+214)); shine(holo,(0,0,W,y),90,3)
        keep=Image.eval(body.convert('L'),lambda v:255 if 236<=v<=242 else 0); ImageDraw.Draw(keep).rectangle((x0-40,y0-50,x1+40,y1),fill=0)
        body=Image.composite(holo,body,keep)
        mask=Image.new('L',(W,y),0); ImageDraw.Draw(mask).rounded_rectangle((46,46,W-46,y-46),radius=34,fill=255); out.paste(body,(0,0),mask)
        dd=ImageDraw.Draw(out); dd.rounded_rectangle((46,46,W-46,y-46),radius=34,outline=INK,width=5); dd.rounded_rectangle((24,24,W-24,y-24),radius=46,outline=INK,width=4)
        random.seed(99+sum(map(ord,k))); fr=[]
        for i in range(70):
            side=i%4; q=random.random()
            px_,py_={0:(q*W,random.randint(8,40)),1:(q*W,y-random.randint(8,40)),2:(random.randint(8,40),q*y),3:(W-random.randint(8,40),q*y)}[side]
            fr.append((int(px_),int(py_),random.randint(7,17),WHITE))
        for cx_,cy_ in ((66,66),(W-66,66),(66,y-66),(W-66,y-66)): fr.append((cx_,cy_,40,WHITE))
        for i in range(10): fr.append((random.randint(230,W-230),random.randint(62,104),random.randint(8,18),(255,226,90) if i%2 else WHITE))
        draw_sparks(out,fr,7)
    elif tier==2:
        out=Image.new('RGB',(W,y),(234,241,244)); gold=metal(W,y,(205,150,14),(255,238,160),9); gm=Image.new('L',(W,y),0); ImageDraw.Draw(gm).rounded_rectangle((12,12,W-12,y-12),radius=46,fill=255); out.paste(gold,(0,0),gm)
        mask=Image.new('L',(W,y),0); ImageDraw.Draw(mask).rounded_rectangle((34,34,W-34,y-34),radius=36,fill=255); out.paste(body,(0,0),mask); dd=ImageDraw.Draw(out); dd.rounded_rectangle((34,34,W-34,y-34),radius=36,outline=INK,width=5)
        random.seed(5+sum(map(ord,k))); fr=[]
        for i in range(36):
            side=i%4; q=random.random()
            px_,py_={0:(q*W,23),1:(q*W,y-23),2:(23,q*y),3:(W-23,q*y)}[side]; fr.append((int(px_),int(py_),random.randint(6,12),WHITE))
        draw_sparks(out,fr,5)
    elif tier>=3:
        out=rainbow(W,y,0.1*tier); mask=Image.new('L',(W,y),0); ImageDraw.Draw(mask).rounded_rectangle((34,34,W-34,y-34),radius=40,fill=255)
        out.paste(body,(0,0),mask); dd=ImageDraw.Draw(out); dd.rounded_rectangle((34,34,W-34,y-34),radius=40,outline=INK,width=6)
    else:
        col={0:INK,1:(170,182,196)}[tier]
        out=Image.new('RGB',(W,y),(234,241,244)); dd=ImageDraw.Draw(out); dd.rounded_rectangle((12,12,W-12,y-12),radius=46,fill=col)
        mask=Image.new('L',(W,y),0); ImageDraw.Draw(mask).rounded_rectangle((34,34,W-34,y-34),radius=36,fill=255); out.paste(body,(0,0),mask); dd.rounded_rectangle((34,34,W-34,y-34),radius=36,outline=INK,width=5)
    return out
names={}
prev=Image.new('RGB',(8*272+8,5*500+8),'white')
for ci,k in enumerate(T):
    for tier in range(5):
        im=card(k,tier); fn=f"g_{T[k]['key']}_{tier}.png"; im.save(fn,optimize=True); names[(k,tier)]=fn
        prev.paste(im.resize((264,int(im.height*264/W)),Image.LANCZOS).crop((0,0,264,492)),(8+ci*272,8+tier*500))
prev.save('all_preview.png')
big=Image.new('RGB',(3*550+10,1010),'white')
for n,(k,tier) in enumerate((('HSF',2),('TSL',3),('TCF',4))):
    im=Image.open(names[(k,tier)]); big.paste(im.resize((540,int(im.height*540/W)),Image.LANCZOS),(10+n*550,10))
big.save('three.png'); import os; print(max(os.path.getsize(v) for v in names.values()), Image.open(names[('TSL',0)]).size)
