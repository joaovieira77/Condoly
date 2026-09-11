import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
});

// Injeta o token JWT (se existir) em todos os pedidos
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('neighbourly_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Se o token deixar de ser válido, limpa a sessão e manda para o login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('neighbourly_token');
      localStorage.removeItem('neighbourly_user');
      if (!window.location.pathname.startsWith('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
