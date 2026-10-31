import re
base="/tmp/claude-0/-home-claude/872cd273-5065-56ec-9f27-7fe3d0ba7ab5/scratchpad/build/client/src/"
p=base+"pages/Home.tsx"
s=open(p,encoding="utf-8").read()
def rep(old,new,count=1):
    global s
    assert s.count(old)>=1,("missing",old[:60])
    s=s.replace(old,new) if count==0 else s.replace(old,new,count)

# SEO
rep('seoDescription = "泉大津で美容師を募集中。FLOW CLOUD・glowでは、スタイリスト・美容師アシスタントを採用しています。給与・待遇・働き方・仕事内容をご紹介。サロン見学・ご応募も受付中です。"',
    'seoDescription = "泉大津で美容師を募集中（2027年度 美容師3名）。FLOW CLOUD・glowでは、1年でデビューできるカリキュラム、完全週休2日、職種別の給与モデルを公開。体験会・サロン見学も受付中です。"')

# rows
a=s.index("const stylistRows"); b=s.index("function Eyebrow")
rows='''const commonRows = [
  ["応募資格", "美容師免許（取得見込みを含む）。必要経験：なし。"],
  ["勤務地", "掲載店舗：FLOW CLOUD（泉大津駅徒歩3分）／glow（泉大津駅徒歩1分）。配属先は面談時にご案内します。"],
  ["雇用形態", "正社員"],
];
const commonTail = [
  ["勤務時間", "シフト制／週5勤務／1日実働8時間。早番 8:30〜17:30、遅番 11:30〜20:30（休憩60分）。固定残業15時間／月（超過分は追加支給）。"],
  ["休日・休暇", "完全週休2日制（シフト制）、年間休日104日＋年末年始休暇4日＋有給休暇10日〜＝合計118日〜。産前・産後休暇、育児休暇、時短勤務。"],
  ["福利厚生", "社会保険完備（健康保険・介護保険・厚生年金・雇用保険・労災保険）、健康診断、奨学金返済サポート、歓迎会・合宿などの社内行事。"],
  ["教育", "営業中のレッスン、コタアカデミー（入社1年間 週1日）、会社が推進する講習費は基本全額会社負担。"],
];
const stylistRows = [
  ["仕事内容", "カウンセリング、カット、カラー、パーマ、シャンプー等の施術／予約管理／SNSを活用したスタイル発信／備品管理／店内清掃"],
  ...commonRows,
  ["給与", "月給 290,000円〜（Jrスタイリスト）／320,000円〜（スタイリスト）／390,000円〜（Topスタイリスト）／520,000円〜（Greatスタイリスト）／620,000円〜（アーティスト）。指名技術売上に応じて昇格。固定残業代を含む。"],
  ["手当・賞与", "交通費（家賃補助）10,000円、インスタ手当、集客手当、5ゴール手当、9キレイ手当、エンゲージメント手当。賞与は年2回（10月・4月）、目標達成による。"],
  ...commonTail,
];

const assistantRows = [
  ["仕事内容", "サロン内施術アシスタント業務全般、受付・電話対応、レッスンと並行したデビュー準備。"],
  ...commonRows,
  ["給与", "月給 270,000円〜（コンシェルジュ）＋交通費（家賃補助）10,000円＝総支給 280,000円〜。固定残業代を含む。"],
  ["手当・賞与", "インスタ手当、集客手当、5ゴール手当、9キレイ手当など、目標達成に応じて入社1か月目から支給。賞与は年2回（10月・4月）、目標達成による。"],
  ...commonTail,
];

const otherRows = [
  ["パートJrスタイリスト", "時給 1,600円〜"],
  ["パートスタイリスト", "時給 1,800円〜"],
  ["美容学生アルバイト", "時給 1,300円〜。土日祝OK／週3日〜／1日5時間〜／月1回からOK。掃除補助などから始められます。"],
  ["アイリスト", "スタイリストと同様のステップアップ制度（詳細は面談時にご案内します）。"],
  ["バックオフィス", "時給 1,300円〜。AIを活用したWEB・EC制作更新、写真・動画撮影編集、販促デザイン、メルマガなど。在宅可。"],
];

const curriculumRows = [
  ["1年生 コンシェルジュ（月25時間）", "基本（受付・電話）／毛髪理論（通年）／カラー理論（5〜7月）／パーマ理論（8〜10月）／カット理論（11〜3月）／ケア／カラー（5〜9月）／アイロン（4〜6月）／パーマ（8〜10月）／スタイリング・セットアップ・カウンセリング／ウィッグカット（通年）"],
  ["2年生 Jrスタイリスト（月25時間）", "ウィッグデザインカット60スタイル（ロング〜ミディアム30、ショート〜刈り上げ30）／新規モニター80名（カット30・カラーカット30・パーマカット20）"],
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
  ["早番", "8:15頃 出勤 → 8:45 朝礼 → 9:00 営業開始 → 休憩60分 → 17:30 終礼・退勤"],
  ["遅番", "11:15頃 出勤 → 11:45 朝礼 → 12:00 営業開始 → 休憩60分 → 20:30 終礼・退勤"],
  ["営業時間", "9:00〜20:00（19:00最終受付）／年中無休（スタッフは完全週休2日）"],
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
  ["2007年11月", "代表・藤津が、日本で一番面積の小さい町・泉北郡忠岡町に、10坪の完全予約制プライベートサロン「FLOW CLOUD」を開業"],
  ["2015年4月", "髪質改善『シスキュア』開発"],
  ["2018年4月", "泉大津へ拡張移転"],
  ["2018年5月", "学生アルバイト採用開始"],
  ["2020年4月", "株式会社行雲流水 設立"],
  ["2021年5月", "デザイナーパート採用開始"],
  ["2022年1月", "『リヘア』開発"],
  ["2025年4月", "年中無休の営業を開始"],
  ["2026年3月", "2号店「glow」いずみおおつCITY内にOPEN"],
];

const companyRows = [
  ["会社名", "株式会社 行雲流水"],
  ["代表取締役", "藤津 一弥"],
  ["設立", "2020年4月1日"],
  ["資本金", "100万円"],
  ["電話", "0725-90-5699（FLOW CLOUD）"],
  ["メール", "info@ko-un-ryu-sui.com"],
  ["アクセス", "南海本線 泉大津駅。難波から急行で約20分、梅田から約19分（新今宮経由）、天王寺から約19分。"],
  ["理念", "Mission：らしさを輝かせる／Value：幸せ体験／Vision：幸せの環をつなぐ。2034年「らしさ輝く街創り」を目指しています。"],
  ["人事・教育の考え方", "人事理念「圧倒的当事者意識」／教育理念「人を想う可能思考」。感謝心・素直心・向上心を基礎に、人間力・接遇力・技術力を磨きます。"],
];

const faqItems = [
  ["サロン見学は希望できますか？", "はい。見学・体験会を受け付けています。希望の日時は、このサイトのフォームまたは公式LINEからご相談ください。"],
  ["応募に必要な資格や経験はありますか？", "美容師免許（取得見込みを含む）が必要です。実務経験は問いません。"],
  ["何名募集していますか？", "2027年度は美容師3名を募集しています。アイリストを含め、いろいろな職種の募集もあります。"],
  ["お店の雰囲気や人間関係は良いですか？", "少人数のアットホームなサロンで、みんな優しく仲良しで、自分らしくいられる環境です。"],
  ["お給料や手当はどうなっていますか？", "初任給は27万円＋交通費（家賃補助）1万円で総支給28万円です。インスタ手当・集客手当・5ゴール手当・9キレイ手当など、目標達成に応じて入社1か月目から手当がつき、店舗目標の達成による賞与もあります。"],
  ["社会保険は完備していますか？", "はい。健康保険、介護保険、厚生年金保険、雇用保険、労災保険に入社後すぐ加入いただきます。"],
  ["お休みは完全週休2日ですか？", "お店は基本的に年中無休ですが、スタッフは完全週休2日（シフト制）で、週に2日は必ずお休みがあります。年間休日104日に年末年始休暇4日、有給休暇10日〜を加えて、合計118日〜です。"],
  ["早番・遅番の1日のスケジュールは？", "早番は8:30〜17:30、遅番は11:30〜20:30（休憩60分）です。出勤15分前に集合して営業準備をし、朝礼のあと9:00に営業を開始します。自主レッスンも可能です。"],
  ["営業時間・勤務時間・残業は？", "営業時間は9:00〜20:00（19:00最終受付）です。早番・遅番のシフト制で、1か月15時間の固定残業があります。"],
  ["何年でデビューできますか？", "『1年でデビューできるカリキュラム』とコタアカデミーの併用で、入社1年後には安心してカットデビューできます。デビュー後すぐに指名がつき、楽しく美容師ができるカリキュラムです。"],
  ["レッスンはゆっくり教えてくれますか？", "プリセプターの先輩キャストが寄り添って教えます。営業中レッスン、早番時の夜レッスン、遅番時の朝レッスン、月1回の合同レッスンなどがあります。"],
  ["アカデミーはありますか？", "入社後1年間、営業中に週1日『コタアカデミー』に参加します。協賛ディーラー・メーカーの研修も随時あります。会社が推進する研修費用は全額会社負担です。"],
  ["お客様の年齢層はどうですか？", "FLOW CLOUDは10代〜80代の方にご来店いただいています。女性7割・男性3割で、メインはナチュラルでおしゃれな40代の女性です。"],
  ["スキンケアやマツエク、着付けなど他の仕事もありますか？", "スキンケアやアイラッシュの施術、成人式の着付けなどを行っています。講師と連携しており、今後はネイルなど美容全般の導入も予定しています。"],
  ["店のイベントや行事はありますか？", "新人歓迎会、スパコンテスト、合宿、カウンセリングコンテスト、学生交流会、方針発表会、フォトコンテストなど、キャストもゲストも巻き込んだ行事があります。"],
  ["理念はありますか？", "『らしさを輝かせる』です。人は長所も短所もあり、どんな時でも自分は自分。等身大のありのままの自分らしさが前向きに輝いている状態が、幸せで美しいと考えています。"],
  ["どんなことに力を入れていますか？", "人を大切にすることです。『感謝心・素直心・向上心』を基礎に、人間力・接遇力・技術力を磨く人財育成に力を入れています。"],
  ["どんな人を求めていますか？", "素直な方、感謝できる方、向上心のある方、人を大切にできる方、行雲流水の想いに共感して共に成長できる方です。"],
];

const experienceCards = [
  ["01", "キャスト体験", "8:30〜17:30の間で、1時間からOK。実際の現場で、働く雰囲気を体感できます。"],
  ["02", "レッスン体験", "19:20〜20:20。第2土曜：コミュニケーションレッスン／第3土曜：ケアレッスン／第4日曜：合同レッスン。"],
  ["03", "ゲスト体験", "お客様としてサロンを体験。ヘッドスパ＋ブロー 7,700円、カラー＋ブロー 7,700円〜。"],
];

'''
s=s[:a]+rows+s[b:]

