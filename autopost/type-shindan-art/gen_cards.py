import json,re,base64,io
from PIL import Image,ImageDraw,ImageFont
h=open('/home/claude/biyoshi-type-shindan/index.html').read()
T=json.loads(re.search(r'const TYPES=(\{.*?\});\n',h,re.S).group(1))
V2={'TCF':'creator','TCL':'innovator','TSF':'artist','TSL':'meister','HCF':'entertainer','HCL':'producer','HSF':'partner','HSL':'advisor'}
FB='/usr/share/fonts/opentype/noto/NotoSansCJK-Black.ttc'; FM='/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc'; FR='/usr/share/fonts/opentype/noto/NotoSansCJK-Medium.ttc'
f=lambda p,s:ImageFont.truetype(p,s,index=0)
INK=(21,36,59);DEEP=(29,78,120);MUTED=(90,107,128);ACC=(233,165,20);BG=(234,241,244);LINE=(207,219,227)
Wd=1080
def wrap(d,t,font,w):
    out=[];cur=''
    for ch in t:
        if d.textlength(cur+ch,font=font)>w and cur:
            if ch in '、。）」': cur+=ch; continue
            out.append(cur);cur=ch
        else: cur+=ch
    if cur: out.append(cur)
    return out
def center(d,y,t,font,fill):
    w=d.textlength(t,font=font); d.text(((Wd-w)/2,y),t,font=font,fill=fill)
def card(k):
    t=T[k]; im=Image.new('RGB',(Wd,2400),BG); d=ImageDraw.Draw(im)
    center(d,78,'美容師タイプ診断  結果カード',f(FM,34),DEEP)
    x0,y0,x1,y1=90,150,990,650
    d.rectangle((x0,y0,x1,y1),fill=(207,234,248))
    d.rectangle((x0,y0+int((y1-y0)*0.72),x1,y1),fill=(243,223,174))
    d.rectangle((x0,y0,x1,y1),outline=INK,width=8)
    s=Image.open(f'v2/{V2[k]}.png').convert('RGBA').resize((394,480),Image.LANCZOS)
    im.paste(s,(343,162),s)
    center(d,682,'ジョブ：'+t['job'],f(FM,40),DEEP)
    center(d,742,t['name'],f(FB,70),INK)
    y=850
    for ln in wrap(d,t['catch'],f(FM,36),880): center(d,y,ln,f(FM,36),DEEP); y+=54
    y+=30
    def sec(title,items,y,bullet=True):
        d.rectangle((90,y,90+18,y+50),fill=ACC); d.text((124,y-4),title,font=f(FB,40),fill=INK); y+=74
        for it in items:
            lines=wrap(d,it,f(FR,36),820 if bullet else 880)
            for i,ln in enumerate(lines):
                if bullet and i==0: d.rectangle((104,y+18,122,y+36),fill=DEEP)
                d.text((146 if bullet else 100,y),ln,font=f(FR,36),fill=INK); y+=56
        return y+34
    y=sec('強み',t['strong'],y); y=sec('力を出しやすい働き方',t['fit'],y); y=sec('気をつけたいこと',[t['care']],y,False)
    d.line((90,y,990,y),fill=LINE,width=3); y+=26
    center(d,y,'運営：株式会社行雲流水（大阪・泉大津｜FLOWCLOUD／glow）',f(FR,28),MUTED); y+=80
    im=im.crop((0,0,Wd,y)); d=ImageDraw.Draw(im)
    d.rounded_rectangle((24,24,Wd-24,y-24),radius=36,outline=INK,width=8)
    return im
names={}
ims=[]
for k,t in T.items():
    im=card(k); fn=f"card2_{t['key']}.png"; im.save(fn,optimize=True); ims.append(im); names[k]=fn
Hm=max(i.height for i in ims)
sh=Image.new('RGB',(Wd*4//3,Hm//3),'white')
for n,i in enumerate(ims[:4]): sh.paste(i.resize((Wd//3,i.height//3)),(n*Wd//3,0))
sh.save('cards2_preview.png'); print(names,[i.size for i in ims])
