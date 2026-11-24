#!/usr/bin/env python3
"""配って使う「美容師タイプ診断」のQRカード（名刺サイズ 91×55mm・表裏・1種類）を作る。美容学校・勉強会・取引先・サロンで手渡し用。
A6版（make-card.py）の名刺サイズ版。表＝8つのジョブのキャラクターと「あなたは美容師の何タイプ？」／裏＝QR（スマホで読み取ってスタート）。
文面は A6版・診断ページと同じ事実だけ（無料・20問・約2分・お名前の入力なし・8つのジョブ・結果カードはLINEで受け取れる）。効果の保証や他社比較は書かない。
QR の行き先：診断ページ ＋ utm_source=card&utm_medium=offline&utm_campaign=type_shindan_card&utm_content=meishi（A6版と区別するため meishi）。UTM は autopost/UTM_LINKS.md。
出力：autopost/type-shindan-card/qr_card_meishi_91x55.pdf（仕上がりサイズ・2ページ＝表→裏）
      autopost/type-shindan-card/qr_card_meishi_bleed3mm.pdf（印刷会社用・塗り足し3mm＝97×61mm）
      autopost/type-shindan-card/qr_card_meishi_preview.png（確認用・表と裏）
使い方：python3 autopost/type-shindan-card/make-qr-meishi.py
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
URL = "https://ko-un-ryu-sui.com/type-shindan/?utm_source=card&utm_medium=offline&utm_campaign=type_shindan_card&utm_content=meishi"


def qr_uri():
    q = qrcode.QRCode(box_size=14, border=0, error_correction=qrcode.constants.ERROR_CORRECT_M)
    q.add_data(URL); q.make(fit=True)
    im = q.make_image(fill_color="#15243b", back_color="white").convert("RGB")
    b = io.BytesIO(); im.save(b, "PNG")
    return "data:image/png;base64," + base64.b64encode(b.getvalue()).decode()


def svg_of(t):
    s = open(os.path.join(ART, SVG[t["key"]] + ".svg"), encoding="utf-8").read()
    return re.sub(r'\s(width|height)="[^"]*"', "", s, count=2)


def front():
    row = "".join(f'<div class="c" title="{html.escape(t["job"])}">{svg_of(t)}</div>' for t in TYPES.values())
    return f"""<section class="page front"><div class="bg"></div><div class="ground"></div>
<div class="trim">
<div class="top">
<span class="pill">美容師・美容学生のための無料診断</span>
<div class="h1"><small>あなたは</small>美容師の何タイプ？</div>
<p class="lead">仕事で大事にしていることから、8つのジョブがわかります。</p>
<div class="pts"><span>無料</span><span>20問・約2分</span><span>お名前の入力なし</span></div>
</div>
<div class="row">{row}</div>
</div></section>"""


def back():
    return f"""<section class="page back"><div class="bg"></div>
