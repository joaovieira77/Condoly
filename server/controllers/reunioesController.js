const { ObjectId } = require('mongodb');
const { getDb } = require('../config/db');

// Admin: agendar uma reunião
async function criarReuniao(req, res, next) {
  try {
    const { titulo, data, local, ordemTrabalhos } = req.body;
    if (!titulo || !data) {
      return res.status(400).json({ error: 'titulo e data são obrigatórios.' });
    }

    const db = getDb();
    const nova = {
      titulo,
      data: new Date(data),
      local: local || null,
      ordemTrabalhos: ordemTrabalhos || [],
      ata: null,
      criadoPor: new ObjectId(req.user.id),
      createdAt: new Date(),
    };

    const result = await db.collection('reunioes').insertOne(nova);
    res.status(201).json({ message: 'Reunião agendada.', id: result.insertedId });
  } catch (err) {
    next(err);
  }
}

// Admin: editar uma reunião (inclui registar a ata)
async function editarReuniao(req, res, next) {
  try {
    const { id } = req.params;
    const camposPermitidos = ['titulo', 'data', 'local', 'ordemTrabalhos', 'ata'];
    const atualizacao = {};

    for (const campo of camposPermitidos) {
      if (req.body[campo] !== undefined) atualizacao[campo] = req.body[campo];
    }
    if (atualizacao.data) atualizacao.data = new Date(atualizacao.data);

    const db = getDb();
    const result = await db.collection('reunioes').findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: atualizacao },
      { returnDocument: 'after' }
    );

    if (!result) return res.status(404).json({ error: 'Reunião não encontrada.' });
    res.json({ message: 'Reunião atualizada.', reuniao: result });
  } catch (err) {
    next(err);
  }
}

// Admin: apagar uma reunião
async function apagarReuniao(req, res, next) {
  try {
    const { id } = req.params;
    const db = getDb();

    const result = await db.collection('reunioes').deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) return res.status(404).json({ error: 'Reunião não encontrada.' });

    res.json({ message: 'Reunião removida.' });
  } catch (err) {
    next(err);
  }
}

// Todos: ver reuniões agendadas
async function listarReunioes(req, res, next) {
  try {
    const db = getDb();
    const reunioes = await db.collection('reunioes').find({}).sort({ data: 1 }).toArray();
    res.json(reunioes);
  } catch (err) {
    next(err);
  }
}

module.exports = { criarReuniao, editarReuniao, apagarReuniao, listarReunioes };
