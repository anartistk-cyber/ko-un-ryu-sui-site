<?php
// 採用マッチング診断の設定（見本）。
// これを config.php という名前にして、サーバーの「match.ko-un-ryu-sui.com/」フォルダ直下（public_html の1つ上）に置く。
// config.php には秘密が入るので、リポジトリ・チャット・メールには絶対に載せない。
return [
    // 公開アドレス（受付の確認に使う）
    'origin' => 'https://match.ko-un-ryu-sui.com',
    // 管理画面のパスワード（16文字以上。短いと管理画面と受付が動かない）
    'admin_password' => '',
    // LINE Messaging API のチャネルアクセストークン（採用担当への通知用。行雲流水（採用）公式LINEのもの）
    'line_token' => '',
    // 通知の送り先（LINE の U または C から始まる33文字のID）
    'line_target' => '',
];
