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

## 実行ログ 2026-11-07（土・藤津さん指示：3サイト分のブログ）
- 調査: 「奨学金 美容師 就職」で、奨学金を返済中の美容学生向けに就職先で確認する点を整理した記事は薄い（制度の解説・返還の相談先の記事が中心）。ko-un-ryu-sui.com は未表示。→ 確認点型でロングテールを狙う。
- 記事追加: shougakukin-hensai-salon-erabi ／ 狙い: 美容学生 奨学金 返済 就職先 確認 ／ 切り口: 月給の内訳・休みと勤務時間・交通費家賃補助・返済サポートの条件・練習と講習の費用の5つ。事実はFACTS.mdのみ（返済サポートは「あり・対象/金額/期間は要相談」とし、金額・条件は書かず）。奨学金制度そのものの数字・規則は書いていない。
- カバー済みテーマに追加: shougakukin-hensai-salon-erabi（給与・待遇）
- バナー: make-banner.mjs に タイトル中の `\n` を改行にする機能を追加（長い題名が「就職先／で」のように泣き別れるのを防ぐ）。
- 検証: sitemap 29URL／vite build／prerender／publish-gate すべて終了コード0。export-site.sh 83ファイル・manifest不一致0。
- 次回（月曜の自動実行）: 高校生向け（美容師になるまでの道）／和泉・堺・高石の地域別記事。効果は2〜4週間後に Search Console で「奨学金」を含む検索語の表示を確認。

## 実行ログ 2026-11-09（月・自動実行）
- 準備: ローカルcloneがorigin/mainと無関係な履歴だったため、origin/mainから作業ブランチを作成。add_repo/register_repo_rootのツールは無く、スコープ済みのためそのまま作業。
- 調査: 「高校生 美容師になるには」は進学情報サイト中心、「泉大津 美容師 求人 高校生 アルバイト」は求人媒体中心。ko-un-ryu-sui.com は上位10に未表示。→ 高校生向けに「進路を決める前にできること」型の記事を追加。
- 記事追加: koukousei-biyoushi-susumikata ／ 狙い: 美容師 高校生 進路 サロン 体験 ／ 切り口: 知る・体験する・学生アルバイト・条件を見る の4つ。事実はFACTS.mdのみ（学生アルバイトは高校1年生〜、時給1,300円〜はサイトの既存記事どおり）。
- カバー済みテーマに追加: koukousei-biyoushi-susumikata（高校生）
- 既存記事改善: student-baito（最古）をFACTSと照合しずれなし。ctasに新記事を追加（dateは変更なし）。
- 検証: sitemap 30URL／vite build／prerender／publish-gate すべて終了コード0。
- 次回: 和泉・堺・高石の地域別記事。金曜ではないため週次レビューなし。

## 実行ログ 2026-11-11（水・自動実行）
- 準備: リポジトリはclone済み・origin/mainと同期。add_repo/register_repo_rootのツールは無く、スコープ済みのためそのまま作業。`npm ci` を実施（node_modules未導入だったため）。
- 調査: 「高石 堺 美容師 求人 泉大津 通勤」上位は求人媒体（キャリアマップ/Job-medley/ハローワーク）。ko-un-ryu-sui.com は上位に未表示（Job-medleyにFLOWCLOUDのパート求人は表示）。地域×通勤は tsukin-kishiwada-izumi-sakai で既出のため、別の疑問へ切り替え。
- 記事追加: yuki-koyo-shiyo-kikan-minikata ／ 狙い: 美容師 求人 有期雇用 試用期間 見方 ／ 切り口: 試用期間の有無・契約期間とその先・休みと有給の始まり・社会保険と勤続の4点。事実はFACTS.mdのみ。契約更新の条件はFACTSに無いため「見学・相談時にご質問ください」とし書かず。
- カバー済みテーマに追加: yuki-koyo-shiyo-kikan-minikata（雇用形態）
- 既存記事改善: 11/9に実施済みのため今回は見送り（次回実施）。金曜ではないため週次レビューなし。
- 検証: sitemap 31URL／npm ci／vite build／prerender／publish-gate すべて終了コード0。
- 次回: 和泉・堺・高石の地域別（通勤以外の切り口）／美容学校の選び方と就職活動の時期（時期の事実はFACTSに無いため要確認）。

