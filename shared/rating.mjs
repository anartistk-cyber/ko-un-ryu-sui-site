// 口コミ評価（ホットペッパービューティー・Googleマップ）の表示（FLOWCLOUD・glow のトップと「お客様の声」）。
//  - 数字は data.json の ratings（ホットペッパー／Googleの画面に出ていた値を転記したもの。asOf が取得日）。月次の更新フローで見直す。
//  - ホットペッパーの平均は『直近1年間の集計』、件数は掲載中の口コミの総数。Googleは星の平均とクチコミ件数。
//  - 構造化データ（aggregateRating）にはしない（自社サイトに自社で載せる評価は、Googleの対象外・誤解のもとのため）。
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const f1=n=>Number(n).toFixed(1), f2=n=>Number(n).toFixed(2);
export const ratingDate=R=>{const [y,m]=R.asOf.split('-');return `${y}年${Number(m)}月`};

// トップのファーストビュー：2つの小さなバッジ（押すと各サービスの口コミへ）
export const rateHero=(R,urlHpb,urlGoogle)=>!R?'':
`<div class="rate" aria-label="口コミ評価"><a class="rate-i" href="${esc(urlHpb)}" rel="noopener"><span class="rate-v"><i aria-hidden="true">★</i>${f2(R.hpb.avg)}</span><small>ホットペッパー<br>口コミ${R.hpb.count}件</small></a><a class="rate-i" href="${esc(urlGoogle)}" rel="noopener"><span class="rate-v"><i aria-hidden="true">★</i>${f1(R.google.avg)}</span><small>Google<br>クチコミ${R.google.count}件</small></a><p class="rate-n">${ratingDate(R)}時点｜口コミは個人の感想です</p></div>`;

// 「お客様の声」：大きな数字と、ホットペッパーの項目別
export const rateBox=(R,urlHpb,urlGoogle)=>!R?'':
`<div class="rbox"><div class="rbox-c"><p class="rbox-s">ホットペッパービューティー</p><p class="rbox-n"><i aria-hidden="true">★</i><b>${f2(R.hpb.avg)}</b></p><p class="rbox-m">サロン平均（直近1年）｜口コミ${R.hpb.count}件</p><ul class="rbox-l">${R.hpb.items.map(([k,v])=>`<li><span>${esc(k)}</span><b>${f1(v)}</b></li>`).join('')}</ul><p class="rbox-a"><a href="${esc(urlHpb)}" rel="noopener">ホットペッパーの口コミを見る →</a></p></div><div class="rbox-c"><p class="rbox-s">Googleマップ</p><p class="rbox-n"><i aria-hidden="true">★</i><b>${f1(R.google.avg)}</b></p><p class="rbox-m">クチコミ${R.google.count}件</p><p class="rbox-a"><a href="${esc(urlGoogle)}" rel="noopener">Googleマップで見る →</a></p></div></div><p class="note">${ratingDate(R)}時点の表示です。ホットペッパービューティーの平均点は直近1年間の集計で、口コミは個人の感想です。評価は変わることがあります。</p>`;

// 文章用（llms.txt・注記）
export const rateText=R=>!R?'':`ホットペッパービューティー 口コミ平均${f2(R.hpb.avg)}（直近1年の集計・口コミ${R.hpb.count}件）／Googleマップ ${f1(R.google.avg)}（クチコミ${R.google.count}件）・${ratingDate(R)}時点`;
export const rateAvgNote=R=>`口コミ平均 ${f2(R.hpb.avg)}（直近1年の集計・${ratingDate(R)}時点）`;
