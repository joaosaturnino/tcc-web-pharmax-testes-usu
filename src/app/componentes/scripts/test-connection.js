// scripts/test-connection.js
const testConnection = async () => {
  console.log('🔍 Testando conexão com a API...');

  const endpoints = [
    'http://localhost:3333/api/medicamentos/favoritos',
    'http://localhost:3333/api/',
    'http://localhost:3333/'
  ];

  for (const url of endpoints) {
    try {
      console.log(`\n📡 Tentando: ${url}`);
      const start = Date.now();

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        // timeout não é suportado nativamente, usamos abort controller
      });

      const end = Date.now();
      console.log(`✅ Status: ${response.status} ${response.statusText}`);
      console.log(`⏱️  Tempo: ${end - start}ms`);

      if (response.ok) {
        try {
          const data = await response.json();
          console.log('📦 Resposta JSON:', JSON.stringify(data, null, 2).substring(0, 200) + '...');
        } catch (e) {
          const text = await response.text();
          console.log('📄 Resposta texto:', text.substring(0, 200) + '...');
        }
      }

    } catch (error) {
      console.log('❌ Erro:', error.message);
      if (error.code === 'ECONNREFUSED') {
        console.log('   → Servidor não está respondendo');
      } else if (error.message.includes('CORS')) {
        console.log('   → Problema de CORS');
      } else if (error.message.includes('Network')) {
        console.log('   → Problema de rede');
      }
    }
  }
};

testConnection();