## 実行ログ 2026-11-13（金・自動実行）
- 準備: リポジトリはclone済み・origin/mainと同期。add_repo/register_repo_rootのツールは無く、スコープ済みのためそのまま作業。`npm ci` を実施。
- 調査: 「美容学生 就職活動 いつから 見学 時期」は進学情報サイト中心、「泉大津 美容師 求人 和泉 堺」は求人媒体（Job-medley/キャリアマップ/Indeed）中心。ko-un-ryu-sui.com は上位に未表示（Job-medleyにFLOWCLOUDのパート求人は表示）。就職活動の時期はFACTSに無いため見送り。
- 記事追加: shouyo-minikata-biyoushi ／ 狙い: 美容師 求人 賞与 見方 ／ 切り口: 支給の時期と回数（年2回10月・4月）・支給条件（目標達成）・月給と手当との関係・有期雇用との関係の4点。事実はFACTS.mdのみ。賞与の金額・最初の賞与の時期・有期雇用での扱いはFACTSに無いため「見学・相談時にご質問ください」とし書かず。shoninkyu-teate（手当全体）との重複を避け、賞与に絞った。
- カバー済みテーマに追加: shouyo-minikata-biyoushi（給与・待遇／賞与）
- 既存記事改善: 最古の記事 tenshoku-point をFACTSと照合しずれなし。ctasに新記事を追加（dateは変更なし）。
- 検証: sitemap 32URL／npm ci／vite build／prerender／publish-gate すべて終了コード0。export-site.sh 89ファイル。

### 今週の振り返り（11/9〜11/13）
- 追加記事: koukousei-biyoushi-susumikata（11/9）／yuki-koyo-shiyo-kikan-minikata（11/11）／shouyo-minikata-biyoushi（11/13）の計3本。ブログは合計15本。
- 検索順位: 「泉大津 美容師 求人」系は求人媒体が上位で、自サイトは上位10に未表示。引き続きロングテール（見方・確認点型）で積む。
- 学び: 「〜の見方。確認したい◯つ」型は給与・待遇系（固定残業代・休日・有期雇用・賞与）で一通り揃った。次は地域別・対象別に広げる。
- 来週の改善案: ①和泉・堺・高石の地域別記事（通勤以外の切り口。通勤時間は未確認のため書かない） ②美容学校の選び方と就職活動の時期（時期の事実をオーナーに確認） ③FAQに賞与・有期雇用の記事リンク追加 ④在籍人数・平均年齢（FACTS 11/12）を使った「サロンの規模・雰囲気の見方」記事（平均年齢と平均勤続年数の組み合わせは誤解を招くため扱いに注意） ⑤Search Consoleでの掲載順位確認（要オーナー）。

## 実行ログ 2026-11-16（月・自動実行）
- 準備: リポジトリはclone済み・origin/mainと同期（HEADがdetachedだったためmainへ切替）。add_repo/register_repo_rootのツールは無く、スコープ済みのためそのまま作業。`npm ci` を実施。
- 調査: 「美容師 就職 サロンの規模 人数 雰囲気」は進学情報サイト・求人媒体（Job-medley等）中心、「泉大津 美容師 求人 雰囲気 スタッフ人数」も求人媒体（キャリアマップ/Job-medley/エン/Indeed）中心。ko-un-ryu-sui.com は上位に未表示。人数の内訳と見学での見方を結ぶ記事は薄い。
- 記事追加: salon-ninzu-funiki-minikata ／ 狙い: 美容室 人数 雰囲気 見学 美容師 就職 ／ 切り口: 在籍人数と雇用形態の内訳・年齢層と先輩との距離・見学体験で見る・シフトと教育時間の4点。事実はFACTS.mdのみ（正社員5名・アルバイト8名・キャスト平均年齢23歳）。平均年齢と平均勤続年数は誤解を招くため同じ記事に並べず、店舗別人数・バックオフィス人数はFACTSに無いため「見学・相談時にご案内」とした。
- カバー済みテーマに追加: salon-ninzu-funiki-minikata（就職活動／サロンの規模・雰囲気）
- 既存記事改善: 11/13に実施済みのため今回は見送り（次回実施）。金曜ではないため週次レビューなし。
- 検証: sitemap 33URL／npm ci／vite build／prerender／publish-gate すべて終了コード0。export-site.sh 92ファイル。
- 次回: 和泉・堺・高石の地域別（通勤以外の切り口）／美容学校の選び方と就職活動の時期（時期の事実をオーナーに確認）。

