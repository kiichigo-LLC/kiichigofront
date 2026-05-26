import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /** 開発時の左下インジケータ（devtools-indicator）を非表示 */
  devIndicators: false,
  outputFileTracingRoot: path.join(__dirname),
};

export default nextConfig;
