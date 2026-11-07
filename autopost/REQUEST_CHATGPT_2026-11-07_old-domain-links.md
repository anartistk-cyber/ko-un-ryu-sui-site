# 採用サイトの旧ドメイン（ko-unryu-sui.com）リンクを ko-un-ryu-sui.com に直すお願い（2026-11-07 夜）

正しいURLは **https://ko-un-ryu-sui.com/**（「un」と「ryu」の間にハイフンあり）。
旧ドメイン **ko-unryu-sui.com**（「unryu」とつながっている）を開くと、Manus の転送ページが出て、画面が白いまま読み込みが終わらないことがある（藤津さんのスクリーンショット 11/7 19:00）。

## Claude が確認できたこと
- 3サイトのソース・公開ファイル（FLOWCLOUD／glow／採用）に旧ドメインは無い。FLOWCLOUD・glow の採用リンクは ko-un-ryu-sui.com。サイト側で直すものは無し。
- 旧ドメインが残っているのは外部（SNS）：
  - Instagram 採用アカウント @ko_un_ryu_sui.recruit のプロフィール文（Googleの表示で `ko-unryu-sui.com`、`https://www.ko-unryu-sui.com/` を確認）。同じ文に古い給与（スタイリスト¥270,000～／2027年は¥290,000）も出ている。
  - Instagram・Threads の投稿の本文（`https://ko-unryu-sui.com/`）。
  - Facebook の動画投稿の本文（`www.ko-unryu-sui.com`）。
- 未確認（Claude は開けていない。ChatGPT／藤津さんが各画面で検索して確認）：LINE公式アカウント（あいさつ文・リッチメニュー）、HPB Work、ジョブメドレー、キレイビズ、リジョブ、Jimdo の旧ページ、FLOWCLOUD／glow の Instagram・Facebook・X のプロフィールと投稿。
- Claude は Instagram の画面が固まり、採用アカウントのプロフィール全文を読めていない。変更も一切していない。

## 直してほしいもの（藤津さんの OK が出てから反映）
1. Instagram 採用アカウントのプロフィール：URL欄を https://ko-un-ryu-sui.com/ に。説明文に旧ドメインや古い給与があれば外す（案は下）。
2. 旧ドメインを書いた投稿（Instagram・Threads・Facebook）：本文の `ko-unryu-sui.com` を `ko-un-ryu-sui.com` に編集（投稿本文のURLはタップできないことが多いので、編集できない投稿はそのままでもよい。リンクは固定コメントかプロフィールのリンクで案内）。
3. 上の「未確認」の場所に旧ドメインがあれば同じように直す。見つけた場所を藤津さんに報告。

## プロフィール文の案（150文字以内・事実は FACTS.md の範囲。給与の数字は入れない）
```
大阪・泉大津の美容師採用｜行雲流水
FLOWCLOUD／glow｜新卒・中途・パート募集
まずは見学・ご相談から（見学→面接→採用）
▼募集要項・応募はこちら
https://ko-un-ryu-sui.com/
```
※給与を書くなら FACTS.md の最新値のみ（新卒は月給28万円〈2027年版・固定残業代を含む〉）。スタイリストの金額は未確認なので書かない。

## ChatGPT に貼る文
```
採用サイトのURLを直したいです。正しいURLは https://ko-un-ryu-sui.com/ です（ko-un-ryu-sui、ハイフンが2つ）。
古いURL ko-unryu-sui.com（unryuがつながっている）が、次の場所に残っています。
・Instagram 採用アカウント @ko_un_ryu_sui.recruit のプロフィール（URL欄と説明文。説明文には古い給与の記載もあります）
・Instagram／Threads の投稿本文の「https://ko-unryu-sui.com/」
・Facebook の動画投稿本文の「www.ko-unryu-sui.com」
これらを https://ko-un-ryu-sui.com/ に直してください。プロフィール文は autopost/REQUEST_CHATGPT_2026-11-07_old-domain-links.md の案を使い、給与の数字は事実表（FACTS.md）にあるものだけにしてください。
あわせて、LINE公式（あいさつ文・リッチメニュー）、HPB Work、ジョブメドレー、キレイビズ、リジョブ、FLOWCLOUD／glow の各SNSのプロフィールにも ko-unryu-sui.com が無いか確認し、見つけたら場所を教えてください（直す前に藤津さんの確認を取ってください）。
```

## 根本の対処（旧ドメインを開いた人を自動で新URLへ飛ばす）
- 今の旧ドメインは Manus が JavaScript の転送ページを返しているだけで、サーバーの301ではないため、古いリンクから来た人には白い画面が見えることがある。
- 直すには、旧ドメインのネームサーバーを Xserver（ns1〜ns5.xserver.jp）に変えて 301 にする（手順と準備：autopost/OLD_DOMAIN_MOVE.md、server-files/htaccess-old-domain。Xserver側の準備は済み）。
- 詰まっている点：ネームサーバーの変更は、ドメインを買った再販元の管理画面でしかできない（レジストラは Global Domain Group だが、藤津さんが直接ログインできない）。購入元が分かれば、変更の依頼文は用意済み。
- 期限：Manus の更新日 11/25。解約・停止すると旧ドメインの転送ページ自体が止まる（旧リンクは開かなくなる）。ドメインの有効期限は 2027-01-31。
