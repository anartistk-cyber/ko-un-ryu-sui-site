# 行雲流水（採用）LINE公式（@512rmwnk）リッチメニュー案（2026-11-09・藤津さん承認待ち）

藤津さんの希望（11/9 14:17「行雲流水のリッチメニューは作ってない。作りたい」「公式LINEは Claude コードでやってもらってよいか」）。LINE公式の作業は今後 Claude が担当。**志塾公式は触らない。** **【反映済み 2026-11-09】** 藤津さんが承認し、管理画面で公開（表示期間 2026/11/09 00:00〜2027/11/08 23:59、6つのリンクと画像を再読み込みで確認）。元に戻す／止める手順：管理画面 リッチメニュー一覧で「採用メニュー」を削除（または表示期間を変更）。

## 画像
- `autopost/line-richmenu/koun_recruit_2500x1686.png`（2500×1686・約220KB。元は koun_recruit_menu.html を render.js で書き出し）
- 採用サイトの配色（ふかい緑 #1c6665・淡い緑）、3列×2行の6ボタン。文字は短い見出し＋英字の小さな補足。数字・待遇・年度は画像に入れない（古くならないように）。

## ボタンと遷移先（すべてリンク。UTM は UTM_LINKS.md の採用用 richmenu と同じ utm_source=line&utm_medium=social&utm_campaign=richmenu）
| # | 位置 | 表示 | 遷移先 |
|---|---|---|---|
| 1 | 左上 | 見学・相談 | https://ko-un-ryu-sui.com/visit?utm_source=line&utm_medium=social&utm_campaign=richmenu |
| 2 | 中上 | 募集要項 | https://ko-un-ryu-sui.com/jobs/?utm_source=line&utm_medium=social&utm_campaign=richmenu |
| 3 | 右上 | 新卒の方 | https://ko-un-ryu-sui.com/recruit/newgrad?utm_source=line&utm_medium=social&utm_campaign=richmenu |
| 4 | 左下 | 学生アルバイト | https://ko-un-ryu-sui.com/recruit/student?utm_source=line&utm_medium=social&utm_campaign=richmenu |
| 5 | 中下 | よくある質問 | https://ko-un-ryu-sui.com/faq?utm_source=line&utm_medium=social&utm_campaign=richmenu |
| 6 | 右下 | Instagram | https://www.instagram.com/ko_un_ryu_sui.recruit/ |

## 設定
- タイトル（管理用）：採用メニュー／トークルームのメニュー名：メニュー／初期状態で表示：オン／表示期間：登録した日から（終了日なし）。
- 登録前に、上の5つの採用サイトのURLが UTM つきで開けること（200）を本番で確認する。

## 承認後の手順
管理画面 リッチメニュー →「作成」→ 画像を登録 → 6つの領域を設定 → 公開。登録後に、一覧・表示を読み直して確認し、IMPROVEMENT_LOG に記録。画像の登録方法（管理画面での画像作成か、画像のアップロード）は画面で確かめる。
