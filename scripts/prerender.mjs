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
  let html = "<!DOCTYPE html>\n" + await page.evaluate(() => document.documentElement.outerHTML);
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
