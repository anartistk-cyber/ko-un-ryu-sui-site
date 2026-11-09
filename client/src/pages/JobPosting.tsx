import { ArrowLeft, ArrowRight, MapPin } from "lucide-react";
import { useEffect, useMemo, type ReactNode } from "react";
import { Link } from "wouter";
import { TBD } from "../components/Pending";
import { trackClick, track } from "../lib/track";

const siteUrl = "https://ko-un-ryu-sui.com";
const companyName = "株式会社 行雲流水";
const logoPath = "/images/company-logo_s210.jpg";

type JobType = "stylist" | "assistant" | "part" | "student";

type Section = { h: string; body: ReactNode; note?: string };
type JobData = {
  code: JobType;
  number: string;
  eyebrow: string;
  title: string;
  h1: string;
  seoTitle: string;
  seoDesc: string;
  lead: string;
  salaryShort: string;
  schedule: string;
  sections: Section[];
  ctaLabel: string;
  extraCtas: [string, string][];
  closing: string;
  detailPath: string;
  employment: string;
  employmentType: string;
  salaryUnit: "MONTH" | "HOUR";
  salaryMin: number;
  jsonDesc: string;
  jsonQualifications: string;
  jsonWorkHours: string;
  related: [string, string][];
  faq?: [string, string][];
};

const locations = [
  { "@type": "Place", address: { "@type": "PostalAddress", streetAddress: "東雲町1-20", addressLocality: "泉大津市", addressRegion: "大阪府", addressCountry: "JP" } },
  { "@type": "Place", address: { "@type": "PostalAddress", streetAddress: "旭町18-3 いずみおおつCITY 1F", addressLocality: "泉大津市", addressRegion: "大阪府", addressCountry: "JP" } },
];

const salonSection = (extra?: ReactNode): Section => ({
  h: "勤務地",
  body: <>
    <p><strong>FLOWCLOUD</strong>：大阪府泉大津市東雲町1-20、南海本線 泉大津駅から徒歩約3分。</p>
    <p><strong>glow</strong>：大阪府泉大津市旭町18-3 いずみおおつCITY 1F、南海本線 泉大津駅から徒歩約1分。</p>
    {extra ?? <p>配属・変更範囲：要相談</p>}
  </>,
});

