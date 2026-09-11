import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setErro('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setErro(err.response?.data?.error || 'Não foi possível entrar. Tenta novamente.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-paper px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <p className="font-display text-3xl text-ink">Neighbourly</p>
          <p className="text-sm text-ink-soft mt-1">Entra na tua conta de residente</p>
        </div>

        <form onSubmit={handleSubmit} className="panel px-6 py-7">
          {erro && (
            <p className="mb-4 text-sm text-clay bg-clay-soft/60 border border-clay/20 rounded px-3 py-2">
              {erro}
            </p>
          )}

          <label className="field-label" htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="field-input mb-4"
            placeholder="tu@exemplo.com"
          />

          <label className="field-label" htmlFor="password">Palavra-passe</label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="field-input mb-6"
            placeholder="••••••••"
          />

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'A entrar…' : 'Entrar'}
          </button>
        </form>

        <p className="text-center text-sm text-ink-soft mt-6">
          Ainda não tens conta?{' '}
          <Link to="/signup" className="text-ink underline underline-offset-2">
            Cria uma conta
          </Link>
        </p>
      </div>
    </div>
  );
}
