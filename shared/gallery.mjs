// ヘアスタイルギャラリー（FLOWCLOUD / glow 共通）。写真は各サロンの公式Instagramの投稿から。
//   items: [{n:'02', c:'l', t:'短い名前（キャプション）', a:'写真に写っているスタイルの説明（alt）'}]
//   cats : [['l','ロング'], ['b','ボブ・ショート'], ...]  ※CSS側にフィルター規則があるのは l / b / s / c / w
//   dir  : '/fc/img' など。ファイルは st-<n>-m.jpg（480x640）と st-<n>-l.jpg（〜840x1120）
// ホームは流れる写真の帯（動き）、/style/ は種類で絞り込めるグリッド。絞り込みはCSSのみ（JS不要）。
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');

export function makeGallery({ dir, items, cats, pageHref = '/style/' }) {
  const catName = Object.fromEntries(cats);
  const img = (it, sizes, { alt = true, eager = false } = {}) =>
    `<img src="${dir}/st-${it.n}-m.jpg" srcset="${dir}/st-${it.n}-m.jpg 480w, ${dir}/st-${it.n}-l.jpg 840w" sizes="${sizes}" alt="${alt ? esc(it.a) : ''}"${alt ? '' : ' aria-hidden="true"'} width="480" height="640" ${eager ? '' : 'loading="lazy" '}decoding="async">`;

  // ホーム：流れる写真の帯（2セット並べて無限ループ。2セット目は読み上げ・Tab対象から外す）
  const card = (it, dup) =>
    `<a class="gc c-${it.c}" href="${pageHref}#st-${it.n}"${dup ? ' tabindex="-1" aria-hidden="true"' : ''}>${img(it, '220px', { alt: !dup })}<span class="gc-t">${esc(it.t)}</span></a>`;
  const home = () =>
    `<div class="gm" role="region" aria-label="ヘアスタイルの写真" tabindex="0"><div class="gm-in">${items.map((it) => card(it, false)).join('')}${items.map((it) => card(it, true)).join('')}</div></div>`;

  // /style/ ：種類で絞り込めるグリッド（ラジオ＋ラベルのCSSフィルター）
  const page = () => {
    const radios = ['all', ...cats.map((c) => c[0])]
      .map((k, i) => `<input type="radio" name="gf" id="gf-${k}" class="gf-r"${i === 0 ? ' checked' : ''}>`)
      .join('');
    const chips = [['all', 'すべて'], ...cats].map(([k, n]) => `<label for="gf-${k}">${esc(n)}</label>`).join('');
    const lis = items
      .map(
        (it) =>
          `<li class="c-${it.c}" id="st-${it.n}"><figure>${img(it, '(max-width:720px) 46vw, 340px')}<figcaption><b>${esc(it.t)}</b><span>${esc(catName[it.c])}</span></figcaption></figure></li>`
      )
      .join('');
    return `<div class="gp">${radios}<div class="gf-chips" role="group" aria-label="スタイルの種類で絞り込む">${chips}</div><ul class="gf-list">${lis}</ul></div>`;
  };

  // 構造化データ（ImageGallery）
  const ld = ({ base, url, name, description, credit }) => ({
    '@type': 'ImageGallery',
    '@id': url + '#gallery',
    name,
    description,
    url,
    image: items.map((it) => ({
      '@type': 'ImageObject',
      contentUrl: base + `${dir}/st-${it.n}-l.jpg`,
      thumbnailUrl: base + `${dir}/st-${it.n}-m.jpg`,
      name: it.t,
      description: it.a,
      creditText: credit,
    })),
  });

  // サイトマップ用の画像
  const sitemapImages = (base) =>
    items.map((it) => `<image:image><image:loc>${base}${dir}/st-${it.n}-l.jpg</image:loc><image:caption>${esc(it.a)}</image:caption></image:image>`).join('');

  return { home, page, ld, sitemapImages };
}
