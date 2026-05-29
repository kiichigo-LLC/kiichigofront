"use client";

import { usePathname } from "next/navigation";

/**
 * 公開 pathname からページ種別を判定する（旧 WP の is_home / is_single 相当）
 *
 * - Header / Nav の active・メニュー表示
 *
 * 判定を増やすときはこの関数だけ直す。
 */
export function pageType(pathname: string) {
  const isHome = pathname === "/";
  return {
    pathname,
    isHome,
  };
}

export type PageType = ReturnType<typeof pageType>;

/** Client コンポーネント用（pathname + 上記フラグ） */
export default function usePageType(): PageType {
  return pageType(usePathname() ?? "/");
}
