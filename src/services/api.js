import axios from 'axios';

// Usa la variable de entorno de Vercel, o localhost para desarrollo
const API_URL = 'https://mi-tienda-production-83d2.up.railway.app/api';

console.log('🔌 API_URL configurada:', API_URL);

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

export default api;