import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { TBD } from "../components/Pending";
import { faqItems } from "../data/faq";
import { ContactForm } from "../components/ContactForm";
import { track, trackClick } from "../lib/track";
import {
  ArrowRight,
  ArrowUpRight,
  BriefcaseBusiness,
  Check,
  ChevronDown,
  GraduationCap,
  Mail,
  MapPin,
  Menu,
  Sparkles,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import { Link } from "wouter";
import { posts } from "../data/posts";

const logoPath = "/images/company-logo_19c099e6.jpg";
const representativePhoto = "/images/representative-fujitsu-kazuhiko_e45df51f.jpg";
const heroTeamPhoto = "/images/flow-cloud-team-hero_18f9702b.jpg";
const teamMeetingPhoto = "/images/team-meeting_f47f2a94.jpg";
const teamEventPhoto = "/images/team-event_287a856c.jpg";
const trainingSalonPhoto = "/images/training-salon_b2a51844.jpg";
const shampooBoothPhoto = "/images/shampoo-booth_bce574f7.jpg";
const teamDinnerPhoto = "/images/team-dinner_f7b1140e.jpg";
const teamSalonPhoto = "/images/team-salon_3c550db9.jpg";
const businessVisionMap = "/images/business-vision-map_1120114d.jpg";
const shionPhoto = "/images/staff-shion-portrait_5de9f0d1.jpg";
const moePhoto = "/images/staff-moe-portrait_a1.jpg";
const galleryPhotos: [string, string, string][] = [
  ["/images/gallery-team-pose.jpg", "笑顔でポーズを決めるスタッフ4名", "笑顔があふれるチームです"],
  ["/images/gallery-salonwork.jpg", "サロンで施術とレッスンをしているスタッフ", "サロンワークの様子"],
  ["/images/gallery-award.jpg", "表彰状を手に笑顔の女性スタッフ2名", "がんばりは、ちゃんと表彰します"],
  ["/images/gallery-dinner.jpg", "テーブルを囲んで食事会を楽しむスタッフ", "みんなで食事会も"],
  ["/images/gallery-exterior.jpg", "夜のFLOWCLOUD前に集まったスタッフ全員", "FLOWCLOUDの前で、みんなで"],
  ["/images/gallery-lesson-cut.jpg", "鏡の前でカットのレッスンを受けるスタッフと、そばで見守る先輩", "技術レッスンは、先輩がそばで見守ります"],
  ["/images/gallery-lesson-wig.jpg", "ウィッグを使ってカットを練習するスタッフ", "ウィッグでカットの練習"],
  ["/images/gallery-lesson-counsel.jpg", "お客様役の相手にヘアの確認をするスタッフ", "接客・カウンセリングの練習"],
];
const ayunaPhoto = "/images/staff-ayuna-portrait_38e7b974.jpg";
const flowCloudLogo = "/images/flow-cloud-logo_95942c89.jpg";
const glowLogo = "/images/glow-logo_dcb4fafd.png";
const flowCloudExteriorPhoto = "/images/flow-cloud-exterior_9a36efba.jpg";
const flowCloudInteriorPhoto = "/images/flow-cloud-interior_15a0524c.jpg";
const glowSalonInteriorPhoto = "/images/glow-salon-interior_768ab430.jpg";
const glowReceptionPhoto = "/images/glow-reception_7c41b63c.jpg";
const flowCloudReel = "/images/flow-cloud-reel_3a97b205.mp4";
const glowReel = "/images/glow-reel_752e5127.mp4";
const lineHref = "https://lin.ee/Z0JP8sH";
const seoTitle = "泉大津の美容師求人｜岸和田・堺・和泉から通える｜新卒・中途・学生｜FLOWCLOUD・glow";
const seoDescription = "大阪府泉大津市の美容室FLOWCLOUD（フロウクラウド）・glow（グロウ）の採用サイト。南大阪・泉州（岸和田・高石・和泉・堺・泉佐野・貝塚）から通える美容師求人。美容学生・高校生・新卒・中途・復職の方へ、募集条件と見学・体験をご案内します。";

const instaAccounts = [
  { name: "行雲流水 採用", handle: "ko_un_ryu_sui.recruit" },
  { name: "FLOWCLOUD", handle: "flowcloud_osaka" },
  { name: "glow", handle: "glow_.osaka" },
];

const navItems = [
  ["会社について", "#about"],
  ["店舗", "#salons"],
  ["募集職種", "#jobs"],
  ["教育と成長", "#growth"],
  ["募集要項", "#guideline"],
  ["見学・体験", "#experience"],
  ["アクセス", "#access"],
  ["Instagram", "#instagram"],
  ["ブログ", "/blog/"],
  ["FLOWCLOUD ↗", "https://www.flowcloud.net/"],
  ["glow ↗", "https://glow-izumiotsu.jp/"],
];

const commonRows = [
  ["応募資格", "美容師免許（取得見込みを含む）。必要経験：なし。"],
  ["勤務地", <>FLOWCLOUD（泉大津駅徒歩約3分）／glow（泉大津駅徒歩約1分）。配属・仕事内容の変更の範囲：要相談</>],
  ["雇用形態", "正社員"],
];
const commonTail = [
  ["勤務時間", <>シフト制／週5勤務／1日実働8時間。早番 8:30〜17:30、遅番 11:30〜20:30（休憩60分）。固定残業15時間／月（超過分は別途支給）。出勤前の準備・朝礼・片付け・練習の勤怠の扱い：勤務時間内として扱います</>],
  ["休日・休暇", <>完全週休2日制（シフト制）。年間休日104日／年末年始休暇4日（12/31・1/1〜1/3）／年次有給休暇：入社6か月以降、10日〜（合計の年間休日は118日〜）。産前・産後休暇、育児休暇、時短勤務の適用条件は求人ごとにご確認ください。</>],
  ["福利厚生", <>社会保険は雇用形態・勤務条件に応じて加入します（加入は法令の定めに従います）。健康診断、奨学金返済サポート（あり。対象・金額・期間は要相談）、歓迎会・合宿などの社内行事。</>],
  ["教育", "営業中のレッスン、コタアカデミー（入社1年間 週1日）、会社が推進する講習費は基本全額会社負担。"],
];
const stylistRows = [
  ["仕事内容", "カウンセリング、カット、カラー、パーマ、シャンプー等の施術／予約管理／SNSを活用したスタイル発信／備品管理／店内清掃"],
  ...commonRows,
  ["給与", <>月給（Jrスタイリスト）290,000円〜／（スタイリスト）320,000円〜／（Topスタイリスト）390,000円〜／（Greatスタイリスト）520,000円〜／（アーティスト）620,000円〜。各区分は指名技術売上等の条件で決まります（指名技術売上は税抜で集計。集計期間・判定方法：要相談）。入社時の等級：要相談。月給には固定残業代50,000円（25時間分）を含みます。</>],
  ["手当・賞与", <>交通費または家賃補助 10,000円（どちらか一方・週4日以上勤務の方が対象・要相談）。手当の例：インスタ手当（フォロワー100人ごとに200円）、集客手当（自力で新規1人につき1,500円）、5ゴール手当、9キレイ手当、エンゲージメント手当（入社3年目以降、年2,000円UP）。いずれも支給条件によります。賞与は年2回（10月・4月）、目標達成などの条件によります。</>],
  ...commonTail,
];

const assistantRows = [
  ["仕事内容", "サロン内施術アシスタント業務全般、受付・電話対応、レッスンと並行したデビュー準備。"],
  ...commonRows,
  ["給与", <>月給 270,000円〜（コンシェルジュ）。交通費または家賃補助 10,000円（どちらか一方・週4日以上勤務の方が対象・要相談）。月給270,000円は、基本給240,000円＋固定残業代30,000円（15時間分）。超過分は別途支給。試用期間はなく、6か月の有期雇用として採用します。</>],
  ["手当・賞与", <>手当の例：インスタ手当（フォロワー100人ごとに200円）、集客手当（自力で新規1人につき1,500円）、5ゴール手当（レッスン・7S・SNS・店販・ケア）、9キレイ手当、エンゲージメント手当。いずれも評価基準によります（支給開始時期：入社後）。賞与は年2回（10月・4月）、オール金賞手当（賞与）を含め、目標達成などの条件によります。</>],
  ...commonTail,
];

const otherRows = [
  ["パートJrスタイリスト", "時給 1,600円〜"],
  ["パートスタイリスト", "時給 1,800円〜"],
  ["美容学生アルバイト", <>時給 1,300円〜。勤務先：FLOWCLOUD・glow。最低勤務は月1回から。まずは簡単な清掃などの補助業務から。</>],
  ["アイリスト", "スタイリストと同様のステップアップ制度（詳細は面談時にご案内します）。"],
  ["バックオフィス", "時給 1,300円〜。AIを活用したWEB・EC制作更新、写真・動画撮影編集、販促デザイン、メルマガなど。在宅可。"],
];

const curriculumRows = [
  ["1年生 コンシェルジュ（月25時間）", "基本（受付・電話）／毛髪理論（通年）／カラー理論（5〜7月）／パーマ理論（8〜10月）／カット理論（11〜3月）／ケア／カラー（5〜9月）／アイロン（4〜6月）／パーマ（8〜10月）／スタイリング・セットアップ・カウンセリング／ウィッグカット（通年）"],
  ["2年生 Jrスタイリスト（月20時間）", "ウィッグデザインカット60スタイル（ロング〜ミディアム30、ショート〜刈り上げ30）／新規モニター90名（カット40・カラーカット30・パーマカット20）"],
  ["その後のキャリア", "スタイリスト40／70／90 → トップ → グレイト → アーティスト。アイリスト、セラピスト、メイクアップアーティスト、パートスタイリスト、管理職、FC契約、独立支援など、一人ひとりに合った道を一緒に考えます。"],
  ["レッスンの進め方", "先輩キャストがプリセプターとして寄り添います。営業中レッスン、早番時の夜レッスン、遅番時の朝レッスン、月1回の合同レッスンなど。"],
];

const payRows = [
  ["コンシェルジュ", "月給 270,000円〜＋交通費（家賃補助）10,000円"],
  ["Jrスタイリスト（指名技術売上 16万円〜）", "月給 290,000円〜"],
  ["スタイリスト（同 71万円〜）", "月給 320,000円〜"],
  ["Topスタイリスト（同 111万円〜）", "月給 390,000円〜"],
  ["Greatスタイリスト（同 151万円〜）", "月給 520,000円〜"],
  ["アーティスト（同 191万円〜）", "月給 620,000円〜（アイリストも同様）"],
  ["各種手当", "インスタ手当（フォロワー100人につき200円）／集客手当（自力新規1人につき1,500円）／5ゴール手当／9キレイ手当／エンゲージメント手当（入社3年目以降、年2,000円UP）"],
  ["賞与・表彰", "賞与 年2回（10月・4月）、目標達成による。表彰制度あり。"],
];

const dayRows = [
  ["早番", <>8:30〜17:30（休憩60分）。出勤・準備・朝礼・営業開始・片付けの勤怠の扱い：勤務時間内として扱います（始業の15分前に集合。朝礼 8:40、終礼 17:25）</>],
  ["遅番", <>11:30〜20:30（休憩60分）。始業の15分前に集合。朝礼 11:15、終礼 20:25。</>],
  ["営業時間", "9:00〜20:00（FLOWCLOUDの最終受付は18:00）／定休 毎週月曜・火曜（不定休あり）。スタッフは完全週休2日（シフト制）"],
  ["自主レッスン", "早番は18:00〜20:00、遅番は9:00〜11:00を推奨しています。"],
];

const benefitRows = [
  ["お休み", "完全週休2日（シフト制）、年末年始休暇4日、有給休暇（入社6か月後から10日〜）。有給は1年間で100%消化できるよう取り組んでいます。"],
  ["働き方", "産休・育休、時短勤務、早番／遅番のシフト制、営業中レッスン。"],
  ["お金のこと", "社会保険完備、奨学金返済サポート、講習費は基本全額会社負担、目標達成による手当と賞与。"],
  ["健康・つながり", "健康診断、歓迎会、1日合宿など。"],
];

const eventRows = [
  ["4月", "歓迎会・新人研修"],
  ["6月", "カウンセリングコンテスト"],
  ["7月", "店販コンクール"],
  ["8月", "学生交流会・スパコンテスト"],
  ["9月", "方針発表会"],
  ["10月", "編み込み特別営業"],
  ["11月・12月", "店販コンクール"],
  ["1月", "成人式特別営業"],
  ["3月", "入社式・方針発表会・フォトコンテスト"],
];

const historyRows = [
  ["2007年11月", "代表・藤津が、日本で一番面積の小さい町・泉北郡忠岡町に、10坪の完全予約制プライベートサロン「FLOWCLOUD」を開業"],
  ["2015年4月", "髪質改善『シスキュア』開発"],
  ["2018年4月", "泉大津へ拡張移転"],
  ["2018年5月", "学生アルバイト採用開始"],
  ["2020年4月", "株式会社行雲流水 設立"],
  ["2021年5月", "デザイナーパート採用開始"],
  ["2022年1月", "『リヘア』開発"],
  ["2025年4月", "年中無休の営業を開始"],
  ["2026年3月", "2号店「glow」いずみおおつCITY内にOPEN"],
];

const googleBusinessUrl = "https://share.google/wWE2XkDrLOjj8NAit";
const salonMaps = [
  { name: "FLOWCLOUD", addr: "大阪府泉大津市東雲町1-20", walk: "南海本線・泉大津駅から徒歩約3分", q: "FLOWCLOUD 大阪府泉大津市東雲町1-20", site: "https://www.flowcloud.net/" },
  { name: "glow", addr: "大阪府泉大津市旭町18-3 いずみおおつCITY 1F", walk: "南海本線・泉大津駅東口から徒歩約1分", q: "glow 大阪府泉大津市旭町18-3 いずみおおつCITY", site: "https://glow-izumiotsu.jp/" },
];

const companyRows = [
  ["会社名", "株式会社 行雲流水"],
  ["代表取締役", "藤津 一弥"],
  ["設立", "2020年4月1日"],
  ["資本金", "100万円"],
  ["電話", "0725-90-5699（FLOWCLOUD）"],
  ["メール", "info@ko-un-ryu-sui.com"],
  ["アクセス", "南海本線 泉大津駅。FLOWCLOUDは徒歩約3分、glowは徒歩約1分（地図は「店舗へのアクセス」をご覧ください）。"],
  ["理念", "Mission：らしさを輝かせる／Value：幸せ体験／Vision：幸せの環をつなぐ。2034年「らしさ輝く街創り」を目指しています。"],
  ["人事・教育の考え方", "人事理念「圧倒的当事者意識」／教育理念「人を想う可能思考」。感謝心・素直心・向上心を基礎に、人間力・接遇力・技術力を磨きます。"],
];



const experienceCards = [
  ["01", "キャスト体験", "8:30〜17:30の間で、1時間からOK。実際の現場で、働く雰囲気を体感できます。"],
  ["02", "レッスン体験", "19:20〜20:20。第2土曜：コミュニケーションレッスン／第3土曜：ケアレッスン／第4日曜：合同レッスン。"],
  ["03", "ゲスト体験", "お客様としてサロンを体験。ヘッドスパ＋ブロー 7,700円、カラー＋ブロー 7,700円〜。"],
];

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="eyebrow">{children}</p>;
}

