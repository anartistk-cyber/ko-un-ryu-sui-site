// dataLayer専用の計測ヘルパー。個人情報(氏名・連絡先・自由記述・学校名・希望日時)は載せない。
// GA4はindex.htmlのgtagで読み込む（プライバシーポリシーに記載済み）。イベントはgtagにも転送する。
type Params = Record<string, string | number | undefined>;
declare global { interface Window { dataLayer?: Record<string, unknown>[]; gtag?: (...a: unknown[]) => void } }
export function track(event: string, params: Params = {}) {
  try {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event, ...params });
    if (typeof window.gtag === "function") window.gtag("event", event, params);
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

// 流入元（UTM）をセッション内で覚えておき、問い合わせ時の「どこから来たか」に使う。個人情報は含まない。
const UTM_KEY = "krs-utm";
export function rememberCampaign() {
  try {
    const q = new URLSearchParams(window.location.search);
    const src = q.get("utm_source");
    if (!src || sessionStorage.getItem(UTM_KEY)) return;
    const clean = (v: string | null) => (v || "").replace(/[^A-Za-z0-9_\-.]/g, "").slice(0, 40);
    sessionStorage.setItem(UTM_KEY, [clean(src), clean(q.get("utm_medium")), clean(q.get("utm_campaign"))].filter(Boolean).join("/"));
  } catch { /* noop */ }
}
export function getCampaign(): string {
  try { return sessionStorage.getItem(UTM_KEY) || ""; } catch { return ""; }
}
