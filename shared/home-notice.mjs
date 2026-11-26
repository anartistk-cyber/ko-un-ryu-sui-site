// FLOWCLOUD・glow のトップ（ヒーローの予約ボタンの下）に置く「お知らせ」の囲み（2026-11-26 藤津さん「閲覧数を増やす・予約までの率を高める」）。
// 目的：①店販キャンペーン（12月末まで）と年末年始の営業日を、トップに来た人にも見えるようにする
//       ②12月は早めの予約が安心、と伝える ③お知らせ2ページへの内部リンクを増やす（ページの閲覧数）。
// 事実は autopost/FACTS.md（2026-11-25 13:45 店販キャンペーン／年末年始の営業日は両店の「年末年始の営業のお知らせ」ページと同じ）だけ。
//   金券のご利用（2027/1/1〜12/31・併用不可＝藤津さん 11/26 14:55）は、囲みが長くならないようお知らせページ側に書く。税込かどうかなどは未確認なので書かない（「くわしくはキャストへ」もお知らせページ側）。
// 期限：ビルドした日（日本時間）が過ぎると、その行は出さない。両方なくなれば帯ごと出さない。
//   キャンペーン：12/30（水）まで（12/31 は休業。「12月末まで」）／年末年始の営業日：1/6（水）の営業日まで。
//   ※自動投稿などで再ビルドされるまで古い帯が残ることがあるので、EFFECT_CHECKS の 1/3 の行で消えたか確かめる。
// 文の単位は <div>（llms-full.txt が段落で改行するため）。折り返しの塊は <span class="nw">（間に空白を入れる）。h2 は使わない（orderHome が節の名前として読むため）。
// 計測：クリックは build.mjs の共通スクリプトが home_notice_click（page・to）を送る。見た目は shared/css/66-notice.css。
const JST = '+09:00';
const ITEMS = [
  {
    key: 'tenpan',
    until: `2026-12-31T00:00:00${JST}`, // 12/30 まで表示
    head: '【12月末まで】店販キャンペーン',
    sub: '<span class="nw">全ての店販商品が対象・</span> <span class="nw">¥5,500以上のお買い上げで</span> <span class="nw">10％分の金券をプレゼント</span>',
  },
  {
    key: 'nenmatsu',
    until: `2027-01-07T00:00:00${JST}`, // 1/6（水）まで表示
    head: '年末年始の営業日',
    sub: '<span class="nw">12/28（月）休業・</span> <span class="nw">12/29（火）・30（水）営業・</span> <span class="nw">12/31（木）〜1/5（火）休業・</span> <span class="nw">1/6（水）から営業</span>',
  },
];

/** hrefs: {tenpan, nenmatsu}（サイト内の絶対パス）。now: ビルドの日時。 */
export function homeNotice({ hrefs, now = new Date() }) {
  const rows = ITEMS.filter((it) => now < new Date(it.until) && hrefs[it.key]);
  if (!rows.length) return '';
  const li = (it) =>
    `<li><a class="hn-a" href="${hrefs[it.key]}"><div class="hn-h">${it.head}</div><div class="hn-s">${it.sub}</div></a></li>`;
  return `<section class="hn" aria-label="お知らせ"><div class="hn-t">お知らせ</div><ul>${rows.map(li).join('')}</ul></section>`;
}
