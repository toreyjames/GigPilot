import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Resolve from this project so Tailwind and node_modules are found (avoids parent-dir resolution)
  turbopack: { root: path.resolve(process.cwd()) },
  webpack: (config, { isServer }) => {
    config.resolve = config.resolve ?? {};
    config.resolve.roots = [path.resolve(process.cwd())];
    return config;
  },
};

export default nextConfig;
