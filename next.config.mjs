/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@ceo-core/ar'],
  experimental: {
    externalDir: true,
  },
};

export default nextConfig;
