const { ObjectId } = require('mongodb');
const { getDb } = require('../config/db');

// Ver quem são os admins de um determinado ano (ou do ano corrente, por omissão)
async function verGestao(req, res, next) {
  try {
    const ano = Number(req.params.ano) || new Date().getFullYear();
    const db = getDb();

    const gestao = await db.collection('gestaoAnual').findOne({ ano });
    res.json(gestao || { ano, adminIds: [] });
  } catch (err) {
    next(err);
  }
}

// Definir/atualizar os administradores de um ano
// Só administradores do ano corrente podem definir a gestão (inclusive de anos futuros)
async function definirGestao(req, res, next) {
  try {
    const { ano, adminIds } = req.body;
    if (!ano || !Array.isArray(adminIds) || adminIds.length === 0) {
      return res.status(400).json({ error: 'ano e adminIds (array não vazio) são obrigatórios.' });
    }

    const db = getDb();
    const objectIds = adminIds.map((id) => new ObjectId(id));

    const result = await db.collection('gestaoAnual').findOneAndUpdate(
      { ano: Number(ano) },
      { $set: { ano: Number(ano), adminIds: objectIds, atualizadoEm: new Date() } },
      { upsert: true, returnDocument: 'after' }
    );

    res.json({ message: `Gestão do ano ${ano} definida com sucesso.`, gestao: result });
  } catch (err) {
    next(err);
  }
}

module.exports = { verGestao, definirGestao };
