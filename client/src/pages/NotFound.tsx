import { useEffect } from "react";
import { Link } from "wouter";

export default function NotFound() {
  useEffect(() => {
    document.title = "ページが見つかりません｜FLOW CLOUD・glow 採用サイト";
    document.querySelector<HTMLMetaElement>('meta[name="robots"]')?.setAttribute("content", "noindex");
    document.querySelector('link[rel="canonical"]')?.remove();
    document.querySelector('meta[property="og:url"]')?.remove();
  }, []);

  return (
    <div className="privacy-page">
      <main className="privacy-main" style={{ minHeight: "70vh", display: "grid", alignContent: "center", textAlign: "center" }}>
        <div className="privacy-hero">
          <p>404 NOT FOUND</p>
          <h1>ページが見つかりません</h1>
          <span>お探しのページは移動または削除された可能性があります。</span>
        </div>
        <p><Link href="/" className="privacy-back">採用サイトのトップへ戻る</Link></p>
      </main>
    </div>
  );
}
