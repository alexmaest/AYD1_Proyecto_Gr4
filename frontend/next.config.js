/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'github.com',
        port: '',
        pathname: '/*.(png|jpg|jpeg|gif|svg)'

      },
      {
        protocol: 'https',
        hostname: 'mcdonalds.com.gt',
        port: '',
        pathname: '/*.(png|jpg|jpeg|gif|svg)'
      },
      {
        protocol: 'https',
        hostname: 'alchilazo-bucket.s3.us-east-2.amazonaws.com',
        port: '',
        pathname: '/*.(png|jpg|jpeg|gif|svg)'
      }
    ]
  }
}

module.exports = nextConfig
