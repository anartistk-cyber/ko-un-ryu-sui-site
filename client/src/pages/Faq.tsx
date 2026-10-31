import { useEffect } from "react";
import { ChevronDown, ArrowRight } from "lucide-react";
import { SubPage, LINE_URL } from "../components/SubPage";
import { faqItems } from "../data/faq";

const TITLE = "美容師求人のよくある質問｜給与・休み・見学・教育｜泉大津｜FLOWCLOUD・glow";
const DESC = "泉大津のFLOWCLOUD・glowの採用に関するよくある質問。給与の内訳、年間休日・有給、社会保険、見学・体験、練習時間、通勤エリアなど、応募前の疑問にお答えします。";

export default function Faq() {
  // 回答の本文（画面に出ているテキスト）から FAQPage 構造化データを組み立てる
  useEffect(() => {
    const items = Array.from(document.querySelectorAll<HTMLElement>("[data-faq-item]")).map(el => ({
      "@type": "Question",
      name: el.querySelector("summary span")?.textContent?.trim() ?? "",
      acceptedAnswer: { "@type": "Answer", text: el.querySelector("p")?.textContent?.trim() ?? "" },
    })).filter(q => q.name && q.acceptedAnswer.text);
    let s = document.getElementById("faq-jsonld") as HTMLScriptElement | null;
    if (!s) { s = document.createElement("script"); s.id = "faq-jsonld"; s.type = "application/ld+json"; document.head.appendChild(s); }
    s.textContent = JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: items });
    return () => { s?.remove(); };
  }, []);
  return (
    <SubPage title={TITLE} description={DESC} path="/faq">
      <main className="job-detail-main">
        <section className="faq-section section" aria-labelledby="faq-page-title">
          <div className="faq-heading"><h1 id="faq-page-title">美容師求人のよくある質問</h1>
            <p>泉大津の美容室FLOWCLOUD・glowへの応募前に、よく聞かれることをまとめました。ここにない疑問も、見学・相談で気軽にご確認ください。</p></div>
          <div className="faq-list">
            {faqItems.map(([q, a]) => (
              <details key={q} data-faq-item>
                <summary><span>{q}</span><ChevronDown size={20} aria-hidden="true" /></summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
          <p className="experience-cta">
            <a className="button button-primary" href="/?c=visit#contact" data-track="visit" data-placement="faq-page">サロン見学を相談する <ArrowRight size={16} aria-hidden="true" /></a>{" "}
            <a className="button button-quiet" href={LINE_URL} target="_blank" rel="noreferrer">LINEで相談する</a>
          </p>
        </section>
      </main>
    </SubPage>
  );
}
