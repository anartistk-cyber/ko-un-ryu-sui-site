// 互換試験：ChatGPT Sites 版（archive/chatgpt-sites-worker-*.js）と PHP 版（site/app.php）に、同じリクエストを同じ順番で送って結果を比べる。
// LINE は実物に送らず、手元の模擬サーバーで受ける。DB は一時フォルダ。
// 実行：NODE_PATH=$(npm root -g) node --experimental-sqlite tests/compat-test.mjs
import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path'; import http from 'node:http';
import { spawn } from 'node:child_process'; import { DatabaseSync } from 'node:sqlite'; import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(here, '..');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'match-compat-'));
const sleep = ms => new Promise(r => setTimeout(r, ms));

// ---------- 模擬 LINE ----------
const lineLog = { worker: [], php: [] }; let lineMode = 'ok'; let lineSide = 'worker';
const lineServer = http.createServer((req, res) => {
  let b = ''; req.on('data', d => b += d); req.on('end', () => {
    const side = req.url.startsWith('/php/') ? 'php' : 'worker';
    lineLog[side].push({ auth: req.headers.authorization, retry: req.headers['x-line-retry-key'], body: b });
    if (lineMode === 'ok') { res.writeHead(200, { 'content-type': 'application/json' }); res.end('{}'); }
    else if (lineMode === '500') { res.writeHead(500); res.end('{}'); }
    else if (lineMode === '409a') { res.writeHead(409, { 'x-line-accepted-request-id': 'abc' }); res.end('{}'); }
    else if (lineMode === '409') { res.writeHead(409); res.end('{}'); }
  });
});
await new Promise(r => lineServer.listen(0, '127.0.0.1', r));
const linePort = lineServer.address().port;

// ---------- 元の Worker を動かす（D1 は node:sqlite で代用） ----------
const schema = fs.readFileSync(path.join(root, 'archive/0000_recruit.sql'), 'utf8').replace(/--> statement-breakpoint/g, '') + fs.readFileSync(path.join(root, 'archive/0001_recruit_funnel.sql'), 'utf8');
const wdb = new DatabaseSync(path.join(tmp, 'worker.sqlite')); wdb.exec(schema);
const wrap = (sql, args = []) => ({
  bind: (...a) => wrap(sql, a),
  first: async () => wdb.prepare(sql).get(...args) ?? null,
  all: async () => ({ results: wdb.prepare(sql).all(...args) }),
  run: async () => { const r = wdb.prepare(sql).run(...args); return { meta: { changes: r.changes } }; },
});
const D1 = { prepare: sql => wrap(sql), batch: async list => { wdb.exec('BEGIN'); try { for (const s of list) await s.run(); wdb.exec('COMMIT'); } catch (e) { wdb.exec('ROLLBACK'); throw e; } } };
fs.copyFileSync(path.join(root, 'archive/chatgpt-sites-worker-20261122-1909.js'), path.join(tmp, 'worker.mjs'));
const worker = (await import(path.join(tmp, 'worker.mjs'))).default;
const PASSWORD = 'test-password-0123456789';
const TOKEN = 'TEST_TOKEN_NOT_REAL'; const TARGET = 'U' + '0123456789abcdef0123456789abcdef';
const wenv = { DB: D1, RECRUIT_ADMIN_PASSWORD: PASSWORD, RECRUIT_LINE_ACCESS_TOKEN: TOKEN, RECRUIT_LINE_TARGET_ID: TARGET };
const realFetch = globalThis.fetch;
globalThis.fetch = (u, init) => String(u).startsWith('https://api.line.me/') ? realFetch(`http://127.0.0.1:${linePort}/worker/push`, init) : realFetch(u, init);

