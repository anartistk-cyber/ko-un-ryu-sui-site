// 採用マッチング診断（藤津さん作成の外部アプリ。診断7問と見学・相談・応募の受付は向こうで動く）
//
// サイト・QR・LINE・会社案内には、外部アプリのURLではなく「自社ドメインの入口」MATCH_ENTRY（/match/）だけを載せる。
// 外部アプリのURLが変わったり止まったりしても、リンク切れにならないための仕組み。
//   ・URLが変わったとき：MATCH_APP_URL をここで1か所だけ直す（公開は次の毎時の取り込み）。
//   ・外部アプリを自社サーバーへ移したとき：MATCH_APP_URL を新しい場所に直すだけでよい。
export const MATCH_ENTRY = "/match/";
// 2026-11-23 夜に、置き場所を ChatGPT Sites から自社の Xserver（match.ko-un-ryu-sui.com。PHP＋SQLite。保守は match-site/）へ引っ越した。
// 予備（旧アプリの元アドレス。引っ越し後の2週間ほどだけ残す。切り戻し先）： https://kounryusui-recruit.flowcloudcast.chatgpt.site/
export const MATCH_APP_URL = "https://match.ko-un-ryu-sui.com/";
