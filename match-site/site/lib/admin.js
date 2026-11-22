// 採用マッチング診断 管理画面の描画。build.mjs が site/diagnosis.js（質問・採点）と src/admin-parts.js（管理画面の部品）から自動で作る。直接は編集しない。
const axes = ["人間力（感謝心）","接遇力（素直心）","技術力（向上心）"];
const credo = [
  "誠実に一所懸命に、肯定的に自分事と捉え、自主的に行動する",
  "協調性を大切に、礼節を重んじる、約束、時間、規則を守る",
  "笑顔で元気よく、感じの良い挨拶、返事、立ち居振舞いをする",
  "お客様が主役、お客様の立場にたった謙虚な接客をする",
  "心配りからの声かけ、丁寧で正確な説明や情報を提供する",
  "整理整頓、身だしなみを整え、心身共に健全である",
  "時間と質、意味と価値、効果と効率を考え、生産性を上げる",
  "基本を忠実に、学びを継続し、復習予習、事前準備をする",
  "数字とタスクの目標目的を理解し、すぐに実践をする"
];
const scale = ["そう思う","ややそう思う","あまりそう思わない","そう思わない"];
const tracks = {
  newgrad: {
    label:"美容学生・新卒",
    tip:"先輩から技術のフィードバックを受ける機会や、デビューまでにどんな実践を積むかを聞いてみましょう。",
    questions:[
      "実習で困っている人がいたら、自分にできることを考えて声をかけたい。",
      "チームで練習するとき、集合時間や道具の片付けなど、決めた約束を大切にしたい。",
      "初めて会うお客様にも、自分から明るく挨拶できるようになりたい。",
      "自分が勧めたいスタイルがあっても、まずお客様の悩みや希望を聞く練習がしたい。",
      "緊張しているお客様に気づいたら、次に何をするか分かりやすく伝えたい。",
      "気持ちよく過ごしていただけるよう、道具や身だしなみを整える習慣をつけたい。",
      "技術の練習では、仕上がりと時間を振り返り、改善できる手順を探したい。",
      "先輩に教わった基本を、次の練習までに復習しておきたい。",
      "レッスンの目標が決まったら、達成する意味を理解して、今日の練習に取り入れたい。",
      ["まず身につけてみたいのは？","シャンプーやヘッドスパ","カットやカラー","お客様との話し方","これから見つけたい"],
      ["どんなときに学びやすい？","先輩にお手本を見せてもらうとき","一緒に練習するとき","自分で試して感想をもらうとき","いろいろ試してみたい"],
      ["見学でいちばん知りたいことは？","お店やスタッフ（キャスト）の雰囲気","コンシェルジュの仕事","デビューまでの練習","見学しながら考えたい"]
    ]
  },
  career: {
    label:"中途美容師",
    tip:"これまでの経験を生かせる施術や、入社後に深めたい技術、希望する働き方を相談してみましょう。",
    questions:[
      "施術や予約の流れに課題を見つけたら、自分事としてチームに改善案を出したい。",
      "予約が重なる日も、約束した時間や引き継ぎを守れるよう、早めに仲間と調整したい。",
      "忙しい時間帯も、表情や挨拶、返事で安心してもらえる接客を意識したい。",
      "得意な施術があっても、お客様の生活や希望を聞いてから提案を組み立てたい。",
      "仕上がりや施術についてお客様が迷っていたら、選びやすいよう選択肢や注意点を説明したい。",
      "施術の合間にも、次のお客様を迎えるためにセット面や道具を整えたい。",
      "施術の質と時間を振り返り、お客様への価値につながる手順を見直したい。",
      "慣れた技術でも、基本や薬剤知識を学び直し、次の施術に備えたい。",
      "再来や施術時間の目標を立てるときは、その目的を確かめて、すぐ試せる行動に落とし込みたい。",
      ["次の職場で伸ばしてみたいのは？","髪質改善やヘッドスパ","似合わせカットやカラー","カウンセリングや後輩育成","見学しながら考えたい"],
      ["新しい環境でまず知りたいことは？","お客様との関わり方","技術の学び方","スタッフ（キャスト）同士の働き方","今の経験を生かせる仕事"],
      ["見学で聞いてみたいのは？","どんな技術を深められるか","これまでの経験をどう生かせるか","働き方をどう相談できるか","見学しながら考えたい"]
    ]
  }
};
const scenarios = {
  "newgrad": [
    [
      "実習で、隣の子が道具の準備に困っています。自分の準備が終わったら？",
      "声をかけて、困っていることを聞く",
      "使えそうな道具の場所を伝える",
      "先生に気づいたことを伝える",
      "相手から声がかかるまで待つ"
    ],
    [
      "ペア練習の準備が、集合時間に間に合わなさそう。どうする？",
      "早めに連絡して、先に始められることを伝える",
      "遅れそうだと分かった時点で連絡する",
      "到着してから事情を話す",
      "準備を終えることを優先する"
    ],
    [
      "見学先で、初めて会うスタッフ（キャスト）が近くを通りました。どんなふうに挨拶する？",
      "目を合わせて、自分から挨拶する",
      "目が合ったときに挨拶する",
      "一緒にいる人に合わせて挨拶する",
      "会釈で気持ちを伝える"
    ],
    [
      "練習モデルが「似合う髪型が分からない」と話しました。最初にすることは？",
      "普段の髪の悩みや、好きな雰囲気を聞く",
      "写真を一緒に見ながら好みを探る",
      "似合いそうな髪型をいくつか見せる",
      "自分が得意なスタイルを紹介する"
    ],
    [
      "初めてシャンプーを受けるモデルが緊張している様子。どう声をかける？",
      "これからすることを伝え、気になることがないか聞く",
      "温度や力加減は途中でも伝えていいと話す",
      "気分がほぐれるように軽く会話する",
      "静かに過ごせるよう、必要な声かけに絞る"
    ],
    [
      "次のモデルが来るまで数分。使った道具や席をどうする？",
      "道具と席を整え、次に使うものもそろえる",
      "使った道具を清潔にして席を整える",
      "先に目につくところから片づける",
      "片づけの順番を近くの先輩に確認する"
    ],
    [
      "練習はきれいに仕上がったけれど、時間がかかりました。次はどうする？",
      "どこで時間がかかったか見直し、質を保てる手順を試す",
      "先輩のお手本を見て、動きの違いを探す",
      "同じ手順でもう一度練習して時間を計る",
      "まずは同じ仕上がりを安定して出せるようにする"
    ],
    [
      "先輩に手の動かし方を教わりました。次の練習までに何をする？",
      "教わった動きを試し、迷った点をメモする",
      "教わったポイントを読み返しておく",
      "次の練習のはじめに動きを確認する",
      "次に先輩と練習できるときに一緒に確認する"
    ],
    [
      "「シャンプーを10分で」と目標を立てました。今日の練習をどう始める？",
      "10分を目指す理由を聞き、時間を計って一度試す",
      "まず時間を計り、今のペースを知る",
      "時間がかかりそうな動きを一つ練習する",
      "先輩の動きを見てから練習に取り入れる"
    ]
  ],
  "career": [
    [
      "カラーの待ち時間に予約が重なりがち。最初にどう動く？",
      "原因を整理し、チームで試せる改善を提案する",
      "同じ時間帯のスタッフ（キャスト）に状況を聞く",
      "自分の予約枠で調整できる部分を見直す",
      "ミーティングで話題になったら状況を伝える"
    ],
    [
      "前のお客様の施術が延び、次の予約に響きそうです。どう動く？",
      "早めに仲間に共有し、案内と引き継ぎを調整する",
      "受付に見込み時間を伝え、次のお客様への案内を頼む",
      "目の前の施術を進めながら、空いた時点で伝える",
      "自分で案内できるタイミングを待つ"
    ],
    [
      "施術中に初めてのお客様が来店。すぐに手が空かないときは？",
      "目を合わせて挨拶し、案内までの流れをひとこと伝える",
      "手を止められるタイミングで挨拶する",
      "受付に案内を任せ、担当するときに挨拶する",
      "軽く会釈して施術を続ける"
    ],
    [
      "お客様は短くしたいけれど、朝のセット時間は短め。どう提案する？",
      "普段のセットを聞き、無理なく再現できる長さを一緒に考える",
      "近いスタイルを見せ、手入れの違いを伝える",
      "希望の長さを優先し、自宅でのセット方法を伝える",
      "髪質を見て、自分が扱いやすいと思う形を勧める"
    ],
    [
      "お客様がカラーを決めきれないとき、どう説明する？",
      "迷っている点を聞き、色落ちや手入れの違いを比べて伝える",
      "色見本を並べ、仕上がりの違いを伝える",
      "自分ならどれを選ぶか、理由を添えて伝える",
      "決める時間を取れるよう、少し席を外す"
    ],
    [
      "施術が終わり、次のお客様が到着しました。席をどう整える？",
      "清掃・消毒を済ませ、次の施術に使う道具まで確認する",
      "清掃と消毒を済ませてから席に案内する",
      "仲間に席の準備を頼み、自分はお客様を迎える",
      "準備が整うまで受付でお待ちいただく"
    ],
    [
      "仕上がりは安定していますが、予定時間を超える日が続いています。まず何をする？",
      "工程ごとに時間を見て、質を保てる手順に見直す",
      "近い施術を担当する仲間の手順を参考にする",
      "予約枠を調整して、お客様を待たせないようにする",
      "余裕のある日に施術時間を振り返る"
    ],
    [
      "新しい薬剤を使うことになりました。施術前に何をする？",
      "基本と注意点を確認し、試してから施術に入る",
      "資料を読み、経験のある仲間に使い方を聞く",
      "手順を確認し、慣れた施術で使える場面を考える",
      "まず使い慣れた薬剤で対応し、学ぶ日を決める"
    ],
    [
      "再来の目標をチームで立てました。次の営業で何をする？",
      "目標の目的を確かめ、帰り際の次回提案を一つ試す",
      "前回の来店記録から、お客様の傾向を振り返る",
      "うまくいっているスタッフ（キャスト）に声かけを聞く",
      "次のミーティングでやることを決める"
    ]
  ]
};
const shortQuestionIndices = [0,1,3,4,6,7,11];
const weightedQuestionIndices = [0,1,2,3,4,6,7];
const diagnosisVersion = 5;
const usesWeightedScoring = version => version === 4 || version === 5;
const simpleQuestions = {
  "newgrad": [
    [
      "実習で、友だちが準備に困っています。どうする？",
      "声をかけて、何に困っているか聞く",
      "道具の場所を教える",
      "先生に伝える",
      "声をかけられるまで待つ"
    ],
    [
      "ペア練習に遅れそう。どうする？",
      "早めに連絡し、先にできることを伝える",
      "遅れそうだと連絡する",
      "着いてから理由を話す",
      "準備を終えてから連絡する"
    ],
    [
      "友だちが道具の片づけを手伝ってくれたら？",
      "何が助かったか伝え、相手も手伝う",
      "何が助かったか伝えてお礼を言う",
      "あとでひとことお礼を言う",
      "次に手が空いたときに手伝う"
    ],
    [
      "モデルが「似合う髪型が分からない」と言ったら？",
      "髪の悩みや好みを聞く",
      "写真を一緒に見て好みを探る",
      "似合いそうな髪型をいくつか見せる",
      "自分が得意な髪型を紹介する"
    ],
    [
      "シャンプー前に、モデルが緊張していたら？",
      "何をするか伝え、不安がないか聞く",
      "温度や力加減の希望を聞く",
      "軽く話して緊張をほぐす",
      "必要な声かけだけにする"
    ],
    [
      "きれいに仕上がったけど、時間がかかったら？",
      "時間がかかった部分を見直す",
      "先輩のやり方と比べる",
      "同じやり方でもう一度時間を計る",
      "まず仕上がりを安定させる"
    ],
    [
      "先輩に新しい技術を教わったら？",
      "自分で試して、疑問をメモする",
      "教わったポイントを読み返す",
      "次の練習の最初に試す",
      "次に先輩と一緒に練習する"
    ]
  ],
  "career": [
    [
      "予約が重なりやすい時間がある。どうする？",
      "原因を考え、チームに改善案を出す",
      "一緒に働くスタッフ（キャスト）に話を聞く",
      "自分の予約の入れ方を見直す",
      "会議で話題になったら伝える"
    ],
    [
      "施術が長引き、次の予約に遅れそう。どうする？",
      "早めに共有し、案内や引き継ぎを調整する",
      "受付に、あと何分かかるか伝える",
      "手が空いてから伝える",
      "自分で案内できるまで待つ"
    ],
    [
      "忙しい日に、仲間が片づけを手伝ってくれたら？",
      "何が助かったか伝え、相手の仕事も確認する",
      "何が助かったか伝えてお礼を言う",
      "落ち着いてからひとことお礼を言う",
      "次に手が空いたときに手伝う"
    ],
    [
      "短くしたいけど、朝のセットは楽にしたいお客様。どう提案する？",
      "普段のセットを聞き、長さを一緒に考える",
      "髪型の写真を見せ、手入れの違いを話す",
      "希望の長さにし、セット方法を伝える",
      "扱いやすいと思う髪型を勧める"
    ],
    [
      "お客様がカラーを決めきれないときは？",
      "何に迷っているか聞き、色落ちや手入れを比べる",
      "色見本を見せ、仕上がりの違いを話す",
      "自分ならどれを選ぶか理由も伝える",
      "考える時間を取れるように席を外す"
    ],
    [
      "仕上がりはいいけど、時間がかかる。どうする？",
      "時間がかかる作業を見直す",
      "仲間のやり方を参考にする",
      "予約時間に余裕を持たせる",
      "余裕のある日に振り返る"
    ],
    [
      "新しい薬剤を使う前に、何をする？",
      "使い方と注意点を確認し、試しておく",
      "説明を読み、使ったことのある仲間に聞く",
      "手順を見て、使える施術を考える",
      "今は慣れた薬剤を使い、学ぶ日を決める"
    ]
  ]
};
const axisWeights = [3,2,1];
const answerPoints = [10,9,6,3];
const appreciationScenarios = {
  newgrad: ["実習の片づけを、同じ班の人が手伝ってくれました。どうする？","何が助かったかを伝えてお礼を言い、自分も相手の片づけを手伝う","何が助かったかを伝えてお礼を言う","その場でひとことお礼を言う","次に手が空いたときに相手を手伝う"],
  career: ["忙しい日に、仲間が担当外の片づけまで引き受けてくれました。どうする？","何が助かったかを伝えてお礼を言い、相手の残りの仕事も確認する","何が助かったかを伝えてお礼を言う","落ち着いたときにひとことお礼を言う","次に手が空いたときに相手を手伝う"]
};
const questionCount = weightedQuestionIndices.length;
const matchThreshold = 85;
function questionAt(track,index,version) {
  if (version === 5) return simpleQuestions[track][index];
  if (version === 4 && index === 2) return appreciationScenarios[track];
  if (version === 4) index = weightedQuestionIndices[index];
  if (version === 3) index = shortQuestionIndices[index];
  if (index < 9 && version >= 2) return scenarios[track][index];
  const question = tracks[track].questions[index];
  return index < 9 ? [question,...scale] : question;
}
function assess(answers, version) {
  if (usesWeightedScoring(version)) {
    const earned = [0,0,0];
    const possible = [0,0,0];
    answers.forEach((value,index) => {
      const axis = Math.floor(weightedQuestionIndices[index] / 3);
      earned[axis] += answerPoints[value] * axisWeights[axis];
      possible[axis] += answerPoints[0] * axisWeights[axis];
    });
    const total = values => values.reduce((sum,value) => sum + value,0);
    return {scores:earned.map((points,i) => Math.round(100 * points / possible[i])),axisMax:100,percent:Math.round(100 * total(earned) / total(possible))};
  }
  const scores = [0,0,0];
  const short = answers.length === questionCount;
  const questionsPerAxis = short ? 2 : 3;
  const axisMax = questionsPerAxis * 3;
  answers.slice(0,questionsPerAxis * 3).forEach((value,i) => { scores[Math.floor(i / questionsPerAxis)] += 3 - value; });
  return {scores,axisMax,percent:Math.round(scores.reduce((a,b) => a+b,0) / (axisMax * 3) * 100)};
}

