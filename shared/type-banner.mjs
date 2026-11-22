// FLOWCLOUD・glow のトップ（「採用情報・姉妹店」の直下）に置く「美容師タイプ診断」の広告帯。
// リンク先は採用サイトの /type-shindan/。流入元が GA4 で分かるように UTM を付ける（autopost/UTM_LINKS.md）。
// 文言は両店で同じ（店ごとの違いは UTM の utm_source と画像の置き場所だけ）。見た目は各サイトの css/65-tsn.css。
// 文の単位は <div>/<p>（llms-full.txt が段落で改行するため。span だと文が空白なしでつながる）。
// h2 は orderHome（build.mjs）が「節の名前」として読むので、属性なしの <h2> にしておく。
// 計測：クリックは build.mjs の共通スクリプトが type_shindan_click（page・pos=home_banner）を送る。
export const TSN_TITLE = '美容師タイプ診断';

export function typeBanner({ site, imgDir }) {
  const href = `https://ko-un-ryu-sui.com/type-shindan/?utm_source=${site}_site&amp;utm_medium=internal&amp;utm_campaign=type_shindan_banner`;
  // 1枚目だけ alt を付ける（飾りの絵なので、まわりの <span> は aria-hidden。2枚目はスマホで流すための複製）
  const img = (cls, hidden) =>
    `<img${cls ? ` class="${cls}"` : ''} src="${imgDir}/type-strip.webp" width="1028" height="168" alt="${hidden ? '' : '美容師タイプ診断に登場する8人のキャラクターのイラスト'}" loading="lazy" decoding="async"${hidden ? ' aria-hidden="true"' : ''}>`;
  return `<section class="sec tsn"><div class="wrap">`
    + `<a class="tsn-card" href="${href}" rel="noopener">`
    + `<div class="tsn-tag">RECRUIT｜美容師を目指す方へ</div>`
    + `<h2>${TSN_TITLE}</h2>`
    + `<div class="tsn-sub"><span class="nw">あなたはどのジョブ？</span> <span class="nw">キャラクターで見つけよう</span></div>`
    + `<div class="tsn-meta">8タイプ・20問・約2分</div>`
    + `<span class="tsn-chars" aria-hidden="true"><span class="tsn-track">${img('', false)}${img('tsn-dup', true)}</span></span>`
    + `<div class="tsn-go">診断をはじめる <i aria-hidden="true">→</i></div>`
    + `</a>`
    + `<p class="tsn-note"><span class="nw">運営会社・株式会社行雲流水の採用サイトの診断です</span><span class="nw">（美容師・美容学生の方向け）。</span></p>`
    + `</div></section>`;
}
