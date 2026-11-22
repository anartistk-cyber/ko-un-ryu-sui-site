// 公式LINE（行雲流水（採用）@512rmwnk）への入口。
//
// ・LINE_FRIEND_URL … 友だち追加のURL（短縮URL）。llms.txt など「ただの案内」にはこちら。
// ・lineConsultHref() … 押すと、LINEのトークの入力欄に「記入用の文面」が入った状態で開くURL（藤津さん 2026-11-22）。
//   友だち未追加の人は、追加すると入力欄に文面が入る。あとは空欄を埋めて送信するだけ。
//   診断ページ（/type-shindan/）の合言葉と同じ仕組み（https://line.me/R/oaMessage/）。
// 注意：文面は「診断結果：」の合言葉・スタッフ登録の合言葉（行雲流水＋名前）と別の文にする（自動応答に当たらないように）。
//       文面を変えたら、LINE の管理画面の応答（キーワード）と Apps Script の登録処理に当たらないことを確認する。
export const LINE_FRIEND_URL = "https://lin.ee/Z0JP8sH";
const LINE_OA = "%40512rmwnk"; // @512rmwnk（@ は %40）

// ページごとに「①ご希望」を先に入れておく（本人が直してもよい）。無いページは4択を並べる。
const WHO: Record<string, string> = {
  newgrad: "新卒",
  career: "中途",
  stylist: "中途",
  part: "パート",
  student_job: "学生アルバイト",
};
const WHO_CHOICES = "新卒／中途／パート／学生アルバイト";

/** 記入用の文面（改行つき）。個人情報は入れない（空欄を本人が埋める） */
export function lineConsultText(who?: string): string {
  const hope = (who && WHO[who]) || WHO_CHOICES;
  return ["【採用のご相談】", `①ご希望：${hope}`, "②お名前：", "③ご質問・見学のご希望日など："].join("\n");
}

/** 押すと、文面が入った状態でLINEのトークが開くURL */
export function lineConsultHref(who?: string): string {
  return `https://line.me/R/oaMessage/${LINE_OA}/?${encodeURIComponent(lineConsultText(who))}`;
}

/** どのページからでも同じ文面でよい場所（ブログ記事の末尾など）に使う定数 */
export const LINE_CONSULT = lineConsultHref();
