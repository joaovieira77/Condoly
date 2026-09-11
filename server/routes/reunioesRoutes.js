const express = require('express');
const router = express.Router();
const { verifyToken, requireAdmin } = require('../middleware/auth');
const {
  criarReuniao,
  editarReuniao,
  apagarReuniao,
  listarReunioes,
} = require('../controllers/reunioesController');

router.use(verifyToken);

router.get('/', listarReunioes);
router.post('/', requireAdmin, criarReuniao);
router.patch('/:id', requireAdmin, editarReuniao);
router.delete('/:id', requireAdmin, apagarReuniao);

module.exports = router;
