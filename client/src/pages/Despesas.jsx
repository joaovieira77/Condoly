import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import EmptyState from '../components/EmptyState';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { formatarData, formatarMoeda, MESES, nomeMes } from '../utils/format';

export default function Despesas() {
  const { user } = useAuth();
  const anoAtual = new Date().getFullYear();
  const [ano, setAno] = useState(anoAtual);
  const [despesas, setDespesas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [aFormar, setAFormar] = useState(false);
  const [form, setForm] = useState({ descricao: '', categoria: '', valor: '', ano: anoAtual, mes: new Date().getMonth() + 1 });

  async function carregar() {
    setCarregando(true);
    const { data } = await api.get(`/despesas/ano/${ano}`);
    setDespesas(data);
    setCarregando(false);
  }

  useEffect(() => {
    carregar();
  }, [ano]);

  async function handleCriar(e) {
    e.preventDefault();
    await api.post('/despesas', form);
    setForm({ descricao: '', categoria: '', valor: '', ano, mes: new Date().getMonth() + 1 });
    setAFormar(false);
    carregar();
  }

  async function apagar(id) {
    await api.delete(`/despesas/${id}`);
    carregar();
  }

  const total = despesas.reduce((soma, d) => soma + d.valor, 0);

  return (
    <Layout
      title="Despesas"
      action={
        user?.isAdmin && (
          <button onClick={() => setAFormar((v) => !v)} className="btn-primary">
            {aFormar ? 'Cancelar' : 'Registar despesa'}
          </button>
        )
      }
    >
      <div className="flex items-center gap-3 mb-6">
        <label className="text-sm text-ink-soft">Ano</label>
        <select value={ano} onChange={(e) => setAno(Number(e.target.value))} className="field-input w-32">
          {[anoAtual, anoAtual - 1, anoAtual - 2].map((a) => (
            <option key={a} value={a}>{a}</option>
          ))}
        </select>
        <div className="ml-auto text-sm text-ink-soft">
          Total do ano: <span className="text-ink font-medium">{formatarMoeda(total)}</span>
        </div>
      </div>

      {aFormar && (
        <form onSubmit={handleCriar} className="panel px-6 py-5 mb-6">
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <label className="field-label">Descrição</label>
              <input required value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} className="field-input" placeholder="Manutenção do elevador" />
            </div>
            <div>
              <label className="field-label">Categoria</label>
              <input value={form.categoria} onChange={(e) => setForm({ ...form, categoria: e.target.value })} className="field-input" placeholder="Manutenção" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="field-label">Valor (€)</label>
              <input type="number" step="0.01" required value={form.valor} onChange={(e) => setForm({ ...form, valor: e.target.value })} className="field-input" />
            </div>
            <div>
              <label className="field-label">Mês</label>
              <select value={form.mes} onChange={(e) => setForm({ ...form, mes: Number(e.target.value) })} className="field-input">
                {MESES.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
              </select>
            </div>
            <div>
              <label className="field-label">Ano</label>
              <input type="number" value={form.ano} onChange={(e) => setForm({ ...form, ano: Number(e.target.value) })} className="field-input" />
            </div>
          </div>
          <button type="submit" className="btn-primary mt-4">Guardar</button>
        </form>
      )}

      {carregando ? (
        <p className="text-ink-soft">A carregar…</p>
      ) : despesas.length === 0 ? (
        <EmptyState title="Sem despesas registadas" description={`Ainda não há despesas registadas para ${ano}.`} />
      ) : (
        <table className="w-full">
          <thead>
            <tr>
              <th className="table-header">Descrição</th>
              <th className="table-header">Categoria</th>
              <th className="table-header">Data</th>
              <th className="table-header">Valor</th>
              {user?.isAdmin && <th className="table-header"></th>}
            </tr>
          </thead>
          <tbody>
            {despesas.map((d) => (
              <tr key={d._id}>
                <td className="table-cell text-sm text-ink">{d.descricao}</td>
                <td className="table-cell text-sm text-ink-soft">{d.categoria}</td>
                <td className="table-cell text-sm text-ink-soft">{formatarData(d.data)}</td>
                <td className="table-cell text-sm text-ink">{formatarMoeda(d.valor)}</td>
                {user?.isAdmin && (
                  <td className="table-cell text-right">
                    <button onClick={() => apagar(d._id)} className="text-sm text-clay underline underline-offset-2">
                      Remover
                    </button>
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
