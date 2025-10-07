/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // Adicione a nova configuração aqui
      {
        protocol: 'https',
        hostname: 'www.institutoaron.com.br',
        pathname: '/static/img/large/**',
      },
      // Exemplo de como manter outras configurações que você já possa ter
      {
        protocol: 'https',
        hostname: 'images.ecycle.com.br',
        pathname: '/wp-content/uploads/**',
      },

      {
        // Regra para autorizar imagens do seu backend
        protocol: 'http',
        hostname: 'localhost',
        port: '3334',
        pathname: '/uploads/**', // Permite qualquer imagem dentro da pasta /uploads
      },

      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3334',
        pathname: '/public/medicamentos/**',
      },

      {
        protocol: 'http', // Use 'http' se não estiver usando HTTPS
        hostname: 'localhost', // O IP do seu servidor backend
        port: '3334', // A porta do seu servidor backend
        pathname: '/**', // Permite qualquer caminho dentro desse host/porta
      },

      
    ],
  },
};

export default nextConfig;