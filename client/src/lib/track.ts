// dataLayer専用の計測ヘルパー。個人情報(氏名・連絡先・自由記述・学校名・希望日時)は載せない。
// GA4/GTMのIDはここでは読み込まない(導入は同意・プライバシー方針の確定後、別承認)。
type Params = Record<string, string | number | undefined>;
declare global { interface Window { dataLayer?: Record<string, unknown>[] } }
export function track(event: string, params: Params = {}) {
  try {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event, ...params });
  } catch { /* 計測失敗は無視 */ }
}
export function trackClick(e: { target: EventTarget | null }) {
  const a = (e.target as HTMLElement | null)?.closest?.("a[data-track]") as HTMLAnchorElement | null;
  if (!a) return;
  const t = a.dataset.track || "";
  const p = { placement: a.dataset.placement || "body", audience: a.dataset.audience || "none", job_id: a.dataset.job || "none" };
  if (t === "line") track("recruit_line_click", p);
  else if (t === "audience") track("audience_select", p);
  else track("recruit_cta_click", { cta_type: t, ...p });
}
