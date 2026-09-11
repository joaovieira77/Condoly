const { ObjectId } = require('mongodb');
const { getDb } = require('../config/db');

// Admin: enviar um anúncio a todos os residentes
async function criarNotificacao(req, res, next) {
  try {
    const { titulo, mensagem } = req.body;
    if (!titulo || !mensagem) {
      return res.status(400).json({ error: 'titulo e mensagem são obrigatórios.' });
    }

    const db = getDb();
    const nova = {
      titulo,
      mensagem,
      criadoPor: new ObjectId(req.user.id),
      data: new Date(),
    };

    const result = await db.collection('notificacoes').insertOne(nova);
    res.status(201).json({ message: 'Notificação enviada.', id: result.insertedId });
  } catch (err) {
    next(err);
  }
}

// Todos: ver notificações
async function listarNotificacoes(req, res, next) {
  try {
    const db = getDb();
    const notificacoes = await db.collection('notificacoes').find({}).sort({ data: -1 }).toArray();
    res.json(notificacoes);
  } catch (err) {
    next(err);
  }
}

module.exports = { criarNotificacao, listarNotificacoes };
