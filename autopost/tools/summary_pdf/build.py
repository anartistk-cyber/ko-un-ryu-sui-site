import json, html, os, sys
# 使い方: python3 build.py [データのフォルダ] [出力HTML]
HERE=os.path.dirname(os.path.abspath(__file__))
D=(sys.argv[1] if len(sys.argv)>1 else HERE+'/data').rstrip('/')+'/'
OUT=sys.argv[2] if len(sys.argv)>2 else 'summary.html'
META=json.load(open(D+'meta.json',encoding='utf-8'))
L=lambda n: json.load(open(D+n+'.json',encoding='utf-8'))
kpi,motive,coupons,speed,channels,search,fixes,todo,ideas=[L(n) for n in ['hpb_kpi','motive','coupons','speed','channels','search','fixes','todo','coupon_ideas']]
e=html.escape
A,B,M='#2F5D8A','#C9772B','#B7BDC6'
W=680
def hbars(groups,mx,w=520,valW=92,fs=9.2,nameWw=62):
    named=any(b.get('name') for g in groups for b in g['bars'])
    nameW=nameWw if named else 0
    rowH,gap,gg,labH=13,3,10,16
    y=0;out=[]
    sc=lambda v:(w-nameW-valW)*v/mx
    for g in groups:
        if g.get('label'):
            out.append(f'<text x="0" y="{y+11}" class="g">{e(g["label"])}</text>'); y+=labH
        for b in g['bars']:
            if b.get('name'): out.append(f'<text x="0" y="{y+rowH-3}" class="m">{e(b["name"])}</text>')
            bw=max(2,sc(b['value'])) if b['value']>0 else 0
            out.append(f'<rect x="{nameW}" y="{y}" width="{bw:.1f}" height="{rowH}" rx="2" fill="{b["color"]}"/>')
            out.append(f'<text x="{nameW+bw+4:.1f}" y="{y+rowH-3}" class="v">{e(b["text"])}</text>')
            y+=rowH+gap
        y+=gg-gap
    h=y-gg+gap
    return f'<svg viewBox="0 0 {w} {h}" width="100%" style="font-size:{fs}px" xmlns="http://www.w3.org/2000/svg">{"".join(out)}</svg>'
def kv(shop,metric):
    return next(r for r in kpi if r['shop']==shop and r['metric']==metric)
def tile(shop,metric,unit,fmt):
    r=kv(shop,metric)
    return f'<div class="tile"><div class="tl">{shop}</div><div class="big">{fmt(r["own"])}<span class="u">{unit}</span></div><div class="avg">同条件の平均 {fmt(r["avg"])}{unit}</div></div>'
f1=lambda v:f'{v:.1f}'; f0=lambda v:f'{int(v):,}'
motive_svg=hbars([{'label':r['motive'],'bars':[{'name':'FLOWCLOUD','value':r['fc_pct'],'text':f"{r['fc_pct']}%（{r['fc_people']}人）",'color':A},{'name':'glow','value':r['glow_pct'],'text':f"{r['glow_pct']}%（{r['glow_people']}人）",'color':B}]} for r in motive],max(max(r['fc_pct'],r['glow_pct']) for r in motive))
def cp(shop):
    rows=sorted([r for r in coupons if r['shop']==shop],key=lambda r:r['rank'])
    return hbars([{'label':r['coupon'],'bars':[{'value':r['bookings'],'text':f"{r['bookings']}件",'color':M if r['kind']=='other' else A}]} for r in rows],max(r['bookings'] for r in rows),w=290,valW=34,fs=8.8), rows[0]['total']
