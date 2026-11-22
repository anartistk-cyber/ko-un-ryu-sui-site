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



const html="<!doctype html>\n<html lang=\"ja\">\n<head>\n<meta charset=\"utf-8\">\n<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\n<title>採用マッチング | 株式会社行雲流水</title>\n<style>\n:root{color-scheme:light;--ink:#332539;--muted:#695963;--paper:#fffaf5;--white:#fff;--line:#e9d6df;--pink:#a71e58;--pink-dark:#79133d;--rose:#ffddeb;--lemon:#fff0ad;--mint:#dff3e8;--lilac:#eee5ff}\n*{box-sizing:border-box}\nbody{margin:0;background:var(--paper);color:var(--ink);font:16px/1.75 \"Nunito\",\"Yu Gothic UI\",\"Hiragino Sans\",Meiryo,sans-serif}\nh1,h2,h3,p,figure{margin:0}\nh1,h2,h3{line-height:1.35;font-weight:850;overflow-wrap:anywhere}\nh2{font-size:clamp(1.55rem,4vw,2.65rem)}\na{color:inherit;text-underline-offset:.25em}\nbutton,input,textarea,select{font:inherit;color:inherit}\nbutton,summary,select,input[type=checkbox],input[type=radio]{cursor:pointer}\nbutton:disabled{cursor:default;opacity:.55}\n[aria-disabled=true]{opacity:.55}\n[hidden]{display:none!important}\n:focus-visible{outline:3px solid #6536a7;outline-offset:4px}\n.wrap{width:min(1136px,calc(100% - 48px));margin-inline:auto}\n.skip{position:absolute;left:12px;top:-90px}\n.skip:focus{top:8px;z-index:5;background:white;padding:8px}\n.top{background:#fffdf9;border-bottom:1px solid var(--line)}\n.top .wrap,.top nav,.actions,.foot{display:flex;gap:12px;align-items:center;flex-wrap:wrap}\n.top .wrap{justify-content:space-between;padding-block:14px}\n.brand{font-weight:850;text-decoration:none}\n.top nav a{font-size:.88rem;text-decoration:none;font-weight:750;padding:8px 4px}\n.top nav a:hover{text-decoration:underline}\n.hero{display:grid;grid-template-columns:1fr 1fr;gap:clamp(15px,3vw,36px);align-items:center;padding:clamp(20px,4vw,48px);margin:26px 0 65px;background:radial-gradient(circle at 85% 0,#fff3bd,transparent 44%),linear-gradient(125deg,#ffe1ed,#f2e7ff);border-radius:32px}\n.eyebrow{font-size:.76rem;font-weight:850;letter-spacing:.14em;color:var(--pink-dark);margin-bottom:9px}\n.hero h1{font-size:clamp(1.95rem,4.55vw,3.85rem);letter-spacing:-.045em;line-height:1.17}\n.hero h1 span{color:var(--pink)}\n.hero-intro{max-width:34ch;margin-block:16px 20px;color:#554152}\n.entry-links{display:flex;flex-wrap:wrap;gap:10px}\n.button{display:inline-flex;align-items:center;justify-content:center;min-height:46px;padding:8px 16px;border:2px solid var(--pink);border-radius:14px;background:var(--pink);color:white;text-decoration:none;text-align:center;font-weight:800}\n.button:hover:not(:disabled){background:var(--pink-dark);border-color:var(--pink-dark)}\n.button.secondary{background:#fff;color:var(--pink-dark);border-color:#cc96b1}\n.button.secondary:hover:not(:disabled){background:#fff0f7;border-color:var(--pink)}\n.entry-links .secondary{background:var(--lemon);border-color:#bd8f39;color:#563613}\n.hero-visual{position:relative;border:5px solid white;border-radius:23px;overflow:hidden;background:#e9c2d6;box-shadow:0 8px 20px #5a21432a}\n.hero-visual img{display:block;width:100%;aspect-ratio:5/4;object-fit:cover;object-position:center}\n.hero-visual figcaption{position:absolute;bottom:11px;left:11px;padding:4px 11px;background:#fffaf4;color:#442738;border-radius:999px;font-size:.77rem;font-weight:800}\nsection{margin:0 0 58px;scroll-margin-top:18px}\n.intro{margin:8px 0 17px;color:var(--muted)}\n.panel,.card,details{border:1px solid var(--line);border-radius:20px;background:var(--white);padding:clamp(15px,2.8vw,29px)}\n#diagnosis{background:linear-gradient(120deg,#f4ebff,#ffeaf2);padding:clamp(14px,3.4vw,36px);border-radius:24px}\n#choose,#quiz,#results{border:0;box-shadow:0 5px 15px #67345410}\n.grid,.result-overview{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}\n.actions{margin-top:15px}\n.small,.tag,.result-next{font-size:.9rem;color:var(--muted)}\n.panel p,.card p,details p,.card address{margin-top:8px}\n#quiz-error,.error{color:#9e163b}\n.quiz-top{display:flex;justify-content:space-between;align-items:center;gap:12px}\n.quiz-top strong,.quiz-top span{padding:4px 12px;border-radius:999px;background:var(--lilac);font-size:.86rem}\n.quiz-top span{background:var(--lemon);font-weight:800;white-space:nowrap}\nprogress{width:100%;height:12px;accent-color:var(--pink);margin-top:12px}\n.question{margin:12px 0 15px;font-size:clamp(1.25rem,3vw,1.8rem)}\n.options{display:grid;gap:8px}\n.option{display:flex;align-items:center;gap:10px;padding:10px 12px;min-height:54px;border:1px solid var(--line);background:#fffbfd;border-radius:13px;cursor:pointer}\n.option:hover,.option:has(input:checked){border-color:var(--pink);background:#ffe9f4}\ninput[type=radio],input[type=checkbox]{accent-color:var(--pink);width:18px;height:18px;flex:none;vertical-align:middle}\n.result-overview{grid-template-columns:minmax(0,1fr) minmax(0,1.6fr);margin-top:12px}\n.result-tile{padding:clamp(14px,3vw,24px);border-radius:18px;background:var(--lemon)}\n.result-tile + .result-tile{background:var(--rose)}\n.result-label{font-size:.85rem;font-weight:850}\n.result-tile strong{display:block;font-size:clamp(1.28rem,3vw,1.95rem);line-height:1.35;margin-top:5px}\n#score{font-size:clamp(2.6rem,7vw,4.6rem);color:var(--pink-dark);letter-spacing:-.06em}\n.pathway{list-style:none;counter-reset:stage;padding:0;margin:0;grid-template-columns:repeat(4,minmax(0,1fr))}\n.pathway li{counter-increment:stage;background:var(--rose)}\n.pathway li:nth-child(2){background:var(--mint)}.pathway li:nth-child(3){background:var(--lemon)}.pathway li:nth-child(4){background:var(--lilac)}\n.pathway li::before{content:counter(stage);display:grid;place-items:center;width:32px;height:32px;border-radius:50%;background:white;color:var(--pink-dark);font-weight:850;margin-bottom:9px}\n.pathway h3{font-size:1.05rem}.pathway p{font-size:.88rem}\n.company-card{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;margin-bottom:14px;background:#f4ebff}\n.salon{padding:0;overflow:hidden}\n.salon .photo{display:block;width:100%;aspect-ratio:16/9;object-fit:cover;background:var(--rose)}\n.salon .body{padding:clamp(15px,3vw,25px)}\n.salon h3{font-size:1.65rem}.salon address{font-style:normal}\ndetails+details{margin-top:9px}summary{font-weight:800;padding:3px 0}\n.contact{background:#fff0f7}\n.field{display:grid;gap:5px;font-weight:750;margin-top:10px}\nselect,textarea,.field input{width:100%;min-height:46px;border:1px solid #a6899c;border-radius:10px;background:white;padding:8px}\ntextarea{resize:vertical}\n.application-fields{margin:10px 0;padding:12px;border:1px solid var(--line);border-radius:14px;min-width:0}\n.application-fields fieldset{border:0;margin:15px 0;padding:0;min-width:0}\n.job-options{display:flex;gap:8px;flex-wrap:wrap}\n.job-options label{padding:5px 9px;background:#fff0f7;border-radius:8px}\n.job-options label:has(input:checked){background:var(--rose)}\n.foot{padding:20px 0;border-top:1px solid var(--line);font-size:.87rem}\n@media(max-width:790px){.pathway{grid-template-columns:repeat(2,minmax(0,1fr))}}\n@media(max-width:640px){\n .wrap{width:calc(100% - 26px)}\n .top .wrap{gap:3px;padding-block:9px}.top nav{gap:7px}.top nav a{padding-block:5px}\n .hero{grid-template-columns:1fr;gap:16px;margin:12px 0 38px;padding:16px;border-radius:22px}\n .hero h1{font-size:clamp(1.65rem,7.6vw,2.8rem)}\n .hero-intro{margin:9px 0 12px}\n .hero-visual img{aspect-ratio:16/9}\n .entry-links .button{flex:1 1 auto;padding-inline:9px;font-size:.9rem}\n section{margin-bottom:36px}\n .grid,.result-overview{grid-template-columns:1fr;gap:10px}\n .pathway li{display:grid;grid-template-columns:32px 1fr;column-gap:9px;padding:11px 12px}\n .pathway li::before{grid-row:span 2;margin:0}.pathway li p{grid-column:2;margin-top:2px}\n}\r\n/* Pop recruitment theme */\n:root{--paper:#fff9f5;--pink:#b2185c;--pink-dark:#831444;--ink:#352237;--lemon:#ffea80;--rose:#ffd6e8;--mint:#d4f3e4;--lilac:#eaddff;--line:#efbfd6}\nbody{background:radial-gradient(circle,#edb9d14d 1px,transparent 1.2px) 0 0/19px 19px,var(--paper)}\n.top{background:#fffdfb}.brand{color:var(--pink-dark)}\n.hero{position:relative;isolation:isolate;background:linear-gradient(140deg,#ffd2e8 0%,#ffe7f2 61%,#f2dfff 100%);border:2px solid #e293ba;box-shadow:0 6px 0 #f4b9d4;margin-top:20px}\n.hero h1 span{background:linear-gradient(transparent 68%,#ffec83 68% 92%,transparent 92%);box-decoration-break:clone;-webkit-box-decoration-break:clone}\n.hero-visual{margin:8px 6px 12px;border-width:8px;border-bottom-width:34px;border-radius:12px;transform:rotate(2.2deg);box-shadow:0 9px 0 #ac568833,0 14px 26px #64204929}\n.hero-visual figcaption{bottom:0;left:0;transform:translateY(0);position:static;text-align:center;background:white;margin-bottom:-26px;line-height:20px}\n.hero-visual{border-bottom-width:8px}.hero-visual figcaption{margin-bottom:0;padding:5px}\n.hero-photo{position:relative;min-width:0}\n.hero-photo::after{content:\"✦\";position:absolute;right:0;top:0;pointer-events:none;display:grid;place-items:center;width:43px;height:43px;border-radius:50%;background:var(--lemon);color:#7e321c;font-size:1.35rem;transform:rotate(12deg);box-shadow:0 3px 0 #ad57423b}\n.button{border-radius:999px;box-shadow:0 3px 0 #75133e;font-weight:850}\n.button.secondary{box-shadow:0 3px 0 #e2a1bf}\n.entry-links .secondary{box-shadow:0 3px 0 #b27b32}\n.button:active:not(:disabled){transform:translateY(2px);box-shadow:none}\n#diagnosis{background:#f3e5ff;border:2px solid #d7baef;box-shadow:0 5px 0 #e8d5fa}\n#choose,#quiz,#results{border:1px solid #e5c8ef;box-shadow:0 4px 0 #e0c9ef}\n.quiz-top strong{background:#ffe0ef;color:#6e2148}.quiz-top span{background:#fff0a4;color:#5b3510}\n.option{border-width:2px;border-radius:16px;box-shadow:0 2px 0 #f1d5e3}\n.option:has(input:checked){border-color:#b2185c;background:#ffdced;box-shadow:0 2px 0 #b2185c}\n.result-tile{border:2px solid #e3ba63}.result-tile + .result-tile{border-color:#ed9ec3}\n#score{font-size:clamp(2.9rem,8vw,5.3rem)}\n.pathway li{box-shadow:0 4px 0 #e9cddc;border:1px solid #dcbdd1}\n.pathway li::before{border:1px solid #e9bed1}\n.salon,.company-card,details,.contact{box-shadow:0 4px 0 #f1d6e3}\n.salon .body{background:#fff0f7}.salon+.salon .body{background:#e9f8ef}\n.company-card{background:#f0e6ff}\n.contact{background:#ffe5f1}\n#visit-template{min-height:42px;font-size:.86rem}\n@media(max-width:640px){.hero{padding:15px;margin-top:13px}.hero-visual{margin:4px 9px 7px;transform:rotate(1.6deg)}.hero-photo::after{right:3px;width:36px;height:36px}.hero h1{line-height:1.25}.entry-links{gap:8px}.entry-links .button{min-height:47px}.pathway li{min-height:60px}}\r\n\n/* Illustration, action cards and career timeline */\n.hero{background:radial-gradient(circle,#d9659c32 1.4px,transparent 1.7px) 0 0/18px 18px,linear-gradient(145deg,#ffd6e9,#fff3c8);gap:24px}\n.hero-photo::after{content:none}\n.hero-visual{transform:rotate(2deg);margin:5px 15px 16px 12px}\n.salon-sticker{position:absolute;z-index:2;right:0;bottom:13px;display:grid;place-items:center;width:76px;height:76px;border:3px solid #fff;border-radius:46% 54% 53% 47%;background:#e2f8e9;color:#76324f;transform:rotate(12deg);box-shadow:0 4px 0 #77344a29}\n.salon-sticker svg,.entry-icon svg{width:75%;height:75%;fill:none;stroke:currentColor;stroke-width:2.7;stroke-linecap:round;stroke-linejoin:round}\n.entry-links{grid-column:1/-1;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}\n.entry-card{display:grid;grid-template-columns:46px minmax(0,1fr) auto;align-items:center;gap:11px;min-height:80px;padding:12px 14px;border:2px solid #ad1a57;border-radius:19px;background:#fff;color:var(--ink);box-shadow:0 4px 0 #d987ab;text-decoration:none}\n.entry-card:hover{background:#fff2f8}.entry-card + .entry-card{border-color:#8f6a2b;background:#fff4b5;box-shadow:0 4px 0 #d3a85c}\n.entry-card + .entry-card:hover{background:#fff9dc}\n.entry-icon{display:grid;place-items:center;width:46px;height:46px;border-radius:16px;background:#ffdfed;color:#9a2054}\n.entry-card + .entry-card .entry-icon{background:#fffdf1;color:#795420}\n.entry-card strong,.entry-card small{display:block;line-height:1.45}\n.entry-card strong{font-size:1.08rem}.entry-card small{color:#5c4756;margin-top:3px}\n.entry-arrow{font-weight:850;color:#831444}\n.pathway{position:relative;gap:12px}\n.pathway li{position:relative;padding-top:15px}\n.pathway li::before{position:relative;z-index:1}\n.pathway li::after{content:\"\";position:absolute;left:32px;right:-28px;top:31px;border-top:2px dashed #ac5275;pointer-events:none}\n.pathway li:last-child::after{display:none}\n.pathway h3,.pathway p{position:relative}\n.progress-dots{display:grid;grid-template-columns:repeat(7,1fr);gap:5px;margin-top:9px}\n.progress-dots i{height:7px;border-radius:9px;background:#eee1f6}\n.progress-dots i.done{background:#b2185c}\n.progress-dots i.current{background:#ef9bc1}\n#quiz progress{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);margin:0}\n@media(max-width:790px) and (min-width:641px){.pathway li:nth-child(even)::after{display:none}}\n@media(max-width:640px){\n .hero{gap:12px}.hero-visual{margin:2px 14px 8px 6px}.salon-sticker{width:54px;height:54px;bottom:4px}\n .entry-links{grid-template-columns:1fr;gap:8px}.entry-card{min-height:60px;padding:8px 10px;grid-template-columns:38px minmax(0,1fr) auto}.entry-icon{width:38px;height:38px}.entry-card strong{font-size:1rem}\n .pathway li::after{left:27px;right:auto;top:31px;bottom:-32px;border-top:0;border-left:2px dashed #ac5275}\n}\r\n\n/* Colorful type and gentle motion */\n.hero{background:radial-gradient(circle,#ab397a32 1.5px,transparent 1.9px) 0 0/19px 19px,linear-gradient(137deg,#ffc9e4 3%,#f4d9ff 57%,#fff2af 100%)}\n.hero h1{font-size:clamp(2.4rem,5.3vw,4.35rem);font-weight:900;letter-spacing:-.07em;line-height:1.23}\n.hero h1 .hero-line{display:inline-block;color:#4e2661;background:none}\n.hero h1 .hero-accent{display:inline-block;color:#a21960;background:linear-gradient(transparent 68%,#ffe775 68% 94%,transparent 94%);text-shadow:1px 2px #fff8f5}\n.hero h1 .hero-happy{color:#a21960;background:none}\n.hero-intro{font-weight:700}\n.hero-photo .salon-sticker{background:#baf0de;color:#612a5a}\n.entry-card{border-color:#9a2765;box-shadow:0 5px 0 #d87caa}\n.entry-card strong{font-size:clamp(1.17rem,2.2vw,1.48rem);color:#871e59}\n.entry-card + .entry-card strong{color:#5a3712}\n.entry-card small{font-size:.86rem}\n#diagnosis h2,#pathway h2,#salons h2,#philosophy h2{color:#652665}\n.question{font-size:clamp(1.35rem,3.5vw,2.05rem);color:#562857;line-height:1.5}\n#results h3{font-size:clamp(1.5rem,4vw,2.1rem);color:#8c245b}\n.result-tile{background:#fff1a6}.result-tile + .result-tile{background:#ffd9f0}\n#score{font-size:clamp(3.25rem,8vw,5.5rem);color:#782782}\n.pathway li:nth-child(2)::before{background:#067352;color:white}\n.pathway li:nth-child(3)::before{background:#805219;color:white}\n.pathway li:nth-child(4)::before{background:#673f9b;color:white}\n@media(max-width:640px){.hero h1{font-size:clamp(1.85rem,8.3vw,3rem)}.entry-card strong{font-size:1.12rem}}\n@media(prefers-reduced-motion:no-preference){\n .hero-line,.hero-accent{animation:recruit-rise .55s cubic-bezier(.18,.65,.4,1) both}\n .hero-accent{animation-delay:.10s}\n .salon-sticker{animation:recruit-wiggle .8s .2s ease-out both}\n #results:not([hidden]) .result-tile{animation:recruit-rise .35s ease-out both}\n #results:not([hidden]) .result-tile + .result-tile{animation-delay:.1s}\n .entry-card{transition:transform .18s ease,background-color .18s ease}\n .entry-card:hover{transform:translateY(-2px)}\n}\n@keyframes recruit-rise{from{opacity:0;transform:translateY(9px) scale(.98)}to{opacity:1;transform:translateY(0) scale(1)}}\n@keyframes recruit-wiggle{0%{transform:rotate(-10deg) scale(.91)}50%{transform:rotate(18deg) scale(1.05)}100%{transform:rotate(12deg) scale(1)}}\r\n\n.button.line{background:#06c755;border-color:#06c755;color:#fff;box-shadow:0 3px 0 #04813a}.button.line:hover{background:#05a648;border-color:#05a648}</style>\n</head>\n<body>\n<a class=\"skip\" href=\"#main\">本文へ</a>\n<header class=\"top\" id=\"top\"><div class=\"wrap\"><a href=\"#top\" class=\"brand\">株式会社行雲流水</a><nav aria-label=\"ページ内メニュー\"><a href=\"#diagnosis\">診断</a><a href=\"#salons\">サロン</a><a href=\"#philosophy\">理念</a><a href=\"#pathway\">入社後の流れ</a></nav></div></header>\n<main id=\"main\" class=\"wrap\">\n<div class=\"hero\"><div class=\"hero-copy\"><p class=\"eyebrow\">泉大津 · 美容師採用</p><h1><span class=\"hero-line\">らしさを輝かせ、</span><br><span class=\"hero-accent\">自分史上<span class=\"hero-happy\">最幸</span>に。</span></h1><p class=\"hero-intro\">美容学生も、経験のある美容師さんも。7問で、自分が大切にしたい働き方を見つけよう。</p></div><div class=\"hero-photo\"><figure class=\"hero-visual\"><img src=\"https://ko-un-ryu-sui.com/images/flow-cloud-team-hero_18f9702b.jpg\" alt=\"FLOWCLOUDのキャスト\" fetchpriority=\"high\" width=\"800\" height=\"640\"><figcaption>FLOWCLOUDのキャスト</figcaption></figure><span class=\"salon-sticker\" aria-hidden=\"true\"><svg viewBox=\"0 0 48 48\" aria-hidden=\"true\" focusable=\"false\"><circle cx=\"12\" cy=\"33\" r=\"6\"/><circle cx=\"28\" cy=\"36\" r=\"6\"/><path d=\"m16 29 22-19-9 20M25 30 14 8l5 19m18-7v11m-5-6h10\"/></svg></span></div><nav class=\"entry-links\" aria-label=\"採用メニュー\"><a class=\"entry-card\" href=\"#diagnosis\" data-entry=\"diagnose\"><span class=\"entry-icon\"><svg viewBox=\"0 0 48 48\" aria-hidden=\"true\" focusable=\"false\"><path d=\"M24 38 9 24C-2 13 14 4 24 16 34 4 50 13 39 24Z\"/><path d=\"M33 8l2-5m5 10 5-2\"/></svg></span><span><strong>7問の適性診断</strong><small>大切にしたい働き方を見つけよう</small></span><span class=\"entry-arrow\" aria-hidden=\"true\">→</span></a><a class=\"entry-card\" href=\"#diagnosis\" data-entry=\"visit\"><span class=\"entry-icon\"><svg viewBox=\"0 0 48 48\" aria-hidden=\"true\" focusable=\"false\"><rect x=\"8\" y=\"12\" width=\"32\" height=\"29\" rx=\"5\"/><path d=\"M15 7v10m18-10v10M8 22h32m-22 9 4 4 8-8\"/></svg></span><span><strong>見学・相談</strong><small>お店を見たい、話を聞いてみたい</small></span><span class=\"entry-arrow\" aria-hidden=\"true\">→</span></a></nav></div>\n\n<section id=\"diagnosis\">\n<p class=\"eyebrow\" id=\"entry-label\">CAREER MATCH</p><h2 id=\"entry-heading\">あなたの価値観を知る</h2>\n<p class=\"intro\" id=\"entry-intro\">今のあなたに近い答えを選んでね。結果は自分を知るためのヒントです。</p>\n<form id=\"choose\" class=\"panel\">\n<label class=\"field\" id=\"course-field\">診断コース<select id=\"course\" name=\"course\"><option value=\"newgrad\">美容学生・新卒</option><option value=\"career\">中途</option></select></label>\n<fieldset id=\"application-fields\" class=\"application-fields\">\n<legend>応募者情報</legend>\n<label class=\"field\">見学・相談<select id=\"intent\"><option value=\"visit\">サロン見学</option><option value=\"consult\">その他相談</option></select></label>\n<label class=\"field\">お名前（漢字）<input name=\"name\" autocomplete=\"name\" maxlength=\"80\" required></label>\n<label class=\"field\">お名前（ふりがな）<input name=\"kana\" maxlength=\"100\" required></label>\n<label class=\"field\">学校名<input name=\"school\" maxlength=\"120\" required></label>\n<label class=\"field\">学年<input name=\"grade\" maxlength=\"40\" placeholder=\"例：2年、卒業済み\" required></label>\n<label class=\"field\">Instagram ID（任意）<input name=\"instagram\" maxlength=\"40\" placeholder=\"@アカウント名\"></label>\n<fieldset><legend>興味のある職種（複数選択可）</legend><div class=\"job-options\">\n<label><input type=\"checkbox\" name=\"jobs\" value=\"美容師\"> 美容師</label>\n<label><input type=\"checkbox\" name=\"jobs\" value=\"アイリスト\"> アイリスト</label>\n<label><input type=\"checkbox\" name=\"jobs\" value=\"エステ\"> エステ</label>\n<label><input type=\"checkbox\" name=\"jobs\" value=\"ネイリスト\"> ネイリスト</label>\n<label><input type=\"checkbox\" name=\"jobs\" value=\"レセプション\"> レセプション</label>\n<label><input type=\"checkbox\" name=\"jobs\" value=\"その他\"> その他</label>\n</div></fieldset>\n<button type=\"button\" class=\"button secondary\" id=\"visit-template\">見学希望日のテンプレートを入れる</button>\n<label class=\"field\">相談内容<textarea id=\"consultation\" name=\"consultation\" rows=\"4\" maxlength=\"1000\" required></textarea></label>\n</fieldset>\n<p id=\"profile-note\" class=\"small\">診断だけでもOK。回答はこの画面で確認できます。</p>\n<p id=\"profile-status\" class=\"small error\" role=\"status\"></p>\n<div class=\"actions\"><button class=\"button\" id=\"start-quiz\">診断スタート ♡</button></div>\n</form>\n<form class=\"panel\" id=\"quiz\" hidden>\n<div class=\"quiz-top\"><strong id=\"track-label\"></strong><span id=\"step\"></span></div>\n<progress id=\"progress\" max=\"7\" value=\"1\" aria-label=\"診断の進捗\"></progress><div class=\"progress-dots\" id=\"progress-dots\" aria-hidden=\"true\"></div>\n<h3 class=\"question\" id=\"question\" tabindex=\"-1\"></h3>\n<div class=\"options\" id=\"options\" role=\"group\" aria-labelledby=\"question\"></div>\n<p class=\"small error\" id=\"quiz-error\" role=\"alert\" hidden>回答を1つ選んでください。</p>\n<div class=\"actions\"><button class=\"button secondary\" type=\"button\" id=\"back\">戻る</button><button class=\"button\" id=\"next\">次の質問へ →</button></div>\n</form>\n<div class=\"panel\" id=\"results\" hidden>\n<h3 tabindex=\"-1\" id=\"result-heading\">あなたの診断結果 ♡</h3>\n<div class=\"result-overview\">\n<div class=\"result-tile\"><p class=\"result-label\"><span aria-hidden=\"true\">♡</span> 価値観のマッチ度の目安</p><strong id=\"score\"></strong><p id=\"match-message\"></p></div>\n<div class=\"result-tile\"><p class=\"result-label\"><span aria-hidden=\"true\">✿</span> あなたのいいところ</p><strong id=\"salon-result\"></strong><p id=\"salon-caption\" class=\"result-next\"></p><p id=\"result-tip\" class=\"result-next\"></p></div>\n</div>\n<div class=\"actions\"><a class=\"button\" href=\"#diagnosis\" data-intent=\"0\">見学・相談してみる →</a><a class=\"button line\" href=\"https://line.me/R/oaMessage/%40512rmwnk/?%E3%83%9E%E3%83%83%E3%83%81%E3%83%B3%E3%82%B0%E8%A8%BA%E6%96%AD%E3%82%92%E5%8F%97%E3%81%91%E3%81%BE%E3%81%97%E3%81%9F%E3%80%82%E8%A6%8B%E5%AD%A6%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6%E7%9B%B8%E8%AB%87%E3%81%97%E3%81%9F%E3%81%84%E3%81%A7%E3%81%99%E3%80%82\" target=\"_blank\" rel=\"noopener\">LINEで相談する ↗</a><button type=\"button\" class=\"button secondary\" id=\"revise\">回答を見直す</button><button type=\"button\" class=\"button secondary\" id=\"restart\">最初から</button></div>\n</div>\n</section>\n\n<section id=\"pathway\">\n<p class=\"eyebrow\">YOUR FIRST STEPS</p><h2>入社からのキャリアステップ</h2>\n<p class=\"intro\">入社後の成長の目安です。</p>\n<ol class=\"pathway grid\">\n<li class=\"card\"><h3>FLOWCLOUDで基礎を学ぶ</h3><p>コンシェルジュとして、接客や技術の基礎を身につけます。</p></li>\n<li class=\"card\"><h3>1年後、glowでデビュー</h3><p>Jrスタイリストまたはアイリストとしてのデビューを目指します。</p></li>\n<li class=\"card\"><h3>さらに1年後、月間総売上50万円へ</h3><p>スタイリストとしての次の目標。</p></li>\n<li class=\"card\"><h3>さらに1年後、月間総売上100万円へ</h3><p>さらに技術を磨き、次の目標へ。</p></li>\n</ol>\n</section>\n<section id=\"salons\">\n<p class=\"eyebrow\">OUR SALONS</p><h2>泉大津の、ふたつのサロン</h2><p class=\"intro\">働く場所の雰囲気と、それぞれのサロンで出会える美容を紹介します。</p>\n<article class=\"card company-card\"><div><h3>株式会社行雲流水</h3><p>会社の想い、教育と成長、募集要項をご覧いただけます。</p></div><a class=\"button secondary\" href=\"https://ko-un-ryu-sui.com/\">行雲流水の公式ページへ ↗</a></article>\n\n<div class=\"grid\">\n<article class=\"card salon\"><img class=\"photo\" src=\"https://ko-un-ryu-sui.com/images/flow-cloud-exterior_9a36efba.jpg\" alt=\"FLOWCLOUDの外観\" loading=\"lazy\" width=\"800\" height=\"450\"><div class=\"body\"><h3>FLOWCLOUD</h3><p>完全予約制・会員制のサロン。半個室でのヘッドスパが特徴。髪質改善・縮毛矯正・頭皮ケアで、一人ひとりの悩みに寄り添います。</p><address class=\"small\">泉大津市東雲町1-20<br>南海本線 泉大津駅から徒歩約3分</address><div class=\"actions\"><a href=\"https://www.flowcloud.net/\">FLOWCLOUD公式サイト ↗</a></div></div></article>\n<article class=\"card salon\"><img class=\"photo\" src=\"https://ko-un-ryu-sui.com/images/glow-reception_7c41b63c.jpg\" alt=\"glowの受付\" loading=\"lazy\" width=\"800\" height=\"450\"><div class=\"body\"><h3>glow</h3><p>ショート・ショートボブやレイヤーカット、髪質改善カラーなどをマンツーマンで提案。似合わせと日々の扱いやすさを大切にしています。まつエク・エステもあります。</p><address class=\"small\">泉大津市旭町18-3 いずみおおつCITY 1F<br>南海本線 泉大津駅東口から徒歩約1分</address><div class=\"actions\"><a href=\"https://glow-izumiotsu.jp/\">glow公式サイト ↗</a></div></div></article>\n</div>\n</section>\n\n<section id=\"philosophy\">\n<p class=\"eyebrow\">OUR PHILOSOPHY</p><h2>行雲流水が大切にすること</h2><p class=\"intro\">自分らしく、しなやかに。変化を楽しみながら、人と社会に価値を流し続ける。</p>\n<details open><summary>経営理念・経営ビジョン</summary><p><strong>らしさを輝かせ、自分史上最幸になる。</strong><br>美容・商品・教育を通じて、一人ひとりの個性と魅力を磨き、自ら未来を切り拓く力を育みます。</p><p><strong>幸せの環がつながる社会を創る。</strong><br>お客様、仲間、地域、業界へ。一人の幸せから、応援し合い、共に成長できる社会へ。</p></details>\n<details><summary>人事理念・教育理念・9credo</summary><p><strong>圧倒的当事者意識～誠実・挑戦・学習～</strong><br><strong>人を想う可能思考～感謝心・素直心・向上心～</strong></p><p>9credo～応援し応援される人になる～</p><div id=\"credo-list\"></div></details>\n<details><summary>3つの幸せの循環</summary><p><strong>お客様の幸せ（ありがとうのバトン）</strong> — 美しさと自信を手にした人が、まわりへ笑顔と優しさを広げる。</p><p><strong>仲間の幸せ（応援のエネルギー）</strong> — 挑戦を応援し、支えられたことに感謝する。その連鎖が次の成長を生む。</p><p><strong>業界の幸せ（全員が主役の未来）</strong> — 知識・技術・成功事例を分かち合い、美容師が誇りを持って働ける環境を広げる。</p></details>\n<details><summary>経営戦略・3つの事業</summary><p><strong>美容業界の「理想」をすべて叶える。</strong><br>現場（美容室）× 商品（開発）× 人（教育）の力で、現場の課題を解決し、得た知見を業界に分かち合う。</p><p><strong>美容室事業（ハピネスリング構想）</strong><br>人生に寄り添う、生涯美容パートナー。<br>地域で最も愛される幸せ創造サロンになる。</p><p><strong>商品開発事業（美ノベーション）</strong><br>科学の力で、その人らしい美を解き放つ。<br>美容の常識を超える価値を世界へ届ける。</p><p><strong>人材開発事業（行雲流水塾）</strong><br>自ら考え、自ら動く人を育てる。<br>応援し、応援される人財があふれる社会を創る。</p><p>事業ドメイン <strong>幸せ体験創造業</strong></p></details>\n</section>\n\n<section id=\"contact\" class=\"panel contact\" hidden>\n<h2>見学・応募を相談する</h2>\n<p class=\"intro\">入力内容を受付番号と一緒に、行雲流水の採用担当のLINEへ送ります。</p>\n<form id=\"request-form\">\n\n<p class=\"small\">入力内容は見学・相談への対応に利用し、受付番号と一緒に採用担当へLINEで通知します。詳しくは<a href=\"/privacy\">プライバシーポリシー</a>をご確認ください。</p><p><label><input id=\"consent\" type=\"checkbox\" required> 入力した情報と、診断を受けた場合はその回答を、採用担当に共有することに同意します。</label></p>\n<div class=\"actions\"><button class=\"button\" id=\"register\">送信する</button></div>\n<p id=\"request-status\" class=\"small\" role=\"status\"></p>\n</form>\n</section>\n</main>\n<footer class=\"wrap foot\"><span>株式会社行雲流水</span><a href=\"#top\">ページ上部へ ↑</a><a href=\"/privacy\">プライバシーポリシー</a></footer>\n<script src=\"diagnosis.js?v=5-cast\"></script>\n<script>\n\"use strict\";\nconst byId = id => document.getElementById(id);\nlet track = null;\nlet index = 0;\nlet answers = [];\nlet visitId;\nasync function recordFunnel(event) {\n  try {\n    if (!visitId) {\n      try { visitId = sessionStorage.getItem(\"recruit-funnel-id\"); } catch {}\n      visitId ||= crypto.randomUUID();\n      try { sessionStorage.setItem(\"recruit-funnel-id\",visitId); } catch {}\n    }\n    await fetch(\"/api/funnel\",{\n      method:\"POST\",\n      headers:{\"Content-Type\":\"application/json\"},\n      body:JSON.stringify({visitId,event}),\n      keepalive:true\n    });\n  } catch {\n    // A network error must not interrupt the diagnosis or form.\n  }\n}\n\nfunction append(parent, tag, value) {\n  const element = document.createElement(tag);\n  element.textContent = value;\n  parent.append(element);\n  return element;\n}\nfunction show(id) {\n  for (const view of [\"choose\",\"quiz\",\"results\"]) byId(view).hidden = view !== id;\n}\nfunction renderQuestion() {\n  byId(\"progress-dots\").innerHTML = Array.from({length:questionCount}, (_, i) => i < index ? '<i class=\"done\"></i>' : i === index ? '<i class=\"current\"></i>' : \"<i></i>\").join(\"\");\n  show(\"quiz\");\n  byId(\"contact\").hidden = true;\n  byId(\"track-label\").textContent = tracks[track].label;\n  byId(\"step\").textContent = (index + 1) + \" / \" + questionCount;\n  byId(\"progress\").value = index + 1;\n  const [prompt,...choices] = questionAt(track,index,diagnosisVersion);\n  byId(\"question\").textContent = prompt;\n  byId(\"options\").replaceChildren();\n  byId(\"quiz-error\").hidden = true;\n  choices.forEach((_, position) => {\n    const value = (position + index + 1) % choices.length;\n    const option = choices[value];\n    const label = append(byId(\"options\"), \"label\", \"\");\n    label.className = \"option\";\n    const radio = document.createElement(\"input\");\n    radio.type = \"radio\";\n    radio.name = \"answer\";\n    radio.value = value;\n    radio.checked = answers[index] === value;\n    label.append(radio, document.createTextNode(option));\n  });\n  byId(\"next\").textContent = index === questionCount - 1 ? \"診断結果を見る ♡\" : \"次の質問へ →\";\n  byId(\"question\").focus();\n}\nfunction renderResult() {\n  const result = describeResult(answers,track,diagnosisVersion);\n  byId(\"score\").textContent = result.displayPercent + \"%\";\n  byId(\"salon-result\").textContent = result.title;\n  byId(\"salon-caption\").textContent = result.description;\n  byId(\"match-message\").textContent = result.displayPercent >= matchThreshold\n    ? \"行雲流水の価値観とよく合っています ♡\"\n    : \"サロン見学で、あなたが大切にしたいことを見つけてみませんか？\";\n  byId(\"result-tip\").textContent = result.tip;\n  byId(\"contact\").hidden = true;\n  updateMessage();\n  show(\"results\");\n  void recordFunnel(\"diagnosis_completed\");\n  byId(\"result-heading\").focus();\n}\nlet receipt = null;\nlet submissionId = null;\nlet lastPayload = null;\nlet requestPending = false;\nfunction updateMessage() {\n  receipt = null;\n  byId(\"register\").disabled = false;\n  byId(\"request-status\").textContent = \"\";\n  byId(\"consent\").checked = false;\n}\n\nlet application;\nlet entry = \"diagnose\";\nfunction selectEntry(value, fromResult = false) {\n  entry = value;\n  if (!fromResult) {\n    track = null;\n    answers = [];\n  }\n  const diagnosisOnly = value === \"diagnose\";\n  byId(\"entry-label\").textContent = diagnosisOnly ? \"CAREER MATCH\" : \"SALON RECRUIT\";\n  byId(\"entry-heading\").textContent = diagnosisOnly ? \"あなたの価値観を知る\" : \"見学・相談\";\n  byId(\"entry-intro\").textContent = diagnosisOnly\n    ? \"今のあなたに近い答えを選んでね。結果は自分を知るためのヒントです。\"\n    : \"必要な情報を入力して、採用担当に送ってね。\";\n  const fields = byId(\"application-fields\");\n  byId(\"course-field\").hidden = !diagnosisOnly;\n  byId(\"course\").disabled = !diagnosisOnly;\n  if (!diagnosisOnly) {\n    byId(\"intent\").value = value;\n    updateVisitTemplate();\n  }\n  fields.hidden = diagnosisOnly;\n  fields.disabled = diagnosisOnly;\n  byId(\"profile-note\").textContent = diagnosisOnly\n    ? \"診断だけでもOK。回答はこの画面で確認できます。\"\n    : \"共有に同意すると、入力内容を採用担当が確認できます。\";\n  byId(\"start-quiz\").textContent = diagnosisOnly ? \"診断スタート ♡\" : \"送信内容の確認へ →\";\n  byId(\"profile-status\").textContent = \"\";\n  byId(\"contact\").hidden = true;\n  show(\"choose\");\n  updateMessage();\n}\ndocument.querySelectorAll(\"[data-entry]\").forEach(link => link.addEventListener(\"click\", event => {\n  if (requestPending) { event.preventDefault(); return; }\n  selectEntry(link.dataset.entry);\n  if (link.dataset.entry === \"visit\") void recordFunnel(\"direct_to_form\");\n}));\nbyId(\"choose\").addEventListener(\"submit\", event => {\n  event.preventDefault();\n  const form = new FormData(event.currentTarget);\n  if (entry === \"diagnose\") {\n    track = form.get(\"course\");\n    index = 0;\n    answers = [];\n    renderQuestion();\n    return;\n  }\n  const profile = Object.fromEntries([\"name\",\"kana\",\"school\",\"grade\",\"instagram\",\"consultation\"].map(key => [key,form.get(key).trim()]));\n  profile.jobs = form.getAll(\"jobs\");\n  const blank = Object.keys(profile).find(key => key !== \"instagram\" && key !== \"jobs\" && !profile[key]);\n  const status = byId(\"profile-status\");\n  if (blank) {\n    status.textContent = \"必須項目を入力してください。\";\n    event.currentTarget.elements.namedItem(blank).focus();\n    return;\n  }\n  if (!profile.jobs.length) {\n    status.textContent = \"興味のある職種を1つ以上選んでください。\";\n    byId(\"application-fields\").querySelector('[name=\"jobs\"]').focus();\n    return;\n  }\n  status.textContent = \"\";\n  application = profile;\n\n  updateMessage();\n  byId(\"contact\").hidden = false;\n  byId(\"contact\").scrollIntoView();\n  byId(\"consent\").focus({preventScroll:true});\n});\nbyId(\"quiz\").addEventListener(\"change\", event => {\n  if (event.target.name !== \"answer\") return;\n  answers[index] = Number(event.target.value);\n  byId(\"quiz-error\").hidden = true;\n});\nbyId(\"quiz\").addEventListener(\"submit\", event => {\n  event.preventDefault();\n  if (answers[index] === undefined) {\n    byId(\"quiz-error\").hidden = false;\n    byId(\"options\").querySelector(\"input\").focus();\n    return;\n  }\n  if (index === questionCount - 1) {\n    renderResult();\n  } else {\n    index++;\n    renderQuestion();\n  }\n});\nbyId(\"back\").addEventListener(\"click\", () => {\n  if (index === 0) {\n    show(\"choose\");\n    byId(\"course\").focus();\n  } else {\n    index--;\n    renderQuestion();\n  }\n});\nbyId(\"revise\").addEventListener(\"click\", () => {\n  index = 0;\n  renderQuestion();\n});\nbyId(\"restart\").addEventListener(\"click\", () => {\n  byId(\"choose\").reset();\n  byId(\"profile-status\").textContent = \"\";\n  application = undefined;\n  track = null;\n  answers = [];\n  index = 0;\n  updateMessage();\n  selectEntry(\"diagnose\");\n  byId(\"course\").focus();\n});\nconst visitTemplate = \"【見学希望日】\\n第1希望：○月○日（○） ○時ごろ\\n第2希望：○月○日（○） ○時ごろ\\n第3希望：○月○日（○） ○時ごろ\";\nconst consultation = byId(\"consultation\");\nfunction updateVisitTemplate() {\n  const visiting = byId(\"intent\").value === \"visit\";\n  byId(\"visit-template\").hidden = !visiting;\n  consultation.placeholder = visiting ? visitTemplate : \"聞いてみたいことや、応募について伝えたいこと\";\n}\nbyId(\"intent\").addEventListener(\"change\", () => {\n  updateVisitTemplate();\n  byId(\"contact\").hidden = true;\n  updateMessage();\n});\nbyId(\"visit-template\").addEventListener(\"click\", () => {\n  if (!consultation.value.includes(\"【見学希望日】\")) {\n    const existing = consultation.value.trim();\n    if (existing && existing.length + visitTemplate.length + 2 > consultation.maxLength) {\n      byId(\"profile-status\").textContent = \"希望日を追加するには、相談内容を少し短くしてください。\";\n      consultation.focus();\n      return;\n    }\n    byId(\"profile-status\").textContent = \"\";\n    consultation.value = existing ? existing + \"\\n\\n\" + visitTemplate : visitTemplate;\n    consultation.dispatchEvent(new Event(\"input\",{bubbles:true}));\n  }\n  consultation.focus();\n});\nbyId(\"application-fields\").addEventListener(\"input\", () => {\n  byId(\"contact\").hidden = true;\n  updateMessage();\n});\ndocument.querySelectorAll(\"[data-intent]\").forEach(link => link.addEventListener(\"click\", event => {\n  if (requestPending) { event.preventDefault(); return; }\n  event.preventDefault();\n  selectEntry(link.dataset.intent === \"0\" ? \"visit\" : \"consult\", true);\n  void recordFunnel(\"diagnosis_to_form\");\n  byId(\"diagnosis\").scrollIntoView();\n  byId(\"intent\").focus({preventScroll:true});\n}));\nbyId(\"request-form\").addEventListener(\"submit\", async event => {\n  event.preventDefault();\n  if (requestPending || receipt || !byId(\"consent\").checked || byId(\"contact\").hidden) return;\n  if (location.protocol === \"file:\") {\n    byId(\"request-status\").textContent = \"受付を使うには、採用アプリのサーバーから開いてください。\";\n    return;\n  }\n  const intent = byId(\"intent\").value;\n  requestPending = true;\n  const controls = document.querySelectorAll(\"#register,#choose fieldset,#start-quiz,#consent,[data-intent],#revise,#restart\");\n  controls.forEach(control => {\n    if (control.matches(\"a\")) control.setAttribute(\"aria-disabled\",\"true\");\n    else control.disabled = true;\n  });\n  const status = byId(\"request-status\");\n  status.textContent = \"送信しています…\";\n  try {\n    const payload = {track,questionVersion:diagnosisVersion,answers:answers.length === questionCount ? answers : null,intent,consent:true,application};\n    const snapshot = JSON.stringify(payload);\n    if (snapshot !== lastPayload) {\n      submissionId = crypto.randomUUID();\n      lastPayload = snapshot;\n    }\n    const response = await fetch(\"/api/requests\", {\n      method:\"POST\",\n      headers:{\"Content-Type\":\"application/json\"},\n      body:JSON.stringify({...payload,submissionId})\n    });\n    const result = await response.json();\n    if (!response.ok) {\n      if (result.error === \"line retry expired\" && result.receipt) {\n        status.textContent = \"受付番号 \" + result.receipt + \"。通知の再送期限が過ぎました。この番号を採用担当にお伝えください。\";\n        receipt = result.receipt;\n        return;\n      }\n      status.textContent = result.receipt\n        ? \"受付番号 \" + result.receipt + \"。LINE通知を確認できませんでした。同じ内容で再送できます。\"\n        : \"送信できませんでした。時間をおいてお試しください。\";\n      return;\n    }\n    receipt = result.receipt;\n    status.textContent = \"送信しました ♡ 受付番号 \" + receipt;\n  } catch {\n    status.textContent = \"送信を確認できませんでした。同じ内容で再送できます。\";\n  } finally {\n    requestPending = false;\n    controls.forEach(control => {\n      if (control.matches(\"a\")) control.removeAttribute(\"aria-disabled\");\n      else control.disabled = control.id === \"register\" && Boolean(receipt);\n    });\n  }\n});\naxes.forEach((axis,i) => {\n  append(byId(\"credo-list\"),\"p\",axis);\n  const list = append(byId(\"credo-list\"),\"ol\",\"\");\n  list.start = i*3+1;\n  credo.slice(i*3,i*3+3).forEach(item => append(list,\"li\",item));\n});\nselectEntry(\"diagnose\");\n</script>\n<script>\n(() => {\n  const link = document.querySelector('#results a.button.line');\n  if (!link) return;\n  const fields = [\"track-label\", \"score\", \"salon-result\"].map(id => document.getElementById(id));\n  function updateLineLink() {\n    const [track, score, strength] = fields.map(field => field?.textContent.trim() || \"\");\n    const lines = [\n      \"【採用のご相談】\",\n      \"①ご希望：\" + track,\n      \"②お名前：\"\n    ];\n    if (score && strength) {\n      lines.push(\"③マッチング診断の結果：価値観のマッチ度 \" + score + \"／いいところ「\" + strength + \"」\",\n        \"④ご質問・見学のご希望日など：\");\n    } else {\n      lines.push(\"③ご質問・見学のご希望日など：\");\n    }\n    link.href = \"https://line.me/R/oaMessage/%40512rmwnk/?\" + encodeURIComponent(lines.join(\"\\n\"));\n  }\n  const observer = new MutationObserver(updateLineLink);\n  fields.filter(Boolean).forEach(field => observer.observe(field, {childList: true, characterData: true, subtree: true}));\n  link.addEventListener(\"click\", updateLineLink);\n  updateLineLink();\n})();\n</script>\n</body>\n</html>\n\n\n\n\n\n\n\n";
const privacy="<!doctype html>\n<html lang=\"ja\"><head><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width,initial-scale=1\">\n<title>プライバシーポリシー | 株式会社行雲流水</title>\n<style>body{margin:0;background:#fff9fc;color:#3b2540;font:16px/1.8 system-ui,sans-serif}main{max-width:720px;margin:auto;padding:24px 18px 48px}section{background:white;border:1px solid #efcee1;border-radius:18px;padding:14px 20px;margin:12px 0}h1{font-size:clamp(1.6rem,5vw,2.3rem)}h2{font-size:1.15rem;margin:.25em 0}p,ul{margin:.5em 0}a{color:#89204d;text-underline-offset:.22em}</style></head>\n<body><main><a href=\"/\">← 採用サイトへ戻る</a>\n<h1>プライバシーポリシー</h1>\n<p>株式会社行雲流水は、採用マッチングサイトで受け付ける情報を、以下のとおり取り扱います。</p>\n<section><h2>取得する情報</h2><p>見学・相談フォームを送信すると、お名前（漢字・ふりがな）、学校名、学年、Instagram ID（任意）、興味のある職種、希望する手続き、相談内容（見学希望日時など）を取得します。適性診断からフォームへ進んだ場合は、診断コースと回答も一緒に送信されます。受付時には受付番号と受付日時を記録します。</p><p>適性診断だけを利用する場合、回答と結果はブラウザー内で処理します。</p><p>診断完了と見学・相談フォームを開いた経路を、サイト改善のために集計します。集計にはブラウザーのタブ内で使うランダムな識別子と操作の種類を記録し、氏名、連絡先、診断の回答や結果は含めません。</p></section>\n<section><h2>利用目的</h2><p>見学の日程調整、相談への回答、応募の受付と選考に関する連絡、受付内容の確認に利用します。Instagram IDを入力された場合は、見学・相談についての連絡や本人の確認に利用することがあります。診断回答は、興味や希望を理解し、見学や面談での会話の参考にします。</p></section>\n<section><h2>保存とLINE通知</h2><p>送信内容は、採用サイトのデータベースに保存されます。フォームの入力内容と受付番号は、行雲流水のLINE公式アカウントから、設定された採用担当者のLINEへ通知します。診断の回答と内訳は、ログインが必要な採用担当画面で確認します。</p><p>サイトの運用と受付の保存にはChatGPT Sitesを、通知にはLINEのMessaging APIを利用します。</p></section>\n<section><h2>個人情報についてのお問い合わせ</h2><p>情報の取り扱い、開示・訂正・削除などのご相談は、株式会社行雲流水の<a href=\"https://line.me/R/ti/p/@512rmwnk\">公式LINE</a>へご連絡ください。受付番号がある場合はお知らせください。</p></section>\n</main></body></html>";
const script="const axes = [\"人間力（感謝心）\",\"接遇力（素直心）\",\"技術力（向上心）\"];\nconst credo = [\n  \"誠実に一所懸命に、肯定的に自分事と捉え、自主的に行動する\",\n  \"協調性を大切に、礼節を重んじる、約束、時間、規則を守る\",\n  \"笑顔で元気よく、感じの良い挨拶、返事、立ち居振舞いをする\",\n  \"お客様が主役、お客様の立場にたった謙虚な接客をする\",\n  \"心配りからの声かけ、丁寧で正確な説明や情報を提供する\",\n  \"整理整頓、身だしなみを整え、心身共に健全である\",\n  \"時間と質、意味と価値、効果と効率を考え、生産性を上げる\",\n  \"基本を忠実に、学びを継続し、復習予習、事前準備をする\",\n  \"数字とタスクの目標目的を理解し、すぐに実践をする\"\n];\nconst scale = [\"そう思う\",\"ややそう思う\",\"あまりそう思わない\",\"そう思わない\"];\nconst tracks = {\n  newgrad: {\n    label:\"美容学生・新卒\",\n    tip:\"先輩から技術のフィードバックを受ける機会や、デビューまでにどんな実践を積むかを聞いてみましょう。\",\n    questions:[\n      \"実習で困っている人がいたら、自分にできることを考えて声をかけたい。\",\n      \"チームで練習するとき、集合時間や道具の片付けなど、決めた約束を大切にしたい。\",\n      \"初めて会うお客様にも、自分から明るく挨拶できるようになりたい。\",\n      \"自分が勧めたいスタイルがあっても、まずお客様の悩みや希望を聞く練習がしたい。\",\n      \"緊張しているお客様に気づいたら、次に何をするか分かりやすく伝えたい。\",\n      \"気持ちよく過ごしていただけるよう、道具や身だしなみを整える習慣をつけたい。\",\n      \"技術の練習では、仕上がりと時間を振り返り、改善できる手順を探したい。\",\n      \"先輩に教わった基本を、次の練習までに復習しておきたい。\",\n      \"レッスンの目標が決まったら、達成する意味を理解して、今日の練習に取り入れたい。\",\n      [\"まず身につけてみたいのは？\",\"シャンプーやヘッドスパ\",\"カットやカラー\",\"お客様との話し方\",\"これから見つけたい\"],\n      [\"どんなときに学びやすい？\",\"先輩にお手本を見せてもらうとき\",\"一緒に練習するとき\",\"自分で試して感想をもらうとき\",\"いろいろ試してみたい\"],\n      [\"見学でいちばん知りたいことは？\",\"お店やスタッフ（キャスト）の雰囲気\",\"コンシェルジュの仕事\",\"デビューまでの練習\",\"見学しながら考えたい\"]\n    ]\n  },\n  career: {\n    label:\"中途美容師\",\n    tip:\"これまでの経験を生かせる施術や、入社後に深めたい技術、希望する働き方を相談してみましょう。\",\n    questions:[\n      \"施術や予約の流れに課題を見つけたら、自分事としてチームに改善案を出したい。\",\n      \"予約が重なる日も、約束した時間や引き継ぎを守れるよう、早めに仲間と調整したい。\",\n      \"忙しい時間帯も、表情や挨拶、返事で安心してもらえる接客を意識したい。\",\n      \"得意な施術があっても、お客様の生活や希望を聞いてから提案を組み立てたい。\",\n      \"仕上がりや施術についてお客様が迷っていたら、選びやすいよう選択肢や注意点を説明したい。\",\n      \"施術の合間にも、次のお客様を迎えるためにセット面や道具を整えたい。\",\n      \"施術の質と時間を振り返り、お客様への価値につながる手順を見直したい。\",\n      \"慣れた技術でも、基本や薬剤知識を学び直し、次の施術に備えたい。\",\n      \"再来や施術時間の目標を立てるときは、その目的を確かめて、すぐ試せる行動に落とし込みたい。\",\n      [\"次の職場で伸ばしてみたいのは？\",\"髪質改善やヘッドスパ\",\"似合わせカットやカラー\",\"カウンセリングや後輩育成\",\"見学しながら考えたい\"],\n      [\"新しい環境でまず知りたいことは？\",\"お客様との関わり方\",\"技術の学び方\",\"スタッフ（キャスト）同士の働き方\",\"今の経験を生かせる仕事\"],\n      [\"見学で聞いてみたいのは？\",\"どんな技術を深められるか\",\"これまでの経験をどう生かせるか\",\"働き方をどう相談できるか\",\"見学しながら考えたい\"]\n    ]\n  }\n};\nconst scenarios = {\n  \"newgrad\": [\n    [\n      \"実習で、隣の子が道具の準備に困っています。自分の準備が終わったら？\",\n      \"声をかけて、困っていることを聞く\",\n      \"使えそうな道具の場所を伝える\",\n      \"先生に気づいたことを伝える\",\n      \"相手から声がかかるまで待つ\"\n    ],\n    [\n      \"ペア練習の準備が、集合時間に間に合わなさそう。どうする？\",\n      \"早めに連絡して、先に始められることを伝える\",\n      \"遅れそうだと分かった時点で連絡する\",\n      \"到着してから事情を話す\",\n      \"準備を終えることを優先する\"\n    ],\n    [\n      \"見学先で、初めて会うスタッフ（キャスト）が近くを通りました。どんなふうに挨拶する？\",\n      \"目を合わせて、自分から挨拶する\",\n      \"目が合ったときに挨拶する\",\n      \"一緒にいる人に合わせて挨拶する\",\n      \"会釈で気持ちを伝える\"\n    ],\n    [\n      \"練習モデルが「似合う髪型が分からない」と話しました。最初にすることは？\",\n      \"普段の髪の悩みや、好きな雰囲気を聞く\",\n      \"写真を一緒に見ながら好みを探る\",\n      \"似合いそうな髪型をいくつか見せる\",\n      \"自分が得意なスタイルを紹介する\"\n    ],\n    [\n      \"初めてシャンプーを受けるモデルが緊張している様子。どう声をかける？\",\n      \"これからすることを伝え、気になることがないか聞く\",\n      \"温度や力加減は途中でも伝えていいと話す\",\n      \"気分がほぐれるように軽く会話する\",\n      \"静かに過ごせるよう、必要な声かけに絞る\"\n    ],\n    [\n      \"次のモデルが来るまで数分。使った道具や席をどうする？\",\n      \"道具と席を整え、次に使うものもそろえる\",\n      \"使った道具を清潔にして席を整える\",\n      \"先に目につくところから片づける\",\n      \"片づけの順番を近くの先輩に確認する\"\n    ],\n    [\n      \"練習はきれいに仕上がったけれど、時間がかかりました。次はどうする？\",\n      \"どこで時間がかかったか見直し、質を保てる手順を試す\",\n      \"先輩のお手本を見て、動きの違いを探す\",\n      \"同じ手順でもう一度練習して時間を計る\",\n      \"まずは同じ仕上がりを安定して出せるようにする\"\n    ],\n    [\n      \"先輩に手の動かし方を教わりました。次の練習までに何をする？\",\n      \"教わった動きを試し、迷った点をメモする\",\n      \"教わったポイントを読み返しておく\",\n      \"次の練習のはじめに動きを確認する\",\n      \"次に先輩と練習できるときに一緒に確認する\"\n    ],\n    [\n      \"「シャンプーを10分で」と目標を立てました。今日の練習をどう始める？\",\n      \"10分を目指す理由を聞き、時間を計って一度試す\",\n      \"まず時間を計り、今のペースを知る\",\n      \"時間がかかりそうな動きを一つ練習する\",\n      \"先輩の動きを見てから練習に取り入れる\"\n    ]\n  ],\n  \"career\": [\n    [\n      \"カラーの待ち時間に予約が重なりがち。最初にどう動く？\",\n      \"原因を整理し、チームで試せる改善を提案する\",\n      \"同じ時間帯のスタッフ（キャスト）に状況を聞く\",\n      \"自分の予約枠で調整できる部分を見直す\",\n      \"ミーティングで話題になったら状況を伝える\"\n    ],\n    [\n      \"前のお客様の施術が延び、次の予約に響きそうです。どう動く？\",\n      \"早めに仲間に共有し、案内と引き継ぎを調整する\",\n      \"受付に見込み時間を伝え、次のお客様への案内を頼む\",\n      \"目の前の施術を進めながら、空いた時点で伝える\",\n      \"自分で案内できるタイミングを待つ\"\n    ],\n    [\n      \"施術中に初めてのお客様が来店。すぐに手が空かないときは？\",\n      \"目を合わせて挨拶し、案内までの流れをひとこと伝える\",\n      \"手を止められるタイミングで挨拶する\",\n      \"受付に案内を任せ、担当するときに挨拶する\",\n      \"軽く会釈して施術を続ける\"\n    ],\n    [\n      \"お客様は短くしたいけれど、朝のセット時間は短め。どう提案する？\",\n      \"普段のセットを聞き、無理なく再現できる長さを一緒に考える\",\n      \"近いスタイルを見せ、手入れの違いを伝える\",\n      \"希望の長さを優先し、自宅でのセット方法を伝える\",\n      \"髪質を見て、自分が扱いやすいと思う形を勧める\"\n    ],\n    [\n      \"お客様がカラーを決めきれないとき、どう説明する？\",\n      \"迷っている点を聞き、色落ちや手入れの違いを比べて伝える\",\n      \"色見本を並べ、仕上がりの違いを伝える\",\n      \"自分ならどれを選ぶか、理由を添えて伝える\",\n      \"決める時間を取れるよう、少し席を外す\"\n    ],\n    [\n      \"施術が終わり、次のお客様が到着しました。席をどう整える？\",\n      \"清掃・消毒を済ませ、次の施術に使う道具まで確認する\",\n      \"清掃と消毒を済ませてから席に案内する\",\n      \"仲間に席の準備を頼み、自分はお客様を迎える\",\n      \"準備が整うまで受付でお待ちいただく\"\n    ],\n    [\n      \"仕上がりは安定していますが、予定時間を超える日が続いています。まず何をする？\",\n      \"工程ごとに時間を見て、質を保てる手順に見直す\",\n      \"近い施術を担当する仲間の手順を参考にする\",\n      \"予約枠を調整して、お客様を待たせないようにする\",\n      \"余裕のある日に施術時間を振り返る\"\n    ],\n    [\n      \"新しい薬剤を使うことになりました。施術前に何をする？\",\n      \"基本と注意点を確認し、試してから施術に入る\",\n      \"資料を読み、経験のある仲間に使い方を聞く\",\n      \"手順を確認し、慣れた施術で使える場面を考える\",\n      \"まず使い慣れた薬剤で対応し、学ぶ日を決める\"\n    ],\n    [\n      \"再来の目標をチームで立てました。次の営業で何をする？\",\n      \"目標の目的を確かめ、帰り際の次回提案を一つ試す\",\n      \"前回の来店記録から、お客様の傾向を振り返る\",\n      \"うまくいっているスタッフ（キャスト）に声かけを聞く\",\n      \"次のミーティングでやることを決める\"\n    ]\n  ]\n};\nconst shortQuestionIndices = [0,1,3,4,6,7,11];\nconst weightedQuestionIndices = [0,1,2,3,4,6,7];\nconst diagnosisVersion = 5;\nconst usesWeightedScoring = version => version === 4 || version === 5;\nconst simpleQuestions = {\n  \"newgrad\": [\n    [\n      \"実習で、友だちが準備に困っています。どうする？\",\n      \"声をかけて、何に困っているか聞く\",\n      \"道具の場所を教える\",\n      \"先生に伝える\",\n      \"声をかけられるまで待つ\"\n    ],\n    [\n      \"ペア練習に遅れそう。どうする？\",\n      \"早めに連絡し、先にできることを伝える\",\n      \"遅れそうだと連絡する\",\n      \"着いてから理由を話す\",\n      \"準備を終えてから連絡する\"\n    ],\n    [\n      \"友だちが道具の片づけを手伝ってくれたら？\",\n      \"何が助かったか伝え、相手も手伝う\",\n      \"何が助かったか伝えてお礼を言う\",\n      \"あとでひとことお礼を言う\",\n      \"次に手が空いたときに手伝う\"\n    ],\n    [\n      \"モデルが「似合う髪型が分からない」と言ったら？\",\n      \"髪の悩みや好みを聞く\",\n      \"写真を一緒に見て好みを探る\",\n      \"似合いそうな髪型をいくつか見せる\",\n      \"自分が得意な髪型を紹介する\"\n    ],\n    [\n      \"シャンプー前に、モデルが緊張していたら？\",\n      \"何をするか伝え、不安がないか聞く\",\n      \"温度や力加減の希望を聞く\",\n      \"軽く話して緊張をほぐす\",\n      \"必要な声かけだけにする\"\n    ],\n    [\n      \"きれいに仕上がったけど、時間がかかったら？\",\n      \"時間がかかった部分を見直す\",\n      \"先輩のやり方と比べる\",\n      \"同じやり方でもう一度時間を計る\",\n      \"まず仕上がりを安定させる\"\n    ],\n    [\n      \"先輩に新しい技術を教わったら？\",\n      \"自分で試して、疑問をメモする\",\n      \"教わったポイントを読み返す\",\n      \"次の練習の最初に試す\",\n      \"次に先輩と一緒に練習する\"\n    ]\n  ],\n  \"career\": [\n    [\n      \"予約が重なりやすい時間がある。どうする？\",\n      \"原因を考え、チームに改善案を出す\",\n      \"一緒に働くスタッフ（キャスト）に話を聞く\",\n      \"自分の予約の入れ方を見直す\",\n      \"会議で話題になったら伝える\"\n    ],\n    [\n      \"施術が長引き、次の予約に遅れそう。どうする？\",\n      \"早めに共有し、案内や引き継ぎを調整する\",\n      \"受付に、あと何分かかるか伝える\",\n      \"手が空いてから伝える\",\n      \"自分で案内できるまで待つ\"\n    ],\n    [\n      \"忙しい日に、仲間が片づけを手伝ってくれたら？\",\n      \"何が助かったか伝え、相手の仕事も確認する\",\n      \"何が助かったか伝えてお礼を言う\",\n      \"落ち着いてからひとことお礼を言う\",\n      \"次に手が空いたときに手伝う\"\n    ],\n    [\n      \"短くしたいけど、朝のセットは楽にしたいお客様。どう提案する？\",\n      \"普段のセットを聞き、長さを一緒に考える\",\n      \"髪型の写真を見せ、手入れの違いを話す\",\n      \"希望の長さにし、セット方法を伝える\",\n      \"扱いやすいと思う髪型を勧める\"\n    ],\n    [\n      \"お客様がカラーを決めきれないときは？\",\n      \"何に迷っているか聞き、色落ちや手入れを比べる\",\n      \"色見本を見せ、仕上がりの違いを話す\",\n      \"自分ならどれを選ぶか理由も伝える\",\n      \"考える時間を取れるように席を外す\"\n    ],\n    [\n      \"仕上がりはいいけど、時間がかかる。どうする？\",\n      \"時間がかかる作業を見直す\",\n      \"仲間のやり方を参考にする\",\n      \"予約時間に余裕を持たせる\",\n      \"余裕のある日に振り返る\"\n    ],\n    [\n      \"新しい薬剤を使う前に、何をする？\",\n      \"使い方と注意点を確認し、試しておく\",\n      \"説明を読み、使ったことのある仲間に聞く\",\n      \"手順を見て、使える施術を考える\",\n      \"今は慣れた薬剤を使い、学ぶ日を決める\"\n    ]\n  ]\n};\nconst axisWeights = [3,2,1];\nconst answerPoints = [10,9,6,3];\nconst appreciationScenarios = {\n  newgrad: [\"実習の片づけを、同じ班の人が手伝ってくれました。どうする？\",\"何が助かったかを伝えてお礼を言い、自分も相手の片づけを手伝う\",\"何が助かったかを伝えてお礼を言う\",\"その場でひとことお礼を言う\",\"次に手が空いたときに相手を手伝う\"],\n  career: [\"忙しい日に、仲間が担当外の片づけまで引き受けてくれました。どうする？\",\"何が助かったかを伝えてお礼を言い、相手の残りの仕事も確認する\",\"何が助かったかを伝えてお礼を言う\",\"落ち着いたときにひとことお礼を言う\",\"次に手が空いたときに相手を手伝う\"]\n};\nconst questionCount = weightedQuestionIndices.length;\nconst matchThreshold = 85;\nfunction questionAt(track,index,version) {\n  if (version === 5) return simpleQuestions[track][index];\n  if (version === 4 && index === 2) return appreciationScenarios[track];\n  if (version === 4) index = weightedQuestionIndices[index];\n  if (version === 3) index = shortQuestionIndices[index];\n  if (index < 9 && version >= 2) return scenarios[track][index];\n  const question = tracks[track].questions[index];\n  return index < 9 ? [question,...scale] : question;\n}\nfunction assess(answers, version) {\n  if (usesWeightedScoring(version)) {\n    const earned = [0,0,0];\n    const possible = [0,0,0];\n    answers.forEach((value,index) => {\n      const axis = Math.floor(weightedQuestionIndices[index] / 3);\n      earned[axis] += answerPoints[value] * axisWeights[axis];\n      possible[axis] += answerPoints[0] * axisWeights[axis];\n    });\n    const total = values => values.reduce((sum,value) => sum + value,0);\n    return {scores:earned.map((points,i) => Math.round(100 * points / possible[i])),axisMax:100,percent:Math.round(100 * total(earned) / total(possible))};\n  }\n  const scores = [0,0,0];\n  const short = answers.length === questionCount;\n  const questionsPerAxis = short ? 2 : 3;\n  const axisMax = questionsPerAxis * 3;\n  answers.slice(0,questionsPerAxis * 3).forEach((value,i) => { scores[Math.floor(i / questionsPerAxis)] += 3 - value; });\n  return {scores,axisMax,percent:Math.round(scores.reduce((a,b) => a+b,0) / (axisMax * 3) * 100)};\n}\n\nfunction describeResult(answers, track, version) {\n  const {scores,axisMax,percent} = assess(answers,version);\n  // Keep the same result for the same answers in the applicant and staff views.\n  const seed = answers.reduce((hash,value) => Math.imul(hash ^ (value + 1),16777619) >>> 0,\n    track === \"career\" ? 2166136261 : 2246822519);\n  const offset = percent === 0 || percent === 100 ? 0 : (seed % 5) - 2;\n  const displayPercent = usesWeightedScoring(version) ? percent : Math.max(0,Math.min(100,percent + offset + (percent === 0 ? 0 : Math.round((100-percent)*0.14))));\n  const highest = Math.max(...scores);\n  const leading = scores.map((score,i) => score === highest ? i : -1).filter(i => i >= 0);\n  const strengths = [\n    [\"仲間にそっと手を差し伸べる\",\"困っている人に気づいて声をかける。そんな小さな気配りが、仲間の安心につながりそうです。\"],\n    [\"お客様の気持ちに寄り添う\",\"まず話を聞いて、相手が安心できる言葉を選ぶ。お客様が気軽に相談できる関係をつくっていけそうです。\"],\n    [\"できることを少しずつ増やす\",\"教わったことを試して、できたことを次に生かす。その積み重ねが、技術を身につける力になりそうです。\"]\n  ];\n  const combinations = {\n    \"01\":[\"人をほっとさせる気配り\",\"仲間にもお客様にも、相手の様子を見て声をかけることを大切にしているようです。さりげない一言で、緊張をほぐせそうです。\"],\n    \"02\":[\"仲間と一緒に伸びていく\",\"教わったことを練習で試し、気づいたことを仲間と分かち合う。そんな学び方で、周りと一緒に成長していけそうです。\"],\n    \"12\":[\"学んだ技術を、誰かの笑顔に\",\"技術を身につけることと、お客様の気持ちを知ること。どちらも大切にして、目の前の人に合う提案を考えていけそうです。\"]\n  };\n  let story;\n  if (highest / axisMax < 5 / 9) {\n    story = [\"「好き」を見つけるところから\",\"今回の回答をヒントに、接客・技術・チームで働くことの中から、もっと知りたいと思うものを探してみましょう。実際の仕事を見ると、自分が心地よく働ける場面が見つかるかもしれません。\"];\n  } else if (leading.length === 3) {\n    story = [\"人も、技術も、大切に\",\"仲間と協力すること、お客様の気持ちを聞くこと、教わったことを試すこと。どれにも目を向けられるのが、あなたらしさです。\"];\n  } else {\n    story = leading.length === 1 ? strengths[leading[0]] : combinations[leading.join(\"\")];\n  }\n  const tips = [\n    \"見学するなら、選んだテーマについて先輩に話を聞いてみてください。働く自分を想像するヒントになります。\",\n    \"選んだテーマを覚えておくと、見学で何を聞こうか迷ったときに役立ちます。まずは気になることをひとつ聞いてみてください。\",\n    \"見学では、選んだテーマにまつわる仕事の様子をのぞいてみてください。自分の「やってみたい」が見つかるかもしれません。\"\n  ];\n  return {displayPercent,title:story[0],description:story[1],\n    tip:usesWeightedScoring(version) ? \"サロン見学では、キャスト同士の声かけや接客の様子もぜひ見てみてください。\" : tips[(seed >>> 8) % tips.length]};\n}\n";
const intentLabels = {visit:"サロン見学",apply:"応募",consult:"その他相談"};
const jobs = ["美容師","アイリスト","エステ","ネイリスト","レセプション","その他"];
const fields = {name:["お名前（漢字）",80],kana:["お名前（ふりがな）",100],school:["学校名",120],grade:["学年",40],instagram:["Instagram ID",40],consultation:["相談内容",1000]};
function parseApplication(input) {
  if (!input || !Array.isArray(input.jobs) || input.jobs.length === 0 ||
      input.jobs.length > jobs.length || !input.jobs.every(job => jobs.includes(job))) return null;
  const result = {jobs:[...new Set(input.jobs)]};
  for (const [key,[,limit]] of Object.entries(fields)) {
    const raw = input[key] ?? "";
    if (typeof raw !== "string") return null;
    const value = raw.trim();
    if (value.length > limit || (!value && key !== "instagram")) return null;
    result[key] = value;
  }
  return result;
}
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

