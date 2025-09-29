/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.institutoaron.com.br',
        port: '',
        pathname: '/static/img/large/**', // Isso torna a regra mais específica e segura
      },
    ],
  },
};

export default nextConfig;