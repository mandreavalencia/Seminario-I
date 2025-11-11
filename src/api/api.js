// src/api/api.js
import axios from 'axios';

// URL BASE DEL SERVIDOR DE LA API COMPLETA
const BASE_URL = 'http://apirecoleccion.gonzaloandreslucio.com';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    // Asegúrate de incluir tu Content-Type y cualquier otro header necesario
    'Content-Type': 'application/json',
  },
});

// Interceptor para Tokens (si lo tienes)
// ...

export default api;
