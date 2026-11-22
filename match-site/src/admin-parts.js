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
