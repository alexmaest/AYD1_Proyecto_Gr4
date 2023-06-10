/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'github.com',
        port: '',
        pathname: '/*.(png|jpg|jpeg|gif|svg)'

      }
    ]
  }
}

module.exports = nextConfig
