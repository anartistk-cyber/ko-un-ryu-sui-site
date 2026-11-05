# 分析レポート（まとめ＋グラフ＋詳しい分析）を1つのPDFにする
月次レポート（毎月2日）の「今月のまとめ」と同じ内容を、A4のPDFにするための道具。数字は画面や記録から読み取った値だけを `data/*.json` に入れる（推測しない）。

- `data/meta.json`：題名（title）・日付などの1行（sub）・ひとこと（take。数字を書かない）・出典（foot）
- `data/hpb_kpi.json`：HPBの指標（shop, metric=acr|bookings, own, avg）
- `data/motive.json`：新規の来店動機（人数と構成比）／`coupons.json`：クーポン別ネット予約（人名は入れない）
- `data/speed.json`：表示速度／`channels.json`：GA4の流入元／`search.json`：検索の表示・順位
- `data/fixes.json`・`todo.json`・`coupon_ideas.json`：修正した内容／新たにやること／クーポンの提案（文章）
- 実行：`bash render.sh data out.pdf`
- 入れてはいけないもの：お客様の名前、売上金額、スタッフの個人名、パスワード・トークン。
- 2026-11-05 の `data/` は初回の見本（10月分）。月ごとに数字を差し替えて使う。

## 1つのPDFにする手順（2026-11-06〜。レポートは1つ）
1. Docs「行雲流水 3サイト 分析レポート」を PDF で書き出す（Claude_Docs の export、format=pdf・paper=a4。結果が大きいとファイルに保存されるので、その base64 を python で PDF にする）。
2. グラフのページ：`CHARTS_ONLY=1 bash render.sh data charts.pdf`（3ページ。修正した内容・やること・クーポン案はDocsの本文にあるので載せない）。
3. 合体：`python3 merge_report.py docs.pdf charts.pdf 行雲流水_分析レポート_YYYY-MM.pdf`（『今月のまとめ』のあとにグラフ、そのあとに詳しい分析）。
- `CHARTS_ONLY` なしで `render.sh` を実行すると、従来どおりの「まとめだけ」のPDF（グラフ＋修正＋やること＋クーポン案）になる。単独で使うのは、Docsが使えない時だけ。
