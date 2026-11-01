<?php
/**
 * 株式会社行雲流水 採用サイト お問い合わせフォーム送信処理（エックスサーバー用）
 *
 * - フォームからJSONでPOSTされた内容を、採用担当へメール通知します。
 * - 入力されたメールアドレス宛に、受付確認メールを自動送信します。
 * - 送信元（FROM）は、エックスサーバーで作成した info@ko-un-ryu-sui.com を使います。
 *   ※このメールアカウントが未作成だと、メールが届きません。
 */

declare(strict_types=1);

// ===== 設定（ここだけ変更すれば運用できます） =====================================
const SITE_DOMAIN    = 'ko-un-ryu-sui.com';
const MAIL_FROM      = 'info@ko-un-ryu-sui.com';          // 送信元（サーバーで作成済みのアドレス）
const MAIL_FROM_NAME = '株式会社行雲流水 採用';
// 通知を受け取るアドレス（複数可）
const MAIL_TO = [
    'info@ko-un-ryu-sui.com',
    'muu.fs.official@gmail.com',
];
// フォームを設置しているドメイン（他サイトからの送信を拒否します）
const ALLOWED_HOSTS = ['ko-un-ryu-sui.com', 'www.ko-un-ryu-sui.com'];
const PURPOSES = ['visit' => '見学・体験を希望', 'consult' => '働き方を相談', 'apply' => '求人に応募'];
const STATUSES = ['student' => '美容学生', 'newgrad' => '卒業予定・新卒', 'career' => '中途スタイリスト', 'return' => '復職を検討', 'other' => 'その他'];
const SALONS = ['' => '未選択', 'flowcloud' => 'FLOWCLOUD', 'glow' => 'glow', 'consult' => '相談したい'];
const JOB_IDS = ['', 'stylist', 'assistant', 'part', 'student', 'newgrad', 'career'];
const COOLDOWN_SECONDS = 60;       // 同じメールアドレスからの連続送信を制限
const IP_LIMIT_PER_HOUR = 10;      // 同じIPからの1時間あたり上限
// ====================================================================================

mb_language('Japanese');
mb_internal_encoding('UTF-8');
date_default_timezone_set('Asia/Tokyo');

function respond(int $status, array $body): never
{
    http_response_code($status);
    header('Content-Type: application/json; charset=UTF-8');
    header('Cache-Control: no-store');
    echo json_encode($body, JSON_UNESCAPED_UNICODE);
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST');
    respond(405, ['ok' => false, 'error' => 'method_not_allowed']);
}

// 他サイトからの送信を拒否
$origin = $_SERVER['HTTP_ORIGIN'] ?? ($_SERVER['HTTP_REFERER'] ?? '');
if ($origin !== '') {
    $host = parse_url($origin, PHP_URL_HOST);
    $allowed = ALLOWED_HOSTS;
    if (getenv('KR_ALLOW_HOST')) { $allowed[] = getenv('KR_ALLOW_HOST'); }   // 検証環境専用（本番では未設定）
    if (!is_string($host) || !in_array(strtolower($host), $allowed, true)) {
        respond(403, ['ok' => false, 'error' => 'forbidden']);
    }
}

$raw = file_get_contents('php://input', false, null, 0, 20000);
$data = json_decode($raw ?: '', true);
if (!is_array($data)) {
    respond(400, ['ok' => false, 'error' => 'bad_request']);
}

// ハニーポット（ボット対策）：入力があれば成功を装って終了
if (!empty($data['website'])) {
    respond(200, ['ok' => true, 'receipt' => $receipt, 'mailed' => $mailed, 'purpose' => $purpose]);
}

function clean_line(mixed $v, int $max): string
{
    $s = is_string($v) ? $v : '';
    $s = preg_replace('/[\r\n\t\0]+/u', ' ', $s) ?? '';
    return mb_substr(trim($s), 0, $max);
}
function clean_text(mixed $v, int $max): string
{
    $s = is_string($v) ? $v : '';
    $s = str_replace(["\r\n", "\r", "\0"], ["\n", "\n", ''], $s);
    return mb_substr(trim($s), 0, $max);
}

