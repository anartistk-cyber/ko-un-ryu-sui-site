#!/usr/bin/env python3
"""スタッフ端末用：内部アクセス登録のQR（3サイト）を1枚の画像にする。
読み取ると ?krs_internal=1 付きのURLが開き、その端末が GA4 で内部扱い・Clarity 非読み込みになる。
出力：autopost/utm-qr/internal_staff_devices.png
"""
import qrcode, glob
from PIL import Image, ImageDraw, ImageFont

SITES = [
    ("FLOWCLOUD", "https://flowcloud.net/?krs_internal=1"),
    ("glow", "https://glow-izumiotsu.jp/?krs_internal=1"),
    ("採用サイト", "https://ko-un-ryu-sui.com/?krs_internal=1"),
]
cands = glob.glob("/usr/share/fonts/**/*CJK*Regular*.ttc", recursive=True) + glob.glob("/usr/share/fonts/**/*Noto*JP*.otf", recursive=True) + glob.glob("/usr/share/fonts/**/*Gothic*.ttf", recursive=True)
FONT = cands[0] if cands else None
def font(size):
    return ImageFont.truetype(FONT, size) if FONT else ImageFont.load_default()

W, H = 1800, 1000
img = Image.new("RGB", (W, H), "white")
d = ImageDraw.Draw(img)
d.text((60, 40), "スタッフ端末の登録（1回だけ）", fill="#173c3e", font=font(54))
d.text((60, 120), "各自のスマホ・PCで、3つのQRを1回ずつ読み取って開くだけ。以後このサイトのアクセスは数字に入りません。", fill="#333", font=font(30))
for i, (name, url) in enumerate(SITES):
    qr = qrcode.QRCode(box_size=10, border=2, error_correction=qrcode.constants.ERROR_CORRECT_M)
    qr.add_data(url); qr.make(fit=True)
    q = qr.make_image(fill_color="black", back_color="white").convert("RGB").resize((480, 480))
    x = 90 + i * 580
    img.paste(q, (x, 230))
    d.text((x, 730), name, fill="#173c3e", font=font(44))
d.text((60, 860), "解除したい時：URL末尾を ?krs_internal=0 にして開く。お客様の端末では使わないでください。", fill="#555", font=font(28))
img.save("autopost/utm-qr/internal_staff_devices.png")
print("saved", FONT)
