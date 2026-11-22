# 効果確認リスト（改善ごとの「見る数字」と判定日）

作成：2026-11-18。目的：改善を入れっぱなしにせず、決めた日に、決めた数字で良し悪しを判定する。
事実は IMPROVEMENT_LOG・reports の記録だけ。基準値が記録に無いものは「なし」と書き、推測で埋めない。

## 決まり
- 判定は、公開の **2週間後と4週間後** の2回。早く見てもよいが、断定は判定日から。
- 判定日が来た行は、次の日曜の週次点検で見る（週次点検の最初に、この表を開く）。
- 数が小さい（表示30未満・キーイベント10件未満）は「判断保留（参考）」と書き、良し悪しを言わない。
- 結果欄に「改善／変化なし／悪化／判断保留」＋数字＋判定した日を書き、IMPROVEMENT_LOG にも1行残す。悪化なら、戻すか直すかを同じ日に決める。
- 期間は GA4・Search Console とも、基準値と同じ幅で比べる（REPORT_RUNBOOK「数字の精度を保つ決まり」）。
- 新しい改善を入れたら、この表に1行足す（公開日・見る数字・基準値・判定日）。

## リスト
| 改善（公開日） | 見る数字・場所 | 基準値（出典） | 判定日（2週間後／4週間後） | 結果 |
|---|---|---|---|---|
| 検索語に合わせた FAQ（コタオイル・表面ハイライト・編み込み・美容液カラー・理容室）FC・glow（11/8） | Search Console の、その語の表示・クリック・順位 | 11/8 と 11/15 の値：reports/2026-11-15_weekly.md の「FAQ 狙い語」の表 | 11/22／12/6 | |
| FAQ「お支払い方法・FLOWCLOUD の駐車場・お子さまのカット」「料金の目安と、お得なクーポン」（11/9） | 「泉大津 美容室 安い」などの表示・クリック（FC・glow）。/faq/・/menu/ の表示 | 11/9 時点の28日値：IMPROVEMENT_LOG 2026-11-09 19:1x | 11/23／12/7 | |
| 美容液カラーの記事（FC: serum-color-40-50／glow: serum-color-fuyu-young）と /color/ からの内部リンク（11/10） | 2記事の表示・クリック（Search Console ページ別）、/color/ の表示 | なし（公開直後） | 11/24／12/8 | |
| FC 旧WP記事6記事の古い求人・給与を、採用サイトへの案内に差し替え（11/12） | GA4 の採用サイトへの流入（UTM つきリンク経由）、採用の recruit_cta_click | 11/15 の週次：差し替えリンクからの流入は 0 | 11/26／12/10 | |
| 採用マッチング診断の入口 /match/・LINE への入口・問数7問（11/13〜11/14） | GA4 採用：recruit_cta_click／recruit_line_click／recruit_form_start／recruit_lead_saved／view_job（7日）。11/17 以降は「採用CTAの場所・種類」別 | 11/8〜11/14：recruit_cta_click 15（5人）／recruit_line_click 2／recruit_form_start 1／recruit_lead_saved 0／view_job 9（IMPROVEMENT_LOG 11/15 10:06） | 11/27／12/11 | |
| FC・glow の予約ブロックの見出しを、ページの内容に合わせた言葉に変更（11/15） | GA4 ページ別の「表示→キーイベント」（直したページ。FC と glow はページタイトルで分ける） | 11/8〜11/14：FC トップ 88→12／glow トップ 49→5／glow クーポン 16→6／FC メニュー 18→1／glow メニュー 13→2（IMPROVEMENT_LOG 11/15 10:06） | 11/29／12/13 | |
| FC の予約ブロック下に /coupon/ への文字リンク（glow は元からあり）（11/16、本番確認 11/17） | /coupon/ の表示とキーイベント（FC と glow はページタイトルで分ける） | 11/8〜11/14：/coupon/ 表示 18・キーイベント 6（reports/2026-11-15_weekly.md の気づき2） | 11/30／12/14 | |
| /straight/ の FAQ に「ブリーチをした髪でも縮毛矯正はできますか？」を追加（FC・glow）（11/18 公開、本番確認は取り込み後） | Search Console の「泉大津 ブリーチ矯正」の表示・クリック・順位（FC。glow は出れば）。/straight/ の表示 | FC 直近28日（11/18 に読んだ値）：表示16・順位5.3・クリック0。glow：読んだ範囲では出ていない（IMPROVEMENT_LOG 2026-11-18 20:08・20:2x） | 12/2／12/16 | |
| 表示速度（スマホ）の維持 | PageSpeed：性能点数・LCP・TBT（3サイト） | 11/17：FC 100／glow 97（TBT 200ms）／採用 99、LCP 0.9〜1.1秒（IMPROVEMENT_LOG 11/17） | 11/22（glow を再測定）／12/2（月次） | |
| ブログ自動投稿（FC 水・土／glow 火・金） | 新記事の表示・クリック（Search Console ページ別の /salon-blog/・/journal/） | なし（記事ごとに公開日から4週間後に見る。まとめては月次の本レポートで） | 12/2（月次）から | |
| FC 予約の準備の記事（yoyaku-junbi-40-50）と、nenmatsu-hair-plan・cut-erabikata からの内部リンク（11/20） | 3記事の表示・クリック（Search Console ページ別）、予約CTA（GA4 cta_*） | なし（公開直後） | 12/4／12/18 | |
| 美容師タイプ診断の公開と LINE 結果カード（採用 /type-shindan/）（11/20） | GA4 の type_shindan_start／type_shindan_result／type_shindan_line の件数、/type-shindan/ の表示、行雲流水LINE の友だち数（11/20 時点 7） | なし（公開直後） | 12/4／12/18 | |
| 採用トップの最初の画面に「美容師タイプ診断」カード（キャラ8人）を先頭に置き、7問カードを2番目にした（11/22） | GA4 採用：recruit_cta_click の cta_type=type_shindan・placement=hero の件数、同じ placement=hero の cta_type=match の件数、type_shindan_start（トップ経由）、トップの表示数。PageSpeed（スマホ）：性能点数・LCP | 11/17〜11/21 の5日：placement=hero の7問（match）クリック 5。トップ約39表示／週。直近28日の採用CTAクリック 25（9人）。PageSpeed 採用：99・LCP 0.9〜1.1秒（11/17）。診断カードは公開直後でなし | 12/6／12/20 | |
| FLOWCLOUD・glow のトップの最下部（採用情報・姉妹店の下）に「美容師タイプ診断」の広告帯（11/22） | GA4：type_shindan_click（pos=home_banner、FC と glow はページタイトルで分ける）。採用サイト側の type_shindan_start のうち流入元 fc_site／glow_site（utm_source）。FC・glow トップの予約系キーイベント（cta_net_reserve／cta_tel／cta_line／cta_hotpepper）が減っていないか（広告帯が予約の邪魔になっていないか）。PageSpeed（FC・glow） | なし（公開直後）。予約系キーイベントは直近の週次（autopost/reports の最新）を基準。PageSpeed：11/17 FC 100／glow 97 | 12/6／12/20 | |
| 美容師タイプ診断：LINE の結果カードをゲーム風に（属性・BP・必殺技・キラキラ抽選）（11/22） | GA4：type_shindan_result に対する type_shindan_line の割合（LINE へ進んだ率）。回答ログの「キラキラ（0〜4）」の件数。行雲流水LINE の友だち数 | 11/20〜11/22 は公開直後で件数が少ない（前の行の判定と合わせて見る） | 12/6／12/20 | |
| 店頭用「Googleマップの感想のお願い」カード（A6）を作成（11/22。使うかは藤津さん＝APPROVALS 11） | Google のクチコミ件数と平均（FLOWCLOUD・glow の月次：GBP パフォーマンス／Google マップの表示） | 11月時点（llms.txt）：FLOWCLOUD 4.8・118件／glow 4.9・17件 | 12/2（月次で件数を記録）／12/20 | |
| IndexNow の仕組み（キーファイル3サイト＋送り方）（11/22）。Bing Webmaster Tools の登録は藤津さん待ち（APPROVALS 9） | 登録後：Bing Webmaster Tools の索引数・検索表示（3サイト）。IndexNow 送信の応答（200/202） | なし（Bing 側は未登録で数字が取れない） | 登録の1〜2週間後に読む | |
| FLOWCLOUD トップ「キャスト紹介」の320px幅のはみ出し（9px。glow も同じ共通CSS）を直した（11/22、shared/css/30-delight.css） | 手元の overflow-test（320/360/390/768/1280px）が 0 のまま | 直す前：320px で FLOWCLOUD トップが 9px はみ出し | 次回の公開前点検 | |
| IndexNow を3サイトに送信（11/22 12:3x。採用200・FLOWCLOUD 202・glow 202）／FLOWCLOUD の構造化データ sameAs にエキテンの掲載を追加（11/22） | Bing Webmaster Tools（登録後）の索引数と、ChatGPT・Copilot の回答に出る店の情報（住所・営業時間）が現在の値か | なし（Bing 側は未計測。エキテンの営業時間は藤津さんの修正待ち＝APPROVALS 12） | 12/6（IndexNow・Bing 登録後の最初の読み取り） | |
| 採用トップ PageSpeed（11/22：95/100/100/100・FCP 1.1・LCP 1.1・TBT 260ms・SI 1.9。FLOWCLOUD・glow は100） | TBT が200ms以下に戻るか（採用トップの診断カード追加後に増えた）。原因は自社バンドル4本（各80〜110ms）と GA4 2本（126〜137ms）。GA4 を遅らせると計測が欠けるので見送り | 11/6 に TBT 60ms（88点）→ 今回 TBT 260ms（95点） | 12/4 の週次で再測定 | |

