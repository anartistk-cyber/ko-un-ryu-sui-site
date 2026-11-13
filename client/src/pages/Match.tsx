import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { SubPage, LINE_URL, SITE } from "../components/SubPage";
import { ContactForm } from "../components/ContactForm";
import { track, trackClick } from "../lib/track";
import { AXES, CREDO, QUESTION_COUNT, TRACK_LABEL, describeResult, questionAt, resultNote, type TrackId } from "../data/match";

const PATH = "/match";
const TITLE = "採用マッチング診断｜12問で「大切にしたいこと」を知る｜泉大津の美容室 FLOWCLOUD・glow";
const DESC = "泉大津のFLOWCLOUD・glowの採用マッチング診断。美容学生・新卒、中途の方が、12問に答えて「大切にしたいこと」と「見学で聞いてみたいこと」を見つけられます。結果から、そのまま見学・相談・応募もできます。";

const FAQ: [string, string][] = [
  ["診断を受けないと、見学や応募はできませんか。", "いいえ。診断は任意です。見学・相談・応募は、診断をしなくても、お問い合わせフォーム・公式LINE・電話（0725-90-5699）から受け付けています。"],
  ["診断の回答は保存されますか。", "回答の内容そのものは、保存も送信もしません。結果のタイトルと「見学で知りたいこと」は、フォームで「結果をそえる」を選んだときだけ、メッセージに添えて送られます。診断を使った人数や結果のタイプは、サイトの利用状況の集計（個人は特定しません）に使います。"],
  ["診断は、何をもとにしていますか。", "行雲流水が大切にしている3つの軸（人間力・接遇力・技術力）と、9つの行動指針「9credo」をもとにしています。結果は、自分を知り、見学で何を聞いてみたいかを見つけるためのヒントです。"],
  ["どんな方が使えますか。", "美容学生・新卒の方と、中途で美容師として働いている方向けの2つのコースがあります。パート・復職の相談は、フォームの「現在の状況」から選べます。"],
];

type Stage = "choose" | "quiz" | "result";