# generic block component
rep("function SalonReel(", '''function InfoBlock({ num, en, title, small, rows, note }: { num: string; en: string; title: string; small?: string; rows: string[][]; note?: string }) {
  return (
    <div className="guideline-block">
      <div className="guideline-title"><span>{num}</span><div><p>{en}</p><h3>{title} {small && <small>{small}</small>}</h3></div></div>
      <GuidelineTable rows={rows} />
      {note && <p className="info-note">{note}</p>}
    </div>
  );
}

function SalonReel(''')

# hero
rep('<p className="hero-source-note">FLOW CLOUD / glow　美容師スタイリスト・アシスタント採用</p>',
    '<p className="hero-source-note">2027年度 美容師3名募集　／　アイリスト・パート・学生アルバイトも<br />完全週休2日・1年でデビューできるカリキュラム</p>')
rep("ココロギドル（仮）","ココロオドル（仮）")

# nav
rep('["JOBS", "#jobs"],\n  ["GUIDELINE", "#guideline"],','["JOBS", "#jobs"],\n  ["GROWTH", "#growth"],\n  ["GUIDELINE", "#guideline"],\n  ["EXPERIENCE", "#experience"],')

# merit text
rep('<p>行雲流水のサロンづくりです。数字や制度の詳細は募集要項でもご確認ください。</p>','<p>美容師としての成長が、人生の幸せにつながる。私たちはそう信じて、一人ひとりに合った美容人生計画を一緒に考えます。</p>')
rep('''<h3>営業中にも、<br />学びを進められる。</h3>
              <p>求人票には、営業中のレッスンと外部講習等の講習費全額負担を掲載。日々のサロンワークに学びを重ねる環境です。</p>
              <span className="fact-label">LESSON / EXTERNAL TRAINING</span>''','''<h3>1年でデビューできる、<br />カリキュラム。</h3>
              <p>月25時間のレッスンを、先輩キャストがプリセプターとして支えます。営業中レッスンとコタアカデミー、講習費の会社負担も。</p>
              <span className="fact-label">1-YEAR DEBUT CURRICULUM</span>''')

