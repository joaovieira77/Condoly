import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import api from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('neighbourly_user');
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(true);

  const carregarPerfil = useCallback(async () => {
    const token = localStorage.getItem('neighbourly_token');
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const { data } = await api.get('/auth/perfil');
      setUser(data);
      localStorage.setItem('neighbourly_user', JSON.stringify(data));
    } catch {
      localStorage.removeItem('neighbourly_token');
      localStorage.removeItem('neighbourly_user');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregarPerfil();
  }, [carregarPerfil]);

  async function login(email, password) {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('neighbourly_token', data.token);
    localStorage.setItem('neighbourly_user', JSON.stringify(data.user));
    setUser(data.user);
    await carregarPerfil(); // vai buscar o isAdmin
  }

  async function signup(payload) {
    const { data } = await api.post('/auth/signup', payload);
    localStorage.setItem('neighbourly_token', data.token);
    localStorage.setItem('neighbourly_user', JSON.stringify(data.user));
    setUser(data.user);
    await carregarPerfil();
  }

  function logout() {
    localStorage.removeItem('neighbourly_token');
    localStorage.removeItem('neighbourly_user');
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de um AuthProvider.');
  return ctx;
}
