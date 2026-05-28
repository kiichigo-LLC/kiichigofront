import path from "path";

const BASE_PATH = (process.env.NEXT_PUBLIC_BASE_PATH || "").replace(/\/$/, "");
const IS_DEV = process.env.NODE_ENV !== "production";

const nextConfig = {
  output: "export" as const,
  basePath: !IS_DEV && BASE_PATH ? BASE_PATH : undefined,
  assetPrefix: !IS_DEV && BASE_PATH ? BASE_PATH : undefined,
  outputFileTracingRoot: path.join(process.cwd()),
  typescript: {
    ignoreBuildErrors: process.env.DISABLE_BUILD_CHECK === "true",
  },
  eslint: {
    ignoreDuringBuilds: process.env.DISABLE_BUILD_CHECK === "true",
  },
  /** 開発時: 記事 URL を entry に渡す（本番は public/.htaccess） */
  async rewrites() {
    return [
      /** ローカル dev: 本番 uploads 取得（ブラウザ CORS 回避） */
      {
        source: "/wp-media-proxy/:path*",
        destination: "https://wp.kiichigo.work/wp-json/wp/v2/:path*",
      },
      { source: "/koe/:slug", destination: "/koe/entry" },
      { source: "/web/:slug", destination: "/web/entry" },
      { source: "/trajectory/:slug", destination: "/trajectory/entry" },
      { source: "/tag/:slug/page/:page", destination: "/tag/entry" },
      { source: "/tag/:slug", destination: "/tag/entry" },
    ];
  },
};

export default nextConfig;
