// FLOWCLOUD / glow の style.css を css/ の部品から組み立てる。
//   使い方: node scripts/build-css.mjs   （リポジトリ直下で）
// 編集するのは fc-site/css/・glow-site/css/・shared/css/ の部品だけ。fc-site/style.css と glow-site/style.css は生成物。
// 組み立てたあと、各サイトで `node build.mjs`（SKILL: kounryusui-site-deploy）を実行して公開物 site/ を作り直す。
import fs from 'node:fs';
const read = (p) => fs.readFileSync(p, 'utf8');
const sites = {
  'fc-site': ['fc-site/css/00-base.css', 'fc-site/css/10-palette.css', 'fc-site/css/20-theme.css', 'shared/css/30-delight.css', 'shared/css/35-gallery.css', 'fc-site/css/45-pop.css', 'shared/css/50-convert.css', 'fc-site/css/50-fc.css'],
  'glow-site': ['glow-site/css/00-base.css', 'glow-site/css/10-palette.css', 'glow-site/css/20-theme.css', 'shared/css/30-delight.css', 'glow-site/css/40-extra.css', 'shared/css/35-gallery.css', 'glow-site/css/45-pop.css', 'shared/css/50-convert.css'],
};
for (const [dir, parts] of Object.entries(sites)) {
  const [base, ...rest] = parts.map(read);
  const out = base.replace(/\n+$/, '\n') + rest.join('');
  fs.writeFileSync(`${dir}/style.css`, out);
  console.log(dir, 'style.css', out.length, 'chars');
}
