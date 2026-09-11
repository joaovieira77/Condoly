import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import StatusBadge from '../components/StatusBadge';
import EmptyState from '../components/EmptyState';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { formatarData, formatarMoeda, nomeMes } from '../utils/format';

export default function Dashboard() {
  const { user } = useAuth();
  const [quotas, setQuotas] = useState([]);
  const [ocorrencias, setOcorrencias] = useState([]);
  const [reunioes, setReunioes] = useState([]);
  const [notificacoes, setNotificacoes] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function carregar() {
      const [q, o, r, n] = await Promise.all([
        api.get('/quotas/minhas'),
        api.get('/ocorrencias/minhas'),
        api.get('/reunioes'),
        api.get('/notificacoes'),
      ]);
      setQuotas(q.data);
      setOcorrencias(o.data);
      setReunioes(r.data);
      setNotificacoes(n.data.slice(0, 3));
      setCarregando(false);
    }
    carregar();
  }, []);

  const quotasPendentes = quotas.filter((q) => !q.pago);
  const proximaReuniao = reunioes.find((r) => new Date(r.data) >= new Date());
  const ocorrenciasAbertas = ocorrencias.filter((o) => o.estado === 'pendente');

  if (carregando) {
    return (
      <Layout title={`Olá, ${user?.nome?.split(' ')[0] || ''}`}>
        <p className="text-ink-soft">A carregar…</p>
      </Layout>
    );
  }

  return (
    <Layout title={`Olá, ${user?.nome?.split(' ')[0] || ''}`}>
      <div className="grid grid-cols-3 gap-5 mb-8">
        <div className="panel px-5 py-5">
          <p className="text-sm text-ink-soft mb-1">Quotas em falta</p>
          <p className="font-display text-3xl text-ink">{quotasPendentes.length}</p>
        </div>
        <div className="panel px-5 py-5">
          <p className="text-sm text-ink-soft mb-1">Ocorrências abertas</p>
          <p className="font-display text-3xl text-ink">{ocorrenciasAbertas.length}</p>
        </div>
        <div className="panel px-5 py-5">
          <p className="text-sm text-ink-soft mb-1">Próxima reunião</p>
          <p className="font-display text-xl text-ink">
            {proximaReuniao ? formatarData(proximaReuniao.data) : 'Nenhuma agendada'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <h2 className="font-display text-lg text-ink mb-3">Quotas por pagar</h2>
          {quotasPendentes.length === 0 ? (
            <EmptyState title="Tudo em dia" description="Não tens quotas pendentes de momento." />
          ) : (
            <div className="panel divide-y divide-line/70">
              {quotasPendentes.slice(0, 5).map((q) => (
                <div key={q._id} className="flex items-center justify-between px-5 py-3.5">
                  <span className="text-sm text-ink">{nomeMes(q.mes)} de {q.ano}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-ink-soft">{formatarMoeda(q.valor)}</span>
                    <StatusBadge tone="clay">Pendente</StatusBadge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 className="font-display text-lg text-ink mb-3">Últimas notificações</h2>
          {notificacoes.length === 0 ? (
            <EmptyState title="Sem notificações" description="Ainda não há anúncios da administração." />
          ) : (
            <div className="panel divide-y divide-line/70">
              {notificacoes.map((n) => (
                <div key={n._id} className="px-5 py-3.5">
                  <p className="text-sm text-ink font-medium">{n.titulo}</p>
                  <p className="text-sm text-ink-soft mt-0.5 line-clamp-2">{n.mensagem}</p>
                  <p className="text-xs text-ink-soft/70 mt-1">{formatarData(n.data)}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
