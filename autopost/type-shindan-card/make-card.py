#!/usr/bin/env python3
"""配って使う「美容師タイプ診断」のQRカード（A6・1種類）を作る。美容学校・勉強会・取引先・サロンで手渡し／置き場所に。
QR の行き先は 診断ページに「紙から来た」印（utm_source=card）をつけたもの（UTM は autopost/UTM_LINKS.md）。
文面は事実だけ（無料・20問・約2分・8つのジョブ・結果カードはLINEで届く）。効果の保証や他社比較は書かない。
出力：autopost/type-shindan-card/type_shindan_card.(png|pdf)
使い方：python3 autopost/type-shindan-card/make-card.py
"""
import base64, io, os, qrcode
from playwright.sync_api import sync_playwright

OUT = os.path.dirname(os.path.abspath(__file__))
URL = "https://ko-un-ryu-sui.com/type-shindan/?utm_source=card&utm_medium=offline&utm_campaign=type_shindan_card"

def qr_data_uri(url):
    q = qrcode.QRCode(box_size=12, border=1, error_correction=qrcode.constants.ERROR_CORRECT_M)
    q.add_data(url); q.make(fit=True)
    im = q.make_image(fill_color="#15243b", back_color="white").convert("RGB")
    b = io.BytesIO(); im.save(b, "PNG")
    return "data:image/png;base64," + base64.b64encode(b.getvalue()).decode()

HTML = f"""<!doctype html><html lang="ja"><meta charset="utf-8"><style>
@page{{size:105mm 148mm;margin:0}}
*{{box-sizing:border-box;margin:0;padding:0}}
html,body{{width:105mm;height:148mm}}
body{{background:#eaf1f4;color:#15243b;font-family:"Noto Sans CJK JP","Noto Sans JP",sans-serif;display:flex;flex-direction:column;align-items:center;padding:9mm 8mm 7mm;position:relative;overflow:hidden}}
.frame{{position:absolute;inset:3.2mm;border:1.4px solid #1d4e78;border-radius:10px;pointer-events:none}}
.tag{{background:#e9a514;color:#3a2a00;font-weight:800;font-size:9.5px;letter-spacing:.12em;padding:1.6mm 4mm;border-radius:99px}}
h1{{margin-top:5mm;font-size:21px;line-height:1.45;text-align:center;font-weight:900;color:#1d4e78}}
h1 em{{font-style:normal;background:linear-gradient(transparent 62%,#f6d37a 62%)}}
p.lead{{font-size:10.4px;line-height:1.95;text-align:center;margin-top:3.6mm;color:#33455c}}
.qrbox{{margin-top:5mm;background:#fff;border:2px solid #1d4e78;border-radius:12px;padding:3.6mm}}
.qrbox img{{width:40mm;height:40mm;display:block}}
.cap{{margin-top:3mm;font-size:11px;font-weight:800;text-align:center;color:#1d4e78}}
.cap2{{margin-top:1mm;font-size:8.6px;text-align:center;color:#5a6b80}}
.pts{{margin-top:4.4mm;display:flex;gap:2mm}}
.pts span{{font-size:8.6px;font-weight:700;background:#fff;border:1px solid #cfdbe3;border-radius:99px;padding:1.2mm 3mm;color:#1d4e78}}
.foot{{margin-top:auto;font-size:8px;line-height:1.8;text-align:center;color:#5a6b80}}
.foot b{{color:#1d4e78;letter-spacing:.08em}}
</style><body><div class="frame"></div>
<div class="tag">美容師・美容学生のための無料診断</div>
<h1>あなたは<br><em>美容師の何タイプ？</em></h1>
<p class="lead">仕事で大事にしていることから、<br>8つのジョブと、今の働き方の充実度がわかります。<br>結果カードはLINEで受け取れます。</p>
<div class="qrbox"><img src="{qr_data_uri(URL)}" alt=""></div>
<div class="cap">スマホで読み取ってスタート</div>
<div class="cap2">20問・約2分</div>
<div class="pts"><span>無料</span><span>お名前の入力なし</span><span>友だちと見くらべOK</span></div>
<div class="foot"><b>株式会社行雲流水</b>（FLOWCLOUD・glow）<br>ko-un-ryu-sui.com/type-shindan/</div>
</body></html>"""

with sync_playwright() as pw:
    b = pw.chromium.launch()
    pg = b.new_page(viewport={"width": 397, "height": 559}, device_scale_factor=4)
    pg.set_content(HTML); pg.wait_for_timeout(400)
    pg.screenshot(path=os.path.join(OUT, "type_shindan_card.png"), full_page=False)
    pg.pdf(path=os.path.join(OUT, "type_shindan_card.pdf"), width="105mm", height="148mm", print_background=True)
    b.close()
print("done")