function describeResult(answers, track, version) {
  const {scores,axisMax,percent} = assess(answers,version);
  // Keep the same result for the same answers in the applicant and staff views.
  const seed = answers.reduce((hash,value) => Math.imul(hash ^ (value + 1),16777619) >>> 0,
    track === "career" ? 2166136261 : 2246822519);
  const offset = percent === 0 || percent === 100 ? 0 : (seed % 5) - 2;
  const displayPercent = usesWeightedScoring(version) ? percent : Math.max(0,Math.min(100,percent + offset + (percent === 0 ? 0 : Math.round((100-percent)*0.14))));
  const highest = Math.max(...scores);
  const leading = scores.map((score,i) => score === highest ? i : -1).filter(i => i >= 0);
  const strengths = [
    ["仲間にそっと手を差し伸べる","困っている人に気づいて声をかける。そんな小さな気配りが、仲間の安心につながりそうです。"],
    ["お客様の気持ちに寄り添う","まず話を聞いて、相手が安心できる言葉を選ぶ。お客様が気軽に相談できる関係をつくっていけそうです。"],
    ["できることを少しずつ増やす","教わったことを試して、できたことを次に生かす。その積み重ねが、技術を身につける力になりそうです。"]
  ];
  const combinations = {
    "01":["人をほっとさせる気配り","仲間にもお客様にも、相手の様子を見て声をかけることを大切にしているようです。さりげない一言で、緊張をほぐせそうです。"],
    "02":["仲間と一緒に伸びていく","教わったことを練習で試し、気づいたことを仲間と分かち合う。そんな学び方で、周りと一緒に成長していけそうです。"],
    "12":["学んだ技術を、誰かの笑顔に","技術を身につけることと、お客様の気持ちを知ること。どちらも大切にして、目の前の人に合う提案を考えていけそうです。"]
  };
  let story;
  if (highest / axisMax < 5 / 9) {
    story = ["「好き」を見つけるところから","今回の回答をヒントに、接客・技術・チームで働くことの中から、もっと知りたいと思うものを探してみましょう。実際の仕事を見ると、自分が心地よく働ける場面が見つかるかもしれません。"];
  } else if (leading.length === 3) {
    story = ["人も、技術も、大切に","仲間と協力すること、お客様の気持ちを聞くこと、教わったことを試すこと。どれにも目を向けられるのが、あなたらしさです。"];
  } else {
    story = leading.length === 1 ? strengths[leading[0]] : combinations[leading.join("")];
  }
  const tips = [
    "見学するなら、選んだテーマについて先輩に話を聞いてみてください。働く自分を想像するヒントになります。",
    "選んだテーマを覚えておくと、見学で何を聞こうか迷ったときに役立ちます。まずは気になることをひとつ聞いてみてください。",
    "見学では、選んだテーマにまつわる仕事の様子をのぞいてみてください。自分の「やってみたい」が見つかるかもしれません。"
  ];
  return {displayPercent,title:story[0],description:story[1],
    tip:usesWeightedScoring(version) ? "サロン見学では、キャスト同士の声かけや接客の様子もぜひ見てみてください。" : tips[(seed >>> 8) % tips.length]};
}

