// posts.ts と固定ページ一覧から client/public/sitemap.xml を生成する。
import fs from "node:fs";
const SITE = "https://ko-un-ryu-sui.com";
const src = fs.readFileSync("client/src/data/posts.ts", "utf8");
const posts = [...src.matchAll(/slug: "([a-z0-9-]+)"[\s\S]*?date: "(\d{4}-\d{2}-\d{2})"/g)].map(m => ({ slug: m[1], date: m[2] }));
const latest = posts.map(p => p.date).sort().pop();
const today = process.argv[2] || latest;
const fixed = ["/", "/jobs/stylist", "/jobs/assistant", "/jobs/part", "/jobs/student", "/recruit/newgrad", "/recruit/career", "/recruit/student", "/area", "/school", "/blog/", "/faq", "/privacy"];
const urls = [...fixed.map(u => [u, today]), ...posts.map(p => [`/blog/${p.slug}`, p.date])];
fs.writeFileSync("client/public/sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(([u, d]) => `  <url>\n    <loc>${SITE}${u}</loc>\n    <lastmod>${d}</lastmod>\n  </url>`).join("\n")}\n</urlset>\n`);
console.log("sitemap:", urls.length, "urls");
