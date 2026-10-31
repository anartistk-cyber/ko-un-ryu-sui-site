<?php
// Xserver cron用：GitHubの公開リポジトリ（site/）から、更新されたファイルだけを public_html に取り込む。
// 安全のため：許可する拡張子のみ／.htaccess・contact.php・sync.php は絶対に上書きしない／パスに ".." を含むものは拒否／sha256が一致しなければ書かない。
// 使い方（cron）：php /home/<サーバーID>/ko-un-ryu-sui.com/public_html/sync.php   ※sync.phpはブラウザから実行できないよう .htaccess で拒否する
if (php_sapi_name() !== 'cli') { http_response_code(404); exit; }
$BASE = 'https://raw.githubusercontent.com/anartistk-cyber/ko-un-ryu-sui-site/main/site/';
$ROOT = __DIR__;
$ALLOW = ['html','js','css','png','jpg','jpeg','webp','svg','xml','txt','json','mp4'];
$NEVER = ['.htaccess','contact.php','sync.php','sync.log'];
function get($u){ $c=curl_init($u); curl_setopt_array($c,[CURLOPT_RETURNTRANSFER=>1,CURLOPT_FOLLOWLOCATION=>1,CURLOPT_TIMEOUT=>60,CURLOPT_USERAGENT=>'kr-sync']); $b=curl_exec($c); $s=curl_getinfo($c,CURLINFO_HTTP_CODE); curl_close($c); return [$s,$b]; }
function logm($m){ file_put_contents(__DIR__.'/sync.log', date('c').' '.$m."\n", FILE_APPEND); }
[$s,$b]=get($BASE.'manifest.json?t='.time());
if($s!==200){ logm("manifest fetch failed $s"); exit(1); }
$m=json_decode($b,true); if(!isset($m['files'])||count($m['files'])<10){ logm('manifest invalid'); exit(1); }
$n=0;
// アセットを先に、HTMLを後に（新HTMLが参照するJS/CSSが先に揃うように）
usort($m['files'], fn($a,$b)=>(substr($a['path'],-5)==='.html')<=>(substr($b['path'],-5)==='.html'));
foreach($m['files'] as $f){
  $p=$f['path']; $h=$f['sha256'];
  if(strpos($p,'..')!==false||$p[0]==='/'||in_array(basename($p),$NEVER,true)) continue;
  if(!in_array(strtolower(pathinfo($p,PATHINFO_EXTENSION)),$ALLOW,true)) continue;
  $dst=$ROOT.'/'.$p;
  if(is_file($dst)&&hash_file('sha256',$dst)===$h) continue;
  [$s,$b]=get($BASE.str_replace('%2F','/',rawurlencode($p)));
  if($s!==200||hash('sha256',$b)!==$h){ logm("skip $p ($s)"); continue; }
  @mkdir(dirname($dst),0755,true);
  file_put_contents($dst.'.tmp',$b); rename($dst.'.tmp',$dst); $n++;
}
logm("synced $n files");
