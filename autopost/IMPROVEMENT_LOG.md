# 3サイト改善の経緯（引き継ぎ用・新しい順に追記する）
目的：閲覧数・滞在時間の最大化。FLOWCLOUD/glow→予約、行雲流水(採用)→問い合わせ。SEO/MEO/AIOで選ばれるサイトに。藤津さんから「自動で任せる」と指示済み（2026-11-01）。

## 運用ルール
- 事実は autopost/FACTS.md のみ。料金・休み・クーポンを創作しない。スタッフの発言・体験談を創作しない。
- 公開は main へ push → Xserver cron が取り込む（採用:17分、FLOWCLOUD:22分、glow:27分）。手順は skill「kounryusui-site-deploy」。
- 画像しか載せられない媒体は画像、動画を載せられる媒体は動画（リール/YouTube/TikTok/GBP動画）でも可。写真は「FLOWCLOUD SNS写真」LINEグループの素材・各サイト掲載済み写真を使う（人物写真OK）。
- 一部の投稿はChatGPTが担当。重複投稿を避けるため、担当範囲は下の「ChatGPTとの分担」に記録して合わせる。
- 店名は「FLOWCLOUD」（スペースなし）に統一。

## 2026-11-01
- アイコン（favicon/apple-touch）を3サイトに追加（採用=エンブレム、FC=ロゴの輪、glow=ロゴの「g」）。
- 採用: /workstyle（休み・勤務時間・教育・給与内訳）、/visit（見学・体験・選考の流れ）を新設し、フッター・関連リンクから導線。ブログに目次と中盤CTA、記事「岸和田・和泉・堺からの通勤」。写真圧縮。
- FC/glow: WPの縮小画像をsrcsetで出し分け（3MB→約80KB/枚）。FCトップは約9MB→187KB。
- FC旧WPブログ: 期限切れキャンペーン記事223本を noindex（削除なし）。詳細 autopost/FC_OLD_BLOG_NOINDEX_2026-11-01.md。
- セキュリティ: FC/glowのPHP display_errors をOff（サーバー内パス露出を解消）。採用サイト .htaccess に Permissions-Policy、contact.php の店舗名をFLOWCLOUDに（バックアップ .htaccess-backup-20261101）。
- 料金改定を反映済み：ナチュラルパーマ¥7,700〜／ハード¥9,900〜／ポイント髪質改善ストレート¥11,000〜／ポイントパーマ¥5,500〜。
- 口コミ導線：/voice/ に「口コミでよく挙がるポイント」＋HPB口コミリンク。フォームの入力途中保存。/faq ページ。FCにllms.txt。
- 予定タスク：週次分析(日19:41)、ブログ自動投稿(採用 月水金/FC 水土/glow 火金)、口コミ確認(毎日)、SalonAnswer集計(毎月2日)、1月休業日のヒアリング(11/15)。

## 未了・次にやること
- glow・FCの2027年1月以降の休業日（藤津さんが後で伝える）。
- GBP投稿（下書き autopost/GBP_DRAFTS_2026-11.md）。TikTok/Facebook/YouTubeのglow用URLは無し。
- FC旧ブログの重複・短すぎるタイトル、画像なし80本はSearch Consoleの表示回数を見て優先順位付け。

## ChatGPTとの分担
（2026-11-01 確認。ChatGPTの「◆自動投稿」チャットの指示文を読んで記入）
- ◆自動投稿チャット＝全媒体運用の主管。ローカルPCのworkspace（work/*.json, kounryusui-salon-posting skill）で動き、毎日21:15 JSTに予約枠の補充・公開確認・台帳更新を行う。旧Instagram専用の自動実行はこのチャットへ移管済み・停止済み。
- ChatGPT担当：Google3プロフィール、Instagram/Threads 3アカウント（flowcloud_osaka・glow_.osaka・ko_un_ryu_sui.recruit）、HPB（FLOW・glow）、X、TikTok、YouTube、Facebookの投稿作成・予約・公開確認・7日/28日後の成果記録。
- Claudeは上記媒体へ直接投稿しない（重複防止）。Claude担当：3サイト（採用・FLOWCLOUD・glow）の改善、投稿の着地ページ整備、投稿案の提供（autopost/内のmd）、GA/Search Consoleなどサイト側の分析共有。
- 運用ルール（ChatGPT側）：Instagramは静止画像のみ（リール・動画化は新規登録しない）。月20投稿（Metricool無料枠）、週4回程度/媒体、有料契約なし。未確認の待遇・料金・募集枠を事実として書かない。AI生成の定型注記は付けない。FLOWは40〜50代女性、glowは10〜20代女性。
- 連携方法：Claudeが作った案はユーザーを介してChatGPTに渡す（ChatGPTのPCファイルはClaudeから触れない）。ChatGPT側の公開結果はユーザー経由で受け取り、サイト改善の判断材料にする。
- 注意：ChatGPT側の表記は「FLOW CLOUD」（スペースあり）。HPB等の公式掲載名を除き、新規投稿は「FLOWCLOUD」に統一するよう依頼する。autopost/IG_CAPTIONS_FLOWCLOUD_2026-11.md の「動画向き」案は、Instagramでは静止画で使う（他媒体のみ動画）。

- 2026-11-01 21:34 分担の指示を◆自動投稿に送付済み。ChatGPT側が方針を反映し、定期タスク2件（毎週21:15の予約補充・公開確認／毎月25日前後の全媒体分析）を設定。Claudeは11/26に成果共有を受け取る予定（リマインド設定済み）。
- 2026-11-02 お客様の声にGoogleマップの★5口コミ（原文抜粋）を追加（FLOWCLOUD 4件・glow 2件）。HPB★5と併記、出典表示付き。
- 2026-11-02 12:20 新記事3本（FC color-taishoku-40-50／glow color-first-counseling-glow・short-layer-asa-raku）とお客様の声のGoogle口コミ追加の公開表示を確認。FCのSearch Consoleはデータが10/30の1日分のみ（表示136・クリック5）。旧WP記事（/14625/ 13回、/15172/ 9回、/7588/ 7回、/12342/ 7回など）が既に表示されているため、旧ブログの整理（noindex追加）は2週間分のデータが溜まる11/15まで保留。
- 2026-11-02 /cota-products/ にコタ公式サイトの製品一覧（シリーズ名）を追記。
- 2026-11-02 12:40 採用サイト本番 .htaccess を藤津さんの画面で確認：Permissions-Policy 反映済み（X-Content-Type-Options/X-Frame-Options/Referrer-Policy/HSTS も有効）。手動アップロードは不要。
