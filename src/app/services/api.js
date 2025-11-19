import axios from "axios";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const apiPorta = process.env.NEXT_PUBLIC_API_PORTA;

// Construir baseURL de forma segura. Se variáveis não estiverem definidas, usar string vazia (mesma origem).
let baseURL = '';
if (apiUrl) {
  baseURL = apiUrl;
  if (apiPorta) baseURL = `${apiUrl}:${apiPorta}`;
}

console.log(`Conectando à API em: ${baseURL || 'mesma origem (fallback)'}`);

const api = axios.create({ baseURL });

export default api;