/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'uploads.mangadex.org',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.mangadex.org',
        pathname: '/**',
      }
    ],
  },
}

export default nextConfig