# education section
a=s.index('<section className="education-section')
b=s.index('<section className="training-scenes-section')
edu='''<section className="education-section section" id="growth" aria-labelledby="education-title">
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
            <article><span>02</span><h3>2年生<br />Jrスタイリスト</h3><p>ウィッグ60スタイルと新規モニター80名で実践力を磨きます。月25時間。</p></article>
            <article><span>03</span><h3>その先の<br />キャリア</h3><p>スタイリスト、トップ、グレイト、アーティスト、独立支援まで。あなたに合う道を一緒に考えます。</p></article>
          </div>
          <div className="info-stack">
            <InfoBlock num="A" en="CURRICULUM" title="教育カリキュラム" rows={curriculumRows} />
            <InfoBlock num="B" en="PAY &amp; CAREER STEPS" title="給与・キャリアステップ" rows={payRows} note="職種・等級ごとの月給は固定残業代（15時間／月）を含む目安です。昇格は指名技術売上などに応じます。" />
          </div>
        </section>

        '''
s=s[:a]+edu+s[b:]

# guideline: add other jobs block after assistant block, plus life/experience/company sections
rep('''        <section className="faq-section section" aria-labelledby="faq-title">''','''        <section className="life-section section" aria-labelledby="life-title">
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

        <section className="company-section section" id="company" aria-labelledby="company-title">
          <div className="section-heading split-heading">
            <div>
              <Eyebrow>COMPANY</Eyebrow>
              <h2 id="company-title">私たちのこれまでと、<br />会社概要。</h2>
            </div>
            <p>2007年、10坪のプライベートサロンから始まった「FLOW CLOUD」。いま、2店舗のチームへと広がっています。</p>
          </div>
          <div className="info-stack">
            <InfoBlock num="A" en="HISTORY" title="歩み" rows={historyRows} />
            <InfoBlock num="B" en="OVERVIEW" title="会社概要" rows={companyRows} />
          </div>
        </section>

        <section className="faq-section section" aria-labelledby="faq-title">''')

