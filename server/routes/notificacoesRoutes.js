const express = require('express');
const router = express.Router();
const { verifyToken, requireAdmin } = require('../middleware/auth');
const { criarNotificacao, listarNotificacoes } = require('../controllers/notificacoesController');

router.use(verifyToken);

router.get('/', listarNotificacoes);
router.post('/', requireAdmin, criarNotificacao);

module.exports = router;
