// 2026-11-24 の改善の試験（PHP 版だけ）：応募はお名前と職種だけで通る／LINE への近道 /api/line／画面の QR と送信後の LINE ボタン。
// 実行：NODE_PATH=$(npm root -g) node tests/new-features-test.mjs   （LINE は実物に送らず、手元の模擬サーバーで受ける）
import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path'; import http from 'node:http';
import { spawn } from 'node:child_process'; import { createRequire } from 'node:module'; import { fileURLToPath } from 'node:url';
const require = createRequire(import.meta.url);
const { chromium, devices } = require('playwright');
const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'match-new-'));
const sleep = ms => new Promise(r => setTimeout(r, ms));
let pass = 0, fail = 0; const ng = [];
const ok = (cond, label, extra = '') => { if (cond) { pass++; console.log('✓', label); } else { fail++; ng.push(label); console.log('✗', label, extra); } };

const lineBodies = [];
const lineServer = http.createServer((req, res) => { let b = ''; req.on('data', d => b += d); req.on('end', () => { lineBodies.push(b); res.writeHead(200, { 'content-type': 'application/json' }); res.end('{}'); }); });
await new Promise(r => lineServer.listen(0, '127.0.0.1', r));
const linePort = lineServer.address().port;
const port = 20000 + Math.floor(Math.random() * 20000);
const origin = `http://127.0.0.1:${port}`;
const q = s => "'" + s.replace(/\\/g, '\\\\').replace(/'/g, "\\'") + "'";
const cfg = path.join(tmp, 'config.php');
fs.writeFileSync(cfg, `<?php return [${q('origin')}=>${q(origin)}, ${q('admin_password')}=>${q('test-password-0123456789')}, ${q('line_token')}=>${q('TEST_TOKEN_NOT_REAL')}, ${q('line_target')}=>${q('U0123456789abcdef0123456789abcdef')}, ${q('line_endpoint')}=>${q(`http://127.0.0.1:${linePort}/push`)}];`);
const php = spawn('php', ['-S', `127.0.0.1:${port}`, '-t', path.join(root, 'site'), path.join(root, 'tests/router.php')], { env: { ...process.env, MATCH_CONFIG: cfg, MATCH_DATA_DIR: path.join(tmp, 'data') }, stdio: ['ignore', 'ignore', 'ignore'] });
for (let i = 0; i < 50; i++) { try { await fetch(origin + '/diagnosis.js'); break; } catch { await sleep(100); } }

const J = { 'content-type': 'application/json', Origin: origin };
const uuid = n => `${n.toString(16).padStart(8, '0')}-0000-4000-8000-000000000000`;
const post = async (n, application, extra = {}) => {
  const r = await fetch(origin + '/api/requests', { method: 'POST', headers: J, body: JSON.stringify({ track: null, answers: null, intent: 'visit', consent: true, submissionId: uuid(n), application, ...extra }) });
  return { status: r.status, json: await r.json().catch(() => null) };
};

console.log('== 応募はお名前と職種だけで通る ==');
{
  const a = await post(1, { jobs: ['美容師'], name: '試験 太郎', kana: '', school: '', grade: '', instagram: '', consultation: '' });
  ok(a.status === 201 && /^\d{6}$/.test(a.json?.receipt ?? ''), '空の任意欄でも受付できる', JSON.stringify(a));
  await sleep(20);
  const t = JSON.parse(lineBodies.at(-1)).messages[0].text;
  ok(t.includes('試験 太郎') && t.includes('未入力'), 'LINE の文面は空の欄を「未入力」と書く', t);
  const b = await post(2, { jobs: ['エステ', 'ネイリスト'], name: '試験 花子' });
  ok(b.status === 201, '任意欄のキー自体が無くても受付できる', JSON.stringify(b));
  ok((await post(3, { jobs: ['美容師'], name: '   ', kana: 'あ' })).status === 400, 'お名前が空は拒否');
  ok((await post(4, { jobs: ['美容師'], kana: 'あ' })).status === 400, 'お名前のキーが無いと拒否');
  ok((await post(5, { jobs: [], name: '試験' })).status === 400, '職種なしは拒否');
  ok((await post(6, { jobs: ['宇宙飛行士'], name: '試験' })).status === 400, '不正な職種は拒否');
  ok((await post(7, { jobs: ['美容師'], name: '試験', school: 'あ'.repeat(121) })).status === 400, '任意欄でも長すぎる値は拒否');
  ok((await post(8, { jobs: ['美容師'], name: '試験', grade: 5 })).status === 400, '任意欄が文字でない値は拒否');
  const c = await post(9, { jobs: ['美容師'], name: '試験', consultation: null });
  ok(c.status === 201, '任意欄が null でも受付できる', JSON.stringify(c));
}

console.log('== /api/line（LINE への近道） ==');
const BASE = 'https://line.me/R/oaMessage/%40512rmwnk/?';
const line = async s => { const r = await fetch(origin + '/api/line' + s, { redirect: 'manual' }); return { status: r.status, loc: r.headers.get('location') ?? '', cache: r.headers.get('cache-control') ?? '' }; };
const dec = l => decodeURIComponent(l.slice(BASE.length));
for (const [s, must] of [['?c=newgrad', ['①ご希望：美容学生・新卒']], ['?c=career', ['①ご希望：中途美容師']], ['?r=123456', ['受付番号 123456']]]) {
  const r = await line(s);
  ok(r.status === 302 && r.loc.startsWith(BASE) && must.every(m => dec(r.loc).includes(m)) && r.cache.includes('no-store'), `GET /api/line${s} → 302（${must[0]}）`, JSON.stringify(r));
}
for (const s of ['', '?c=bad', '?r=12345', '?r=1234567', '?r=12345a', '?r=123456%0A', '?c=newgrad%0A']) {
  const r = await line(s);
  ok(r.status === 302 && r.loc.startsWith(BASE) && dec(r.loc).includes('【採用のご相談】') && !dec(r.loc).includes('受付番号') && !/美容学生|中途美容師/.test(dec(r.loc)), `GET /api/line${s} → 汎用の文面`, JSON.stringify(r));
}
{ const r = await fetch(origin + '/api/line', { method: 'POST', headers: J, body: '{}', redirect: 'manual' }); ok(r.status !== 302 && r.status >= 400, 'POST /api/line は近道にならない', r.status); }
{ const r = await line('?c=' + encodeURIComponent('newgrad') + '&r=999999'); ok(dec(r.loc).includes('受付番号 999999'), '受付番号があれば受付番号の文面を優先'); }

console.log('== 画面（パソコン） ==');
const browser = await chromium.launch();
async function flow(contextOpts, label, { desktop }) {
  const ctx = await browser.newContext(contextOpts); const pg = await ctx.newPage();
  const errs = []; pg.on('pageerror', e => errs.push(String(e)));
  await pg.goto(origin + '/', { waitUntil: 'load' });
  await pg.locator('[data-entry="visit"]').first().click();
  // 空のまま送ると、お名前を求められる
  await pg.fill('#choose [name="name"]', '');
  await pg.locator('#start-quiz').click();
  ok(await pg.locator('#contact').isHidden(), `${label}: お名前が空なら先へ進まない`);
  await pg.fill('#choose [name="name"]', '試験 次郎');
  await pg.locator('#start-quiz').click();
  const statusText = (await pg.locator('#profile-status').textContent()) ?? '';
  ok(statusText.includes('職種') && await pg.locator('#contact').isHidden(), `${label}: 職種が無ければ先へ進まない`, statusText);
  await pg.check('#choose input[name="jobs"][value="美容師"]');
  await pg.locator('#start-quiz').click();
  ok(await pg.locator('#contact').isVisible(), `${label}: お名前＋職種だけで確認画面へ進める`);
  await pg.check('#consent');
  await pg.locator('#register').click();
  await pg.locator('#after-submit').waitFor({ state: 'visible', timeout: 8000 });
  const href = await pg.getAttribute('#after-line', 'href');
  const num = /受付番号\s(\d{6})/.exec(decodeURIComponent(href ?? ''))?.[1];
  ok(href?.startsWith(BASE) && !!num, `${label}: 送信後に「受付番号をLINEで送る」ボタンが出る`, href);
  await sleep(800);
  const qrVisible = await pg.locator('#after-qr').isVisible();
  const svg = await pg.locator('#after-qr-img svg').count();
  if (desktop) {
    ok(qrVisible && svg === 1, `${label}: 送信後に QR が出る`, `visible=${qrVisible} svg=${svg}`);
    const box = await pg.locator('#after-qr-img svg').boundingBox();
    ok(box && box.width >= 120 && box.width <= 200, `${label}: QR の大きさが適切`, JSON.stringify(box));
    await pg.screenshot({ path: path.join(tmp, 'after.png'), fullPage: false });
  } else {
    ok(!qrVisible, `${label}: スマホでは QR を出さない`, `visible=${qrVisible}`);
  }
  ok(errs.length === 0, `${label}: 画面のエラーなし`, errs.join(' | '));
  const sent = lineBodies.map(b => JSON.parse(b).messages[0].text).at(-1);
  ok(sent.includes('試験 次郎') && sent.includes('未入力'), `${label}: 実際に送られた LINE 文面に任意欄の「未入力」`, sent);
  await ctx.close();
}
await flow({ viewport: { width: 1280, height: 900 } }, 'PC', { desktop: true });
await flow({ ...devices['iPhone 13'] }, 'スマホ', { desktop: false });

console.log('== 診断の結果画面の QR（PC） ==');
{
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } }); const pg = await ctx.newPage();
  const errs = []; pg.on('pageerror', e => errs.push(String(e)));
  await pg.goto(origin + '/', { waitUntil: 'load' });
  await pg.locator('#start-quiz').click();
  for (let i = 0; i < 7; i++) { await pg.locator('#options input').first().check(); await pg.locator('#next').click(); }
  await pg.locator('#result-qr').waitFor({ state: 'visible', timeout: 8000 });
  await sleep(800);
  ok(await pg.locator('#result-qr-img svg').count() === 1, '結果画面に QR が出る（PC）');
  ok(errs.length === 0, '結果画面のエラーなし', errs.join(' | '));
  await pg.screenshot({ path: path.join(tmp, 'result.png') });
  // 結果の主ボタンが「サロン見学を申し込む」
  ok((await pg.locator('#result [data-intent="0"], [data-intent="0"]:visible').first().textContent())?.includes('サロン見学を申し込む'), '結果画面の主ボタンは「サロン見学を申し込む」');
  await ctx.close();
}
await browser.close();
for (const f of ['after.png', 'result.png']) { try { fs.copyFileSync(path.join(tmp, f), path.join(os.tmpdir(), 'match-new-' + f)); } catch {} }
console.log(`\n${pass} 件 OK ／ ${fail} 件 NG`); if (ng.length) console.log('NG:', ng.join(' / '));
php.kill(); lineServer.close(); fs.rmSync(tmp, { recursive: true, force: true });
process.exit(fail ? 1 : 0);
