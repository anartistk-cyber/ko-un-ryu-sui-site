// 採用トップの「美容師タイプ診断」カード用：8人を横一列にした透明webp（types-strip.webp）を作る。
// 使い方: NODE_PATH=$(npm root -g) node autopost/type-shindan-art/make-strip.cjs（sharp が必要）
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '../..');
const dir = path.join(root, 'autopost/type-shindan-art') + '/';
const order = ['creator','innovator','artist','meister','entertainer','producer','partner','advisor'];
(async () => {
  const H = 200;
  const cells = [];
  for (const k of order) {
    const buf = await sharp(dir + k + '.svg', { density: 96 }).resize({ height: 600 }).png().toBuffer();
    const trimmed = await sharp(buf).trim({ threshold: 5 }).toBuffer();
    const m = await sharp(trimmed).metadata();
    const scaled = await sharp(trimmed).resize({ height: H }).toBuffer();
    const m2 = await sharp(scaled).metadata();
    cells.push({ k, buf: scaled, w: m2.width, h: m2.height });
  }
  const gap = -6; // sticker outlines overlap a little
  const W = cells.reduce((s, c) => s + c.w + gap, 0) - gap;
  let x = 0; const comps = [];
  for (const c of cells) { comps.push({ input: c.buf, left: x, top: H - c.h }); x += c.w + gap; }
  const base = sharp({ create: { width: W, height: H, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } });
  const out = path.join(root, 'client/public/images/type-shindan');
  fs.mkdirSync(out, { recursive: true });
  const png = await base.composite(comps).png().toBuffer();
  await sharp(png).webp({ quality: 78, alphaQuality: 80, effort: 6, smartSubsample: true }).toFile(out + '/types-strip.webp');
  console.log('strip', W, 'x', H, cells.map(c => c.k + ':' + c.w + 'x' + c.h).join(' '));
})();
