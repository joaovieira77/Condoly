# Neighbourly — Backend

API REST em Node.js + Express + MongoDB (driver nativo) para a app de gestão de condomínios **Neighbourly**.

## 🚀 Instalação

```bash
cd neighbourly-backend
npm install
cp .env.example .env
```

Edita o `.env` com a tua ligação ao MongoDB (local ou Atlas) e define um `JWT_SECRET` forte.

## ▶️ Correr o servidor

```bash
npm run dev     # com nodemon (recarrega automaticamente)
npm start        # produção
```

O servidor fica disponível em `http://localhost:5000`.

## 👑 Criar o primeiro administrador

Como as rotas de administração exigem já existir um admin no ano corrente, usa o script de seed uma única vez:

```bash
node seed.js admin@exemplo.com password123 "Nome do Admin" "Fração A"
```

Isto cria (ou promove) o utilizador e define-o como administrador do ano atual em `gestaoAnual`.
Depois disso, esse admin pode usar `POST /gestao-anual` para atribuir admins de anos futuros.

## 🔐 Autenticação

Todas as rotas protegidas esperam o header:

```
Authorization: Bearer <token>
```

O token é obtido em `POST /auth/login` ou `POST /auth/signup`.

## 📚 Endpoints

### Auth
| Método | Rota | Acesso | Descrição |
|---|---|---|---|
| POST | `/auth/signup` | Público | Criar conta de residente |
| POST | `/auth/login` | Público | Iniciar sessão |
| GET | `/auth/perfil` | Autenticado | Ver o próprio perfil (inclui `isAdmin`) |

### Quotas
| Método | Rota | Acesso | Descrição |
|---|---|---|---|
| GET | `/quotas/minhas` | Residente | Ver as próprias quotas |
| GET | `/quotas?ano=2026` | Admin | Ver todas as quotas |
| POST | `/quotas` | Admin | Atribuir quota a um residente |
| PATCH | `/quotas/:id/pagar` | Admin | Marcar quota como paga |

### Despesas
| Método | Rota | Acesso | Descrição |
|---|---|---|---|
| GET | `/despesas/ano/:ano` | Autenticado | Ver despesas de um ano |
| POST | `/despesas` | Admin | Registar despesa |
| DELETE | `/despesas/:id` | Admin | Remover despesa |

### Ocorrências
| Método | Rota | Acesso | Descrição |
|---|---|---|---|
| POST | `/ocorrencias` | Residente | Reportar uma ocorrência |
| GET | `/ocorrencias/minhas` | Residente | Ver as próprias ocorrências |
| GET | `/ocorrencias?estado=pendente` | Admin | Ver todas as ocorrências |
| PATCH | `/ocorrencias/:id/resolver` | Admin | Resolver uma ocorrência |

### Reuniões
| Método | Rota | Acesso | Descrição |
|---|---|---|---|
| GET | `/reunioes` | Autenticado | Ver reuniões agendadas |
| POST | `/reunioes` | Admin | Agendar reunião |
| PATCH | `/reunioes/:id` | Admin | Editar reunião / registar ata |
| DELETE | `/reunioes/:id` | Admin | Apagar reunião |

### Notificações
| Método | Rota | Acesso | Descrição |
|---|---|---|---|
| GET | `/notificacoes` | Autenticado | Ver notificações |
| POST | `/notificacoes` | Admin | Enviar notificação/anúncio |

### Gestão Anual (rotação de administradores)
| Método | Rota | Acesso | Descrição |
|---|---|---|---|
| GET | `/gestao-anual/:ano?` | Autenticado | Ver admins de um ano (por omissão, o ano corrente) |
| POST | `/gestao-anual` | Admin | Definir admins de um ano (`{ ano, adminIds: [] }`) |

## 🗄️ Coleções MongoDB

- `users` — residentes e admins (`nome`, `email`, `password` (hash), `apartamento`, `telefone`)
- `gestaoAnual` — `{ ano, adminIds: [ObjectId] }`
- `quotas` — `{ userId, ano, mes, valor, pago, dataPagamento }`
- `despesas` — `{ descricao, valor, categoria, ano, mes, data, criadoPor }`
- `ocorrencias` — `{ titulo, descricao, criadoPor, estado, resposta, dataCriacao, dataResolucao }`
- `reunioes` — `{ titulo, data, local, ordemTrabalhos, ata, criadoPor }`
- `notificacoes` — `{ titulo, mensagem, criadoPor, data }`

## 🧱 Estrutura do projeto

```
neighbourly-backend/
├── config/db.js              # ligação ao MongoDB
├── middleware/
│   ├── auth.js               # verifyToken + requireAdmin
│   └── errorHandler.js
├── controllers/               # lógica de negócio de cada entidade
├── routes/                    # definição das rotas Express
├── utils/validate.js
├── seed.js                    # cria o 1º administrador
├── server.js                  # ponto de entrada
└── .env.example
```

## ➡️ Próximo passo

Com o backend pronto, o passo seguinte é o frontend em React + Tailwind CSS, consumindo esta API com Axios e React Router (rotas protegidas por role: residente vs. administrador).
