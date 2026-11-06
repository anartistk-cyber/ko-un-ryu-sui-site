import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { rememberCampaign } from "./lib/track";

rememberCampaign();

const rootEl = document.getElementById("root")!;
// 公開版は完成済みHTMLが入っているので、作り直さず「引き継ぐ」（表示の再生成・画像の再読み込み・JS負荷を避ける）。
// プリレンダ時（#rootが空）は従来どおり描画する。
if (rootEl.hasChildNodes()) {
  hydrateRoot(rootEl, <App />, {
    onRecoverableError: (error) => console.error("[hydrate-mismatch]", error),
  });
} else {
  createRoot(rootEl).render(<App />);
}
