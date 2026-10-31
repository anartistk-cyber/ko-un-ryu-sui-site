import { ArrowLeft, Mail } from "lucide-react";
import type { ReactNode } from "react";
import { TBD } from "../components/Pending";
import { useEffect } from "react";
import { Link } from "wouter";

const logoPath = "/images/company-logo_19c099e6.jpg";

const sections: { number: string; title: string; body: ReactNode }[] = [
  { number: "01", title: "取得する情報", body: "当社は、氏名、フリガナ、連絡先（メールアドレス・電話番号）、相談内容と現在の状況、希望店舗・希望日時、学校名・卒業予定、希望する勤務条件、質問・伝えたいことなど、フォームに入力いただいた情報および選考の過程でご提供いただいた情報を取得します。" },
  { number: "02", title: "利用目的", body: "取得した情報は、応募受付、選考、見学・体験の日程調整、お問い合わせへの回答、およびこれらに必要な連絡のために利用します。" },
  { number: "03", title: "委託と第三者への提供", body: <>当社は、当サイトの運営（レンタルサーバー・メール送受信）に必要な範囲で、外部のサービス事業者に取扱いを委託します。委託先の管理と契約条件を確認し、必要な監督を行います。ご本人の同意がある場合や法令に基づく場合を除き、取得した個人情報を第三者へ提供しません。フォームの内容は、当社のメールサーバーを通じて採用担当者へ送信されます。</> },
  { number: "04", title: "保管と削除", body: <>取得した情報は、採用活動に必要な期間（選考終了後、最長1年を目安）保管し、利用の必要がなくなった後は、メール・記録を削除し、書類はシュレッダー等で破棄します。採用された方の情報は、入社後の従業員情報として当社の規程に従って取り扱います。</> },
  { number: "05", title: "安全管理", body: <>当社は、閲覧できる担当者を限定するアクセス制限や、パスワード管理などによって、個人情報の漏えい等を防ぐための管理を行います。</> },
  { number: "06", title: "照会・訂正等のお問い合わせ", body: <>個人情報に関するお問い合わせや、開示・訂正・削除等のご相談は、採用担当（info@ko-un-ryu-sui.com）または公式LINEへご連絡ください。ご本人であることを確認のうえ、法令に従い、合理的な期間内に対応します。</> },
  { number: "07", title: "アクセス解析等", body: <>当サイトでは、閲覧状況（どのページがどれだけ見られているか等）を把握しサイト改善に役立てるため、Google社のアクセス解析サービス「Googleアナリティクス（GA4）」を利用しています。Cookie等を通じて、閲覧ページ、滞在時間、おおよその地域、端末の種類、ボタンのクリック等の情報が匿名のかたちで収集されます。氏名・連絡先等の個人を特定する情報は取得しません。収集された情報はGoogleのプライバシーポリシーに基づき管理されます。ブラウザのCookie設定の変更、またはGoogleが提供するオプトアウトアドオンの利用により、収集を停止できます。公式LINEへ移動した後は、LINE側の取扱いが適用されます。</> },
];

export default function PrivacyPolicy() {
  useEffect(() => {
    const title = "採用に関する個人情報の取扱い｜株式会社行雲流水";
    const url = "https://ko-un-ryu-sui.com/privacy";
    document.title = title;
    document.querySelector<HTMLMetaElement>('meta[name="description"]')?.setAttribute("content", "見学・体験・採用応募で取得する情報の利用目的、保管と管理、お問い合わせ方法をご案内します。");
    document.querySelector<HTMLMetaElement>('meta[property="og:title"]')?.setAttribute("content", title);
    document.querySelector<HTMLMetaElement>('meta[property="og:url"]')?.setAttribute("content", url);
    document.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.setAttribute("href", url);
  }, []);

  return (
    <div className="privacy-page">
      <header className="privacy-header">
        <Link href="/" className="privacy-brand" aria-label="行雲流水 採用サイト トップへ">
          <img src={logoPath} alt="株式会社 行雲流水 ko-un-ryu-sui ロゴ" />
          <span />
          <small>RECRUITMENT</small>
        </Link>
        <Link href="/" className="privacy-back">採用サイトへ戻る <ArrowLeft size={15} aria-hidden="true" /></Link>
      </header>

      <main className="privacy-main">
        <div className="privacy-hero">
          <p>PRIVACY POLICY</p>
          <h1>採用に関する個人情報の取扱い</h1>
          <span>株式会社 行雲流水</span>
        </div>

        <div className="privacy-intro">
          <p>株式会社行雲流水（以下「当社」）は、採用への応募、見学・体験のお申込み、お問い合わせに際して取得する個人情報を、以下のとおり取り扱います。</p>
        </div>

        <div className="privacy-sections">
          {sections.map(section => (
            <section key={section.number}>
              <span>{section.number}</span>
              <div><h2>{section.title}</h2><p>{section.body}</p></div>
            </section>
          ))}
        </div>

        <section className="privacy-contact">
          <div><p>CONTACT</p><h2>個人情報に関する<br />お問い合わせ窓口</h2></div>
          <a href="mailto:info@ko-un-ryu-sui.com"><Mail size={17} aria-hidden="true" /> info@ko-un-ryu-sui.com</a>
        </section>

        <p className="privacy-updated">事業者：株式会社行雲流水／所在地：大阪府泉大津市東雲町1-20／制定日：2026年10月30日／改定日：2026年10月30日</p>
      </main>

      <footer className="privacy-footer"><span>© KOUNRYUSUI CO., LTD.</span><Link href="/">FLOW CLOUD / glow RECRUITMENT SITE</Link></footer>
    </div>
  );
}
