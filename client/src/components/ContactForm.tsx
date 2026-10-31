import { useEffect, useRef, useState, type FormEvent } from "react";
import { track } from "../lib/track";

type Errors = Record<string, string>;
const MSG = {
  name: "お名前を入力してください。",
  contact: "メールアドレスまたは電話番号を入力してください。",
  email_format: "メールアドレスの形式をご確認ください。",
  phone_format: "電話番号の形式をご確認ください。",
  purpose: "相談内容を選択してください。",
  status: "現在の状況を選択してください。",
  contact_method: "入力した連絡先から、連絡希望方法を選択してください。",
  consent: "個人情報の取扱いをご確認のうえ、同意にチェックしてください。",
};
// ?c= の値から、相談内容・現在の状況・求人IDの初期値を決める
const PRESET: Record<string, { purpose?: string; status?: string; job?: string }> = {
  visit: { purpose: "visit" },
  taiken: { purpose: "visit" },
  newgrad: { purpose: "consult", status: "newgrad" },
  career: { purpose: "consult", status: "career" },
  stylist: { purpose: "apply", status: "career", job: "stylist" },
  assistant: { purpose: "apply", job: "assistant" },
  part: { purpose: "apply", status: "return", job: "part" },
  student: { purpose: "apply", status: "student", job: "student" },
};
const submitLabel: Record<string, string> = { visit: "この内容で見学を申し込む", consult: "この内容で送信する", apply: "この内容で応募する", "": "この内容で送信する" };

const DRAFT_KEY = "krs-contact-draft";
const DRAFT_TEXT = ["name", "kana", "salon", "school", "date1", "date2", "date3", "conditions", "message"];

