// 採用マッチング診断（藤津さん作成の外部アプリ。診断7問と見学・相談・応募の受付は向こうで動く）
//
// サイト・QR・LINE・会社案内には、外部アプリのURLではなく「自社ドメインの入口」MATCH_ENTRY（/match/）だけを載せる。
// 外部アプリのURLが変わったり止まったりしても、リンク切れにならないための仕組み。
//   ・URLが変わったとき：MATCH_APP_URL をここで1か所だけ直す（公開は次の毎時の取り込み）。
//   ・外部アプリを自社サーバーへ移したとき：MATCH_APP_URL を新しい場所に直すだけでよい。
export const MATCH_ENTRY = "/match/";
// 2026-11-13 21:5x から、自社ドメインのサブドメイン（ChatGPT Sites の独自ドメイン接続。DNS は Xserver の DNSレコード設定で
// match → CNAME custom-domains.chatgpt.site と、検証用 TXT 2件）。HTTPS も有効。
// 予備（元のアドレス。独自ドメイン側に不具合があったときの切り戻し先）： https://kounryusui-recruit.flowcloudcast.chatgpt.site/
export const MATCH_APP_URL = "https://match.ko-un-ryu-sui.com/";
