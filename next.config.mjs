/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@ceo-core/ar'],
  experimental: {
    externalDir: true,
  },
  // Turbopack config (Next.js 16+ default bundler)
  turbopack: {
    resolveAlias: {
      fs: false,
      path: false,
      crypto: false,
    },
  },
};

export default nextConfig;
