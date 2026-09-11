import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import EmptyState from '../components/EmptyState';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { formatarDataHora } from '../utils/format';

export default function Reunioes() {
  const { user } = useAuth();
  const [reunioes, setReunioes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [aFormar, setAFormar] = useState(false);
  const [form, setForm] = useState({ titulo: '', data: '', local: '' });
  const [ataAberta, setAtaAberta] = useState(null);
  const [ataTexto, setAtaTexto] = useState('');

  async function carregar() {
    setCarregando(true);
    const { data } = await api.get('/reunioes');
    setReunioes(data);
    setCarregando(false);
  }

  useEffect(() => {
    carregar();
  }, []);

  async function handleCriar(e) {
    e.preventDefault();
    await api.post('/reunioes', form);
    setForm({ titulo: '', data: '', local: '' });
    setAFormar(false);
    carregar();
  }

  async function apagar(id) {
    await api.delete(`/reunioes/${id}`);
    carregar();
  }

  function abrirAta(reuniao) {
    setAtaAberta(reuniao._id);
    setAtaTexto(reuniao.ata || '');
  }

  async function guardarAta(id) {
    await api.patch(`/reunioes/${id}`, { ata: ataTexto });
    setAtaAberta(null);
    carregar();
  }

  const agora = new Date();
  const proximas = reunioes.filter((r) => new Date(r.data) >= agora);
  const passadas = reunioes.filter((r) => new Date(r.data) < agora);

  return (
    <Layout
      title="Reuniões"
      action={
        user?.isAdmin && (
          <button onClick={() => setAFormar((v) => !v)} className="btn-primary">
            {aFormar ? 'Cancelar' : 'Agendar reunião'}
          </button>
        )
      }
    >
      {aFormar && (
        <form onSubmit={handleCriar} className="panel px-6 py-5 mb-6">
          <label className="field-label">Título</label>
          <input required value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} className="field-input mb-4" placeholder="Assembleia geral ordinária" />
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="field-label">Data e hora</label>
              <input type="datetime-local" required value={form.data} onChange={(e) => setForm({ ...form, data: e.target.value })} className="field-input" />
            </div>
            <div>
              <label className="field-label">Local</label>
              <input value={form.local} onChange={(e) => setForm({ ...form, local: e.target.value })} className="field-input" placeholder="Sala de condóminos" />
            </div>
          </div>
          <button type="submit" className="btn-primary mt-4">Agendar</button>
        </form>
      )}

      {carregando ? (
        <p className="text-ink-soft">A carregar…</p>
      ) : reunioes.length === 0 ? (
        <EmptyState title="Sem reuniões agendadas" description="Quando houver uma reunião marcada, aparece aqui." />
      ) : (
        <div className="space-y-8">
          {proximas.length > 0 && (
            <div>
              <h2 className="font-display text-lg text-ink mb-3">Próximas</h2>
              <div className="space-y-3">
                {proximas.map((r) => (
                  <div key={r._id} className="panel px-6 py-5">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-display text-lg text-ink">{r.titulo}</p>
                        <p className="text-sm text-ink-soft mt-0.5">
                          {formatarDataHora(r.data)}{r.local ? ` · ${r.local}` : ''}
                        </p>
                      </div>
                      {user?.isAdmin && (
                        <button onClick={() => apagar(r._id)} className="text-sm text-clay underline underline-offset-2">
                          Apagar
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {passadas.length > 0 && (
            <div>
              <h2 className="font-display text-lg text-ink mb-3">Anteriores</h2>
              <div className="space-y-3">
                {passadas.map((r) => (
                  <div key={r._id} className="panel px-6 py-5">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-display text-lg text-ink">{r.titulo}</p>
                        <p className="text-sm text-ink-soft mt-0.5">
                          {formatarDataHora(r.data)}{r.local ? ` · ${r.local}` : ''}
                        </p>
                      </div>
                      {user?.isAdmin && (
                        <button onClick={() => (ataAberta === r._id ? setAtaAberta(null) : abrirAta(r))} className="text-sm text-ink underline underline-offset-2 whitespace-nowrap">
                          {r.ata ? 'Editar ata' : 'Registar ata'}
                        </button>
                      )}
                    </div>

                    {ataAberta === r._id ? (
                      <div className="mt-3">
                        <textarea rows={4} value={ataTexto} onChange={(e) => setAtaTexto(e.target.value)} className="field-input mb-2" placeholder="Escreve aqui a ata da reunião." />
                        <button onClick={() => guardarAta(r._id)} className="btn-primary">Guardar ata</button>
                      </div>
                    ) : r.ata ? (
                      <div className="bg-paper-dim/60 border border-line rounded px-4 py-3 mt-2">
                        <p className="text-xs text-ink-soft mb-1">Ata</p>
                        <p className="text-sm text-ink whitespace-pre-wrap">{r.ata}</p>
                      </div>
                    ) : (
                      <p className="text-sm text-ink-soft/70 mt-1">Ata ainda não registada.</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </Layout>
  );
}