const jobs: Record<JobType, JobData> = {
  stylist: {
    code: "stylist", number: "01", eyebrow: "HAIRDRESSER / STYLIST", title: "美容師スタイリスト",
    h1: "泉大津の美容師・スタイリスト募集｜FLOWCLOUD・glow",
    seoTitle: "美容師スタイリスト求人・正社員｜泉大津・岸和田・堺から通える｜行雲流水",
    seoDesc: "泉大津の美容室FLOWCLOUD・glowのスタイリスト（美容師）求人。仕事内容、適用等級と給与、勤務時間、休日、応募条件を掲載。岸和田・堺・和泉からも通えます。見学・体験歓迎。",
    lead: "今まで積み重ねた技術や接客を、次の職場で生かしたい方へ。お客様との関わり方、入社後の担当業務、給与と評価の条件をご案内します。転職で変えたいことも、これからも大切にしたいことも、お聞かせください。",
    salaryShort: "月給 290,000円〜（Jrスタイリスト）〜620,000円〜（アーティスト）",
    schedule: "シフト制／完全週休2日制",
    sections: [
      { h: "募集する仕事", body: <p>美容師としての施術・接客を中心に、カウンセリング、カット・カラー・パーマ・シャンプー等の施術、予約管理、スタイル発信、備品管理、店内清掃を担当します。担当する技術や入客の進め方は、評価基準に沿って確認します。</p> },
      { h: "給与・キャリア", body: <>
        <ul>
          <li>Jrスタイリスト：月給290,000円〜</li><li>スタイリスト：月給320,000円〜</li><li>Topスタイリスト：月給390,000円〜</li><li>Greatスタイリスト：月給520,000円〜</li><li>アーティスト：月給620,000円〜</li>
        </ul>
        <p>区分は指名技術売上（税抜）などの評価基準により決まります。固定残業代を含む月給です。コンシェルジュは基本給240,000円＋固定残業代30,000円（15時間分）。スタイリスト以上の区分は固定残業代50,000円（25時間分）を含みます。手当の例：インスタ手当（フォロワー100人ごとに200円）、集客手当（自力新規1人1,500円）など、評価基準により、入社後から支給します。範囲の金額が誰にでも適用されるわけではありません。</p></> },
      { h: "働く時間・休日", body: <><p>勤務は早番8:30〜17:30、遅番11:30〜20:30のシフト制。休憩60分。完全週休2日制です。</p><p>年間休日104日／年末年始休暇4日／年次有給休暇：入社6か月以降、10日〜（合計の年間休日は118日〜）。出勤前の準備・朝礼・片付け・練習の扱い：勤務時間内として扱います</p></> },
      salonSection(),
      { h: "応募条件", body: <p>美容師免許をお持ちで、Jr・スタイリストとして求める技術経験は評価基準によります。免許取得見込み・スタイリスト未経験の方は、<Link href="/jobs/assistant">アシスタント募集</Link>をご確認ください。</p> },
    ],
    ctaLabel: "スタイリストとして応募・相談する",
    extraCtas: [["体験と選考の流れを見る", "/blog/taiken-guide"]],
    closing: "給与の算定や担当業務について、確認してから応募したい方もご相談ください。",
    detailPath: "/jobs/stylist", employment: "正社員", employmentType: "FULL_TIME", salaryUnit: "MONTH", salaryMin: 290000,
    jsonDesc: "<p>株式会社行雲流水が運営するFLOWCLOUD・glowで、美容師スタイリスト（正社員）を募集しています。</p><p>カウンセリング、カット、カラー、パーマ、シャンプー等の施術、予約管理、スタイル発信、備品管理、店内清掃を担当します。</p><p>月給は、Jrスタイリスト290,000円〜、スタイリスト320,000円〜、Topスタイリスト390,000円〜、Greatスタイリスト520,000円〜、アーティスト620,000円〜です。区分は指名技術売上等の条件によります。</p>",
    jsonQualifications: "美容師免許をお持ちの方（スタイリストとしての技術経験が必要です）。",
    jsonWorkHours: "シフト制（早番8:30〜17:30、遅番11:30〜20:30、休憩60分）、完全週休2日制。",
    related: [["教育の進め方を見る", "/blog/one-year-debut-curriculum"], ["早番・遅番の一日", "/blog/hayaban-osoban"], ["給与と手当の見方", "/blog/shoninkyu-teate"], ["働き方（休み・教育・給与の内訳）", "/workstyle"], ["見学・体験の流れ", "/visit"]],
    faq: [
      ["給与はいくらですか？", "月給は、Jrスタイリスト290,000円〜、スタイリスト320,000円〜、Topスタイリスト390,000円〜、Greatスタイリスト520,000円〜、アーティスト620,000円〜です。区分は指名技術売上（税抜）などの評価基準により決まります。固定残業代を含む月給で、範囲の金額が誰にでも適用されるわけではありません。"],
      ["休みはどのくらいありますか？", "完全週休2日制（シフト制）で、年間休日104日、年末年始休暇4日です。年次有給休暇は入社6か月以降に10日〜で、合計の年間休日は118日〜です。"],
      ["勤務時間を教えてください。", "早番8:30〜17:30、遅番11:30〜20:30のシフト制で、休憩は60分です。出勤前の準備・朝礼・片付け・練習は、勤務時間内として扱います。"],
      ["手当はありますか？", "インスタ手当（フォロワー100人ごとに200円）、集客手当（自力新規1人1,500円）などがあり、評価基準により入社後から支給します。範囲の金額が誰にでも適用されるわけではありません。"],
      ["スタイリストの経験がなくても応募できますか？", "美容師免許をお持ちで、Jr・スタイリストとして求める技術経験は評価基準によります。免許取得見込み・スタイリスト未経験の方は、アシスタント募集をご確認ください。"],
      ["選考の流れを教えてください。", "選考は、見学、面接、採用の順です。提出書類は履歴書です。見学・体験の流れは、採用サイトの「見学・体験の流れ」のページでご案内しています。"],
    ],
  },
  assistant: {
    code: "assistant", number: "02", eyebrow: "HAIRDRESSER / ASSISTANT", title: "美容師アシスタント",
    h1: "泉大津の美容師・アシスタント募集｜新卒・中途",
    seoTitle: "美容師アシスタント求人｜新卒・中途｜泉大津・南大阪・泉州｜行雲流水",
    seoDesc: "泉大津の美容室FLOWCLOUD・glowのアシスタント（美容師）求人。仕事と教育の流れ、給与の内訳、勤務条件を掲載。新卒・中途それぞれの応募条件と、見学・体験の案内をご確認ください。",
    lead: "美容師として学びながら、お客様の喜びにつながる仕事を増やしていく。基本となる技術や接客を学び、スタイリストを目指す方の募集です。これまでに身につけた技術がある方は、経験もお聞かせください。",
    salaryShort: "月給 280,000円〜",
    schedule: "シフト制／完全週休2日制",
    sections: [
      { h: "2027年度の新卒募集", body: <p>2027年度の新卒美容師を3名募集しています。対象となる卒業時期・美容師免許の取得条件は、以下の募集要項をご確認ください。対象の卒業時期・入社時期・免許取得の条件は要相談です。</p> },
      { h: "給与", body: <p>月給28万円〜（基本給24万円＋固定残業代3万円・15時間分＋交通費または家賃補助〈一律1万円・要相談〉）。固定残業代の超過分は別途支給します。試用期間はなく、6か月の有期雇用として採用します。各手当：インスタ手当・集客手当・5ゴール手当・9キレイ手当・エンゲージメント手当・オール金賞手当（賞与）。支給条件は評価基準によります。</p> },
      { h: "教育について", body: <p>1年でのスタイリストデビューを目指すカリキュラムをご案内しています。デビュー時期は技術・接客の習得状況によって異なります。学ぶ内容、確認の基準、練習の時間と費用は、<Link href="/blog/one-year-debut-curriculum">教育の解説記事</Link>をご覧ください。</p> },
      { h: "勤務・勤務地", body: <><p>早番8:30〜17:30、遅番11:30〜20:30、休憩60分。完全週休2日制です。勤務地はFLOWCLOUDまたはglow。</p><p>出勤前準備・練習は勤務時間内として扱います。配属：要相談</p><p><strong>FLOWCLOUD</strong>：泉大津市東雲町1-20（泉大津駅から徒歩約3分）／<strong>glow</strong>：泉大津市旭町18-3 いずみおおつCITY 1F（徒歩約1分）</p></> },
      { h: "応募条件と選考", body: <p>卒業・美容師免許取得見込みの条件は要相談です。中途アシスタントの方は経験と担当してきた仕事をお知らせください。体験参加を含む選考の内容は、<Link href="/blog/taiken-guide">体験ガイド</Link>でご案内しています。</p> },
    ],
    ctaLabel: "アシスタントとして応募・相談する",
    extraCtas: [["体験と選考の流れを見る", "/blog/taiken-guide"], ["教育の進め方を見る", "/blog/one-year-debut-curriculum"]],
    closing: "給与の内訳や教育について、確認してから応募したい方もご相談ください。",
    detailPath: "/jobs/assistant", employment: "正社員", employmentType: "FULL_TIME", salaryUnit: "MONTH", salaryMin: 280000,
    jsonDesc: "<p>株式会社行雲流水が運営するFLOWCLOUD・glowで、美容師アシスタント（正社員）を募集しています。</p><p>サロン内施術アシスタント業務全般を担当し、基本となる技術や接客を学びます。月給は280,000円〜（固定残業15時間分と、交通費または家賃補助〈一律10,000円・要相談〉を含み、固定残業代の超過分は別途支給）です。</p>",
    jsonQualifications: "美容師免許（取得見込みの方の条件は募集要項に記載）。",
    jsonWorkHours: "シフト制（早番8:30〜17:30、遅番11:30〜20:30、休憩60分）、完全週休2日制。",
    related: [["新卒案内を見る", "/recruit/newgrad"], ["早番・遅番の一日", "/blog/hayaban-osoban"], ["働き方（休み・教育・給与の内訳）", "/workstyle"], ["見学・体験の流れ", "/visit"]],
    faq: [
      ["新卒は何名募集していますか？", "2027年度の新卒美容師を3名募集しています。対象の卒業時期・入社時期・美容師免許の取得条件は、要相談です。"],
      ["給与はいくらですか？", "月給28万円〜です（基本給24万円＋固定残業代3万円・15時間分＋交通費または家賃補助〈一律1万円・要相談〉）。固定残業代の超過分は別途支給します。"],
      ["交通費や家賃の補助はありますか？", "交通費または家賃補助（一律1万円・要相談）のどちらか一方です。月給28万円に含まれます。"],
      ["試用期間はありますか？", "試用期間はなく、6か月の有期雇用として採用します。"],
      ["スタイリストデビューまでどのくらいかかりますか？", "1年でのスタイリストデビューを目指すカリキュラムをご案内しています。デビュー時期は、技術・接客の習得状況によって異なります。"],
      ["勤務時間と勤務地を教えてください。", "早番8:30〜17:30、遅番11:30〜20:30のシフト制で、休憩60分、完全週休2日制です。勤務地はFLOWCLOUD（泉大津駅から徒歩約3分）またはglow（徒歩約1分）で、配属は要相談です。出勤前の準備・練習は、勤務時間内として扱います。"],
      ["中途でもアシスタントとして応募できますか？", "はい。中途アシスタントの方は、経験と担当してきた仕事をお知らせください。体験参加を含む選考の内容は、体験ガイドでご案内しています。"],
    ],
  },
  part: {
    code: "part", number: "03", eyebrow: "HAIRDRESSER / PART-TIME", title: "パート美容師",
    h1: "泉大津の美容師パート募集｜子育て・復帰を考えている方へ",
    seoTitle: "美容師パート求人｜子育て・復職の相談｜泉大津・岸和田・堺｜行雲流水",
    seoDesc: "泉大津の美容室FLOWCLOUD・glowのパート・アルバイト美容師求人。勤務できる曜日や時間から働き方を選べます。時給、勤務条件、技術確認、応募方法をご案内。ブランクのある方も相談可。",
    lead: "美容師の仕事を、今の暮らしに合う形で続けたい。子育てや家庭の予定に合わせて働きたい。まずは、勤務できる曜日と時間をお知らせください。現在の募集条件と照らして、お話しします。",
    salaryShort: "時給 1,600円〜（Jrスタイリスト）／1,800円〜（スタイリスト）",
    schedule: "シフト制／曜日・時間はご相談",
    sections: [
      { h: "募集する職種と時給", body: <><ul><li>Jrスタイリスト：時給1,600円〜</li><li>スタイリスト：時給1,800円〜</li></ul><p>適用区分と昇給の条件：評価基準によります。歩合・手当：評価基準によります。</p></> },
      { h: "働ける条件を、先に確かめる", body: <p>勤務できる日数・時間帯、土日祝の勤務、扶養内勤務は、ご希望をうかがって要相談です。シフト希望の提出は会社へ、3か月前に行います。急な欠勤時の連絡は各店舗へお願いします。</p> },
      { h: "ブランクのある方へ", body: <p>これまで経験した技術と、不安に感じていることをお聞かせください。担当できる業務と、確認・練習が必要な業務を整理します。復帰時の技術確認と研修の条件は要相談です。</p> },
      { h: "勤務地", body: <><p>FLOWCLOUD（泉大津市東雲町1-20）またはglow（泉大津市旭町18-3 いずみおおつCITY 1F）。</p><p>店舗ごとの募集状況：年度により異なります</p></> },
      { h: "応募条件", body: <p>美容師免許をお持ちの方。ブランクのある方・育児中の方も相談できます。</p> },
    ],
    ctaLabel: "パートの働き方を相談する",
    extraCtas: [["体験と選考の流れを見る", "/blog/taiken-guide"]],
    closing: "曜日や時間によっては、ご希望に沿えない場合もあります。入社後の行き違いを減らすため、条件を一つずつ確かめていきましょう。",
    detailPath: "/jobs/part", employment: "パート", employmentType: "PART_TIME", salaryUnit: "HOUR", salaryMin: 1600,
    jsonDesc: "<p>株式会社行雲流水が運営するFLOWCLOUD・glowで、パートの美容師（Jrスタイリスト・スタイリスト）を募集しています。</p><p>時給は、Jrスタイリスト1,600円〜、スタイリスト1,800円〜です。勤務できる曜日・時間帯はご相談ください。</p>",
    jsonQualifications: "美容師免許をお持ちの方。ブランクのある方・育児中の方も相談できます。",
    jsonWorkHours: "シフト制（曜日・時間帯はご相談ください）。",
    related: [["復職・両立のご相談", "/?c=part#contact"], ["早番・遅番の一日", "/blog/hayaban-osoban"], ["働き方（休み・教育・給与の内訳）", "/workstyle"], ["見学・体験の流れ", "/visit"]],
    faq: [
      ["時給はいくらですか？", "Jrスタイリストは時給1,600円〜、スタイリストは時給1,800円〜です。適用区分と昇給の条件、歩合・手当は、評価基準によります。"],
      ["勤務できる曜日や時間を選べますか？", "勤務できる日数・時間帯、土日祝の勤務は、ご希望をうかがって要相談です。曜日や時間によっては、ご希望に沿えない場合もあります。"],
      ["扶養内で働けますか？", "扶養内勤務は、ご希望をうかがって要相談です。勤務できる日数と時間帯をお知らせください。"],
      ["ブランクがあっても応募できますか？", "美容師免許をお持ちの方で、ブランクのある方・育児中の方も相談できます。これまで経験した技術と、不安に感じていることをお聞かせください。担当できる業務と、確認・練習が必要な業務を整理します。復帰時の技術確認と研修の条件は要相談です。"],
      ["シフト希望はいつ出しますか？", "シフト希望の提出は会社へ、3か月前に行います。急な欠勤時の連絡は、各店舗へお願いします。"],
      ["勤務地はどこですか？", "FLOWCLOUD（泉大津市東雲町1-20）またはglow（泉大津市旭町18-3 いずみおおつCITY 1F）です。店舗ごとの募集状況は、年度により異なります。"],
    ],
  },
  student: {
    code: "student", number: "04", eyebrow: "BEAUTY STUDENT / PART-TIME", title: "美容学生アルバイト",
    h1: "泉大津の高校生・専門学校生アルバイト募集",
    seoTitle: "高校生・美容学生のアルバイト｜時給1,300円〜｜泉大津・大阪｜FLOWCLOUD・glow",
    seoDesc: "泉大津の美容室FLOWCLOUD・glowの高校生・美容学生向けアルバイト。対象は高校1年生〜専門学校2年生、時給1,300円〜、最低月1回から、学校の予定に合わせて相談できます。まずは見学・体験から。",
    lead: "高校1年生〜専門学校2年生が対象です。学校で学ぶ美容と、実際のサロンの仕事をつなげてみませんか。お客様への声のかけ方、道具の準備、キャスト同士の連携。働く現場を知りながら、卒業後の進路も考えられます。最低勤務は月に1回、学校の予定に合わせて相談できます。",
    salaryShort: "時給 1,300円〜",
    schedule: "学校の予定に合わせて相談",
    sections: [
      { h: "給与と勤務条件", body: <p>時給1,300円〜。勤務日数・1日の時間・勤務できる時間帯は、要相談です。学校の授業や試験の予定も、事前にご相談ください。</p> },
      { h: "担当する仕事", body: <p>店内の清掃・準備などの補助業務（詳しい範囲は評価基準によります）を担当します。資格の有無に応じて業務範囲を確認し、美容師免許が必要な施術を無資格の方へ任せません。</p> },
      { h: "応募できる方", body: <p>対象：高校1年生〜専門学校2年生。勤務地はFLOWCLOUD・glowです。最低勤務条件は月に1回です。交通費：通勤圏外の方のみ、上限10,000円まで支給します。研修期間の条件：要相談</p> },
      { h: "就職先を考えている方へ", body: <p>アルバイトへの応募と新卒採用の選考上の関係は要相談です。卒業後の教育や給与については、<Link href="/recruit/newgrad">新卒採用ページ</Link>をご覧ください。</p> },
    ],
    ctaLabel: "学生アルバイトに応募・相談する",
    extraCtas: [["2027年度の新卒募集を見る", "/recruit/newgrad"], ["学生アルバイトの詳しい働き方を見る", "/blog/student-baito"]],
    closing: "勤務できる曜日と時間、サロンで知りたいことをお聞かせください。",
    detailPath: "/jobs/student", employment: "アルバイト", employmentType: "PART_TIME", salaryUnit: "HOUR", salaryMin: 1300,
    jsonDesc: "<p>株式会社行雲流水が運営するFLOWCLOUD・glowで、美容師を目指す学生アルバイトを募集しています。</p><p>店内の清掃・準備などの補助業務を担当します。時給は1,300円〜です。</p>",
    jsonQualifications: "美容系を目指す学生の方（対象課程・学年は募集要項に記載）。美容師免許は不要です。",
    jsonWorkHours: "学校の予定に合わせて相談できます。",
    related: [["高校生の進路の進め方（4つのこと）", "/blog/koukousei-biyoushi-susumikata"], ["新卒案内を見る", "/recruit/newgrad"], ["働き方（休み・教育・給与の内訳）", "/workstyle"], ["見学・体験の流れ", "/visit"]],
    faq: [
      ["高校生でも応募できますか？", "はい。対象は高校1年生〜専門学校2年生です。通信課程など、該当するか分からない場合は、お問い合わせください。"],
      ["美容師免許がなくても大丈夫ですか？", "はい。美容師免許は不要です。店内の清掃・準備などの補助業務を担当します。美容師免許が必要な施術を、無資格の方へ任せることはありません。"],
      ["週に何日くらい働けますか？", "最低の勤務条件は月に1回です。勤務日数・1日の時間・時間帯は要相談で、学校の授業や試験の予定も事前にご相談ください。"],
      ["時給はいくらですか？", "時給1,300円〜です。"],
      ["交通費は出ますか？", "通勤圏外の方のみ、上限10,000円まで支給します。"],
      ["まず見学や話を聞くだけでもできますか？", "はい。応募前のご相談や、見学・体験からでも大丈夫です。勤務できる曜日・時間と、サロンで知りたいことをお聞かせください。"],
    ],
  },
};

