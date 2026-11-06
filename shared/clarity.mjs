// ヒートマップ（Microsoft Clarity）。表示速度のため、最初の操作（スクロール・タップ等）か読み込み6秒後のどちらか早い方で読み込む。IDが空の間は何も出力しない（スクリプトも、プライバシーポリシーの追記も）。
// IDを入れる場所： fc-site/data.json と glow-site/data.json の "clarity"、採用サイトは client/.env.production の VITE_CLARITY_ID。
export const claritySnippet = (id) =>
  id
    ? `<script>(function(){try{if(localStorage.getItem("krs_internal"))return}catch(e){}var d=0,ev=["scroll","touchstart","keydown","click"];function go(){if(d)return;d=1;ev.forEach(function(e){removeEventListener(e,go)});(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y)})(window,document,"clarity","script","${id}")}ev.forEach(function(e){addEventListener(e,go,{passive:true})});addEventListener("load",function(){setTimeout(go,6000)})})()</script>`
    : '';

// プライバシーポリシーの追記（FLOWCLOUD・glow。入力フォームのないサイト向け）
export const clarityPolicy = (id) =>
  id
    ? '<h2>ヒートマップ（Microsoft Clarity）</h2><p>当サイトでは、ページのどの部分が見られ、どこで離れているかを把握してサイトを改善するため、Microsoft社の分析サービス「Microsoft Clarity」を利用しています。Cookie等を通じて、画面上のクリック・タップ・スクロールの動き、閲覧ページ、端末の種類、おおよその地域などが収集され、Microsoft社に送信されます。ご予約・お問い合わせの入力は外部の予約サービス上で行われ、当サイトでは入力内容を収集しません。氏名・連絡先等の個人を特定する情報は取得しません。収集された情報はMicrosoft社のプライバシーに関する声明に基づき管理されます。ブラウザのCookie設定の変更により、収集を停止できます。</p>'
    : '';
