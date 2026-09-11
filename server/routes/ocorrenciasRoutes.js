const express = require('express');
const router = express.Router();
const { verifyToken, requireAdmin } = require('../middleware/auth');
const {
  criarOcorrencia,
  listarTodas,
  listarMinhas,
  resolverOcorrencia,
} = require('../controllers/ocorrenciasController');

router.use(verifyToken);

router.post('/', criarOcorrencia);
router.get('/minhas', listarMinhas);
router.get('/', requireAdmin, listarTodas);
router.patch('/:id/resolver', requireAdmin, resolverOcorrencia);

module.exports = router;
