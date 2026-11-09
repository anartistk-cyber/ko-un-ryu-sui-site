# 行雲流水（採用）LINE公式（@512rmwnk）リッチメニュー案（2026-11-09・藤津さん承認待ち）

藤津さんの希望（11/9 14:17「行雲流水のリッチメニューは作ってない。作りたい」「公式LINEは Claude コードでやってもらってよいか」）。LINE公式の作業は今後 Claude が担当。**志塾公式は触らない。** **【反映済み 2026-11-09】** 藤津さんが承認し、管理画面で公開（表示期間 2026/11/09 00:00〜2027/11/08 23:59、6つのリンクと画像を再読み込みで確認）。**14:5x に藤津さんの指定で v2（行雲流水サイト／FLOWCLOUD／glow／会社案内／よくある質問／Instagram）に差し替え、再読み込みで6つのリンクを確認。**元に戻す／止める手順：管理画面 リッチメニュー一覧で「採用メニュー」を削除（または表示期間を変更）。

## 画像（v2・11/9 14:5x に差し替え。藤津さんが6ボタンを指定）
- `autopost/line-richmenu/koun_recruit_v2_2500x1686.png`（2500×1686・約220KB。元は koun_recruit_menu_v2.html を render.cjs で書き出し）。旧 v1（見学・相談／募集要項／新卒の方／学生アルバイト／よくある質問／Instagram）は koun_recruit_2500x1686.png に残す。
- 採用サイトの配色（ふかい緑 #1c6665・淡い緑）、3列×2行の6ボタン。行雲流水サイトだけ濃い緑で目立たせる。数字・待遇・年度は画像に入れない（古くならないように）。
- 藤津さんの指定（11/9 14:48〜）：行雲流水サイト／FLOWCLOUDサイト／glowサイト／会社案内／よくある質問／インスタ。管理画面のリッチメニューは最大6ボタンのため、電話・見学・相談・募集要項・新卒・学生アルバイトは外した（すべて採用サイトの中から辿れる）。

## ボタンと遷移先（v2・すべてリンク）
| # | 位置 | 表示 | 遷移先 |
|---|---|---|---|
| A | 左上 | 行雲流水サイト | https://ko-un-ryu-sui.com/?utm_source=line&utm_medium=social&utm_campaign=richmenu |
| B | 中上 | FLOWCLOUD | https://www.flowcloud.net/?utm_source=line&utm_medium=social&utm_campaign=recruit_richmenu |
| C | 右上 | glow | https://glow-izumiotsu.jp/?utm_source=line&utm_medium=social&utm_campaign=recruit_richmenu |
| D | 左下 | 会社案内 | https://drive.google.com/file/d/1QMQCxIc5p6__WKw2Dujnf3XDKs6T9Gx8/view（会社案内2027の軽量版PDF 4.85MB。藤津さん（anartist.k@gmail.com）自身のドライブ。リンクを知っている人が閲覧可。UTMは付けられない）。11/9 15:1x に、元の shion1012 さんのドライブのファイル（12.5MB）から差し替え |
| E | 中下 | よくある質問 | https://ko-un-ryu-sui.com/faq?utm_source=line&utm_medium=social&utm_campaign=richmenu |
| F | 右下 | Instagram | https://www.instagram.com/ko_un_ryu_sui.recruit/ |
- B・C は、サロンのお客さま向けLINEの richmenu と見分けるため `utm_campaign=recruit_richmenu`（UTM_LINKS.md）。
- D の会社案内PDFは、藤津さん自身のドライブ（マイドライブ「行雲流水会社案内2027（軽量版）.pdf」）。リンクを知っている人が閲覧可。会社案内を新しくするときは、ドライブで同じファイルを「新しいバージョンを管理」で差し替えればリンクを変えずに済む。軽量化は autopost/line-richmenu/pdf_dedupe.py（同じ内容の重複データをまとめて再圧縮。画質は変わらない）。

## 設定
- タイトル（管理用）：採用メニュー／トークルームのメニュー名：メニュー／初期状態で表示：オン／表示期間：登録した日から（終了日なし）。
- 登録前に、採用サイトのURL（A・E）と FLOWCLOUD・glow のURLが UTM つきで開けること（200）を本番で確認する。

## 承認後の手順
管理画面 リッチメニュー →「作成」→ 画像を登録 → 6つの領域を設定 → 公開。登録後に、一覧・表示を読み直して確認し、IMPROVEMENT_LOG に記録。画像の登録方法（管理画面での画像作成か、画像のアップロード）は画面で確かめる。
