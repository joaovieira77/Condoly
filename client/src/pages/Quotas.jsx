import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import StatusBadge from '../components/StatusBadge';
import EmptyState from '../components/EmptyState';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { formatarData, formatarMoeda, nomeMes, MESES } from '../utils/format';

export default function Quotas() {
  const { user } = useAuth();
  const [quotas, setQuotas] = useState([]);
  const [utilizadores, setUtilizadores] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [aFormar, setAFormar] = useState(false);
  const anoAtual = new Date().getFullYear();
  const [form, setForm] = useState({ userId: '', ano: anoAtual, mes: new Date().getMonth() + 1, valor: '' });

  async function carregar() {
    setCarregando(true);
    if (user?.isAdmin) {
      const [q, u] = await Promise.all([api.get('/quotas'), api.get('/users')]);
      setQuotas(q.data);
      setUtilizadores(u.data);
    } else {
      const { data } = await api.get('/quotas/minhas');
      setQuotas(data);
    }
    setCarregando(false);
  }

  useEffect(() => {
    carregar();
  }, [user]);

  async function handleCriar(e) {
    e.preventDefault();
    await api.post('/quotas', form);
    setForm({ userId: '', ano: anoAtual, mes: new Date().getMonth() + 1, valor: '' });
    setAFormar(false);
    carregar();
  }

  async function marcarPaga(id) {
    await api.patch(`/quotas/${id}/pagar`);
    carregar();
  }

  function nomeResidente(userId) {
    return utilizadores.find((u) => u._id === userId)?.nome || '—';
  }

  return (
    <Layout
      title="Quotas"
      action={
        user?.isAdmin && (
          <button onClick={() => setAFormar((v) => !v)} className="btn-primary">
            {aFormar ? 'Cancelar' : 'Atribuir quota'}
          </button>
        )
      }
    >
      {aFormar && (
        <form onSubmit={handleCriar} className="panel px-6 py-5 mb-6">
          <div className="grid grid-cols-4 gap-3 mb-4">
            <div className="col-span-2">
              <label className="field-label">Residente</label>
              <select required value={form.userId} onChange={(e) => setForm({ ...form, userId: e.target.value })} className="field-input">
                <option value="">Seleciona…</option>
                {utilizadores.map((u) => (
                  <option key={u._id} value={u._id}>{u.nome} — Fração {u.apartamento}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="field-label">Mês</label>
              <select value={form.mes} onChange={(e) => setForm({ ...form, mes: Number(e.target.value) })} className="field-input">
                {MESES.map((m, i) => (
                  <option key={m} value={i + 1}>{m}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="field-label">Ano</label>
              <input type="number" value={form.ano} onChange={(e) => setForm({ ...form, ano: Number(e.target.value) })} className="field-input" />
            </div>
          </div>
          <div className="flex items-end gap-3">
            <div className="flex-1">
              <label className="field-label">Valor (€)</label>
              <input type="number" step="0.01" required value={form.valor} onChange={(e) => setForm({ ...form, valor: e.target.value })} className="field-input" placeholder="35.00" />
            </div>
            <button type="submit" className="btn-primary">Guardar</button>
          </div>
        </form>
      )}

      {carregando ? (
        <p className="text-ink-soft">A carregar…</p>
      ) : quotas.length === 0 ? (
        <EmptyState title="Sem quotas registadas" description={user?.isAdmin ? 'Atribui a primeira quota acima.' : 'Ainda não tens quotas atribuídas.'} />
      ) : (
        <table className="w-full">
          <thead>
            <tr>
              {user?.isAdmin && <th className="table-header">Residente</th>}
              <th className="table-header">Período</th>
              <th className="table-header">Valor</th>
              <th className="table-header">Estado</th>
              {user?.isAdmin && <th className="table-header"></th>}
            </tr>
          </thead>
          <tbody>
            {quotas.map((q) => (
              <tr key={q._id}>
                {user?.isAdmin && <td className="table-cell text-sm text-ink">{nomeResidente(q.userId)}</td>}
                <td className="table-cell text-sm text-ink">{nomeMes(q.mes)} {q.ano}</td>
                <td className="table-cell text-sm text-ink">{formatarMoeda(q.valor)}</td>
                <td className="table-cell">
                  <StatusBadge tone={q.pago ? 'forest' : 'clay'}>
                    {q.pago ? `Pago em ${formatarData(q.dataPagamento)}` : 'Pendente'}
                  </StatusBadge>
                </td>
                {user?.isAdmin && (
                  <td className="table-cell text-right">
                    {!q.pago && (
                      <button onClick={() => marcarPaga(q._id)} className="text-sm text-ink underline underline-offset-2">
                        Marcar como paga
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Layout>
  );
}