function updateHeadMeta(selector: string, content: string) {
  document.querySelector<HTMLMetaElement>(selector)?.setAttribute("content", content);
}

export default function JobPosting({ type }: { type: JobType }) {
  const job = jobs[type];
  const jobUrl = `${siteUrl}${job.detailPath}`;

  const structuredData = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "JobPosting",
      title: job.title,
      description: job.jsonDesc,
      identifier: { "@type": "PropertyValue", name: companyName, value: `kounryusui-${job.code}` },
      datePosted: "2026-10-29",
      directApply: true,
      employmentType: job.employmentType,
      hiringOrganization: { "@type": "Organization", name: companyName, sameAs: siteUrl },
      jobLocation: locations,
      // 「〜」は上限ではないため、下限(minValue)のみを示す。上限は推測しない。
      baseSalary: { "@type": "MonetaryAmount", currency: "JPY", value: { "@type": "QuantitativeValue", minValue: job.salaryMin, unitText: job.salaryUnit } },
      qualifications: job.jsonQualifications,
      workHours: job.jsonWorkHours,
      url: jobUrl,
    }),
    [job, jobUrl],
  );

  const faqData = useMemo(
    () => job.faq && ({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: job.faq.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
    }),
    [job],
  );

  useEffect(() => {
    document.title = job.seoTitle;
    updateHeadMeta('meta[name="description"]', job.seoDesc);
    updateHeadMeta('meta[property="og:title"]', job.seoTitle);
    updateHeadMeta('meta[property="og:url"]', jobUrl);
    updateHeadMeta('meta[property="og:description"]', job.seoDesc);
    document.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.setAttribute("href", jobUrl);
    window.scrollTo(0, 0);
    track("view_job", { job_id: job.code, employment_type: job.employmentType });
  }, [job, jobUrl]);

  const cta = `/?c=${job.code}#contact`;
  return (
    <div className="job-detail-page" data-pg={`jobs-${type}`} onClick={trackClick}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      {faqData && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqData) }} />}

      <header className="job-detail-header">
        <Link href="/" className="privacy-brand" aria-label="行雲流水 採用サイト トップへ">
          <img src={logoPath} alt="株式会社 行雲流水 ko-un-ryu-sui ロゴ" />
          <span />
          <small>RECRUITMENT</small>
        </Link>
        <Link href="/#jobs" className="privacy-back">募集職種へ戻る <ArrowLeft size={15} aria-hidden="true" /></Link>
      </header>

      <main className="job-detail-main">
        <section className="job-detail-hero">
          <p>{job.eyebrow}</p>
          <span>{job.number}</span>
          <h1>{job.h1}</h1>
          <p className="job-detail-lead">{job.lead}</p>
          <div className="job-detail-hero-data"><strong>{job.salaryShort}</strong><span>{job.schedule}</span></div>
          <a className="job-detail-cta" href={cta} data-track="apply" data-placement="hero" data-job={job.code}>{job.ctaLabel} <ArrowRight size={17} aria-hidden="true" /></a>
        </section>

        {job.sections.map(s => (
          <section className="job-detail-section" key={s.h}>
            <div className="job-detail-section-heading"><h2>{s.h}</h2></div>
            <div className="job-detail-copy">{s.body}</div>
          </section>
        ))}

        {job.faq && (
          <section className="job-detail-section">
            <div className="job-detail-section-heading"><p>FAQ</p><h2>よくあるご質問</h2></div>
            <div className="job-detail-copy">
              {job.faq.map(([q, a]) => <div className="job-faq-item" key={q}><p><strong>{q}</strong></p><p>{a}</p></div>)}
            </div>
          </section>
        )}

        <section className="job-detail-section">
          <div className="job-detail-section-heading"><p>CONDITIONS</p><h2>募集条件(労働条件表)</h2></div>
          <div className="job-detail-copy">
            <table className="cond-table"><tbody>
              <tr><th>募集者</th><td>株式会社行雲流水／法人所在地：大阪府泉大津市東雲町1-20／採用窓口：info@ko-un-ryu-sui.com</td></tr>
              <tr><th>職種・雇用形態</th><td>{job.title}／{job.employment}</td></tr>
              <tr><th>仕事内容の変更範囲</th><td>要相談</td></tr>
              <tr><th>契約・試用期間</th><td>{job.code === "stylist" || job.code === "assistant" ? <>契約期間：6か月の有期雇用／試用期間：なし</> : <>契約期間・試用期間：要相談</>}</td></tr>
              <tr><th>時間外労働</th><td>法令に従って取り扱います（準備・練習は勤務時間内）</td></tr>
              <tr><th>休日・休暇</th><td>年間休日104日／年末年始休暇4日（12/31・1/1〜1/3）／年次有給休暇：入社6か月以降、10日〜（合計の年間休日は118日〜）</td></tr>
              <tr><th>保険・職場環境</th><td>加入保険：健康保険（介護保険を含む）、厚生年金保険、雇用保険、労災保険。加入は法令の定めに従います／受動喫煙対策：基本的に禁煙（喫煙は屋外で行います）</td></tr>
              <tr><th>募集・選考</th><td>求人ID：{job.code}／募集人数・状態：年度により異なります／選考の流れ：見学→面接→採用／提出書類：履歴書／体験参加要件：要相談</td></tr>
              <tr><th>確認日</th><td>年度により異なります</td></tr>
            </tbody></table>
            <p>記載条件について確認したいことがあれば、採用窓口へお問い合わせください。</p>
          </div>
        </section>

        <section className="job-detail-apply">
          <div><p>LET'S TALK</p><h2>{job.closing}</h2></div>
          <div>
            <a className="job-detail-cta" href={cta} data-track="apply" data-placement="body" data-job={job.code}>{job.ctaLabel} <ArrowRight size={17} aria-hidden="true" /></a>
            {job.extraCtas.map(([l, h]) => <Link key={h} className="job-detail-line" href={h}>{l}</Link>)}
          </div>
        </section>
      </main>

      <section className="job-more" aria-label="関連ページ">
        <p>RELATED</p>
        <h2>あわせてご覧ください</h2>
        <div>
          {job.related.map(([l, h]) => h.includes("?") ? <a key={h} href={h}>{l}</a> : <Link key={h} href={h}>{l}</Link>)}
          {(Object.keys(jobs) as JobType[]).filter(k => k !== job.code).map(k => <Link key={k} href={jobs[k].detailPath}>{jobs[k].title}<small>{jobs[k].employment}</small></Link>)}
        </div>
      </section>

      <footer className="privacy-footer"><span>© KOUNRYUSUI CO., LTD.</span><span className="sub-official"><a href="https://www.flowcloud.net/" target="_blank" rel="noreferrer">FLOWCLOUD公式サイト</a><a href="https://glow-izumiotsu.jp/" target="_blank" rel="noreferrer">glow公式サイト</a><Link href="/">採用トップ</Link></span></footer>
    </div>
  );
}
