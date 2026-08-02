import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  allowedDevOrigins: [
    "192.168.29.55",
    "localhost",
    "0.0.0.0",
  ],
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
