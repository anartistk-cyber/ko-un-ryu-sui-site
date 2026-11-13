import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "wouter";
import { SubPage, LINE_URL, SITE } from "../components/SubPage";
import { trackClick } from "../lib/track";

type Sec = { h: string; body: ReactNode };
type G = {
  path: string; code: string; audience: string; eyebrow: string; h1: string; seoTitle: string; desc: string; lead: string;
  chips: string[]; chipsLabel: string; sections: Sec[]; faq: [string, string][]; related: [string, string][]; primary: string;
};

const SALON = "FLOWCLOUD（泉大津駅から徒歩約3分）とglow（泉大津駅東口から徒歩約1分）";

const pages: Record<"recruit" | "area" | "school" | "student" | "workstyle" | "visit", G> = {
  recruit: {
    path: "/recruit/", code: "visit", audience: "recruit", eyebrow: "RECRUIT / FLOWCLOUD・glow",
    h1: "泉大津の美容室で、美容師として働く。",
    seoTitle: "美容師の募集職種｜新卒・中途・パート・美容学生｜泉大津｜FLOWCLOUD・glow",
    desc: "大阪府泉大津市のFLOWCLOUDとglowの採用情報。2027年度の新卒美容師、アシスタント、スタイリスト、中途、パート、美容学生アルバイトの募集と、見学・体験の相談をご案内します。",
    lead: "株式会社行雲流水が運営する、泉大津市の美容室FLOWCLOUDとglowの採用ページです。あなたの状況に合わせて、募集職種と、見学・体験の入口をご案内します。",
    chipsLabel: "こんな方からのご相談をお待ちしています",
    chips: ["美容学生", "新卒", "中途", "子育て・復職", "アシスタント", "スタイリスト", "学生アルバイト"],
    sections: [
      { h: "募集している職種。", body: <>
        <p>美容師免許（取得見込みを含む）をお持ちの、美容学生・新卒・中途・パート（子育て・復職）の方を募集しています。美容学生アルバイトの募集もあります。</p>
        <ul className="job-detail-list">
          <li><Link href="/recruit/newgrad">2027年度 新卒美容師採用（3名募集）</Link></li>
          <li><Link href="/jobs/assistant">美容師アシスタント（正社員）</Link></li>
          <li><Link href="/jobs/stylist">美容師スタイリスト（正社員）</Link></li>
          <li><Link href="/recruit/career">中途スタイリスト採用</Link></li>
          <li><Link href="/jobs/part">パート美容師（子育て・復職の相談）</Link></li>
          <li><Link href="/jobs/student">美容学生アルバイト</Link></li>
        </ul></> },
      { h: "あなたの状況から選ぶ。", body: <>
        <ul className="job-detail-list">
          <li><Link href="/school">美容学校に通っている方へ</Link></li>
          <li><Link href="/recruit/student">高校生・美容学生の方へ</Link></li>
          <li><Link href="/recruit/career">中途・転職をお考えの方へ</Link></li>
          <li><Link href="/area">泉大津・南大阪・泉州から通いたい方へ（勤務エリア）</Link></li>
          <li><Link href="/workstyle">休み・教育・給与の内訳を知りたい方へ（働き方）</Link></li>
          <li><Link href="/match">12問の採用マッチング診断で、見学で聞いてみたいことを見つけたい方へ</Link></li>
        </ul></> },
      { h: "まずは、見学・相談から。", body: <p>応募を決めていなくても、サロンを見て、働き方を聞いてみてください。見学・体験の内容、費用、選考との関係は、お申し込み前にご案内します。公式LINEなら、住んでいる地域や希望の働き方を送るだけで始められます。<Link href="/visit">見学・体験の流れを見る</Link></p> },
    ],
    faq: [
      ["どこで勤務しますか。", "泉大津市のFLOWCLOUD（泉大津駅から徒歩約3分）とglow（東口から徒歩約1分）です。"],
      ["選考の流れを教えてください。", "見学（会社説明会）→ 面接 → 採用の流れで、提出書類は履歴書です。"],
      ["勤務時間は何時から何時までですか。", "シフト制で、早番は8:30〜17:30、遅番は11:30〜20:30（休憩60分）です。"],
    ],
    related: [["勤務エリア（泉大津・南大阪・泉州）", "/area"], ["働き方（休み・教育・給与の内訳）", "/workstyle"], ["見学・体験の流れ", "/visit"], ["よくある質問", "/faq"]],
    primary: "サロン見学を相談する",
  },
  area: {
    path: "/area", code: "visit", audience: "area", eyebrow: "WORK AREA / IZUMIOTSU",
    h1: "泉大津・南大阪・泉州で、美容師として働く。",
    seoTitle: "泉大津・岸和田・堺・和泉の美容師求人｜南大阪・泉州｜FLOWCLOUD・glow",
    desc: "大阪府泉大津市のFLOWCLOUDとglowの美容師採用。岸和田・高石・和泉・堺・泉佐野・貝塚など南大阪・泉州から通いたい方へ、勤務地、通勤の相談、募集職種、見学の流れをご案内します。",
    lead: "勤務地は、南海本線・泉大津駅のそばにある2つのサロンです。泉大津はもちろん、岸和田・高石・和泉・堺・泉佐野・貝塚など南大阪・泉州エリアから通う方も、通勤方法や勤務日数の希望を伺いながら一緒に考えます。",
    chipsLabel: "こんなエリアの方からのご相談をお待ちしています",
    chips: ["泉大津", "岸和田", "高石", "和泉", "和泉府中", "和泉中央", "春木", "羽衣", "堺", "泉佐野", "貝塚", "南大阪", "泉州", "大阪"],
    sections: [
      { h: "勤務地は、泉大津の2サロン。", body: <>
        <p>{SALON}が勤務地です。どちらも大阪府泉大津市にあり、南海本線・泉大津駅から歩いて通えます。配属・仕事内容の変更の範囲は要相談です。</p>
        <p>FLOWCLOUD：大阪府泉大津市東雲町1-20／glow：大阪府泉大津市旭町18-3 いずみおおつCITY 1F。地図は<a href="/#access">アクセス</a>からご確認いただけます。</p></> },
      { h: "岸和田・高石・堺・泉佐野・貝塚など、南海本線沿線から。", body: <>
        <p>春木・岸和田・貝塚・泉佐野方面、羽衣・高石・堺方面など、南海本線沿線にお住まいの方は、泉大津駅まで電車で通う働き方を検討できます。通勤にかかる時間や、早番（8:30〜17:30）・遅番（11:30〜20:30）との相性は、お住まいを伺いながら確認します。</p>
        <p>交通費または家賃補助は、一律1万円（要相談）です。</p></> },
      { h: "和泉・和泉府中・和泉中央・南大阪・泉州から。", body: <p>和泉市や、和泉府中・和泉中央方面、堺以南の泉州エリアにお住まいの方も、ご相談ください。通勤の手段や所要時間は人によって異なるため、見学の日程調整のときに、ご希望の出勤時間や勤務日数とあわせて確認します。引っ越しを考えている方は、家賃補助の条件もご案内します（要相談）。</p> },
      { h: "どんな方を募集していますか。", body: <>
        <p>美容師免許（取得見込みを含む）をお持ちの、美容学生・新卒・中途・パート（子育て・復職）の方です。美容学生アルバイトの募集もあります。</p>
        <ul className="job-detail-list">
          <li><Link href="/recruit/newgrad">2027年度 新卒美容師採用（3名募集）</Link></li>
          <li><Link href="/jobs/assistant">美容師アシスタント（正社員）</Link></li>
          <li><Link href="/jobs/stylist">美容師スタイリスト（正社員）</Link></li>
          <li><Link href="/recruit/career">中途スタイリスト採用</Link></li>
          <li><Link href="/jobs/part">パート美容師（子育て・復職の相談）</Link></li>
          <li><Link href="/jobs/student">美容学生アルバイト</Link></li>
        </ul></> },
      { h: "まずは、見学・相談から。", body: <p>応募を決めていなくても、サロンを見て、働き方を聞いてみてください。見学・体験の内容、費用、選考との関係は、お申し込み前にご案内します。公式LINEなら、住んでいる地域や希望の働き方を送るだけで始められます。<Link href="/blog/taiken-guide">体験ガイドを見る</Link></p> },
    ],
    faq: [
      ["泉大津以外の地域（岸和田・堺・和泉など）から通えますか。", "勤務地は泉大津市のFLOWCLOUDとglowです。岸和田・高石・和泉・堺・泉佐野・貝塚など南大阪・泉州エリアから通う方も、お住まいと通勤手段を伺いながら一緒に確認します。"],
      ["最寄り駅はどこですか。", "どちらのサロンも南海本線・泉大津駅が最寄りです。FLOWCLOUDは徒歩約3分、glowは東口から徒歩約1分です。"],
      ["交通費は出ますか。", "交通費または家賃補助（どちらか一方・併給なし）として、一律1万円を支給します（要相談）。"],
      ["勤務時間は何時から何時までですか。", "シフト制で、早番は8:30〜17:30、遅番は11:30〜20:30（休憩60分）です。"],
    ],
    related: [["美容学校の学生の方へ", "/school"], ["高校生・美容学生の方へ", "/recruit/student"], ["中途・転職をお考えの方へ", "/recruit/career"]],
    primary: "見学・相談を申し込む",
  },
  school: {
    path: "/school", code: "student", audience: "student", eyebrow: "FOR BEAUTY SCHOOL STUDENTS",
    h1: "美容学校に通う、あなたの就職先選びに。",
    seoTitle: "美容専門学校の学生へ｜新卒美容師採用・見学｜泉大津｜FLOWCLOUD・glow",
    desc: "高津美容専門学校、関西美容専門学校、ヴェールルージュ美容専門学校、ルトーア美容専門学校、小出美容専門学校、西日本ヘアメイクカレッジ、ベルエベル美容専門学校、バンタンなど、美容学生の就職先選びに。新卒美容師の募集条件と見学・体験をご案内します。",
    lead: "どの学校に通っていても、サロン選びで確かめたいことは同じです。入社後の教育、1日の流れ、給与の内訳、先輩の雰囲気。FLOWCLOUDとglowでは、2027年度の新卒美容師を3名募集し、見学・体験の相談も受け付けています。",
    chipsLabel: "こんな学校に通っている方からのご相談をお待ちしています",
    chips: ["高津美容専門学校", "関西美容専門学校", "ヴェールルージュ美容専門学校", "ルトーア美容専門学校", "小出美容専門学校", "西日本ヘアメイクカレッジ", "ベルエベル美容専門学校", "バンタン", "その他の美容学校・通信課程"],
    sections: [
      { h: "学校名は問いません。まずは話を聞いてください。", body: <p>上に挙げた学校をはじめ、どの美容学校・課程の方でも、見学や相談を受け付けています。通信課程など、対象に当てはまるか分からない場合も、まずはお問い合わせください。卒業時期、入社時期、免許取得見込みの条件は要相談です。</p> },
      { h: "新卒で入社したら、何を学ぶのか。", body: <>
        <p>1年目は、受付や電話対応などのサロンワーク、毛髪理論、ケア、カラー、アイロン、パーマ、スタイリング、カウンセリング、カットの理論と実技を学びます。2年目はJrスタイリストとして、ウィッグでのデザインカット60スタイルと、新規モニター80名のカリキュラムへ進みます。</p>
        <p>1年でのデビューは目標であり、全員が同じ時期になる保証ではありません。技術と接客の習得状況を確認して、担当できる業務を決めます。<Link href="/blog/one-year-debut-curriculum">学ぶ内容と確認の基準を見る</Link></p></> },
      { h: "初任給と働き方。", body: <p>新卒の月給は28万円です（基本給24万円＋固定残業代3万円〈15時間分〉＋交通費または家賃補助1万円。固定残業代の超過分は別途支給）。完全週休2日制（シフト制）、年間休日104日、年末年始休暇4日、年次有給休暇は入社6か月以降に10日〜です。くわしくは<Link href="/recruit/newgrad">新卒採用ページ</Link>と<Link href="/jobs/assistant">アシスタントの募集要項</Link>をご覧ください。</p> },
      { h: "就職活動の進め方。", body: <>
        <p>フォームまたはLINEで相談 → 見学・体験の日程調整 → 説明会・採用試験 → 条件の確認 → 内定・入社のご案内、という流れです。選考は「見学→面接→採用」で、提出書類は履歴書です。説明会・採用試験は体験会に参加された方が対象です。</p>
        <p>体験は、キャスト体験（1時間からOK）、レッスン体験、お客様として受けるゲスト体験から選べます。<Link href="/blog/taiken-guide">体験ガイドを見る</Link></p></> },
      { h: "学生アルバイトもあります。", body: <p>在学中に現場を知りたい方向けに、美容学生アルバイトの募集もあります。対象は高校1年生〜専門学校2年生、勤務先はFLOWCLOUD・glow、勤務は月1回から相談できます。<Link href="/jobs/student">学生アルバイトの条件を見る</Link></p> },
    ],
    faq: [
      ["美容専門学校の学生ですが、何年生から見学できますか。", "対象は要相談です。通信課程など該当するか分からない場合は、採用窓口へお問い合わせください。"],
      ["新卒の応募には美容師免許が必要ですか。", "取得見込みの方も応募を受け付けています。対象の卒業時期と、入社時に必要な取得条件は要相談です。"],
      ["2027年度の新卒の募集人数は。", "2027年度は新卒美容師を3名募集しています。年度・人数・募集状態は年度により異なります。"],
      ["学校名を書かないと相談できませんか。", "学校名は任意です。後日の確認でもかまいません。"],
    ],
    related: [["新卒採用ページ", "/recruit/newgrad"], ["高校生・美容学生の方へ", "/recruit/student"], ["勤務エリア（泉大津・南大阪・泉州）", "/area"], ["働き方（休み・教育・給与の内訳）", "/workstyle"], ["見学・体験の流れ", "/visit"]],
    primary: "学生として見学・相談する",
  },
  student: {
    path: "/recruit/student", code: "student", audience: "student", eyebrow: "FOR HIGH SCHOOL & BEAUTY STUDENTS",
    h1: "美容師を目指す高校生・美容学生の方へ。",
    seoTitle: "美容師を目指す高校生・美容学生へ｜アルバイト・見学｜泉大津｜FLOWCLOUD・glow",
    desc: "美容師になりたい高校生、美容専門学校の学生へ。泉大津のFLOWCLOUD・glowで、働く現場を知る学生アルバイト、サロン見学・体験、新卒採用の相談を受け付けています。",
    lead: "美容師になりたい気持ちはあるけれど、サロンの仕事がどんなものかはまだ分からない。そんな高校生や美容学生に、現場を見て、先輩の話を聞いてもらう機会をつくっています。",
    chipsLabel: "こんな方に",
    chips: ["美容師になりたい高校生", "美容師を目指している高校生", "美容専門学生", "美容学生", "サロンの仕事を知りたい", "就職先を探している"],
    sections: [
      { h: "高校生から、美容の仕事を知る。", body: <p>美容学生アルバイトの対象は、高校1年生から専門学校2年生までです。勤務先はFLOWCLOUDとglow、勤務は月1回から相談できます。<Link href="/jobs/student">学生アルバイトの募集条件を見る</Link>　進路を決める前にできることは、<Link href="/blog/koukousei-biyoushi-susumikata">美容師を目指す高校生へ。進路を決める前にできる4つのこと</Link>にまとめました。</p> },
      { h: "見学・体験で、サロンの空気を確かめる。", body: <>
        <p>体験は3種類から選べます。キャスト体験は8:30〜17:30の間で1時間から。レッスン体験は19:20〜20:20です。お客様として受けるゲスト体験（ヘッドスパ＋ブロー 7,700円、カラー＋ブロー 7,700円〜）もあります。</p>
        <p>体験の内容、費用、選考との関係は、お申し込み前にご案内します。<Link href="/blog/taiken-guide">体験ガイドを見る</Link></p></> },
      { h: "卒業後の就職先として考えたい方へ。", body: <p>新卒で入社した場合の教育、初任給、働き方は<Link href="/recruit/newgrad">新卒採用ページ</Link>で確認できます。2027年度は新卒美容師を3名募集しています（年度・人数・募集状態は年度により異なります）。</p> },
    ],
    faq: [
      ["美容師になりたい高校生ですが、アルバイトはできますか。", "美容学生アルバイトの対象は高校1年生〜専門学校2年生です。勤務先はFLOWCLOUD・glow、最低勤務は月1回です。"],
      ["見学だけでも大丈夫ですか。", "はい。応募を決めていなくても、見学・相談を受け付けています。"],
      ["どの学校の学生でも相談できますか。", "学校名は問いません。通信課程など対象か分からない場合も、お問い合わせください。"],
    ],
    related: [["高校生の進路の進め方（4つのこと）", "/blog/koukousei-biyoushi-susumikata"], ["美容学校の学生の方へ", "/school"], ["新卒採用ページ", "/recruit/newgrad"], ["勤務エリア（泉大津・南大阪・泉州）", "/area"], ["働き方（休み・教育・給与の内訳）", "/workstyle"], ["見学・体験の流れ", "/visit"]],
    primary: "見学・アルバイトを相談する",
  },
  workstyle: {
    path: "/workstyle", code: "consult", audience: "workstyle", eyebrow: "WORK STYLE / IZUMIOTSU",
    h1: "休み・勤務時間・教育のこと、数字で正直に。",
    seoTitle: "美容師の働き方｜年間休日104日・有給・勤務時間・教育制度｜泉大津｜FLOWCLOUD・glow",
    desc: "泉大津のFLOWCLOUD・glowの美容師の働き方。完全週休2日制、年間休日104日、有給10日〜、早番・遅番の勤務時間、練習は勤務時間内、1年目月25時間のレッスン枠、新卒月給28万円の内訳をまとめました。",
    lead: "美容師を選ぶとき、気になるのは「休めるか」「練習はいつするか」「お給料の内訳」ではないでしょうか。FLOWCLOUDとglowの条件を、確定している内容だけ、そのまま書きます。",
    chipsLabel: "この記事で分かること",
    chips: ["完全週休2日制", "年間休日104日", "有給10日〜", "早番・遅番", "練習は勤務時間内", "月25時間のレッスン枠", "新卒月給28万円の内訳"],
    sections: [
      { h: "休みのこと。", body: <>
        <p>完全週休2日制（シフト制）で、年間休日は104日、年末年始休暇が4日あります。有給休暇は入社6か月以降に10日から付与され、年間休日と合わせて118日〜です。有給取得率は100%（2025年度実績）、平均勤続年数は6.0年です。</p>
        <p>雇用は試用期間なしの6か月の有期雇用で、社会保険完備です。</p></> },
      { h: "1日の流れと勤務時間。", body: <>
        <p>シフト制で、早番は8:30〜17:30、遅番は11:30〜20:30（どちらも休憩60分）です。朝礼は早番8:40、遅番11:15。準備・朝礼・片付け・練習は勤務時間内に行います。</p>
        <p>基本的に禁煙です（喫煙は屋外）。</p></> },
      { h: "教育と練習の時間。", body: <>
        <p>1年目・2年目とも月25時間のレッスン枠があります。2年目はウィッグでデザインカット60スタイルと、新規モニター80名に取り組みます。1年目でのデビューは目標であり、全員の保証ではありません。</p>
        <p>レッスン体験は毎月開催しています（19:20〜20:20、第2土曜コミュニケーション／第3土曜ケア／第4日曜合同）。</p></> },
      { h: "お給料の内訳。", body: <>
        <p>新卒は月給28万円で、内訳は基本給24万円＋固定残業代3万円（15時間分、超過分は別途支給）＋交通費または家賃補助1万円です。スタイリスト以上は固定残業50,000円（25時間分）です。</p>
        <p>交通費または家賃補助は一律1万円（要相談）、奨学金返済サポートもあります（対象・金額・期間は要相談）。インスタ・集客・5ゴール・9キレイ・エンゲージメント・オール金賞手当（賞与）があり、支給条件は評価基準によります。金額の保証ではなく、個別の見込みは見学・面接でご案内します。</p></> },
    ],
    faq: [
      ["年間休日は何日ですか。", "完全週休2日制（シフト制）で年間休日は104日、年末年始休暇4日です。有給休暇は入社6か月以降に10日から付与されます。"],
      ["練習は勤務時間外ですか。", "準備・朝礼・片付け・練習は勤務時間内に行います。1年目・2年目とも月25時間のレッスン枠があります。"],
      ["新卒の給与の内訳を教えてください。", "月給28万円で、基本給24万円と固定残業代3万円（15時間分、超過分は別途）、交通費または家賃補助1万円（一律・要相談）です。"],
      ["1年目でデビューできますか。", "1年でのデビューは目標としており、全員の保証ではありません。"],
    ],
    related: [["見学・体験の流れ", "/visit"], ["よくある質問", "/faq"], ["2027年度 新卒採用", "/recruit/newgrad"]],
    primary: "働き方について相談する",
  },
  visit: {
    path: "/visit", code: "visit", audience: "visit", eyebrow: "VISIT / EXPERIENCE FLOW",
    h1: "見学から入社までの流れ。体験の種類も。",
    seoTitle: "美容室の見学・体験の流れ｜キャスト体験・レッスン体験・ゲスト体験｜泉大津｜FLOWCLOUD・glow",
    desc: "泉大津のFLOWCLOUD・glowの見学から面接・採用までの流れと、キャスト体験・レッスン体験・ゲスト体験の内容。応募前の見学歓迎です。",
    lead: "応募を決めていなくても大丈夫です。選考は「見学→面接→採用」の流れで、見学・体験の内容は、お申し込み前にご案内します。",
    chipsLabel: "体験の種類",
    chips: ["見学（会社説明会）", "キャスト体験", "レッスン体験", "ゲスト体験"],
    sections: [
      { h: "選考の流れ。", body: <>
        <p>見学（会社説明会）→ 面接 → 採用の順です。応募資格は美容師免許（取得見込みを含む）で、提出書類は履歴書です。説明会・採用試験は体験会に参加された方が対象です。</p></> },
      { h: "体験の種類。", body: <>
        <ul className="job-detail-list">
          <li>キャスト体験：8:30〜17:30の間で、1時間から参加できます。</li>
          <li>レッスン体験：19:20〜20:20。第2土曜はコミュニケーション、第3土曜はケア、第4日曜は合同です。</li>
          <li>ゲスト体験：ヘッドスパ＋ブロー7,700円、カラー＋ブロー7,700円〜。お客様として施術を受けられます。</li>
        </ul>
        <p>詳しくは<Link href="/blog/taiken-guide">体験ガイド</Link>もご覧ください。</p></> },
      { h: "申し込み方法。", body: <p>お問い合わせフォーム、公式LINE、電話（0725-90-5699）、メール（info@ko-un-ryu-sui.com）から受け付けています。日程・内容は相談のうえで決めます。</p> },
    ],
    faq: [
      ["見学だけでも大丈夫ですか。", "はい。応募を決めていなくても、サロンを見て働き方を聞いてください。内容や費用、選考との関係はお申し込み前にご案内します。"],
      ["選考の流れを教えてください。", "見学（会社説明会）→ 面接 → 採用の流れで、提出書類は履歴書です。"],
      ["どこで勤務しますか。", "泉大津市のFLOWCLOUD（泉大津駅から徒歩約3分）とglow（東口から徒歩約1分）です。"],
    ],
    related: [["働き方（休み・教育・給与の内訳）", "/workstyle"], ["採用マッチング診断（12問）", "/match"], ["よくある質問", "/faq"], ["勤務エリア", "/area"]],
    primary: "サロン見学を相談する",
  },
};

