// 使い方: node scripts/make-video.mjs <slug> "<見出し>" "<小さな一言>" <写真1> [写真2 写真3...]
// 写真は client/public/images/ 配下のファイル名。client/public/images/blog/<slug>.mp4 と <slug>-poster.jpg（1280x720・約12〜20秒・音なし）を作る。
import { execFileSync } from "node:child_process"; import fs from "node:fs";
const [slug, title, sub, ...photos] = process.argv.slice(2);
if (!slug || !title || !photos.length) { console.error("usage: make-video.mjs slug title sub photo..."); process.exit(1); }
const out = "client/public/images/blog"; fs.mkdirSync(out, { recursive: true });
const font = "/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc";
const per = 5, args = []; const filters = [];
photos.forEach((p, i) => {
  args.push("-loop", "1", "-framerate", "25", "-t", String(per), "-i", `client/public/images/${p}`);
  filters.push(`[${i}:v]scale=1280:720:force_original_aspect_ratio=increase,crop=1280:720,setsar=1,fade=t=in:d=0.6,fade=t=out:st=${per - 0.6}:d=0.6[v${i}]`);
});
const esc = s => s.replace(/[\\:']/g, m => "\\" + m);
const cat = photos.map((_, i) => `[v${i}]`).join("") + `concat=n=${photos.length}:v=1:a=0[c]`;
const text = `[c]drawbox=x=0:y=500:w=1280:h=220:color=black@0.45:t=fill,drawtext=fontfile=${font}:text='${esc(title)}':fontcolor=white:fontsize=54:x=60:y=545,drawtext=fontfile=${font}:text='${esc(sub || "")}':fontcolor=white:fontsize=30:x=60:y=630[o]`;
execFileSync("ffmpeg", ["-y", ...args, "-filter_complex", [...filters, cat, text].join(";"), "-map", "[o]", "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "30", "-preset", "veryfast", "-movflags", "+faststart", `${out}/${slug}.mp4`], { stdio: "ignore" });
execFileSync("ffmpeg", ["-y", "-ss", "1.5", "-i", `${out}/${slug}.mp4`, "-frames:v", "1", "-q:v", "4", `${out}/${slug}-poster.jpg`], { stdio: "ignore" });
console.log("video ->", `${out}/${slug}.mp4`, (fs.statSync(`${out}/${slug}.mp4`).size / 1024) | 0, "KB");