## 実行ログ 2026-11-18（水・自動実行）
- 準備: リポジトリはclone済み・origin/mainと同期。add_repo/register_repo_rootのツールは無く、スコープ済みのためそのまま作業。`npm ci` を実施。
- 調査: 「美容師 就職 保護者 親 心配」は進学情報・転職媒体の一般論が中心、「泉大津 美容師 求人 新卒 美容学生 見学」は求人媒体（Job-medley/キャリアマップ/Indeed/エン）中心。ko-un-ryu-sui.com は上位に未表示。保護者視点で就職先の確認点をまとめた記事は薄く、自サイトにも未着手。
- 記事追加: hogosha-biyoushi-shuushoku-shinpai ／ 狙い: 美容師 就職 保護者 親 心配 サロン ／ 切り口: 休み・給与の内訳・社会保険と雇用・勤務時間と練習・通勤と環境の5点。事実はFACTS.mdのみ。契約更新の条件・保護者の見学同伴可否・通勤時間は未確認のため書かず「見学・相談時にご案内」とした。
- カバー済みテーマに追加: hogosha-biyoushi-shuushoku-shinpai（就職活動／保護者）
- 既存記事改善: 古い記事 salon-erabi-checklist をFACTSと照合しずれなし。ctasに新記事を追加（dateは変更なし）。
- 検証: sitemap 34URL／vite build／prerender／publish-gate すべて終了コード0。
- 次回: 和泉・堺・高石の地域別（通勤以外の切り口）／美容学校の選び方と就職活動の時期（時期の事実をオーナーに確認）。金曜ではないため週次レビューなし。

### 運用変更 2026-11-18（藤津さん指示）
- 投稿日を 月・火・木・土・日 に変更。曜日テーマ（月 就職活動／火 教育・技術／木 働き方・待遇／土 体験・見学／日 地域・暮らし）とハッシュタグ（記事の `tags`）を導入。詳細は CONTENT_PLAN.md、手順は RUNBOOK.md。
- 画像・動画：人物が写ってもOK・店内の雰囲気が実際と同じならOK（FACTS.md更新）。scripts/make-video.mjs を追加（写真から約15秒の動画）、記事の本文に video ブロックを追加。
- コード：Post に tags、Blog.tsx で記事末尾に表示＋keywords。vite build／prerender／publish-gate OK。
- 初回のタグ付き記事：hogosha-biyoushi-shuushoku-shinpai（日曜テーマ寄りの内容）。Instagram下書きは autopost/sns/ に置いた（未投稿）。

## 実行ログ 2026-11-19（木・自動実行）
- 曜日／テーマ：木＝働き方・待遇／パート美容師の時給の見方。
- 準備: clone済み（HEAD detached→main・origin/mainと同期）。add_repo/register_repo_rootのツールは無く、スコープ済みのためそのまま作業。`npm ci` を実施。
- 調査: 「美容師 パート 時給 求人 見方 泉大津」上位は求人媒体（Job-medley/エン/Indeed/タウンワーク）中心。ko-un-ryu-sui.com は上位に未表示（Job-medleyにFLOWCLOUDのパート求人は表示）。時給の読み方（区分・交通費・勤務条件）を整理した記事は薄い。
- 記事追加: part-biyoushi-jikyu-minikata ／ 狙い: 美容師 パート 時給 見方 復職 ／ 切り口: 時給の区分・交通費・勤務日数と時間帯・聞いておきたいことの4点。事実はFACTS.mdのみ（パートJr1,600円〜／スタイリスト1,800円〜、パート交通費は通勤圏外の方のみ上限10,000円）。パートの有給・社会保険・勤務日数は未確認のため「個別にご案内・要相談」とし、時給からの月収換算もしていない。
- タグ: 行雲流水／美容師求人／働き方／パート美容師／時給／泉大津美容師／復職（7個）。
- 画像・動画: バナー（make-banner）＋本文写真1枚（glow店内）＋動画1本（FLOWCLOUD店内・glow店内・シャンプーブローの写真から約15秒・241KB・AI生成なし）。
- Instagram下書き: autopost/sns/part-biyoushi-jikyu-minikata.md（未投稿）。
- カバー済みテーマに追加: part-biyoushi-jikyu-minikata（給与・待遇／パート）
- 既存記事改善: 11/18に実施済みのため今回は見送り。日曜ではないため週次レビューなし。
- 検証: sitemap 35URL／vite build／prerender／publish-gate すべて終了コード0。
- 次回: 金曜は週次レビューのみ。土曜は体験・見学、日曜は地域・暮らし（和泉・堺・高石の地域別）。

