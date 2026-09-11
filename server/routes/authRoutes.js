const express = require('express');
const router = express.Router();
const { signup, login, getPerfil } = require('../controllers/authController');
const { verifyToken } = require('../middleware/auth');

router.post('/signup', signup);
router.post('/login', login);
router.get('/perfil', verifyToken, getPerfil);

module.exports = router;
