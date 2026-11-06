// style.css を公開物に出すときの縮小（minify）。esbuild が無い環境では元のCSSをそのまま出す（見た目は同じ）。
import fs from 'node:fs';
import {createRequire} from 'node:module';
export function readCssMin(file){
  const src=fs.readFileSync(file,'utf8');
  try{
    const {transformSync}=createRequire(import.meta.url)('esbuild');
    return transformSync(src,{loader:'css',minify:true,legalComments:'none',target:['chrome90','safari14','firefox90']}).code;
  }catch(e){
    console.warn('css-min: esbuild が使えないため縮小せずに出力します');
    return src;
  }
}
