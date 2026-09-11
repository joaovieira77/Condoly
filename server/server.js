require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

const authRoutes = require('./routes/authRoutes');
const quotasRoutes = require('./routes/quotasRoutes');
const despesasRoutes = require('./routes/despesasRoutes');
const ocorrenciasRoutes = require('./routes/ocorrenciasRoutes');
const reunioesRoutes = require('./routes/reunioesRoutes');
const notificacoesRoutes = require('./routes/notificacoesRoutes');
const gestaoAnualRoutes = require('./routes/gestaoAnualRoutes');
const usersRoutes = require('./routes/usersRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ status: 'ok', app: 'Neighbourly API' });
});

app.use('/auth', authRoutes);
app.use('/quotas', quotasRoutes);
app.use('/despesas', despesasRoutes);
app.use('/ocorrencias', ocorrenciasRoutes);
app.use('/reunioes', reunioesRoutes);
app.use('/notificacoes', notificacoesRoutes);
app.use('/gestao-anual', gestaoAnualRoutes);
app.use('/users', usersRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Rota não encontrada.' });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Neighbourly API a correr em http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Erro ao ligar à base de dados:', err);
    process.exit(1);
  });
