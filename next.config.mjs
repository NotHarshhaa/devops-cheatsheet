/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    serverActions: true,
  },
  webpack: (config, { isServer }) => {
    // Handle markdown files
    config.module.rules.push({
      test: /\.md$/,
      use: 'raw-loader'
    });

    // Handle browser polyfills
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        path: false,
      };
    }
    
    // Optimize the build
    config.optimization = {
      ...config.optimization,
      minimize: true,
      moduleIds: 'deterministic',
      chunkIds: 'deterministic',
    };

    return config;
  },
  // Optimize serverless functions
  serverComponentsExternalPackages: ['sharp', 'gray-matter'],
  outputFileTracing: true,
  generateBuildId: async () => 'build',
  // Cache optimization
  onDemandEntries: {
    maxInactiveAge: 60 * 60 * 1000,
    pagesBufferLength: 2,
  },
};

export default nextConfig; 