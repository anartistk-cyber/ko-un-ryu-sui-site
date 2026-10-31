// 使い方: node scripts/make-banner.mjs <slug> "<タイトル>" "<カテゴリ>"
// client/public/images/blog/<slug>.jpg (1200x630) を作る。写真は使わず、サイトの配色の文字入りバナー。
import { createRequire } from "node:module"; import fs from "node:fs";
const require = createRequire(import.meta.url); const { chromium } = require("playwright");
const [slug, title, cat] = process.argv.slice(2);
if (!slug || !title) { console.error("usage: make-banner.mjs slug title category"); process.exit(1); }
const palettes = [["#173c3e", "#fff3d6", "#ff7aa8"], ["#fff3d6", "#173c3e", "#ff7aa8"], ["#ffe1ec", "#173c3e", "#173c3e"], ["#d6e9e3", "#173c3e", "#ff7aa8"]];
let h = 0; for (const c of slug) h = (h * 31 + c.charCodeAt(0)) >>> 0;
const [bg, fg, ac] = palettes[h % palettes.length];
const esc = s => s.replace(/[&<>]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));
const size = title.length > 30 ? 52 : title.length > 20 ? 62 : 72;
const html = `<html><body style="margin:0"><div style="width:1200px;height:630px;box-sizing:border-box;padding:64px 72px;background:${bg};color:${fg};font-family:'Noto Sans CJK JP','Noto Sans JP',sans-serif;display:flex;flex-direction:column;justify-content:space-between;position:relative;overflow:hidden">
<div style="position:absolute;right:-90px;top:-90px;width:380px;height:380px;border-radius:50%;background:${ac};opacity:.25"></div>
<div style="position:absolute;right:120px;bottom:-120px;width:260px;height:260px;border-radius:50%;background:${ac};opacity:.18"></div>
<div style="font-size:26px;font-weight:700;letter-spacing:.08em"><span style="background:${ac};color:#fff;padding:6px 20px;border-radius:999px">${esc(cat || "採用情報")}</span></div>
<div style="font-size:${size}px;font-weight:800;line-height:1.35;letter-spacing:-.02em;max-width:980px">${esc(title)}</div>
<div style="font-size:26px;font-weight:700;letter-spacing:.06em">行雲流水｜FLOWCLOUD・glow 採用情報</div></div></body></html>`;
fs.mkdirSync("client/public/images/blog", { recursive: true });
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1200, height: 630 } });
await p.setContent(html); await p.waitForTimeout(300);
await p.screenshot({ path: `client/public/images/blog/${slug}.jpg`, type: "jpeg", quality: 88 });
await b.close(); console.log("banner ->", `client/public/images/blog/${slug}.jpg`);
