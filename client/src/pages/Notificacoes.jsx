import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import EmptyState from '../components/EmptyState';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { formatarDataHora } from '../utils/format';

export default function Notificacoes() {
  const { user } = useAuth();
  const [notificacoes, setNotificacoes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [aFormar, setAFormar] = useState(false);
  const [form, setForm] = useState({ titulo: '', mensagem: '' });

  async function carregar() {
    setCarregando(true);
    const { data } = await api.get('/notificacoes');
    setNotificacoes(data);
    setCarregando(false);
  }

  useEffect(() => {
    carregar();
  }, []);

  async function handleCriar(e) {
    e.preventDefault();
    await api.post('/notificacoes', form);
    setForm({ titulo: '', mensagem: '' });
    setAFormar(false);
    carregar();
  }

  return (
    <Layout
      title="Notificações"
      action={
        user?.isAdmin && (
          <button onClick={() => setAFormar((v) => !v)} className="btn-primary">
            {aFormar ? 'Cancelar' : 'Enviar notificação'}
          </button>
        )
      }
    >
      {aFormar && (
        <form onSubmit={handleCriar} className="panel px-6 py-5 mb-6">
          <label className="field-label">Título</label>
          <input required value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} className="field-input mb-4" placeholder="Corte de água agendado" />
          <label className="field-label">Mensagem</label>
          <textarea required rows={3} value={form.mensagem} onChange={(e) => setForm({ ...form, mensagem: e.target.value })} className="field-input mb-4" placeholder="Detalhes para os residentes." />
          <button type="submit" className="btn-primary">Enviar</button>
        </form>
      )}

      {carregando ? (
        <p className="text-ink-soft">A carregar…</p>
      ) : notificacoes.length === 0 ? (
        <EmptyState title="Sem notificações" description="Ainda não há anúncios da administração." />
      ) : (
        <div className="space-y-3">
          {notificacoes.map((n) => (
            <div key={n._id} className="panel px-6 py-5">
              <p className="font-display text-lg text-ink">{n.titulo}</p>
              <p className="text-sm text-ink-soft mt-1">{n.mensagem}</p>
              <p className="text-xs text-ink-soft/70 mt-2">{formatarDataHora(n.data)}</p>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
}
