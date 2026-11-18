// glowブログ用の文字入りカード（1200x900 JPG）を作る。使い方:
//   node tools/make-card.mjs <slug> <pattern:1-4> "<kicker>" "<title(改行は\n)>" "<point1>|<point2>|<point3>"
// 出力: glow-site/img/card-<slug>.jpg（ビルドで /gl/img/card-<slug>.jpg に公開される）
// 人物・店内の偽写真は描かない。文字と図形だけのイメージ画像。
import {createRequire} from 'node:module';const {chromium}=createRequire(import.meta.url)('playwright');
import fs from 'node:fs';import path from 'node:path';import {fileURLToPath} from 'node:url';
const [slug,pat='1',kicker='',title='',pts='']=process.argv.slice(2);
if(!slug||!title){console.error('usage: make-card.mjs slug pattern kicker title "a|b|c"');process.exit(1)}
const esc=s=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;');
const T=title.replace(/\\n/g,'\n').split('\n').map(esc).join('<br>');
const P=pts.split('|').filter(Boolean).map(esc);
// 配色4種: 1=ミント 2=ピンク 3=バター 4=ベリー
const C={1:['#e4f5ee','#1d6b57','#7fd0b4','#fff'],2:['#ffdfe7','#d03a65','#f59ab3','#fff'],3:['#fff3c4','#8a5a1a','#ffd25c','#fff'],4:['#f9c3d1','#a82a4e','#d03a65','#fff6f8']}[pat]||[];
const [bg,ink,acc,card]=C;
const deco=pat==='1'?`<i style="left:-80px;top:-80px;width:340px;height:340px"></i><i style="right:-60px;bottom:-90px;width:300px;height:300px"></i>`
 :pat==='2'?`<i style="right:-70px;top:-70px;width:320px;height:320px"></i><i style="left:60px;bottom:-110px;width:240px;height:240px"></i><i style="right:200px;bottom:60px;width:60px;height:60px"></i>`
 :pat==='3'?`<i style="left:-60px;bottom:-60px;width:360px;height:360px"></i><i style="right:90px;top:50px;width:90px;height:90px"></i>`
 :`<i style="right:-100px;top:200px;width:380px;height:380px"></i><i style="left:-50px;top:-50px;width:200px;height:200px"></i>`;
const html=`<!doctype html><meta charset=utf-8><style>
*{box-sizing:border-box;margin:0}body{width:1200px;height:900px;background:${bg};font-family:"Zen Maru Gothic","Noto Sans CJK JP","Noto Sans JP","Hiragino Maru Gothic ProN","IPAexGothic",sans-serif;color:${ink};position:relative;overflow:hidden}
i{position:absolute;border-radius:50%;background:${acc};opacity:.35}
.w{position:absolute;inset:70px 80px;display:flex;flex-direction:column;justify-content:center;gap:34px}
.k{align-self:flex-start;background:${ink};color:${card};padding:10px 28px;border-radius:99px;font-size:30px;font-weight:700;letter-spacing:.08em}
h1{font-size:84px;line-height:1.3;font-weight:900;letter-spacing:.02em}
ul{list-style:none;padding:0;display:flex;flex-direction:column;gap:16px}
li{background:${card};border-radius:26px;padding:18px 30px;font-size:36px;font-weight:700;display:flex;gap:18px;align-items:center}
li:before{content:"";width:22px;height:22px;border-radius:50%;background:${acc};flex:none}
.f{position:absolute;right:80px;bottom:44px;font-size:30px;font-weight:700;letter-spacing:.12em}
</style><body>${deco}<div class=w>${kicker?`<div class=k>${esc(kicker)}</div>`:''}<h1>${T}</h1>${P.length?`<ul>${P.map(p=>`<li>${p}</li>`).join('')}</ul>`:''}</div><div class=f>glow ｜ 泉大津駅 徒歩1分</div>`;
const out=path.join(path.dirname(fileURLToPath(import.meta.url)),'..','img','card-'+slug+'.jpg');
const b=await chromium.launch();const pg=await b.newPage({viewport:{width:1200,height:900}});
await pg.setContent(html);await pg.evaluate(()=>document.fonts.ready);
await pg.screenshot({path:out,type:'jpeg',quality:86});await b.close();console.log(out);
