<?php
// 手元の試験用（php -S のルーター）。本番の .htaccess と同じ振り分けをする。
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
if (preg_match('#^/(api|admin)(/|$)#', $path)) { require __DIR__ . '/../site/app.php'; return true; }
if (preg_match('#^/privacy/?$#', $path)) { header('Content-Type: text/html; charset=UTF-8'); readfile(__DIR__ . '/../site/privacy.html'); return true; }
if (preg_match('#^/lib/#', $path)) { http_response_code(403); echo 'Forbidden'; return true; }
$file = __DIR__ . '/../site' . $path;
if ($path !== '/' && !is_file($file)) { http_response_code(404); echo 'ページが見つかりません。'; return true; }
return false;
