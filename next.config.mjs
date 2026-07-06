/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@ceo-core/ar'],
  experimental: {
    externalDir: true,
    turbo: {
      resolveAlias: {
        fs: false,
        path: false,
        crypto: false,
      },
    },
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
      };
    }
    return config;
  },
};

export default nextConfig;
