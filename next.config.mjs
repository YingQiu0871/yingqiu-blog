/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  experimental: {
    globalNotFound: true,
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
