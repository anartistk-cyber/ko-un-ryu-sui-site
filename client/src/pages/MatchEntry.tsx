import { useEffect } from "react";
import { Link } from "wouter";
import { ArrowUpRight } from "lucide-react";
import { LINE_URL } from "../components/SubPage";
import { MATCH_APP_URL } from "../lib/match";

// 採用マッチング診断（外部アプリ）への「自社ドメインの入口」。/match/ を開くと、少し待って元のアプリへ移る。
// 検索結果には出さない（noindex・サイトマップ外）。アクセスはGA4のページビューで数える（QRやLINEからの流入も /match/ に出る）。
export default function MatchEntry() {
  useEffect(() => {
    document.title = "採用マッチング診断を開きます｜株式会社行雲流水 採用サイト";
    document.querySelector<HTMLMetaElement>('meta[name="robots"]')?.setAttribute("content", "noindex, follow");
    document.querySelector('link[rel="canonical"]')?.remove();
    document.querySelector('meta[property="og:url"]')?.remove();
    // 完成済みHTMLの書き出し（プリレンダ）や自動テストのブラウザでは、移らずに画面をそのまま残す。
    if (navigator.webdriver) return;
    // 0.9秒待つのは、GA4のページビューを確実に送るため。replace なので「戻る」で転送ページに戻って堂々巡りにならない。
    const t = window.setTimeout(() => window.location.replace(MATCH_APP_URL), 900);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <div className="privacy-page">
      <main className="privacy-main" style={{ minHeight: "70vh", display: "grid", alignContent: "center", textAlign: "center" }}>
        <div className="privacy-hero">
          <p>RECRUIT MATCHING</p>
          <h1>採用マッチング診断を開いています</h1>
          <span>自動で切り替わらないときは、下のボタンからお進みください。</span>
        </div>
        <p style={{ margin: "36px 0 0" }}>
          <a className="button button-primary" href={MATCH_APP_URL}>診断ページを開く <ArrowUpRight size={17} aria-hidden="true" /></a>
        </p>
        <p style={{ margin: "28px 0 0", fontSize: 13, lineHeight: 1.9 }}>
          開けないときは、<a href="/?c=visit#contact" style={{ textDecoration: "underline" }}>見学・相談フォーム</a>、または<a href={LINE_URL} target="_blank" rel="noreferrer" style={{ textDecoration: "underline" }}>公式LINE</a>からご連絡ください。
        </p>
        <p style={{ margin: "28px 0 0" }}><Link href="/" className="privacy-back">採用サイトのトップへ戻る</Link></p>
      </main>
    </div>
  );
}
