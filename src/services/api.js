import axios from 'axios';

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost';
const apiPort = process.env.NEXT_PUBLIC_API_PORTA || '3333';

const api = axios.create({
    baseURL: `${apiUrl}:${apiPort}`, // ip e porta do servidor
});
// console.log(`${apiUrl}:${apiPorta}`)

export default api;