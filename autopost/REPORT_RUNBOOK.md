# 3サイト 分析レポートの手順書（週次の点検／月次の本レポート／四半期の見直し）

目的：検索順位・閲覧数・どこが見られているかを定期的に数字で把握し、「見た数字 → やった改善 → 次にやること」をレポートにする。
対象：FLOWCLOUD（flowcloud.net）／glow（glow-izumiotsu.jp）／行雲流水＝採用（ko-un-ryu-sui.com）
事実は `autopost/FACTS.md` のみ。数字は必ず画面から読み取った値だけを書く（推測で埋めない）。個人情報・パスワードは書かない。

## 周期
- 週次（毎週日曜17:23に作成→月曜朝に読める）：短い点検。直近7日の数字・異常の有無・先週入れた改善の初期反応。人数が少ないうちは「参考値」と明記し、断定しない。
- 月次（2026-11-06 藤津さん了承で、毎月1日→2日の流れに変更。以前の「毎月25〜26日・直近28日」は廃止）：
  1. 毎月1日 朝8時ごろ（一次）：HPB（SALON BOARD）・SalonAnswerの前月分を読んで記録。藤津さんがChatGPT（◆自動投稿）の「◆月次成果」を貼ってくれた分も同じ記録に残す（貼られなければ「未受領」）。
  2. 毎月1日 夕方18時ごろ（二重チェック）：朝の数字を読み直して照合。
  3. 毎月2日 朝8時台（本レポート）：前月1日〜末日の数字（検索・GA4・GBP・表示速度・ヒートマップ）に、1日の記録（HPB・SalonAnswer・ChatGPT成果）を並べる。Docs先頭に「今月のまとめ（1ページ）」→詳しい分析の順に作る（レポートは1つ）。幹部共有用に、Docs全体のPDFの『今月のまとめ』のあとへグラフのページを差し込んだ1つのPDFを `autopost/tools/summary_pdf/`（README「1つのPDFにする手順」）で作って藤津さんへ送る。HPB・SalonAnswerには2日にはログインしない。
  4. サイトの数字の更新（毎月2日、本レポートの後）：口コミ評価は `fc-site/data.json`・`glow-site/data.json` の `ratings`（asOf と、HPB: avg／count／4項目、Google: avg／count）を、HPBの口コミ画面とGoogleビジネスプロフィールで**見た値だけ**に書き換える（件数が増えただけでも更新。asOf は「YYYY-MM-DD」）。休業日リスト `closed` は末尾の日付が2か月先まで入っているかを見て足す（FLOWCLOUDのリストは2027-01-26まで）。更新後は `node build.mjs`→manifest再生成→push。ページ上の「◯年◯月時点」「直近1年の集計」は asOf から自動で出る。
- 四半期（1・4・7・10月の2日の本レポートに付ける）：ページ構成・狙うキーワードの大きな見直し。

## 数字の取り方（ログイン済みChrome：claude-in-chrome）
### Search Console（順位・クリック・表示回数・検索キーワード）
- FLOWCLOUD：ドメインプロパティ `sc-domain:flowcloud.net`（URLプレフィックス https://flowcloud.net/ は権限なしになる）
- glow：URLプレフィックス `https://glow-izumiotsu.jp/`（sc-domain は権限なし）
- 採用：URLプレフィックス `https://ko-un-ryu-sui.com/`（sc-domain は権限なし）
- URL：`https://search.google.com/search-console/performance/search-analytics?resource_id=<URLエンコードしたプロパティ>&num_of_days=28`、ページ別は `&breakdown=page` を付ける → get_page_text で読む（上位10件が見える）。
- 平均掲載順位は「検索語ごとの平均」。毎回同じ条件の順位ではない。データは約2〜3日遅れ。
- 検索語ごとの順位（固定キーワード表用）：URL の末尾に `&metrics=CLICKS%2CIMPRESSIONS%2CPOSITION` を付けると表に「掲載順位」列が出る。表下の「1 ページあたりの行数」を 250 にして、JS で `table tbody tr` の td を読む（クエリ｜クリック｜表示｜CTR｜順位）。表示回数の多い順に並べ替えて上位40件を読めば足りる。
- 固定キーワード表：`autopost/reports/2026-11-05_rank_ai_speed_baseline.md` の「2.」の語を毎回同じ語で追う。表示が出ていない語は「まだ表示なし」と書く。新しく表示され始めた重要な語は表に足す。
- Google検索の生成AI機能（AI概要など）での表示：`https://search.google.com/search-console/performance/search-analytics/ai?resource_id=<プロパティ>&num_of_days=28`（ベータ）。「合計表示回数」と「上位のページ」を読む。**旧ブログ記事（www付きURLの数字だけのパス）が出ていたら、古い価格・古い情報が案内されていないか内容を確認する**（2026-11-05：/14644/ に旧価格あり）。