$name     = clean_line($data['name'] ?? '', 100);
$kana     = clean_line($data['kana'] ?? '', 100);
$email    = clean_line($data['email'] ?? '', 254);
$phone    = clean_line($data['phone'] ?? '', 40);
$purpose  = clean_line($data['purpose'] ?? '', 20);
$status   = clean_line($data['status'] ?? '', 20);
$method   = clean_line($data['contact_method'] ?? '', 10);
$salon    = clean_line($data['salon'] ?? '', 20);
$jobId    = clean_line($data['job_id'] ?? '', 20);
$school   = clean_line($data['school'] ?? '', 100);
$dates    = [clean_line($data['date1'] ?? '', 60), clean_line($data['date2'] ?? '', 60), clean_line($data['date3'] ?? '', 60)];
$conds    = clean_text($data['conditions'] ?? '', 500);
$message  = clean_text($data['message'] ?? '', 1000);
$consent  = ($data['consent'] ?? false) === true;

$errors = [];
if ($name === '') $errors[] = 'name';
if ($email === '' && $phone === '') $errors[] = 'contact';
if ($email !== '' && !filter_var($email, FILTER_VALIDATE_EMAIL)) $errors[] = 'email_format';
if (!isset(PURPOSES[$purpose])) $errors[] = 'purpose';
if (!isset(STATUSES[$status])) $errors[] = 'status';
if (!in_array($method, ['email', 'tel'], true) || ($method === 'email' && $email === '') || ($method === 'tel' && $phone === '')) $errors[] = 'contact_method';
if (!isset(SALONS[$salon])) $errors[] = 'salon';
if (!in_array($jobId, JOB_IDS, true)) $jobId = '';
if (!$consent) $errors[] = 'consent';
if ($errors) {
    respond(422, ['ok' => false, 'error' => 'invalid_input', 'fields' => $errors]);
}

// ===== 連続送信の制限 ==========================================================
$ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$rlDir = sys_get_temp_dir();
$now = time();

$emailFile = $rlDir . '/kounryusui_rl_e_' . hash('sha256', strtolower($email !== '' ? $email : $phone));
if (is_file($emailFile) && $now - (int) @filemtime($emailFile) < COOLDOWN_SECONDS) {
    respond(429, ['ok' => false, 'error' => 'too_many_requests']);
}

$ipFile = $rlDir . '/kounryusui_rl_i_' . hash('sha256', $ip);
$stamps = [];
if (is_file($ipFile)) {
    foreach (explode("\n", (string) @file_get_contents($ipFile)) as $t) {
        if ($t !== '' && $now - (int) $t < 3600) {
            $stamps[] = (int) $t;
        }
    }
}
if (count($stamps) >= IP_LIMIT_PER_HOUR) {
    respond(429, ['ok' => false, 'error' => 'too_many_requests']);
}

// ===== メール作成・送信 ==========================================================
function build_headers(string $replyTo = ''): string
{
    $from = mb_encode_mimeheader(MAIL_FROM_NAME, 'UTF-8', 'B') . ' <' . MAIL_FROM . '>';
    $h = "From: {$from}\r\n";
    if ($replyTo !== '') {
        $h .= "Reply-To: {$replyTo}\r\n";
    }
    $h .= "X-Mailer: kounryusui-recruit-form\r\n";
    return $h;
}

$received = date('Y年n月j日 H:i');
$receipt = 'KR-' . date('Ymd') . '-' . strtoupper(substr(bin2hex(random_bytes(3)), 0, 5));
$purposeLabel = PURPOSES[$purpose];
$salonLabel = SALONS[$salon];
$dateLines = [];
foreach ($dates as $i => $d) { if ($d !== '') $dateLines[] = '第' . ($i + 1) . '希望：' . $d; }
$dateText = $dateLines ? implode(' / ', $dateLines) : '未定・相談希望';

