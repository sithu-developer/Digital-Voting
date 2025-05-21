import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
   images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'qtq2w62s1fxgxh4w.public.blob.vercel-storage.com',
        port: '',
      },
    ],
  },
};

export default nextConfig;