# other jobs block in guideline
rep('''              <a className="internal-apply-link" href="#contact">アシスタントの応募・見学を相談する <ArrowRight size={15} aria-hidden="true" /></a>
            </div>
          </div>
''','''              <a className="internal-apply-link" href="#contact">アシスタントの応募・見学を相談する <ArrowRight size={15} aria-hidden="true" /></a>
            </div>
          </div>
          <InfoBlock num="03" en="PART-TIME &amp; OTHERS" title="その他の職種" small="パート・アルバイト" rows={otherRows} />
''')

# FAQ
a=s.index('<div className="faq-list">'); b=s.index('</div>',s.index('</details>',s.rindex('<details>')))
faq='''<div className="faq-list">
            {faqItems.map(([q, a]) => (
              <details key={q}>
                <summary><span>{q}</span><ChevronDown size={20} aria-hidden="true" /></summary>
                <p>{a}</p>
              </details>
            ))}
          '''
s=s[:a]+faq+s[b:]

# footer
rep("設立：2020年（求人掲載情報）","設立：2020年4月1日<br />TEL：0725-90-5699")
rep('<a href="#guideline">募集要項</a><a href="#contact">','<a href="#growth">教育・給与</a><a href="#guideline">募集要項</a><a href="#experience">体験会</a><a href="#company">会社概要</a><a href="#contact">')
rep('<span>株式会社 行雲流水</span>','<span>株式会社 行雲流水</span>') if False else None
open(p,"w",encoding="utf-8").write(s)

