/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')
const { withSentryConfig } = require('@sentry/nextjs')
/** @type {import('next').NextConfig} */

process.env.SENTRY_IGNORE_API_RESOLUTION_ERROR = '1'

const nextConfig = {
  trailingSlash: false,
  reactStrictMode: false,
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**'
      }
    ]
  },
  // async redirects() {
  //   return [
  //     {
  //       source: '/((?!sheesh).*)',
  //       destination: '/sheesh',
  //       permanent: false
  //     }
  //   ]
  // },
  webpack: config => {
    config.resolve.alias = {
      ...config.resolve.alias,
      apexcharts: path.resolve(__dirname, './node_modules/apexcharts-clevision')
    }
    return config
  }
}

const sentryExports = {
  ...nextConfig,
  sentry: {
    silent: true,
    debug: false,
    hideSourceMaps: true,
    disableServerWebpackPlugin: true,
    disableClientWebpackPlugin: true,
    authToken: process.env.SENTRY_AUTH_TOKEN,
    org: process.env.SENTRY_ORG,
    project: process.env.SENTRY_PROJECT
  }
}

const sentryWebpackPluginOptions = {
  widenClientFileUpload: true,
  transpileClientSDK: true,
  tunnelRoute: '/monitoring',
  hideSourceMaps: true,
  disableLogger: true,
  automaticVercelMonitors: true
}

module.exports = withSentryConfig(sentryExports, sentryWebpackPluginOptions)
