const nextConfig = {
  typescript: {
    ignoreBuildErrors: process.env.DISABLE_BUILD_CHECK === 'true',
  },
  eslint: {
    // ❌ ignoreBuildFiles ではなく、正しくはこれです！
    ignoreDuringBuilds: process.env.DISABLE_BUILD_CHECK === 'true',
  },
};

export default nextConfig;