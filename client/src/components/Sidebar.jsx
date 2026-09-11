import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const linksBase = [
  { to: '/', label: 'Resumo', end: true },
  { to: '/quotas', label: 'Quotas' },
  { to: '/despesas', label: 'Despesas' },
  { to: '/ocorrencias', label: 'Ocorrências' },
  { to: '/reunioes', label: 'Reuniões' },
  { to: '/notificacoes', label: 'Notificações' },
];

const linksAdmin = [{ to: '/gestao-anual', label: 'Gestão anual' }];

export default function Sidebar() {
  const { user, logout } = useAuth();

  return (
    <aside className="w-64 shrink-0 border-r border-line bg-paper flex flex-col h-screen sticky top-0">
      <div className="px-6 pt-8 pb-6 border-b border-line">
        <p className="font-display text-2xl text-ink">Neighbourly</p>
        <p className="text-sm text-ink-soft mt-1">Livro do condomínio</p>
      </div>

      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        {linksBase.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) =>
              `block px-3 py-2.5 mb-0.5 rounded text-[15px] border-l-2 transition ${
                isActive
                  ? 'border-ink bg-paper-dim text-ink font-medium'
                  : 'border-transparent text-ink-soft hover:text-ink hover:bg-paper-dim/60'
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}

        {user?.isAdmin && (
          <>
            <div className="h-px bg-line my-3 mx-3" />
            <p className="px-3 pb-1 text-xs text-ink-soft">Administração</p>
            {linksAdmin.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `block px-3 py-2.5 mb-0.5 rounded text-[15px] border-l-2 transition ${
                    isActive
                      ? 'border-brass bg-brass-soft/40 text-ink font-medium'
                      : 'border-transparent text-ink-soft hover:text-ink hover:bg-paper-dim/60'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </>
        )}
      </nav>

      <div className="px-4 py-4 border-t border-line">
        <div className="flex items-center justify-between px-2 py-2 rounded bg-paper-dim/60 mb-2">
          <div className="min-w-0">
            <p className="text-sm text-ink truncate">{user?.nome}</p>
            <p className="text-xs text-ink-soft truncate">
              Fração {user?.apartamento} {user?.isAdmin && '· Administrador'}
            </p>
          </div>
        </div>
        <button onClick={logout} className="w-full text-sm text-ink-soft hover:text-ink text-left px-2 py-1.5">
          Terminar sessão
        </button>
      </div>
    </aside>
  );
}
