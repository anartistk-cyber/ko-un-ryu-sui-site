// 公開用フォルダの全ページ本文を llms-full.txt にまとめる（採用サイト用。FC・glowは各 build.mjs 内で生成）
// 使い方: node scripts/llms-full.mjs site https://ko-un-ryu-sui.com/
import fs from 'node:fs';
import path from 'node:path';
import { buildLlmsFull } from '../shared/seo.mjs';
const [dir, base] = process.argv.slice(2);
const header = fs.readFileSync(path.join(dir, 'llms.txt'), 'utf8');
const r = buildLlmsFull(dir, base, header);
console.log('llms-full', r.pages, 'pages', Math.round(r.bytes / 1024) + 'KB');
