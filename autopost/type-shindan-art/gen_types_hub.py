#!/usr/bin/env python3
"""美容師タイプ診断：「8つのジョブ（タイプ）一覧」ページを作る（検索から診断へ入る入口。1ページに8タイプをまとめる）。
入力 ：client/public/type-shindan/index.html の TYPES（名前・ジョブ名・ひとこと・説明・強み・合う環境・気をつけたいこと）
        ＋ autopost/type-shindan-art/<key>.svg（キャラクター。外部ファイルとして /type-shindan/types/chara/ にも置く）
出力 ：client/public/type-shindan/types/index.html ／ client/public/type-shindan/types/chara/<key>.svg
文面は診断ページの文章だけを使う（新しい事実・数字・効果の保証は足さない）。
使い方：python3 autopost/type-shindan-art/gen_types_hub.py（診断の TYPES やキャラクターを直したときだけ作り直す）
"""
import html, json, os, re, shutil

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
ART = os.path.join(ROOT, "autopost", "type-shindan-art")
PUB = os.path.join(ROOT, "client", "public", "type-shindan")
OUT = os.path.join(PUB, "types")
BASE = "https://ko-un-ryu-sui.com"
SVG = {"クリエイター": "creator", "イノベーター": "innovator", "アーティスト": "artist", "マイスター": "meister",
       "エンターテイナー": "entertainer", "プロデューサー": "producer", "パートナー": "partner", "アドバイザー": "advisor"}
# 一覧の並び：作る（T）→ 人と（H）の順に、診断ページの TYPES の並びのまま
src = open(os.path.join(PUB, "index.html"), encoding="utf-8").read()
TYPES = json.loads(re.search(r"const TYPES=(\{.*?\});\n", src, re.S).group(1))
GA = re.search(r'(<script async src="https://www\.googletagmanager\.com/gtag/js\?id=G-VJVHXEG25K"></script>\s*<script>.*?</script>)', src, re.S).group(1)
e = html.escape

TITLE = "美容師の8タイプ（ジョブ）一覧｜特徴・強み・向いている環境｜美容師タイプ診断｜行雲流水"
DESC = "美容師タイプ診断でわかる8つのジョブ（タイプ）を一覧に。星の魔法使い・薬剤の発明家・色彩の絵師など、それぞれの特徴、強み、向いている環境、気をつけたいことをまとめました。自分のタイプは無料の診断（20問・約2分）で。"
DIAG = "/type-shindan/?utm_source=types&utm_medium=site&utm_campaign=type_list"
VISIT = "/match/?utm_source=types&utm_medium=site&utm_campaign=type_list"


def section(t):
    s = SVG[t["key"]]
    lis = lambda xs: "".join(f"<li>{e(x)}</li>" for x in xs)
    return f"""<section class="card" id="{s}">
<div class="head"><img src="/type-shindan/types/chara/{s}.svg" width="96" height="117" alt="{e(t['job'])}（{e(t['name'])}）のキャラクター" loading="lazy"><div><p class="job">{e(t['job'])}</p><h2>{e(t['name'])}</h2></div></div>
<p class="catch">{e(t['catch'])}</p>
<p>{e(t['desc'])}</p>
<h3>強み</h3><ul>{lis(t['strong'])}</ul>
<h3>向いている環境</h3><ul>{lis(t['fit'])}</ul>
<h3>気をつけたいこと</h3><p>{e(t['care'])}</p>
</section>"""


toc = "".join(f"<li><a href=\"#{SVG[t['key']]}\">{e(t['job'])}<small>{e(t['name'])}</small></a></li>" for t in TYPES.values())
ld = {
    "@context": "https://schema.org",
    "@graph": [
        {"@type": "WebPage", "@id": f"{BASE}/type-shindan/types/", "url": f"{BASE}/type-shindan/types/", "name": TITLE, "description": DESC, "inLanguage": "ja",
         "isPartOf": {"@type": "WebSite", "name": "行雲流水（FLOWCLOUD・glow）採用サイト", "url": f"{BASE}/"}},
        {"@type": "BreadcrumbList", "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": "行雲流水 採用サイト", "item": f"{BASE}/"},
            {"@type": "ListItem", "position": 2, "name": "美容師タイプ診断", "item": f"{BASE}/type-shindan/"},
            {"@type": "ListItem", "position": 3, "name": "8つのジョブ一覧", "item": f"{BASE}/type-shindan/types/"}]},
    ],
}

