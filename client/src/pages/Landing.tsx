import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "wouter";
import { SubPage, LINE_URL } from "../components/SubPage";
import { TBD } from "../components/Pending";
import { trackClick } from "../lib/track";

type Sec = { h: string; body: ReactNode };
type L = { path: string; code: string; eyebrow: string; h1: string; seoTitle: string; desc: string; lead: string; sections: Sec[]; jobs: [string, string][]; primary: string; secondary: [string, string]; audience: string };

const pages: Record<"newgrad" | "career", L> = {
  newgrad: {
    path: "/recruit/newgrad", code: "newgrad", audience: "new_graduate", eyebrow: "FOR NEW GRADUATES",
    h1: "美容師としての一歩目に、学ぶ道筋を。",
    seoTitle: "2027年度 新卒美容師採用｜美容学生・専門学校生へ｜泉大津｜FLOWCLOUD・glow",
    desc: "新卒美容師3名募集。教育の流れ、給与の内訳、勤務条件、免許取得見込みの応募条件をご紹介。見学・体験もご相談いただけます。",
    lead: "できることが増える喜びを、お客様の喜びにつなげていく。入社後の仕事、練習、技術の確認方法を知って、最初の職場を選んでください。FLOWCLOUD・glowでは、2027年度の新卒美容師を3名募集しています。",
    sections: [
      { h: "2027年度の募集について", body: <>
        <p>勤務地は大阪・泉大津のFLOWCLOUDまたはglow。美容師免許の取得見込みの方も応募を受け付けています。対象となる卒業時期、入社時の免許取得条件、応募受付期間は、募集要項をご確認ください。</p>
        <p>対象卒業時期：要相談／入社時期：要相談／採用職種・配属決定方法：要相談／応募受付期間：要相談</p></> },
      { h: "1年でのデビューを目指す、その中身。", body: <>
        <p>1年目は、受付や電話対応などのサロンワーク、毛髪理論、ケア、カラー、アイロン、パーマ、スタイリング、カウンセリング、カットの理論と実技を学びます。2年目はJrスタイリストとして、ウィッグでのデザインカット60スタイルと、新規モニター90名のカリキュラムへ進みます。</p>
        <p>月25時間（1年目）・月20時間（2年目）のレッスン枠やコタアカデミーを組み合わせ、先輩が学びを支えます。1年は目標であり、全員が同じ時期にデビューする保証ではありません。技術と接客の習得状況を確認し、担当できる業務を決めます。</p>
        <p>デビューの定義・確認の基準：要相談／レッスンの勤務時間としての扱い：勤務時間内</p>
        <p><Link href="/blog/one-year-debut-curriculum">学ぶ内容と確認の基準を見る</Link></p></> },
      { h: "最初の給与と、毎日の働き方。", body: <>
        <p>初任給は月給28万円を案内しています。月給の内訳は基本給24万円＋固定残業代3万円（15時間分）＋交通費または家賃補助（一律1万円・要相談）で、固定残業代の超過分は別途支給します。試用期間はなく、6か月の有期雇用として採用します。</p>
        <p>完全週休2日のシフト制。年間休日は104日、年末年始休暇4日、年次有給休暇は入社6か月以降に10日〜（合計の年間休日は118日〜）です。準備や片付けの扱いは、アシスタントの募集要項でご案内します。<Link href="/jobs/assistant">アシスタントの募集条件を見る</Link></p></> },
      { h: "練習の時間も、費用も、入社前に。", body: <p>いつ練習するのか。誰に質問できるのか。ウィッグや道具、モデル、講習に費用がかかるのか。入社してから戸惑わないよう、教育の進め方と費用の負担をご確認ください。奨学金返済サポートはあります。対象・金額・期間は要相談です。</p> },
      { h: "見学・体験から、選考へ。", body: <>
        <p>フォームまたはLINEで相談 → 見学・体験の日程調整 → 対象となる体験への参加 → 説明会・採用試験 → 条件の確認 → 内定・入社のご案内。</p>
        <p>体験の種類、費用、選考参加に必要な体験は、<Link href="/blog/taiken-guide">体験ガイド</Link>をご確認ください。ご希望の日程が合わない場合は、その他の日程を相談できます（要相談）。選考は「見学→面接→採用」の流れです。提出書類は履歴書です。所要期間：要相談</p></> },
    ],
    jobs: [["美容師アシスタント（正社員）", "/jobs/assistant"], ["美容師スタイリスト（正社員）", "/jobs/stylist"], ["美容学生アルバイト", "/jobs/student"], ["美容学校の学生の方へ", "/school"], ["勤務エリア（泉大津・南大阪・泉州）", "/area"]],
    primary: "新卒として応募・相談する", secondary: ["体験と選考の流れを見る", "/blog/taiken-guide"],
  },
  career: {
    path: "/recruit/career", code: "career", audience: "stylist", eyebrow: "FOR EXPERIENCED STYLISTS",
    h1: "これまでの経験を、これからの働き方へ。",
    seoTitle: "美容師の転職・中途スタイリスト採用｜泉大津・岸和田・堺から｜FLOWCLOUD・glow",
    desc: "仕事を探している美容師の方へ。経験を生かす次の職場として、担当業務、給与と評価、勤務条件を確かめてから応募できます。泉大津・岸和田・高石・和泉・堺など南大阪・泉州から通う方もご相談ください。",
    lead: "得意な技術をもっと生かしたい。お客様との向き合い方を大切にしたい。収入も、働く時間も、納得して選びたい。転職で変えたいことと、続けたいこと。その両方をお聞かせください。",
    sections: [
      { h: "次の職場で、どんな仕事をするか。", body: <>
        <p>カウンセリング、カット、カラー、パーマ、シャンプーなどの施術から、予約管理、スタイル発信、備品管理、店内の清掃まで。担当業務の範囲と、お客様を担当していく進め方を確認します。</p>
        <p>FLOWCLOUDでは髪と頭皮のケア、glowでは似合わせや扱いやすさを大切にした提案をご紹介しています。ご自身の得意分野と、今後学びたいことをお知らせください。</p>
        <p>新規・フリーのお客様の担当方法：要相談／入社後の技術確認と入客の進め方：要相談／既存のお客様の引継ぎ・予約枠・薬剤の裁量：要相談／個人集客と会社の支援の分担：要相談。実績のない入客数や売上は保証しません。</p></> },
      { h: "給与は、金額と評価条件を一緒に。", body: <>
        <table className="cond-table"><thead><tr><th>等級</th><th>月給</th><th>指名技術売上基準</th></tr></thead><tbody>
          <tr><td>Jrスタイリスト</td><td>29万円〜</td><td>16万円〜</td></tr>
          <tr><td>スタイリスト</td><td>32万円〜</td><td>71万円〜</td></tr>
          <tr><td>Topスタイリスト</td><td>39万円〜</td><td>111万円〜</td></tr>
          <tr><td>Greatスタイリスト</td><td>52万円〜</td><td>151万円〜</td></tr>
          <tr><td>アーティスト</td><td>62万円〜</td><td>191万円〜</td></tr></tbody></table>
        <p>入社時の等級：要相談／評価の対象期間：評価制度によります／昇格・降格の条件：評価制度によります／月給に含まれる固定残業代：スタイリスト以上は50,000円（25時間分）／指名技術売上は税抜で集計します（判定方法：要相談）。手当と賞与はそれぞれの支給条件によります。<Link href="/jobs/stylist">スタイリストの募集条件を見る</Link></p></> },
      { h: "新しい職場に慣れるために。", body: <p>使用する薬剤、予約管理、接客の進め方など、職場が変わると確認したいことも増えます。入社後に確認する業務と担当者は評価基準によります。経験と習得状況を確認しながら担当範囲を決めます。</p> },
      { h: "在職中の方へ。", body: <p>入社を希望する時期と、連絡しやすい時間帯をお知らせください。まだ転職を決めていない段階で、確認したい条件がある方もご相談ください。勤務中の電話を避けたい場合は、希望する連絡方法をご指定いただけます。</p> },
      { h: "働く時間から考える方へ。", body: <p>パートや復職を検討している方は、現在の勤務日数・時間帯の条件もご確認ください。<Link href="/jobs/part">パートの募集を見る</Link></p> },
    ],
    jobs: [["美容師スタイリスト（正社員）", "/jobs/stylist"], ["パート美容師", "/jobs/part"], ["勤務エリア（泉大津・南大阪・泉州）", "/area"]],
    primary: "中途スタイリストとして応募・相談する", secondary: ["体験と選考の流れを見る", "/blog/taiken-guide"],
  },
};