async function sendLine(row, application, env, origin) {
  const profile = application ? Object.entries(fields)
    .map(([key,[label]]) => label + " " + (application[key] || "未入力")) : [];
  if (application) profile.push("興味のある職種 " + application.jobs.join("・"));
  const message = ["行雲流水 採用受付", "受付番号 " + row.receipt,
    "区分 " + intentLabels[row.intent] + (row.answers === "null" ? "" : " ／ " + tracks[row.track].label),
    ...profile, "診断 " + (row.answers === "null" ? "なし" : "管理画面で確認できます"), "", "採用担当画面", adminUrl(origin,row.receipt)].join("\n");
  const response = await fetch("https://api.line.me/v2/bot/message/push", {
    method:"POST",
    headers:{"Authorization":"Bearer "+env.RECRUIT_LINE_ACCESS_TOKEN,"Content-Type":"application/json","X-Line-Retry-Key":row.submission_id},
    body:JSON.stringify({to:env.RECRUIT_LINE_TARGET_ID,messages:[{type:"text",text:message}]}),
    signal:AbortSignal.timeout(8000)
  });
  const accepted = response.ok || (response.status === 409 && response.headers.has("x-line-accepted-request-id"));
  if (!accepted) {
    console.error("Recruitment LINE push rejected", {status:response.status});
  }
  return {accepted,status:response.status};
}