// ---------- PHP 版を動かす ----------
const phpPort = 20000 + Math.floor(Math.random() * 20000);
const origin = `http://127.0.0.1:${phpPort}`;
const phpConfig = path.join(tmp, 'config.php');
const writeConfig = (over = {}) => fs.writeFileSync(phpConfig, '<?php return ' + JSON.stringify0({ origin, admin_password: PASSWORD, line_token: TOKEN, line_target: TARGET, line_endpoint: `http://127.0.0.1:${linePort}/php/push`, ...over }) + ';');
function toPhp(v) { if (v === null) return 'null'; if (typeof v === 'string') return "'" + v.replace(/\\/g, '\\\\').replace(/'/g, "\\'") + "'"; if (typeof v === 'object') return '[' + Object.entries(v).map(([k, x]) => toPhp(k) + '=>' + toPhp(x)).join(',') + ']'; return String(v); }
JSON.stringify0 = toPhp;
writeConfig();
const php = spawn('php', ['-S', `127.0.0.1:${phpPort}`, '-t', path.join(root, 'site'), path.join(root, 'tests/router.php')], { env: { ...process.env, MATCH_CONFIG: phpConfig, MATCH_DATA_DIR: path.join(tmp, 'phpdata') }, stdio: ['ignore', 'ignore', 'pipe'] });
let phpErr = ''; php.stderr.on('data', d => phpErr += d);
for (let i = 0; i < 50; i++) { try { await realFetch(origin + '/diagnosis.js'); break; } catch { await sleep(100); } }

// ---------- 送信と正規化 ----------
const receipts = { worker: new Map(), php: new Map() };
function norm(side, text) {
  return String(text)
    .replace(/\b\d{6}\b/g, m => { const mp = receipts[side]; if (!mp.has(m)) mp.set(m, 'RCPT' + (mp.size + 1)); return mp.get(m); })
    .replace(/\d{4}\/\d{1,2}\/\d{1,2} \d{1,2}:\d{2}/g, 'DATETIME')
    .replace(/recruit_session=[0-9a-f]{64}/g, 'recruit_session=TOKEN')
    .replace(new RegExp(origin.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), 'ORIGIN')
    .replace(/http:\/\/localhost/g, 'ORIGIN');
}
async function call(side, method, p, { headers = {}, body, origin: org = 'same' } = {}) {
  const h = { ...headers };
  if (method === 'POST' && org === 'same') h.Origin = origin;
  else if (org !== 'same' && org !== 'none') h.Origin = org;
  const url = origin + p;
  let res;
  if (side === 'worker') {
    res = await worker.fetch(new Request(url, { method, headers: h, body }), wenv);
  } else {
    res = await realFetch(url, { method, headers: h, body, redirect: 'manual' });
  }
  const text = await res.text();
  return { status: res.status, type: res.headers.get('content-type'), loc: res.headers.get('location'), cookie: res.headers.get('set-cookie'), text };
}
let fail = 0, passed = 0;
const failures = [];
async function both(label, method, p, opts = {}, { compareBody = true, compareType = true, hook, fixWorker } = {}) {
  lineLog.worker.length = 0; lineLog.php.length = 0;
  const w = await call('worker', method, p, opts);
  if (fixWorker) w.text = fixWorker(w.text);
  const x = await call('php', method, p, opts);
  await sleep(6);
  const diffs = [];
  if (w.status !== x.status) diffs.push(`status ${w.status} vs ${x.status}`);
  if (compareType && (w.type || '').split(';')[0].replace('text/javascript', 'text/javascript') !== (x.type || '').split(';')[0] && !(w.type||'').startsWith('text/javascript')) diffs.push(`type ${w.type} vs ${x.type}`);
  if (w.loc !== null || x.loc !== null) { if (norm('worker', w.loc ?? '') !== norm('php', x.loc ?? '')) diffs.push(`location ${w.loc} vs ${x.loc}`); }
  if (w.cookie || x.cookie) {
    const nc = (s, side) => norm(side, (s || '').replace(/recruit_session=[0-9a-f]{64}/, 'recruit_session=TOKEN').replace(/;\s*/g, '; ').split('; ').sort().join('; '));
    if (nc(w.cookie, 'worker') !== nc(x.cookie, 'php')) diffs.push(`cookie ${w.cookie} vs ${x.cookie}`);
  }
  if (compareBody) {
    let a = norm('worker', w.text), b = norm('php', x.text);
    if (a !== b) diffs.push(`body\n   worker: ${a.slice(0, 300)}\n   php:    ${b.slice(0, 300)}`);
  }
  const maskRetry = r => /^[0-9a-f]{8}-0000-4000-8000-000000000000$/.test(r) ? r : 'SERVER-GENERATED-UUID';
  const lw = lineLog.worker.map(l => ({ ...l, retry: maskRetry(l.retry), body: norm('worker', l.body) })), lp = lineLog.php.map(l => ({ ...l, retry: maskRetry(l.retry), body: norm('php', l.body) }));
  if (JSON.stringify(lw) !== JSON.stringify(lp)) diffs.push(`LINE\n   worker: ${JSON.stringify(lw).slice(0, 500)}\n   php:    ${JSON.stringify(lp).slice(0, 500)}`);
  if (hook) await hook(w, x);
  if (diffs.length) { fail++; failures.push(label); console.log('✗', label, '\n  ', diffs.join('\n  ')); } else { passed++; console.log('✓', label, `(${w.status})`); }
  return { w, x, lineW: lw.length, lineP: lp.length };
}

const J = { 'content-type': 'application/json' };
const uuid = n => `${n.toString(16).padStart(8, '0')}-0000-4000-8000-000000000000`;
const app = (o = {}) => ({ jobs: ['美容師'], name: '試験 太郎', kana: 'しけん たろう', school: '試験美容専門学校', grade: '2年', instagram: '', consultation: '見学したいです。', ...o });
const reqBody = (o = {}) => JSON.stringify({ track: 'newgrad', answers: [0, 1, 2, 3, 0, 1, 2], intent: 'visit', consent: true, questionVersion: 5, submissionId: uuid(1), ...o });

// ---------- 試験 ----------
console.log('== 静的ページ ==');
for (const p of ['/', '/index.html', '/diagnosis.js', '/privacy', '/privacy/']) {
  // /privacy だけは、置き場所の変更に合わせて文面の1か所（「ChatGPT Sites」→「エックスサーバー（日本国内のレンタルサーバー）」）を意図して直してある。それ以外は同一であること。
  const fixWorker = p.startsWith('/privacy') ? t => t.replace('ChatGPT Sitesを', 'エックスサーバー（日本国内のレンタルサーバー）を') : undefined;
  const r = await both(`GET ${p}`, 'GET', p, {}, { compareType: false, fixWorker });
}
console.log('== funnel ==');
await both('funnel: 診断完了', 'POST', '/api/funnel', { headers: J, body: JSON.stringify({ visitId: '12345678-1234-4234-8234-123456789abc', event: 'diagnosis_completed' }) });
await both('funnel: 診断→フォーム（2件記録）', 'POST', '/api/funnel', { headers: J, body: JSON.stringify({ visitId: '22345678-1234-4234-8234-123456789abc', event: 'diagnosis_to_form' }) });
await both('funnel: 直接フォーム', 'POST', '/api/funnel', { headers: J, body: JSON.stringify({ visitId: '32345678-1234-4234-8234-123456789abc', event: 'direct_to_form' }) });
await both('funnel: 診断完了（重複は無視）', 'POST', '/api/funnel', { headers: J, body: JSON.stringify({ visitId: '12345678-1234-4234-8234-123456789abc', event: 'diagnosis_completed' }) });
await both('funnel: 診断完了のみ（フォームへ進まず）', 'POST', '/api/funnel', { headers: J, body: JSON.stringify({ visitId: '42345678-1234-4234-8234-123456789abc', event: 'diagnosis_completed' }) });
await both('funnel: 不正なイベント', 'POST', '/api/funnel', { headers: J, body: JSON.stringify({ visitId: '12345678-1234-4234-8234-123456789abc', event: 'x' }) });
await both('funnel: 不正なID', 'POST', '/api/funnel', { headers: J, body: JSON.stringify({ visitId: 'abc', event: 'direct_to_form' }) });
await both('funnel: 末尾に改行つきID', 'POST', '/api/funnel', { headers: J, body: JSON.stringify({ visitId: '12345678-1234-4234-8234-123456789abc\n', event: 'direct_to_form' }) });
await both('funnel: JSONでない', 'POST', '/api/funnel', { headers: J, body: 'oops' });
await both('funnel: Origin なし', 'POST', '/api/funnel', { headers: J, origin: 'none', body: '{}' });
await both('funnel: 別の Origin', 'POST', '/api/funnel', { headers: J, origin: 'https://evil.example', body: '{}' });
await both('GET /api/funnel', 'GET', '/api/funnel');
await both('存在しないパス', 'GET', '/nothing', {}, { compareType: false });

console.log('== 受付 ==');
await both('診断つき見学（版5・応募者情報なし）', 'POST', '/api/requests', { headers: J, body: reqBody() });
await sleep(5);
await both('同じ submissionId をもう一度', 'POST', '/api/requests', { headers: J, body: reqBody() });
await both('同じ submissionId で答えを変える', 'POST', '/api/requests', { headers: J, body: reqBody({ answers: [3, 3, 3, 3, 3, 3, 3] }) });
await both('診断つき見学＋応募者情報（career）', 'POST', '/api/requests', { headers: J, body: reqBody({ submissionId: uuid(2), track: 'career', answers: [0, 0, 0, 0, 0, 0, 0], application: app({ jobs: ['美容師', 'アイリスト', '美容師'], instagram: 'test_id' }) }) });
await sleep(5);
await both('診断なし相談（track/answers が null）', 'POST', '/api/requests', { headers: J, body: reqBody({ submissionId: uuid(3), track: null, answers: null, intent: 'consult', application: app({ consultation: 'ご相談です。\n2行目' }) }) });
await sleep(5);
await both('診断なし応募（応募者情報が絵文字・全角スペース入り）', 'POST', '/api/requests', { headers: J, body: reqBody({ submissionId: uuid(4), track: null, answers: null, intent: 'apply', application: app({ name: '　太郎😀　', kana: 'たろう', jobs: ['その他'] }) }) });
await sleep(5);
await both('旧版1（12問・questionVersion なし）', 'POST', '/api/requests', { headers: J, body: JSON.stringify({ track: 'newgrad', answers: [0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3], intent: 'visit', consent: true, submissionId: uuid(5) }) });
await sleep(5);
await both('旧版2（12問）', 'POST', '/api/requests', { headers: J, body: JSON.stringify({ track: 'career', answers: [3, 3, 3, 3, 3, 3, 0, 0, 0, 1, 1, 1], intent: 'visit', consent: true, questionVersion: 2, submissionId: uuid(6) }) });
await sleep(5);
await both('旧版3（7問）', 'POST', '/api/requests', { headers: J, body: JSON.stringify({ track: 'newgrad', answers: [0, 0, 1, 1, 2, 2, 3], intent: 'visit', consent: true, questionVersion: 3, submissionId: uuid(7) }) });
await sleep(5);
await both('旧版4（7問・重み付き）', 'POST', '/api/requests', { headers: J, body: JSON.stringify({ track: 'career', answers: [0, 1, 0, 1, 0, 1, 0], intent: 'visit', consent: true, questionVersion: 4, submissionId: uuid(8) }) });
await sleep(5);
await both('submissionId なし（サーバーが作る）', 'POST', '/api/requests', { headers: J, body: JSON.stringify({ track: 'newgrad', answers: [1, 1, 1, 1, 1, 1, 1], intent: 'visit', consent: true, questionVersion: 5 }) });
await sleep(5);
await both('整数に見える 1.0 の答え', 'POST', '/api/requests', { headers: J, body: '{"track":"newgrad","answers":[1.0,0,0,0,0,0,0],"intent":"visit","consent":true,"questionVersion":5,"submissionId":"' + uuid(9) + '"}' });
await sleep(5);
console.log('== 受付：拒否されるもの ==');
const bad = (label, o) => both('拒否: ' + label, 'POST', '/api/requests', { headers: J, body: reqBody({ submissionId: uuid(100), ...o }) });
await bad('同意なし', { consent: false });
await bad('同意が文字列', { consent: 'true' });
await bad('答えが6個', { answers: [0, 1, 2, 3, 0, 1] });
await bad('答えが範囲外', { answers: [0, 1, 2, 3, 0, 1, 4] });
await bad('答えが小数', { answers: [0, 1, 2, 3, 0, 1, 1.5] });
await bad('答えが文字', { answers: [0, 1, 2, 3, 0, 1, '1'] });
await bad('トラック不正', { track: 'other' });
await bad('トラックだけ null', { track: null });
await bad('answers だけ null（track あり）', { answers: null });
await bad('意図が不正', { intent: 'buy' });
await bad('応募者情報に職種なし', { application: app({ jobs: [] }) });
await bad('応募者情報の職種が不正', { application: app({ jobs: ['宇宙飛行士'] }) });
await bad('応募者情報の名前が空', { application: app({ name: '   ' }) });
await bad('応募者情報の名前が全角スペースだけ', { application: app({ name: '　　' }) });
await bad('名前が81文字', { application: app({ name: 'あ'.repeat(81) }) });
await bad('名前が絵文字41個（UTF-16で82）', { application: app({ name: '😀'.repeat(41) }) });
await both('名前が絵文字40個（UTF-16で80）は通る', 'POST', '/api/requests', { headers: J, body: reqBody({ submissionId: uuid(101), application: app({ name: '😀'.repeat(40) }) }) });
await sleep(5);
await bad('相談内容が1001文字', { application: app({ consultation: 'あ'.repeat(1001) }) });
await both('相談内容が1000文字は通る', 'POST', '/api/requests', { headers: J, body: reqBody({ submissionId: uuid(102), application: app({ consultation: 'あ'.repeat(1000) }) }) });
await sleep(5);
await bad('応募者情報が null', { application: null });
await bad('応募者情報の名前が数値', { application: app({ name: 5 }) });
await bad('submissionId が文字列だが不正', { submissionId: 'not-a-uuid' });
await bad('submissionId が末尾改行', { submissionId: uuid(103) + '\n' });
await bad('submissionId が数値', { submissionId: 5 });
await both('拒否: 診断なしで見学（応募者情報なし）', 'POST', '/api/requests', { headers: J, body: reqBody({ submissionId: uuid(104), track: null, answers: null, intent: 'visit' }) });
await both('拒否: JSONでない', 'POST', '/api/requests', { headers: J, body: '{bad' });
await both('拒否: 配列', 'POST', '/api/requests', { headers: J, body: '[1,2]' });
await both('拒否: 大きすぎる', 'POST', '/api/requests', { headers: J, body: JSON.stringify({ x: 'a'.repeat(17000) }) });
await both('拒否: Origin なし', 'POST', '/api/requests', { headers: J, origin: 'none', body: reqBody({ submissionId: uuid(105) }) });
await both('拒否: 別の Origin', 'POST', '/api/requests', { headers: J, origin: 'https://evil.example', body: reqBody({ submissionId: uuid(105) }) });

console.log('== LINE の失敗と再送 ==');
lineMode = '500';
await both('LINE が 500 → 502', 'POST', '/api/requests', { headers: J, body: reqBody({ submissionId: uuid(200) }) });
await sleep(5);
lineMode = 'ok';
await both('同じ受付を再送 → 201（LINE 送信できた）', 'POST', '/api/requests', { headers: J, body: reqBody({ submissionId: uuid(200) }) });
lineMode = '409a';
await both('LINE が 409＋受付済み → 201', 'POST', '/api/requests', { headers: J, body: reqBody({ submissionId: uuid(201) }) });
await sleep(5);
lineMode = '409';
await both('LINE が 409（受付済みの印なし）→ 502', 'POST', '/api/requests', { headers: J, body: reqBody({ submissionId: uuid(202) }) });
await sleep(5);
lineMode = 'ok';
// LINE に届かない（接続できない）
{
  const saveW = realFetch; const closed = http.createServer(); await new Promise(r => closed.listen(0, '127.0.0.1', r)); const deadPort = closed.address().port; await new Promise(r => closed.close(r));
  globalThis.fetch = (u, init) => String(u).startsWith('https://api.line.me/') ? realFetch(`http://127.0.0.1:${deadPort}/x`, init) : realFetch(u, init);
  writeConfig({ line_endpoint: `http://127.0.0.1:${deadPort}/x` });
  await both('LINE に届かない → 502', 'POST', '/api/requests', { headers: J, body: reqBody({ submissionId: uuid(203) }) });
  await sleep(5);
  globalThis.fetch = (u, init) => String(u).startsWith('https://api.line.me/') ? realFetch(`http://127.0.0.1:${linePort}/worker/push`, init) : realFetch(u, init);
  writeConfig();
}
// LINE の設定がないとき
{
  const saved = { ...wenv }; delete wenv.RECRUIT_LINE_ACCESS_TOKEN; writeConfig({ line_token: '' });
  await both('LINE の鍵がない → 503', 'POST', '/api/requests', { headers: J, body: reqBody({ submissionId: uuid(204) }) });
  Object.assign(wenv, saved); writeConfig();
  wenv.RECRUIT_LINE_TARGET_ID = 'bad'; writeConfig({ line_target: 'bad' });
  await both('LINE の送り先が不正 → 503', 'POST', '/api/requests', { headers: J, body: reqBody({ submissionId: uuid(205) }) });
  wenv.RECRUIT_LINE_TARGET_ID = TARGET; writeConfig();
}

console.log('== 管理画面 ==');
await both('未ログインで /admin', 'GET', '/admin');
await both('未ログインで /admin?receipt=123456', 'GET', '/admin?receipt=123456');
await both('未ログインで /admin/x', 'GET', '/admin/x', {}, { compareType: false });
await both('未ログインで POST /admin/status', 'POST', '/admin/status', { headers: { 'content-type': 'application/x-www-form-urlencoded' }, body: 'receipt=123456&status=confirmed' }, { compareType: false });
const form = o => new URLSearchParams(o).toString();
const F = { 'content-type': 'application/x-www-form-urlencoded' };
await both('パスワード違い → 401', 'POST', '/admin/login', { headers: F, body: form({ password: 'wrong', receipt: '123456' }) });
let cookieW, cookieP;
await both('ログイン成功 → 303', 'POST', '/admin/login', { headers: F, body: form({ password: PASSWORD }) }, { hook: (w, x) => { cookieW = /recruit_session=[0-9a-f]{64}/.exec(w.cookie)[0]; cookieP = /recruit_session=[0-9a-f]{64}/.exec(x.cookie)[0]; } });
const sideCall = async (label, method, p, opts = {}) => {
  const w = await call('worker', method, p, { ...opts, headers: { ...(opts.headers || {}), Cookie: cookieW } });
  const x = await call('php', method, p, { ...opts, headers: { ...(opts.headers || {}), Cookie: cookieP } });
  return { w, x };
};
// 一覧は表示内容（文字）で比べる：Worker は文字列で作り、PHP 版はブラウザ側で作るため
const browser = await chromium.launch();
async function view(side, html) {
  const pg = await browser.newPage(); await pg.route('**/*', r => r.abort());
  await pg.setContent(html, { waitUntil: 'load' });
  const r = await pg.evaluate(() => { document.body.querySelectorAll('*').forEach(e => e.append(' ')); return ({
    text: document.body.textContent.replace(/\s+/g, ' ').trim(),
    articles: document.querySelectorAll('article').length, details: document.querySelectorAll('details').length,
    forms: [...document.querySelectorAll('form')].map(f => f.method + ' ' + f.getAttribute('action')).join(','),
    hidden: [...document.querySelectorAll('input[type=hidden]')].map(i => i.name + '=' + i.value).join(','),
    buttons: [...document.querySelectorAll('button')].map(b => b.textContent).join('|'),
    links: [...document.querySelectorAll('a')].map(a => a.getAttribute('href')).join('|'),
    html: document.body.innerHTML.replace(/\s+/g, ' '),
  }); });
  await pg.close(); return r;
}
async function compareView(label, p) {
  const { w, x } = await sideCall(label, 'GET', p);
  const vw = await view('worker', w.text), vx = await view('php', x.text);
  const diffs = [];
  if (w.status !== x.status) diffs.push(`status ${w.status} vs ${x.status}`);
  for (const k of ['text', 'articles', 'details', 'forms', 'hidden', 'buttons', 'links', 'html']) {
    const a = norm('worker', vw[k]), b = norm('php', vx[k]);
    if (a !== b) { let i = 0; while (a[i] === b[i]) i++; diffs.push(`${k} differs at ${i}\n   worker: …${a.slice(Math.max(0, i - 80), i + 120)}\n   php:    …${b.slice(Math.max(0, i - 80), i + 120)}`); }
  }
  if (diffs.length) { fail++; failures.push(label); console.log('✗', label, '\n  ', diffs.join('\n  ')); } else { passed++; console.log('✓', label, `(articles=${vw.articles}, ${vw.text.length}文字)`); }
  return vw;
}
const vAll = await compareView('一覧（全件）', '/admin');
// 受付番号で検索
const firstReceipt = [...receipts.worker.keys()][0], firstReceiptPhp = [...receipts.php.keys()][0];
{
  const w = await call('worker', 'GET', '/admin?receipt=' + firstReceipt, { headers: { Cookie: cookieW } });
  const x = await call('php', 'GET', '/admin?receipt=' + firstReceiptPhp, { headers: { Cookie: cookieP } });
  const a = norm('worker', (await view('worker', w.text)).text), b = norm('php', (await view('php', x.text)).text);
  if (a === b) { passed++; console.log('✓ 受付番号で検索'); } else { fail++; failures.push('受付番号で検索'); console.log('✗ 受付番号で検索\n', a.slice(0, 300), '\n', b.slice(0, 300)); }
}
{
  const { w, x } = await sideCall('', 'GET', '/admin?receipt=999999');
  const a = norm('worker', (await view('worker', w.text)).text), b = norm('php', (await view('php', x.text)).text);
  if (a === b && a.includes('該当する受付はありません')) { passed++; console.log('✓ 該当なしの検索'); } else { fail++; failures.push('該当なし'); console.log('✗ 該当なしの検索', a, b); }
}
for (const [label, p] of [['page=abc', '/admin?page=abc'], ['page=0', '/admin?page=0'], ['page=100001', '/admin?page=100001']]) {
  const { w, x } = await sideCall(label, 'GET', p);
  if (w.status === x.status && w.text === x.text) { passed++; console.log('✓ ' + label, `(${w.status})`); } else { fail++; failures.push(label); console.log('✗', label, w.status, x.status, w.text, x.text); }
}
{ const { w, x } = await sideCall('', 'GET', '/admin?page=2'); const a = norm('worker', (await view('worker', w.text)).text), b = norm('php', (await view('php', x.text)).text); if (w.status === x.status && a === b) { passed++; console.log('✓ page=2'); } else { fail++; failures.push('page=2'); console.log('✗ page=2'); } }
// 状態の変更
{
  const wr = [...receipts.worker.keys()][1], pr = [...receipts.php.keys()][1];
  const w = await call('worker', 'POST', '/admin/status', { headers: { ...F, Cookie: cookieW }, body: form({ receipt: wr, status: 'confirmed' }) });
  const x = await call('php', 'POST', '/admin/status', { headers: { ...F, Cookie: cookieP }, body: form({ receipt: pr, status: 'confirmed' }) });
  const ok = w.status === x.status && norm('worker', w.loc) === norm('php', x.loc);
  if (ok) { passed++; console.log('✓ 状態を「LINE確認済み」にする', `(${w.status} ${norm('php', x.loc)})`); } else { fail++; failures.push('status'); console.log('✗ 状態変更', w.status, x.status, w.loc, x.loc); }
  for (const [label, body] of [['状態が不正', form({ receipt: wr, status: 'zzz' })], ['受付番号が不正', form({ receipt: 'abc', status: 'pending' })]]) {
    const a = await call('worker', 'POST', '/admin/status', { headers: { ...F, Cookie: cookieW }, body }); const b = await call('php', 'POST', '/admin/status', { headers: { ...F, Cookie: cookieP }, body });
    if (a.status === b.status && a.text === b.text) { passed++; console.log('✓ ' + label, `(${a.status})`); } else { fail++; failures.push(label); console.log('✗', label, a.status, b.status, a.text, b.text); }
  }
}
await compareView('一覧（状態変更のあと）', '/admin');
// ログアウト
{
  const { w, x } = await sideCall('', 'POST', '/admin/logout', { headers: F, body: '' });
  const nc = s => s.replace(/;\s*/g, '; ').split('; ').sort().join('; ');
  if (w.status === x.status && nc(w.cookie) === nc(x.cookie) && w.loc === x.loc) { passed++; console.log('✓ ログアウト', `(${w.status})`); } else { fail++; failures.push('logout'); console.log('✗ ログアウト', w.status, x.status, w.cookie, x.cookie); }
  const a = await call('worker', 'GET', '/admin', { headers: { Cookie: cookieW } }), b = await call('php', 'GET', '/admin', { headers: { Cookie: cookieP } });
  if (a.text.includes('採用担当ログイン') && b.text.includes('採用担当ログイン')) { passed++; console.log('✓ ログアウト後は未ログインに戻る'); } else { fail++; failures.push('after logout'); console.log('✗ ログアウト後'); }
}
// ログイン試行の上限（8回まで、9回目で 429）
for (let i = 1; i <= 9; i++) {
  const hdr = { ...F, 'CF-Connecting-IP': '9.9.9.9' };
  const w = await call('worker', 'POST', '/admin/login', { headers: hdr, body: form({ password: 'wrong' + i }) });
  // PHP 版は接続元IPで数える（試験では 127.0.0.1。ここまでの失敗1回＋成功1回の記録は成功時に消えている）
  const x = await call('php', 'POST', '/admin/login', { headers: F, body: form({ password: 'wrong' + i }) });
  const exp = i <= 8 ? 401 : 429;
  if (w.status === exp && x.status === exp) { if (i === 1 || i === 8 || i === 9) { passed++; console.log(`✓ ログイン失敗 ${i} 回目 → ${exp}`); } } else { fail++; failures.push('limit' + i); console.log(`✗ ログイン失敗 ${i} 回目`, w.status, x.status); }
}
{
  // 上限に達した状態で正しいパスワードでも 429（元の仕様どおり）
  const w = await call('worker', 'POST', '/admin/login', { headers: { ...F, 'CF-Connecting-IP': '9.9.9.9' }, body: form({ password: PASSWORD }) });
  const x = await call('php', 'POST', '/admin/login', { headers: F, body: form({ password: PASSWORD }) });
  if (w.status === 429 && x.status === 429) { passed++; console.log('✓ 上限後は正しいパスワードでも 429'); } else { fail++; failures.push('limit-ok'); console.log('✗ 上限後', w.status, x.status); }
}
await browser.close();

// ---------- 公開物が最新か（admin.js は diagnosis.js から自動で作る） ----------
console.log('== 公開物 ==');
{
  const { spawnSync } = await import('node:child_process');
  const r = spawnSync('node', [path.join(root, 'build.mjs'), '--check'], { encoding: 'utf8' });
  if (r.status === 0) { passed++; console.log('✓ admin.js・manifest.json は最新'); } else { fail++; failures.push('build --check'); console.log('✗ build --check', r.stdout); }
}

console.log(`\n${passed} 件 OK ／ ${fail} 件 NG`);
if (failures.length) console.log('NG:', failures.join(' / '));
if (phpErr.trim()) console.log('--- PHP stderr ---\n' + phpErr.split('\n').filter(l => !/Accepted|Closing|\[200\]|\[30[0-9]\]|\[40[0-9]\]|\[50[0-9]\]|Development Server/.test(l)).slice(0, 15).join('\n'));
php.kill(); lineServer.close(); fs.rmSync(tmp, { recursive: true, force: true });
process.exit(fail ? 1 : 0);
