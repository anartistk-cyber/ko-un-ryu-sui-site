const { chromium } = require('playwright');
const fs=require('fs');
const src='/home/claude/ko-un-ryu-sui-site/autopost/type-shindan-art/',out=process.argv[2];
(async()=>{const b=await chromium.launch();const pg=await (await b.newContext({viewport:{width:920,height:1120}})).newPage();
for(const k of ['creator','innovator','artist','meister','entertainer','producer','partner','advisor']){
  await pg.setContent('<html><body style="margin:0;background:transparent">'+fs.readFileSync(src+k+'.svg','utf8')+'</body></html>');
  await pg.screenshot({path:out+'/'+k+'.png',omitBackground:true,clip:{x:0,y:0,width:920,height:1120}});}
await b.close()})();
