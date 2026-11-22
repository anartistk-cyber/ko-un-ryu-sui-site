// 採用マッチング診断の公開物（site/）を整える。
//   node build.mjs          … site/lib/admin.js と site/manifest.json を作り直す
//   node build.mjs --check  … 作り直した結果が今のファイルと同じか確かめる（違えば終了コード1）
// admin.js ＝ 診断の質問・採点（site/diagnosis.js）＋ 管理画面の部品（src/admin-parts.js）。
// 診断を直したときも、管理画面の「診断の内訳」が必ず同じ質問・採点で表示されるようにするため、自動で連結する。
import fs from 'node:fs'; import path from 'node:path'; import crypto from 'node:crypto'; import { fileURLToPath } from 'node:url';
const root = path.dirname(fileURLToPath(import.meta.url));
const site = path.join(root, 'site');
const check = process.argv.includes('--check');
const read = p => fs.readFileSync(path.join(root, p), 'utf8');

const banner = '// 採用マッチング診断 管理画面の描画。build.mjs が site/diagnosis.js（質問・採点）と src/admin-parts.js（管理画面の部品）から自動で作る。直接は編集しない。\n';
const adminJs = banner + read('site/diagnosis.js').replace(/\s+$/, '') + '\n\n' + read('src/admin-parts.js');

const outputs = { 'lib/admin.js': adminJs };
let bad = 0;
for (const [rel, content] of Object.entries(outputs)) {
  const file = path.join(site, rel);
  if (check) { if (!fs.existsSync(file) || fs.readFileSync(file, 'utf8') !== content) { console.log('古い:', rel); bad++; } }
  else { fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, content); }
}

const list = [];
(function walk(dir) {
  for (const name of fs.readdirSync(dir).sort()) {
    const p = path.join(dir, name);
    if (fs.statSync(p).isDirectory()) walk(p);
    else if (name !== 'manifest.json') list.push(path.relative(site, p).split(path.sep).join('/'));
  }
})(site);
const manifest = JSON.stringify({ files: list.sort().map(p => ({ path: p, sha256: crypto.createHash('sha256').update(fs.readFileSync(path.join(site, p))).digest('hex') })) }, null, 1) + '\n';
const mf = path.join(site, 'manifest.json');
if (check) { if (!fs.existsSync(mf) || fs.readFileSync(mf, 'utf8') !== manifest) { console.log('古い: manifest.json'); bad++; } }
else fs.writeFileSync(mf, manifest);
console.log(check ? (bad ? `NG ${bad}件（node build.mjs を実行）` : 'OK（admin.js・manifest.json は最新）') : `作成: admin.js ${adminJs.length}文字・manifest ${list.length}ファイル`);
process.exit(bad ? 1 : 0);
