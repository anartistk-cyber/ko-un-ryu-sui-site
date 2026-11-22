# 採用マッチング診断（match.ko-un-ryu-sui.com）

株式会社行雲流水の採用マッチング診断と、見学・相談・応募の受付。**2026-11-23 から、保守は Claude がこのリポジトリで行う**（それまでは ChatGPT／Codex が ChatGPT Sites 上で保守）。
置き場所の切り替え（ChatGPT Sites → 自社の Xserver）の手順と進み具合は `autopost/MATCH_MIGRATION.md`。

## 何がどこにあるか

```
match-site/
  site/                      公開物（Xserver の match.ko-un-ryu-sui.com/public_html に毎時取り込まれる）
    index.html               診断ページ（画面・デザイン・フォーム）
    diagnosis.js             診断の質問・採点・結果の文章（画面側で動く）
    privacy.html             プライバシーポリシー（/privacy）
    app.php                  受付API・管理画面・LINE通知（PHP 8.1 以上）
    lib/admin.js             管理画面の描画（自動生成。直接は編集しない）
    manifest.json            取り込み用の一覧（自動生成）
  src/admin-parts.js         管理画面の部品（これと diagnosis.js から lib/admin.js を作る）
  server/config.sample.php   秘密を入れる設定ファイルの見本（本物の config.php はサーバーにだけ置く）
  build.mjs                  lib/admin.js と manifest.json を作る（--check で最新か確認）
  tests/compat-test.mjs      元の ChatGPT Sites 版と PHP 版に同じリクエストを送って結果を比べる試験
  archive/                   ChatGPT Sites 最後の版（2026-11-22 19:09 公開）のソースと DB 定義。戻し・照合用。触らない
../server-files/
  htaccess-match             サーバーの .htaccess（手で貼る。取り込みでは更新されない）
  sync_match.php             サーバーの cron が毎時動かす取り込みスクリプト
```

サーバーの `match.ko-un-ryu-sui.com/` フォルダ（`public_html` の1つ上＝Webから見えない場所）に、秘密と受付データを置く：

- `config.php` … 管理画面パスワード（16文字以上）・LINE のアクセストークン・通知先ID・公開アドレス。**見本は server/config.sample.php。リポジトリ・チャット・メールには載せない**
- `data/match.sqlite` … 受付データ（初回アクセスで自動作成。SQLite。ChatGPT Sites の D1 と同じ表の形）

## 仕組み

- 診断は画面（ブラウザ）の中で動く。送信したとき、`POST /api/requests` で受付を DB に保存し、LINE（Messaging API の push）で採用担当に通知する。
- 診断完了・フォームへ進んだ回数は `POST /api/funnel`（visitId とイベント名だけ）。
- 管理画面 `/admin`：パスワードでログイン（8時間・ログイン失敗は10分に8回まで）。受付一覧・LINE確認済みの切替・診断の内訳（採点の表示）・集計。
- 管理画面の診断の内訳は、PHP に書き直さず **元の JavaScript（採点コード）をブラウザで動かして表示する**。`lib/admin.js` は `diagnosis.js` に管理画面の部品を連結して作るので、診断の質問・採点を直せば管理画面も同じ内容になる。
- `GET /api/health`：設置の確認用。DB が開けるか・秘密が入っているかの「はい／いいえ」だけ返す（値は返さない）。

## 直すとき（Claude の手順）

1. 診断・画面・文章は `site/diagnosis.js`・`site/index.html`・`site/privacy.html` を直接直す。**診断の内容・計算・フォーム・デザインは、藤津さんの指示がない限り変えない。**
2. `node match-site/build.mjs`（admin.js と manifest を作り直す）。
3. 試験：`NODE_PATH=$(npm root -g) node --experimental-sqlite match-site/tests/compat-test.mjs`（全件 OK になること。PHP 8.1+・Playwright・Node 22 が要る）。画面を変えたときは、Playwright でスマホ幅（390）とPC幅（1280）の画面も目で見る。
4. `autopost/IMPROVEMENT_LOG.md` に記録 → `git fetch origin main` → `git merge --ff-only FETCH_HEAD` → `git push origin HEAD:main` → `git rev-parse HEAD FETCH_HEAD` が一致。
5. 取り込み（毎時）のあと、本番で確認：`/`・`/diagnosis.js`・`/privacy` の SHA-256 がリポジトリの `site/manifest.json` と一致／`/api/health` が ok／診断が最後まで動く。
6. **受付 API・管理画面・LINE の挙動を変える修正は、必ず試験に項目を足してから**行う（受付の取りこぼしは採用の機会損失になる）。LINE の実送信は藤津さんの「OK」のあとだけ（試験は模擬サーバーで行う）。
7. 公開前後の取り込みはファイル単位（アセット→HTML の順）。`app.php` と `index.html` の両方を変える修正は、1回の push にまとめる。

## 秘密情報

パスワード・LINE のトークンは、`config.php`（サーバーのみ）にだけ置く。リポジトリ・ログ・チャット・README に値を書かない。Claude はこの値を見ない（藤津さんがサーバーのファイルマネージャーで入れる）。

## 戻し方

- 診断・画面を戻す：`git revert` して push（毎時の取り込みで戻る）。
- 置き場所そのものを ChatGPT Sites に戻す：`autopost/MATCH_MIGRATION.md` の「戻し方」。

## 修正履歴

ChatGPT／Codex 時代は保存の日時だけが残っていて、変更内容の説明は残っていない。確かめられた範囲：

| 日時（JST） | 内容 |
|---|---|
| 2026-11-13 19:35〜21:16 | 初版の作成と調整（`worker/index.js` の保存 9 回） |
| 2026-11-14 10:13〜12:22 | 調整 4 回 |
| 2026-11-16 | DB に `recruit_funnel`（診断→フォームの進行の集計表）を追加。夜に調整 3 回 |
| 2026-11-17 00:06〜00:15 | 調整 3 回（`864090f` が「11月17日版」） |
| 2026-11-22 07:36 | LINE相談ボタンの追加（診断結果の「見学・相談してみる」の横に緑の「LINEで相談する ↗」） |
| 2026-11-22 19:09 | 結果画面の「LINEで相談する」に、LINE の入力欄へ【採用のご相談】の文面（ご希望・お名前・診断結果・ご質問）を入れる処理を追加（HTML への `<script>` の追加のみ。ChatGPT が公開、Claude が公開後に照合） |
| 2026-11-23 | 保守を Claude に移管。ソースをこのリポジトリに取り込み（画面3点は公開中のものと SHA-256 まで一致）。サーバー側（受付API・管理画面・LINE通知）を PHP に移植（元のサーバーと同じリクエストで結果を比べる試験 91件 OK）。**プライバシーポリシーの「ChatGPT Sites」を「エックスサーバー」に直した版は、切り替えの時に初めて有効になる（いま公開中の ChatGPT 版は変えていない）** |
