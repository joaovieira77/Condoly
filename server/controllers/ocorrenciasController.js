const { ObjectId } = require('mongodb');
const { getDb } = require('../config/db');

// Residente: reportar uma ocorrência
async function criarOcorrencia(req, res, next) {
  try {
    const { titulo, descricao } = req.body;
    if (!titulo || !descricao) {
      return res.status(400).json({ error: 'titulo e descricao são obrigatórios.' });
    }

    const db = getDb();
    const nova = {
      titulo,
      descricao,
      criadoPor: new ObjectId(req.user.id),
      estado: 'pendente', // pendente | resolvido
      resposta: null,
      dataCriacao: new Date(),
      dataResolucao: null,
    };

    const result = await db.collection('ocorrencias').insertOne(nova);
    res.status(201).json({ message: 'Ocorrência registada.', id: result.insertedId });
  } catch (err) {
    next(err);
  }
}

// Admin: ver todas as ocorrências (filtro opcional por estado)
async function listarTodas(req, res, next) {
  try {
    const db = getDb();
    const { estado } = req.query;
    const filtro = estado ? { estado } : {};

    const ocorrencias = await db.collection('ocorrencias').find(filtro).sort({ dataCriacao: -1 }).toArray();
    res.json(ocorrencias);
  } catch (err) {
    next(err);
  }
}

// Residente: ver as próprias ocorrências
async function listarMinhas(req, res, next) {
  try {
    const db = getDb();
    const ocorrencias = await db
      .collection('ocorrencias')
      .find({ criadoPor: new ObjectId(req.user.id) })
      .sort({ dataCriacao: -1 })
      .toArray();
    res.json(ocorrencias);
  } catch (err) {
    next(err);
  }
}

// Admin: resolver uma ocorrência
async function resolverOcorrencia(req, res, next) {
  try {
    const { id } = req.params;
    const { resposta } = req.body;
    const db = getDb();

    const result = await db.collection('ocorrencias').findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { estado: 'resolvido', resposta: resposta || null, dataResolucao: new Date() } },
      { returnDocument: 'after' }
    );

    if (!result) return res.status(404).json({ error: 'Ocorrência não encontrada.' });
    res.json({ message: 'Ocorrência resolvida.', ocorrencia: result });
  } catch (err) {
    next(err);
  }
}

module.exports = { criarOcorrencia, listarTodas, listarMinhas, resolverOcorrencia };
