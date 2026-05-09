import { resolve } from 'path';
import type { NextConfig } from "next";

const isProd = process.env.NEXT_USE_EXPORT === 'true';
const repoName = '/Neuro.Fuse-O-Forge';

const nextConfig: NextConfig = {
    output: isProd ? 'export' : 'standalone',
    basePath: isProd ? repoName : '',
    assetPrefix: isProd ? repoName : '',
    images: {
        unoptimized: true,
    },
    turbopack: {
    resolveAlias: {
      app: resolve(__dirname, 'src/app'),
    },
  },
};

export default nextConfig;
