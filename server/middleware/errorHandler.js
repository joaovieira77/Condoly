// Middleware final que apanha qualquer erro passado por next(err)
function errorHandler(err, req, res, next) {
  console.error(err);

  // Erros comuns do driver do MongoDB / ObjectId inválido
  if (err.name === 'BSONError' || /ObjectId/.test(err.message)) {
    return res.status(400).json({ error: 'Identificador inválido.' });
  }

  res.status(err.status || 500).json({
    error: err.message || 'Erro interno do servidor.',
  });
}

module.exports = errorHandler;
