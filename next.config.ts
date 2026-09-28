import type { NextConfig } from "next";

const privateLanDevOrigins = [
  "10.*.*.*",
  "192.168.*.*",
  ...Array.from({ length: 16 }, (_, index) => `172.${16 + index}.*.*`),
];

const nextConfig: NextConfig = {
  // Development-only allowance for trusted private classroom LANs.
  // This avoids broken hydration/HMR when the teacher opens the dev server by LAN IP.
  // Production mode (`npm run start`) does not use this setting.
  allowedDevOrigins: privateLanDevOrigins,
};

export default nextConfig;