function deliver(string $to, string $subject, string $body, string $replyTo): bool
{
    $stub = getenv('KR_MAIL_STUB');   // 検証環境専用：メールを送らずファイルに保存（本番では未設定）
    if ($stub !== false && $stub !== '') {
        return (bool) file_put_contents($stub . '/' . date('His') . '_' . substr(md5($to . $subject), 0, 6) . '.txt', "TO: {$to}\nSUBJECT: {$subject}\n\n{$body}\n");
    }
    return mb_send_mail($to, $subject, $body, build_headers($replyTo), '-f' . MAIL_FROM);
}

$adminBody = implode("\n", [
    '株式会社行雲流水 採用サイトから申込みがありました。',
    '',
    "受付番号：{$receipt}",
    "受付日時：{$received}",
    "相談内容：{$purposeLabel}",
    "求人ID：" . ($jobId !== '' ? $jobId : '未選択'),
    "現在の状況：" . STATUSES[$status],
    "お名前：{$name}" . ($kana !== '' ? "（{$kana}）" : ''),
    'メールアドレス：' . ($email !== '' ? $email : '未入力'),
    '電話番号：' . ($phone !== '' ? $phone : '未入力'),
    '連絡希望方法：' . ($method === 'email' ? 'メール' : '電話'),
    "希望店舗：{$salonLabel}",
    "希望日時：{$dateText}（予約確定ではありません）",
    '学校/卒業予定：' . ($school !== '' ? $school : '未入力'),
    '希望勤務条件：' . ($conds !== '' ? $conds : '未入力'),
    '',
    '質問・伝えたいこと：',
    $message !== '' ? $message : '（なし）',
    '',
    '--',
    $email !== '' ? '※返信は申込者のメールアドレスに届きます。' : '※メール未入力です。電話で連絡してください。',
]);
$adminSubject = "【採用サイト】{$purposeLabel}｜{$receipt}｜{$name}様";

$sent = false;
foreach (MAIL_TO as $to) {
    if (deliver($to, $adminSubject, $adminBody, $email)) {
        $sent = true;
    } else {
        error_log("[contact.php] notify failed to {$to}");
    }
}
if (!$sent) {
    respond(500, ['ok' => false, 'error' => 'send_failed']);
}

// 受付メール（メール入力がある場合のみ。自由記述は転載しない。失敗しても受付は成功）
$mailed = false;
if ($email !== '') {
    $noConfirm = $purpose === 'visit' ? 'このメールの時点では、見学・体験の予約は確定していません。' : ($purpose === 'apply' ? 'このメールは受付のお知らせであり、選考結果や面接日程の確定をお知らせするものではありません。' : 'このメールは受付のお知らせです。');
    $replyBody = implode("\n", [
        "{$name} 様",
        '',
        "このたびは、行雲流水へお申し込みいただき、ありがとうございます。「{$purposeLabel}」を受け付けました。",
        '担当者より、ご入力いただいた連絡先へご連絡します。' . $noConfirm,
        '',
        "受付番号：{$receipt}",
        "受付内容：{$purposeLabel}／希望店舗：{$salonLabel}／希望日時：{$dateText}",
        '',
        '内容の訂正やお問い合わせは、info@ko-un-ryu-sui.com へ受付番号を添えてご連絡ください。',
        '※お心当たりのない場合は、本メールを削除してください。',
        '',
        '株式会社行雲流水 採用担当',
    ]);
    $mailed = deliver($email, '【行雲流水】お申し込みを受け付けました', $replyBody, MAIL_FROM);
    if (!$mailed) error_log('[contact.php] auto-reply failed');
}

// 制限用の記録
@touch($emailFile);
$stamps[] = $now;
@file_put_contents($ipFile, implode("\n", $stamps), LOCK_EX);

respond(200, ['ok' => true, 'receipt' => $receipt, 'mailed' => $mailed, 'purpose' => $purpose]);
