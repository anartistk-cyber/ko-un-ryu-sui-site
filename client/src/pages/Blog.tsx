import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { posts } from "../data/posts";
import { SubPage, SITE, LINE_URL } from "../components/SubPage";
import { TBD } from "../components/Pending";
import { trackClick } from "../lib/track";
import type { ReactNode } from "react";

function rich(s: string): ReactNode[] {
  return s.split(/\[\[(.+?)\]\]/).map((part, i) => (i % 2 ? <TBD key={i}>{part}</TBD> : part));
}

const fmt = (d: string) => d.replace(/-/g, ".");

export function BlogIndex() {
  return (
    <SubPage title="教育・働き方・見学の記事｜行雲流水 採用情報" description="教育、シフト、給与、学生アルバイト、体験の流れ。応募前に知っておきたいことをテーマ別にまとめています。" path="/blog/">
      <main className="job-detail-main">
        <section className="job-detail-hero">
          <p>STAFF BLOG</p>
          <h1>応募する前に、知っておきたいこと。</h1>
          <p className="job-detail-lead">教育、シフト、給与、学生アルバイト、体験の流れ。採用情報だけでは伝わりにくいことを、テーマごとにまとめています。気になる記事から、働く毎日を確かめてください。</p>
        </section>
        <div className="blog-list">
          {posts.map(p => (
            <Link key={p.slug} href={`/blog/${p.slug}`} className="blog-card">
              {p.image && <img className="blog-thumb" src={p.image} alt={p.imageAlt ?? p.title} loading="lazy" width="1200" height="630" />}
              <span className="blog-meta">{fmt(p.date)}　<b>{p.category}</b></span>
              <h2>{p.title}</h2>
              <p>{p.excerpt}</p>
              <span className="blog-more">続きを読む <ArrowRight size={14} aria-hidden="true" /></span>
            </Link>
          ))}
        </div>
        <CtaBlock />
      </main>
    </SubPage>
  );
}

export function CtaBlock() {
  return (
    <section className="blog-cta">
      <h2>見学・体験について相談する</h2>
      <p>体験の内容、費用、選考との関係は、お申し込み前にご案内します。</p>
      <div>
        <a className="job-detail-cta" href="/?c=visit#contact">見学・体験について相談する <ArrowRight size={17} aria-hidden="true" /></a>
        <a className="job-detail-line" href={LINE_URL} target="_blank" rel="noreferrer">LINEで採用の質問をする</a>
      </div>
    </section>
  );
}

