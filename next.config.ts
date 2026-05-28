import path from "path";

const nextConfig = {
  output: "export" as const,
  outputFileTracingRoot: path.join(process.cwd()),
  typescript: {
    ignoreBuildErrors: process.env.DISABLE_BUILD_CHECK === "true",
  },
  eslint: {
    ignoreDuringBuilds: process.env.DISABLE_BUILD_CHECK === "true",
  },
};

export default nextConfig;
