const nextConfig = {
  typescript: {
    // 環境変数が true の時だけエラーを無視してビルドを通す
    ignoreBuildErrors: process.env.DISABLE_BUILD_CHECK === 'true',
  },
  eslint: {
    // 環境変数が true の時だけエラーを無視する
    ignoreBuildFiles: process.env.DISABLE_BUILD_CHECK === 'true',
  },
};

export default nextConfig;