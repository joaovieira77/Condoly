const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongodb');
const { getDb } = require('../config/db');

function gerarToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
}

async function signup(req, res, next) {
  try {
    const { nome, email, password, apartamento, telefone } = req.body;

    if (!nome || !email || !password || !apartamento) {
      return res.status(400).json({ error: 'Nome, email, password e apartamento são obrigatórios.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'A password deve ter pelo menos 6 caracteres.' });
    }

    const db = getDb();
    const existing = await db.collection('users').findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ error: 'Já existe uma conta com este email.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const novoUser = {
      nome,
      email: email.toLowerCase(),
      password: hashedPassword,
      apartamento,
      telefone: telefone || null,
      createdAt: new Date(),
    };

    const result = await db.collection('users').insertOne(novoUser);
    const token = gerarToken({
      id: result.insertedId.toString(),
      email: novoUser.email,
      nome: novoUser.nome,
    });

    res.status(201).json({
      message: 'Conta criada com sucesso.',
      token,
      user: { id: result.insertedId, nome, email: novoUser.email, apartamento },
    });
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email e password são obrigatórios.' });
    }

    const db = getDb();
    const user = await db.collection('users').findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ error: 'Credenciais inválidas.' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ error: 'Credenciais inválidas.' });
    }

    const token = gerarToken({ id: user._id.toString(), email: user.email, nome: user.nome });

    res.json({
      message: 'Login efetuado com sucesso.',
      token,
      user: { id: user._id, nome: user.nome, email: user.email, apartamento: user.apartamento },
    });
  } catch (err) {
    next(err);
  }
}

async function getPerfil(req, res, next) {
  try {
    const db = getDb();
    const user = await db
      .collection('users')
      .findOne({ _id: new ObjectId(req.user.id) }, { projection: { password: 0 } });

    if (!user) return res.status(404).json({ error: 'Utilizador não encontrado.' });

    const anoAtual = new Date().getFullYear();
    const gestao = await db.collection('gestaoAnual').findOne({ ano: anoAtual });
    const isAdmin = !!gestao?.adminIds?.some((id) => id.toString() === req.user.id);

    res.json({ ...user, isAdmin });
  } catch (err) {
    next(err);
  }
}

module.exports = { signup, login, getPerfil };
