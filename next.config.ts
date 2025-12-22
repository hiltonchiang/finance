// next.config.ts
import type { NextConfig } from 'next'
import path from 'path'

import { withContentlayer } from 'next-contentlayer2'
import bundleAnalyzer from '@next/bundle-analyzer'

const nextConfig : NextConfig = {
  typescript: {
    // Set a custom path to your alternate tsconfig file
    tsconfigPath: './tsconfig.json',
  },
  // Other Next.js configurations...
}

const withBundleAnalyzer = bundleAnalyzer({ enabled: process.env.ANALYZE === 'true' })
const plugins = [withContentlayer, withBundleAnalyzer]
const config = plugins.reduce((acc, plugin) => plugin(acc), { ...nextConfig })

export default nextConfig
