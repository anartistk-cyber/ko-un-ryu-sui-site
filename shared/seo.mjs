// SEO / MEO / AIO の共通部品（FLOWCLOUD・glow・採用サイトで共有）
import fs from 'node:fs';
import path from 'node:path';

// 検索結果・AI回答で、画像・長い引用を使ってよいという許可（Googleのスニペット制御）
export const ROBOTS_META = '<meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1">';

// 3サイトの組織関係（エンティティの紐づけ用）
export const ORG_ID = 'https://ko-un-ryu-sui.com/#org';
export const parentOrg = (recruitUrl, fcUrl, glowUrl) => ({
  '@type': 'Organization', '@id': ORG_ID, name: '株式会社行雲流水', url: recruitUrl,
  subOrganization: [
    { '@type': 'HairSalon', '@id': fcUrl + '#salon', name: 'FLOWCLOUD（フロウクラウド）', url: fcUrl },
    { '@type': 'HairSalon', '@id': glowUrl + '#salon', name: 'glow（グロウ）', url: glowUrl },
  ],
});

// '¥16,500〜' → {min:16500, from:true}
const parsePrice = (t) => {
  const m = String(t).replace(/,/g, '').match(/(\d+)/);
  if (!m) return null;
  return { n: Number(m[1]), from: /〜/.test(t) };
};

// メニュー表 → schema.org の OfferCatalog。sections: [[カテゴリ名, [[メニュー名, '¥5,500'] ...]] ...]
// 各行は [名前, 価格] か [名前, 時間, 価格]（最後の要素を価格とみなす）
export function offerCatalog(name, sections) {
  return {
    '@type': 'OfferCatalog', name,
    itemListElement: sections.map(([cat, rows]) => ({
      '@type': 'OfferCatalog', name: cat,
      itemListElement: rows.map((r) => {
        const p = parsePrice(r[r.length - 1]);
        if (!p) return null;
        const offer = { '@type': 'Offer', priceCurrency: 'JPY', itemOffered: { '@type': 'Service', name: r[0] } };
        if (p.from) offer.priceSpecification = { '@type': 'PriceSpecification', minPrice: p.n, priceCurrency: 'JPY' };
        else offer.price = String(p.n);
        return offer;
      }).filter(Boolean),
    })),
  };
}

// 休業日リスト → specialOpeningHoursSpecification（今日以降〜リスト最終日まで）
// 休業日 = 閉店（opens/closes 00:00）、リストにない月・火 = 営業（9:00〜20:00）。水〜日は通常営業なので出さない。
export function specialHours(closedDates, { opens = '09:00', closes = '20:00' } = {}) {
  const days = [...closedDates].sort();
  if (!days.length) return [];
  const today = new Date(Date.now() + 9 * 3600e3).toISOString().slice(0, 10);
  const last = days[days.length - 1];
  const set = new Set(days);
  const out = [];
  const d = new Date(today + 'T00:00:00Z');
  const end = new Date(last + 'T00:00:00Z');
  for (; d <= end; d.setUTCDate(d.getUTCDate() + 1)) {
    const ds = d.toISOString().slice(0, 10);
    const dow = d.getUTCDay(); // 0=日 1=月 2=火
    if (set.has(ds)) out.push({ '@type': 'OpeningHoursSpecification', validFrom: ds, validThrough: ds, opens: '00:00', closes: '00:00' });
    else if (dow === 1 || dow === 2) out.push({ '@type': 'OpeningHoursSpecification', validFrom: ds, validThrough: ds, opens, closes });
  }
  return out;
}

// ---- llms-full.txt（AI向けに、サイト全ページの本文を1ファイルにまとめる）----
const decode = (s) => s.replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'");
const htmlToText = (html) => {
  let h = html;
  h = h.replace(/<(script|style|svg|noscript|template|iframe|video|form)[\s\S]*?<\/\1>/gi, '');
  h = h.replace(/<br\s*\/?>/gi, '\n').replace(/<\/(p|div|section|article|li|h[1-6]|tr|ul|ol|blockquote|table|dt|dd|figure)>/gi, '\n');
  h = h.replace(/<li[^>]*>/gi, '- ').replace(/<\/(td|th)>/gi, ' | ');
  h = h.replace(/<[^>]+>/g, '');
  h = decode(h);
  return h.split('\n').map((l) => l.replace(/[ \t　]+/g, ' ').trim()).filter(Boolean).join('\n').replace(/\n{3,}/g, '\n\n');
};
const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
  const p = path.join(dir, e.name);
  return e.isDirectory() ? walk(p) : [p];
});

export function buildLlmsFull(dir, base, header) {
  const files = walk(dir).filter((f) => f.endsWith('.html')).sort((a, b) => {
    const da = path.relative(dir, a).split(path.sep).length, db = path.relative(dir, b).split(path.sep).length;
    return da - db || a.localeCompare(b);
  });
  const parts = [];
  for (const f of files) {
    const html = fs.readFileSync(f, 'utf8');
    const canon = (html.match(/<link rel="canonical" href="([^"]+)"/) || [])[1];
    if (!canon || !canon.startsWith(base)) continue; // 404・認証ファイルなどは除外
    const title = decode((html.match(/<title>([^<]*)<\/title>/) || [])[1] || '').trim();
    const main = (html.match(/<main[^>]*>([\s\S]*?)<\/main>/) || [])[1];
    if (!main) continue;
    const text = htmlToText(main);
    if (text.length < 40) continue;
    parts.push(`\n\n---\n## ${title}\nURL: ${canon}\n\n${text}`);
  }
  const body = `${header.trim()}\n\n（このファイルは、サイトの全ページの本文を1つにまとめたものです。最新の内容は各ページのURLをご確認ください。）${parts.join('')}\n`;
  fs.writeFileSync(path.join(dir, 'llms-full.txt'), body);
  return { pages: parts.length, bytes: Buffer.byteLength(body) };
}

// llms.txt 用：各ページの <title> を読んで「- [タイトル](URL)」の一覧にする（llms.txt の推奨形式＝Markdownのリンク。PageSpeedの llms.txt 監査も、リンクが無いと不合格にする）
export function llmsPageLinks(outDir, base, urls) {
  return urls.map((u) => {
    const f = path.join(outDir, u.replace(/^\//, ''), 'index.html');
    let t = u;
    try { t = (fs.readFileSync(f, 'utf8').match(/<title>([^<]*)<\/title>/) || [])[1] || u; } catch { /* ページが無ければURLのまま */ }
    t = t.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/[\[\]]/g, '');
    return `- [${t}](${base}${u})`;
  }).join('\n');
}
