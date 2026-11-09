# Googleクチコミのお願いPOP（A5・両店同じデザイン）。特典の文言は入れない。
# 使い方: python3 make_review_pop.py  → google_review_pop_<store>_A5.pdf と .png を作る
import base64, io, sys, qrcode
from playwright.sync_api import sync_playwright
STORES = {
  'flowcloud': dict(name='FLOWCLOUD', jp='フロウクラウド', url='https://g.page/r/CTM5Shj5Kk6oEAE/review'),
  'glow':      dict(name='glow',      jp='グロウ',         url='https://g.page/r/CQZx1U7QvwvpEAE/review'),
}
def qr_png_b64(url):
    q = qrcode.QRCode(error_correction=qrcode.constants.ERROR_CORRECT_M, box_size=18, border=2)
    q.add_data(url); q.make(fit=True)
    img = q.make_image(fill_color='#2f3a33', back_color='white')
    b = io.BytesIO(); img.save(b, format='PNG'); return base64.b64encode(b.getvalue()).decode()
HTML = """<!doctype html><html lang="ja"><head><meta charset="utf-8"><style>
@page{size:148mm 210mm;margin:0}
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:148mm;height:210mm}
body{font-family:'Noto Sans CJK JP','Noto Sans JP',sans-serif;color:#2f3a33;background:#fbf7f0;position:relative;overflow:hidden}
.frame{position:absolute;inset:7mm;border:0.35mm solid #b99a5b;border-radius:3mm}
.in{position:absolute;inset:7mm;padding:9mm 9mm 8mm;display:flex;flex-direction:column;align-items:center;text-align:center}
.brand{font-family:'Noto Serif CJK JP','Noto Serif JP',serif;letter-spacing:.32em;font-size:5.6mm;color:#7a6a3f;margin-top:2mm}
.rule{width:14mm;height:0.35mm;background:#b99a5b;margin:5mm 0 6mm}
h1{font-family:'Noto Serif CJK JP','Noto Serif JP',serif;font-weight:700;font-size:8.6mm;line-height:1.45;letter-spacing:.06em}
.lead{margin-top:4.5mm;font-size:4.5mm;line-height:1.8}
.qrbox{margin-top:7mm;background:#fff;border:0.35mm solid #e4d9bf;border-radius:3mm;padding:4.5mm}
.qrbox img{display:block;width:56mm;height:56mm}
.cap{margin-top:4mm;font-size:4.1mm;line-height:1.7;color:#2f3a33}
.cap b{font-weight:700}
.note{margin-top:auto;font-size:3.5mm;line-height:1.7;color:#6b756e}
</style></head><body>
<div class="frame"></div>
<div class="in">
  <div class="brand">__NAME__</div>
  <div class="rule"></div>
  <h1>ご来店<br>ありがとうございます</h1>
  <p class="lead">お店の感想を、Googleマップに<br>お寄せいただけたらうれしいです。</p>
  <div class="qrbox"><img alt="Googleクチコミ投稿ページのQRコード" src="data:image/png;base64,__QR__"></div>
  <p class="cap"><b>スマホのカメラでQRコードを読み取る</b>と、<br>クチコミの投稿画面が開きます。</p>
  <p class="note">いただいた感想は、これからご来店を考えている方の参考になります。<br>ひとことでも、とても励みになります。<br>※投稿は任意です。投稿にはGoogleアカウントが必要です。</p>
</div></body></html>"""
def main():
    with sync_playwright() as p:
        br = p.chromium.launch()
        for key, s in STORES.items():
            html = HTML.replace('__NAME__', s['name']).replace('__QR__', qr_png_b64(s['url']))
            pg = br.new_page(viewport={'width':560,'height':794}, device_scale_factor=2)
            pg.set_content(html); pg.wait_for_timeout(400)
            pg.pdf(path=f'google_review_pop_{key}_A5.pdf', width='148mm', height='210mm', print_background=True, prefer_css_page_size=True)
            pg.screenshot(path=f'google_review_pop_{key}_A5.png', full_page=False)
            pg.close()
        br.close()
if __name__ == '__main__': main()
