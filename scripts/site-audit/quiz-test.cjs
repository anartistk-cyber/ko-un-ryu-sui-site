const {chromium}=require('playwright');const fs=require('fs');const path=require('path');
const [,, siteDir, imgDir, out, idx]=process.argv;
(async()=>{
 const http=require('http');
 const srv=http.createServer((req,res)=>{let p=decodeURIComponent(req.url.split('?')[0]);if(p.endsWith('/'))p+='index.html';const f=path.join(siteDir,p);fs.readFile(f,(e,d)=>{if(e){res.writeHead(404);res.end();return}const ext=path.extname(f);res.writeHead(200,{'content-type':{'.html':'text/html;charset=utf-8','.css':'text/css','.jpg':'image/jpeg','.png':'image/png'}[ext]||'application/octet-stream'});res.end(d)})}).listen(8798);
 const br=await chromium.launch();const ctx=await br.newContext({viewport:{width:1280,height:900},reducedMotion:'reduce'});const pg=await ctx.newPage();
 const errs=[];pg.on('pageerror',e=>errs.push(String(e)));pg.on('console',m=>{if(m.type()==='error'&&!/net::|Failed to load/.test(m.text()))errs.push(m.text())});
 await pg.route('**/*',r=>{const u=r.request().url();if(u.startsWith('http://localhost:8798')){const m=u.match(/\/(?:cms\/)?wp-content\/uploads\/(?:\d{4}\/\d{2}\/)?([^\/]+?)(?:-\d+x\d+)?\.jpg/);if(m){const f=path.join(imgDir,m[1]+'.jpg');if(fs.existsSync(f))return r.fulfill({path:f,contentType:'image/jpeg'});return r.fulfill({status:404,body:''})}return r.continue()}return r.abort()});
 await pg.goto('http://localhost:8798/',{waitUntil:'load'});
 const before=await pg.$$eval('.quiz .r',els=>els.map(e=>getComputedStyle(e).display));
 await pg.click('.q-opts li:nth-child('+idx+') label');
 const after=await pg.$$eval('.quiz .r',els=>els.map(e=>getComputedStyle(e).display));
 console.log(JSON.stringify({before,after,errs}));
 const el=await pg.$('#quiz');await el.scrollIntoViewIfNeeded();await pg.waitForTimeout(600);
 await el.screenshot({path:out});
 await br.close();srv.close();
})();
