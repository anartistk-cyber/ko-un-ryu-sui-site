(() => {
  const OA = "%40512rmwnk";
  const SEL = 'a[href*="line.me/R/oaMessage/"]';
  const url = (lines) => "https://line.me/R/oaMessage/" + OA + "/?" + encodeURIComponent(lines.join("\n"));
  const text = (id) => ((document.getElementById(id) || {}).textContent || "").trim();
  const CHOICES = "新卒／中途／パート／学生アルバイト";
  const before = () => url(["【採用のご相談】", "①ご希望：" + CHOICES, "②お名前：", "③ご質問・見学のご希望日など："]);
  const after = () => {
    const kind = text("track-label"), score = text("score"), good = text("salon-result");
    const parts = [];
    if (score) parts.push("価値観のマッチ度 " + score);
    if (good) parts.push("いいところ「" + good + "」");
    const lines = ["【採用のご相談】", "①ご希望：" + (kind || CHOICES), "②お名前："];
    if (parts.length) lines.push("③マッチング診断の結果：" + parts.join("／"), "④ご質問・見学のご希望日など：");
    else lines.push("③ご質問・見学のご希望日など：");
    return url(lines);
  };
  const refresh = (a) => { a.href = a.closest("#results") ? after() : before(); };
  const refreshAll = () => document.querySelectorAll(SEL).forEach(refresh);
  refreshAll();
  // 押した瞬間にも作り直す（結果が変わっていても、古い内容が残らないように）
  document.addEventListener("click", (e) => { const a = e.target && e.target.closest && e.target.closest(SEL); if (a) refresh(a); }, true);
  // 結果画面の表示が変わったら作り直す（長押しで「リンクをコピー」する場合に備える）
  const r = document.getElementById("results");
  if (r) new MutationObserver(refreshAll).observe(r, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ["hidden"] });
})();
