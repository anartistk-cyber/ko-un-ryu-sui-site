# 採用マッチング診断：ChatGPT Sites → 自社の Xserver へ引っ越し

藤津さんの指示（2026-11-23 8:36）：「採用マッチングを全てこっちでやるようにしたい。まえみたいなのは面倒」（ChatGPT とのやりとりが面倒）。置き場所は「自社サイトへ引っ越す」（同日の回答）。
引っ越したあとは、診断・画面・受付・LINE通知・管理画面の保守・公開をすべてこのリポジトリで行う（`match-site/README.md`）。

状態（2026-11-23 21:5x）：**OK 18（本番の切り替え）を実行済み。** `match.ko-un-ryu-sui.com` は DNS の CNAME・TXT 3件を削除して Xserver 版に切り替わった（Google の DNS では 21:41 以降 Xserver を向く。利用者の端末は古い向き先を最大1時間覚えている場合あり）。スマホ（モバイル回線）で `/api/health` が新サーバーの JSON を返すのと、診断から LINE が届くのを藤津さんが確認（21:50）。採用サイト `/match/` の転送先を match.ko-un-ryu-sui.com に戻した版を 22:17 の取り込みで公開。ChatGPT Sites の旧アプリは2週間ほど（12/7 頃まで）予備として残し、そのあと藤津さんが止める。match-new（サブドメインと cron）は片付け待ち。

## 1. 準備できていること（Claude・リポジトリ内。外には何も出ていない）

- ChatGPT Sites 最後の版（2026-11-22 19:09 公開）のソースを `match-site/archive/` に保存。
- 画面3点（診断ページ・診断スクリプト・プライバシー）は、公開中のものと SHA-256 まで一致（`/` c9c3e878…a544、`/diagnosis.js` d26299f1…4686）。プライバシーだけ「ChatGPT Sites」→「エックスサーバー」に直した（切り替えの時に有効になる）。
- 受付API・集計・LINE通知・管理画面（ログイン・状態の切替・診断の内訳）を PHP + SQLite に移植（`match-site/site/app.php`）。診断の採点は PHP に書き直さず、元の JavaScript をそのまま管理画面で動かす。
- 試験：元の ChatGPT Sites 版と PHP 版に同じリクエスト（正常・不正・旧版1〜5・LINE の失敗など約90通り）を送り、応答・LINE通知の文面・管理画面の表示が一致することを確認（91件 OK、不一致 0）。LINE は模擬サーバーで受けた（実物には送っていない）。
- サーバーに置くもの：`server-files/htaccess-match`・`server-files/sync_match.php`・`match-site/server/config.sample.php`。

## 2. 引っ越しの流れ

### 段階1：試運転（OK 16・17）— 本番には影響しない
別のサブドメイン `match-new.ko-un-ryu-sui.com` で、本番と同じものを動かして確かめる。

1. Xserver サーバーパネル → サブドメイン設定 → `ko-un-ryu-sui.com` に `match-new` を追加（無料独自SSLは自動。数分〜1時間）。
2. 「PHP Ver.切替」で `match-new.ko-un-ryu-sui.com` を PHP **8.1 以上**にする。
3. ファイルマネージャーで次を置く（Claude がブラウザで入力。**.htaccess の保存は藤津さんが押す**）。サブドメインのフォルダは入れ子になる：`ko-un-ryu-sui.com/public_html/match-new.ko-un-ryu-sui.com/`（以下「サブドメインのフォルダ」）。
   - `ko-un-ryu-sui.com/sync_match.php`（`public_html` の1つ上＝Webから見えない場所。`server-files/sync_match.php` の中身。他の sync.php と同じ置き場所）
   - サブドメインのフォルダ内の `.htaccess`（`server-files/htaccess-match` の中身）
   - `ko-un-ryu-sui.com/match-config.php`（`public_html` の1つ上。`config.sample.php` を元に、**藤津さんが** 管理画面パスワード・LINEトークン・通知先IDを入れる。`origin` は `https://match-new.ko-un-ryu-sui.com`）
   - 受付データは `ko-un-ryu-sui.com/match-data/match.sqlite`（`public_html` の外。自動作成）
