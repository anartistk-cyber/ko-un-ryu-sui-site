#!/usr/bin/env python3
"""配って使う「美容師タイプカード」（名刺サイズ 91×55mm・表裏・8タイプ）を作る。美容学校・勉強会・取引先・サロンで手渡し用。
表：キャラクター＋ジョブ名＋タイプ名＋属性・じゃんけん・BP・必殺技2つ（LINE の結果カードと同じ設定。BP は基本値＝キラキラなし）
裏：そのタイプの「強み」「向いている環境」＋診断ページのQR（タイプごとに utm_content が違う＝どのカードから来たか数えられる）
文面は診断ページの TYPES の文章と、LINE の結果カードの設定（gen_game_cards.py の G）だけを使う。新しい事実・数字・効果の保証は書かない。
出力：autopost/type-shindan-card/type_cards_meishi_91x55.pdf（仕上がりサイズ・16ページ＝タイプごとに 表→裏）
      autopost/type-shindan-card/type_cards_meishi_bleed3mm.pdf（印刷会社用・塗り足し3mm＝97×61mm）
      autopost/type-shindan-card/type_cards_preview.png（確認用・表8枚＋裏8枚）
使い方：python3 autopost/type-shindan-card/make-type-cards.py
"""
import base64, html, io, json, os, re
import qrcode
from PIL import Image
from playwright.sync_api import sync_playwright

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, "..", ".."))
ART = os.path.join(ROOT, "autopost", "type-shindan-art")
src = open(os.path.join(ROOT, "client", "public", "type-shindan", "index.html"), encoding="utf-8").read()
TYPES = json.loads(re.search(r"const TYPES=(\{.*?\});\n", src, re.S).group(1))
SVG = {"クリエイター": "creator", "イノベーター": "innovator", "アーティスト": "artist", "マイスター": "meister",
       "エンターテイナー": "entertainer", "プロデューサー": "producer", "パートナー": "partner", "アドバイザー": "advisor"}
# LINE の結果カード（gen_game_cards.py）と同じ：属性・じゃんけん・基本BP・必殺技（名前, 攻撃力, 防御）
G = {"TCF": ("火", "チョキ", 500, [("ひらめきカット", 180, 80), ("トレンド先取り", 150, 100)]),
     "TCL": ("金", "グー", 550, [("薬剤コントロール", 160, 120), ("原因つきとめ分析", 110, 170)]),
     "TSF": ("木", "チョキ", 500, [("色彩マジック", 190, 70), ("世界観メイク", 140, 120)]),
     "TSL": ("金", "チョキ", 550, [("ミリ単位カット", 180, 90), ("艶出しブロー", 120, 160)]),
     "HCF": ("火", "グー", 450, [("笑顔トーク", 150, 110), ("場をあたためる一言", 100, 160)]),
     "HCL": ("土", "グー", 600, [("チーム号令", 170, 110), ("段取りマスター", 110, 180)]),
     "HSF": ("水", "パー", 500, [("寄りそいヒアリング", 100, 200), ("いやしのシャンプー", 130, 170)]),
     "HSL": ("水", "パー", 550, [("見立てカウンセリング", 140, 160), ("ホームケア処方", 110, 180)])}
ELEM = {"火": "#e23c3c", "水": "#2f6fb0", "木": "#2f8f5b", "金": "#d4a017", "土": "#96683a"}
e = html.escape


def qr_uri(code):
    url = f"https://ko-un-ryu-sui.com/type-shindan/?utm_source=card&utm_medium=offline&utm_campaign=type_card&utm_content={code.lower()}"
    q = qrcode.QRCode(box_size=14, border=0, error_correction=qrcode.constants.ERROR_CORRECT_M)
    q.add_data(url); q.make(fit=True)
    im = q.make_image(fill_color="#15243b", back_color="white").convert("RGB")
    b = io.BytesIO(); im.save(b, "PNG")
    return "data:image/png;base64," + base64.b64encode(b.getvalue()).decode(), url


def svg_of(t):
    s = open(os.path.join(ART, SVG[t["key"]] + ".svg"), encoding="utf-8").read()
    return re.sub(r'\s(width|height)="[^"]*"', "", s, count=2)