export function Landing({ type }: { type: "newgrad" | "career" }) {
  const d = pages[type];
  return (
    <SubPage title={d.seoTitle} description={d.desc} path={d.path}>
      <main className="job-detail-main" onClick={trackClick}>
        <section className="job-detail-hero">
          <p>{d.eyebrow}</p>
          <h1>{d.h1}</h1>
          <p className="job-detail-lead">{d.lead}</p>
          <div className="lp-actions">
            <a className="job-detail-cta" href={`/?c=${d.code}#contact`} data-track="consult" data-placement="hero" data-audience={d.audience}>{d.primary} <ArrowRight size={17} aria-hidden="true" /></a>
            <a className="job-detail-line" href={LINE_URL} target="_blank" rel="noreferrer" data-track="line" data-placement="hero" data-audience={d.audience}>LINEで採用の質問をする</a>
          </div>
        </section>
        {d.sections.map(s => (
          <section className="job-detail-section" key={s.h}>
            <div className="job-detail-section-heading"><h2>{s.h}</h2></div>
            <div className="job-detail-copy">{s.body}</div>
          </section>
        ))}
        <section className="job-detail-section">
          <div className="job-detail-section-heading"><p>POSITIONS</p><h2>募集職種</h2></div>
          <ul className="job-detail-list">{d.jobs.map(([t, h]) => <li key={h}><Link href={h}>{t}</Link></li>)}</ul>
        </section>
        <section className="blog-cta">
          <h2>気になったら、まずご相談ください。</h2>
          <p>体験の内容、費用、選考との関係は、お申し込み前にご案内します。</p>
          <div>
            <a className="job-detail-cta" href={`/?c=${d.code}#contact`} data-track="apply" data-placement="footer" data-audience={d.audience}>{d.primary} <ArrowRight size={17} aria-hidden="true" /></a>
            <Link className="job-detail-line" href={d.secondary[1]}>{d.secondary[0]}</Link>
          </div>
        </section>
      </main>
    </SubPage>
  );
}
