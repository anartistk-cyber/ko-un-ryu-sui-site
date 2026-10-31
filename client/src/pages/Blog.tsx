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
  };
  const others = posts.filter(p => p.slug !== slug).slice(0, 3);
  return (
    <SubPage title={post.seoTitle} description={post.seoDesc} path={path} image={post.image}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <main className="job-detail-main blog-post">
        <p className="blog-meta">{fmt(post.date)}　<b>{post.category}</b></p>
        <h1>{post.title}</h1>
        {post.image && <img className="blog-hero" src={post.image} alt={post.imageAlt ?? post.title} width="1200" height="630" />}
        <article className="blog-body">
          {post.body.map((b, i) =>
            "h" in b ? <h2 key={i}>{b.h}</h2> : "p" in b ? <p key={i}>{rich(b.p)}</p> : "img" in b ? <img key={i} className="blog-photo" src={b.img} alt={b.alt} loading="lazy" /> : <ul key={i}>{b.ul.map(li => <li key={li}>{rich(li)}</li>)}</ul>
          )}
        </article>
        <section className="blog-cta" onClick={trackClick}>
          <h2>次に確認したいこと</h2>
          <div>
            {post.ctas.map(([l, h], i) => <a key={h} className={i === 0 ? "job-detail-cta" : "job-detail-line"} href={h} data-track={i === 0 ? "consult" : "body"} data-placement="blog">{l}</a>)}
          </div>
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
