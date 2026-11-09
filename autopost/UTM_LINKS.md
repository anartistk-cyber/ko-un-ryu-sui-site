# 流入元がわかる「UTM付きリンク」と QR（2026-11-05 作成）

目的：どこから来た人が予約・電話・応募につながったかを GA4 で見分ける。いまは予約・電話などのキーイベント10件のうち7件が「Direct（直接）」で、元が不明。リンクの出どころを分ければ、Instagram・LINE・チラシ・QR・学校配布のどれが効いたか分かる。

## ルール（これを守ると GA4 で自動的に整理される）
- 小文字・半角英数字・アンダースコアのみ。日本語、スペース、個人名・お客様情報は入れない。
- `utm_source` ＝ 出どころ（instagram / line / google / flyer / store_qr / school / hotpepper / jobboard）
- `utm_medium` ＝ 種類。**Instagram と LINE は必ず `social`**（GA4 が「Organic Social」として自動集計するため）。QRは `qr`、紙は `print`、Googleプロフィールは `gbp`（設定済み）。
- `utm_campaign` ＝ 置き場所・時期（bio / story / richmenu / counter / 202611_card など）。配布物は「年月」を入れ、次に刷り直したら変える。
- 同じ場所には同じリンクを使い続ける（毎回変えると集計がバラバラになる）。
- サイト側：UTM付きで来た人の流入元は、採用フォームの受付メール末尾に【流入：instagram/social/bio】のように自動で残る。フォームの「このサイトを知ったきっかけ」（任意）も同様。

## リンク一覧

### FLOWCLOUD

| 置き場所 | リンク | QR画像 |
|---|---|---|
| Googleビジネスプロフィール（ウェブサイト欄） | `https://flowcloud.net/?utm_source=google&utm_medium=gbp&utm_campaign=profile_website` | – |
| Instagram プロフィール（リンク欄） | `https://flowcloud.net/?utm_source=instagram&utm_medium=social&utm_campaign=bio` | – |
| Instagram ストーリーズのリンク | `https://flowcloud.net/?utm_source=instagram&utm_medium=social&utm_campaign=story` | – |
| LINE公式アカウント（リッチメニュー） | `https://flowcloud.net/?utm_source=line&utm_medium=social&utm_campaign=richmenu` | – |
| LINE公式（行雲流水＝採用）のリッチメニューからFLOWCLOUDへ（2026-11-09 開始） | `https://www.flowcloud.net/?utm_source=line&utm_medium=social&utm_campaign=recruit_richmenu` | – |
| LINE公式アカウント（一斉配信） | `https://flowcloud.net/?utm_source=line&utm_medium=social&utm_campaign=broadcast_202611` | – |
| ホットペッパービューティー（サロンページのHPリンク） | `https://flowcloud.net/?utm_source=hotpepper&utm_medium=referral&utm_campaign=salon_page` | – |
| 店内QR（受付・レジ横など） | `https://flowcloud.net/?utm_source=store_qr&utm_medium=qr&utm_campaign=counter` | `autopost/utm-qr/fc_store_counter.png` |
| チラシ・名刺・ショップカード | `https://flowcloud.net/?utm_source=flyer&utm_medium=print&utm_campaign=202611_card` | `autopost/utm-qr/fc_flyer_202611.png` |

### glow

| 置き場所 | リンク | QR画像 |
|---|---|---|
| Googleビジネスプロフィール（ウェブサイト欄） | `https://glow-izumiotsu.jp/?utm_source=google&utm_medium=gbp&utm_campaign=profile_website` | – |
| Instagram プロフィール（リンク欄） | `https://glow-izumiotsu.jp/?utm_source=instagram&utm_medium=social&utm_campaign=bio` | – |
| Instagram ストーリーズのリンク | `https://glow-izumiotsu.jp/?utm_source=instagram&utm_medium=social&utm_campaign=story` | – |
| LINE公式アカウント（リッチメニュー） | `https://glow-izumiotsu.jp/?utm_source=line&utm_medium=social&utm_campaign=richmenu` | – |
| LINE公式（行雲流水＝採用）のリッチメニューからglowへ（2026-11-09 開始） | `https://glow-izumiotsu.jp/?utm_source=line&utm_medium=social&utm_campaign=recruit_richmenu` | – |
| LINE公式アカウント（時間外の自動返信・2026-11-09 開始） | `https://glow-izumiotsu.jp/?utm_source=line&utm_medium=social&utm_campaign=autoreply` | – |
| LINE公式アカウント（一斉配信） | `https://glow-izumiotsu.jp/?utm_source=line&utm_medium=social&utm_campaign=broadcast_202611` | – |
| ホットペッパービューティー（サロンページのHPリンク） | `https://glow-izumiotsu.jp/?utm_source=hotpepper&utm_medium=referral&utm_campaign=salon_page` | – |
| 店内QR（受付・レジ横など） | `https://glow-izumiotsu.jp/?utm_source=store_qr&utm_medium=qr&utm_campaign=counter` | `autopost/utm-qr/glow_store_counter.png` |
| チラシ・名刺・ショップカード | `https://glow-izumiotsu.jp/?utm_source=flyer&utm_medium=print&utm_campaign=202611_card` | `autopost/utm-qr/glow_flyer_202611.png` |