export function Match() {
  const [stage, setStage] = useState<Stage>("choose");
  const [course, setCourse] = useState<TrackId>("newgrad");
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [error, setError] = useState(false);
  const [attach, setAttach] = useState(true);
  const questionRef = useRef<HTMLHeadingElement>(null);
  const resultRef = useRef<HTMLHeadingElement>(null);
  const appRef = useRef<HTMLElement>(null);

  const q = stage === "quiz" ? questionAt(course, index) : null;
  const result = stage === "result" ? describeResult(answers, course) : null;

  useEffect(() => { if (stage === "quiz") questionRef.current?.focus({ preventScroll: true }); }, [stage, index]);
  useEffect(() => { if (stage === "result") { resultRef.current?.focus({ preventScroll: true }); appRef.current?.scrollIntoView({ block: "start" }); } }, [stage]);

  const start = () => { setAnswers([]); setIndex(0); setError(false); setStage("quiz"); track("recruit_match_start", { match_track: course }); };
  const next = () => {
    if (answers[index] === undefined) { setError(true); return; }
    setError(false);
    if (index === QUESTION_COUNT - 1) {
      const r = describeResult(answers, course);
      track("recruit_match_result", { match_track: course, result_type: r.title, interest: r.interest });
      setStage("result");
    } else setIndex(index + 1);
  };
  const back = () => { setError(false); if (index === 0) setStage("choose"); else setIndex(index - 1); };
  const restart = () => { setAnswers([]); setIndex(0); setError(false); setStage("choose"); appRef.current?.scrollIntoView({ block: "start" }); };

  const faqLd = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.map(([qq, a]) => ({ "@type": "Question", name: qq, acceptedAnswer: { "@type": "Answer", text: a } })) };
  const pageLd = { "@context": "https://schema.org", "@type": "WebPage", name: TITLE, url: SITE + PATH, description: DESC, inLanguage: "ja", about: { "@id": SITE + "/#org" }, isPartOf: { "@id": SITE + "/#website" } };

  return (
    <SubPage title={TITLE} description={DESC} path={PATH}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageLd) }} />
      <main className="job-detail-main match-main" onClick={trackClick}>
        <section className="job-detail-hero">
          <p>CAREER MATCH / FLOWCLOUD・glow</p>
          <h1>12問で、あなたが大切にしたいことを知る。</h1>
          <p className="job-detail-lead">FLOWCLOUDとglowが大切にしている考え方（人間力・接遇力・技術力）をもとにした、採用マッチング診断です。答えると、あなたらしさのヒントと、見学で聞いてみたいことが見つかります。結果から、そのまま見学・相談・応募もできます。</p>
          <div className="lp-actions">
            <a className="job-detail-cta" href="#diagnosis">診断をはじめる <ArrowRight size={17} aria-hidden="true" /></a>
            <a className="job-detail-line" href="/?c=visit#contact" data-track="consult" data-placement="match-hero" data-audience="match">診断せずに見学を相談する</a>
          </div>
        </section>

        <section className="match-app" id="diagnosis" ref={appRef} aria-labelledby="match-heading">
          {stage === "choose" && (
            <form className="match-card" onSubmit={e => { e.preventDefault(); start(); }}>
              <p className="match-kicker">STEP 1</p>
              <h2 id="match-heading">あなたの状況を選んでください</h2>
              <p className="match-sub">今のあなたに近い答えを選んでください。結果は、自分を知るためのヒントです。診断だけでも使えます。</p>
              <fieldset className="match-course">
                <legend>コース</legend>
                {(Object.keys(TRACK_LABEL) as TrackId[]).map(t => (
                  <label key={t} className={course === t ? "match-opt is-on" : "match-opt"}>
                    <input type="radio" name="course" value={t} checked={course === t} onChange={() => setCourse(t)} />
                    <span>{TRACK_LABEL[t]}</span>
                  </label>
                ))}
              </fieldset>
              <p className="match-note">全{QUESTION_COUNT}問・2〜3分ほどです。回答の内容は、このページの中だけで処理し、保存も送信もしません。</p>
              <button className="match-btn match-btn-main" type="submit">診断をはじめる</button>
            </form>
          )}

          {stage === "quiz" && q && (
            <form className="match-card" onSubmit={e => { e.preventDefault(); next(); }}>
              <div className="match-progress">
                <span>{TRACK_LABEL[course]}</span>
                <b aria-live="polite">{index + 1} / {QUESTION_COUNT}</b>
              </div>
              <progress max={QUESTION_COUNT} value={index + 1} aria-label="診断の進み具合" />
              <h2 id="match-heading" className="match-q" tabIndex={-1} ref={questionRef}>{q.prompt}</h2>
              <div className="match-options" role="radiogroup" aria-labelledby="match-heading">
                {q.options.map(o => (
                  <label key={o.value} className={answers[index] === o.value ? "match-opt is-on" : "match-opt"}>
                    <input type="radio" name={`answer-${index}`} value={o.value} checked={answers[index] === o.value}
                      onChange={() => { setAnswers(a => { const n = [...a]; n[index] = o.value; return n; }); setError(false); }} />
                    <span>{o.text}</span>
                  </label>
                ))}
              </div>
              {error && <p className="match-error" role="alert">1つ選んでください。</p>}
              <div className="match-actions">
                <button className="match-btn" type="button" onClick={back}>戻る</button>
                <button className="match-btn match-btn-main" type="submit">{index === QUESTION_COUNT - 1 ? "結果を見る" : "次の質問"}</button>
              </div>
            </form>
          )}

          {stage === "result" && result && (
            <div className="match-card match-result">
              <p className="match-kicker">RESULT / {TRACK_LABEL[course]}</p>
              <h2 id="match-heading" className="match-result-title" tabIndex={-1} ref={resultRef}>{result.title}</h2>
              <p className="match-result-desc">{result.description}</p>
              <dl className="match-result-list">
                <div><dt>見学で知りたいこと</dt><dd>{result.interest}</dd></div>
                <div><dt>見学のヒント</dt><dd>{result.tip}</dd></div>
              </dl>
              <p className="match-note">この診断は、選んだ答えから、あなたの考え方のヒントを見つけるためのものです。実際の仕事は、見学で確かめてください。</p>
              <div className="match-actions">
                <a className="match-btn match-btn-main" href="#match-contact" data-track="consult" data-placement="match-result" data-audience="match">この結果で、見学・相談・応募する</a>
                <button className="match-btn" type="button" onClick={() => { setIndex(0); setError(false); setStage("quiz"); }}>回答を見直す</button>
                <button className="match-btn" type="button" onClick={restart}>最初からやり直す</button>
              </div>
            </div>
          )}
        </section>

        {stage === "result" && result && (
          <section className="match-contact" id="match-contact" aria-labelledby="match-contact-h">
            <p className="match-kicker">NEXT STEP</p>
            <h2 id="match-contact-h">この結果をそえて、見学・相談・応募する。</h2>
            <p className="match-sub">応募を決めていなくても大丈夫です。見学で何を聞いてみたいかを、そのまま伝えられます。見学・体験の内容、費用、選考との関係は、お申し込み前にご案内します。</p>
            <label className="match-attach">
              <input type="checkbox" checked={attach} onChange={e => setAttach(e.target.checked)} />
              <span>診断の結果（「{result.title}」と、見学で知りたいこと「{result.interest}」）を、メッセージにそえて送る</span>
            </label>
            <div className="contact-formwrap" id="match-form">
              <ContactForm
                key={course}
                preset={{ purpose: "visit", status: course === "career" ? "career" : "newgrad", job: course }}
                diagnosisNote={attach ? resultNote(course, result) : ""}
                sourcePage="match"
              />
            </div>
            <p className="match-line"><a className="job-detail-line" href={LINE_URL} target="_blank" rel="noreferrer" data-track="line" data-placement="match-result" data-audience="match">公式LINEで質問する</a></p>
          </section>
        )}

        <section className="job-detail-section">
          <div className="job-detail-section-heading"><p>ABOUT</p><h2>この診断について。</h2></div>
          <div className="job-detail-copy">
            <p>診断は、行雲流水が大切にしている3つの軸と、9つの行動指針「9credo」をもとにしています。結果は、自分を知るためのヒントです。見学で、実際の雰囲気を確かめるためのきっかけにしてください。</p>
            {AXES.map((axis, i) => (
              <div className="match-credo" key={axis}>
                <h3>{axis}</h3>
                <ol start={i * 3 + 1}>{CREDO.slice(i * 3, i * 3 + 3).map(c => <li key={c}>{c}</li>)}</ol>
              </div>
            ))}
          </div>
        </section>

        <section className="job-detail-section">
          <div className="job-detail-section-heading"><p>FAQ</p><h2>よくある質問</h2></div>
          <div className="job-detail-copy faq-inline">
            {FAQ.map(([qq, a]) => <div key={qq}><h3>{qq}</h3><p>{a}</p></div>)}
          </div>
        </section>

        <section className="job-detail-section">
          <div className="job-detail-section-heading"><p>RELATED</p><h2>あわせて見る</h2></div>
          <ul className="job-detail-list">
            <li><Link href="/recruit/newgrad">2027年度 新卒美容師採用</Link></li>
            <li><Link href="/recruit/career">中途スタイリスト採用</Link></li>
            <li><Link href="/workstyle">働き方（休み・教育・給与の内訳）</Link></li>
            <li><Link href="/visit">見学・体験の流れ</Link></li>
            <li><Link href="/faq">よくある質問</Link></li>
          </ul>
        </section>
      </main>
    </SubPage>
  );
}
