/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {},

  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
    reactRemoveProperties: process.env.NODE_ENV === "production",
  },

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

  productionBrowserSourceMaps: false,
  poweredByHeader: false,
  compress: true,
  staticPageGenerationTimeout: 120,
};

export default nextConfig;