fc_svg,fc_tot=cp('FLOWCLOUD'); gl_svg,gl_tot=cp('glow')
chan_svg=hbars([{'label':r['channel'],'bars':[{'name':'セッション','value':r['sessions'],'text':str(r['sessions']),'color':A},{'name':'キーイベント','value':r['key_events'],'text':str(r['key_events']),'color':B}]} for r in channels],max(r['sessions'] for r in channels))
score_svg=hbars([{'label':r['site'],'bars':[{'name':'改善前','value':r['score_before'],'text':f"{r['score_before']}点",'color':M},{'name':'改善後','value':r['score_after'],'text':f"{r['score_after']}点",'color':A}]} for r in speed],100,w=290,valW=40,fs=8.8,nameWw=40)
lcp_svg=hbars([{'label':r['site'],'bars':[{'name':'改善前','value':r['lcp_before'],'text':f"{r['lcp_before']:.1f}秒",'color':M},{'name':'改善後','value':r['lcp_after'],'text':f"{r['lcp_after']:.1f}秒",'color':A}]} for r in speed],max(r['lcp_before'] for r in speed),w=290,valW=40,fs=8.8,nameWw=40)
srch=''.join(f'<tr><td>{e(r["label"])}</td><td class="n">{r["impressions"]:,}</td><td class="n">{r["clicks"]:,}</td><td class="n">{r["position"]:.1f}</td></tr>' for r in search)
fx=''.join(f'<div class="it"><div class="s">{e(r["area"])}</div><div>{e(r["what"])}</div><div class="s2"><b>{e(r["count"])}</b>　{e(r["status"])}</div></div>' for r in fixes)
td=''.join(f'<div class="it"><div>{e(r["proposal"])}</div><div class="s2"><b>{e(r["owner"])}</b>　{e(r["measure"])}</div></div>' for r in todo)
idl=''.join(f'<div class="it"><div class="s"><b>{e(r["shop"])}</b></div><div>{e(r["idea"])}</div><div class="s2">{e(r["basis"])}</div></div>' for r in ideas)
page=f'''<!doctype html><html lang="ja"><meta charset="utf-8"><title>{e(META['title'])}</title>
<style>
@page{{size:A4;margin:13mm 14mm}}
*{{box-sizing:border-box}}
body{{margin:0;font-family:"Noto Sans CJK JP","IPAGothic",sans-serif;font-size:9.6pt;line-height:1.55;color:#1d2530}}
h1{{font-size:19pt;font-weight:500;margin:0 0 2px;line-height:1.25}}
h2{{font-size:12pt;font-weight:700;margin:0 0 3px;line-height:1.35}}
h3{{font-size:9.8pt;font-weight:700;margin:8px 0 3px}}
p{{margin:0}}
.sub,.note,.s,.s2,.foot{{color:#5d6773}}
.sub,.note{{font-size:8.4pt}}
.take{{margin-top:6px;padding:8px 10px;background:#eef3f8;border-radius:5px}}
.card{{border:1px solid #d4dae1;border-radius:6px;padding:10px 12px;margin-top:10px;break-inside:auto}}
h2,h3{{break-after:avoid}}
.card.flow{{break-inside:auto}}
.tiles{{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:4px}}
.tile{{border:1px solid #d4dae1;border-radius:5px;padding:6px 10px}}
.tl{{font-size:8.4pt;color:#5d6773}}
.big{{font-size:24pt;line-height:1.15;font-weight:500}}
.u{{font-size:10pt;color:#5d6773;margin-left:2px}}
.avg{{font-size:8.4pt;color:#5d6773}}
svg text{{font-family:"Noto Sans CJK JP","IPAGothic",sans-serif;font-size:inherit;fill:#1d2530}}
svg{{break-inside:avoid;display:block}}
svg .g{{font-weight:700}}
svg .m{{fill:#5d6773}}
table{{width:100%;border-collapse:collapse;font-size:8.8pt;margin-top:4px}}
th{{text-align:left;color:#5d6773;font-weight:500;padding:0 0 3px;border-bottom:1px solid #d4dae1}}
td{{padding:3px 0;border-bottom:1px solid #eceff3}}
.n{{text-align:right;font-variant-numeric:tabular-nums;padding-left:10px;white-space:nowrap}}
th.n{{text-align:right}}
.it{{padding:6px 0;border-top:1px solid #eceff3;break-inside:avoid}}
.it:first-of-type{{border-top:0}}
.s,.s2{{font-size:8.4pt}}
.foot{{font-size:8pt;margin-top:10px}}
.cols{{display:grid;grid-template-columns:1fr 1fr;gap:12px}}
</style>
<h1>{e(META['title'])}</h1>
<p class="sub">{e(META['sub'])}</p>
<p class="take">{e(META['take'])}</p>

<div class="card"><h2>今月の数字：ホットペッパー</h2>
<p class="note">「同条件の平均」は、SALON BOARDの「同P同A平均」（同じ掲載プラン・同じエリアの平均）です。ACRは、クーポンを見た人のうち予約完了まで進んだ割合です。</p>
<h3>予約まで進んだ割合（ACR）</h3><div class="tiles">{tile('FLOWCLOUD','acr','%',f1)}{tile('glow','acr','%',f1)}</div>
<h3>ホットペッパー経由のネット予約</h3><div class="tiles">{tile('FLOWCLOUD','bookings','件',f0)}{tile('glow','bookings','件',f0)}</div></div>

<div class="card"><h2>新規のお客様は、どこから来た？</h2>
<p class="note">初回来店の来店動機（SalonAnswer・10月・構成比と人数）。glowは「不明」が多く、きっかけが分かる人が約4割です。</p>{motive_svg}</div>

<div class="card"><h2>どのクーポンが予約を取った？</h2>
<p class="note">クーポン別のネット予約数（SALON BOARDのサロンレポート・10月号）。</p>
<div class="cols"><div><h3>FLOWCLOUD（合計 {fc_tot}件）</h3>{fc_svg}</div><div><h3>glow（合計 {gl_tot}件）</h3>{gl_svg}</div></div></div>

<div class="card"><h2>サイトへの流入と検索</h2>
<p class="note">流入元はGA4（3サイト合計・直近28日）。「キーイベント」は予約・電話・LINEなどのボタンを押した数です。</p>{chan_svg}
<h3>検索の表示回数・クリック・順位（参考）</h3>
<p class="note">Search Consoleの登録が新しく、実データは数日分です。表示回数が少ないので、順位は目安として見てください。</p>
<table><tr><th>検索語</th><th class="n">表示</th><th class="n">クリック</th><th class="n">順位</th></tr>{srch}</table></div>

<div class="card"><h2>表示速度（スマホ）</h2>
<p class="note">PageSpeed Insights（スマホ・低速4G想定）。点数は高いほど、LCP（メインの画像が出るまで）は短いほど良い結果です。</p>
<div class="cols"><div><h3>点数（100点満点）</h3>{score_svg}</div><div><h3>LCP（秒）</h3>{lcp_svg}</div></div></div>

<div class="card flow"><h2>修正した内容</h2>{fx}
<p class="note" style="margin-top:4px">ホットペッパーの反映は、申請から約20分で公開ページに出ます。金額・お客様の個人名はこの資料に載せていません。</p></div>

<div class="card flow"><h2>新たにやること（提案）</h2>{td}</div>

<div class="card flow"><h2>クーポンの見直し案</h2>
<p class="note">まだホットペッパーには反映していません。藤津さんの了承後に実施します（実施前に、変更前の題名・価格を記録します）。</p>{idl}</div>

<p class="foot">{e(META['foot'])}</p>
</html>'''
open(OUT,'w',encoding='utf-8').write(page)
