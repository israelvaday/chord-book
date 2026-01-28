import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/chord-book',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;
