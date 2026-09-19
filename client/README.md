# Neighbourly — Frontend

Interface em React + Vite + Tailwind CSS, com autenticação por JWT e rotas protegidas por role (residente vs. administrador).

## 🚀 Instalação

```bash
cd neighbourly-frontend
npm install
cp .env.example .env
```

Confirma que `VITE_API_URL` no `.env` aponta para o backend (por omissão, `http://localhost:5000`).

## ▶️ Correr

```bash
npm run dev
```

Abre em `http://localhost:5173`. Certifica-te de que o backend e o MongoDB já estão a correr antes de fazeres login/signup.

## 🧱 Estrutura

```
src/
├── api/client.js          # instância do Axios com JWT automático
├── context/AuthContext.jsx # sessão, login, signup, logout, perfil (isAdmin)
├── components/
│   ├── Layout.jsx          # moldura com sidebar + título da página
│   ├── Sidebar.jsx         # navegação, mostra secção "Administração" só a admins
│   ├── ProtectedRoute.jsx  # exige sessão (e, opcionalmente, isAdmin)
│   ├── StatusBadge.jsx     # selo de estado (pago/pendente/resolvido)
│   └── EmptyState.jsx
├── pages/
│   ├── Login.jsx / Signup.jsx
│   ├── Dashboard.jsx       # resumo: quotas em falta, ocorrências abertas, próxima reunião
│   ├── Quotas.jsx          # residente vê as suas; admin atribui e marca pagamentos
│   ├── Despesas.jsx        # filtro por ano, admin regista/remove
│   ├── Ocorrencias.jsx     # residente reporta; admin resolve com resposta
│   ├── Reunioes.jsx        # agenda, admin agenda/edita/apaga e regista atas
│   ├── Notificacoes.jsx    # anúncios da administração
│   └── GestaoAnual.jsx     # admin define quem administra em cada ano
└── utils/format.js         # moeda, datas, nomes de meses (pt-PT)
```


## ⚠️ Nota sobre o primeiro acesso

Antes de conseguires ver a área de administração, o teu utilizador precisa de estar definido como admin do ano corrente no backend (via `node seed.js`, como explicado no README do backend). Sem isso, o login funciona normalmente, mas vês apenas a experiência de residente.
