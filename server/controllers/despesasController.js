const { ObjectId } = require('mongodb');
const { getDb } = require('../config/db');

// Admin: registar uma despesa
async function criarDespesa(req, res, next) {
  try {
    const { descricao, valor, categoria, ano, mes, data } = req.body;
    if (!descricao || valor === undefined || !ano || !mes) {
      return res.status(400).json({ error: 'descricao, valor, ano e mes são obrigatórios.' });
    }

    const db = getDb();
    const novaDespesa = {
      descricao,
      valor: Number(valor),
      categoria: categoria || 'Geral',
      ano: Number(ano),
      mes: Number(mes),
      data: data ? new Date(data) : new Date(),
      criadoPor: new ObjectId(req.user.id),
      createdAt: new Date(),
    };

    const result = await db.collection('despesas').insertOne(novaDespesa);
    res.status(201).json({ message: 'Despesa registada.', id: result.insertedId });
  } catch (err) {
    next(err);
  }
}

// Todos: ver despesas de um determinado ano
async function listarPorAno(req, res, next) {
  try {
    const { ano } = req.params;
    const db = getDb();

    const despesas = await db
      .collection('despesas')
      .find({ ano: Number(ano) })
      .sort({ mes: -1 })
      .toArray();

    res.json(despesas);
  } catch (err) {
    next(err);
  }
}

// Admin: apagar uma despesa
async function apagarDespesa(req, res, next) {
  try {
    const { id } = req.params;
    const db = getDb();

    const result = await db.collection('despesas').deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) return res.status(404).json({ error: 'Despesa não encontrada.' });

    res.json({ message: 'Despesa removida.' });
  } catch (err) {
    next(err);
  }
}

module.exports = { criarDespesa, listarPorAno, apagarDespesa };