// 管理画面の部品（ChatGPT Sites 版 worker/index.js の管理画面部分を、そのまま取り出したもの）と、一覧ページの描画。
// 診断の質問・採点（diagnosis.js）はこの前に自動で連結される（build.mjs）。
const intentLabels = {visit:"サロン見学",apply:"応募",consult:"その他相談"};
const fields = {name:["お名前（漢字）",80],kana:["お名前（ふりがな）",100],school:["学校名",120],grade:["学年",40],instagram:["Instagram ID",40],consultation:["相談内容",1000]};
const escape = value => String(value).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function adminCard(row) {
  const application = row.application ? JSON.parse(row.application) : null;
  const profile = application ? '<details><summary>応募者情報</summary><dl>' +
    Object.entries(fields).map(([key,[label]]) => '<dt><strong>'+escape(label)+'</strong></dt><dd style="white-space:pre-wrap;overflow-wrap:anywhere">'+escape(application[key] || "未入力")+'</dd>').join("") +
    '<dt><strong>興味のある職種</strong></dt><dd>'+escape(application.jobs.join("・"))+'</dd></dl></details>' : "";
  const answers = JSON.parse(row.answers);
  const {scores,axisMax,percent} = answers ? assess(answers,row.question_version) : {scores:[]};
  const course = tracks[row.track];
  const summary = scores.map((score,i) => axes[i] + " " + score + "/" + axisMax).join(" ／ ");
  const weighted = usesWeightedScoring(row.question_version);
  const items = answers && answers.map((_,i) => {
    const scored = weighted || i < (axisMax === 6 ? questionCount - 1 : 9);
    const credoIndex = weighted ? weightedQuestionIndices[i] : row.question_version === 3 ? shortQuestionIndices[i] : i;
    const points = weighted ? answerPoints[answers[i]] * axisWeights[Math.floor(credoIndex / 3)] : 3 - answers[i];
    const [prompt,...choices] = questionAt(row.track,i,row.question_version);
    const answer = choices[answers[i]];
    return `<li>${escape(prompt)}<br><strong>${escape(answer)}</strong>${scored ? "（"+points+"点）<br>"+escape(credo[credoIndex]) : ""}</li>`;
  }).join("");
  const created = new Intl.DateTimeFormat("ja-JP",{dateStyle:"medium",timeStyle:"short",timeZone:"Asia/Tokyo"}).format(new Date(row.created));
  const status = row.status === "confirmed" ? "LINE確認済み" : row.line_accepted ? "LINE送信受付済み" : "LINE確認待ち";
  const action = row.status === "confirmed" ? "pending" : "confirmed";
  return `<article><h2>${escape(row.receipt)}</h2><p>${created} ／ ${intentLabels[row.intent]}${answers ? " ／ " + course.label : ""} ／ ${status}</p>
  <form method="post" action="/admin/status"><input type="hidden" name="receipt" value="${escape(row.receipt)}"><input type="hidden" name="status" value="${action}"><button>${action === "confirmed" ? "LINE確認済みにする" : "確認待ちに戻す"}</button></form>
  ${profile}${answers ? `<details><summary>診断の内訳と全回答</summary><p>回答点 ${percent}% ／ 応募者画面の目安 ${describeResult(answers,row.track,row.question_version).displayPercent}% ／ ${summary}${weighted && percent >= matchThreshold ? " ／ 行雲流水の価値観とよく合っています" : ""}</p><ol>${items}</ol></details>` : "<p>診断なし</p>"}</article>`;
}