function GuidelineTable({ rows }: { rows: string[][] }) {
  return (
    <div className="guideline-table-wrap">
      <table className="guideline-table">
        <tbody>
          {rows.map(([label, value]) => (
            <tr key={label}>
              <th scope="row">{label}</th>
              <td>{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function InfoBlock({ num, en, title, small, rows, note }: { num: string; en: string; title: string; small?: string; rows: string[][]; note?: string }) {
  return (
    <div className="guideline-block">
      <div className="guideline-title"><span>{num}</span><div><p>{en}</p><h3>{title} {small && <small>{small}</small>}</h3></div></div>
      <GuidelineTable rows={rows} />
      {note && <p className="info-note">{note}</p>}
    </div>
  );
}

function SalonReel({ src, label, muted, onToggleSound }: { src: string; label: string; muted: boolean; onToggleSound: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = muted;
    video.volume = 0.72;

    if (!muted) {
      void video.play().catch(() => {
        // Browsers may defer playback until interaction; the next tap retries playback.
      });
    }
  }, [muted]);

  return (
    <div className="salon-reel">
      <video ref={videoRef} autoPlay loop muted={muted} playsInline preload="metadata" aria-label={label}>
        <source src={src} type="video/mp4" />
      </video>
      <span className="salon-reel-label">SALON REEL</span>
      <button
        className="salon-sound-toggle"
        type="button"
        onClick={onToggleSound}
        aria-pressed={!muted}
        aria-label={`${label}の音声を${muted ? "オンにする" : "オフにする"}`}
      >
        {muted ? <VolumeX size={14} aria-hidden="true" /> : <Volume2 size={14} aria-hidden="true" />}
        <span>{muted ? "音声をオン" : "音声をオフ"}</span>
      </button>
    </div>
  );
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeReelSound, setActiveReelSound] = useState<"flow" | "glow" | null>(null);

  useEffect(() => {
    document.title = seoTitle;
    document.querySelector<HTMLMetaElement>('meta[name="description"]')?.setAttribute("content", seoDescription);
    document.querySelector<HTMLMetaElement>('meta[property="og:title"]')?.setAttribute("content", seoTitle);
    document.querySelector<HTMLMetaElement>('meta[property="og:description"]')?.setAttribute("content", seoDescription);
    document.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.setAttribute("href", "https://ko-un-ryu-sui.com/");
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 18);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="site-shell" onClick={trackClick}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: "{\"@context\": \"https://schema.org\", \"@type\": \"FAQPage\", \"mainEntity\": [{\"@type\": \"Question\", \"name\": \"岸和田・堺・和泉など、泉大津以外から通えますか。\", \"acceptedAnswer\": {\"@type\": \"Answer\", \"text\": \"勤務地は泉大津市のFLOWCLOUDとglowです。岸和田・高石・和泉・堺・泉佐野・貝塚など南大阪・泉州エリアから通う方も、お住まいと通勤手段を伺って一緒に確認します。\"}}, {\"@type\": \"Question\", \"name\": \"どの美容専門学校の学生でも相談できますか。\", \"acceptedAnswer\": {\"@type\": \"Answer\", \"text\": \"学校名は問いません。通信課程など対象か分からない場合も、お問い合わせください。\"}}, {\"@type\": \"Question\", \"name\": \"年間休日と有給休暇はどうなりますか。\", \"acceptedAnswer\": {\"@type\": \"Answer\", \"text\": \"年間休日は104日、年末年始休暇は4日です。年次有給休暇は入社6か月以降に10日〜付与され、合計の年間休日は118日〜になります。\"}}, {\"@type\": \"Question\", \"name\": \"社会保険はありますか。\", \"acceptedAnswer\": {\"@type\": \"Answer\", \"text\": \"社会保険完備です（健康保険〈介護保険を含む〉、厚生年金保険、雇用保険、労災保険）。\"}}, {\"@type\": \"Question\", \"name\": \"給与に残業代は含まれますか。\", \"acceptedAnswer\": {\"@type\": \"Answer\", \"text\": \"コンシェルジュ（月給270,000円）は、基本給240,000円＋固定残業代30,000円（15時間分）で、超過分は別途支給します。\"}}, {\"@type\": \"Question\", \"name\": \"試用期間はありますか。\", \"acceptedAnswer\": {\"@type\": \"Answer\", \"text\": \"正社員の募集では試用期間はなく、6か月の有期雇用として採用します。\"}}, {\"@type\": \"Question\", \"name\": \"応募前にサロンを見学できますか。\", \"acceptedAnswer\": {\"@type\": \"Answer\", \"text\": \"サロン見学・相談を受け付けています。公式LINEまたはメールフォームからご連絡ください。\"}}]}" }} />
      <header className={`site-header ${scrolled ? "site-header-scrolled" : ""}`}>
        <a className="brand" href="#top" aria-label="行雲流水 採用サイト トップへ">
          <img src={logoPath} alt="株式会社 行雲流水 ko-un-ryu-sui ロゴ" />
          <span className="brand-divider" />
          <span className="brand-sub">RECRUITMENT</span>
        </a>
        <nav className="desktop-nav" aria-label="主要ナビゲーション">
          {navItems.map(([label, href]) => <a key={label} href={href} {...(href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}>{label}</a>)}
        </nav>
        <a className="header-cta" href="#contact">SALON VISIT <ArrowRight size={15} aria-hidden="true" /></a>
        <button className="menu-button" type="button" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? "メニューを閉じる" : "メニューを開く"} aria-expanded={menuOpen}>
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </header>

      <div className={`mobile-menu ${menuOpen ? "mobile-menu-open" : ""}`} aria-hidden={!menuOpen}>
        <div className="mobile-menu-inner">
          <p className="eyebrow">MENU</p>
          {navItems.map(([label, href], index) => <a key={label} style={{ transitionDelay: `${70 + index * 45}ms` }} href={href} onClick={closeMenu} {...(href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}>{label}</a>)}
          <a className="mobile-menu-visit" href="#contact" onClick={closeMenu}>サロン見学・応募の相談 <ArrowRight size={18} /></a>
        </div>
      </div>

      <main>
        <section className="hero" id="top" aria-labelledby="hero-title">
          <div className="hero-inner">
            <div className="hero-copy">
              <Eyebrow>RECRUITING / OSAKA IZUMIOTSU</Eyebrow>
              <h1 id="hero-title">美容師としての<br /><em><span className="nb">これからを、</span><span className="nb">ここから。</span></em></h1>
              <p className="hero-lead">大阪・泉大津のFLOWCLOUDとglow。はじめての就職も、経験を生かす転職も、子育てをしながらの仕事も。あなたの今に合う働き方を、募集条件と仕事の様子から確かめてください。</p>
              <div className="hero-actions">
                <a className="button button-primary" href="/?c=visit#contact" data-track="visit" data-placement="hero">サロン見学を相談する <ArrowRight size={17} aria-hidden="true" /></a>
                <a className="button button-quiet" href="#jobs" data-track="consult" data-placement="hero">自分に合う募集を見る <ArrowDownLine /></a>
                <a className="hero-line-link" href={lineHref} target="_blank" rel="noreferrer" data-track="line" data-placement="hero">LINEで採用の質問をする <ArrowUpRight size={14} aria-hidden="true" /></a>
              </div>
              <p className="hero-source-note">2027年度 新卒美容師3名募集。中途・パート・学生アルバイトの募集条件もご案内しています。<br />年度・人数・募集状態は年度により異なります</p>
            </div>
            <div className="hero-visual hero-visual-photo">
              <img className="hero-team-photo" src={heroTeamPhoto} alt="FLOWCLOUD前に集まる株式会社行雲流水の代表・藤津一弥とスタッフ" />
              <div className="hero-visual-caption">
                <span>FLOWCLOUD TEAM</span>
                <strong>WE ARE<br />KOUNRYUSUI</strong>
                <small>代表・藤津一弥と、個性を磨き合うチーム</small>
              </div>
              <div className="hero-visual-number" aria-hidden="true">01</div>
            </div>
          </div>
          <div className="hero-bottom-note">
            <span style={{display: 'none'}}><Sparkles size={14} aria-hidden="true" style={{display: 'none'}} /> TWO SALONS / ONE PHILOSOPHY</span>
            <a href="#about">SCROLL TO DISCOVER <ArrowRight size={14} aria-hidden="true" /></a>
          </div>
        </section>

        <div className="ticker" aria-hidden="true"><div className="ticker-track">{[0, 1].map(k => <span key={k}>✿ 2027年度 新卒美容師3名募集 ♡ 見学・体験の相談受付中 ★ 完全週休2日（シフト制） ✿ 中途・パート・学生アルバイトもご案内 ♡ まずは気になることから ★ </span>)}</div></div>
        <section className="official-band" aria-label="サロン公式サイト">
          <p>♡ 働くサロンをのぞいてみよう</p>
          <a className="official-pill official-flow" href="https://www.flowcloud.net/" target="_blank" rel="noreferrer">FLOWCLOUD 公式サイト <ArrowUpRight size={15} aria-hidden="true" /></a>
          <a className="official-pill official-glow" href="https://glow-izumiotsu.jp/" target="_blank" rel="noreferrer">glow 公式サイト <ArrowUpRight size={15} aria-hidden="true" /></a>
        </section>

        <section className="facts-band section" aria-label="働く条件ひと目">
          <ul className="facts-grid">
            <li><b>1年</b><span>でのデビューを目標に<br />カリキュラムあり</span></li>
            <li><b>週休2日</b><span>完全週休2日制<br />（シフト制）</span></li>
            <li><b>27万円〜</b><span>新卒の月給<br />内訳・補助は募集要項で</span></li>
            <li><b>100%</b><span>有給休暇取得率<br />（2025年度実績）</span></li>
            <li><b>6.0年</b><span>平均勤続年数<br />長く続けられる職場</span></li>
            <li><b>1時間〜</b><span>体験会・サロン見学<br />気軽に相談できます</span></li>
          </ul>
        </section>

        <section className="worry-section section" aria-labelledby="worry-title">
          <div className="section-heading"><Eyebrow>VOICE</Eyebrow><h2 id="worry-title">こんな不安、<br />ありませんか？</h2></div>
          <div className="worry-grid">
            <div className="worry-card"><p className="worry-q">「ちゃんとデビューできるか不安…」</p><p>1年でのデビューを目標に、段階ごとのカリキュラムで練習します。習得状況を確認しながら、担当できる範囲を決めます。</p></div>
            <div className="worry-card"><p className="worry-q">「休みが少ないイメージ…」</p><p>完全週休2日制（シフト制）です。年間休日と有給休暇は分けて、募集要項でご案内します。</p></div>
            <div className="worry-card"><p className="worry-q">「人間関係が心配…」</p><p>見学では、仕事中の声のかけ方や指導の様子もご覧ください。平均勤続年数は6.0年です。</p></div>
            <div className="worry-card"><p className="worry-q">「お給料や生活のことが心配…」</p><p>月給の内訳や手当の条件は、職種ごとの募集ページで確認できます。気になることは応募前にご相談ください。</p></div>
          </div>
          <p className="who-line"><a className="button button-primary" href={lineHref} target="_blank" rel="noreferrer" data-track="line" data-placement="body">気になることは、LINEで気軽に聞く <ArrowUpRight size={16} aria-hidden="true" /></a></p>
        </section>

        <section className="who-section section" id="who" aria-labelledby="who-title">
          <div className="section-heading split-heading">
            <div>
              <Eyebrow>FIND YOUR PATH</Eyebrow>
              <h2 id="who-title">あなたの今から、<br />探してみる。</h2>
            </div>
            <p>美容学生の方も、新卒で入社を考える方も、経験者の方も、子育て・復帰を考える方も。あてはまる入口から、条件を確かめてください。</p>
          </div>
          <div className="who-grid">
            <a className="who-card" href="#experience" data-track="audience" data-audience="student" data-placement="who"><span>美容学生</span><h3>美容学生の方へ</h3><p>仕事の様子や先輩の姿を見て、自分が働く未来を考えてみませんか。学生の仕事と見学のご案内です。</p><b>見学について見る <ArrowRight size={15} aria-hidden="true" /></b></a>
            <a className="who-card" href="/recruit/newgrad" data-track="audience" data-audience="new_graduate" data-placement="who"><span>新卒</span><h3>新卒で入社を考えている方へ</h3><p>入社して何を学び、どうお客様を担当できるようになるのか。2027年度の募集条件と教育の流れをご紹介します。</p><b>新卒採用を見る <ArrowRight size={15} aria-hidden="true" /></b></a>
            <a className="who-card" href="/recruit/career" data-track="audience" data-audience="stylist" data-placement="who"><span>中途</span><h3>中途スタイリストの方へ</h3><p>これまでの経験を、次の職場でどう生かすか。仕事内容、給与と評価、働く時間を確認できます。</p><b>中途採用を見る <ArrowRight size={15} aria-hidden="true" /></b></a>
            <a className="who-card" href="/jobs/part" data-track="audience" data-audience="return" data-placement="who"><span>子育て・復職</span><h3>子育て中・復帰を考えている方へ</h3><p>勤務できる曜日や時間、技術への不安。まずは今の希望をお聞かせください。募集条件と照らしてお話しします。</p><b>両立・復職の条件を見る <ArrowRight size={15} aria-hidden="true" /></b></a>
          </div>
          <div className="who-grid who-grid-sub">
            <a className="who-card" href="/area" data-track="audience" data-audience="area" data-placement="who"><span>勤務エリア</span><h3>泉大津・岸和田・堺・和泉から通いたい方へ</h3><p>南大阪・泉州エリアから通う方へ。勤務地、通勤の相談、交通費・家賃補助をご案内します。</p><b>勤務エリアを見る <ArrowRight size={15} aria-hidden="true" /></b></a>
            <a className="who-card" href="/school" data-track="audience" data-audience="student" data-placement="who"><span>美容学校</span><h3>美容専門学校の学生の方へ</h3><p>高津・関西・ヴェールルージュ・ルトーア・小出・西日本ヘアメイクカレッジ・ベルエベル・バンタンなど、学校名を問わず相談できます。</p><b>学生向けページを見る <ArrowRight size={15} aria-hidden="true" /></b></a>
            <a className="who-card" href="/recruit/student" data-track="audience" data-audience="student" data-placement="who"><span>高校生・学生</span><h3>美容師を目指す高校生・美容学生の方へ</h3><p>高校1年生〜専門学校2年生が対象の学生アルバイトと、見学・体験のご案内です。</p><b>高校生・学生向けを見る <ArrowRight size={15} aria-hidden="true" /></b></a>
          </div>
          <p className="who-line"><a className="button button-primary" href={lineHref} target="_blank" rel="noreferrer" data-track="line" data-placement="body">どれか迷ったら、公式LINEで相談 <ArrowUpRight size={16} aria-hidden="true" /></a></p>
        </section>

        <section className="statement-section section" id="about" aria-labelledby="about-title">
          <div className="section-grid">
            <div>
              <Eyebrow>ABOUT US</Eyebrow>
              <p className="section-index">01</p>
            </div>
            <div className="statement-content">
              <h2 id="about-title">らしさを、<br />輝かせる。</h2>
              <p className="statement-lead">私たちは、一人ひとりが生まれ持つ<strong>「らしさ」という光</strong>を信じています。その人が本来持つ魅力や可能性を見つめ、磨き、高め合うことで、内なる輝きが自然とあふれ出す世界を創造します。</p>
              <p>美しさとは、誰かと比べるものではなく、自分自身の「らしさ」を誇ること。私たちは、その人の生き方や価値観までもデザインし、関わるすべての人が、自分らしく輝き、互いの光で照らし合う社会を目指します。</p>
              <div className="quote-card">
                <span>MANAGEMENT PHILOSOPHY</span>
                <blockquote>流れる雲のようにしなやかに、<br />湧き上がる水のように清らかに。</blockquote>
                <small>“らしさ”を輝かせる力で、美と幸せの環を広げ続けます。</small>
              </div>
              <div className="leader-card">
                <div className="leader-photo"><img loading="lazy" decoding="async" src={representativePhoto} alt="株式会社行雲流水 代表 藤津一弥" /></div>
                <div className="leader-profile"><span>REPRESENTATIVE / KAZUYA FUJITSU</span><h3>藤津 一弥 <small>代表</small></h3><p>行雲流水にいたから夢が叶った。今が幸せだと思ってほしい。美容師って最高って思ってほしい。仲間の夢の数が多いほど会社は大きくなっていく。信用信頼できる仲間が多いほど幸せな人生を送れる。</p><p className="leader-message">美容が好きな方！夢を叶えたい方！一緒に成長しましょう！共に学び、共に成長できる仲間を募集しています。必ず、なりたい自分になれる！全力で応援します。</p><small className="leader-career">オーナースタイリスト／美容師歴27年。美容国際ライセンスHIQ LEVEL2取得、DADA DESIGN ACADEMY卒業、BOWアカデミー トレーナー、クリムラ技塾 初級講師、南大阪美容志塾 講師、志塾サロン会 レクチャラー、南大阪の美容師さんの交流の場 主宰。</small></div>
              </div>
            </div>
          </div>
        </section>

        <section className="vision-section section" aria-labelledby="vision-title">
          <div className="vision-heading">
            <div><Eyebrow>BUSINESS VISION</Eyebrow><h2 id="vision-title">ひとつの想いから、<br />いくつもの美しさへ。</h2></div>
            <div><p>FLOWCLOUD と glow を起点に、世代・ライフスタイル・求める技術が異なるお客様へ。それぞれのブランドらしさを育てながら、「らしさを輝かせる」美と幸せの環を広げていく構想です。</p><span>株式会社行雲流水　事業展開ビジョン</span></div>
          </div>
          <figure className="vision-map">
            <img loading="lazy" decoding="async" src={businessVisionMap} alt="株式会社行雲流水の事業展開ビジョン。FLOWCLOUD、glow、WATERLINE（仮）、BONSAI（仮）、ココロオドル（仮）などの店舗構想を示す図" />
            <figcaption>株式会社行雲流水　事業展開ビジョン</figcaption>
          </figure>
        </section>

        <section className="merit-section section" aria-labelledby="merit-title">
          <div className="section-heading split-heading">
            <div>
              <Eyebrow>WHY KOUNRYUSUI</Eyebrow>
              <h2 id="merit-title">技術だけではなく、<br />人に向き合う。</h2>
            </div>
            <p>美容師としての成長が、人生の幸せにつながる。私たちはそう信じて、一人ひとりに合った美容人生計画を一緒に考えます。</p>
          </div>
          <div className="merit-grid">
            <article className="merit-card merit-card-featured">
              <span className="card-number">01</span>
              <h3>1年でのデビューを目標に、<br />学ぶ道筋を。</h3>
              <p>1年目は月25時間、2年目は月20時間のレッスンを、先輩キャストがプリセプターとして支えます。1年は目標であり、習得状況を確認して担当範囲を決めます（勤務内外の扱い・費用負担：要相談）。</p>
              <span className="fact-label">1-YEAR DEBUT CURRICULUM</span>
            </article>
            <article className="merit-card">
              <span className="card-number">02</span>
              <h3>2つの個性を持つ、<br />泉大津のサロン。</h3>
              <p>髪と頭皮のケア、半個室で落ち着いて向き合うFLOWCLOUD。似合わせと扱いやすさを追求するglow。それぞれに異なる経験があります。</p>
              <span className="fact-label">FLOWCLOUD / GLOW</span>
            </article>
            <article className="merit-card">
              <span className="card-number">03</span>
              <h3>お客様の素材美を、<br />丁寧に引き出す。</h3>
              <p>glowは「傷ませない技術」「素材美を活かす」を掲げ、FLOWCLOUDは髪質改善・頭皮改善を主軸にしています。</p>
              <span className="fact-label">COUNSELING / CARE</span>
            </article>
          </div>
          <p className="data-note"><Check size={15} aria-hidden="true" /> 平均勤続年数 6.0年／有給休暇取得率 100%（2025年度実績）</p>
        </section>

        <section className="salons-section section" id="salons" aria-labelledby="salons-title">
          <div className="section-heading split-heading">
            <div>
              <Eyebrow>OUR SALONS</Eyebrow>
              <h2 id="salons-title">どんな時間を、<br />お客様とつくるか。</h2>
            </div>
            <p>同じ「らしさ」を大切にしながら、接客の景色は同じではありません。各店の特色を知ることから始めてください。</p>
          </div>

          <article className="salon-card salon-flow">
            <div className="salon-gallery" aria-label="FLOWCLOUDの店舗写真">
              <img loading="lazy" decoding="async" className="salon-gallery-main" src={flowCloudExteriorPhoto} alt="FLOWCLOUDの外観" />
              <div className="salon-gallery-side">
                <SalonReel src={flowCloudReel} label="FLOWCLOUDのサロンリール動画" muted={activeReelSound !== "flow"} onToggleSound={() => setActiveReelSound(activeReelSound === "flow" ? null : "flow")} />
                <img loading="lazy" decoding="async" className="salon-gallery-detail" src={flowCloudInteriorPhoto} alt="FLOWCLOUDの落ち着いたカウンセリング空間" />
              </div>
              <div className="salon-gallery-logo"><img loading="lazy" decoding="async" src={flowCloudLogo} alt="FLOWCLOUD ロゴ" /></div>
              <small>FLOWCLOUD<br />SALON 01</small>
            </div>
            <div className="salon-detail">
              <div className="salon-title-row"><p className="eyebrow">SALON 01</p><span>FLOWCLOUD</span></div>
              <h3>「わたしのプチ別荘」で、<br />髪と頭皮に深く向き合う。</h3>
              <p>FLOWCLOUD（フロウクラウド）は、完全予約制・会員制の落ち着いた空間で、髪質改善、縮毛矯正、ヘッドスパ、頭皮ケアを主軸に、丁寧なカウンセリングから一人ひとりの悩みと理想に寄り添うサロンです。</p>
              <ul className="feature-list">
                <li>半個室・プロジェクター付きシャンプーブースを含む、くつろぎを追求した空間</li>
                <li>髪質改善・頭皮改善、縮毛矯正、艶カラー、ヘッドスパなどのケア提案</li>
                <li>南海本線 泉大津駅から徒歩約3分／店舗前駐車場4台</li>
              </ul>
              <p className="address-line"><MapPin size={16} aria-hidden="true" /> 大阪府泉大津市東雲町1-20</p>
              <a className="text-link" href="https://www.flowcloud.net/" target="_blank" rel="noreferrer">公式サイトを見る <ArrowUpRight size={15} aria-hidden="true" /></a>
            </div>
          </article>

          <article className="salon-card salon-glow">
            <div className="salon-gallery" aria-label="glowの店舗写真">
              <img loading="lazy" decoding="async" className="salon-gallery-main" src={glowReceptionPhoto} alt="glowのレセプションとロゴ" />
              <div className="salon-gallery-side">
                <SalonReel src={glowReel} label="glowのサロンリール動画" muted={activeReelSound !== "glow"} onToggleSound={() => setActiveReelSound(activeReelSound === "glow" ? null : "glow")} />
                <img loading="lazy" decoding="async" className="salon-gallery-detail" src={glowSalonInteriorPhoto} alt="glowのセット面" />
              </div>
              <div className="salon-gallery-logo"><img loading="lazy" decoding="async" src={glowLogo} alt="glow ロゴ" /></div>
              <small>glow<br />SALON 02</small>
            </div>
            <div className="salon-detail">
              <div className="salon-title-row"><p className="eyebrow">SALON 02</p><span>glow</span></div>
              <h3>「似合う」と「扱いやすい」を、<br />毎日の自信に変えていく。</h3>
              <p>glow（グロウ）では、ショート、ショートボブ、レイヤーカットから、髪質改善カラー、透明感カラー、ヘッドスパまで、マンツーマンで、お客様の似合うスタイルと日々の扱いやすさを提案します。</p>
              <ul className="feature-list">
                <li>ショート・ショートボブ・レイヤーカット、韓国レイヤー、パーマのスタイル提案</li>
                <li>素材美を活かし、傷ませない技術とヘアケアを大切にする考え方</li>
                <li>南海本線 泉大津駅東口すぐ／いずみおおつCITY 1F</li>
              </ul>
              <p className="address-line"><MapPin size={16} aria-hidden="true" /> 大阪府泉大津市旭町18-3 いずみおおつCITY 1F</p>
              <a className="text-link" href="https://glow-izumiotsu.jp/" target="_blank" rel="noreferrer">glowの世界観を見る <ArrowUpRight size={15} aria-hidden="true" /></a>
            </div>
          </article>
        </section>

        <section className="jobs-section section" id="jobs" aria-labelledby="jobs-title">
          <div className="jobs-intro">
            <Eyebrow>JOB CATEGORIES</Eyebrow>
            <h2 id="jobs-title">あなたの今から、<br />始める仕事。</h2>
            <p>それぞれの役割に求められるのは、目の前の人をきちんと見ること。経験や得意を持ち寄りながら、サロンの時間をつくります。</p>
          </div>
          <div className="job-grid">
            <article className="job-card">
              <div className="job-icon"><BriefcaseBusiness size={28} strokeWidth={1.3} /></div>
              <span>STYLIST</span>
              <h3>美容師<br />スタイリスト</h3>
              <p>カウンセリングから施術、予約管理、スタイル発信まで。技術を通して、お客様の「なりたい」を支える仕事です。</p>
              <ul>
                <li>カット・カラー・パーマ・シャンプー等の施術</li>
                <li>カウンセリングと予約管理</li>
                <li>SNSでのスタイル発信、備品管理、店内清掃</li>
              </ul>
              <a href="#guideline">募集要項へ <ArrowRight size={16} aria-hidden="true" /></a>
            </article>
            <article className="job-card job-card-dark">
              <div className="job-icon"><GraduationCap size={28} strokeWidth={1.3} /></div>
              <span>ASSISTANT</span>
              <h3>美容師<br />アシスタント</h3>
              <p>サロン内施術のアシスタント業務全般から、技術者としての一歩を。営業中のレッスンと外部講習の機会が掲載されています。</p>
              <ul>
                <li>サロン内施術アシスタント業務全般等</li>
                <li>営業中のレッスン</li>
                <li>外部講習等の講習費全額負担あり</li>
              </ul>
              <a href="#guideline">募集要項へ <ArrowRight size={16} aria-hidden="true" /></a>
            </article>
          </div>
        </section>

        <section className="education-section section" id="growth" aria-labelledby="education-title">
          <div className="education-top">
            <div>
              <Eyebrow>LEARN &amp; GROW</Eyebrow>
              <h2 id="education-title">学びを、<br />忙しさの外に置かない。</h2>
            </div>
            <div className="education-copy">
              <p>入社1年目は<strong>コンシェルジュ</strong>として基礎を、2年目は<strong>Jrスタイリスト</strong>として実践を。<strong>営業中のレッスン</strong>とコタアカデミー、講習費の会社負担で、1年後のカットデビューを目指します。</p>
              <a className="text-link" href="#experience">体験会で雰囲気を確かめる <ArrowRight size={15} aria-hidden="true" /></a>
            </div>
          </div>
          <div className="education-steps" aria-label="成長のステップ">
            <article><span>01</span><h3>1年生<br />コンシェルジュ</h3><p>受付・電話から、毛髪理論、カラー・パーマ・カットの理論と実技まで。月25時間。</p></article>
            <article><span>02</span><h3>2年生<br />Jrスタイリスト</h3><p>ウィッグ60スタイルと新規モニター90名で実践力を磨きます。月20時間。</p></article>
            <article><span>03</span><h3>その先の<br />キャリア</h3><p>スタイリスト、トップ、グレイト、アーティスト、独立支援まで。あなたに合う道を一緒に考えます。</p></article>
          </div>
          <figure className="curriculum-chart"><img src="/images/curriculum-chart.png" alt="デビューを目指すカリキュラム表。1年生コンシェルジュは月25時間、2年生Jrスタイリストは月20時間" loading="lazy" /><figcaption>デビューを目指すカリキュラム（月ごとの内容）</figcaption></figure>
          <div className="info-stack">
            <InfoBlock num="A" en="CURRICULUM" title="教育カリキュラム" rows={curriculumRows} />
            <InfoBlock num="B" en="PAY &amp; CAREER STEPS" title="給与・キャリアステップ" rows={payRows} note="職種・等級ごとの月給は固定残業代（15時間／月）を含む目安です。昇格は指名技術売上などに応じます。" />
          </div>
        </section>

        <section className="training-scenes-section section" aria-labelledby="training-scenes-title">
          <div className="training-scenes-heading">
            <div><Eyebrow>LEARNING SCENES</Eyebrow><h2 id="training-scenes-title">学び合う時間も、<br />仕事の一部。</h2></div>
            <p>サロンの中で集まり、話し、視点を持ち寄る。実際の写真から、行雲流水の学びの時間と空間をご紹介します。</p>
          </div>
          <div className="training-photo-grid">
            <figure className="training-photo-main"><img loading="lazy" decoding="async" src={trainingSalonPhoto} alt="店内でスタッフが集まる研修・ミーティングの様子" /><figcaption><span>01 / IN-SALON SESSION</span><strong>店内で、言葉と技術を持ち寄る。</strong></figcaption></figure>
            <figure className="training-photo-side"><img loading="lazy" decoding="async" src={teamMeetingPhoto} alt="スタッフがテーブルを囲むミーティングの様子" /><figcaption><span>02 / MEETING</span><strong>それぞれの気づきを、チームへ。</strong></figcaption></figure>
            <figure className="training-photo-detail"><img loading="lazy" decoding="async" src={shampooBoothPhoto} alt="FLOWCLOUDのシャンプーブース" /><figcaption><span>03 / CARE SPACE</span><strong>お客様のための、静かな技術空間。</strong></figcaption></figure>
          </div>
        </section>

        <section className="gallery-section section" aria-labelledby="gallery-title">
          <div className="section-heading"><Eyebrow>OUR DAILY LIFE</Eyebrow><h2 id="gallery-title">こんな毎日を、<br />一緒に過ごします。</h2></div>
          <div className="gallery-grid">
            {galleryPhotos.map(([src, alt, cap]) => <figure key={src}><img src={src} alt={alt} loading="lazy" /><figcaption>{cap}</figcaption></figure>)}
          </div>
        </section>

        <section className="staff-section section" aria-labelledby="staff-title">
          <div className="team-heading">
            <div><Eyebrow>OUR TEAM</Eyebrow><h2 id="staff-title">仲間の言葉から、<br />私たちの仕事を知る。</h2></div>
            <p>一緒に学び、笑い、仕事をする仲間がいる。行雲流水で働くメンバー自身の言葉から、チームの空気とお客様への向き合い方をお届けします。</p>
          </div>
          <div className="team-photo-grid">
            <figure className="team-photo team-photo-tall"><img loading="lazy" decoding="async" src={teamSalonPhoto} alt="サロン内で集まるスタッフの様子" /><figcaption><span>SALON TIME</span><strong>サロンで過ごす、チームの時間。</strong></figcaption></figure>
            <figure className="team-photo"><img loading="lazy" decoding="async" src={teamDinnerPhoto} alt="食事会で集まるスタッフの様子" /><figcaption><span>TEAM DINNER</span><strong>仕事の外にも、話せる時間がある。</strong></figcaption></figure>
            <figure className="team-photo"><img loading="lazy" decoding="async" src={teamEventPhoto} alt="スタッフが集まるイベントの様子" /><figcaption><span>TEAM EVENT</span><strong>互いの挑戦を、みんなで称える。</strong></figcaption></figure>
          </div>
          <div className="staff-voice-grid" aria-label="スタッフ紹介">
            <article className="staff-voice-card">
              <div className="staff-voice-photo"><img loading="lazy" decoding="async" src={shionPhoto} alt="スタッフ しおん" /></div>
              <div className="staff-voice-content">
                <p className="staff-voice-label">STAFF VOICE / 01</p>
                <h3>しおん <small>スタイリスト</small></h3>
                <div className="staff-voice-quote">
                  <span>行雲流水の良いところ</span>
                  <p>行雲流水では1人だけでなく、キャスト全員でゲストを幸せにするために取り組んでいます。僕はゲストから温かみを感じることが多く、働いていて幸せです。</p>
                </div>
                <div className="staff-voice-quote">
                  <span>仕事を探している皆様へ</span>
                  <p>ぜひ行雲流水で楽しく、全力で沢山のゲストを幸せにしましょう！！僕も楽しみにお待ちしております！</p>
                </div>
              </div>
            </article>
            <article className="staff-voice-card staff-voice-card-reverse">
              <div className="staff-voice-photo"><img loading="lazy" decoding="async" src={ayunaPhoto} alt="スタッフ あゆな" /></div>
              <div className="staff-voice-content">
                <p className="staff-voice-label">STAFF VOICE / 02</p>
                <h3>あゆな <small>スタイリスト</small></h3>
                <div className="staff-voice-quote staff-voice-quote-single">
                  <span>私たちが大切にしていること</span>
                  <p>私たちは「ただ髪を切る」だけではなく、お客様一人ひとりの毎日が少しでも前向きになるようなヘアスタイルづくりを大切にしています。髪質やライフスタイル、今のお悩みだけでなく、これからどうなっていきたいかまで寄り添いながら提案できる美容室を目指しています！</p>
                </div>
              </div>
            </article>
            <article className="staff-voice-card">
              <div className="staff-voice-photo"><img loading="lazy" decoding="async" src={moePhoto} alt="スタッフ もえ" /></div>
              <div className="staff-voice-content">
                <p className="staff-voice-label">STAFF VOICE / 03</p>
                <h3>もえ <small>スタイリスト</small></h3>
                <div className="staff-voice-quote staff-voice-quote-single">
                  <span>行雲流水の良いところ</span>
                  <p>行雲流水グループはとても暖かく居心地の良い、最幸の美容室です！分からないところは先輩が優しく丁寧に教えてくれて、いつでも質問がしやすい環境です。先輩ともいろんなおしゃべりができて、楽しく働けます！</p>
                </div>
              </div>
            </article>
          </div>
        </section>

        <section className="guideline-section section" id="guideline" aria-labelledby="guideline-title">
          <div className="section-heading split-heading">
            <div>
              <Eyebrow>RECRUITMENT GUIDELINE</Eyebrow>
              <h2 id="guideline-title">募集要項</h2>
            </div>
            <div className="guideline-intro"><p>応募・見学のご相談は、このサイトのフォームまたはLINEから受け付けています。最新の条件は面談時にご確認ください。</p></div>
          </div>
          <div className="guideline-block">
            <div className="guideline-title"><span>01</span><div><p>HAIRDRESSER</p><h3>美容師スタイリスト <small>正社員</small></h3></div></div>
            <GuidelineTable rows={stylistRows} />
            <div className="guideline-actions">
              <Link className="job-detail-link" href="/jobs/stylist">求人詳細を見る <ArrowUpRight size={15} aria-hidden="true" /></Link>
              <a className="internal-apply-link" href="#contact">スタイリストの応募・見学を相談する <ArrowRight size={15} aria-hidden="true" /></a>
            </div>
          </div>
          <div className="guideline-block">
            <div className="guideline-title"><span>02</span><div><p>HAIRDRESSER ASSISTANT</p><h3>美容師アシスタント <small>正社員</small></h3></div></div>
            <GuidelineTable rows={assistantRows} />
            <div className="guideline-actions">
              <Link className="job-detail-link" href="/jobs/assistant">求人詳細を見る <ArrowUpRight size={15} aria-hidden="true" /></Link>
              <a className="internal-apply-link" href="#contact">アシスタントの応募・見学を相談する <ArrowRight size={15} aria-hidden="true" /></a>
            </div>
          </div>
          <InfoBlock num="03" en="PART-TIME &amp; OTHERS" title="その他の職種" small="パート・アルバイト" rows={otherRows} />
          <div className="guideline-actions guideline-actions-center"><Link className="job-detail-link" href="/jobs/part">パート美容師の求人詳細 <ArrowUpRight size={15} aria-hidden="true" /></Link><Link className="job-detail-link" href="/jobs/student">美容学生アルバイトの求人詳細 <ArrowUpRight size={15} aria-hidden="true" /></Link></div>
        </section>

        <section className="life-section section" aria-labelledby="life-title">
          <div className="section-heading split-heading">
            <div>
              <Eyebrow>WORK STYLE</Eyebrow>
              <h2 id="life-title">働き方と、<br />サロンの1年。</h2>
            </div>
            <p>早番・遅番のシフト制。完全週休2日で、産休・育休や時短勤務の制度もあります。</p>
          </div>
          <div className="info-stack">
            <InfoBlock num="A" en="DAILY SCHEDULE" title="1日の流れ" rows={dayRows} />
            <InfoBlock num="B" en="BENEFITS" title="休日・福利厚生" rows={benefitRows} />
            <InfoBlock num="C" en="ANNUAL EVENTS" title="年間行事" rows={eventRows} />
          </div>
        </section>

        <section className="experience-section section" id="experience" aria-labelledby="experience-title">
          <div className="section-heading split-heading">
            <div>
              <Eyebrow>EXPERIENCE</Eyebrow>
              <h2 id="experience-title">選べる体験会。<br />まずは1時間から。</h2>
            </div>
            <p>体験会は随時（1〜6時間）。公式LINEからご希望の体験と日時をお送りください。その他の日程はご相談ください。</p>
          </div>
          <div className="merit-grid">
            {experienceCards.map(([num, title, text]) => (
              <article className="merit-card" key={num}>
                <span className="card-number">{num}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
          <p className="data-note"><Check size={15} aria-hidden="true" /> 説明会・採用試験は体験会に参加された方が対象です。日程はLINEまたはフォームでお問い合わせください。</p>
          <p className="experience-cta"><a className="button button-primary" href={lineHref} target="_blank" rel="noreferrer">公式LINEで体験会を予約する <ArrowUpRight size={17} aria-hidden="true" /></a></p>
        </section>

        <section className="access-section section" id="access" aria-labelledby="access-title">
          <div className="section-heading split-heading">
            <div>
              <Eyebrow>ACCESS</Eyebrow>
              <h2 id="access-title">店舗への<br />アクセス。</h2>
            </div>
            <p>どちらも南海本線・泉大津駅からすぐ。見学当日の集合場所は、予約が確定したときにご案内します。</p>
          </div>
          <div className="access-grid">
            {salonMaps.map(s => (
              <article className="access-card" key={s.name}>
                <h3>{s.name}</h3>
                <p className="access-addr">{s.addr}</p>
                <p className="access-walk">{s.walk}</p>
                <div className="access-map">
                  <iframe title={`${s.name}の地図`} src={`https://www.google.com/maps?q=${encodeURIComponent(s.q)}&hl=ja&z=17&output=embed`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
                </div>
                <p className="access-links">
                  <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(s.q)}`} target="_blank" rel="noreferrer">Googleマップで開く <ArrowUpRight size={14} aria-hidden="true" /></a>
                  <a href={s.site} target="_blank" rel="noreferrer">お客様向け公式サイト <ArrowUpRight size={14} aria-hidden="true" /></a>
                </p>
              </article>
            ))}
          </div>
          <p className="access-gbp"><a href={googleBusinessUrl} target="_blank" rel="noreferrer">Googleの「株式会社行雲流水」のページで、口コミや写真を見る <ArrowUpRight size={14} aria-hidden="true" /></a></p>
        </section>

        <section className="company-section section" id="company" aria-labelledby="company-title">
          <div className="section-heading split-heading">
            <div>
              <Eyebrow>COMPANY</Eyebrow>
              <h2 id="company-title">私たちのこれまでと、<br />会社概要。</h2>
            </div>
            <p>2007年、10坪のプライベートサロンから始まった「FLOWCLOUD」。いま、2店舗のチームへと広がっています。</p>
          </div>
          <div className="info-stack">
            <InfoBlock num="A" en="HISTORY" title="歩み" rows={historyRows} />
            <InfoBlock num="B" en="OVERVIEW" title="会社概要" rows={companyRows} />
          </div>
        </section>

        <section className="insta-section section" id="instagram" aria-labelledby="insta-title">
          <div className="section-heading split-heading">
            <div>
              <Eyebrow>INSTAGRAM</Eyebrow>
              <h2 id="insta-title">サロンの毎日を、<br />のぞいてみる。</h2>
            </div>
            <p>採用の情報、FLOWCLOUDとglowの日々の投稿を、Instagramでご覧いただけます。気になったらフォローして、DMでも気軽に質問してください。</p>
          </div>
          <div className="insta-grid">
            {instaAccounts.map(a => (
              <article className="insta-card" key={a.handle}>
                <h3>{a.name}</h3>
                <iframe title={`${a.name}のInstagram`} src={`https://www.instagram.com/${a.handle}/embed`} loading="lazy" scrolling="no" referrerPolicy="no-referrer-when-downgrade" />
                <a className="button button-quiet" href={`https://www.instagram.com/${a.handle}/`} target="_blank" rel="noreferrer" data-track="instagram" data-placement="instagram">{a.name}をInstagramで見る <ArrowUpRight size={15} aria-hidden="true" /></a>
                <a className="button button-quiet" href={`https://www.instagram.com/${a.handle}/reels/`} target="_blank" rel="noreferrer" data-track="instagram" data-placement="instagram-reels">{a.name}のリール動画を見る <ArrowUpRight size={15} aria-hidden="true" /></a>
              </article>
            ))}
          </div>
        </section>

        <section className="blog-section section" id="blog" aria-labelledby="blog-title">
          <div className="section-heading split-heading">
            <div>
              <Eyebrow>ARTICLES</Eyebrow>
              <h2 id="blog-title">応募する前に、<br />知っておきたいこと。</h2>
            </div>
            <p>教育、シフト、給与、学生アルバイト、体験の流れ。採用情報だけでは伝わりにくいことを、テーマごとにまとめています。</p>
          </div>
          <div className="home-blog-grid">
            {posts.slice(0, 3).map(post => (
              <a className="blog-card" key={post.slug} href={`/blog/${post.slug}`}>
                {post.image && <img className="blog-thumb" src={post.image} alt={post.imageAlt ?? post.title} loading="lazy" width="1200" height="630" />}
                <span className="blog-meta">{post.date.replace(/-/g, ".")}　<b>{post.category}</b></span>
                <h3>{post.title}</h3>
                <p>{post.excerpt}</p>
              </a>
            ))}
          </div>
          <p className="experience-cta"><a className="button button-quiet" href="/blog/">記事をすべて見る <ArrowRight size={16} aria-hidden="true" /></a></p>
        </section>

        <section className="faq-section section" aria-labelledby="faq-title">
          <div className="faq-heading"><Eyebrow>FAQ</Eyebrow><h2 id="faq-title">よくある質問</h2><p><a href="/faq">質問を一覧で見る <ArrowRight size={14} aria-hidden="true" /></a></p></div>
          <div className="faq-list">
            {faqItems.map(([q, a]) => (
              <details key={q}>
                <summary><span>{q}</span><ChevronDown size={20} aria-hidden="true" /></summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="contact-section" id="contact" aria-labelledby="contact-title">
          <div className="contact-head">
            <Eyebrow>LET'S TALK</Eyebrow>
            <h2 id="contact-title">まずは、<br className="sp-only" />気になることから。</h2>
            <p>サロン見学、働き方の相談、求人への応募はこちらから。求人票だけではわからないことを、見学や相談で確かめてください。見学・体験の内容、費用、選考との関係は、お申し込み前にご案内します。</p>
          </div>
          <div className="contact-choices">
            <a className="choice choice-line" href={lineHref} target="_blank" rel="noreferrer" data-track="line" data-placement="contact">
              <span className="choice-tag">いちばん手軽</span>
              <strong>公式LINEで相談する</strong>
              <small>友だち追加して、気になることをそのままメッセージで。</small>
              <b>LINEを開く <ArrowUpRight size={18} aria-hidden="true" /></b>
            </a>
            <a className="choice choice-mail" href="#contact-form" data-track="consult" data-placement="contact">
              <span className="choice-tag">くわしく伝えたい方へ</span>
              <strong>メールで相談する</strong>
              <small>下のフォームに入力。担当者からご連絡します。</small>
              <b>フォームへ <ArrowDownLine /></b>
            </a>
          </div>
          <ol className="contact-steps" aria-label="ご相談の流れ">
            <li><b>1</b>ご希望を選ぶ</li><li><b>2</b>お名前と連絡先を入力</li><li><b>3</b>担当者からご連絡</li>
          </ol>
          <div className="contact-formwrap" id="contact-form">
            <ContactForm />
          </div>
        </section>

      </main>

      <footer className="site-footer">
        <div className="footer-top">
          <div className="footer-brand"><img loading="lazy" decoding="async" src={logoPath} alt="株式会社 行雲流水 ko-un-ryu-sui ロゴ" /><p>FLOWCLOUD / glow 採用サイト</p></div>
          <div className="footer-links"><a href="#about">私たちについて</a><a href="#salons">店舗紹介</a><a href="#growth">教育・給与</a><a href="#guideline">募集要項</a><a href="#experience">体験会</a><a href="#access">アクセス</a><a href="#instagram">Instagram</a><a href="#company">会社概要</a><a href="/faq">よくある質問</a><a href="/workstyle">働き方（休み・教育）</a><a href="/visit">見学・体験の流れ</a><a href="/blog/">記事一覧</a><a href="https://www.flowcloud.net/" target="_blank" rel="noreferrer">FLOWCLOUD公式</a><a href="https://glow-izumiotsu.jp/" target="_blank" rel="noreferrer">glow公式</a><a href={googleBusinessUrl} target="_blank" rel="noreferrer">Googleのページ</a><a href="/recruit/newgrad">新卒採用</a><a href="/area">勤務エリア</a><a href="/school">美容学校の学生の方へ</a><a href="/recruit/student">高校生・美容学生</a><a href="/recruit/career">中途採用</a><a href="#contact">サロン見学・応募</a><Link href="/privacy">個人情報の取扱い</Link></div>
          <div className="footer-company"><p>株式会社 行雲流水</p><span>代表：藤津一弥<br />掲載拠点：大阪府泉大津市<br />設立：2020年4月1日<br />TEL：0725-90-5699</span></div>
        </div>
        <div className="footer-bottom"><span>© KOUNRYUSUI CO., LTD.</span><span>泉大津・岸和田・高石・和泉・堺・泉佐野・貝塚 美容師 求人 / 美容室 アシスタント 求人 / 南大阪・泉州</span></div>
      </footer>

      <div className="mobile-cta" aria-label="見学・応募へのショートカット"><a className="mobile-email" href="/?c=visit#contact" data-track="consult" data-placement="sticky">見学・相談する</a><a className="mobile-line" href={lineHref} target="_blank" rel="noreferrer">LINEで相談</a></div>
    </div>
  );
}

function ArrowDownLine() {
  return <span className="arrow-down-line" aria-hidden="true">↓</span>;
}