export function BlogPost({ slug }: { slug: string }) {
  const post = posts.find(p => p.slug === slug);
  if (!post) return null;
  const path = `/blog/${post.slug}`;
  const ld = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    datePublished: post.date,
    dateModified: post.date,
    description: post.excerpt,
    ...(post.image ? { image: SITE + post.image } : {}),
    mainEntityOfPage: SITE + path,
    author: { "@type": "Organization", name: "株式会社 行雲流水" },
    publisher: { "@type": "Organization", name: "株式会社 行雲流水" },
    ...(post.tags?.length ? { keywords: post.tags.join(", ") } : {}),
  };
  const toc = post.body.map((b, i) => ("h" in b ? { h: b.h, id: `sec-${i}` } : null)).filter((x): x is { h: string; id: string } => x !== null);
  const hIdx = post.body.map((b, i) => ("h" in b ? i : -1)).filter(i => i >= 0);
  const midIdx = hIdx.length >= 4 ? hIdx[Math.floor(hIdx.length / 2)] - 1 : -1;
  const others = posts.filter(p => p.slug !== slug).slice(0, 3);
  return (
    <SubPage title={post.seoTitle} description={post.seoDesc} path={path} image={post.image}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <main className="job-detail-main blog-post">
        <p className="blog-meta">{fmt(post.date)}　<b>{post.category}</b></p>
        <h1>{post.title}</h1>
        {post.image && <img className="blog-hero" src={post.image} alt={post.imageAlt ?? post.title} width="1200" height="630" />}
        {toc.length >= 3 && (
          <nav className="blog-toc" aria-label="この記事の目次">
            <p>この記事の内容</p>
            <ol>{toc.map(t => <li key={t.id}><a href={`#${t.id}`}>{t.h}</a></li>)}</ol>
          </nav>
        )}
        <article className="blog-body">
          {post.body.map((b, i) => {
            const node = "h" in b ? <h2 key={i} id={`sec-${i}`}>{b.h}</h2> : "p" in b ? <p key={i}>{rich(b.p)}</p> : "img" in b ? <img key={i} className="blog-photo" src={b.img} alt={b.alt} loading="lazy" /> : "video" in b ? <video key={i} className="blog-photo" src={b.video} poster={b.poster} controls playsInline preload="none" aria-label={b.alt} /> : <ul key={i}>{b.ul.map(li => <li key={li}>{rich(li)}</li>)}</ul>;
            if (i !== midIdx) return node;
            return (
              <div key={i}>
                {node}
                <aside className="blog-mid-cta" onClick={trackClick}>
                  <p>読んで気になったことは、見学や公式LINEで気軽に聞けます。</p>
                  <a href="/?c=visit#contact" data-track="consult" data-placement="blog-mid">見学・相談する</a>
                  <a href={LINE_URL} target="_blank" rel="noreferrer" data-track="line" data-placement="blog-mid">公式LINEで質問する</a>
                </aside>
              </div>
            );
          })}
        </article>
        {post.tags?.length ? <p className="blog-tags">{post.tags.map(t => <span key={t}>#{t}</span>)}</p> : null}
        <section className="blog-cta" onClick={trackClick}>
          <h2>次に確認したいこと</h2>
          <div>
            {post.ctas.map(([l, h], i) => <a key={h} className={i === 0 ? "job-detail-cta" : "job-detail-line"} href={h} data-track={i === 0 ? "consult" : "body"} data-placement="blog">{l}</a>)}
          </div>
        </section>
        <section className="blog-links" onClick={trackClick}>
          <h2>公式アカウント・働くサロン</h2>
          <ul>
            <li><a href="https://www.instagram.com/ko_un_ryu_sui.recruit/" target="_blank" rel="noreferrer" data-track="body" data-placement="blog-links">採用Instagram（@ko_un_ryu_sui.recruit）</a></li>
            <li><a href={LINE_URL} target="_blank" rel="noreferrer" data-track="line" data-placement="blog-links">公式LINEで質問する</a></li>
            <li><a href={`https://www.flowcloud.net/?utm_source=recruit_blog&utm_medium=internal&utm_campaign=${post.slug}`} target="_blank" rel="noreferrer" data-track="body" data-placement="blog-links">FLOWCLOUD（泉大津駅 徒歩3分）のサロンを見る</a></li>
            <li><a href={`https://glow-izumiotsu.jp/?utm_source=recruit_blog&utm_medium=internal&utm_campaign=${post.slug}`} target="_blank" rel="noreferrer" data-track="body" data-placement="blog-links">glow（泉大津駅 徒歩1分）のサロンを見る</a></li>
            <li><a href="https://beauty.hotpepper.jp/slnH000173335/" target="_blank" rel="noreferrer" data-track="body" data-placement="blog-links">FLOWCLOUD のホットペッパービューティーページ</a></li>
            <li><a href="https://beauty.hotpepper.jp/slnH000798580/" target="_blank" rel="noreferrer" data-track="body" data-placement="blog-links">glow のホットペッパービューティーページ</a></li>
            <li><a href="https://www.threads.com/@ko_un_ryu_sui.recruit" target="_blank" rel="noreferrer" data-track="body" data-placement="blog-links">採用Threads（@ko_un_ryu_sui.recruit）</a></li>
            <li><a href="https://www.instagram.com/flowcloud_osaka/" target="_blank" rel="noreferrer" data-track="instagram" data-placement="blog-links">FLOWCLOUD Instagram</a>／<a href="https://www.threads.com/@flowcloud_osaka" target="_blank" rel="noreferrer" data-track="body" data-placement="blog-links">Threads</a>／<a href="https://www.tiktok.com/@flowcloud1101" target="_blank" rel="noreferrer" data-track="body" data-placement="blog-links">TikTok</a>／<a href="https://www.youtube.com/@flowcloud" target="_blank" rel="noreferrer" data-track="body" data-placement="blog-links">YouTube</a></li>
            <li><a href="https://www.instagram.com/glow_.osaka/" target="_blank" rel="noreferrer" data-track="instagram" data-placement="blog-links">glow Instagram</a>／<a href="https://www.threads.com/@glow_.osaka" target="_blank" rel="noreferrer" data-track="body" data-placement="blog-links">Threads</a></li>
          </ul>
        </section>
        <section className="blog-others">
          <h2>ほかの記事</h2>
          {others.map(p => <Link key={p.slug} href={`/blog/${p.slug}`}>{p.title}</Link>)}
          <Link href="/blog/">記事一覧へ</Link>
        </section>
      </main>
    </SubPage>
  );
}