### GA4（閲覧数・滞在・流入元・ボタンのクリック）
- プロパティは1つ：`a55864419p561701981`（行雲流水グループ）。3サイトが同じプロパティに入っているので、パス（/menu/ など）が重なる。サイトの区別は「ページ タイトル」で行う（FLOWCLOUD／glow／採用＝「FLOWCLOUD・glow」「行雲流水」を含むタイトル）。
- ページ別：`https://analytics.google.com/analytics/web/#/a55864419p561701981/reports/explorer?params=_u..nav%3Dmaui%26_u.dateOption%3Dlast28Days&r=all-pages-and-screens&collectionId=life-cycle`
  - 表の見出しのディメンション（option-header-dropdown の button）を JS で click →「ページ タイトルとスクリーン クラス」を選ぶ。行数の select を 50 に変えると全件読める。
  - 列：表示回数／アクティブユーザー／ユーザーあたり平均エンゲージメント時間／イベント数／キーイベント。
- ホーム（`#/a55864419p561701981/reports/intelligenthome`）のカードで、直近7日の流入（チャネル／参照元／市区町村／国）が読める。
- キーイベント：cta_net_reserve（ネット予約）／cta_tel（電話）／cta_line（LINE）／cta_hotpepper（ホットペッパー）＝FLOWCLOUD・glow、recruit_lead_saved＝採用。種類別の件数は、ページ別の表の「キーイベント」列のプルダウンで切り替える。
- 注意：GA4のタブはスクリーンショットが固まる（タイムアウト）。get_page_text と JS で読む。events の別URL（all-events／conversions-event）はホームに戻される。管理 > イベント（`#/a55864419p561701981/admin/events/hub`）で一覧は見える。
- 米国などの海外アクセスは、検索ロボット等の可能性がある。人数の判断から外して注記する。
- 流入元（参照元／メディア）：`#/a55864419p561701981/reports/explorer?params=_u..nav%3Dmaui%26_u.dateOption%3Dlast28Days%26_r.explorerCard..seldim%3D%5B%22sessionSourceMedium%22%5D&r=lifecycle-traffic-acquisition-v2&collectionId=life-cycle`（`seldim` でディメンションを指定できる）。チャネル別は `seldim` なし。表は `1\t` 以降を JS で読む。chatgpt.com / perplexity / claude.ai / gemini などAI経由の参照元が出ていないかを毎回確認する。
- ツールの出力に「項目=値;項目=値」の形（Cookieに似た形）を返すと遮断されることがある。「項目 -> 値 / 項目 -> 値」の形で返す。
- 公開直後の確認：ブラウザが古いHTMLをキャッシュしていると新しい仕組みが効かない（FLOWCLOUD で確認）。確認用のURLには `&r=2` などを付けて開く。サーバー側の対策案は `server-files/htaccess-html-revalidate.txt`。
- 内部アクセス除外：各端末で `https://flowcloud.net/?krs_internal=1`（glow・採用サイトも同様）を一度開くと、その端末は GA4 に traffic_type=internal で送られ、Clarityも読み込まない。GA4 の「データフィルタ > Internal Traffic」は **2026-11-08 21:5x に「有効」にした**（藤津さんの指示。元に戻せない）。有効化の後に届く、登録済み端末のアクセスは GA4 に入らない（過去の分は消えない）。登録していない端末（スタッフのスマホ・店のPCなど）は今までどおり数えられる。「現在テスト」という記述が他の指示文に残っていても、この行が正しい（有効化の提案は不要）。
- Search Console との連携：GA4 の「Search Console のリンク」は1プロパティにつき1件のみ。**flowcloud.net（ドメイン）↔ FLOWCLOUD ストリームを連携済み（2026-11-05）**。glow・採用は上限のため連携できないので、Search Console の画面で直接読む。

### Googleビジネスプロフィール（地図の表示・電話・ルート）
- 初回レポートでは未取得。次回以降、各プロフィールの「パフォーマンス」画面から取得する。