PAGE = f"""<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{e(TITLE)}</title>
<meta name="description" content="{e(DESC)}">
<link rel="canonical" href="{BASE}/type-shindan/types/">
<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<meta property="og:type" content="website">
<meta property="og:title" content="美容師の8タイプ（ジョブ）一覧｜美容師タイプ診断">
<meta property="og:description" content="{e(DESC)}">
<meta property="og:url" content="{BASE}/type-shindan/types/">
<meta property="og:image" content="{BASE}/type-shindan/ogp.png">
<meta name="twitter:card" content="summary_large_image">
{GA}
<script type="application/ld+json">{json.dumps(ld, ensure_ascii=False)}</script>
<style>
:root{{--bg:#eaf1f4;--surface:#fff;--ink:#15243b;--muted:#5a6b80;--line:#cfdbe3;--accent:#e9a514;--accent-ink:#3a2a00;--deep:#1d4e78;color-scheme:light}}
*{{box-sizing:border-box}}
body{{margin:0;background:var(--bg);color:var(--ink);font-family:"Hiragino Kaku Gothic ProN","Yu Gothic",Meiryo,sans-serif;line-height:1.85;-webkit-text-size-adjust:100%}}
.wrap{{max-width:560px;margin:0 auto;padding:20px 16px 48px;display:flex;flex-direction:column;gap:18px}}
.brandbar{{display:flex;justify-content:space-between;align-items:center;font-size:12px;color:var(--muted)}}
.brandbar a{{color:inherit;text-decoration:none}}
.tag{{border:1px solid var(--line);border-radius:999px;padding:2px 10px;background:var(--surface)}}
.card{{background:var(--surface);border:1px solid var(--line);border-radius:20px;padding:20px 18px;display:flex;flex-direction:column;gap:10px}}
h1{{margin:0;font-size:24px;line-height:1.4;color:var(--deep);text-wrap:balance}}
h2{{margin:0;font-size:18px;line-height:1.35;text-wrap:balance}}
h3{{margin:8px 0 0;font-size:14px;color:var(--deep)}}
p{{margin:0;font-size:15px}}
ul{{margin:0;padding-left:1.3em;font-size:15px}}
li{{margin:2px 0}}
.lead{{color:var(--muted);font-size:14px}}
.btn{{display:block;text-align:center;text-decoration:none;border-radius:14px;padding:15px 18px;font-weight:900;font-size:17px;color:var(--accent-ink);background:var(--accent);box-shadow:0 4px 0 rgba(0,0,0,.18)}}
.btn.ghost{{background:transparent;color:var(--deep);box-shadow:none;border:1px solid var(--line);font-size:15px;padding:12px}}
.toc{{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:1fr 1fr;gap:8px}}
.toc a{{display:block;background:var(--bg);border:1px solid var(--line);border-radius:12px;padding:8px 10px;text-decoration:none;color:var(--ink);font-weight:700;font-size:14px;line-height:1.4}}
.toc small{{display:block;color:var(--muted);font-weight:500;font-size:11px}}
.head{{display:flex;gap:12px;align-items:center}}
.head img{{width:96px;height:auto;flex:none}}
.job{{font-size:13px;font-weight:700;color:var(--deep)}}
.catch{{font-weight:700;font-size:15px;text-wrap:balance}}
.note{{font-size:12px;color:var(--muted)}}
a:focus-visible{{outline:3px solid var(--deep);outline-offset:3px}}
section[id]{{scroll-margin-top:12px}}
</style>
</head>
<body>
<div class="wrap">
<div class="brandbar"><a href="/">行雲流水｜FLOWCLOUD・glow</a><span class="tag">無料・約2分</span></div>
<header class="card">
<h1>美容師の8タイプ（ジョブ）一覧</h1>
<p class="lead">美容師タイプ診断でわかる、8つのジョブ（タイプ）の特徴・強み・向いている環境・気をつけたいことをまとめました。自分のタイプは、無料の診断（20問・約2分）でわかります。</p>
<a class="btn" href="{DIAG}">診断をはじめる</a>
<ul class="toc">{toc}</ul>
</header>
{"".join(section(t) for t in TYPES.values())}
<section class="card">
<h2>自分のタイプを知るには</h2>
<p>仕事で大事にしていることを答えていくと、8つのジョブのうち近いものと、いまの働き方の充実度がわかります。診断はあくまで目安です。</p>
<a class="btn" href="{DIAG}">診断をはじめる（無料・約2分）</a>
<a class="btn ghost" href="{VISIT}">サロン見学を申し込む（お名前と職種だけ）</a>
<p class="note">株式会社行雲流水（FLOWCLOUD・glow／大阪府泉大津市）の採用サイトの診断です。回答は個人を特定しない形で記録します（<a href="/privacy">プライバシーポリシー</a>）。</p>
</section>
</div>
</body>
</html>
"""

os.makedirs(os.path.join(OUT, "chara"), exist_ok=True)
for t in TYPES.values():
    s = SVG[t["key"]]
    shutil.copyfile(os.path.join(ART, s + ".svg"), os.path.join(OUT, "chara", s + ".svg"))
open(os.path.join(OUT, "index.html"), "w", encoding="utf-8").write(PAGE)
print("ok", len(PAGE), "bytes;", len(TYPES), "types")
