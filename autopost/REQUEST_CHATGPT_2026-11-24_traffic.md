# ChatGPT（SNS・Googleプロフィール担当）への依頼：診断・見学の入口を増やす（2026-11-24）

背景：3サイトの週間アクセスは約240セッション（11/17〜11/23）。Google 検索126・直接62・SNS 39・他サイト12。診断ページ（/type-shindan/）の閲覧は 週20→46 に増えた（11/22 に入口を足した分）。**SNS からの訪問は 39 で、予約・問い合わせ（キーイベント）は 0**。SNS は「見て終わる」入口なので、診断（約2分で終わる）のような「やってみる」入口が合う。
投稿は ChatGPT 担当（藤津さん 11/22）。Claude は3サイトとブログ。下の案は、藤津さんの OK のあとで使う。

## 依頼1：Instagram（ストーリーズ／リール）で診断を紹介
- 診断の8タイプ（キャラクター）を1枚ずつ見せる連続ストーリーズ、または「私は〇〇タイプでした」型のリール。最後に診断へのリンク。
- リンク（出どころの印つき）：
  - ストーリーズ：`https://ko-un-ryu-sui.com/type-shindan/?utm_source=instagram&utm_medium=social&utm_campaign=type_shindan_story`
  - プロフィール：`https://ko-un-ryu-sui.com/type-shindan/?utm_source=instagram&utm_medium=social&utm_campaign=type_shindan_bio`
- 文面は事実だけ（無料・20問・約2分・8つのジョブ・結果カードは公式LINEで受け取れる）。効果の保証・他社比較は書かない。

## 依頼2：Google プロフィール（行雲流水・採用向け）の「最新情報」
- 「美容師・美容学生向けの無料診断」を、写真つきで1本。リンクは `https://ko-un-ryu-sui.com/type-shindan/?utm_source=gbp&utm_medium=organic&utm_campaign=type_shindan_post`（※このUTMは新規。UTM_LINKS.md に反映済みではないので、使うときに Claude が表へ足す）。

## 依頼3：来店客・スタッフの身近な美容師さんへ
- スタッフが友だちに送れるよう、診断の結果画面に「友だちにすすめる」を足した（11/24）。スタッフ向けの案内（朝礼など）は藤津さんの運用。

## 数字の見方
GA4 の流入元（instagram・social／share・social）と、イベント type_shindan_start／result／line／match／share。判定は EFFECT_CHECKS の 12/8・12/22。