const adminUrl=(origin,receipt)=>origin+"/admin?receipt="+encodeURIComponent(receipt);
const hex=bytes=>Array.from(new Uint8Array(bytes),b=>b.toString(16).padStart(2,"0")).join("");
const random=size=>hex(crypto.getRandomValues(new Uint8Array(size)));
const headers={"Cache-Control":"no-store","X-Content-Type-Options":"nosniff","Referrer-Policy":"same-origin","X-Frame-Options":"DENY"};
function send(res,status,body,type="text/plain; charset=utf-8",extra={}) {
  return new Response(body,{status,headers:{...headers,"Content-Type":type,...extra}});
}
function json(res,status,body){return send(res,status,JSON.stringify(body),"application/json; charset=utf-8");}
async function readBody(req){
  if(Number(req.headers.get("Content-Length"))>16384) throw Error("too large");
  const reader=req.body?.getReader();
  if(!reader)return "";
  const chunks=[];let total=0;
  for(;;){
    const {value,done}=await reader.read();
    if(done)break;
    total+=value.length;
    if(total>16384){await reader.cancel();throw Error("too large");}
    chunks.push(value);
  }
  return new TextDecoder().decode(await new Blob(chunks).arrayBuffer());
}
const tokenOf=req=>/(?:^|; *)recruit_session=([0-9a-f]{64})(?:;|$)/.exec(req.headers.get("Cookie")||"")?.[1];
const digest=async value=>hex(await crypto.subtle.digest("SHA-256",new TextEncoder().encode(value)));
const cookie="; Path=/admin; HttpOnly; SameSite=Strict; Secure; Max-Age=";
function page(res,status,body,headers) {
  return send(res,status,`<!doctype html><html lang="ja"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>採用担当画面</title><style>body{margin:2rem auto;padding:0 1rem;max-width:850px;color:#263c34;background:#f8faf7;font:16px/1.65 system-ui,sans-serif}article,main{border:1px solid #d3ddd5;padding:1rem;border-radius:14px;margin:1rem 0;background:white}button,input{font:inherit;padding:.45rem}button,summary{cursor:pointer}li{margin:.55rem 0}a{color:#254e42}form{margin:.5rem 0}</style><body>${body}</body></html>`,"text/html; charset=utf-8",headers);
}
function redirect(res,target,headers={}) {
  return send(res,303,"","text/plain",{Location:target,...headers});
}

