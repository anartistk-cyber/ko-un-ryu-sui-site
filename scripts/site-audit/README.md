# site-audit：FLOWCLOUD / glow の見た目と中身の点検ツール

公開前に「崩れていないか・統一されているか・SEO/AIOの土台が抜けていないか」を機械で確認するためのスクリプト集。
どれも `fc-site/site` または `glow-site/site`（`node build.mjs` で作った公開物）を対象にする。必要なのは Node + Playwright（`require('playwright')`）と Python 3。

| ファイル | 何を確認するか | 使い方（リポジトリ直下） |
|---|---|---|
| `overflow-test.cjs` | 全ページ × 360/390/768/1280px で横スクロール（はみ出し）が出ていないか | `node scripts/site-audit/overflow-test.cjs fc-site/site <画像フォルダ> 8841` |
| `shot.cjs` | PC(1280)とスマホ(390×2倍)の全画面スクリーンショット（見た目の確認・前後比較） | `node scripts/site-audit/shot.cjs fc-site/site <画像フォルダ> out /menu/ /cast/` → `out-d-_menu_.png` など |
| `quiz-test.cjs` | 「お悩みから選ぶ」診断（ラジオ→結果カード）が動くか | `node scripts/site-audit/quiz-test.cjs fc-site/site <画像フォルダ> out.png 0` |
| `audit.py` | title/description/canonical/OG/h1/見出し順/alt/画像サイズ/内部リンク切れ/JSON-LD/lang/重複、robots・sitemap・llms.txt | `python3 scripts/site-audit/audit.py fc-site/site https://flowcloud.net` |

- `<画像フォルダ>` は「画像ID.jpg（例: FLOW-CLOUD-044.jpg）」を置いたフォルダ。サンドボックスは外部の画像CDNに届かないので、ここの画像で代用して表示する（フォルダが無い・画像が無い場合はその画像だけ404になり、レイアウト確認には影響しない）。
- `overflow-test` の最後の行が `overflow: 0` ならOK。0以外なら、はみ出している要素名が出る。
- `audit.py` の「sitemap.xml MISSING」は、FC・glow は `sitemap-fc.xml` / `sitemap-gl.xml` を使うため既知（問題ではない）。
- 見た目を変えたら: `node scripts/build-css.mjs` → 各サイトで `node build.mjs` → manifest再生成 → 上記を実行 → 問題なければコミット（手順は SKILL「kounryusui-site-deploy」）。

## CSSの作り方
`fc-site/style.css` / `glow-site/style.css` は生成物。部品を編集して `node scripts/build-css.mjs` で組み立てる。
- FC（40〜50代・上品）: `fc-site/css/` の 00-base（共通の土台）→ 10-palette（色）→ 20-theme（見た目）＋ `shared/css/30-delight.css`（スクロール演出・診断・表・改行）
- glow（10〜20代・ポップ）: `glow-site/css/` の 00-base → 10-palette → 20-theme → `shared/css/30-delight.css` → 40-extra
- `shared/css/30-delight.css` を変えると両サイトに効く。サイト固有にしたいときは各サイトの theme / extra に書く。
