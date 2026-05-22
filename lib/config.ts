/** WordPress 本体の URL（末尾スラッシュなし） */
export const WP_SITE_URL =
  process.env.WP_SITE_URL ?? "http://localhost:8080";

/**
 * テーマ静的ファイル（css / js / img）
 * 開発時は /wp-theme プロキシ（next.config rewrites）で同一オリジンにし CORS を回避
 */
export const THEME_URL =
  process.env.NEXT_PUBLIC_WP_THEME_URL ??
  (process.env.NODE_ENV === "development"
    ? "/wp-theme"
    : `${WP_SITE_URL}/wp-content/themes/main`);

export const WP_API_URL =
  process.env.WP_API_URL ?? `${WP_SITE_URL}/wp-json/wp/v2`;

export const KIICHIGO_API_URL =
  process.env.KIICHIGO_API_URL ?? `${WP_SITE_URL}/wp-json/kiichigo/v1`;

/** Next 側のリンク用（未設定なら相対パス） */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "";

/** お問い合わせ・予約フォーム送信先（ロリポップ PHP） */
export const FORM_CHECK_URL =
  process.env.NEXT_PUBLIC_FORM_CHECK_URL ??
  "https://kiichigo.work/form/check.php";

/** contact.php の reCAPTCHA v2 サイトキー */
export const RECAPTCHA_SITE_KEY =
  process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ??
  "6LdQSDIaAAAAAAkqYuSdqvkMmY0JtKB5fwjDUvJ4";

export function themeAsset(path: string): string {
  return `${THEME_URL}/${path.replace(/^\//, "")}`;
}

export function sitePath(path: string): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  return SITE_URL ? `${SITE_URL.replace(/\/$/, "")}${p}` : p;
}
