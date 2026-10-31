# ko-un-ryu-sui-site（株式会社行雲流水 採用サイト https://ko-un-ryu-sui.com/）
Vite+React（client/）の静的サイト。`site/` はビルド済みの公開物で、Xserver側の sync.php が1時間ごとに取り込む。
ブログの自動投稿・改善は必ず `autopost/RUNBOOK.md` に従う。事実は `autopost/FACTS.md` のみ。
セットアップ: `npm ci`。ビルド: `VITE_PUBLISH=1 npx vite build && node scripts/prerender.mjs dist && node scripts/publish-gate.mjs dist`。
パスワード・トークン・個人情報はコミットしない。
