import { clsx, type ClassValue } from "clsx";

// クラス名をつなぐだけ。以前は tailwind-merge（約100KB）で重複を整理していたが、使っているのは ErrorBoundary の1か所で
// 競合するクラスも無いため外した（採用トップの JS を軽くするため。2026-11-24）。
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}
