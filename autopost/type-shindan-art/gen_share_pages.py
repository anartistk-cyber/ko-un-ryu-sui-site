#!/usr/bin/env python3
"""美容師タイプ診断：タイプ別の「共有ページ」と共有用の画像（OGP 1200x630）を作る。
目的：結果を友だちにすすめたとき、LINE・Instagram DM・X などに「そのタイプのキャラクター画像つきのカード」が出るようにする
（リンクを開くと、すぐ診断ページ /type-shindan/ へ移る。どのタイプから来たかは utm_content に入る）。
入力 ：client/public/type-shindan/index.html の TYPES（名前・ジョブ名・ひとこと）と autopost/type-shindan-art/<key>.svg（キャラクター）
出力 ：client/public/type-shindan/og/<code>.png ／ client/public/type-shindan/r/<code>/index.html（8タイプ分。code は小文字 tcf など）
使い方：python3 autopost/type-shindan-art/gen_share_pages.py（キャラクターや文面を直したときだけ作り直す）
事実：診断は無料・20問・約2分・8つのジョブ（index.html の説明どおり）。効果の保証・他社比較は書かない。
"""
import html, json, os, re
from playwright.sync_api import sync_playwright

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
ART = os.path.join(ROOT, "autopost", "type-shindan-art")
PUB = os.path.join(ROOT, "client", "public", "type-shindan")
BASE = "https://ko-un-ryu-sui.com/type-shindan"

# index.html の TYPES の key（日本語）→ キャラクター SVG のファイル名
SVG = {"クリエイター": "creator", "イノベーター": "innovator", "アーティスト": "artist", "マイスター": "meister",
       "エンターテイナー": "entertainer", "プロデューサー": "producer", "パートナー": "partner", "アドバイザー": "advisor"}

src = open(os.path.join(PUB, "index.html"), encoding="utf-8").read()
TYPES = json.loads(re.search(r"const TYPES=(\{.*?\});\n", src, re.S).group(1))
assert len(TYPES) == 8, len(TYPES)


def og_html(t, svg):
    e = html.escape
    return f"""<!doctype html><html lang="ja"><meta charset="utf-8"><style>
*{{box-sizing:border-box;margin:0;padding:0}}
html,body{{width:1200px;height:630px;overflow:hidden}}
body{{background:#d2eaf8;font-family:"Noto Sans CJK JP","Noto Sans JP",sans-serif;color:#15243b;position:relative}}
.ground{{position:absolute;left:0;right:0;bottom:0;height:120px;background:#f1dfb0}}
.chara{{position:absolute;left:70px;top:24px;width:470px;height:600px}}
.chara svg{{width:100%;height:100%}}
.pill{{position:absolute;left:600px;top:56px;background:#e9a514;color:#3a2a00;font-weight:900;font-size:30px;letter-spacing:.08em;padding:8px 26px;border-radius:99px}}
.lead{{position:absolute;left:600px;top:128px;font-weight:700;font-size:34px;color:#1d4e78}}
.job{{position:absolute;left:600px;top:184px;width:560px;font-weight:900;font-size:78px;line-height:1.12;color:#15243b;
  -webkit-text-stroke:0;text-shadow:0 5px 0 #fff}}
.name{{position:absolute;left:600px;top:312px;font-weight:900;font-size:44px;color:#1d4e78}}
.catch{{position:absolute;left:600px;top:386px;width:560px;font-weight:700;font-size:29px;line-height:1.5;color:#33455c;text-wrap:balance}}
.cta{{position:absolute;left:600px;top:520px;background:#fff;border:4px solid #1d4e78;border-radius:18px;padding:10px 26px;font-weight:900;font-size:28px;color:#1d4e78;white-space:nowrap}}
</style><body><div class="ground"></div>
<div class="chara">{svg}</div>
<div class="pill">美容師タイプ診断</div>
<div class="lead">私のジョブは…</div>
<div class="job">{e(t['job'])}</div>
<div class="name">{e(t['name'])}</div>
<div class="catch">{e(t['catch'])}</div>
<div class="cta">あなたは何タイプ？　20問・約2分</div>
</body></html>"""


def share_html(code, t):
    e = html.escape
    url = f"{BASE}/r/{code}/"
    img = f"{BASE}/og/{code}.png"
    title = f"私は「{t['job']}」（{t['name']}）｜美容師タイプ診断｜行雲流水"
    desc = f"美容師タイプ診断で「{t['name']}」でした。20問・約2分（無料）。あなたは美容師の何タイプ？友だちと見くらべてみよう。"
    dest = f"/type-shindan/?utm_source=share&utm_medium=social&utm_campaign=type_shindan_share&utm_content={code}"
    return f"""<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{e(title)}</title>
<meta name="description" content="{e(desc)}">
<meta name="robots" content="noindex,follow">
<link rel="canonical" href="{BASE}/">
<link rel="icon" href="/favicon.ico" sizes="any">
<meta property="og:type" content="website">
<meta property="og:site_name" content="行雲流水｜美容師タイプ診断">
<meta property="og:title" content="{e('私は「' + t['job'] + '」（' + t['name'] + '）でした！')}">
<meta property="og:description" content="{e(desc)}">
<meta property="og:url" content="{url}">
<meta property="og:image" content="{img}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image" content="{img}">
<script>location.replace({json.dumps(dest)}+(location.hash||""))</script>
<style>
body{{margin:0;background:#eaf1f4;color:#15243b;font-family:"Hiragino Kaku Gothic ProN","Yu Gothic",Meiryo,sans-serif;display:flex;min-height:100vh;align-items:center;justify-content:center;padding:24px;box-sizing:border-box}}
.card{{max-width:460px;width:100%;text-align:center}}
.card img{{width:100%;height:auto;border-radius:14px;border:2px solid #cfdbe3}}
.card p{{margin:14px 0 0;line-height:1.8}}
.btn{{display:inline-block;margin-top:16px;background:#e9a514;color:#3a2a00;font-weight:800;text-decoration:none;padding:14px 26px;border-radius:99px}}
</style>
</head>
<body>
<div class="card">
<img src="/type-shindan/og/{code}.png" width="1200" height="630" alt="美容師タイプ診断：{e(t['job'])}（{e(t['name'])}）">
<p>美容師タイプ診断（無料・20問・約2分）のページへ移動します。</p>
<a class="btn" href="{dest}">診断をやってみる</a>
</div>
</body>
</html>
"""


os.makedirs(os.path.join(PUB, "og"), exist_ok=True)
with sync_playwright() as pw:
    b = pw.chromium.launch()
    pg = b.new_page(viewport={"width": 1200, "height": 630}, device_scale_factor=1)
    for code, t in TYPES.items():
        c = code.lower()
        svg = open(os.path.join(ART, SVG[t["key"]] + ".svg"), encoding="utf-8").read()
        svg = re.sub(r'\s(width|height)="[^"]*"', "", svg, count=2)  # viewBox だけで拡縮する
        pg.set_content(og_html(t, svg))
        pg.wait_for_timeout(250)
        pg.screenshot(path=os.path.join(PUB, "og", c + ".png"))
        d = os.path.join(PUB, "r", c)
        os.makedirs(d, exist_ok=True)
        open(os.path.join(d, "index.html"), "w", encoding="utf-8").write(share_html(c, t))
        print("ok", c, t["key"], t["job"])
    b.close()
