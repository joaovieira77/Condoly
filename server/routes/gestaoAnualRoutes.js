const express = require('express');
const router = express.Router();
const { verifyToken, requireAdmin } = require('../middleware/auth');
const { verGestao, definirGestao } = require('../controllers/gestaoAnualController');

router.use(verifyToken);

router.get('/:ano?', verGestao);
router.post('/', requireAdmin, definirGestao);

module.exports = router;
