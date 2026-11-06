# 旧ドメイン ko-unryu-sui.com を Xserver の 301 転送にする手順（2026-11-06 作成）

## 分かっていること（藤津さん提供の情報＋Manus画面の確認）
- 旧ドメイン `ko-unryu-sui.com`／`www.ko-unryu-sui.com`：登録先（レジストラ）は Global Domain Group LLC、ネームサーバーは `NS1.GLOBALDOMAINGROUP.COM`・`NS2.GLOBALDOMAINGROUP.COM`（藤津さんから受領。こちらでは未確認）。
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
