import { resolve } from 'path';
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */
    output: 'standalone',
    turbopack: {
    resolveAlias: {
      app: resolve(__dirname, 'src/app'),
    },
  },
};

export default nextConfig;
