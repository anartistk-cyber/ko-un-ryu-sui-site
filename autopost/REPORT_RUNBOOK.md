# 3サイト 分析レポートの手順書（週次の点検／月次の本レポート／四半期の見直し）

目的：検索順位・閲覧数・どこが見られているかを定期的に数字で把握し、「見た数字 → やった改善 → 次にやること」をレポートにする。
対象：FLOWCLOUD（flowcloud.net）／glow（glow-izumiotsu.jp）／行雲流水＝採用（ko-un-ryu-sui.com）
事実は `autopost/FACTS.md` のみ。数字は必ず画面から読み取った値だけを書く（推測で埋めない）。個人情報・パスワードは書かない。

## 周期
- 週次（毎週月曜）：短い点検。直近7日の数字・異常の有無・先週入れた改善の初期反応。人数が少ないうちは「参考値」と明記し、断定しない。
- 月次（毎月25日前後）：本レポート。ChatGPTから届く投稿成果（SNS・GBP・HPB）と並べて見る。
- 四半期：ページ構成・狙うキーワードの大きな見直し。

## 数字の取り方（ログイン済みChrome：claude-in-chrome）
### Search Console（順位・クリック・表示回数・検索キーワード）
- FLOWCLOUD：ドメインプロパティ `sc-domain:flowcloud.net`（URLプレフィックス https://flowcloud.net/ は権限なしになる）
- glow：URLプレフィックス `https://glow-izumiotsu.jp/`（sc-domain は権限なし）
- 採用：URLプレフィックス `https://ko-un-ryu-sui.com/`（sc-domain は権限なし）
- URL：`https://search.google.com/search-console/performance/search-analytics?resource_id=<URLエンコードしたプロパティ>&num_of_days=28`、ページ別は `&breakdown=page` を付ける → get_page_text で読む（上位10件が見える）。
- 平均掲載順位は「検索語ごとの平均」。毎回同じ条件の順位ではない。データは約2〜3日遅れ。

### GA4（閲覧数・滞在・流入元・ボタンのクリック）
- プロパティは1つ：`a55864419p561701981`（行雲流水グループ）。3サイトが同じプロパティに入っているので、パス（/menu/ など）が重なる。サイトの区別は「ページ タイトル」で行う（FLOWCLOUD／glow／採用＝「FLOWCLOUD・glow」「行雲流水」を含むタイトル）。
- ページ別：`https://analytics.google.com/analytics/web/#/a55864419p561701981/reports/explorer?params=_u..nav%3Dmaui%26_u.dateOption%3Dlast28Days&r=all-pages-and-screens&collectionId=life-cycle`
  - 表の見出しのディメンション（option-header-dropdown の button）を JS で click →「ページ タイトルとスクリーン クラス」を選ぶ。行数の select を 50 に変えると全件読める。
  - 列：表示回数／アクティブユーザー／ユーザーあたり平均エンゲージメント時間／イベント数／キーイベント。
- ホーム（`#/a55864419p561701981/reports/intelligenthome`）のカードで、直近7日の流入（チャネル／参照元／市区町村／国）が読める。
- キーイベント：cta_net_reserve（ネット予約）／cta_tel（電話）／cta_line（LINE）／cta_hotpepper（ホットペッパー）＝FLOWCLOUD・glow、recruit_lead_saved＝採用。種類別の件数は、ページ別の表の「キーイベント」列のプルダウンで切り替える。
- 注意：GA4のタブはスクリーンショットが固まる（タイムアウト）。get_page_text と JS で読む。events の別URL（all-events／conversions-event）はホームに戻される。管理 > イベント（`#/a55864419p561701981/admin/events/hub`）で一覧は見える。
- 米国などの海外アクセスは、検索ロボット等の可能性がある。人数の判断から外して注記する。

### Googleビジネスプロフィール（地図の表示・電話・ルート）
- 初回レポートでは未取得。次回以降、各プロフィールの「パフォーマンス」画面から取得する。

## レポートの形（Docsアーティファクト「行雲流水 3サイト 分析レポート」。1つの文書の先頭に新しい回を追加）
1. 今回のひとこと（3行以内）
2. 数字（サイト別：検索／閲覧・滞在／予約・問い合わせのクリック）
3. 気づき（どのページが見られ、どこで離れているか）
4. 実施した改善（日付つき。IMPROVEMENT_LOG の内容を要約）
5. 次にやること（優先順。各項目に「何を見て効果を判断するか」を書く）
6. 測れたこと・測れていないこと

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