def front(code, t):
    el, jk, bp, moves = G[code]
    col = ELEM[el]
    mv = "".join(f'<div class="mv"><span>{e(n)}</span><i>攻{a}</i><i>防{d}</i></div>' for n, a, d in moves)
    return f"""<section class="page front" style="--el:{col}"><div class="bg"></div><div class="ground"></div>
<div class="trim">
<div class="chara">{svg_of(t)}</div>
<div class="r">
<span class="pill">美容師タイプ診断</span>
<div class="job">{e(t['job'])}</div>
<div class="name">{e(t['name'])}</div>
<div class="bd"><span class="el">属性 {el}</span><span>{jk}</span><span>基本BP {bp}</span></div>
<div class="mvs"><div class="mh">必殺技</div>{mv}</div>
<div class="ask">あなたは何タイプ？ 裏のQRで診断 ▶</div>
</div></div></section>"""


def back(code, t):
    el = G[code][0]; col = ELEM[el]
    qr, _ = qr_uri(code)
    lis = lambda xs: "".join(f"<li>{e(x)}</li>" for x in xs)
    return f"""<section class="page back" style="--el:{col}"><div class="bg"></div>
<div class="trim">
<div class="l">
<div class="tag">美容師タイプ診断（無料・20問・約2分）</div>
<div class="h">あなたは何タイプ？</div>
<div class="mine"><b>{e(t['job'])}</b>｜{e(t['name'])}</div>
<div class="sec"><h4>強み</h4><ul>{lis(t['strong'])}</ul></div>
<div class="sec"><h4>向いている環境</h4><ul>{lis(t['fit'])}</ul></div>
</div>
<div class="q"><div class="qb"><img src="{qr}" alt=""></div><div class="qc">QRを読み取って診断</div><div class="qs">結果カードはLINEで届きます</div></div>
<div class="ft"><b>株式会社行雲流水</b>（FLOWCLOUD・glow）　ko-un-ryu-sui.com</div>
</div></section>"""


CSS = """
@page{size:calc(91mm + 2*var(--b)) calc(55mm + 2*var(--b));margin:0}
*{box-sizing:border-box;margin:0;padding:0}
html,body{background:#fff}
body{font-family:"Noto Sans CJK JP","Noto Sans JP",sans-serif;color:#15243b;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.page{width:calc(91mm + 2*var(--b));height:calc(55mm + 2*var(--b));position:relative;overflow:hidden;page-break-after:always;break-after:page}
.page:last-child{page-break-after:auto;break-after:auto}
.bg{position:absolute;inset:0}
.front .bg{background:linear-gradient(#d9eefb,#bfe1f5)}
.front .ground{position:absolute;left:0;right:0;bottom:0;height:calc(11mm + var(--b));background:#f1dfb0}
.back .bg{background:#eaf1f4}
.trim{position:absolute;left:var(--b);top:var(--b);width:91mm;height:55mm}
/* 表 */
.chara{position:absolute;left:1.5mm;top:2.5mm;width:41mm;height:50mm}
.chara svg{width:100%;height:100%}
.r{position:absolute;left:44mm;top:4.2mm;right:3.6mm;bottom:3.2mm;display:flex;flex-direction:column;gap:1.5mm}
.pill{align-self:flex-start;background:#e9a514;color:#3a2a00;font-weight:900;font-size:6pt;letter-spacing:.06em;padding:.5mm 2.4mm;border-radius:99px}
.job{font-weight:900;font-size:15pt;line-height:1.1;color:#15243b;text-shadow:0 .35mm 0 #fff;margin-top:.3mm}
.name{font-weight:900;font-size:7.4pt;color:#1d4e78;margin-top:-.4mm}
.bd{display:flex;gap:1.2mm;flex-wrap:wrap}
.bd span{background:#fff;border:.25mm solid #1d4e78;border-radius:99px;padding:.3mm 1.9mm;font-weight:800;font-size:6.2pt;color:#1d4e78;line-height:1.35}
.bd .el{background:var(--el);border-color:var(--el);color:#fff}
.mvs{background:rgba(255,255,255,.82);border:.25mm solid #1d4e78;border-radius:1.6mm;padding:1mm 1.8mm;display:flex;flex-direction:column;gap:.5mm}
.mh{font-size:5.6pt;font-weight:900;color:#1d4e78;letter-spacing:.2em}
.mv{display:flex;align-items:baseline;gap:1.2mm;font-size:6.4pt;font-weight:800;line-height:1.35}
.mv span{flex:1}.mv i{font-style:normal;font-weight:900;font-size:6pt;color:#1d4e78}
.ask{margin-top:auto;font-size:6pt;font-weight:900;color:#1d4e78}
/* 裏 */
.l{position:absolute;left:4.2mm;top:3.8mm;width:55mm;display:flex;flex-direction:column;gap:.95mm}
.tag{align-self:flex-start;background:#e9a514;color:#3a2a00;font-weight:900;font-size:5.8pt;padding:.4mm 2.2mm;border-radius:99px;letter-spacing:.03em}
.h{font-weight:900;font-size:12.5pt;line-height:1.15;color:#1d4e78;margin-top:.2mm}
.mine{font-size:6.8pt;font-weight:700;border-left:1mm solid var(--el);padding-left:1.6mm;line-height:1.3}
.mine b{font-weight:900;font-size:7.8pt}
.sec h4{font-size:6.6pt;font-weight:900;color:#1d4e78;margin-bottom:.2mm}
.sec ul{list-style:none}
.sec li{font-size:6.3pt;line-height:1.4;padding-left:2.2mm;position:relative}
.sec li:before{content:"";position:absolute;left:.3mm;top:1.05mm;width:.9mm;height:.9mm;border-radius:50%;background:var(--el)}
.q{position:absolute;right:3.6mm;top:4.2mm;width:27mm;text-align:center}
.qb{background:#fff;border:.35mm solid #1d4e78;border-radius:1.8mm;padding:1.6mm;width:27mm;height:27mm}
.qb img{width:100%;height:100%;display:block}
.qc{margin-top:1.3mm;font-size:6.2pt;font-weight:900;color:#1d4e78}
.qs{margin-top:.5mm;font-size:5.6pt;color:#33455c;line-height:1.35}
.ft{position:absolute;left:4.2mm;right:3.6mm;bottom:3mm;font-size:5.8pt;color:#33455c;border-top:.2mm solid #cfdbe3;padding-top:.9mm}
.ft b{color:#1d4e78}
"""