## 追加の測定項目（2026-11-05 から）
### 表示速度（PageSpeed Insights・月次。大きな変更の後にも）
- API（キー無し）は1日の上限ですぐ止まる。`https://pagespeed.web.dev/analysis?url=<URLエンコード>&form_factor=mobile` をChromeで開き、約30秒待って、スコア（性能）・LCP・FCP・TBT・CLS を読む。`.lh-container` の最初の要素が表示中のスマホ結果。
- **FLOWCLOUD は海外IP制限でPSIが403になり、点数が無効（100点は403ページの値）。** `.htaccess` に Chrome-Lighthouse の許可を追記すれば測れる（案は `server-files/htaccess-fc-google-allow.txt`。適用は藤津さん）。適用前は「測れない」と書く。
- 目安：LCP 2.5秒以下・CLS 0.1以下・性能 90点以上。超えたら原因（動画・大きな画像・フォントの読み込み待ち）を調べて直す。

### 実際の来店・予約（HPB／SalonAnswer）
- ホットペッパー（SALON BOARD）：藤津さんがChromeでログインしている時だけ読める（パスワードは入力しない）。FLOWCLOUD と glow は**別ID**（画面右下の表示で確認：「FLOW CLOUD様 / H000173335」「glow様 / H000798580」）。店舗の切替画面は無く、glowを読むには藤津さんにログインし直してもらう。
  - 読む画面：`https://salonboard.com/CLP/bt/analysis/report/basicInfo/`（集計・分析 > HOT PEPPER Beauty レポート > 基本情報）。グラフに数字が出ないので、JSで `Highcharts.charts.filter(Boolean).map(c => c.series.map(s => s.name + ' ' + s.data.map(d => d.y).join(',')).join(' / '))` を読む。順番は サロン情報PV数／CVR／ACR／予約数／予約売上高／（PV数タブ）総PV／サロン情報PV／ブログPV／クーポンメニューPV／スタイルPV。系列は「自店」と「同P/同A平均」。
  - 月の切替：画面を一番上に戻し、「先月」ボタンを押して「出力する」を押す（フォームを直接submitしても戻る）。月ごとに同じ手順で読む。
  - 記録するのは件数・割合のみ。**金額（予約売上高）はレポートに書かない。**
  - これは「HPB経由」の数字。自サイトの予約ボタン経由の来店数は、ここでは分からない（SalonAnswer の新規来店動機や、GA4 の cta_net_reserve と並べて見る）。
  - 目安：ACR（クーポンを見た人が予約完了まで進む割合）が平均より低ければ、クーポン内容・価格・予約枠の見直し候補。
- SalonAnswer（`https://sam003.salonanswer.com/sas/pos-open`）：新規来店動機は「分析表 > 定着率分析（来店動機別）」（`/sas/report-summary-repeat-customer-coming-causes/`）で、期間を月初〜月末にして「この条件で集計」→ 画面上部の「集計中」アイコンの一覧で「完了」になったら「表示」。結果は iframe 内（`/show/<番号>`）にあり、JSで表を読む。件数のみ記録（金額・個人名は書かない）。**`/sas/pos-open/close-pos` のURLを開くと「業務終了」が実行されてしまう。** 店舗切替は、藤津さんが了承した時だけ業務終了→業務開始まで続けて行い、終わったら FLOWCLOUD（コード1・レジ金額50,000）に戻す。
  - 店舗切替の実際の手順（2026-11-05、藤津さんの了承のもとで実施・成功）：①左上の「業務終了」ボタン → 業務開始画面（`/sas/pos-open`）。②店舗コード欄に切替先（glow＝2）を入力して Tab → 店舗名が出る。レジ金額は店ごとの初期値が自動で入る（glow 30,000／FLOWCLOUD 50,000）。業務開始日は当日のまま → 「業務開始」。③「定着率分析（来店動機別）」で年月日の2欄に `2026/10/01`・`2026/10/31` を入力（欄を3回クリックして上書き）→「この条件で集計」→ 約30秒で完了 → 上部「集計完了」アイコンの一覧から「表示」。④読み取り後、同じ手順で FLOWCLOUD（コード1・50,000）の業務開始に戻し、予約グラフに戻ったことを確認する。予約グラフには個人名が出るので、数字だけを記録する。
- SalonAnswer：新規来店動機（来店のきっかけ）の件数。入力が空の人が多いので、「受付で来店動機を必ず聞いて入力する」運用にしてもらえると、サイトの効果と突き合わせられる。
- 取れない時は「未取得」と書き、理由を書く。

### 採用の流れ
- フォーム：「このサイトを知ったきっかけ」（任意）と流入元（UTM）が、受付メールの末尾と GA4 の recruit_lead_saved（found_via／campaign）に入る。GA4 でレポートに出すには、管理 > カスタム定義で `found_via`・`campaign`（イベントスコープ）を登録する。
- 週次：recruit_form_start（入力開始）→ recruit_lead_saved（送信完了）の数を並べ、離脱率の目安にする。

