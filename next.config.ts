import { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/process-image",
        destination: "https://ocr-hakims-projects-952c128e.vercel.app/process-image/",
      },
    ];
  },
};

export default nextConfig;