## 実行ログ 2026-11-21（土・自動実行）
- 曜日／テーマ：土＝体験・見学／夜のレッスン体験（19:20〜20:20・開催日の違い）。
- 準備: clone済み（detached→main・origin/mainと同期）。add_repo/register_repo_rootのツールは無く、スコープ済みのためそのまま作業。`npm ci` を実施。
- 調査: WebSearchはこの回は未実施（無人実行・既存の調査結果を踏襲：上位は求人媒体、ko-un-ryu-sui.comは上位10に未表示）。taiken-guide（体験の全体像）と重複しないよう、レッスン体験に絞った。
- 記事追加: lesson-taiken-yoru-minikata ／ 狙い: 美容師 レッスン体験 サロン見学 美容学生 ／ 切り口: 開催日の違い・教育の枠（月25時間）・選考との関係・聞きたいことの4点。事実はFACTS.mdのみ。レッスンの具体的内容・持ち物・服装は未確認のため「申込み時にご案内／要相談」とした。
- タグ: 行雲流水／美容師求人／サロン見学／美容師体験／レッスン体験／美容学生／泉大津美容師（7個）。
- 画像・動画: バナー（make-banner）＋本文写真1枚（研修サロン）＋動画1本（研修・ミーティング・シャンプーブースの写真から約15秒・243KB・AI生成なし）。
- Instagram下書き: autopost/sns/lesson-taiken-yoru-minikata.md（未投稿）。
- カバー済みテーマに追加: lesson-taiken-yoru-minikata（体験・見学／レッスン体験）
- 既存記事改善: 日曜ではないため週次レビューなし。
- 検証: sitemap 37URL／vite build／prerender／publish-gate すべて終了コード0。
- 次回: 日曜は地域・暮らし（和泉・堺・高石の地域別）＋週次レビュー。

## 実行ログ 2026-11-22（日・自動実行）
- 曜日／テーマ：日＝地域・暮らし／泉大津で美容師として暮らし、働く（駅近・休み・住まい）。
- 準備: clone済み（detached→main・origin/mainと同期）。add_repo/register_repo_rootのツールは無く、スコープ済みのためそのまま作業。`npm ci` を実施。
- 調査: WebSearchはこの回は未実施（無人実行・既存の調査結果を踏襲：上位は求人媒体、ko-un-ryu-sui.comは上位10に未表示）。tsukin-kishiwada-izumi-sakai（通勤）・hayaban-osoban と重複しないよう、暮らし目線（駅近・休みのリズム・住まい補助・地元で見学）に絞った。
- 記事追加: izumiotsu-kurashi-hataraku-minikata ／ 狙い: 泉大津 美容師 働く 暮らし 地元 就職 保護者 ／ 切り口: 駅からの近さ・休みと勤務時間・住まいと通勤のサポート・地元で見学の4点。事実はFACTS.mdのみ。自宅からの通勤時間・周辺環境は未確認のため書かず「見学・相談時にご案内」とした。
- タグ: 行雲流水／美容師求人／泉大津／泉州／泉大津美容師／地元で就職／保護者（7個）。
- 画像・動画: バナー（make-banner）＋本文写真1枚（FLOWCLOUD外観）＋動画1本（FLOWCLOUD外観・glow受付・夜の外観の写真から約15秒・248KB・AI生成なし）。
- Instagram下書き: autopost/sns/izumiotsu-kurashi-hataraku-minikata.md（未投稿）。
- カバー済みテーマに追加: izumiotsu-kurashi-hataraku-minikata（地域・暮らし／泉大津で暮らし働く）
- 週次レビュー（既存記事の改善）: ①taiken-guide のctasに lesson-taiken-yoru-minikata・gakusei-kengaku-kakunin を追加 ②tsukin-kishiwada-izumi-sakai のctasに新記事を追加。FACTSとの照合：月20時間／90名／年中無休／19:00最終受付などの古い表記は全記事で該当なし。dateは変更なし。
- 検証: sitemap 38URL／vite build／prerender／publish-gate すべて終了コード0。export-site.sh 106ファイル。
- 数字（Search Console・GA4）はクラウドのみの実行のため「未取得」。推測しない。
- 次回: 月曜は就職活動、火曜は教育・技術。今週の軸（11/23〜）は BLOG_NETWORK の表のとおり「年末に向けて髪を整える」（採用は年末の繁忙期の働き方・FACTSの範囲）。

