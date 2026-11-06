// 「本日の営業状況」バッジ（FLOWCLOUD・glow のトップのファーストビュー）。
// 閲覧した日（日本時間）が data.json の休業日リスト（closed）に入っているかで、営業中／受付終了／定休日を出す。
//  - 事実は FACTS.md のとおり：営業 9:00〜20:00、FLOWCLOUDの最終受付 18:00（glowは記載なし）。ネット予約は24時間受付。
//  - 休業日リストの最終日を過ぎている（＝リストが古い）ときは、間違った表示をしないよう何も出さない。
//  - HTMLは空の枠（高さだけ確保）で出し、JSが文字を入れる。表示のずれ（CLS）は出ない。
export const livePill = () => '<p class="live" id="live"></p>';

export const liveScript = (closed, opt = {}) => {
  const list = [...(closed || [])].sort();
  if (!list.length) return '';
  const accept = opt.lastAccept ? Number(opt.lastAccept.split(':')[0]) : 0;
    return `<script>(function(){var C=${JSON.stringify(list)},el=document.getElementById("live");if(!el)return;
var n=new Date(),J=new Date(n.getTime()+(n.getTimezoneOffset()+540)*60000);
function f(d){return d.getFullYear()+"-"+("0"+(d.getMonth()+1)).slice(-2)+"-"+("0"+d.getDate()).slice(-2)}
var W=["日","月","火","水","木","金","土"],last=C[C.length-1],t=f(J);
if(t>last){el.style.display="none";return}
var h=J.getHours()+J.getMinutes()/60,off=C.indexOf(t)>-1,k,m,s="ネット予約は24時間受付中";
if(off){k="off";m="本日は定休日です";s="";var d=new Date(J.getTime()),i=0;
 for(;i<21;i++){d.setDate(d.getDate()+1);var y=f(d);if(y>last)break;if(C.indexOf(y)<0){s="次の営業日は "+(d.getMonth()+1)+"/"+d.getDate()+"（"+W[d.getDay()]+"）";break}}}
else if(h<9){k="wait";m="本日 9:00〜20:00 営業"}
else if(${accept}&&h>=${accept}&&h<20){k="wait";m="本日の最終受付は終了しました"}
else if(h<20){k="on";m="本日営業中｜9:00〜20:00";${accept ? `s="最終受付${opt.lastAccept}｜ネット予約は24時間"` : ''}}
else{k="wait";m="本日の営業は終了しました"}
el.className="live live-"+k;el.innerHTML="<span><b>"+m+"</b>"+(s?"<small>"+s+"</small>":"")+"</span>"})()</script>`;
};
