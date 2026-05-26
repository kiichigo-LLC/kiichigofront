"use client";

import { usePathname } from "next/navigation";

/** `/web/foo` のように一覧 `/web` より下の記事 URL か */
function isArticlePath(pathname: string, section: "koe" | "web" | "trajectory") {
  const prefix = `/${section}/`;
  return pathname.startsWith(prefix) && pathname.length > prefix.length;
}

/**
 * 公開 pathname からページ種別を判定する（旧 WP の is_home / is_single 相当）
 *
 * - Header / Nav の active・メニュー表示
 * - layout-scripts の追加 JS
 *
 * 判定を増やすときはこの関数だけ直す。
 */
export function pageType(pathname: string) {
  const isHome = pathname === "/";
  const isContact = pathname === "/contact";
  const isTag = pathname === "/tag" || pathname.startsWith("/tag/");

  return {
    pathname,
    isHome,
    isContact,
    isTag,
    loadContactForm: isContact,
    loadPrism: isArticlePath(pathname, "trajectory"),
    loadSingleWebIframe: isArticlePath(pathname, "web"),
    loadTagPlayer: isTag,
  };
}

export type PageType = ReturnType<typeof pageType>;

/** Client コンポーネント用（pathname + 上記フラグ） */
export default function usePageType(): PageType {
  return pageType(usePathname() ?? "/");
}
