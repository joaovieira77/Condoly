const express = require('express');
const router = express.Router();
const { verifyToken, requireAdmin } = require('../middleware/auth');
const { criarQuota, marcarPaga, listarTodas, listarMinhas } = require('../controllers/quotasController');

router.use(verifyToken);

router.get('/minhas', listarMinhas);
router.get('/', requireAdmin, listarTodas);
router.post('/', requireAdmin, criarQuota);
router.patch('/:id/pagar', requireAdmin, marcarPaga);

module.exports = router;
