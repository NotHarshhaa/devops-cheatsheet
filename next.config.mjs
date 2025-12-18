/** @type {import('next').NextConfig} */
const nextConfig = {
  // Optimize bundle size
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
    reactRemoveProperties: process.env.NODE_ENV === "production",
  },
  // Optimize images
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
  },
  webpack: (config, { dev, isServer }) => {
    // Handle markdown files
    config.module.rules.push({
      test: /\.md$/,
      use: "raw-loader",
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
        moduleIds: "deterministic",
        chunkIds: "deterministic",
        runtimeChunk: { name: "runtime" },
        splitChunks: {
          chunks: "all",
          cacheGroups: {
            vendor: {
              name: "vendor",
              test: /[\\/]node_modules[\\/]/,
              chunks: "all",
              priority: 10,
            },
            commons: {
              name: "commons",
              minChunks: 2,
              priority: 5,
              reuseExistingChunk: true,
            },
          },
        },
      };

      // Exclude large dependencies from server bundles
      if (isServer) {
        config.externals = [
          ...(config.externals || []),
          "sharp",
          "gray-matter",
          "react-syntax-highlighter",
        ];
      }
    }

    return config;
  },
  // Disable unnecessary features
  productionBrowserSourceMaps: false,
  poweredByHeader: false,
  // Enable static compression
  compress: true,
  // Enhance speed with incremental static regeneration
  staticPageGenerationTimeout: 120,
  // Reduce bundle size
  modularizeImports: {
    "lucide-react": {
      transform: "lucide-react/dist/esm/icons/{{member}}",
      preventFullImport: true,
      skipDefaultConversion: true,
    },
    "@heroicons/react/24/outline": {
      transform: "@heroicons/react/24/outline/{{member}}",
      preventFullImport: true,
    },
    "react-icons/fa": {
      transform: "react-icons/fa/{{member}}",
      preventFullImport: true,
    },
    "react-icons/hi": {
      transform: "react-icons/hi/{{member}}",
      preventFullImport: true,
    },
  },
  // Output file tracing for serverless
  outputFileTracingExcludes: {
    "*": [
      "node_modules/@swc/core-linux-x64-gnu",
      "node_modules/@swc/core-linux-x64-musl",
      "node_modules/esbuild-linux-64/bin",
    ],
  },
};

export default nextConfig;
