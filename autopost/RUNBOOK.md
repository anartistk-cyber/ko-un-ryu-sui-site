# ブログ自動投稿・改善ランブック（週3回の定期タスクがこの手順で動く）

目的：美容学生・高校生・新卒・中途・復職の美容師に見られ、見学・相談（LINE/フォーム）につながる記事を、事実だけで増やし続ける。

## 毎回の手順
1. `autopost/ANALYSIS.md` を読む（過去記事・狙ったキーワード・検索確認の結果・学び）。
2. **調査**：WebSearch（mode: standard）で次を確認し、ANALYSIS.md に追記する。
   - 「泉大津 美容師 求人」「岸和田 美容師 求人」「美容学生 就職 サロン選び」など、狙う語で上位に出る記事の切り口と、ko-un-ryu-sui.com が出ているか。
   - 美容学生・転職美容師が気にしている疑問（サロン選び、給与の見方、休み、教育、独立・技術）。
3. **テーマ決定**：ANALYSIS.md の「カバー済みテーマ」と重複せず、地域（泉大津・岸和田・高石・和泉・堺・泉佐野・貝塚・南大阪・泉州）×対象（高校生・美容学生・新卒・中途・復職）×疑問の組み合わせから1つ選ぶ。直近の学びで反応がよい型を優先。
4. **執筆**（`client/src/data/posts.ts` の配列先頭に追加）：
   - 事実は `autopost/FACTS.md` のみ。数字・制度は必ず一致させる。書けないことは「要相談」「見学・相談時にご案内」。
   - 構成：導入（読者の悩み）→ h2を3〜5個（質問に直接答える短い段落、必要ならul）→ まとめ。1,500〜2,500字。冒頭2文で結論を言う（AI検索に引用されやすく）。
   - `[[…]]` マーカーは使わない。`slug` は英小文字とハイフン。`date` は実行日（Asia/Tokyo）。`category` は既存に合わせる。
   - `ctas` は `[["見学・相談する", "/?c=visit#contact"], ["公式LINEで質問する", "https://lin.ee/Z0JP8sH"]]` と関連ページへのリンク（/area /school /recruit/student /recruit/newgrad /recruit/career /jobs/* /blog/*）。本文中にも内部リンクを入れる（`<a>`は使えないので ctas と関連記事で）。
5. **画像**：
   - バナー：`node scripts/make-banner.mjs <slug> "<タイトル>" "<カテゴリ>"` → `image: "/images/blog/<slug>.jpg"`, `imageAlt` を設定。
   - 写真：本文の途中に `{ img: "/images/<FACTS.mdの写真>", alt: "具体的な説明" }` を1枚入れる（内容に合うものだけ。合わなければ入れない）。
6. **検証**：`node scripts/gen-sitemap.mjs <今日>` → `VITE_PUBLISH=1 npx vite build` → `node scripts/prerender.mjs dist` → `node scripts/publish-gate.mjs dist`。失敗したら直す。直せなければ公開せず、原因を ANALYSIS.md に書いて終了。
7. **公開**：`bash scripts/export-site.sh`（dist と manifest.json を `site/` に出力）→ `git add -A && git commit && git push`。Xserver側のcronが1時間以内に取り込む。
8. **記録**：ANALYSIS.md に「日付／slug／狙った語／切り口／カバー済みテーマ」を追記。週の最後（金曜の回）は「今週の振り返り」と来週の改善案（タイトルの型、内部リンク、FAQ追加、既存記事のリライト候補）を書く。
9. **既存記事の改善**：2回に1回は、最も古い記事1本を読み、FACTS.mdとずれがないか・内部リンク・見出し・冒頭の結論を見直して更新（dateは変えず、必要なら `dateModified` 相当として本文を直すだけ）。

## 守ること
- 事実にない内容は書かない。創作の体験談・口コミ・数字・実績は禁止。
- 個人情報・パスワード・トークンを記事やコミットに入れない。
- 1回の実行で公開する記事は1本。品質に自信がなければ公開せず記録だけ残す。
