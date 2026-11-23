import { ArrowLeft, Mail } from "lucide-react";
import type { ReactNode } from "react";
import { TBD } from "../components/Pending";
import { useEffect } from "react";
import { Link } from "wouter";

// ヒートマップ（Microsoft Clarity）。client/.env の VITE_CLARITY_ID が空の間は、スクリプトも追記文も出ない
const CLARITY_ID = import.meta.env.VITE_CLARITY_ID || "";
const logoPath = "/images/company-logo_s210.jpg";

const sections: { number: string; title: string; body: ReactNode }[] = [
  { number: "01", title: "取得する情報", body: "当社は、氏名、フリガナ、連絡先（メールアドレス・電話番号）、相談内容と現在の状況、希望店舗・希望日時、学校名・卒業予定、希望する勤務条件、質問・伝えたいことなど、フォームに入力いただいた情報および選考の過程でご提供いただいた情報を取得します。" },
  { number: "02", title: "利用目的", body: "取得した情報は、応募受付、選考、見学・体験の日程調整、お問い合わせへの回答、およびこれらに必要な連絡のために利用します。" },
  { number: "03", title: "委託と第三者への提供", body: <>当社は、当サイトの運営（レンタルサーバー・メール送受信）に必要な範囲で、外部のサービス事業者に取扱いを委託します。委託先の管理と契約条件を確認し、必要な監督を行います。ご本人の同意がある場合や法令に基づく場合を除き、取得した個人情報を第三者へ提供しません。フォームの内容は、当社のメールサーバーを通じて採用担当者へ送信されます。</> },
  { number: "04", title: "保管と削除", body: <>取得した情報は、採用活動に必要な期間（選考終了後、最長1年を目安）保管し、利用の必要がなくなった後は、メール・記録を削除し、書類はシュレッダー等で破棄します。採用された方の情報は、入社後の従業員情報として当社の規程に従って取り扱います。</> },
  { number: "05", title: "安全管理", body: <>当社は、閲覧できる担当者を限定するアクセス制限や、パスワード管理などによって、個人情報の漏えい等を防ぐための管理を行います。</> },
  { number: "06", title: "照会・訂正等のお問い合わせ", body: <>個人情報に関するお問い合わせや、開示・訂正・削除等のご相談は、採用担当（info@ko-un-ryu-sui.com）または公式LINEへご連絡ください。ご本人であることを確認のうえ、法令に従い、合理的な期間内に対応します。</> },
  { number: "07", title: "アクセス解析等", body: <>当サイトでは、閲覧状況（どのページがどれだけ見られているか等）を把握しサイト改善に役立てるため、Google社のアクセス解析サービス「Googleアナリティクス（GA4）」を利用しています。Cookie等を通じて、閲覧ページ、滞在時間、おおよその地域、端末の種類、ボタンのクリック等の情報が匿名のかたちで収集されます。氏名・連絡先等の個人を特定する情報は取得しません。収集された情報はGoogleのプライバシーポリシーに基づき管理されます。ブラウザのCookie設定の変更、またはGoogleが提供するオプトアウトアドオンの利用により、収集を停止できます。{CLARITY_ID ? <>また、ページのどの部分が見られ、どこで離れているかを把握してサイトを改善するため、Microsoft社の分析サービス「Microsoft Clarity」（ヒートマップ）を利用しています。画面上のクリック・タップ・スクロールの動き、閲覧ページ、端末の種類、おおよその地域などがMicrosoft社に送信されます。お問い合わせ・応募フォームに入力された内容は収集しない設定にしています。収集された情報はMicrosoft社のプライバシーに関する声明に基づき管理されます。</> : null}公式LINEへ移動した後は、LINE側の取扱いが適用されます。</> },
  { number: "08", title: "診断コンテンツ（美容師タイプ診断・採用マッチング診断）", body: <>【美容師タイプ診断（当サイトの /type-shindan/）】お名前や連絡先はうかがいません。選んだ回答と診断結果（タイプ、希望職種、働き方、経験、希望エリア、大切にしたいこと等）、およびどのページ・案内から来たかを、個人を特定しない形で記録し、採用のご案内づくりと内容の改善に使います。記録はGoogle社のサービス（Googleフォーム）に保存されます。【採用マッチング診断・見学相談（match.ko-un-ryu-sui.com）】当社が運営する診断・受付のアプリです。アプリの運用と受付内容の保存に、当社が契約している国内のレンタルサーバー「エックスサーバー」、受付の通知に「LINE」のMessaging APIを利用しています。見学・相談のフォームを送信した場合は、お名前、興味のある職種（この2つが必須です。ふりがな・学校名・学年・Instagram ID・相談内容は任意です）、希望する手続き、相談内容、診断コースと回答、受付番号・受付日時を取得し、見学・相談の日程調整、相談への回答、応募の受付と選考に関する連絡に利用します。送信内容は、当社の公式LINEから採用担当者のLINEへ通知されます。適性診断だけを行った場合、回答と結果はお使いのブラウザー内で処理されます。詳しくは、アプリ内の「プライバシーポリシー」（https://match.ko-un-ryu-sui.com/privacy）をご覧ください。</> },
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

        <p className="privacy-updated">事業者：株式会社行雲流水／所在地：大阪府泉大津市東雲町1-20／制定日：2026年10月30日／改定日：2026年11月22日</p>
      </main>

      <footer className="privacy-footer"><span>© KOUNRYUSUI CO., LTD.</span><Link href="/">FLOWCLOUD / glow RECRUITMENT SITE</Link></footer>
    </div>
  );
}
