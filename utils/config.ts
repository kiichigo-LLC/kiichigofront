/**
 * NEXT_PUBLIC_* と URL ヘルパー（ibt の utils/config と同じ役割）
 */

export const SITE_NAME =
  process.env.NEXT_PUBLIC_SITE_NAME || "合同会社キイチゴ";
export const SITE = (process.env.NEXT_PUBLIC_SITE_URL || "").replace(/\/$/, "");
export const WP = (process.env.WP_API_URL || "").replace(/\/$/, "");

/** `public/` 配下（css / js / img）へのルート相対パス */
export function asset(p: string) {
  return `/${p.replace(/^\//, "")}`;
}

export function path(p: string) {
  const x = p.startsWith("/") ? p : `/${p}`;
  return SITE ? `${SITE}${x}` : x;
}

export function canonical(p: string) {
  const x = p.startsWith("/") ? p : `/${p}`;
  return SITE ? `${SITE}${x}` : `https://kiichigo.work${x}`;
}
