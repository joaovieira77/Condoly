import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import api from '../api/client';

export default function GestaoAnual() {
  const anoAtual = new Date().getFullYear();
  const [ano, setAno] = useState(anoAtual + 1);
  const [utilizadores, setUtilizadores] = useState([]);
  const [selecionados, setSelecionados] = useState([]);
  const [gestaoAtual, setGestaoAtual] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [mensagem, setMensagem] = useState('');

  async function carregar() {
    setCarregando(true);
    const [u, g, atual] = await Promise.all([
      api.get('/users'),
      api.get(`/gestao-anual/${ano}`),
      api.get(`/gestao-anual/${anoAtual}`),
    ]);
    setUtilizadores(u.data);
    setSelecionados(g.data.adminIds?.map((id) => id) || []);
    setGestaoAtual(atual.data);
    setCarregando(false);
  }

  useEffect(() => {
    carregar();
  }, [ano]);

  function toggle(userId) {
    setSelecionados((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  }

  async function guardar(e) {
    e.preventDefault();
    setMensagem('');
    await api.post('/gestao-anual', { ano, adminIds: selecionados });
    setMensagem(`Gestão do ano ${ano} atualizada.`);
  }

  const adminsAtuais = utilizadores.filter((u) => gestaoAtual?.adminIds?.includes(u._id));

  return (
    <Layout title="Gestão anual">
      <div className="panel px-6 py-5 mb-8">
        <p className="text-sm text-ink-soft mb-2">Administradores do ano corrente ({anoAtual})</p>
        {carregando ? (
          <p className="text-sm text-ink-soft">A carregar…</p>
        ) : adminsAtuais.length === 0 ? (
          <p className="text-sm text-ink-soft">Nenhum administrador definido para este ano.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {adminsAtuais.map((a) => (
              <span key={a._id} className="text-sm bg-brass-soft/50 border border-brass/30 rounded px-3 py-1 text-ink">
                {a.nome} · Fração {a.apartamento}
              </span>
            ))}
          </div>
        )}
      </div>

      <form onSubmit={guardar} className="panel px-6 py-5">
        <div className="flex items-center gap-3 mb-5">
          <label className="text-sm text-ink-soft">Definir gestão para o ano</label>
          <input
            type="number"
            value={ano}
            onChange={(e) => setAno(Number(e.target.value))}
            className="field-input w-28"
          />
        </div>

        <p className="field-label mb-2">Seleciona os residentes que serão administradores nesse ano</p>
        <div className="divide-y divide-line/70 border border-line rounded mb-5 max-h-80 overflow-y-auto">
          {utilizadores.map((u) => (
            <label key={u._id} className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-paper-dim/40">
              <input
                type="checkbox"
                checked={selecionados.includes(u._id)}
                onChange={() => toggle(u._id)}
                className="accent-ink"
              />
              <span className="text-sm text-ink">{u.nome}</span>
              <span className="text-sm text-ink-soft ml-auto">Fração {u.apartamento}</span>
            </label>
          ))}
        </div>

        {mensagem && <p className="text-sm text-forest mb-4">{mensagem}</p>}

        <button type="submit" className="btn-primary" disabled={selecionados.length === 0}>
          Guardar gestão de {ano}
        </button>
      </form>
    </Layout>
  );
}
