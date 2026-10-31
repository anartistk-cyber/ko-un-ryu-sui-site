<?php
// Xserver cron用（flowcloud.net）：GitHub公開リポジトリの fc-site/site/ から、許可されたパスだけを public_html に取り込む。
// WordPress本体(cms/ 等)・.htaccess は絶対に触らない。sha256一致時のみ書き込み。
if (php_sapi_name() !== 'cli') { http_response_code(404); exit; }
$BASE = 'https://raw.githubusercontent.com/anartistk-cyber/ko-un-ryu-sui-site/main/fc-site/site/';
$ROOT = __DIR__ . '/public_html';
$ALLOW_EXT = ['html','css','js','png','jpg','jpeg','webp','svg','xml','txt','json'];
// 
$DENY_PREFIX = ['cms/','official/','wp-','xmlrpc','index.php','.']; // WordPress本体などは触らない
function get($u){ $c=curl_init($u); curl_setopt_array($c,[CURLOPT_RETURNTRANSFER=>1,CURLOPT_FOLLOWLOCATION=>1,CURLOPT_TIMEOUT=>60,CURLOPT_USERAGENT=>'fc-sync']); $b=curl_exec($c); $s=curl_getinfo($c,CURLINFO_HTTP_CODE); curl_close($c); return [$s,$b]; }
function logm($m){ file_put_contents(__DIR__.'/sync_fc.log', date('c').' '.$m."\n", FILE_APPEND); }
[$s,$b]=get($BASE.'manifest.json?t='.time());
if($s!==200){ logm("manifest fetch failed $s"); exit(1); }
$m=json_decode($b,true); if(!isset($m['files'])||count($m['files'])<5){ logm('manifest invalid'); exit(1); }
$n=0;
usort($m['files'], fn($a,$b)=>(substr($a['path'],-5)==='.html')<=>(substr($b['path'],-5)==='.html'));
foreach($m['files'] as $f){
  $p=$f['path']; $h=$f['sha256'];
  if(strpos($p,'..')!==false||$p===''||$p[0]==='/'||basename($p)==='.htaccess') continue;
  $deny=false; foreach($DENY_PREFIX as $d){ if(strpos($p,$d)===0){$deny=true;break;} } if($deny) continue;
  if(!in_array(strtolower(pathinfo($p,PATHINFO_EXTENSION)),$ALLOW_EXT,true)) continue;
  $dst=$ROOT.'/'.$p;
  if(is_file($dst)&&hash_file('sha256',$dst)===$h) continue;
  [$s,$b]=get($BASE.str_replace('%2F','/',rawurlencode($p)));
  if($s!==200||hash('sha256',$b)!==$h){ logm("skip $p ($s)"); continue; }
  @mkdir(dirname($dst),0755,true);
  file_put_contents($dst.'.tmp',$b); rename($dst.'.tmp',$dst); $n++;
}
logm("synced $n files");
