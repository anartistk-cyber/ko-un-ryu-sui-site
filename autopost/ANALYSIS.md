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

## 実行ログ 2026-11-01（追加分）
- 記事追加: tsukin-kishiwada-izumi-sakai ／ 狙い: 岸和田・和泉・堺 美容師 求人 通勤 ／ 切り口: 交通費・家賃補助(上限1万円・要相談)と早番遅番。通勤時間は未確認のため記載せず。
- カバー済みテーマに追加: tsukin-kishiwada-izumi-sakai
- 画像圧縮: 300KB超の写真7枚を幅1600以下・品質78に（計約2.4MB→約1.5MB）。
- server-files/htaccess-new-domain に Permissions-Policy を追記（※サーバーへの反映は藤津さんの手動アップロードが必要。CSPはGA/インラインスクリプトに影響するため未追加）。

## 実行ログ 2026-11-02（月）
- 調査: 「泉大津 美容師 求人 新卒」上位は求人媒体（キャリアマップ/Job-medley/エン/ハローワーク等）。ko-un-ryu-sui.com は上位に未表示。美容学生の就職活動検索は教育・PR記事が中心。→ ロングテール記事を継続。
- 記事追加: kyujitsu-yukyu-minikata ／ 狙い: 美容師 休日 有給 求人 見方 ／ 切り口: 年間休日104日・完全週休2日制とのちがい・有給取得率100%など確認済み事実のみ。
- カバー済みテーマに追加: kyujitsu-yukyu-minikata
- 既存記事改善: 今回は見送り（次回実施）。
- 改善（11/2・ユーザー指示）: ①tenshoku-point を FACTS/サイト本文と照合し、冒頭に結論・固定残業代の記載・内部リンクCTAを追加（dateは変更なし）②shoninkyu-teate/hayaban-osoban等3記事の ctas に kyujitsu-yukyu-minikata を追加 ③/faq の休日・有給項目に記事リンク、「有給は取れていますか」を追加（取得率100%・勤続6.0年は2025年度実績）。
- 訂正(11/2): 直前のコミットは faq.tsx の記述ミスでビルドが失敗したまま旧dist を公開していた（実害なし：旧版が残っただけ）。修正して再ビルド・ゲート通過後に再公開。教訓: ビルドは `| tail` に通さず終了コードで判定する。
- 記事追加(11/2・ユーザー指示で2本目): kotei-zangyo-minikata ／ 狙い: 美容師 固定残業代 見方 求人 ／ 切り口: 新卒27万(24万+3万・15時間分)とスタイリスト以上5万円(25時間分)の内訳、確認3点。時給換算などの計算は創作を避け記載せず。
- カバー済みテーマに追加: kyujitsu-yukyu-minikata／kotei-zangyo-minikata
- 引き継ぎメモ: autopost/HANDOFF_ホームページ最適化と移転_2026-11-02.md（◆ホームページ最適化と移転 のチャットはこの環境から見えず、メモをリポジトリに保存）。
- 2026-11-02 FAQ: 試用期間の表記をFACTSに合わせ統一（スタイリスト・アシスタントは試用期間なし・6か月有期）。給与例27万円はFACTSと整合を確認。

## 実行ログ 2026-11-04（水・自動実行）
- 準備: ローカルcloneがorigin/mainと無関係な履歴だったため、origin/mainから作業ブランチを作成して実施。
- 調査: 「泉大津 美容師 求人 新卒 美容学生」上位は求人媒体（Job-medley/キャリアマップ/エン/ハローワーク等）。「美容学生 就職活動 サロン見学」は進学情報サイト・就職支援の記事が中心で、見学時の質問リスト型は薄い。ko-un-ryu-sui.com は上位に未表示。
- 記事追加: gakusei-kengaku-kakunin ／ 狙い: 美容学生 サロン見学 確認 就職先選び ／ 切り口: 見学で聞く6項目（給与内訳・休み・勤務時間と練習・教育・選考・勤続）。事実はFACTS.mdのみ。
- カバー済みテーマに追加: gakusei-kengaku-kakunin
- 既存記事改善: 今回は見送り（次回実施）。金曜ではないため週次レビューなし。
- 検証: sitemap 26URL／vite build／prerender／publish-gate すべて成功。

## 実行ログ 2026-11-06（金・自動実行）
- 準備: リポジトリは既にclone済み・origin/mainと同期。add_repo/register_repo_rootのツールはこの環境に無く、スコープ済みのためそのまま作業。
- 調査: WebSearchはこの回は未実施（ツール未ロードのため）。11/1・11/4の調査結果（上位は求人媒体、ko-un-ryu-sui.comは未表示）を踏襲。
- 記事追加: fukushoku-salon-erabi ／ 狙い: 美容師 復職 ブランク サロン選び 泉大津 ／ 切り口: 働き方の形・勤務時間・練習の扱い・教育・体験の5つの確認点。パートの時給は FACTS.md に無いため記載せず（要相談）。事実はFACTS.mdのみ。
- カバー済みテーマに追加: fukushoku-salon-erabi
- 既存記事改善: salon-erabi-checklist に冒頭の結論文と関連記事CTA2件を追加（dateは変更なし、FACTSとのずれなし）。
- 検証: sitemap 27URL／vite build／prerender／publish-gate すべて成功（終了コード確認）。export-site.sh 75ファイル。

### 今週の振り返り（11/1〜11/6）
- 追加記事: tsukin-kishiwada-izumi-sakai／kyujitsu-yukyu-minikata／kotei-zangyo-minikata／gakusei-kengaku-kakunin／fukushoku-salon-erabi（計5本。ブログは合計12本）。
- 検索順位: 「泉大津 美容師 求人」系は求人媒体が上位で、自サイトは上位10に未表示。ロングテール（確認点・見方型）を継続。
- 来週の改善案: ①タイトルは「〜の見方」「確認したい◯つ」型を継続 ②高校生向け（美容師になるまでの道）と和泉・堺・高石の地域別記事が未着手 ③FAQに復職・ブランクの記事リンクを追加 ④パート条件（時給等）をFACTS.mdに追加するようオーナー確認を依頼 ⑤Search Consoleでの掲載順位確認（要オーナー）。
- 追記(11/6): オーナー確認によりパート時給はJrスタイリスト1,600円〜／スタイリスト1,800円〜が正。FACTS.mdに追記。サイト・記事の変更なし（復職記事は時給非掲載のまま）。
