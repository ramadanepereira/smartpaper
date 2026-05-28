const express  = require('express');
const bcrypt   = require('bcryptjs');
const jwt      = require('jsonwebtoken');
const db       = require('../database');

const router = express.Router();
const SECRET = process.env.JWT_SECRET || 'smartpaper_secret';

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res.status(400).json({ erro: 'Username e password são obrigatórios' });

  const utilizador = db.prepare('SELECT * FROM utilizadores WHERE username = ? AND ativo = 1').get(username);

  if (!utilizador)
    return res.status(401).json({ erro: 'Credenciais inválidas' });

  const valido = bcrypt.compareSync(password, utilizador.password);
  if (!valido)
    return res.status(401).json({ erro: 'Credenciais inválidas' });

  const token = jwt.sign(
    { id: utilizador.id, username: utilizador.username, perfil: utilizador.perfil },
    SECRET,
    { expiresIn: '8h' }
  );

  res.json({
    token,
    utilizador: {
      id:       utilizador.id,
      nome:     utilizador.nome,
      username: utilizador.username,
      perfil:   utilizador.perfil
    }
  });
});

// GET /api/auth/me
router.get('/me', (req, res) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ erro: 'Token não fornecido' });

  try {
    const token = auth.split(' ')[1];
    const dados = jwt.verify(token, SECRET);
    const utilizador = db.prepare('SELECT id, nome, username, perfil FROM utilizadores WHERE id = ?').get(dados.id);
    res.json(utilizador);
  } catch {
    res.status(401).json({ erro: 'Token inválido' });
  }
});

module.exports = router;