// 公開前の点検：完成済みHTML（dist）をブラウザで開き、React が「作り直し」ではなく「引き継ぎ（hydrate）」できているか確認する。
// 失敗（[hydrate-mismatch]）が出ると、公開版はJSが全体を作り直してしまい、表示が遅くなる（PageSpeedの点数が下がる）。
// 使い方: node scripts/check-hydration.mjs dist
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { chromium } = require("playwright");

const dist = path.resolve(process.argv[2] || "dist");
const types = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".jpg": "image/jpeg", ".png": "image/png", ".webp": "image/webp", ".mp4": "video/mp4", ".txt": "text/plain", ".xml": "application/xml" };
const server = http.createServer((req, res) => {
  let p = decodeURIComponent(new URL(req.url, "http://x").pathname);
  let file = path.join(dist, p);
  if (!file.startsWith(dist)) { res.writeHead(403).end(); return; }
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, "index.html");
  else if (!fs.existsSync(file) && fs.existsSync(file + ".html")) file += ".html";
  if (!fs.existsSync(file)) { res.writeHead(404).end("nf"); return; }
  res.writeHead(200, { "Content-Type": types[path.extname(file)] ?? "application/octet-stream" });
  fs.createReadStream(file).pipe(res);
});
await new Promise(r => server.listen(0, r));
const base = `http://127.0.0.1:${server.address().port}`;

// dist 内の .html から公開URLを数える（404.html・認証ファイルは除外）
const walk = d => fs.readdirSync(d, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]);
const routes = walk(dist).filter(f => f.endsWith(".html")).map(f => path.relative(dist, f).split(path.sep).join("/"))
  .filter(f => f !== "404.html" && !/^google/.test(f)).map(f => "/" + f.replace(/(^|\/)index\.html$/, "$1").replace(/\.html$/, "")).sort();

const browser = await chromium.launch();
let bad = 0;
for (const route of routes) {
  const page = await browser.newPage({ viewport: { width: 412, height: 800 } });
  const errs = [];
  page.on("console", m => { if (m.type() === "error" && /hydrate-mismatch/.test(m.text())) errs.push(m.text().split("\n")[0].slice(0, 160)); });
  page.on("pageerror", e => errs.push("pageerror: " + String(e).slice(0, 160)));
  await page.route("**/*", r => (r.request().url().startsWith(base) ? r.continue() : r.abort()));
  await page.goto(base + route, { waitUntil: "load" });
  await page.waitForTimeout(1200);
  if (errs.length) { bad++; console.log("NG ", route, errs[0]); } else console.log("OK ", route);
  await page.close();
}
await browser.close();
server.close();
if (bad) { console.error(`hydration NG: ${bad} page(s)`); process.exit(1); }
console.log(`hydration OK: ${routes.length} pages`);