<div class="trim">
<div class="qb"><img src="{qr_uri()}" alt=""></div>
<div class="r">
<div class="go">スマホで読み取って<br>スタート</div>
<p class="lead2">仕事で大事にしていることから、<br>8つのジョブと、今の働き方の<br>充実度がわかります。<br>結果カードはLINEで受け取れます。</p>
<div class="pts"><span>無料</span><span>20問・約2分</span></div>
</div>
<div class="ft"><b>株式会社行雲流水</b>（FLOWCLOUD・glow）　ko-un-ryu-sui.com/type-shindan/</div>
</div></section>"""


CSS = """
*{box-sizing:border-box;margin:0;padding:0}
html,body{background:#fff}
body{font-family:"Noto Sans CJK JP","Noto Sans JP",sans-serif;color:#15243b;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.page{width:calc(91mm + 2*var(--b));height:calc(55mm + 2*var(--b));position:relative;overflow:hidden;page-break-after:always;break-after:page}
.page:last-child{page-break-after:auto;break-after:auto}
.bg{position:absolute;inset:0}
.front .bg{background:linear-gradient(#d9eefb,#bfe1f5)}
.front .ground{position:absolute;left:0;right:0;bottom:0;height:calc(10.5mm + var(--b));background:#f1dfb0}
.back .bg{background:#eaf1f4}
.trim{position:absolute;left:var(--b);top:var(--b);width:91mm;height:55mm}
.pill{display:inline-block;background:#e9a514;color:#3a2a00;font-weight:900;font-size:6pt;letter-spacing:.06em;padding:.5mm 2.6mm;border-radius:99px}
.pts{display:flex;gap:1.3mm;flex-wrap:wrap}
.pts span{background:#fff;border:.25mm solid #1d4e78;border-radius:99px;padding:.35mm 2mm;font-weight:800;font-size:6.2pt;color:#1d4e78;line-height:1.35}
/* 表 */
.top{position:absolute;left:4.2mm;top:3.8mm;right:4.2mm;display:flex;flex-direction:column;gap:1.3mm;align-items:flex-start}
.h1{font-weight:900;font-size:17pt;line-height:1.12;color:#1d4e78;text-shadow:0 .35mm 0 #fff;white-space:nowrap}
.h1 small{display:block;font-size:9pt;color:#15243b;letter-spacing:.05em;margin-bottom:.3mm}
.lead{font-size:6.8pt;font-weight:700;color:#33455c;line-height:1.4}
.row{position:absolute;left:0;right:0;bottom:3mm;height:15mm;display:flex;justify-content:center}
.c{flex:0 0 12.2mm;margin-left:-2mm}
.c:first-child{margin-left:0}
.c svg{width:100%;height:100%;display:block}
/* 裏 */
.qb{position:absolute;left:4.4mm;top:50%;margin-top:-14.4mm;width:28.8mm;height:28.8mm;background:#fff;border:.35mm solid #1d4e78;border-radius:2mm;padding:1.7mm}
.qb img{width:100%;height:100%;display:block}
.r{position:absolute;left:37.6mm;top:8.6mm;right:4.2mm;display:flex;flex-direction:column;gap:2.1mm}
.go{font-weight:900;font-size:12.5pt;line-height:1.25;color:#1d4e78}
.lead2{font-size:6.4pt;line-height:1.6;color:#33455c;white-space:nowrap}
.ft{position:absolute;left:4.2mm;right:4.2mm;bottom:3mm;font-size:5.8pt;color:#5a6b80;text-align:right}
.ft b{color:#1d4e78}
"""


def doc(b, pages):
    return f'<!doctype html><html lang="ja"><meta charset="utf-8"><style>@page{{size:calc(91mm + 2*{b}mm) calc(55mm + 2*{b}mm);margin:0}}:root{{--b:{b}mm}}{CSS}</style><body>{"".join(pages)}</body></html>'


pages = [front(), back()]
with sync_playwright() as pw:
    br = pw.chromium.launch()
    for name, b in (("qr_card_meishi_91x55.pdf", 0), ("qr_card_meishi_bleed3mm.pdf", 3)):
        pg = br.new_page()
        pg.set_content(doc(b, pages)); pg.wait_for_timeout(500)
        pg.pdf(path=os.path.join(HERE, name), width=f"{91 + 2 * b}mm", height=f"{55 + 2 * b}mm", print_background=True,
               margin={"top": "0", "bottom": "0", "left": "0", "right": "0"})
        pg.close()
    pg = br.new_page(viewport={"width": 344, "height": 208}, device_scale_factor=4)
    shots = []
    for p in pages:
        pg.set_content(doc(0, [p])); pg.wait_for_timeout(150)
        shots.append(Image.open(io.BytesIO(pg.screenshot(clip={"x": 0, "y": 0, "width": 344, "height": 208}))).convert("RGB"))
    br.close()
w, h = shots[0].size
sheet = Image.new("RGB", (w * 2 + 30, h + 20), "#9aa7b4")
for i, im in enumerate(shots):
    sheet.paste(im, (10 + i * (w + 10), 10))
sheet.save(os.path.join(HERE, "qr_card_meishi_preview.png"))
print("done")
