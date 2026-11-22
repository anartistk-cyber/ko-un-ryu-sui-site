# ko-un-ryu-sui-site（株式会社行雲流水 採用サイト https://ko-un-ryu-sui.com/）
Vite+React（client/）の静的サイト。`site/` はビルド済みの公開物で、Xserver側の sync.php が1時間ごとに取り込む。
ブログの自動投稿・改善は必ず `autopost/RUNBOOK.md` に従う。事実は `autopost/FACTS.md` のみ。
セットアップ: `npm ci`。ビルド: `VITE_PUBLISH=1 npx vite build && node scripts/prerender.mjs dist && node scripts/publish-gate.mjs dist`。
パスワード・トークン・個人情報はコミットしない。
週次点検では最初に `autopost/EFFECT_CHECKS.md` を開き、判定日が来た改善を判定して結果欄に書く。改善を入れたら同じ表に1行足す。
無人（定期）実行では `autopost/UNATTENDED.md` に従う：外へ影響すること（GBP・HPB・LINE・サーバー・GA4設定・SNS投稿・契約など）は実行せず、`autopost/APPROVALS.md` の「OK待ち」に入れて通知し、藤津さんの「OK 番号」を待つ。

FLOWCLOUD/glow（fc-site/・glow-site/）の見た目は CSS 部品（fc-site/css・glow-site/css・shared/css）を編集→`node scripts/build-css.mjs`→各サイトで `node build.mjs`。公開前の点検は `scripts/site-audit/README.md`。
採用マッチング診断（match.ko-un-ryu-sui.com）は `match-site/`（保守は Claude。直し方・試験は `match-site/README.md`、置き場所の引っ越しは `autopost/MATCH_MIGRATION.md`。診断の内容・計算・フォーム・デザインは藤津さんの指示なく変えない。LINE の実送信は「OK 番号」のあとだけ）。
