#!/usr/bin/env python3
"""店頭用「Googleマップの感想のお願い」カード（A6）を作る。FLOWCLOUD・glow の2種類。
QR の行き先は、Googleプロフィールの「クチコミを増やす」画面から読み取った投稿リンク（autopost/IMPROVEMENT_LOG 2026-11-09）。
文面は、特典・★の数のお願い・良い口コミだけを選ぶ誘導を入れない（Googleの規約）。事実は autopost/FACTS.md のみ。
出力：autopost/review-card/review_card_fc.(png|pdf)、review_card_glow.(png|pdf)
使い方：python3 autopost/review-card/make-review-card.py
"""
import base64, io, os, qrcode
from playwright.sync_api import sync_playwright

OUT = os.path.dirname(os.path.abspath(__file__))
SHOPS = {
  "fc": dict(
    name="FLOWCLOUD", ja="フロウクラウド", sub="泉大津駅 徒歩3分｜完全予約制",
    url="https://g.page/r/CTM5Shj5Kk6oEAE/review",
    bg="#fbf7f1", ink="#38332e", pri="#44654d", acc="#cdb67f", soft="#eef3ec", frame="#cdb67f",
    head_font='"Noto Serif CJK JP","Noto Serif JP",serif', body_font='"Noto Sans CJK JP","Noto Sans JP",sans-serif', radius="6px",
    deco="",
  ),
  "glow": dict(
    name="glow", ja="グロウ", sub="泉大津駅 徒歩1分｜予約制",
    url="https://g.page/r/CQZx1U7QvwvpEAE/review",
    bg="#fff6f8", ink="#4a3a44", pri="#1d6b57", acc="#d03a65", soft="#ffdfe7", frame="#f9c3d1",
    head_font='"Noto Sans CJK JP","Noto Sans JP",sans-serif', body_font='"Noto Sans CJK JP","Noto Sans JP",sans-serif', radius="22px",
    deco="",
  ),
}

def qr_data_uri(url):
    q = qrcode.QRCode(box_size=12, border=1, error_correction=qrcode.constants.ERROR_CORRECT_M)
    q.add_data(url); q.make(fit=True)
    im = q.make_image(fill_color="#222222", back_color="white").convert("RGB")
    b = io.BytesIO(); im.save(b, "PNG")
    return "data:image/png;base64," + base64.b64encode(b.getvalue()).decode()

def html(s):
    return f"""<!doctype html><html lang="ja"><meta charset="utf-8"><style>
@page{{size:105mm 148mm;margin:0}}
*{{box-sizing:border-box;margin:0;padding:0}}
html,body{{width:105mm;height:148mm}}
body{{background:{s['bg']};color:{s['ink']};font-family:{s['body_font']};display:flex;flex-direction:column;align-items:center;padding:9mm 8mm 7mm;position:relative;overflow:hidden}}
.frame{{position:absolute;inset:3.2mm;border:1.2px solid {s['frame']};border-radius:{s['radius']};pointer-events:none}}
.brand{{text-align:center;color:{s['pri']};font-family:{s['head_font']};font-weight:700;letter-spacing:.14em;font-size:21px;line-height:1.2}}
.brand small{{display:block;font-family:{s['body_font']};font-weight:500;font-size:8.5px;letter-spacing:.12em;color:{s['ink']};opacity:.7;margin-top:3px}}
.rule{{width:34mm;height:2px;background:{s['acc']};margin:5mm 0 5mm;border-radius:2px}}
h1{{font-family:{s['head_font']};font-size:15.5px;font-weight:700;line-height:1.5;text-align:center;color:{s['ink']}}}
p.lead{{font-size:10.6px;line-height:1.95;text-align:center;margin-top:3.4mm}}
.qrbox{{margin-top:5mm;background:#fff;border:1.5px solid {s['frame']};border-radius:{s['radius']};padding:3.6mm;box-shadow:0 1px 0 rgba(0,0,0,.03)}}
.qrbox img{{width:38mm;height:38mm;display:block}}
.cap{{margin-top:3mm;font-size:10px;font-weight:700;text-align:center;color:{s['pri']}}}
.cap2{{margin-top:1mm;font-size:8.4px;text-align:center;opacity:.8}}
.note{{margin-top:auto;font-size:7.6px;line-height:1.8;text-align:center;opacity:.75}}
.shop{{margin-top:2.6mm;font-size:8px;letter-spacing:.08em;text-align:center;color:{s['pri']};font-weight:600}}
</style><body><div class="frame"></div>
<div class="brand">{s['name']}<small>{s['ja']}</small></div>
<div class="rule"></div>
<h1>ご来店いただき<br>ありがとうございました</h1>
<p class="lead">よろしければ、今日のご感想を<br>Googleマップにお寄せください。<br>いただいたお声は、これからの<br>サロンづくりの参考にさせていただきます。</p>
<div class="qrbox"><img src="{qr_data_uri(s['url'])}" alt=""></div>
<div class="cap">スマホで読み取ってください</div>
<div class="cap2">Googleマップの投稿画面が開きます</div>
<div class="note">投稿は任意です（Googleアカウントが必要です）。<br>ご要望・お気づきの点は、その場でスタッフにもお伝えください。</div>
<div class="shop">{s['name']}｜{s['sub']}</div>
</body></html>"""

with sync_playwright() as pw:
    b = pw.chromium.launch()
    for key, s in SHOPS.items():
        pg = b.new_page(viewport={"width": 397, "height": 559}, device_scale_factor=4)
        pg.set_content(html(s)); pg.wait_for_timeout(400)
        pg.screenshot(path=os.path.join(OUT, f"review_card_{key}.png"), full_page=False)
        pg.pdf(path=os.path.join(OUT, f"review_card_{key}.pdf"), width="105mm", height="148mm", print_background=True)
        pg.close()
    b.close()
print("done")
