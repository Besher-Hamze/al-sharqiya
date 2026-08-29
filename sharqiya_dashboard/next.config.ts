import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // Media thumbnails render through plain <img> against the API origin, so the
  // image optimiser is not involved and no remotePatterns are required.
  reactStrictMode: true,
};

export default nextConfig;
