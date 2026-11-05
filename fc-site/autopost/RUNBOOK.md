# FLOWCLOUD お知らせ・ブログ 自動投稿 RUNBOOK
対象: https://www.flowcloud.net/salon-blog/ （静的サイト。GitHub main の fc-site/site を Xserver が毎時22分に取り込む）
ターゲット: 泉大津〜南大阪・泉州（岸和田・高石・和泉・和泉府中・春木・和泉中央・羽衣・堺・泉佐野・貝塚）で美容室を探す、素髪をきれいにしたい40〜50代女性。

## 1回の手順（1回=記事1本）
1. リポジトリを add_repo(access=push) で取得し clone。fc-site/autopost/FACTS.md と ANALYSIS.md を読む。
2. WebSearch で調査（standard）。テーマ候補: 季節のヘアケア、40〜50代の髪悩み（パサつき・うねり・ボリューム・白髪/退色）、ヘッドスパ、縮毛矯正/髪質改善の選び方、ホームケア、サロン選び。検索意図に答える。直近の既出テーマと重複しない。
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