export function ContactForm() {
  const [purpose, setPurpose] = useState("");
  const [status, setStatus] = useState("");
  const [jobId, setJobId] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [method, setMethod] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [serverError, setServerError] = useState(false);
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState<null | { receipt?: string; mailed?: boolean; purpose: string }>(null);
  const started = useRef(false);
  const summaryRef = useRef<HTMLDivElement>(null);
  const doneRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const draftRef = useRef<Record<string, string> | null>(null);
  const [restored, setRestored] = useState(0);

  useEffect(() => {
    const c = new URLSearchParams(window.location.search).get("c") ?? "";
    const p = PRESET[c];
    if (p) { setPurpose(p.purpose ?? ""); setStatus(p.status ?? ""); setJobId(p.job ?? (c === "newgrad" || c === "career" ? c : "")); }
  }, []);
  // 入力途中の内容は、このタブを閉じるまで一時保存する（他のページを見て戻っても消えない。同意チェックは保存しない）
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(DRAFT_KEY);
      if (!raw) return;
      const d = JSON.parse(raw) as Record<string, string>;
      draftRef.current = d;
      if (d.purpose) setPurpose(d.purpose);
      if (d.status) setStatus(d.status);
      if (d.job_id) setJobId(d.job_id);
      if (d.email) setEmail(d.email);
      if (d.phone) setPhone(d.phone);
      if (d.contact_method) setMethod(d.contact_method);
      setRestored(n => n + 1);
    } catch { /* 保存できない環境では何もしない */ }
  }, []);
  useEffect(() => {
    const d = draftRef.current, f = formRef.current;
    if (!d || !f) return;
    for (const k of DRAFT_TEXT) {
      const el = f.elements.namedItem(k) as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null;
      if (el && !el.value && d[k]) el.value = d[k];
    }
  }, [restored, status]);
  const saveDraft = () => {
    try {
      const f = formRef.current; if (!f) return;
      const fd = new FormData(f); const d: Record<string, string> = { job_id: jobId };
      for (const k of [...DRAFT_TEXT, "purpose", "status", "email", "phone", "contact_method"]) d[k] = String(fd.get(k) ?? "");
      sessionStorage.setItem(DRAFT_KEY, JSON.stringify(d));
    } catch { /* 保存できない環境では何もしない */ }
  };
  useEffect(() => { if (Object.keys(errors).length) summaryRef.current?.focus(); }, [errors]);
  useEffect(() => { if (done) doneRef.current?.focus(); }, [done]);

  const hasEmail = email.trim() !== "";
  const hasPhone = phone.trim() !== "";
  useEffect(() => { // 連絡希望方法は入力した連絡先から選ぶ
    if (method === "email" && !hasEmail) setMethod(hasPhone ? "tel" : "");
    if (method === "tel" && !hasPhone) setMethod(hasEmail ? "email" : "");
    if (!method && hasEmail && !hasPhone) setMethod("email");
    if (!method && hasPhone && !hasEmail) setMethod("tel");
  }, [hasEmail, hasPhone, method]);

  const onStart = () => { if (!started.current) { started.current = true; track("recruit_form_start", { form_type: purpose || "unselected", job_id: jobId || "not_selected" }); } };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (sending) return;
    const fd = new FormData(event.currentTarget);
    const g = (k: string) => String(fd.get(k) ?? "").trim();
    const errs: Errors = {};
    if (!g("name")) errs.name = MSG.name;
    if (!g("email") && !g("phone")) errs.contact = MSG.contact;
    if (g("email") && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(g("email"))) errs.email = MSG.email_format;
    if (g("phone") && !/^[0-9０-９+\-－ ()（）]{9,20}$/.test(g("phone"))) errs.phone = MSG.phone_format;
    if (!purpose) errs.purpose = MSG.purpose;
    if (!status) errs.status = MSG.status;
    if (!method) errs.contact_method = MSG.contact_method;
    if (!fd.get("consent")) errs.consent = MSG.consent;
    setErrors(errs); setServerError(false);
    if (Object.keys(errs).length) { track("recruit_form_error", { error_code: "validation", field_key: Object.keys(errs)[0], form_type: purpose || "unselected" }); return; }
    setSending(true);
    fetch("/contact.php", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        name: g("name"), kana: g("kana"), email: g("email"), phone: g("phone"), purpose, status, contact_method: method,
        salon: g("salon"), date1: g("date1"), date2: g("date2"), date3: g("date3"), school: g("school"),
        conditions: g("conditions"), message: g("message"), job_id: jobId, consent: true, website: g("website"),
      }),
    })
      .then(async res => {
        const json = await res.json().catch(() => ({}));
        if (res.ok && json?.ok) {
          try { sessionStorage.removeItem(DRAFT_KEY); } catch { /* noop */ }
          setDone({ receipt: json.receipt, mailed: json.mailed, purpose });
          // サーバーが正常保存した時のみ1回だけ発火(個人情報なし)
          track("recruit_lead_saved", { lead_type: purpose, audience: status, salon: g("salon") || "undecided", job_id: jobId || "not_selected", source_page_type: "contact_form" });
        } else {
          setServerError(true); track("recruit_form_error", { error_code: "server", form_type: purpose });
        }
      })
      .catch(() => { setServerError(true); track("recruit_form_error", { error_code: "network", form_type: purpose }); })
      .finally(() => setSending(false));
  };

  if (done) {
    const visit = done.purpose === "visit"; const apply = done.purpose === "apply";
    return (
      <div className="contact-form contact-done" ref={doneRef} tabIndex={-1} role="status">
        <h3>{apply ? "ご応募を受け付けました。" : visit ? "見学・体験の日程相談を受け付けました。" : "お申し込みを受け付けました。ありがとうございます。"}</h3>
        <p>{apply ? "応募内容を確認し、担当者から今後の選考についてご案内します。この時点では、面接日程や選考結果は確定していません。"
          : visit ? "ご希望の内容と日程を確認し、採用担当からご連絡します。この時点では、見学・体験の予約は確定していません。"
          : "ご相談内容について、採用担当からご連絡します。"}</p>
        {done.receipt && <p>受付番号：<b>{done.receipt}</b></p>}
        {done.mailed ? <p>ご入力のメールアドレスへ受付メールをお送りしました。届かない場合は、迷惑メールフォルダもご確認ください。</p>
          : <p>受付メールは送っていません（メールアドレス未入力、または送信できなかった場合）。選択した連絡方法で担当者から連絡します。届かないときは、受付番号を添えて info@ko-un-ryu-sui.com へお問い合わせください。</p>}
        <p><a className="button button-primary" href="/blog/taiken-guide">体験の流れを確認する</a>　<a className="button button-quiet" href="/">採用トップへ戻る</a></p>
      </div>
    );
  }

  const err = (k: string) => errors[k] ? <small className="field-error" id={`e-${k}`} role="alert">{errors[k]}</small> : null;
  const student = status === "student" || status === "newgrad";
  return (
    <form className="contact-form" ref={formRef} onSubmit={onSubmit} onFocus={onStart} onInput={saveDraft} onChange={saveDraft} noValidate>
      <div className="contact-form-heading"><span>MAIL FORM</span><strong>メールで相談する</strong><small><em>必須</em>の項目だけで送信できます。くわしい希望は、あとから伝えても大丈夫です。</small></div>
      <input className="form-honeypot" name="website" type="text" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      {Object.keys(errors).length > 0 && (
        <div className="form-error-summary" ref={summaryRef} tabIndex={-1} role="alert">
          <strong>入力内容をご確認ください。</strong>
          <ul>{Object.entries(errors).map(([k, m]) => <li key={k}><a href={`#f-${k}`}>{m}</a></li>)}</ul>
        </div>
      )}
      <div className="contact-form-grid">
        <label id="f-purpose">相談内容 <b>必須</b>
          <select name="purpose" value={purpose} onChange={e => setPurpose(e.target.value)} aria-invalid={!!errors.purpose}>
            <option value="" disabled>選択してください</option>
            <option value="visit">見学したい</option><option value="consult">働き方を相談したい</option><option value="apply">求人に応募したい</option>
          </select>{err("purpose")}</label>
        <label id="f-status">現在の状況 <b>必須</b>
          <select name="status" value={status} onChange={e => setStatus(e.target.value)} aria-invalid={!!errors.status}>
            <option value="" disabled>選択してください</option>
            <option value="student">美容学生</option><option value="newgrad">卒業予定・新卒</option><option value="career">中途スタイリスト</option><option value="return">復職を検討</option><option value="other">その他</option>
          </select>{err("status")}</label>
        <label id="f-name">お名前 <b>必須</b><input name="name" type="text" autoComplete="name" placeholder="例）山田 花子" aria-invalid={!!errors.name} />{err("name")}</label>
        <fieldset className="form-contact-set" id="f-contact">
          <legend>連絡先（メールまたは電話のいずれか） <b>必須</b></legend>
          <label>メールアドレス<input name="email" type="email" inputMode="email" autoComplete="email" placeholder="example@email.com" value={email} onChange={e => setEmail(e.target.value)} aria-invalid={!!(errors.email || errors.contact)} />{err("email")}</label>
          <label>電話番号<input name="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="000-0000-0000" value={phone} onChange={e => setPhone(e.target.value)} aria-invalid={!!(errors.phone || errors.contact)} />{err("phone")}</label>
          {err("contact")}
        </fieldset>
        <label id="f-contact_method">連絡希望方法 <b>必須</b>
          <select name="contact_method" value={method} onChange={e => setMethod(e.target.value)} aria-invalid={!!errors.contact_method}>
            <option value="" disabled>連絡先を入力してください</option>
            {hasEmail && <option value="email">メール</option>}{hasPhone && <option value="tel">電話</option>}
          </select>{err("contact_method")}</label>
      </div>
      <details className="form-more">
        <summary>希望の店舗・日時などを伝える（任意）</summary>
        <div className="contact-form-grid">
        <label>フリガナ <em>任意</em><input name="kana" type="text" autoComplete="off" placeholder="例）ヤマダ ハナコ" /></label>
        <label>希望店舗 <em>任意</em>
          <select name="salon" defaultValue=""><option value="">未選択</option><option value="flowcloud">FLOWCLOUD</option><option value="glow">glow</option><option value="consult">相談したい</option></select></label>
        {student && <label>学校名・卒業予定 <em>任意</em><input name="school" type="text" autoComplete="off" placeholder="後日の確認でもかまいません" /></label>}
        <fieldset className="form-contact-set">
          <legend>希望日時 <em>任意</em>（決まっていなければ空欄で相談できます）</legend>
          <label>第1希望<input name="date1" type="text" placeholder="例）11月15日 午前" /></label>
          <label>第2希望<input name="date2" type="text" /></label>
          <label>第3希望<input name="date3" type="text" /></label>
          <small>希望日時は、予約確定ではありません。</small>
        </fieldset>
        <label>希望する勤務条件 <em>任意</em><textarea name="conditions" rows={2} maxLength={500} placeholder="例）勤務できる曜日・時間帯、入社の希望時期" /></label>
        </div>
      </details>
      <label className="contact-form-message">質問・伝えたいこと <em>任意（1000文字まで）</em><textarea name="message" rows={4} maxLength={1000} placeholder="気になることをご記入ください。健康状態や家族の詳しい事情などは、書かなくて大丈夫です。" /></label>
      <label className="form-consent" id="f-consent"><input type="checkbox" name="consent" aria-invalid={!!errors.consent} /> <span><a href="/privacy" target="_blank" rel="noopener noreferrer">個人情報の取扱い（新しいタブで開きます）</a>に同意します。 <b>必須</b></span></label>
      {err("consent")}
      <p className="contact-form-note">送信時点では見学日時は確定していません。担当者からの連絡をお待ちください。</p>
      <button className="contact-submit" type="submit" disabled={sending}>{sending ? "送信中…" : submitLabel[purpose] ?? submitLabel[""]}</button>
      {serverError && <p className="form-status form-status-error" role="alert">送信できませんでした。入力内容は画面に残っています。時間をおいて再度お試しいただくか、info@ko-un-ryu-sui.com へご連絡ください。</p>}
    </form>
  );
}
