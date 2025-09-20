// src/services/api.js
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// Timeout para requisições (8 segundos)
const REQUEST_TIMEOUT = 8000;

class ApiService {
  constructor() {
    this.isOnline = false;
    this.lastCheck = null;
  }

  async fetchWithTimeout(url, options = {}) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

    try {
      const config = {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': this.getAuthToken(),
          ...options.headers,
        }
      };

      const response = await fetch(url, config);
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status} - ${response.statusText}`);
      }

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }
      return await response.text();

    } catch (error) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        throw new Error('Timeout: A requisição demorou muito');
      }
      throw error;
    }
  }

  getAuthToken() {
    if (typeof window === 'undefined') return '';
    
    const token = localStorage.getItem('authToken') || 
                 sessionStorage.getItem('authToken') || '';
    return token ? `Bearer ${token}` : '';
  }

  async checkApiStatus() {
    try {
      const start = Date.now();
      await this.fetchWithTimeout(`${API_BASE_URL}/health`, {
        method: 'GET'
      });
      this.isOnline = true;
      this.lastCheck = Date.now();
      return true;
    } catch (error) {
      this.isOnline = false;
      return false;
    }
  }

  // Serviços específicos
  async getMedicamentosFavoritos(page = 1, limit = 10) {
    const url = `${API_BASE_URL}/medicamentos/favoritos?page=${page}&limit=${limit}`;
    
    try {
      console.log('🌐 Conectando com API real...', url);
      const data = await this.fetchWithTimeout(url);
      console.log('✅ API conectada com sucesso');
      return data;
    } catch (error) {
      console.warn('❌ Falha na API, usando fallback:', error.message);
      return this.getFallbackData();
    }
  }

  getFallbackData() {
    // Dados mockados de fallback
    return {
      success: true,
      message: "Dados de demonstração - API offline",
      data: {
        medicamentos: this.generateMockMedicamentos(),
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalItems: 5,
          itemsPerPage: 10
        }
      }
    };
  }

  generateMockMedicamentos() {
    return [
      {
        id: "1",
        nome: "Paracetamol 500mg",
        dosagem: "500mg",
        fabricante: "MedFarma Ltda",
        favoritacoes: Math.floor(Math.random() * 50) + 20,
        status: "em_estoque",
        ultimaAtualizacao: new Date().toISOString(),
        imagem: "/images/medicamentos/paracetamol.jpg"
      },
      {
        id: "2",
        nome: "Ibuprofeno 400mg",
        dosagem: "400mg",
        fabricante: "FarmaBem SA",
        favoritacoes: Math.floor(Math.random() * 40) + 15,
        status: "em_estoque",
        ultimaAtualizacao: new Date().toISOString(),
        imagem: "/images/medicamentos/ibuprofeno.jpg"
      },
      {
        id: "3",
        nome: "Omeprazol 20mg",
        dosagem: "20mg",
        fabricante: "LabHealth",
        favoritacoes: Math.floor(Math.random() * 30) + 10,
        status: "indisponivel",
        ultimaAtualizacao: new Date().toISOString(),
        imagem: "/images/medicamentos/omeprazol.jpg"
      }
    ];
  }
}

// Singleton instance
export const apiService = new ApiService();
export default apiService;