4. cron 設定：毎時1回、`/usr/bin/php /home/flowcloud/ko-un-ryu-sui.com/sync_match.php match-new.ko-un-ryu-sui.com`（引数＝サブドメインのフォルダ名。既存の採用・FC・glow の取り込みと同じ書き方。時刻は :37 など他とずらす）。最初は直近の時刻に設定して手で動かし、5ファイル（app.php・index.html・diagnosis.js・privacy.html・lib/admin.js）が入ったことを `sync_match.log` で確かめる。
5. 確認（Claude）：
   - `https://match-new.ko-un-ryu-sui.com/api/health` が `{"ok":true,"db":true,"config":true,…}`（PHP と SQLite と書き込み権限、秘密が入っていることの確認）
   - `/`・`/diagnosis.js`・`/privacy` の SHA-256 が `site/manifest.json` と一致（privacy だけは、ChatGPT 版と違う＝エックスサーバー版）
   - 診断を最後まで動かす → 結果画面の「LINEで相談する」のリンク文面が同じ
   - **LINE 試験送信 1通（OK 17）**：見学の受付を1件送り、採用担当 LINE に「行雲流水 採用受付」が届く／管理画面にログインして、その受付が出る・診断の内訳が出る・状態を切り替えられる／同じ内容の再送で重複しない
6. 試験用の受付データはそのまま残らないよう、確認後に `match-data/match.sqlite` を削除（藤津さんの OK のうえ）。

### 段階2：本番の切り替え（OK 18）— 短い切り替え作業あり。夜（20:30 以降）に行う
`match.ko-un-ryu-sui.com` の向き先を、ChatGPT Sites から自社の Xserver に付け替える。

1. （Claude）採用サイトの入口 `/match/` の転送先 `MATCH_APP_URL`（`client/src/lib/match.ts`）を、一時的に予備の ChatGPT アドレス `https://kounryusui-recruit.flowcloudcast.chatgpt.site/` にして公開（採用サイトの取り込みは毎時 :17）。サイト・QR・LINE・会社案内は `/match/` だけを載せているので、切り替え中も診断が使える。
2. （藤津さん）Xserver の DNSレコード設定で、`match` の **CNAME（→ custom-domains.chatgpt.site）と、検証用 TXT 2件を削除**。削除前に3つの値を画面で控える（戻し方に使う。Claude が画面を読んで記録する）。
3. サブドメイン設定で `match` を追加（SSL自動。有効になるまで数分〜1時間）。※ DNS に同名の記録が残っていると追加できないことがある。その場合は 2 を先に行う（順序は画面で確かめて決める）。
4. 段階1と同じ3点＋cron を `match.ko-un-ryu-sui.com` のフォルダ（`ko-un-ryu-sui.com/public_html/match.ko-un-ryu-sui.com/`）に置く。cron の引数は `match.ko-un-ryu-sui.com`。`match-config.php` と `match-data/` は試運転と同じ場所を共有するので、試運転の DB は切り替え前に削除して `origin` だけ `https://match.ko-un-ryu-sui.com` に直す（藤津さん）。初回の取り込みを手で実行。
5. 確認（段階1の5と同じ）。SSL が有効なこと、http → https に転送されること。
6. 通ったら（Claude）：`MATCH_APP_URL` を `https://match.ko-un-ryu-sui.com/` に戻し、採用サイトのプライバシーポリシー（`client/src/pages/PrivacyPolicy.tsx` 項目08「ChatGPT Sites」→「エックスサーバー（日本国内のレンタルサーバー）」）と `client/src/lib/match.ts` のコメント・FACTS を直して公開。診断の実機確認（スマホ）を藤津さんに依頼。
7. 後片付け：`match-new` サブドメインを削除。ChatGPT Sites の旧アプリは**すぐには消さない**（2週間ほど残す。元のアドレスで旧データの閲覧ができる）。旧アプリの停止・削除は藤津さんの操作。

旧データについて：ChatGPT Sites 側の受付データ（D1）は移さない。受付の内容は当時の LINE 通知にも残っている。旧アプリを残しておけば、旧管理画面（元のアドレスの `/admin`）で見られる。引き継ぎたい受付があれば言ってほしい（取り込みスクリプトを作る）。

