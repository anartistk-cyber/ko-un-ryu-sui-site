# 見た目の変更後の本番確認と PageSpeed（スマホ）— 2026-11-08 01:35〜01:55

対象コミット：15b4335（ページごとの色・動き）／e10f03e（スマホは横にめくるカード）。取り込み（採用 :17／FC :22／glow :27）後。

## 本番の表示確認（取り込み済み）
- FLOWCLOUD・glow：`<body data-pg>` が各ページに出ている（home／cut／faq）。`60-trend`（scroll-marker-group）・`t-draw`/`t-dots` がHTMLに入っている。
- 採用：`data-pg`（jobs-stylist／recruit-newgrad）、`rc-draw`、横めくりのCSSが入っている。
- スマホ幅（390px・同一オリジンの iframe で計算済みスタイルを確認）：FC/glow の `.rv`・`.cals` は display:flex／overflow-x:auto、採用の `.who-grid` `.merit-grid` `.staff-voice-grid` `.insta-grid` `.home-blog-grid` も同様。横スクロール（ページ全体）なし。
- 注：トップ `/` の旧ドメイン転送の件は、今回の測定ブラウザでは起きず、ko-un-ryu-sui.com のままだった。

## PageSpeed（スマホ・本番・トップ）
| サイト | 1回目 | 2回目 | 3回目 | 備考 |
|---|---|---|---|---|
| FLOWCLOUD | 100（FCP 0.9／LCP 0.9／TBT 60ms／CLS 0／SI 1.2） | 100（TBT 80ms） | — | 前回 100 |
| glow | 99（TBT 110ms／CLS 0.026） | 96（TBT 170ms／CLS 0.087） | 96（TBT 240ms／CLS 0） | 前回 100／FCP・LCP は 0.9〜1.0秒で変化なし |
| 採用 | 100（TBT 30ms） | 89（TBT 430ms） | 99（TBT 80ms） | 前回 88→改善後 96〜100。FCP/LCP 1.1秒 |
- 4カテゴリ（ユーザー補助・おすすめ・SEO）は全回100。FCP/LCP は全サイト0.9〜1.1秒で、前回から変化なし。
- ぶれの原因：TBTの大半は Google Tag Manager（gtag）のメインスレッド時間（glow 256ms／採用 255ms）で、測るたびに揺れる。CLSの 0.087 は1回だけ（他は0〜0.026）。
- 切り分け（手元 Lighthouse・gzip配信・同条件）：glow 変更後 TBT 93／234（初回の冷えた1回 891を除く）、変更前 95／292／154。採用 変更後 170／172、変更前（15b4335）206／138（80）。差は誤差の範囲で、見た目の変更によるTBT悪化は見られない。
- 判断：戻す基準（点数−3以上・LCP+0.3秒以上）に当てはまらない。このまま維持。
