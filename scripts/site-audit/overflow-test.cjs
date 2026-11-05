const {chromium}=require('playwright');const fs=require('fs');const path=require('path');
const [,, siteDir, imgDir, port]=process.argv;
(async()=>{
 const http=require('http');
 const srv=http.createServer((req,res)=>{let p=decodeURIComponent(req.url.split('?')[0]);if(p.endsWith('/'))p+='index.html';const f=path.join(siteDir,p);fs.readFile(f,(e,d)=>{if(e){res.writeHead(404);res.end();return}const ext=path.extname(f);res.writeHead(200,{'content-type':{'.html':'text/html;charset=utf-8','.css':'text/css','.jpg':'image/jpeg','.png':'image/png'}[ext]||'application/octet-stream'});res.end(d)})}).listen(+port);
 const pages=[];(function walk(d){for(const f of fs.readdirSync(d)){const p=path.join(d,f);if(fs.statSync(p).isDirectory())walk(p);else if(f==='index.html')pages.push('/'+path.relative(siteDir,path.dirname(p)).replace(/\\/g,'/')+'/')}})(siteDir);
 pages.sort();const br=await chromium.launch();const bad=[];
 for(const w of [360,390,768,1280]){
  const ctx=await br.newContext({viewport:{width:w,height:900},reducedMotion:'reduce'});const pg=await ctx.newPage();
  await pg.route('**/*',r=>{const u=r.request().url();if(u.startsWith('http://localhost:'+port)){const m=u.match(/\/(?:cms\/)?wp-content\/uploads\/(?:\d{4}\/\d{2}\/)?([^\/]+?)(?:-\d+x\d+)?\.jpg/);if(m){const f=path.join(imgDir,m[1]+'.jpg');if(fs.existsSync(f))return r.fulfill({path:f,contentType:'image/jpeg'});return r.fulfill({status:404,body:''})}return r.continue()}return r.abort()});
  for(const p of pages){
   await pg.goto('http://localhost:'+port+(p==='//'?'/':p),{waitUntil:'load'});
   const r=await pg.evaluate(()=>{const de=document.documentElement;const over=de.scrollWidth-de.clientWidth;let who=[];if(over>1){for(const e of document.body.querySelectorAll('*')){const b=e.getBoundingClientRect();if(b.right>de.clientWidth+1&&b.width>0&&getComputedStyle(e).position!=='fixed'){const cs=getComputedStyle(e.parentElement);who.push(e.tagName+'.'+(e.className||'').toString().slice(0,30)+' r='+Math.round(b.right));if(who.length>3)break}}}return {over,who}});
   if(r.over>1)bad.push(w+'px '+p+' over='+r.over+' '+r.who.join(' | '));
  }
  await ctx.close()}
 console.log(pages.length+' pages x 4 widths; overflow:',bad.length);bad.forEach(b=>console.log(' ',b));
 await br.close();srv.close();
})();