export default {async fetch(req,env){
  const res=null;
  const url=new URL(req.url);
  const db=env.DB;
  const password=env.RECRUIT_ADMIN_PASSWORD;
  const lineReady=Boolean(password?.length>=16 && env.RECRUIT_LINE_ACCESS_TOKEN && /^[UC][0-9a-f]{32}$/i.test(env.RECRUIT_LINE_TARGET_ID||""));
  const secureCookie="; Secure";
  const randomUUID=()=>crypto.randomUUID();
  try{
    const {pathname} = url;
    const method = req.method;
    if (method === "POST" && req.headers.get("Origin") !== url.origin) return send(res,403,"Forbidden");


    if (method==="GET" && (pathname==="/privacy" || pathname==="/privacy/")) return send(res,200,privacy,"text/html; charset=utf-8");
    if (method==="GET" && ["/","/index.html","/diagnosis.js"].includes(pathname)) {
      return pathname==="/diagnosis.js" ? send(res,200,script,"text/javascript; charset=utf-8") : send(res,200,html,"text/html; charset=utf-8");
    }
    if (pathname === "/api/funnel" && method === "POST") {
      const input = await req.json().catch(() => null);
      if (typeof input?.visitId !== "string" || !/^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i.test(input.visitId) ||
          !["diagnosis_completed","diagnosis_to_form","direct_to_form"].includes(input.event)) {
        return json(res,400,{error:"invalid event"});
      }
      const events = input.event === "diagnosis_to_form" ? ["diagnosis_completed",input.event] : [input.event];
      await db.batch(events.map(event => db.prepare("INSERT OR IGNORE INTO recruit_funnel(visit_id,event) VALUES(?,?)").bind(input.visitId,event)));
      return json(res,200,{ok:true});
    }
    if (pathname === "/api/requests" && method === "POST") {
      let input;
      try { input = JSON.parse(await readBody(req)); }
      catch { return json(res,400,{error:"invalid request"}); }
      const version = input?.questionVersion === diagnosisVersion ? diagnosisVersion : [2,3,4].includes(input?.questionVersion) ? input.questionVersion : 1;
      if (!input || !(Object.hasOwn(tracks,input.track) || (input.track === null && input.answers === null)) || !["visit","apply","consult"].includes(input.intent) ||
          input.consent !== true || (input.answers !== null && (!Array.isArray(input.answers) || input.answers.length !== (version >= 3 ? questionCount : 12) ||
          !input.answers.every(value => Number.isInteger(value) && value >= 0 && value < 4)))) {
        return json(res,400,{error:"invalid request"});
      }
      const application = parseApplication(input.application);
      if (!application && (input.intent !== "visit" || input.answers === null || input.application !== undefined)) return json(res,400,{error:"invalid application"});
      if (!lineReady) return json(res,503,{error:"line unavailable"});
      const submissionId = input.submissionId || randomUUID();
      if (typeof submissionId !== "string" || !/^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i.test(submissionId)) {
        return json(res,400,{error:"invalid submission"});
      }
      const track = input.track ?? "none";
      const answers = JSON.stringify(input.answers);
      const profile = application ? JSON.stringify(application) : null;
      let row = await db.prepare("SELECT * FROM requests WHERE submission_id=?").bind(submissionId).first();
      for (let attempt=0; !row && attempt<8; attempt++) {
        const receipt = String(100000 + crypto.getRandomValues(new Uint32Array(1))[0] % 900000);
        await db.prepare("INSERT INTO requests(receipt,created,track,intent,answers,application,submission_id,question_version) VALUES(?,?,?,?,?,?,?,?) ON CONFLICT DO NOTHING").bind(receipt,new Date().toISOString(),track,input.intent,answers,profile,submissionId,version).run();
        row = await db.prepare("SELECT * FROM requests WHERE submission_id=?").bind(submissionId).first();
      }
      if (!row) return json(res,503,{error:"receipt unavailable"});
      if (row.question_version !== version || row.track !== track || row.intent !== input.intent || row.answers !== answers || row.application !== profile) {
        return json(res,409,{error:"submission changed"});
      }
      if (row.line_accepted) return json(res,200,{receipt:row.receipt});
      if (Date.now() - Date.parse(row.created) >= 23*60*60*1000) {
        return json(res,502,{receipt:row.receipt,error:"line retry expired"});
      }
      try {
        const result=await sendLine(row,application,env,url.origin);
        if (result.accepted) {
          await db.prepare("UPDATE requests SET line_accepted=1 WHERE submission_id=?").bind(submissionId).run();
          return json(res,201,{receipt:row.receipt});
        }
        return json(res,502,{receipt:row.receipt,error:"line unconfirmed",lineStatus:result.status});
      } catch {
        console.error("Recruitment LINE push could not reach the API");
      }
      return json(res,502,{receipt:row.receipt,error:"line unconfirmed"});
    }


    const receiptFilter=value=>/^(?:[0-9]{6}|KR-[0-9A-F]{16})$/.test(value || "") ? value : "";
    const now=Date.now();
    const token=tokenOf(req);
    const signedIn=password?.length>=16 && token && await db.prepare("SELECT token FROM sessions WHERE token=? AND expires>?").bind(await digest(token),now).first();
    if (method==="POST" && pathname==="/admin/login"){
      if (!password || password.length<16) return page(res,503,"<p>管理画面の設定待ちです。</p>");
      const bucket=req.headers.get("CF-Connecting-IP")||"default";
      const attempt=await db.prepare("INSERT INTO login_limits(bucket,until,attempts) VALUES(?,?,1) ON CONFLICT(bucket) DO UPDATE SET attempts=CASE WHEN until<=? THEN 1 ELSE attempts+1 END,until=CASE WHEN until<=? THEN excluded.until ELSE until END RETURNING attempts").bind(bucket,now+600000,now,now).first();
      if(attempt.attempts>8)return page(res,429,"<p>しばらく待ってからお試しください。</p>");
      const form=new URLSearchParams(await readBody(req));
      if (await digest(form.get("password")||"")!==await digest(password)) return page(res,401,'<p>パスワードを確認してください。</p><a href="'+adminUrl("",receiptFilter(form.get("receipt")))+'">ログインへ</a>');
      await db.prepare("DELETE FROM login_limits WHERE until<=? OR bucket=?").bind(now,bucket).run();
      await db.prepare("DELETE FROM sessions WHERE expires<=? OR token=?").bind(now,token?await digest(token):"").run();
      const session=random(32);
      await db.prepare("INSERT INTO sessions(token,expires) VALUES(?,?)").bind(await digest(session),now+28800000).run();
      const receipt=receiptFilter(form.get("receipt"));
      return redirect(res,receipt ? adminUrl("",receipt) : "/admin",{"Set-Cookie":"recruit_session="+session+cookie+"28800"});
    }
    if (method === "GET" && pathname === "/admin" && !signedIn) {
      const receipt=receiptFilter(url.searchParams.get("receipt"));
      return page(res,200,'<h1>採用担当ログイン</h1><main><form method="post" action="/admin/login"><input type="hidden" name="receipt" value="'+receipt+'"><label>パスワード <input type="password" name="password" autocomplete="current-password" required></label> <button>ログイン</button></form></main>');
    }
    if (pathname.startsWith("/admin/") && !signedIn) return send(res,401,"ログインしてください。");
    if (method === "POST" && pathname === "/admin/logout") {
      await db.prepare("DELETE FROM sessions WHERE token=?").bind(await digest(token)).run();
      return redirect(res,"/admin",{"Set-Cookie":"recruit_session=; Path=/admin; HttpOnly; SameSite=Strict; Max-Age=0"+secureCookie});
    }
    if (method === "POST" && pathname === "/admin/status") {
      const form = new URLSearchParams(await readBody(req));
      const status = form.get("status");
      if (!["pending","confirmed"].includes(status)) return send(res,400,"無効な操作です。");
      const receipt=receiptFilter(form.get("receipt"));
      if (!receipt) return send(res,400,"無効な受付番号です。");
      await db.prepare("UPDATE requests SET status=? WHERE receipt=?").bind(status,receipt).run();
      return redirect(res,adminUrl("",receipt));
    }
    if (method === "GET" && pathname === "/admin") {
      const pageNumber = Number(url.searchParams.get("page") || "1");
      if (!Number.isSafeInteger(pageNumber) || pageNumber < 1 || pageNumber > 100000) return send(res,400,"無効なページです。");
      const query = (url.searchParams.get("receipt") || "").trim().toUpperCase();
      const {results:rows} = await (query ? db.prepare("SELECT * FROM requests WHERE receipt=?").bind(query) : db.prepare("SELECT * FROM requests ORDER BY created DESC,receipt DESC LIMIT 100 OFFSET ?").bind((pageNumber-1)*100)).all();
      const totals = await db.prepare(`SELECT COUNT(CASE WHEN funnel.event='diagnosis_completed' THEN 1 END) AS completed,
  COUNT(CASE WHEN funnel.event='diagnosis_to_form' THEN 1 END) AS from_diagnosis,
  COUNT(CASE WHEN funnel.event='direct_to_form' THEN 1 END) AS direct,
  COUNT(CASE WHEN funnel.event='diagnosis_completed' AND NOT EXISTS (
    SELECT 1 FROM recruit_funnel AS opened WHERE opened.visit_id=funnel.visit_id
    AND opened.event IN ('diagnosis_to_form','direct_to_form')
  ) THEN 1 END) AS diagnosis_only FROM recruit_funnel AS funnel`).first();
      const conversion = totals.completed ? new Intl.NumberFormat("ja-JP",{style:"percent",maximumFractionDigits:1}).format(totals.from_diagnosis / totals.completed) : "—（診断完了0件）";
      const previous = pageNumber > 1 ? '<a href="?page='+(pageNumber-1)+'">前へ</a> ' : "";
      const next = rows.length === 100 ? '<a href="?page='+(pageNumber+1)+'">次へ</a>' : "";
      return page(res,200,`<h1>見学・応募の受付</h1><form method="post" action="/admin/logout"><button>ログアウト</button></form>
      <main><h2>適性診断と見学・相談の集計</h2><dl>
        <dt>診断を完了</dt><dd>${totals.completed}件</dd>
        <dt>診断だけで終了</dt><dd>${totals.diagnosis_only}件</dd>
        <dt>診断結果から見学・相談への進行率</dt><dd>${conversion}</dd>
        <dt>診断結果から見学・相談へ</dt><dd>${totals.from_diagnosis}件</dd>
        <dt>診断結果を経由せず見学・相談へ</dt><dd>${totals.direct}件</dd>
      </dl><p>公開後の累計です。同じタブでは操作ごとに1件として数えます。フォームへの移動は送信前に集計します。</p></main>
      <p>受付番号を検索して、LINE通知と診断結果を照合できます。</p>
      <form method="get" action="/admin"><label>受付番号 <input name="receipt" value="${escape(query)}"></label> <button>検索</button> <a href="/admin">全件表示</a></form>
      ${rows.map(adminCard).join("") || "<p>該当する受付はありません。</p>"}${query ? "" : previous+next}`);
    }

    return send(res,404,"ページが見つかりません。");
  }catch{return send(res,500,"処理できませんでした。");}
}};