def doc(bleed_mm, pages):
    return f'<!doctype html><html lang="ja"><meta charset="utf-8"><style>:root{{--b:{bleed_mm}mm}}{CSS}</style><body>{"".join(pages)}</body></html>'


pages = []
for code, t in TYPES.items():
    pages += [front(code, t), back(code, t)]

with sync_playwright() as pw:
    br = pw.chromium.launch()
    for name, b in (("type_cards_meishi_91x55.pdf", 0), ("type_cards_meishi_bleed3mm.pdf", 3)):
        pg = br.new_page()
        pg.set_content(doc(b, pages)); pg.wait_for_timeout(500)
        w, h = 91 + 2 * b, 55 + 2 * b
        pg.pdf(path=os.path.join(HERE, name), width=f"{w}mm", height=f"{h}mm", print_background=True, margin={"top": "0", "bottom": "0", "left": "0", "right": "0"})
        pg.close()
    # 確認用：仕上がりサイズの各面を画像にして、表8枚・裏8枚の一覧にする
    pg = br.new_page(viewport={"width": 345, "height": 208}, device_scale_factor=4)
    shots = []
    for i, p in enumerate(pages):
        pg.set_content(doc(0, [p])); pg.wait_for_timeout(120)
        b = io.BytesIO(); pg.screenshot(path=None) if False else None
        png = pg.screenshot(clip={"x": 0, "y": 0, "width": 344, "height": 208}); shots.append(Image.open(io.BytesIO(png)).convert("RGB"))
    br.close()
w, h = shots[0].size
sc = 0.5
tw, th = int(w * sc), int(h * sc)
sheet = Image.new("RGB", (tw * 4 + 50, th * 4 + 50), "#9aa7b4")
for i, im in enumerate(shots):
    t_i, side = divmod(i, 2)                     # タイプ番号・0=表 1=裏
    row = side * 2 + t_i // 4                    # 上2段＝表、下2段＝裏
    col = t_i % 4
    sheet.paste(im.resize((tw, th)), (10 + col * (tw + 10), 10 + row * (th + 10)))
sheet.save(os.path.join(HERE, "type_cards_preview.png"))
print("done", len(pages), "faces")
