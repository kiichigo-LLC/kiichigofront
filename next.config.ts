import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /** 開発時の左下インジケータ（devtools-indicator）を非表示 */
  devIndicators: false,
  outputFileTracingRoot: path.join(__dirname),
  // 公開 URL は /koe/記事スラッグ のまま。single 配下の page.tsx に slug を query で渡す
  async rewrites() {
    return [
      { source: "/koe/:slug", destination: "/single/koe?slug=:slug" },
      { source: "/web/:slug", destination: "/single/web?slug=:slug" },
      { source: "/trajectory/:slug", destination: "/single/trajectory?slug=:slug" },
    ];
  },
};

export default nextConfig;