## 計測の変更の目印（比べるときの注意）
- 11/3：GA4 の「CTA位置（pos）」を登録（FC・glow）。
- 11/8：GA4 の Internal Traffic を有効化（登録済み端末のアクセスは入らない。過去分は消えない）。
- 11/15：GA4 に「採用CTAの場所（placement）」「採用CTAの種類（cta_type）」を追加。数字は 11/17 以降から。
- 11/17：週次・月次の定期タスクで「このパソコンを必須にする」をON（藤津さんの報告）。自動の回の取得項目が増えるかを 11/22 に確認。
- 11/22：採用トップに recruit_section_view（各セクションが画面に入った回数。placement=sec-◯◯）を追加。**イベント総数が増えるので、11/22 以降の「イベント総数」は前と比べない**（比べるのは recruit_cta_click など個別のイベント）。
- 11/22：FLOWCLOUD・glow のページ共通スクリプトに type_shindan_click を追加（広告帯のクリックだけ。ほかのイベントは変更なし）。
| 採用サイトの「LINEで相談」ボタンを、記入用の文面（【採用のご相談】①ご希望 ②お名前 ③ご質問・見学のご希望日など）が入った状態でLINEのトークが開く形に変更（11/22 公開。新卒・中途・パート・学生アルバイトのページは①を先に入力） | 公式LINE（採用）に届く最初のメッセージが「【採用のご相談】」の形になっているか（藤津さんの目視）／GA4 の recruit_line_click（直近7日）／LINEの友だち数 | なし（GA4 は 12/6 の週次で、11/22 以前の同じ幅と並べて記録する。友だち数は 11/22 時点で 9） | 12/6／12/20 | |
