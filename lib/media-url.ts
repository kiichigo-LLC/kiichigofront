/** 本番メディア（wp.kiichigo.work の uploads 等） */
const WP_MEDIA_REMOTE = (
  process.env.NEXT_PUBLIC_WP_MEDIA_FALLBACK_URL || ""
).replace(/\/$/, "");

const UPLOADS_PROXY_PREFIX = (
  process.env.NEXT_PUBLIC_WP_UPLOADS_PROXY_PREFIX || "/wp-uploads-proxy"
).replace(/\/$/, "");

function isLocalHost(hostname: string) {
  return (
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname === "[::1]"
  );
}

/**
 * ローカル dev では wp-content/uploads を同一オリジン proxy 経由にする（CORS 回避）。
 * 本番・同一オリジンでは URL をそのまま返す。
 */
export function resolvePublicMediaUrl(url: string): string {
  const v = (url || "").trim();
  if (!v || typeof window === "undefined") return v;
  if (!WP_MEDIA_REMOTE || !isLocalHost(window.location.hostname)) return v;

  try {
    const remote = new URL(
      WP_MEDIA_REMOTE.startsWith("http")
        ? WP_MEDIA_REMOTE
        : `https://${WP_MEDIA_REMOTE}`
    );
    const target = new URL(v, remote.origin);
    if (target.origin !== remote.origin) return v;

    const m = target.pathname.match(/^\/wp-content\/uploads\/(.+)$/);
    if (!m) return v;

    return `${window.location.origin}${UPLOADS_PROXY_PREFIX}/${m[1]}${target.search}${target.hash}`;
  } catch {
    return v;
  }
}
