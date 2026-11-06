// dist を静的サーバで配信し、各ページをブラウザで描画して完成済みHTMLを書き出す。
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { chromium } = require("playwright");

const dist = path.resolve(process.argv[2]);
const types = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".jpg": "image/jpeg", ".png": "image/png", ".mp4": "video/mp4", ".txt": "text/plain", ".xml": "application/xml" };

const server = http.createServer((req, res) => {
  const urlPath = decodeURIComponent(new URL(req.url, "http://x").pathname);
  let file = path.join(dist, urlPath);
  if (!file.startsWith(dist)) { res.writeHead(403).end(); return; }
  if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) file = path.join(dist, "index.html"); // SPAフォールバック（描画用）
  res.writeHead(200, { "Content-Type": types[path.extname(file)] ?? "application/octet-stream" });
  fs.createReadStream(file).pipe(res);
});
await new Promise(r => server.listen(0, r));
const base = `http://127.0.0.1:${server.address().port}`;

const postSlugs = [...fs.readFileSync(path.resolve("client/src/data/posts.ts"), "utf8").matchAll(/^\s{4}slug: "([a-z0-9-]+)"/gm)].map(m => m[1]);
const pages = [
  ["/", "index.html"],
  ["/jobs/", "jobs/index.html"], // 入口ページ（canonical は /recruit/）。ディレクトリ直アクセスの403を防ぐ
  ["/jobs/stylist", "jobs/stylist.html"],
  ["/jobs/assistant", "jobs/assistant.html"],
  ["/jobs/part", "jobs/part.html"],
  ["/jobs/student", "jobs/student.html"],
  ["/recruit/", "recruit/index.html"],
  ["/recruit/newgrad", "recruit/newgrad.html"],
  ["/recruit/career", "recruit/career.html"],
  ["/area", "area.html"],
  ["/school", "school.html"],
  ["/recruit/student", "recruit/student.html"],
  ["/faq", "faq.html"],
  ["/workstyle", "workstyle.html"],
  ["/visit", "visit.html"],
  ["/blog", "blog/index.html"],
  ["/privacy", "privacy.html"],
  ["/__not-found__", "404.html"],
];

for (const s of postSlugs) pages.splice(pages.length - 2, 0, [`/blog/${s}`, `blog/${s}.html`]);

const browser = await chromium.launch();
for (const [route, out] of pages) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.route("**/*", r => {
    const u = r.request().url();
    // 外部フォントなどはプリレンダに不要
    return u.startsWith(base) ? r.continue() : r.abort();
  });
  await page.goto(base + route, { waitUntil: "load" });
  await page.waitForSelector("#root > *");
  await page.waitForTimeout(500);
  // 隣り合う文字ノードは、HTMLに書き出すと1つに結合され、読み込み時の引き継ぎ（hydrate）が合わなくなる。
  // サーバー描画（ReactDOMServer）と同じく <!-- --> で区切って書き出す。
  let html = "<!DOCTYPE html>\n" + await page.evaluate(() => {
    const walker = document.createTreeWalker(document.getElementById("root"), NodeFilter.SHOW_TEXT);
    const texts = [];
    while (walker.nextNode()) texts.push(walker.currentNode);
    for (const t of texts) if (t.nextSibling && t.nextSibling.nodeType === 3) t.after(document.createComment(" "));
    return document.documentElement.outerHTML;
  });
  // 実行時に差し込まれた計測タグ（Clarity）を静的HTMLに残さない（内部アクセスの除外・二重読み込み防止のため。タグは index.html の読み込み用スクリプトが実行時に入れる）
  html = html.replace(/<script async="" src="https:\/\/www\.clarity\.ms\/tag\/[^"]*"><\/script>/g, "");
  const target = path.join(dist, out);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, html);
  console.log("prerendered", route, "->", out, (html.length / 1024).toFixed(0) + "KB");
  await page.close();
}
await browser.close();
server.close();

// 最初の画面を早く出すため、サイト全体のCSS（assets/index-*.css）を各ページの <style> に埋め込む。
// FLOWCLOUD・glow と同じ方式で、HTMLを受け取ったあとにCSSファイルを取りに行く待ち（描画のブロック）が無くなる。
// CSSファイルも従来どおり dist/assets に残す。CSS内に url() が無いことが前提（相対パスが壊れるため。あれば埋め込まない）。
{
  const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => e.isDirectory() ? walk(path.join(d, e.name)) : e.name.endsWith(".html") ? [path.join(d, e.name)] : []);
  const link = /<link rel="stylesheet"(?: crossorigin(?:="[^"]*")?)? href="(\/assets\/[^"]+\.css)"(?: crossorigin(?:="[^"]*")?)?>/;
  let n = 0;
  for (const f of walk(dist)) {
    const html = fs.readFileSync(f, "utf8");
    const m = html.match(link);
    if (!m) continue;
    const css = fs.readFileSync(path.join(dist, m[1]), "utf8");
    if (/url\(/.test(css) || /<\/style/i.test(css)) { console.warn("CSS埋め込みをスキップ（url()あり）:", f); continue; }
    fs.writeFileSync(f, html.replace(link, () => "<style>" + css + "</style>"));
    n++;
  }
  console.log("CSSを埋め込んだページ:", n);
}
