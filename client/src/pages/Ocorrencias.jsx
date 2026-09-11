import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import StatusBadge from '../components/StatusBadge';
import EmptyState from '../components/EmptyState';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { formatarDataHora } from '../utils/format';

export default function Ocorrencias() {
  const { user } = useAuth();
  const [ocorrencias, setOcorrencias] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [aFormar, setAFormar] = useState(false);
  const [form, setForm] = useState({ titulo: '', descricao: '' });
  const [respostas, setRespostas] = useState({});

  async function carregar() {
    setCarregando(true);
    const rota = user?.isAdmin ? '/ocorrencias' : '/ocorrencias/minhas';
    const { data } = await api.get(rota);
    setOcorrencias(data);
    setCarregando(false);
  }

  useEffect(() => {
    carregar();
  }, [user]);

  async function handleCriar(e) {
    e.preventDefault();
    await api.post('/ocorrencias', form);
    setForm({ titulo: '', descricao: '' });
    setAFormar(false);
    carregar();
  }

  async function resolver(id) {
    await api.patch(`/ocorrencias/${id}/resolver`, { resposta: respostas[id] || '' });
    carregar();
  }

  return (
    <Layout
      title="Ocorrências"
      action={
        !user?.isAdmin && (
          <button onClick={() => setAFormar((v) => !v)} className="btn-primary">
            {aFormar ? 'Cancelar' : 'Reportar ocorrência'}
          </button>
        )
      }
    >
      {aFormar && (
        <form onSubmit={handleCriar} className="panel px-6 py-5 mb-6">
          <label className="field-label">Título</label>
          <input required value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} className="field-input mb-4" placeholder="Fuga de água na garagem" />
          <label className="field-label">Descrição</label>
          <textarea required rows={3} value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} className="field-input mb-4" placeholder="Descreve o que se passa e onde." />
          <button type="submit" className="btn-primary">Reportar</button>
        </form>
      )}

      {carregando ? (
        <p className="text-ink-soft">A carregar…</p>
      ) : ocorrencias.length === 0 ? (
        <EmptyState title="Sem ocorrências" description={user?.isAdmin ? 'Não há ocorrências reportadas pelos residentes.' : 'Ainda não reportaste nenhuma ocorrência.'} />
      ) : (
        <div className="space-y-4">
          {ocorrencias.map((o) => (
            <div key={o._id} className="panel px-6 py-5">
              <div className="flex items-start justify-between mb-2">
                <p className="font-display text-lg text-ink">{o.titulo}</p>
                <StatusBadge tone={o.estado === 'resolvido' ? 'forest' : 'clay'}>
                  {o.estado === 'resolvido' ? 'Resolvida' : 'Pendente'}
                </StatusBadge>
              </div>
              <p className="text-sm text-ink-soft mb-2">{o.descricao}</p>
              <p className="text-xs text-ink-soft/70 mb-3">Reportada em {formatarDataHora(o.dataCriacao)}</p>

              {o.resposta && (
                <div className="bg-paper-dim/60 border border-line rounded px-4 py-3 mb-3">
                  <p className="text-xs text-ink-soft mb-1">Resposta da administração</p>
                  <p className="text-sm text-ink">{o.resposta}</p>
                </div>
              )}

              {user?.isAdmin && o.estado === 'pendente' && (
                <div className="flex gap-2 mt-2">
                  <input
                    value={respostas[o._id] || ''}
                    onChange={(e) => setRespostas({ ...respostas, [o._id]: e.target.value })}
                    className="field-input flex-1"
                    placeholder="Resposta (opcional)"
                  />
                  <button onClick={() => resolver(o._id)} className="btn-secondary whitespace-nowrap">
                    Marcar como resolvida
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
}
