/** @type {import('next').NextConfig} */
const nextConfig = {
  // Optimize bundle size
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  webpack: (config, { dev, isServer }) => {
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
    
    // Production optimizations
    if (!dev) {
      config.optimization = {
        ...config.optimization,
        minimize: true,
        moduleIds: 'deterministic',
        chunkIds: 'deterministic',
      };

      // Exclude large dependencies from server bundles
      if (isServer) {
        config.externals = [...(config.externals || []), 'sharp', 'gray-matter'];
      }
    }

    return config;
  },
  // Disable unnecessary features
  productionBrowserSourceMaps: false,
  optimizeFonts: false,
  // Reduce bundle size
  modularizeImports: {
    'lucide-react': {
      transform: 'lucide-react/dist/esm/icons/{{member}}',
    },
    '@heroicons/react/24/outline': {
      transform: '@heroicons/react/24/outline/{{member}}',
    },
  },
}

export default nextConfig; 