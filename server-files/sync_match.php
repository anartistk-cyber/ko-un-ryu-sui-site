<?php
// Xserver cron用（match.ko-un-ryu-sui.com）：GitHub公開リポジトリの match-site/site/ から、許可されたファイルだけを public_html に取り込む。
// 受付の PHP（app.php）も取り込むため、他の sync より厳しくしている：
//   ・拡張子の許可リスト（html js css png jpg jpeg webp svg xml txt json php）
//   ・.htaccess・名前に config を含むファイル・sync*.php・DB・ログは絶対に上書きしない
//   ・パスに ".." を含むもの、"data/" "." で始まるものは拒否
//   ・manifest の sha256 が一致しなければ書かない（書く前に一時ファイルへ）
// 使い方（cron）：php /home/<サーバーID>/<ドメイン>/sync_match.php <サブドメインのフォルダ名>
//   例：php /home/flowcloud/ko-un-ryu-sui.com/sync_match.php match-new.ko-un-ryu-sui.com
//   ※このファイルは public_html の1つ上（Webから見えない場所）に置く。取り込み先は public_html/<フォルダ名>/
if (php_sapi_name() !== 'cli') { http_response_code(404); exit; }
$BASE = 'https://raw.githubusercontent.com/anartistk-cyber/ko-un-ryu-sui-site/main/match-site/site/';
function logm($m) { file_put_contents(__DIR__ . '/sync_match.log', date('c') . ' ' . $m . "\n", FILE_APPEND); }
$SUB = $argv[1] ?? '';
if (!preg_match('/^[a-z0-9][a-z0-9.-]*$/', $SUB) || strpos($SUB, '..') !== false) { fwrite(STDERR, "usage: php sync_match.php <subdomain folder>\n"); exit(2); }
$ROOT = __DIR__ . '/public_html/' . $SUB;
if (!is_dir($ROOT)) { logm("no such folder $ROOT"); exit(1); }
$ALLOW = ['html', 'js', 'css', 'png', 'jpg', 'jpeg', 'webp', 'svg', 'xml', 'txt', 'json', 'php'];
function get($u) { $c = curl_init($u); curl_setopt_array($c, [CURLOPT_RETURNTRANSFER => 1, CURLOPT_FOLLOWLOCATION => 1, CURLOPT_TIMEOUT => 60, CURLOPT_USERAGENT => 'match-sync']); $b = curl_exec($c); $s = curl_getinfo($c, CURLINFO_HTTP_CODE); curl_close($c); return [$s, $b]; }
[$s, $b] = get($BASE . 'manifest.json?t=' . time());
if ($s !== 200) { logm("manifest fetch failed $s"); exit(1); }
$m = json_decode($b, true);
if (!isset($m['files']) || count($m['files']) < 4) { logm('manifest invalid'); exit(1); }
$n = 0;
// アセットを先に、HTMLを後に（新HTMLが参照するJSが先に揃うように）
usort($m['files'], fn($a, $b) => (substr($a['path'], -5) === '.html') <=> (substr($b['path'], -5) === '.html'));
foreach ($m['files'] as $f) {
    $p = $f['path'] ?? ''; $h = $f['sha256'] ?? '';
    if ($p === '' || strpos($p, '..') !== false || $p[0] === '/' || $p[0] === '.' || strpos($p, 'data/') === 0 || strpos($p, 'match-data/') === 0 || strpos($p, "\0") !== false) continue;
    $base = basename($p);
    if ($base === '.htaccess' || stripos($base, 'config') !== false || stripos($base, 'sync') === 0 || preg_match('/\.(sqlite3?|db|log|sql)$/i', $base)) continue;
    if (!in_array(strtolower(pathinfo($p, PATHINFO_EXTENSION)), $ALLOW, true)) continue;
    if (!preg_match('/^[a-f0-9]{64}$/', $h)) continue;
    $dst = $ROOT . '/' . $p;
    if (is_file($dst) && hash_file('sha256', $dst) === $h) continue;
    [$s, $b] = get($BASE . str_replace('%2F', '/', rawurlencode($p)));
    if ($s !== 200 || hash('sha256', $b) !== $h) { logm("skip $p ($s)"); continue; }
    @mkdir(dirname($dst), 0755, true);
    file_put_contents($dst . '.tmp', $b); rename($dst . '.tmp', $dst); $n++;
}
logm("$SUB: synced $n files");
