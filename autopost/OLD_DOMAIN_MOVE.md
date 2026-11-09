# 旧ドメイン ko-unryu-sui.com を Xserver の 301 転送にする手順（2026-11-06 作成）

## 分かっていること（藤津さん提供の情報＋Manus画面の確認）
- 旧ドメイン `ko-unryu-sui.com`／`www.ko-unryu-sui.com`：登録先（レジストラ）は Global Domain Group LLC、ネームサーバーは `NS1.GLOBALDOMAINGROUP.COM`・`NS2.GLOBALDOMAINGROUP.COM`（藤津さんから受領。11/6 Verisign RDAP で確認済み：登録 2026-01-31、**有効期限 2027-01-31**、状態 client transfer prohibited）。
- 今は Manus のプロジェクト「行雲流水様_採用LP」にカスタムドメインとして接続され、JavaScript＋meta refresh で新ドメインへ転送するページを返している（サーバーの301ではない）。
- 新ドメイン `ko-un-ryu-sui.com` は Xserver 管理（NS1〜NS5.XSERVER.JP）。**新ドメイン側は変更しない。**
- 旧ドメインでメールは使っていない（藤津さん回答 11/6）→ MX/TXT の引き継ぎは不要。

## 手順（この順番。2〜3は先に準備、4で初めて切り替わる）
1. Global Domain Group の管理画面で、現在のDNS（A/CNAME/NS）を画面メモやスクリーンショットで控える（元に戻す用）。
2. Xserver サーバーパネル（flowcloud.xsrv.jp）→ ドメイン設定追加：`ko-unryu-sui.com`、無料独自SSLにチェック。※NSがまだXserverを向いていないと、SSLの発行は切替後（数分〜1時間ほど）になることがある。追加の確定ボタンは藤津さんが押す。
3. 旧ドメインの .htaccess に `server-files/htaccess-old-domain` の内容を入れる（保存は藤津さんが押す）。`www.ko-unryu-sui.com` も同じフォルダで効く（追加時にwww付きも確認）。
4. Global Domain Group でネームサーバーを `ns1〜ns5.xserver.jp` に変更（藤津さんが操作。反映は数分〜48時間）。
5. 確認（シークレットか別端末で）：`https://ko-unryu-sui.com/`、`/jobs/stylist`、`?utm_source=test` 付き、`https://www.ko-unryu-sui.com/` がすべて 301 で `https://ko-un-ryu-sui.com/` の同じパス・同じクエリへ飛ぶこと。
6. 問題なければ Manus 側の旧ドメイン2件（`www.ko-unryu-sui.com`、`ko-unryu-sui.com`）の「接続解除」と、Manusプロジェクトの扱いを決める。**確認が済むまで接続解除しない。**

## 元に戻すとき
- Global Domain Group のネームサーバーを `NS1.GLOBALDOMAINGROUP.COM`／`NS2.GLOBALDOMAINGROUP.COM` に戻す（Manus接続を残していれば、以前の転送ページに戻る）。

## 注意
- Manus のドメインはサブスクが切れると旧ドメインが開かなくなる。解約・変更の前に上の手順を終える。
- 旧ドメインの登録更新（Global Domain Group）は止めない（最低1年は維持）。
- Xserver のサーバーパネルは、ログインが切れていると Claude は操作できない（パスワードは入力しない）。藤津さんが先にログインする。

## 11/6 15時の状況（追記）
- Xserver：旧ドメイン `ko-unryu-sui.com` をドメイン追加済み（状態「反映待ち」・SSL未発行は、ネームサーバー切替前の想定どおり）。旧ドメインの .htaccess に301転送を入力済み（保存ボタンは藤津さん）。新ドメインの設定は未変更。
- **詰まっている点**：Global Domain Group は卸売りのレジストラで、藤津さんは直接ログインできない。2026-01-31 に取得されたドメインで、購入元（再販元）が不明。ネームサーバーの切替はその購入元の管理画面でしかできない。
- 購入元の探し方：2026-01-31 前後のメール（件名に `ko-unryu-sui.com`、「ドメイン」「Verify」「Global Domain Group」）やクレジットカード明細。Manus の「利用状況と請求」「ドメイン」画面にはドメイン管理の項目はなかった（Manus Pro の更新日は 11/25）。
- 期限：ドメインの有効期限 2027-01-31 を過ぎると新旧とも旧URLが失効。Manusのサブスクが切れると旧ドメインの転送ページも止まる（11/25更新）。
- 11/6 15:2x Manus（アカウント「cast FLOW CLOUD」＝キャスト代表のChrome）の「設定 → データ管理 → 購入済みのドメイン」を確認：**購入済みのドメインなし**。このManusアカウントでは買っていない（別のManusアカウント、または別の販売元の可能性）。ノート代表のChromeのManusはログアウト状態。
- 11/6 15:2x 藤津さんが Manus の解約を検討。影響確認：公開中の採用サイト（Xserver）は Manus に依存しない（site/・client/ に Manus の画像・CDN・リンクなし。`client/src/const.ts` に Manus OAuth の説明コメントが残るだけで未使用）。解約で止まるのは、旧ドメインの転送ページ（旧URLが開かなくなる）、`kounryu-hire-2v7x4syb.manus.space`、Manus上の下書きサイト2件（glow Recruit、glow）。解約は 11/25 の更新日より前に。旧ドメインの転送を残したいなら、先に購入元の業者へNS変更を依頼する（下書きは会話で作成済み）。

## 2026-11-09 12:52 の状況（追記・藤津さん）
- 旧ドメインのネームサーバー切替は、**購入元の業者の対応待ち**（藤津さんが業者に依頼済み。11/9 時点で返事待ち）。Xserver 側の準備（ドメイン追加・.htaccess の301）は 11/6 に済み。
- 返事が来たら、上の手順の4（ネームサーバーを ns1〜ns5.xserver.jp に変更）→ 5（301の確認）→ 6（Manus の旧ドメイン接続解除）の順。確認が済むまで Manus は解約しない。
- 期限の目安：Manus の更新 11/25。更新までに切替が終わらない場合は、(a) Manus を1か月だけ更新して旧ドメインの案内ページを維持する、(b) 解約して旧ドメイン経由の訪問（GA4 直近7日で35セッション＝全体の11.7%・キーイベント0）を失う、のどちらかを藤津さんが選ぶ。11/18 に確認する。
