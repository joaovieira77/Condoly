const jwt = require('jsonwebtoken');
const { getDb } = require('../config/db');

// Verifica se o pedido tem um token JWT válido
function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token não fornecido.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, email, nome }
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido ou expirado.' });
  }
}

// Verifica se o utilizador autenticado é administrador no ano corrente
// (consulta a coleção gestaoAnual, que define os admins por ano)
async function requireAdmin(req, res, next) {
  try {
    const db = getDb();
    const anoAtual = new Date().getFullYear();
    const gestao = await db.collection('gestaoAnual').findOne({ ano: anoAtual });

    const ehAdmin = gestao?.adminIds?.some((id) => id.toString() === req.user.id);

    if (!ehAdmin) {
      return res.status(403).json({ error: 'Acesso restrito a administradores do ano corrente.' });
    }

    next();
  } catch (err) {
    next(err);
  }
}

module.exports = { verifyToken, requireAdmin };
