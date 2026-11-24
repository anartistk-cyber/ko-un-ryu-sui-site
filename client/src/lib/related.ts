// 採用サイトの記事ページ：「あわせて読みたい」の関連記事を選ぶ。
// 同じカテゴリ・同じタグの記事を優先し、同点なら「リンクの入りが少ない記事」を先にする（新しい記事にリンクが偏らないように）。
// 毎回同じ結果になる（ビルド時の描画と、ブラウザでの描画がずれない）。記事を posts.ts に足すだけで自動で反映される。
import type { Post } from "../data/posts";

const COMMON_TAGS = new Set(["行雲流水", "美容師求人"]);
let cache: { n: number; plan: Map<string, Post[]> } | null = null;

function build(all: Post[], n: number): Map<string, Post[]> {
  const plan = new Map<string, Post[]>();
  const inbound = new Map(all.map(p => [p.slug, 0]));
  const N = all.length;
  all.forEach((p, i) => {
    const tags = new Set((p.tags ?? []).filter(t => !COMMON_TAGS.has(t)));
    const cand = all
      .filter(x => x.slug !== p.slug)
      .map(x => {
        const shared = (x.tags ?? []).reduce((c, t) => c + (tags.has(t) ? 1 : 0), 0);
        const score = (x.category === p.category ? 3 : 0) + shared;
        const dist = (all.indexOf(x) - i + N) % N; // 一覧で自分より後ろ（古い側）から、最後は新しい側へ回る
        return { x, score, dist };
      });
    cand.sort((a, b) => b.score - a.score || (inbound.get(a.x.slug) ?? 0) - (inbound.get(b.x.slug) ?? 0) || a.dist - b.dist);
    const pick = cand.slice(0, n).map(c => c.x);
    pick.forEach(x => inbound.set(x.slug, (inbound.get(x.slug) ?? 0) + 1));
    plan.set(p.slug, pick);
  });
  return plan;
}

export function relatedPosts(all: Post[], slug: string, n = 4): Post[] {
  if (!cache || cache.n !== all.length) cache = { n: all.length, plan: build(all, n) };
  return cache.plan.get(slug) ?? all.filter(p => p.slug !== slug).slice(0, n);
}
