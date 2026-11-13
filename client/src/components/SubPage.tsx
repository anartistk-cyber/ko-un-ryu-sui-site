import { useEffect, type ReactNode } from "react";
import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";

export const SITE = "https://ko-un-ryu-sui.com";
export const LINE_URL = "https://lin.ee/Z0JP8sH";
// 採用マッチング診断（藤津さん作成の外部アプリ。診断12問と見学・相談・応募の受付は向こうで動く）
export const MATCH_URL = "https://kounryusui-recruit.flowcloudcast.chatgpt.site/";
const logoPath = "/images/company-logo_s210.jpg";

// ページ名（<div data-pg>）：ページごとの色を出し分ける（index.css の「採用サブページ：ページごとの色」）。/recruit/newgrad→recruit-newgrad、/blog/xxx→blog、/faq→faq
export const pgOf = (path: string) => path.split("/").filter(Boolean).slice(0, path.startsWith("/blog") ? 1 : 2).join("-") || "home";

export function setMeta(opts: { title: string; description: string; path: string; jsonLd?: object; image?: string }) {
  document.title = opts.title;
  const set = (sel: string, v: string) => document.querySelector<HTMLMetaElement>(sel)?.setAttribute("content", v);
  set('meta[name="description"]', opts.description);
  set('meta[property="og:title"]', opts.title);
  set('meta[property="og:description"]', opts.description);
  set('meta[property="og:url"]', SITE + opts.path);
  if (opts.image) set('meta[property="og:image"]', SITE + opts.image);
  document.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.setAttribute("href", SITE + opts.path);
}

export function SubPage({ children, title, description, path, image }: { children: ReactNode; title: string; description: string; path: string; image?: string }) {
  useEffect(() => { setMeta({ title, description, path, image }); window.scrollTo(0, 0); }, [title, description, path, image]);
  const crumbs = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
    { "@type": "ListItem", position: 1, name: "採用トップ", item: SITE + "/" },
    { "@type": "ListItem", position: 2, name: title.split("｜")[0], item: SITE + path }] };
  return (
    <div className="job-detail-page sub-page" data-pg={pgOf(path)}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbs) }} />
      <header className="job-detail-header">
        <Link href="/" className="privacy-brand" aria-label="行雲流水 採用サイト トップへ">
          <img src={logoPath} alt="株式会社 行雲流水 ko-un-ryu-sui ロゴ" />
          <span />
          <small>RECRUITMENT</small>
        </Link>
        <Link href="/" className="privacy-back">トップへ戻る <ArrowLeft size={15} aria-hidden="true" /></Link>
      </header>
      {children}
      <div className="mobile-cta" aria-label="見学・応募へのショートカット"><a className="mobile-email" href="/?c=visit#contact">見学・相談する</a><a className="mobile-line" href={LINE_URL} target="_blank" rel="noreferrer">LINEで相談</a></div>
      <footer className="privacy-footer"><span>© KOUNRYUSUI CO., LTD.</span><span className="sub-official"><a href="https://www.flowcloud.net/" target="_blank" rel="noreferrer">FLOWCLOUD公式サイト</a><a href="https://glow-izumiotsu.jp/" target="_blank" rel="noreferrer">glow公式サイト</a><Link href="/">採用トップ</Link><Link href="/recruit/">募集職種一覧</Link><Link href="/area">勤務エリア</Link><Link href="/school">美容学校の学生の方へ</Link><Link href="/recruit/student">高校生・美容学生</Link><Link href="/recruit/newgrad">新卒採用</Link><Link href="/recruit/career">中途採用</Link><Link href="/workstyle">働き方（休み・教育）</Link><Link href="/visit">見学・体験の流れ</Link><a href={MATCH_URL} target="_blank" rel="noopener noreferrer">採用マッチング診断（12問）</a><Link href="/faq">よくある質問</Link></span></footer>
    </div>
  );
}
