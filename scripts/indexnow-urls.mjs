// IndexNow に送る内容（JSON）を作る。サンドボックスからは api.indexnow.org に届かないため、
// 出力した JSON を Chrome のタブから送る（手順は autopost/INDEXNOW.md）。
// 使い方: node scripts/indexnow-urls.mjs fc|glow|recruit [--paths /cut/,/color/]
//   --paths を付けると、そのパスだけ（更新したページだけ）を送る。付けなければ sitemap の全URL。
import fs from 'fs';
import {INDEXNOW_KEY} from '../shared/indexnow.mjs';
const SITES={
  fc:{host:'www.flowcloud.net',base:'https://www.flowcloud.net',sitemap:'fc-site/site/sitemap-fc.xml'},
  glow:{host:'glow-izumiotsu.jp',base:'https://glow-izumiotsu.jp',sitemap:'glow-site/site/sitemap-gl.xml'},
  recruit:{host:'ko-un-ryu-sui.com',base:'https://ko-un-ryu-sui.com',sitemap:'site/sitemap.xml'},
};
const [,, name, ...rest]=process.argv;
const s=SITES[name];
if(!s){console.error('usage: node scripts/indexnow-urls.mjs fc|glow|recruit [--paths /a/,/b/]');process.exit(1);}
const pi=rest.indexOf('--paths');
let urls;
if(pi>=0){urls=rest[pi+1].split(',').filter(Boolean).map(p=>s.base+(p.startsWith('/')?p:'/'+p));}
else{urls=[...fs.readFileSync(s.sitemap,'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1].trim());}
urls=[...new Set(urls)].filter(u=>u.startsWith(s.base+'/'));
console.log(JSON.stringify({host:s.host,key:INDEXNOW_KEY,keyLocation:`${s.base}/${INDEXNOW_KEY}.txt`,urlList:urls}));
