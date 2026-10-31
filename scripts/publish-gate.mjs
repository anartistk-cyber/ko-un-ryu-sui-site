// 公開ゲート: dist内に未確定マーカーが残っていれば失敗する。
import fs from 'fs'; import path from 'path';
const dir = process.argv[2] || 'dist'; const bad = [];
const walk = d => fs.readdirSync(d,{withFileTypes:true}).forEach(e=>{const p=path.join(d,e.name);
  if(e.isDirectory()) return walk(p);
  if(!/\.(html|js|xml|json|php)$/.test(e.name)) return;
  const t=fs.readFileSync(p,'utf8'); const m=t.match(/【要確定|【公開前確認|data-tbd="1"|class="tbd"/g);
  if(m) bad.push(`${p}: ${m.length}`);});
walk(dir);
if(bad.length){console.error('PUBLISH GATE FAILED（未確定項目が残っています）:\n'+bad.join('\n')); process.exit(1);}
console.log('publish gate OK');