### 採用サイト

| 置き場所 | リンク | QR画像 |
|---|---|---|
| Googleビジネスプロフィール（ウェブサイト欄） | `https://ko-un-ryu-sui.com/?utm_source=google&utm_medium=gbp&utm_campaign=profile_website` | – |
| Instagram プロフィール（リンク欄） | `https://ko-un-ryu-sui.com/?utm_source=instagram&utm_medium=social&utm_campaign=bio` | – |
| Instagram ストーリーズのリンク | `https://ko-un-ryu-sui.com/?utm_source=instagram&utm_medium=social&utm_campaign=story` | – |
| LINE公式アカウント（リッチメニュー） | `https://ko-un-ryu-sui.com/?utm_source=line&utm_medium=social&utm_campaign=richmenu` | – |
| LINE公式アカウント（一斉配信） | `https://ko-un-ryu-sui.com/?utm_source=line&utm_medium=social&utm_campaign=broadcast_202611` | – |
| ホットペッパービューティー（サロンページのHPリンク） | `https://ko-un-ryu-sui.com/?utm_source=hotpepper&utm_medium=referral&utm_campaign=salon_page` | – |
| 店内の採用ポスター・名刺のQR | `https://ko-un-ryu-sui.com/?utm_source=store_qr&utm_medium=qr&utm_campaign=recruit_poster` | `autopost/utm-qr/recruit_store_poster.png` |
| 学校配布の資料・先生への案内 | `https://ko-un-ryu-sui.com/?utm_source=school&utm_medium=print&utm_campaign=school_flyer_202611` | `autopost/utm-qr/recruit_school_flyer_202611.png` |
| 求人サイト・ハローワークの掲載（媒体名を utm_source に） | `https://ko-un-ryu-sui.com/?utm_source=jobboard&utm_medium=job_board&utm_campaign=listing_202611` | – |

## 見方（GA4）
- レポート → 集客 → トラフィック獲得 → 表の見出しの「ディメンション選択」で「セッションの参照元 / メディア」。例：`instagram / social`、`flyer / print`、`store_qr / qr`。
- 週次点検では「参照元/メディア別のセッションとキーイベント」を記録する（`autopost/REPORT_RUNBOOK.md`）。

## 自分たちのアクセスを数えない設定（内部アクセス除外）
- 仕組み：下のURLを**一度だけ**開いた端末（ブラウザ）は、以後 GA4 に「社内アクセス（traffic_type=internal）」として送られ、フィルタで集計から除外される。ヒートマップ（Clarity）も読み込まない。
- 手順：スタッフ全員のスマホ・店のPC・自宅PCで、各ブラウザごとに次の3つを1回ずつ開く（サイトごとに別の記憶なので3つとも必要）。
  - https://flowcloud.net/?krs_internal=1
  - https://glow-izumiotsu.jp/?krs_internal=1
  - https://ko-un-ryu-sui.com/?krs_internal=1
- 解除したいとき：同じURLの `=1` を `=0` にして開く。ブラウザのデータを消した場合は再度開く。
- 注意：お客様用のQRやリンクにはこのパラメータを付けない。
- 状態：GA4 のデータフィルタ（Internal Traffic）は 2026-11-08 に「有効」。登録済みの端末のアクセスは、以後の分から集計に入らない（登録していない端末は数えられる）。

## スタッフ端末の登録用QR（2026-11-05）
- `autopost/utm-qr/internal_staff_devices.png`（作成：`python3 scripts/make-internal-qr.py`）。3サイト分のQRが1枚。各自のスマホ・PCで1回ずつ読み取って開くと、その端末は GA4 で内部扱い、Clarity も読み込まない。
- 解除：URL末尾を `?krs_internal=0` にして開く。
- 確認：登録直後に、GA4 の「リアルタイム」で自分のアクセスが出ない／データフィルタのテストで内部と判定されることを見る。