// ---- 一覧ページ（ChatGPT Sites 版の GET /admin と同じ表示。PHP が埋め込んだデータをここで描画する）----
(function(){
  const data = JSON.parse(document.getElementById("admin-data").textContent);
  const rows = data.rows, totals = data.totals, query = data.query, pageNumber = data.pageNumber;
  const conversion = totals.completed ? new Intl.NumberFormat("ja-JP",{style:"percent",maximumFractionDigits:1}).format(totals.from_diagnosis / totals.completed) : "—（診断完了0件）";
  const previous = pageNumber > 1 ? '<a href="?page='+(pageNumber-1)+'">前へ</a> ' : "";
  const next = rows.length === 100 ? '<a href="?page='+(pageNumber+1)+'">次へ</a>' : "";
  document.body.innerHTML = `<h1>見学・応募の受付</h1><form method="post" action="/admin/logout"><button>ログアウト</button></form>
      <main><h2>適性診断と見学・相談の集計</h2><dl>
        <dt>診断を完了</dt><dd>${totals.completed}件</dd>
        <dt>診断だけで終了</dt><dd>${totals.diagnosis_only}件</dd>
        <dt>診断結果から見学・相談への進行率</dt><dd>${conversion}</dd>
        <dt>診断結果から見学・相談へ</dt><dd>${totals.from_diagnosis}件</dd>
        <dt>診断結果を経由せず見学・相談へ</dt><dd>${totals.direct}件</dd>
      </dl><p>公開後の累計です。同じタブでは操作ごとに1件として数えます。フォームへの移動は送信前に集計します。</p></main>
      <p>受付番号を検索して、LINE通知と診断結果を照合できます。</p>
      <form method="get" action="/admin"><label>受付番号 <input name="receipt" value="${escape(query)}"></label> <button>検索</button> <a href="/admin">全件表示</a></form>
      ${rows.map(adminCard).join("") || "<p>該当する受付はありません。</p>"}${query ? "" : previous+next}`;
})();
