import path from "path";
import type { NextConfig } from "next";

const wpSite = process.env.WP_SITE_URL ?? "http://localhost:8080";

const nextConfig: NextConfig = {
  /** 開発時の左下インジケータ（devtools-indicator）を非表示 */
  devIndicators: false,
  outputFileTracingRoot: path.join(__dirname),
  async rewrites() {
    return [
      {
        source: "/wp-theme/:path*",
        destination: `${wpSite.replace(/\/$/, "")}/wp-content/themes/main/:path*`,
      },
    ];
  },
};

export default nextConfig;
