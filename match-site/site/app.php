<?php
/**
 * 採用マッチング診断：受付API・管理画面（エックスサーバー用）
 *
 * ChatGPT Sites 版 worker/index.js のサーバー側（/api/funnel・/api/requests・/admin*）を PHP に置き換えたもの。
 * 診断ページ（index.html）・診断スクリプト（diagnosis.js）・プライバシー（privacy.html）は静的ファイルとして別に配信する。
 * 管理画面の「診断の内訳」は、採点コードを書き換えずに済むよう、元の JavaScript（lib/admin.js）をブラウザで動かして表示する。
 *
 * 設定と DB はこのファイルの1つ上（Webから見えない場所）に置く：
 *   ../config.php        … LINE・管理画面パスワードなどの秘密（config.sample.php を見本に藤津さんが作る。リポジトリには入れない）
 *   ../data/match.sqlite … 受付データ（初回アクセス時に自動で作られる）
 */

declare(strict_types=1);

if (PHP_VERSION_ID < 80100) { http_response_code(500); header('Content-Type: text/plain; charset=utf-8'); echo 'PHP 8.1 以上が必要です。'; exit; }

mb_internal_encoding('UTF-8');
date_default_timezone_set('UTC');

const DIAGNOSIS_VERSION = 5;        // 現在の診断の版（過去の版 1〜4 の受付も読める）
const QUESTION_COUNT = 7;           // 版3以降の質問数（版1・2は12問）
const TRACKS = ['newgrad' => '美容学生・新卒', 'career' => '中途美容師'];
const INTENT_LABELS = ['visit' => 'サロン見学', 'apply' => '応募', 'consult' => 'その他相談'];
const JOBS = ['美容師', 'アイリスト', 'エステ', 'ネイリスト', 'レセプション', 'その他'];
const FIELDS = [
    'name' => ['お名前（漢字）', 80],
    'kana' => ['お名前（ふりがな）', 100],
    'school' => ['学校名', 120],
    'grade' => ['学年', 40],
    'instagram' => ['Instagram ID', 40],
    'consultation' => ['相談内容', 1000],
];
const UUID_RE = '/^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}\z/i';
const RECEIPT_RE = '/^(?:[0-9]{6}|KR-[0-9A-F]{16})\z/';
const BODY_LIMIT = 16384;
const SCHEMA = <<<'SQL'
CREATE TABLE IF NOT EXISTS requests (receipt TEXT PRIMARY KEY, created TEXT NOT NULL, track TEXT NOT NULL, intent TEXT NOT NULL, answers TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'pending', application TEXT, question_version INTEGER NOT NULL DEFAULT 1, submission_id TEXT UNIQUE, line_accepted INTEGER NOT NULL DEFAULT 0);
CREATE TABLE IF NOT EXISTS sessions (token TEXT PRIMARY KEY, expires INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS login_limits (bucket TEXT PRIMARY KEY, until INTEGER NOT NULL, attempts INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS recruit_funnel (visit_id TEXT NOT NULL, event TEXT NOT NULL, PRIMARY KEY (visit_id,event));
SQL;

// ---------- 設定・DB ----------
function conf(): array
{
    static $c = null;
    if ($c !== null) { return $c; }
    $path = getenv('MATCH_CONFIG') ?: dirname(__DIR__) . '/config.php';
    $c = is_file($path) ? require $path : [];
    return is_array($c) ? $c : [];
}

function db(): PDO
{
    static $pdo = null;
    if ($pdo !== null) { return $pdo; }
    $dir = getenv('MATCH_DATA_DIR') ?: (conf()['data_dir'] ?? dirname(__DIR__) . '/data');
    if (!is_dir($dir)) { @mkdir($dir, 0700, true); }
    $pdo = new PDO('sqlite:' . $dir . '/match.sqlite', null, null, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);
    $pdo->exec('PRAGMA busy_timeout=5000');
    $pdo->exec(SCHEMA);
    return $pdo;
}

function one(string $sql, array $args = []): ?array
{
    $st = db()->prepare($sql);
    $st->execute($args);
    $row = $st->fetch();
    return $row === false ? null : $row;
}

function run(string $sql, array $args = []): int
{
    $st = db()->prepare($sql);
    $st->execute($args);
    return $st->rowCount();
}

function normalize_row(array $row): array
{
    $row['question_version'] = (int)$row['question_version'];
    $row['line_accepted'] = (int)$row['line_accepted'];
    return $row;
}

// ---------- 応答 ----------
function out(int $status, string $body, string $type = 'text/plain; charset=utf-8', array $extra = []): never
{
    http_response_code($status);
    header('Cache-Control: no-store');
    header('X-Content-Type-Options: nosniff');
    header('Referrer-Policy: same-origin');
    header('X-Frame-Options: DENY');
    header('Content-Type: ' . $type);
    foreach ($extra as $name => $value) { header($name . ': ' . $value, false); }
    echo $body;
    exit;
}

function json_out(int $status, array $body): never
{
    out($status, json_encode($body, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES), 'application/json; charset=utf-8');
}

function page(int $status, string $body, array $extra = []): never
{
    $style = 'body{margin:2rem auto;padding:0 1rem;max-width:850px;color:#263c34;background:#f8faf7;font:16px/1.65 system-ui,sans-serif}article,main{border:1px solid #d3ddd5;padding:1rem;border-radius:14px;margin:1rem 0;background:white}button,input{font:inherit;padding:.45rem}button,summary{cursor:pointer}li{margin:.55rem 0}a{color:#254e42}form{margin:.5rem 0}';
    out($status, '<!doctype html><html lang="ja"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>採用担当画面</title><style>' . $style . '</style><body>' . $body . '</body></html>', 'text/html; charset=utf-8', $extra);
}

function redirect(string $target, array $extra = []): never
{
    out(303, '', 'text/plain', ['Location' => $target] + $extra);
}

function read_body(): string
{
    if ((int)($_SERVER['CONTENT_LENGTH'] ?? 0) > BODY_LIMIT) { throw new RuntimeException('too large'); }
    $raw = file_get_contents('php://input', false, null, 0, BODY_LIMIT + 1);
    if ($raw === false || strlen($raw) > BODY_LIMIT) { throw new RuntimeException('too large'); }
    return $raw;
}

function origin(): string
{
    $configured = conf()['origin'] ?? '';
    if (is_string($configured) && $configured !== '') { return rtrim($configured, '/'); }
    $https = ($_SERVER['HTTPS'] ?? '') !== '' && ($_SERVER['HTTPS'] ?? '') !== 'off';
    return ($https ? 'https' : 'http') . '://' . ($_SERVER['HTTP_HOST'] ?? 'localhost');
}

// ---------- 入力の検査（worker/index.js と同じ条件） ----------
/** JavaScript の Number.isInteger 相当（1.0 は整数）。整数なら int、そうでなければ null */
function as_int(mixed $v): ?int
{
    if (is_int($v)) { return $v; }
    if (is_float($v) && is_finite($v) && floor($v) == $v && abs($v) < 9e15) { return (int)$v; }
    return null;
}

/** JavaScript の String.prototype.length（UTF-16 の長さ） */
function js_length(string $s): int
{
    return intdiv(strlen(mb_convert_encoding($s, 'UTF-16LE', 'UTF-8')), 2);
}

/** JavaScript の String.prototype.trim 相当（全角スペース・NBSP なども除く） */
function js_trim(string $s): string
{
    return (string)preg_replace('/^[\s\p{Z}\x{FEFF}]+|[\s\p{Z}\x{FEFF}]+\z/u', '', $s);
}

function parse_application(mixed $input): ?array
{
    if (!is_array($input) || !array_key_exists('jobs', $input) || !is_array($input['jobs']) || !array_is_list($input['jobs'])) { return null; }
    $jobs = $input['jobs'];
    if (count($jobs) === 0 || count($jobs) > count(JOBS)) { return null; }
    foreach ($jobs as $job) { if (!is_string($job) || !in_array($job, JOBS, true)) { return null; } }
    $result = ['jobs' => array_values(array_unique($jobs))];
    foreach (FIELDS as $key => [, $limit]) {
        $raw = array_key_exists($key, $input) && $input[$key] !== null ? $input[$key] : '';
        if (!is_string($raw)) { return null; }
        $value = js_trim($raw);
        if (js_length($value) > $limit || ($value === '' && $key !== 'instagram')) { return null; }
        $result[$key] = $value;
    }
    return $result;
}

function js_json(mixed $v): string
{
    return json_encode($v, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
}

function uuid4(): string
{
    $b = random_bytes(16);
    $b[6] = chr((ord($b[6]) & 0x0f) | 0x40);
    $b[8] = chr((ord($b[8]) & 0x3f) | 0x80);
    $h = bin2hex($b);
    return substr($h, 0, 8) . '-' . substr($h, 8, 4) . '-' . substr($h, 12, 4) . '-' . substr($h, 16, 4) . '-' . substr($h, 20);
}

function now_ms(): int
{
    return (int)floor(microtime(true) * 1000);
}

function iso_now(): string
{
    $ms = now_ms();
    return gmdate('Y-m-d\TH:i:s', intdiv($ms, 1000)) . sprintf('.%03dZ', $ms % 1000);
}

function admin_url(string $origin, string $receipt): string
{
    return $origin . '/admin?receipt=' . rawurlencode($receipt);
}

function line_ready(): bool
{
    $c = conf();
    $password = (string)($c['admin_password'] ?? '');
    return mb_strlen($password) >= 16
        && (string)($c['line_token'] ?? '') !== ''
        && preg_match('/^[UC][0-9a-f]{32}\z/i', (string)($c['line_target'] ?? '')) === 1;
}

// ---------- LINE 通知（Messaging API の push） ----------
function send_line(array $row, ?array $application): array
{
    $c = conf();
    $profile = [];
    if ($application !== null) {
        foreach (FIELDS as $key => [$label]) {
            $v = $application[$key] ?? '';
            $profile[] = $label . ' ' . ($v !== '' ? $v : '未入力');
        }
        $profile[] = '興味のある職種 ' . implode('・', $application['jobs']);
    }
    $noDiagnosis = $row['answers'] === 'null';
    $lines = array_merge(
        ['行雲流水 採用受付', '受付番号 ' . $row['receipt'],
            '区分 ' . INTENT_LABELS[$row['intent']] . ($noDiagnosis ? '' : ' ／ ' . TRACKS[$row['track']])],
        $profile,
        ['診断 ' . ($noDiagnosis ? 'なし' : '管理画面で確認できます'), '', '採用担当画面', admin_url(origin(), $row['receipt'])]
    );
    $payload = js_json(['to' => $c['line_target'], 'messages' => [['type' => 'text', 'text' => implode("\n", $lines)]]]);
    $endpoint = (string)($c['line_endpoint'] ?? 'https://api.line.me/v2/bot/message/push');
    $acceptedId = false;
    $ch = curl_init($endpoint);
    curl_setopt_array($ch, [
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => $payload,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 8,
        CURLOPT_HTTPHEADER => [
            'Authorization: Bearer ' . $c['line_token'],
            'Content-Type: application/json',
            'X-Line-Retry-Key: ' . $row['submission_id'],
        ],
        CURLOPT_HEADERFUNCTION => function ($ch, $h) use (&$acceptedId) {
            if (stripos($h, 'x-line-accepted-request-id:') === 0) { $acceptedId = true; }
            return strlen($h);
        },
    ]);
    $body = curl_exec($ch);
    if ($body === false) { $err = curl_error($ch); curl_close($ch); throw new RuntimeException('line unreachable: ' . $err); }
    $status = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    $accepted = ($status >= 200 && $status < 300) || ($status === 409 && $acceptedId);
    if (!$accepted) { error_log('Recruitment LINE push rejected status=' . $status); }
    return ['accepted' => $accepted, 'status' => $status];
}

// ---------- ルーティング ----------
try {
    $method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
    $path = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';

    if ($method === 'POST' && ($_SERVER['HTTP_ORIGIN'] ?? null) !== origin()) { out(403, 'Forbidden'); }

    // 設置の確認用（DB が開けるか・秘密が入っているかの「はい／いいえ」だけを返す。値は返さない）
    if ($path === '/api/health' && $method === 'GET') {
        $dbOk = true;
        try { one('SELECT 1 AS ok'); } catch (Throwable $e) { $dbOk = false; error_log('match health: ' . $e->getMessage()); }
        json_out($dbOk ? 200 : 503, ['ok' => $dbOk, 'db' => $dbOk, 'config' => line_ready(), 'php' => PHP_MAJOR_VERSION . '.' . PHP_MINOR_VERSION]);
    }

    // 診断→フォームの進行を数える（visitId とイベント名だけ）
    if ($path === '/api/funnel' && $method === 'POST') {
        try { $input = json_decode(read_body(), true, 64, JSON_THROW_ON_ERROR); } catch (Throwable) { $input = null; }
        if (!is_array($input) || !is_string($input['visitId'] ?? null) || preg_match(UUID_RE, $input['visitId']) !== 1
            || !in_array($input['event'] ?? null, ['diagnosis_completed', 'diagnosis_to_form', 'direct_to_form'], true)) {
            json_out(400, ['error' => 'invalid event']);
        }
        $events = $input['event'] === 'diagnosis_to_form' ? ['diagnosis_completed', $input['event']] : [$input['event']];
        $pdo = db();
        $pdo->beginTransaction();
        foreach ($events as $event) { run('INSERT OR IGNORE INTO recruit_funnel(visit_id,event) VALUES(?,?)', [$input['visitId'], $event]); }
        $pdo->commit();
        json_out(200, ['ok' => true]);
    }

    // 見学・応募・相談の受付
    if ($path === '/api/requests' && $method === 'POST') {
        try { $input = json_decode(read_body(), true, 64, JSON_THROW_ON_ERROR); } catch (Throwable) { json_out(400, ['error' => 'invalid request']); }
        if (!is_array($input)) { json_out(400, ['error' => 'invalid request']); }
        $qv = as_int($input['questionVersion'] ?? null);
        $version = $qv === DIAGNOSIS_VERSION ? DIAGNOSIS_VERSION : (in_array($qv, [2, 3, 4], true) ? $qv : 1);
        $hasTrack = array_key_exists('track', $input);
        $trackIn = $input['track'] ?? null;
        $hasAnswers = array_key_exists('answers', $input);
        $answersIn = $input['answers'] ?? null;
        $trackOk = (is_string($trackIn) && array_key_exists($trackIn, TRACKS)) || ($hasTrack && $trackIn === null && $hasAnswers && $answersIn === null);
        $intent = $input['intent'] ?? null;
        $answersOk = true;
        if (!$hasAnswers) {
            $answersOk = false;
        } elseif ($answersIn !== null) {
            $expected = $version >= 3 ? QUESTION_COUNT : 12;
            $answersOk = is_array($answersIn) && array_is_list($answersIn) && count($answersIn) === $expected;
            if ($answersOk) {
                $clean = [];
                foreach ($answersIn as $value) {
                    $n = as_int($value);
                    if ($n === null || $n < 0 || $n >= 4) { $answersOk = false; break; }
                    $clean[] = $n;
                }
                if ($answersOk) { $answersIn = $clean; }
            }
        }
        if (!$trackOk || !in_array($intent, ['visit', 'apply', 'consult'], true) || ($input['consent'] ?? null) !== true || !$answersOk) {
            json_out(400, ['error' => 'invalid request']);
        }
        $hasApplication = array_key_exists('application', $input);
        $application = parse_application($hasApplication ? $input['application'] : null);
        if ($application === null && ($intent !== 'visit' || $answersIn === null || $hasApplication)) { json_out(400, ['error' => 'invalid application']); }
        if (!line_ready()) { json_out(503, ['error' => 'line unavailable']); }
        $sid = $input['submissionId'] ?? null;
        if ($sid === null || $sid === '' || $sid === 0 || $sid === 0.0 || $sid === false) { $sid = uuid4(); }
        if (!is_string($sid) || preg_match(UUID_RE, $sid) !== 1) { json_out(400, ['error' => 'invalid submission']); }
        $track = $trackIn ?? 'none';
        $answers = js_json($answersIn);
        $profile = $application !== null ? js_json($application) : null;
        $row = one('SELECT * FROM requests WHERE submission_id=?', [$sid]);
        for ($attempt = 0; $row === null && $attempt < 8; $attempt++) {
            $receipt = (string)(100000 + random_int(0, 899999));
            run('INSERT INTO requests(receipt,created,track,intent,answers,application,submission_id,question_version) VALUES(?,?,?,?,?,?,?,?) ON CONFLICT DO NOTHING',
                [$receipt, iso_now(), $track, $intent, $answers, $profile, $sid, $version]);
            $row = one('SELECT * FROM requests WHERE submission_id=?', [$sid]);
        }
        if ($row === null) { json_out(503, ['error' => 'receipt unavailable']); }
        $row = normalize_row($row);
        if ($row['question_version'] !== $version || $row['track'] !== $track || $row['intent'] !== $intent || $row['answers'] !== $answers || $row['application'] !== $profile) {
            json_out(409, ['error' => 'submission changed']);
        }
        if ($row['line_accepted']) { json_out(200, ['receipt' => $row['receipt']]); }
        if (now_ms() - (int)(strtotime($row['created']) * 1000) >= 23 * 60 * 60 * 1000) {
            json_out(502, ['receipt' => $row['receipt'], 'error' => 'line retry expired']);
        }
        try {
            $result = send_line($row, $application);
            if ($result['accepted']) {
                run('UPDATE requests SET line_accepted=1 WHERE submission_id=?', [$sid]);
                json_out(201, ['receipt' => $row['receipt']]);
            }
            json_out(502, ['receipt' => $row['receipt'], 'error' => 'line unconfirmed', 'lineStatus' => $result['status']]);
        } catch (Throwable $e) {
            error_log('Recruitment LINE push could not reach the API');
        }
        json_out(502, ['receipt' => $row['receipt'], 'error' => 'line unconfirmed']);
    }

    // ---------- 管理画面 ----------
    $password = (string)(conf()['admin_password'] ?? '');
    $passwordOk = mb_strlen($password) >= 16;
    $receiptFilter = static fn(mixed $v): string => is_string($v) && preg_match(RECEIPT_RE, $v) === 1 ? $v : '';
    $token = null;
    if (preg_match('/(?:^|; *)recruit_session=([0-9a-f]{64})(?:;|$)/', $_SERVER['HTTP_COOKIE'] ?? '', $m) === 1) { $token = $m[1]; }
    $now = now_ms();
    $signedIn = $passwordOk && $token !== null && one('SELECT token FROM sessions WHERE token=? AND expires>?', [hash('sha256', $token), $now]) !== null;
    $cookieBase = '; Path=/admin; HttpOnly; SameSite=Strict; Secure; Max-Age=';

    if ($method === 'POST' && $path === '/admin/login') {
        if (!$passwordOk) { page(503, '<p>管理画面の設定待ちです。</p>'); }
        $bucket = (string)($_SERVER['REMOTE_ADDR'] ?? '') !== '' ? (string)$_SERVER['REMOTE_ADDR'] : 'default';
        $pdo = db();
        $pdo->beginTransaction();
        run('INSERT INTO login_limits(bucket,until,attempts) VALUES(?,?,1) ON CONFLICT(bucket) DO UPDATE SET attempts=CASE WHEN until<=? THEN 1 ELSE attempts+1 END,until=CASE WHEN until<=? THEN excluded.until ELSE until END',
            [$bucket, $now + 600000, $now, $now]);
        $attempts = (int)one('SELECT attempts FROM login_limits WHERE bucket=?', [$bucket])['attempts'];
        $pdo->commit();
        if ($attempts > 8) { page(429, '<p>しばらく待ってからお試しください。</p>'); }
        $given = is_string($_POST['password'] ?? null) ? $_POST['password'] : '';
        $receipt = $receiptFilter($_POST['receipt'] ?? '');
        if (!hash_equals(hash('sha256', $password), hash('sha256', $given))) {
            page(401, '<p>パスワードを確認してください。</p><a href="' . htmlspecialchars(admin_url('', $receipt), ENT_QUOTES) . '">ログインへ</a>');
        }
        run('DELETE FROM login_limits WHERE until<=? OR bucket=?', [$now, $bucket]);
        run('DELETE FROM sessions WHERE expires<=? OR token=?', [$now, $token !== null ? hash('sha256', $token) : '']);
        $session = bin2hex(random_bytes(32));
        run('INSERT INTO sessions(token,expires) VALUES(?,?)', [hash('sha256', $session), $now + 28800000]);
        redirect($receipt !== '' ? admin_url('', $receipt) : '/admin', ['Set-Cookie' => 'recruit_session=' . $session . $cookieBase . '28800']);
    }
    if ($method === 'GET' && $path === '/admin' && !$signedIn) {
        $receipt = $receiptFilter($_GET['receipt'] ?? '');
        page(200, '<h1>採用担当ログイン</h1><main><form method="post" action="/admin/login"><input type="hidden" name="receipt" value="' . $receipt . '"><label>パスワード <input type="password" name="password" autocomplete="current-password" required></label> <button>ログイン</button></form></main>');
    }
    if (str_starts_with($path, '/admin/') && !$signedIn) { out(401, 'ログインしてください。'); }
    if ($method === 'POST' && $path === '/admin/logout') {
        run('DELETE FROM sessions WHERE token=?', [$token !== null ? hash('sha256', $token) : '']);
        redirect('/admin', ['Set-Cookie' => 'recruit_session=; Path=/admin; HttpOnly; SameSite=Strict; Max-Age=0; Secure']);
    }
    if ($method === 'POST' && $path === '/admin/status') {
        $status = $_POST['status'] ?? null;
        if (!in_array($status, ['pending', 'confirmed'], true)) { out(400, '無効な操作です。'); }
        $receipt = $receiptFilter($_POST['receipt'] ?? '');
        if ($receipt === '') { out(400, '無効な受付番号です。'); }
        run('UPDATE requests SET status=? WHERE receipt=?', [$status, $receipt]);
        redirect(admin_url('', $receipt));
    }
    if ($method === 'GET' && $path === '/admin') {
        $pageRaw = (string)($_GET['page'] ?? '');
        $pageRaw = $pageRaw === '' ? '1' : trim($pageRaw);
        if (!ctype_digit($pageRaw) || (int)$pageRaw < 1 || (int)$pageRaw > 100000) { out(400, '無効なページです。'); }
        $pageNumber = (int)$pageRaw;
        $query = strtoupper(js_trim((string)($_GET['receipt'] ?? '')));
        if ($query !== '') {
            $st = db()->prepare('SELECT * FROM requests WHERE receipt=?');
            $st->execute([$query]);
        } else {
            $st = db()->prepare('SELECT * FROM requests ORDER BY created DESC,receipt DESC LIMIT 100 OFFSET ?');
            $st->bindValue(1, ($pageNumber - 1) * 100, PDO::PARAM_INT);
            $st->execute();
        }
        $rows = array_map('normalize_row', $st->fetchAll());
        $totals = one("SELECT COUNT(CASE WHEN funnel.event='diagnosis_completed' THEN 1 END) AS completed,
  COUNT(CASE WHEN funnel.event='diagnosis_to_form' THEN 1 END) AS from_diagnosis,
  COUNT(CASE WHEN funnel.event='direct_to_form' THEN 1 END) AS direct,
  COUNT(CASE WHEN funnel.event='diagnosis_completed' AND NOT EXISTS (
    SELECT 1 FROM recruit_funnel AS opened WHERE opened.visit_id=funnel.visit_id
    AND opened.event IN ('diagnosis_to_form','direct_to_form')
  ) THEN 1 END) AS diagnosis_only FROM recruit_funnel AS funnel");
        $data = json_encode(['rows' => $rows, 'totals' => array_map('intval', $totals), 'query' => $query, 'pageNumber' => $pageNumber],
            JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_INVALID_UTF8_SUBSTITUTE);
        $js = (string)file_get_contents(__DIR__ . '/lib/admin.js');
        page(200, '<script id="admin-data" type="application/json">' . $data . '</script><script>' . $js . '</script>');
    }

    out(404, 'ページが見つかりません。');
} catch (Throwable $e) {
    error_log('match app error: ' . get_class($e) . ' ' . $e->getMessage());
    out(500, '処理できませんでした。');
}
