const { getDb } = require('../config/db');

async function listarUtilizadores(req, res, next) {
  try {
    const db = getDb();
    const utilizadores = await db
      .collection('users')
      .find({}, { projection: { password: 0 } })
      .sort({ nome: 1 })
      .toArray();

    res.json(utilizadores);
  } catch (err) {
    next(err);
  }
}

module.exports = { listarUtilizadores };