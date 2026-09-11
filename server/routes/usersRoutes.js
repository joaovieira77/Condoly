const express = require('express');
const router = express.Router();
const { verifyToken, requireAdmin } = require('../middleware/auth');
const { listarUtilizadores } = require('../controllers/usersController');

router.get('/', verifyToken, requireAdmin, listarUtilizadores);

module.exports = router;