# JobPosting
p2=base+"pages/JobPosting.tsx"
j=open(p2,encoding="utf-8").read()
j=j.replace('salary: "月給 280,000円〜730,000円"','salary: "月給 290,000円〜（Jrスタイリスト）／620,000円〜（アーティスト）"')
j=j.replace('salaryMin: 280000','salaryMin: 290000').replace('salaryMax: 730000','salaryMax: 620000')
j=j.replace('salary: "月給 260,000円〜270,000円"','salary: "月給 270,000円〜＋交通費（家賃補助）10,000円"')
j=j.replace('salaryMin: 260000','salaryMin: 270000').replace('salaryMax: 270000','salaryMax: 280000')
j=j.replace('月平均残業22時間','固定残業15時間／月（超過分は追加支給）').replace('月平均残業19時間','固定残業15時間／月（超過分は追加支給）')
j=j.replace('完全週休2日制（要相談）／年間休日109日','完全週休2日制（シフト制）／年間休日104日（年末年始4日・有給10日〜を含め合計118日〜）')
j=j.replace('完全週休2日制（要相談）、年間休日109日、年末年始休暇4日、産前・産後休暇、育児休暇、有給休暇10日。','完全週休2日制（シフト制）、年間休日104日＋年末年始休暇4日＋有給休暇10日〜＝合計118日〜。産前・産後休暇、育児休暇、時短勤務。')
j=j.replace('通勤手当10,000円（通勤手当または住宅手当のいずれかを選択して支給）','交通費（家賃補助）10,000円、インスタ手当・集客手当・5ゴール手当・9キレイ手当などの目標達成手当、賞与年2回')
j=j.replace('給与：月給280,000円〜730,000円','給与：月給290,000円〜（Jrスタイリスト）、620,000円〜（アーティスト）。固定残業15時間／月を含む')
j=j.replace('給与：月給260,000円〜270,000円','給与：月給270,000円＋交通費（家賃補助）10,000円。固定残業15時間／月を含む')
j=j.replace('"外部講習等の講習費全額負担あり"]','"外部講習等の講習費全額負担あり", "コタアカデミー（入社1年間 週1日）"]')
j=j.replace('2026-07-15','2026-10-29').replace('2026年7月15日','2026年10月29日')
j=j.replace('完全シフト制／週5勤務','シフト制／週5勤務').replace('固定シフト制／週5勤務','シフト制／週5勤務')
open(p2,"w",encoding="utf-8").write(j)

# CSS
c=base+"index.css"
css=open(c,encoding="utf-8").read()
css+='''
.info-stack { display: grid; gap: clamp(28px, 4vw, 56px); margin-top: clamp(40px, 6vw, 80px); }
.info-note { margin: 14px 0 0; color: #607677; font-size: 12px; line-height: 1.9; }
.life-section, .company-section { background: var(--paper); }
.experience-section { background: var(--mint); }
.experience-cta { margin: 32px 0 0; }
.guideline-block + .guideline-block { margin-top: clamp(28px, 4vw, 56px); }
'''
open(c,"w",encoding="utf-8").write(css)
print("ok")
