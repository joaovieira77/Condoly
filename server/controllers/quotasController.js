const { ObjectId } = require('mongodb');
const { getDb } = require('../config/db');

// Admin: atribuir uma quota a um residente
async function criarQuota(req, res, next) {
  try {
    const { userId, ano, mes, valor } = req.body;
    if (!userId || !ano || !mes || valor === undefined) {
      return res.status(400).json({ error: 'userId, ano, mes e valor são obrigatórios.' });
    }

    const db = getDb();
    const novaQuota = {
      userId: new ObjectId(userId),
      ano: Number(ano),
      mes: Number(mes),
      valor: Number(valor),
      pago: false,
      dataPagamento: null,
      createdAt: new Date(),
    };

    const result = await db.collection('quotas').insertOne(novaQuota);
    res.status(201).json({ message: 'Quota criada com sucesso.', id: result.insertedId });
  } catch (err) {
    next(err);
  }
}

// Admin: marcar uma quota como paga
async function marcarPaga(req, res, next) {
  try {
    const { id } = req.params;
    const db = getDb();

    const result = await db.collection('quotas').findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { pago: true, dataPagamento: new Date() } },
      { returnDocument: 'after' }
    );

    if (!result) return res.status(404).json({ error: 'Quota não encontrada.' });
    res.json({ message: 'Quota marcada como paga.', quota: result });
  } catch (err) {
    next(err);
  }
}

// Admin: listar todas as quotas (com filtro opcional por ano)
async function listarTodas(req, res, next) {
  try {
    const { ano } = req.query;
    const db = getDb();
    const filtro = ano ? { ano: Number(ano) } : {};

    const quotas = await db.collection('quotas').find(filtro).sort({ ano: -1, mes: -1 }).toArray();
    res.json(quotas);
  } catch (err) {
    next(err);
  }
}

// Residente: ver as próprias quotas
async function listarMinhas(req, res, next) {
  try {
    const db = getDb();
    const quotas = await db
      .collection('quotas')
      .find({ userId: new ObjectId(req.user.id) })
      .sort({ ano: -1, mes: -1 })
      .toArray();
    res.json(quotas);
  } catch (err) {
    next(err);
  }
}

module.exports = { criarQuota, marcarPaga, listarTodas, listarMinhas };