export function Guide({ type }: { type: "recruit" | "area" | "school" | "student" | "workstyle" | "visit" }) {
  const d = pages[type];
  const faqLd = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: d.faq.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) };
  const pageLd = { "@context": "https://schema.org", "@type": "WebPage", name: d.seoTitle, url: SITE + d.path, description: d.desc, inLanguage: "ja", about: { "@id": SITE + "/#org" }, isPartOf: { "@id": SITE + "/#website" } };
  return (
    <SubPage title={d.seoTitle} description={d.desc} path={d.path}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageLd) }} />
      <main className="job-detail-main" onClick={trackClick}>
        <section className="job-detail-hero">
          <p>{d.eyebrow}</p>
          <h1>{d.h1}</h1>
          <p className="job-detail-lead">{d.lead}</p>
          <div className="lp-actions">
            <a className="job-detail-cta" href={`/?c=${d.code}#contact`} data-track="consult" data-placement="hero" data-audience={d.audience}>{d.primary} <ArrowRight size={17} aria-hidden="true" /></a>
            <a className="job-detail-line" href={LINE_URL} target="_blank" rel="noreferrer" data-track="line" data-placement="hero" data-audience={d.audience}>LINEで気軽に質問する</a>
          </div>
          <div className="chip-block"><p>{d.chipsLabel}</p><ul className="chip-list">{d.chips.map(c => <li key={c}>{c}</li>)}</ul></div>
        </section>
        {d.sections.map((s, i) => (
          <section className="job-detail-section" key={s.h}>
            <div className="job-detail-section-heading"><h2>{s.h}</h2></div>
            <div className="job-detail-copy">
              {s.body}
              {i === 1 && <p className="inline-cta"><a href={LINE_URL} target="_blank" rel="noreferrer" data-track="line" data-placement="body" data-audience={d.audience}>気になったら、公式LINEで質問する →</a></p>}
            </div>
          </section>
        ))}
        <section className="job-detail-section">
          <div className="job-detail-section-heading"><p>FAQ</p><h2>よくある質問</h2></div>
          <div className="job-detail-copy faq-inline">
            {d.faq.map(([q, a]) => <div key={q}><h3>{q}</h3><p>{a}</p></div>)}
          </div>
        </section>
        <section className="job-detail-section">
          <div className="job-detail-section-heading"><p>RELATED</p><h2>あわせて見る</h2></div>
          <ul className="job-detail-list">{d.related.map(([t, h]) => <li key={h}><Link href={h}>{t}</Link></li>)}</ul>
        </section>
        <section className="blog-cta">
          <h2>まずは、気になることから相談してください。</h2>
          <p>見学・体験の内容、費用、選考との関係は、お申し込み前にご案内します。</p>
          <div>
            <a className="job-detail-cta" href={`/?c=${d.code}#contact`} data-track="apply" data-placement="footer" data-audience={d.audience}>{d.primary} <ArrowRight size={17} aria-hidden="true" /></a>
            <a className="job-detail-line" href={LINE_URL} target="_blank" rel="noreferrer" data-track="line" data-placement="footer" data-audience={d.audience}>公式LINEで相談する</a>
          </div>
        </section>
      </main>
    </SubPage>
  );
}
