# 記事の調査・分析ログ（実行のたびに追記する）

## 狙う検索語（地域×対象）
- 地域：泉大津／岸和田／高石／和泉／和泉府中／和泉中央／春木／羽衣／堺／泉佐野／貝塚／南大阪／泉州
- 対象：求職中の美容師／美容学生／美容師を目指す高校生／美容専門学生／新卒／中途／復職
- 学校：高津美容専門学校／関西美容専門学校／ヴェールルージュ美容専門学校／ルトーア美容専門学校／小出美容専門学校／西日本ヘアメイクカレッジ／ベルエベル美容専門学校／バンタン

## カバー済みテーマ（2026-10-31時点）
- taiken-guide（見学・体験と選考）／one-year-debut-curriculum（1年デビューの教育）／hayaban-osoban（早番・遅番）／shoninkyu-teate（初任給・手当）／student-baito（学生アルバイト）／salon-erabi-checklist（サロン選び）／tenshoku-point（転職のポイント）
- 固定ページ：/area /school /recruit/student /recruit/newgrad /recruit/career /jobs/*

## 未着手の候補
- 岸和田・和泉・堺から泉大津に通う美容師の働き方／高校生が美容師になるまでの道／美容学校の選び方と就職活動の時期／ブランクのある美容師の復職準備／固定残業代の見方／休日と有給の見方／美容師の1日の流れ（早番・遅番）／ヘッドスパ・髪質改善など技術を伸ばす学び方（教育の事実の範囲で）

## 実行ログ

## 週次サイト分析 2026-11-01（3サイト・初回ベースライン）
- 採用サイト: title/description/OGP/FAQ/JobPosting/HairSalon構造化データ・llms.txt・sitemap（22URL）・robots 良好。検索「泉大津 美容師 求人」上位は求人媒体（Job-medley/エン/Indeed等）が占め、ko-un-ryu-sui.com は上位10に未表示。→ ロングテール記事を継続。
- 実施: ①ブログ記事に目次（見出し3つ以上）を追加 ②4見出し以上の記事の中盤に見学/LINE CTAを挿入 ③llms.txtに /faq /workstyle /visit と記事一覧を追加 ④sitemap lastmodを更新
- セキュリティ: HSTS/nosniff/X-Frame/Referrer-Policy 設定済み。未設定: Content-Security-Policy、Permissions-Policy（HSTSにincludeSubDomains/preloadなし）→ 提案（サーバー設定のため要承認）。contact.php は Origin検証・IPレート制限あり。
- 次回: 記事1本追加の効果確認、画像重量（site/images 300KB超5枚）の圧縮、Search Console確認のお願い。
