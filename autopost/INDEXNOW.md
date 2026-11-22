# IndexNow（Bing系の検索・AI検索へ「更新しました」と知らせる）

作成：2026-11-22。狙い：ChatGPT の検索・Copilot・DuckDuckGo などは Bing の索引を使う。Google は Search Console でインデックス登録をリクエストしているが、Bing 側には何も知らせていなかった。IndexNow は、更新した URL を1回送るだけで Bing などに知らせる仕組み（無料・登録不要）。

## 仕組み（リポジトリ内で済む部分）
- キー：`shared/indexnow.mjs` の `INDEXNOW_KEY`。キーは秘密ではない（公開ファイルに置く前提の仕様）。
- 所有確認ファイル：3サイトのルートに `<キー>.txt`（中身はキーだけ）。
  - FLOWCLOUD・glow：`fc-site/build.mjs`・`glow-site/build.mjs` が出力（robots.txt の次の行）。
  - 採用：`client/public/<キー>.txt`（ビルドで `site/` へ）。
- 送る内容の作成：`node scripts/indexnow-urls.mjs fc|glow|recruit [--paths /cut/,/color/]`（JSON を出す。`--paths` なしは sitemap の全URL）。

## 送り方（サンドボックスから api.indexnow.org には届かないので、Chrome のタブから）
1. 公開後、毎時の取り込み（採用 :17／FC :22／glow :27）が済んで、`https://<サイト>/<キー>.txt` が 200 で開けることを確認する。
2. 上のコマンドで JSON を作る。
3. そのサイトのタブ（例：https://www.flowcloud.net/）で、javascript_tool に次を渡す（`J` に JSON を貼る）。
   ```js
   const J = /* node scripts/indexnow-urls.mjs の出力 */;
   const r = await fetch('https://api.indexnow.org/IndexNow', {method:'POST', headers:{'Content-Type':'application/json; charset=utf-8'}, body: JSON.stringify(J)});
   r.status
   ```
   200 または 202 なら受理（202＝キーの確認待ち）。403＝キーが違う、422＝URL がホストと合わない、429＝送りすぎ。
   CORS で失敗するときは、1 URL ずつ `fetch('https://api.indexnow.org/indexnow?url=…&key=…', {mode:'no-cors'})` を使う。
4. 結果を IMPROVEMENT_LOG に1行残す（サイト・件数・応答コード）。

## 使いどころ
- 新ページ・大きな更新のあと（記事の追加・FAQ の追加など）。更新したパスだけ `--paths` で送る。毎回全URLは送らない。
- Google の「インデックス登録をリクエスト」（gsc-url-inspect-index-request）と並べて使う。

## 測れること・測れないこと
- Bing Webmaster Tools（https://www.bing.com/webmasters）に3サイトを登録すると、Bing 側の索引数・検索表示が見える。**登録は藤津さんの作業**（Google の Search Console からの取り込みなら数クリック。APPROVALS の「OK待ち」参照）。登録するまでは、IndexNow の効果は数字では見えない。
- Bing の検索画面（site:）はボット確認の画面が出るため、Claude からは数えられない（CAPTCHA は扱わない）。
