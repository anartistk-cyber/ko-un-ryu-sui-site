// 【要確定】: 会社の確認が取れていない条件。
// 検証ビルド: 黄色の【要確定：…】で表示し、公開前ゲートで残存を検出する。
// 公開ビルド(VITE_PUBLISH=1): 利用者向けに「確認中」と表示する。値は推測しない。
const PUBLISH = import.meta.env.VITE_PUBLISH === "1";
export function TBD({ children }: { children: React.ReactNode }) {
  if (PUBLISH) return <span>確認中</span>;
  return <mark className="tbd" data-tbd="1">【要確定：{children}】</mark>;
}
