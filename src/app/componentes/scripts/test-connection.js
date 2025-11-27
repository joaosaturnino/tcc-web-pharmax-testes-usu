// scripts/test-connection.js

// --- CONFIGURAÇÃO ---
const TEST_TIMEOUT_MS = 5000; // Define o timeout de 5 segundos
// URL CORRIGIDA: Usa o IP e a porta que definimos no projeto (3334), removendo o prefixo /api.
const API_BASE_URL = 'http://172.16.0.34:3334';

const testConnection = async () => {
  console.log('🔍 Testando conexão com a API...');

  // Endpoints críticos para verificar a conectividade e rotas
  // As rotas baseadas no routes-jh.js não usam prefixo /api
  const endpoints = [
    `${API_BASE_URL}/usuarios`,      // Ex: Listar usuários (Rota básica)
    `${API_BASE_URL}/medicamentos`,  // Ex: Medicamentos (Deve retornar 200/400 dependendo dos params)
    `${API_BASE_URL}/`,              // Ex: Rota Raiz (Deve retornar 404/Erro no Express)
  ];

  for (const url of endpoints) {
    // 1. AbortController: O método padrão para implementar timeout com 'fetch'
    const controller = new AbortController();

    // Cria um temporizador que, se expirar, chama controller.abort()
    const timeoutId = setTimeout(() => controller.abort(), TEST_TIMEOUT_MS);

    try {
      console.log(`\n📡 Tentando: ${url}`);
      const start = Date.now();

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        signal: controller.signal, // 2. Aplica o sinal de abort ao fetch
      });

      clearTimeout(timeoutId); // 3. Limpa o timeout se a requisição for concluída

      const end = Date.now();

      // Feedback visual para 4xx e 2xx
      const statusIcon = response.status >= 400 && response.status < 500 ? '⚠️ ' : '✅ ';

      console.log(`${statusIcon} Status: ${response.status} ${response.statusText}`);
      console.log(`⏱️  Tempo: ${end - start}ms`);

      // Tenta ler a resposta JSON (mesmo em 4xx, para debug)
      if (response.ok || response.status >= 400) {
        try {
          const data = await response.json();
          console.log('📦 Resposta JSON:', JSON.stringify(data, null, 2).substring(0, 200) + '...');
        } catch (e) {
          const text = await response.text();
          console.log('📄 Resposta texto:', text.substring(0, 200) + '...');
        }
      }

    } catch (error) {
      clearTimeout(timeoutId);
      console.log('❌ Erro:', error.message);

      // Tratamento de Erros Comuns
      if (error.message.includes('aborted')) {
        console.log(`   → Requisição Cancelada (Timeout de ${TEST_TIMEOUT_MS}ms)`);
      } else if (error.message.includes('ECONNREFUSED') || error.message.includes('Network')) {
        console.log('   → Servidor Não Encontrado. Verifique o IP ou se a API está rodando.');
      } else if (error.message.includes('CORS')) {
        console.log('   → Problema de CORS. Verifique as configurações de cabeçalho da sua API.');
      }
    }
  }
};

testConnection();