### 流入元のリンク（UTM）
- `autopost/UTM_LINKS.md` のリンクとQRを使う。Instagram・LINE は必ず `utm_medium=social`。

## レポートの形（Docsアーティファクト「行雲流水 3サイト 分析レポート」。1つの文書の先頭に新しい回を追加）
1. 今回のひとこと（3行以内）
2. 数字（サイト別：検索／閲覧・滞在／予約・問い合わせのクリック）
3. 気づき（どのページが見られ、どこで離れているか）
4. 実施した改善（日付つき。IMPROVEMENT_LOG の内容を要約）
5. 次にやること（優先順。各項目に「何を見て効果を判断するか」を書く）
6. 測れたこと・測れていないこと
7. 追加の測定（月次）：表示速度（スマホ）／検索順位の固定キーワード表／AI検索での表示（生成AI機能の表示回数・引用ページ・AI経由の流入）／流入元の内訳／来店・予約（HPB・SalonAnswer）

## 判断ルール
- 数が少ない（表示が30未満など）は「参考」。1週間の増減だけで改善の良し悪しを決めない。改善の効果は2〜4週間見る。
- 同じ指標・同じ期間幅で前回と比べる。比べられない時は理由を書く。
- 週次の点検で緊急（急な落ち込み・403・表示崩れ）が見つかれば、その場で原因調査して IMPROVEMENT_LOG に記録する。
- 改善は FACTS と公式表記（キャスト／FLOWCLOUD／カットはシャンプーブロー込）に反することをしない。

## 記録
- 各回の数字の要約を `autopost/reports/YYYY-MM-DD_*.md` に保存する（次回の比較用）。
- 実施した改善は `autopost/IMPROVEMENT_LOG.md` に追記する。反映は fetch → ff-merge → push。

## ヒートマップ（Microsoft Clarity）の導入手順（2026-11-05 準備済み・ID待ち）
- 仕組み：IDが空の間は、スクリプトもプライバシーポリシーの追記も出ない。IDを入れてビルドすると、全ページにスクリプトが入り、プライバシーポリシーに「ヒートマップ（Microsoft Clarity）」の段落が付く（部品：shared/clarity.mjs）。
- ID（Clarityのプロジェクト1つにつき1つ。サイトごとに別プロジェクトにする）を入れる場所：
  - FLOWCLOUD：fc-site/data.json の "clarity"
  - glow：glow-site/data.json の "clarity"
  - 採用：client/.env の VITE_CLARITY_ID（その後 `VITE_PUBLISH=1 npx vite build && node scripts/prerender.mjs dist && node scripts/publish-gate.mjs dist && bash scripts/export-site.sh`）
- 採用サイトのお問い合わせ・応募フォームは data-clarity-mask="True" で入力内容を収集しない設定にしてある（ContactForm.tsx）。FLOWCLOUD・glowには文字入力フォームがない。
- Clarityのプロジェクト設定（藤津さん側）：マスキングは「Balanced（初期値）」のまま。GA4との連携は、Clarityの設定 > 「Google Analytics連携」で、連携すると GA4 の画面からClarityの録画へ移れる。
- 読み取り：clarity.microsoft.com のダッシュボード（ヒートマップ・スクロール到達・「デッドクリック」「レイジクリック」）。直近7日／28日の「クリック率の高い要素」「スクロールの深さ」をレポートに入れる。
- 導入直後の数日はデータが少ない。ヒートマップは1ページ数百ビュー程度でやっと形になる（いまのサイトは1ページ数十ビュー）ので、判断は「参考」とし、月次で見る。

## 週次点検の取り方（2026-11-08 21:57 藤津さんが「A」を選択）
- 日曜17:23と19:41の自動実行は、無人のためブラウザ（Chrome）が使えず、Search Console・GA4・GBP の数字を取れない（11/8 に2回とも未取得／表記照合のみ）。
- そのため、週次点検の数字は**日曜17:40に、対話のチャット（パソコンがつながっている状態）で取る**。自動の回が先に「未取得」の md を作っていたら、同じ日付の md に「追記」として数字を足す。Docs の週次の項も同じチャットで足す。
- 取り終えたら、翌週（日曜17:40）の同じ予約を send_later で入れ直す。19:41 の自動「週次分析と改善」は、取れた数字を読んで動く（17:40〜19:40 の間に終える）。
- 「このコンピュータを必須にする」設定（案B）は使わない。
