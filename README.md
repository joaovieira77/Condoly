# Condoly — Condominium Management App

Condoly is a full-stack web application designed to streamline condominium administration. It empowers residents and annual administrators to manage payments, meetings, expenses, and communication in a secure and organized way.

- Condoly is currently in development (WIP).
- The project is being fully built by me, covering both Backend and Frontend.

## 🌐 Live Overview

Condoly consists of two main components, kept in their own folders in this repository:

- **`client/`** — Frontend built with React (Vite), providing a responsive and role-based user interface.
- **`server/`** — Backend built with Node.js and Express, connected to MongoDB using the native driver.

Each folder has its own `README.md` with setup steps, environment variables, and (for the backend) the full API reference.

## ⚙️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, Vite, Axios, React Router |
| Backend | Node.js, Express, MongoDB (native driver) |
| Auth | JWT (JSON Web Tokens) |
| Security | bcryptjs for password hashing |
| Styling | Tailwind CSS |

## 🔐 Authentication

Condoly uses JWT-based authentication. Users can:

- Sign up as residents (`POST /auth/signup`)
- Log in to access protected features (`POST /auth/login`)
- Tokens are stored in `localStorage` on the client and sent via `Authorization: Bearer <token>` on every request (handled automatically by the Axios client in `client/src/api/client.js`)

## 🧩 Core Features

### 👥 User Roles

- **Resident (Condómino)**: Can view quotas, submit occurrences, and access shared information.
- **Administrator**: Has elevated permissions to manage quotas, expenses, meetings, and notifications.

Whether a logged-in user is an administrator is resolved dynamically from the `gestaoAnual` collection for the current year (`isAdmin` returned by `GET /auth/perfil`) — it is not a fixed flag on the user account.

### 💰 Quotas

- Admins assign quotas to residents and mark payments as received
- Residents can view their own quota status (paid / pending)

### 📦 Expenses (Despesas)

- Admins can register and remove expenses
- All users can view expenses filtered by year

### 🛠️ Occurrences (Ocorrências)

- Residents can report issues
- Admins can resolve them, optionally with a written response

### 📅 Meetings (Reuniões)

- Admins can schedule, edit, and delete meetings, and register minutes (ata)
- All users can view upcoming and past meetings

### 📣 Notifications (Notificações)

- Admins can send announcements
- All users receive and view them

### 🔄 Annual Admin Rotation

- Admins are defined per year in the `gestaoAnual` collection
- Only current-year admins can perform admin-only actions
- Current-year admins can also define who administers future years (`POST /gestao-anual`)

## 🗄️ Database Collections

- `users` — Residents and admins
- `gestaoAnual` — Annual admin assignments
- `quotas` — Payment records
- `despesas` — Expense records
- `ocorrencias` — Reported issues
- `reunioes` — Meeting schedules and minutes
- `notificacoes` — System-wide announcements

## 📁 Project Structure

```
condoly/
├── server/         # Express API + MongoDB
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   ├── utils/
│   ├── seed.js       # bootstraps the first administrator
│   ├── server.js
│   └── README.md      # full API reference
└── client/         # React + Vite + Tailwind
    ├── src/
    │   ├── api/
    │   ├── context/
    │   ├── components/
    │   ├── pages/
    │   └── utils/
    └── README.md      # design notes + setup
```

## 🚀 Getting Started

1. Make sure MongoDB is running locally (or point `MONGODB_URI` to a remote instance).
2. Set up and start the backend — see `server/README.md` (includes how to bootstrap the first administrator via `node seed.js`).
3. Set up and start the frontend — see `client/README.md`.
4. Open `http://localhost:5173` and log in with the administrator account created by the seed script.
