import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [new URL('https://d4lgxe9bm8juw.cloudfront.net/products/**')]
  }
};

export default nextConfig;
