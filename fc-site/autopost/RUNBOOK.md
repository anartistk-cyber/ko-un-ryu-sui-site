# FLOWCLOUD お知らせ・ブログ 自動投稿 RUNBOOK
対象: https://www.flowcloud.net/salon-blog/ （静的サイト。GitHub main の fc-site/site を Xserver が毎時22分に取り込む）
ターゲット: 泉大津〜南大阪・泉州（岸和田・高石・和泉・和泉府中・春木・和泉中央・羽衣・堺・泉佐野・貝塚）で美容室を探す、素髪をきれいにしたい40〜50代女性。

## 投稿日（2026-11-18 藤津さん指示）
週3回、月・水・金に1本ずつ。glow（火・木・土）と交互に出し、ほぼ毎日どちらかが更新される形にする。

## 1回の手順（1回=記事1本）
1. リポジトリを add_repo(access=push) で取得し clone。fc-site/autopost/FACTS.md と ANALYSIS.md を読む。
2. 今日の曜日のテーマ（下の「曜日テーマ」）を決め、glow-site/autopost/POST_LOG.md と ANALYSIS.md で直近のテーマ・slugと重複しないことを確認。WebSearch で調査（standard）。テーマ候補: 季節のヘアケア、40〜50代の髪悩み（パサつき・うねり・ボリューム・白髪/退色）、ヘッドスパ、縮毛矯正/髪質改善の選び方、ホームケア、サロン選び。検索意図に答える。直近の既出テーマと重複しない。
3. 記事を fc-site/data.json の posts 先頭に追加（type=ブログ or お知らせ、date=今日(JST)、slug 英数ハイフン、title 32字前後でキーワードを含む、desc 100〜120字、image は /cms/wp-content/uploads/2018/12/<名前>.jpg の既存写真から内容に合うもの: FLOW-CLOUD-001-1024x733(外観) / FLOW-CLOUD-063(店内) / FLOW-CLOUD-047(店内テーブル) / FLOW-CLOUD-031(シャンプー空間) / FLOW-CLOUD-051(暗い施術室)。alt は写真の内容を正確に）。
   本文は body 配列（{p},{h2},{ul}）。800〜1500字、h2を2〜4個。一般的なヘアケア情報は書いてよいが FACTS.md にない店の事実は書かない。末尾に予約導線は自動で付く。
4. 休業日の変更を依頼された場合は data.json の closed を更新（YYYY-MM-DD）。お知らせ記事も追加。
5. `cd fc-site && node build.mjs`（出力は fc-site/site）→ manifest.json を再生成（下記）→ git commit & push main。
   manifest: cd site && find . -type f ! -name manifest.json | sed 's|^\./||' | sort | while read f; do printf '%s\t%s\n' "$f" "$(sha256sum "$f"|cut -d' ' -f1)"; done | python3 -c "import sys,json;print(json.dumps({'files':[dict(zip(('path','sha256'),l.rstrip('\n').split('\t'))) for l in sys.stdin]},ensure_ascii=False,indent=1))" > manifest.json
6. ANALYSIS.md に実行ログ（日付・テーマ・狙いのキーワード）を追記。
## 週次レビュー（金曜）
- 既存記事を見直し、古い情報の更新・内部リンクの追加・タイトル/説明の改善を1〜2件。
## 品質
- 数値・効果・口コミ・キャストの発言を創作しない。医療的な断定をしない。コミットメッセージ末尾に Co-Authored-By 行。

## 曜日テーマ（2026-11-18 開始。数字を見て入れ替える）
- 月＝髪のお悩み解決（40〜50代：パサつき・うねり・ぺたんこ・細毛感・白髪/退色）。タグ #髪のお悩み #40代ヘアケア #50代ヘアケア
- 水＝メニュー・相談のしかた（髪質改善・ヘッドスパ・美容液カラー・カット・コタ）。該当メニューのタグ（#髪質改善 #ヘッドスパ #美容液カラー など）
- 金＝季節・おでかけ・予約の準備（年末・ヘアセット・ホームケア・週末前の予約・休業日のお知らせ）。タグ #ヘアセット #年末 など
- 共通タグ：#FLOWCLOUD #泉大津美容室 #泉大津駅。地域は記事に合わせて #和泉 #高石 #堺 #岸和田 #泉州 を足す。
- ハッシュタグはブログ本文には入れない。記事ごとに Instagram 用の下書き（キャプション＋タグ）を fc-site/autopost/sns/<slug>.md に置く。投稿は外部への発信なので autopost/APPROVALS.md の「OK待ち」に入れ、藤津さんの「OK 番号」を待つ（自動投稿しない）。
- 同じテーマを続けない。

## glowとの連携（情報交換）
- 毎回、glow-site/autopost/POST_LOG.md と glow の直近記事を読み、同じ週に同じ悩みが重ならないようにする。重なる場合は、年代・切り口で書き分ける（FLOWCLOUD＝40〜50代、glow＝10〜20代）。
- 数字（閲覧・検索流入・予約CTA）で伸びたテーマ・切り口は、相手のサイトの次のテーマの参考にする（ANALYSIS.md の「glowへの共有」に1行書く。glow側は POST_LOG の見直しで読む）。
- 内部リンクは、読者に役立つ場合だけ姉妹店へ張る（例：年代の違うお子さん・ご家族向けの記事）。両店の事実は混ぜない（各店の FACTS.md のみ）。
- 年末・休業日など両店共通のお知らせは、同じ週に出して表記を揃える。

## 画像・動画
- 既存写真（上の5枚）に加え、記事ごとに内容に合わせた文字入りカード（FLOWCLOUDの配色）を作ってよい。実在のお客様・キャストに見える人物画像、店内の偽写真、仕上がりのビフォーアフターは作らない。
- 動画は記事の要点を見せる15秒の縦動画（Instagramリール用の下書き）。作成・投稿は藤津さんのOK後。

## データの記録と見直し
- 公開のたびに fc-site/autopost/POST_LOG.md に1行：日付・曜日・テーマ・slug・タグ・画像の種類。
- 週次（日曜の分析）で、テーマ別・曜日別に 閲覧数・検索流入・予約ボタン（cta_*）のクリックを POST_LOG の列に追記する。取れない数字は「未取得」と書き、推測しない。
- 4週ごとに、数字の良いテーマを増やし、反応の薄いテーマは切り口を変える（理由を POST_LOG に書く）。
