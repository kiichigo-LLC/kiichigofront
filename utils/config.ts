/**
 * NEXT_PUBLIC_* と URL ヘルパー（ibt の utils/config と同じ役割）
 */

export const SITE_NAME =
  process.env.NEXT_PUBLIC_SITE_NAME || "合同会社キイチゴ";
export const SITE = (process.env.NEXT_PUBLIC_SITE_URL || "").replace(/\/$/, "");
// Deprecated: static assets are now served from web/public.
export const THEME = (process.env.NEXT_PUBLIC_THEME_URL || "").replace(/\/$/, "");
export const WP = (process.env.WP_API_URL || "").replace(/\/$/, "");

/**
 * ブラウザから叩く WP REST（静的ホスト + クライアント取得用）
 * ※ クライアントでは NEXT_PUBLIC_* のみ有効（WP_API_URL は使えない）
 */
export const WP_CLIENT = (process.env.NEXT_PUBLIC_WP_API_URL || "").replace(
  /\/$/,
  ""
);

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
