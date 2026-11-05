# 来店・予約まとめ（1ページ要約）をPDFにする
月次レポート（毎月2日）の「今月のまとめ」と同じ内容を、A4のPDFにするための道具。数字は画面や記録から読み取った値だけを `data/*.json` に入れる（推測しない）。

- `data/meta.json`：題名（title）・日付などの1行（sub）・ひとこと（take。数字を書かない）・出典（foot）
- `data/hpb_kpi.json`：HPBの指標（shop, metric=acr|bookings, own, avg）
- `data/motive.json`：新規の来店動機（人数と構成比）／`coupons.json`：クーポン別ネット予約（人名は入れない）
- `data/speed.json`：表示速度／`channels.json`：GA4の流入元／`search.json`：検索の表示・順位
- `data/fixes.json`・`todo.json`・`coupon_ideas.json`：修正した内容／新たにやること／クーポンの提案（文章）
- 実行：`bash render.sh data out.pdf`
- 入れてはいけないもの：お客様の名前、売上金額、スタッフの個人名、パスワード・トークン。
- 2026-11-05 の `data/` は初回の見本（10月分）。月ごとに数字を差し替えて使う。
