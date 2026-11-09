const { chromium } = require('playwright');
(async()=>{
  const b = await chromium.launch(); const p = await b.newPage({viewport:{width:1280,height:956}, deviceScaleFactor:1});
  await p.goto('file://'+process.argv[2]); await p.waitForTimeout(500);
  await p.screenshot({path:process.argv[3], type:'png'}); await b.close();
})();