## 実行ログ 2026-11-23（月・自動実行）
- 曜日／テーマ：月＝就職活動の見方／サロン見学のあとの比べ方（今週の軸「年末に向けて」：年末年始休暇を比較例に使用）。
- 準備: clone済み（detached→origin/mainに揃えた）。add_repo/register_repo_rootのツールは無く、スコープ済みのためそのまま作業。`npm ci` を実施。
- 調査: 「美容学生 就職活動 サロン選び 年末 見学 いつから」は進学情報サイト・求人媒体（rikunabi等）中心。見学後の比べ方（比較メモ）に絞った記事は薄い。ko-un-ryu-sui.com の表示は未確認。就活の時期はFACTSに無いため書かず。
- 記事追加: kengaku-hikaku-memo-minikata ／ 狙い: 美容学生 サロン見学 比較 就活 新卒 ／ 切り口: 項目をそろえる・数字は内訳まで・感じたことは別欄・暮らしで最後に比べる の4ステップ。事実はFACTS.mdのみ（新卒28万の内訳・年間休日104日・年末年始休暇4日・勤務時間・月25時間）。
- タグ: 行雲流水／美容師求人／美容学生／就活／サロン見学／比較／新卒（7個）。
- 画像・動画: バナー（make-banner）＋本文写真1枚（FLOWCLOUD店内）＋動画1本（FLOWCLOUD店内・glow店内・glow受付の写真から約15秒・262KB・AI生成なし）。
- カバー済みテーマに追加: kengaku-hikaku-memo-minikata（就職活動／見学後の比較）
- 既存記事改善: 日曜ではないため週次レビューなし。Instagram下書きは作らない（11/22指示）。
- 検証: sitemap／vite build／prerender／publish-gate すべて終了コード0。
- 次回: 火曜は教育・技術。

## 実行ログ 2026-11-24（火・自動実行）
- 曜日／テーマ：火＝教育・技術／入社1年目の冬（11〜3月）のカット理論とウィッグカットの練習（今週の軸「年末に向けて」に合わせ、冬の時期の学びに絞った）。
- 準備: clone済み（main・origin/mainと同期）。add_repo/register_repo_rootのツールは無く、スコープ済みのためそのまま作業。`npm ci` を実施。
- 調査: WebSearchはこの回は未実施（無人実行・既存の調査結果を踏襲）。one-year-debut-curriculum（年間の全体像）・lesson-taiken-yoru-minikata（夜のレッスン体験）と重複しないよう、冬の時期（カット理論11〜3月）と練習の枠の見方に絞った。他2サイトの直近タイトルとの被りなし。
- 記事追加: fuyu-cut-wig-renshu-minikata ／ 狙い: 美容師 新卒 教育 カット練習 ウィッグ 1年目 ／ 切り口: 理論の季節割り・ウィッグカット通年・月25時間とレッスンの種類・確認3点。事実はFACTS.mdのみ（理論の時期、2年目の60スタイル／80名、月25時間、コタアカデミー、勤務時間内、講習費）。冬の具体的な練習内容・1日の流れは未確認のため「見学・相談時にご案内」とした。
- タグ: 行雲流水／美容師求人／美容師の成長／レッスン／カット理論／ウィッグカット／新卒（7個）。
- 画像・動画: バナー（make-banner）＋本文写真1枚（gallery-lesson-wig）＋動画1本（ウィッグ・カットのレッスン・研修サロンの写真から約15秒・296KB・AI生成なし）。
- カバー済みテーマに追加: fuyu-cut-wig-renshu-minikata（教育・技術／1年目の冬のカット理論）
- 既存記事改善: 日曜ではないため週次レビューなし。Instagram投稿・下書きは作らない（11/22指示）。
- 検証: sitemap 40URL／vite build／prerender／publish-gate すべて終了コード0。
- 数字（Search Console・GA4）は未取得。
- 次回: 木曜は働き方・待遇。

