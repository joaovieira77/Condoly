const express = require('express');
const router = express.Router();
const { verifyToken, requireAdmin } = require('../middleware/auth');
const { criarDespesa, listarPorAno, apagarDespesa } = require('../controllers/despesasController');

router.use(verifyToken);

router.get('/ano/:ano', listarPorAno);
router.post('/', requireAdmin, criarDespesa);
router.delete('/:id', requireAdmin, apagarDespesa);

module.exports = router;
