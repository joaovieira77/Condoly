import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ nome: '', email: '', password: '', apartamento: '', telefone: '' });
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErro('');
    setLoading(true);
    try {
      await signup(form);
      navigate('/');
    } catch (err) {
      setErro(err.response?.data?.error || 'Não foi possível criar a conta. Tenta novamente.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-paper px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <p className="font-display text-3xl text-ink">Neighbourly</p>
          <p className="text-sm text-ink-soft mt-1">Regista-te como residente</p>
        </div>

        <form onSubmit={handleSubmit} className="panel px-6 py-7">
          {erro && (
            <p className="mb-4 text-sm text-clay bg-clay-soft/60 border border-clay/20 rounded px-3 py-2">
              {erro}
            </p>
          )}

          <label className="field-label" htmlFor="nome">Nome completo</label>
          <input id="nome" name="nome" required value={form.nome} onChange={handleChange} className="field-input mb-4" placeholder="Maria Silva" />

          <label className="field-label" htmlFor="email">Email</label>
          <input id="email" name="email" type="email" required value={form.email} onChange={handleChange} className="field-input mb-4" placeholder="tu@exemplo.com" />

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <label className="field-label" htmlFor="apartamento">Fração</label>
              <input id="apartamento" name="apartamento" required value={form.apartamento} onChange={handleChange} className="field-input" placeholder="3ºB" />
            </div>
            <div>
              <label className="field-label" htmlFor="telefone">Telefone</label>
              <input id="telefone" name="telefone" value={form.telefone} onChange={handleChange} className="field-input" placeholder="Opcional" />
            </div>
          </div>

          <label className="field-label" htmlFor="password">Palavra-passe</label>
          <input id="password" name="password" type="password" required minLength={6} value={form.password} onChange={handleChange} className="field-input mb-6" placeholder="Mínimo 6 caracteres" />

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'A criar conta…' : 'Criar conta'}
          </button>
        </form>

        <p className="text-center text-sm text-ink-soft mt-6">
          Já tens conta?{' '}
          <Link to="/login" className="text-ink underline underline-offset-2">
            Entra
          </Link>
        </p>
      </div>
    </div>
  );
}