## 3. 戻し方

- **切り替え中・切り替え後に不具合：** 最速は、採用サイトの `MATCH_APP_URL` を予備の ChatGPT アドレスに戻して公開（毎時 :17 に反映。サイト・QR・LINE 経由はこれで旧アプリに戻る）。DNS を戻すなら、控えた CNAME `match` → `custom-domains.chatgpt.site` と検証用 TXT 2件を DNSレコード設定に戻し、`match` サブドメインを削除。ChatGPT Sites の旧アプリは、新しい方で安定するまで消さない。
- **診断や画面の修正を戻す：** `git revert` → push（毎時の取り込みで戻る）。
- **PHP が全く動かない場合（環境の制約）：** 段階1の確認で分かる（本番には影響しない）。その場合は ChatGPT Sites のまま、保守のしかただけを決め直す。

## 4. 藤津さんにお願いすること（まとめ）

- OK 16（試運転の準備）・17（LINE 試験送信 1通）・18（本番の切り替え）の返事。
- `match-config.php` の秘密3つ（管理画面パスワード16文字以上・LINE チャネルアクセストークン・通知先ID）の入力（サーバーのファイルマネージャー。値は Claude に送らない）。
  - LINE のトークンと通知先IDは、ChatGPT Sites の設定に入れているものと**同じ値**を使うと、切り替え中も旧アプリの通知が止まらない（控えがなければ LINE Developers で再発行してもよい。再発行すると旧アプリの LINE 通知はその時点で止まる）。
- .htaccess・DNS の保存ボタン（Claude は押さない）。
- 切り替え後のスマホ実機での確認（診断→結果→LINEで相談する→受付）。

## 5. 未確認・リスク

- Xserver の PHP 版（8.1 以上）・SQLite・curl の有無と、`match-data/` への書き込み権限：段階1の `/api/health` で確認する。
- サブドメイン追加と DNS の順序（既存の CNAME があると追加できるか）：画面で確かめる。
- 切り替え後の LINE 通知が届くこと：段階1の試験送信で確認する（本番の切り替え後にもう1通）。
- ChatGPT Sites 版の「受付API・管理画面」の実体は外から取れないため、PHP 版は ChatGPT Sites 版のソース（`archive/`）を元に移植し、同じリクエストでの結果の一致で確かめた（本番の旧アプリそのものとの照合ではない）。
- 試験に使った ChatGPT Sites 版の動かし方は、Cloudflare Workers 互換の実行環境の代用（Node）。実機の ChatGPT Sites との細かい違いは検出できない。

## 6. 引っ越し後に足すこと

- `autopost/EFFECT_CHECKS.md` に1行（判定日 12/7 ごろ）：「切り替え後の受付が取りこぼしなく動いている（LINE 通知の件数と管理画面の件数が一致）」。
- 毎日の「外部アプリが開けるか」の見張りに `/api/health`（`ok:true`）も加える。
- `autopost/REQUEST_CHATGPT_2026-11-22_match-line-template.md` は役目終了（ChatGPT への依頼は不要になる）。

## 7. 切り替え前の DNS の控え（2026-11-23 20:4x に Xserver の DNSレコード設定の画面から読み取り。戻し方に使う）

ko-un-ryu-sui.com のゾーン（TTL はいずれも 3600）。ワイルドカード `*.ko-un-ryu-sui.com A 157.112.152.39`（Xserver）が元からあるので、下の3件を消すと `match` はこの A に落ちて Xserver に向く（match-new も同じ仕組みで開けている）。

| ホスト名 | 種別 | 内容 |
|---|---|---|
| match.ko-un-ryu-sui.com | CNAME | custom-domains.chatgpt.site |
| _openai-site-verification.match.ko-un-ryu-sui.com | TXT | openai-site-verification=4sIVXLjmhspEgP8OluaB7P5X8GltYKel11ek4ovW1DY |
| _cf-custom-hostname.match.ko-un-ryu-sui.com | TXT | 5f50af57-af34-404a-b550-cc9495ae01d2 |

戻すときは、同じ3件を DNSレコード設定の「DNSレコード設定を追加」で入れ直し（TTL 3600）、`match` サブドメインを削除する。