## 実行ログ 2026-11-26（木・自動実行）
- 曜日／テーマ：木＝働き方・待遇／年末の忙しい時期の働き方の確かめ方（今週の軸「年末の繁忙期の働き方」）。
- 準備: main に ff 同期。add_repo/register_repo_rootのツールは無く、スコープ済みのためそのまま作業。
- 調査: WebSearchはこの回は未実施（無人実行・既存の調査結果を踏襲）。kyujitsu-yukyu-minikata・hayaban-osoban と重複しないよう、年末の時期に4点（営業時間と最終受付・定休と不定休・年末年始休暇・練習の扱い）を並べる切り口にした。
- 記事追加: nenmatsu-hataraku-kakunin-minikata ／ 狙い: 美容師 年末 働き方 勤務時間 休み 求人 ／ 事実はFACTS.mdのみ（営業9:00〜20:00・最終受付18:00・早番遅番・朝礼・月火定休・不定休・年末年始休暇4日・年間休日104日・有給・取得率100%・勤続6.0年・月25時間・練習は勤務時間内）。「年末は忙しくなりやすい」は一般論として書き、自社の繁忙の事実は書いていない。
- タグ: 行雲流水／美容師求人／働き方／年末年始／勤務時間／休み／転職（7個）。
- 画像・動画: バナー（make-banner）＋本文写真1枚（gallery-exterior）＋動画1本（FLOWCLOUD外観・glow受付・夜の外観から約15秒・264KB・AI生成なし）。
- カバー済みテーマに追加: nenmatsu-hataraku-kakunin-minikata（働き方・待遇／年末の働き方の確認点）
- 既存記事改善: 日曜ではないため週次レビューなし。Instagram投稿・下書きは作らない（11/22指示）。
- 検証: sitemap 42URL／vite build／prerender／publish-gate すべて終了コード0。
- 数字（Search Console・GA4）は未取得。
- 次回: 土曜は体験・見学。

## 実行ログ 2026-11-28（土・自動実行）
- 曜日／テーマ：土＝体験・見学／キャスト体験は1時間から（朝礼・準備・勤務の流れと体験の日をそろえる）。週の軸は「年末に向けて」の最終日。
- 準備: origin/main に揃えて作業（add_repo/register_repo_rootのツールは無く、スコープ済みのためそのまま）。`npm ci` を実施。
- 調査: WebSearchはこの回は未実施（無人実行・既存の調査結果を踏襲）。taiken-guide（体験全体）・lesson-taiken-yoru-minikata（夜のレッスン体験）・gakusei-kengaku-kakunin・kengaku-hikaku-memo-minikata と重複しないよう、昼間のキャスト体験に絞った。
- 記事追加: cast-taiken-1jikan-minikata ／ 狙い: 美容学生 サロン見学 キャスト体験 1時間 ／ 事実はFACTS.mdのみ（キャスト体験8:30〜17:30の間で1時間から・営業9:00〜20:00・早番遅番・朝礼8:40/11:15・準備朝礼片付け練習は勤務時間内・定休月火不定休・最終受付18:00・月25時間・選考は見学→面接→採用で説明会・採用試験は体験会参加者対象）。当日の内容・持ち物・服装は未確認のため「申込み時にご案内／要相談」とした。
- タグ: 行雲流水／美容師求人／サロン見学／美容師体験／キャスト体験／美容学生／泉大津美容師（7個）。
- 画像・動画: バナー（make-banner）＋本文写真1枚（FLOWCLOUD店内）＋動画1本（FLOWCLOUD店内・glow店内・glow受付の写真から約15秒・274KB・AI生成なし）。
- カバー済みテーマに追加: cast-taiken-1jikan-minikata（体験・見学／キャスト体験の1時間）
- 既存記事改善: 日曜ではないため週次レビューなし。Instagram投稿・下書きは作らない（11/22指示）。
- 検証: sitemap 43URL／vite build／prerender／publish-gate すべて終了コード0。
- 数字（Search Console・GA4）は未取得。
- 次回: 日曜は地域・暮らし＋週次レビュー（既存記事の改善1〜2件）。
