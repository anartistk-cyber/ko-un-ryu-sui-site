const {chromium}=require('playwright');const fs=require('fs');const path=require('path');
const [,, siteDir, imgDir, outPrefix, ...pages]=process.argv;
(async()=>{
 const http=require('http');
 const srv=http.createServer((req,res)=>{let p=decodeURIComponent(req.url.split('?')[0]);if(p.endsWith('/'))p+='index.html';const f=path.join(siteDir,p);fs.readFile(f,(e,d)=>{if(e){res.writeHead(404);res.end();return}const ext=path.extname(f);res.writeHead(200,{'content-type':{'.html':'text/html;charset=utf-8','.css':'text/css','.jpg':'image/jpeg','.png':'image/png'}[ext]||'application/octet-stream'});res.end(d)})}).listen(8799);
 const br=await chromium.launch();
 const prof=[['d',{width:1280,height:900},1],['m',{width:390,height:844},2]];
 for(const [tag,vp,dsf] of prof){
  const ctx=await br.newContext({viewport:vp,deviceScaleFactor:dsf,reducedMotion:'reduce'});const pg=await ctx.newPage();
  await pg.route('**/*',r=>{const u=r.request().url();
   if(u.startsWith('http://localhost:8799')){
     const m=u.match(/\/(?:cms\/)?wp-content\/uploads\/(?:\d{4}\/\d{2}\/)?([^\/]+?)(?:-\d+x\d+)?\.jpg/);
     if(m){const f=path.join(imgDir,m[1]+'.jpg');if(fs.existsSync(f))return r.fulfill({path:f,contentType:'image/jpeg'});return r.fulfill({status:404,body:''})}
     return r.continue()}
   return r.abort()});
  for(const p of pages){
   await pg.goto('http://localhost:8799'+p,{waitUntil:'load'});await pg.waitForTimeout(500);
   const name=outPrefix+'-'+tag+'-'+(p.replace(/\//g,'_')||'_')+'.png';
   await pg.screenshot({path:name,fullPage:true});console.log(name)}
  await ctx.close()}
 await br.close();srv.close();
})();
