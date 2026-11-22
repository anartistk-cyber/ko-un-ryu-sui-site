# 藤津さんの操作が要る件の手順メモ（OK待ち 9〜12・2026-11-22）
Claude が代わりにできない（アカウント作成・サインイン・所有確認・確認コード・店頭の作業）ところだけを書く。事実（住所・電話・営業時間）は autopost/FACTS.md の値。

## 9. Bing Webmaster Tools に3サイトを登録（数クリック・5分）
目的：ChatGPT の検索・Copilot などが使う Bing の索引に載っているか／検索で表示されているかを、Claude が読めるようにする。
1. https://www.bing.com/webmasters を開き、サインイン（Microsoft アカウントがなければ作成。Google でのサインインも選べる）。
2. 「My Sites」（マイサイト）で「Import」（インポート）→ Google アカウントでサインイン→ 許可するのは「Search Console の確認済みサイトとサイトマップの一覧」だけ。Search Console を見ているのと同じ Google アカウントを使う。
3. 一覧から flowcloud.net・glow-izumiotsu.jp・ko-un-ryu-sui.com を選び「Import」。サイトマップも一緒に取り込まれる。
4. データが出るまで最大48時間。登録できたら「OK 9 済」と伝えてもらえれば、Claude が IndexNow の送信結果と並べて読む（12/6 の判定に使う）。
（出典：Bing Webmaster Blog「Import sites from Search Console」）

## 10. Bing Places for Business と Apple Business Connect（アカウント作成・確認コード）
- Bing Places：https://www.bingplaces.com → サインイン → 「Google ビジネスプロフィールからインポート」→ Google でサインインして許可 → FLOWCLOUD・glow の2拠点を選ぶ（自動同期をオンにすると Google の変更が Bing にも反映される）→ 確認は「Verify now」。Google で確認済みなら自動で確認されることもある。はがきの場合は7〜10営業日、届いたコードを入力。
- Apple Business Connect：Apple が「Apple Business」に統合したため、画面の案内に従う（Claude は最新の画面手順を確認できていない）。必要なもの：Apple アカウント、店の電話（0725-90-5699／0725-51-7222）。確認は電話（自動音声）が多い。住所・電話・営業時間は FACTS の値（FLOWCLOUD：泉大津市東雲町1-20・9:00〜20:00（最終受付18:00）・月火休／glow：泉大津市旭町18-3 いずみおおつCITY 1F・同じ営業時間）。
- 終わったら、各掲載の公開ページの URL を Claude に伝える→住所・電話・営業時間が FACTS と一致しているか読んで確認する。

## 11. 店頭用「Googleマップの感想」カード
- ファイル：autopost/review-card/review_card_fc.pdf／review_card_glow.pdf（A6）。会計のときに手渡す、または鏡まわりに置く。QR は各店のGoogle口コミ投稿画面に着く。
- 特典・★の指定・「書いたら〜」の約束は入れない（Googleの規約）。
- 12/2 と 12/20 に Google の口コミ件数を読んで、増え方を見る（基準：FLOWCLOUD 4.8・118件／glow 4.9・17件）。

## 12. 外の掲載サイトの古い店舗情報
- エキテン（FLOWCLOUD・https://www.ekiten.jp/shop_2896914/）：旧住所（泉北郡忠岡町忠岡中1丁目11-25）・9:00〜18:00・最終更新2015/09/05。店舗会員のログイン → 「店舗情報の編集」で、住所＝大阪府泉大津市東雲町1-20、営業時間＝9:00〜20:00（最終受付18:00）、定休日＝月曜・火曜（不定休あり）、公式サイト＝https://www.flowcloud.net/ に直す。ログインできない（会員情報が分からない）ときは、エキテンのお問い合わせから「店舗情報の修正依頼」を出す。
- ジョブメドレー（glow？・https://job-medley.com/hs/1641819/）：住所が「旭町20-1 アルザタウン泉大津1F」。同じ店の掲載なら管理画面（求人事業所のログイン）で「旭町18-3 いずみおおつCITY 1F」に。別の事業所なら何もしない。分からなければ「心当たりがある／ない」だけ伝えてもらえれば、Claude が次の手を決める。
- 直したら公開ページの URL を伝える→読み直して一致を確認する。
