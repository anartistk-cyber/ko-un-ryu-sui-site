// 内部リンクを増やす部品（FLOWCLOUD・glow 共通）。目的：どのページにもリンクが集まるようにして、回遊・クロール・全ページの閲覧を増やす。
// ① 記事ページの「あわせて読みたい」：話題が近い記事を3本（同じ話題の記事を優先し、リンクが特定の記事に偏らないよう、リンクの入りが少ない記事を先にする）。
// ② サービスページ（髪質改善・カラー・ヘッドスパ…）の「関連する記事」：その話題の記事（NX に載るもの）を新しい順に最大4本。ページ本文に既にあるリンクは重ねない。
// 話題の元は build.mjs の NX（記事→つぎに見るサービスページ）。新しい記事を data.json に足すだけで、自動で反映される（NX が無い記事は話題なし＝順番で回す）。
// 事実や文面は足さない（記事の題名と日付をリンクにするだけ）。
const GENERIC = new Set(['/menu/', '/first/', '/voice/', '/coupon/', '/area/', '/cast/', '/style/', '/company/', '/faq/']);
const escH = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export function makeRelated({ posts, NX, prefix, sec, hubs = {}, extras = {} }) {
  const blogs = posts.filter(x => x.type === 'ブログ');
  const key = x => `${prefix}${x.slug}/`;
  const li = x => `<li><time datetime="${x.date}">${x.date.replace(/-/g, '.')}</time> <a href="${prefix}${x.slug}/">${escH(x.title)}</a></li>`;
  const topics = x => (NX[key(x)] || []).filter(k => !GENERIC.has(k));
  const list = (items, title) => sec(title, '<ul class="posts">' + items.map(li).join('') + '</ul>', 'alt');

  let plan = null; // slug -> [post, post, post]
  const build = () => {
    plan = new Map();
    const inbound = new Map(blogs.map(x => [x.slug, 0]));
    const N = blogs.length;
    blogs.forEach((p, i) => {
      const t = new Set(topics(p));
      const cand = blogs.filter(x => x.slug !== p.slug).map(x => {
        const score = topics(x).reduce((c, k) => c + (t.has(k) ? 1 : 0), 0);
        const dist = (blogs.indexOf(x) - i + N) % N; // 一覧で自分より後ろ（古い側）を先に、最後は新しい側へ回る
        return { x, score, dist };
      });
      cand.sort((a, b) => b.score - a.score || inbound.get(a.x.slug) - inbound.get(b.x.slug) || a.dist - b.dist);
      const pick = cand.slice(0, 3).map(c => c.x);
      pick.forEach(x => inbound.set(x.slug, inbound.get(x.slug) + 1));
      plan.set(p.slug, pick);
    });
  };

  return {
    // 記事ページ：あわせて読みたい（お知らせ記事のときは新しい記事3本）
    postBlock(p) {
      if (!plan) build();
      const o = plan.get(p.slug) || blogs.filter(x => x.slug !== p.slug).slice(0, 3);
      return o.length ? list(o, 'あわせて読みたい') : '';
    },
    // サービスページ：関連する記事
    pageBlock(path, body) {
      if (!path || path === '/' || path.startsWith(prefix)) return '';
      const hub = hubs[path];
      let m = hub ? blogs.filter(hub) : blogs.filter(x => (NX[key(x)] || []).includes(path));
      if (!hub && GENERIC.has(path)) return '';
      m = m.filter(x => !String(body).includes(`href="${prefix}${x.slug}/"`)).slice(0, 4);
      // 記事ではないページへの追加リンク（リンクの入りが少ないページ用）。本文に既にあれば重ねない
      const ex = (extras[path] || []).filter(([href]) => !String(body).includes(`href="${href}"`));
      const exHtml = ex.length ? sec('あわせて読みたい', ex.map(([href, label]) => `<p><a class="more" href="${href}">${escH(label)} →</a></p>`).join(''), 'alt') : '';
      return (m.length ? list(m, '関連する記事') : '') + exHtml;
    },
  };
}
