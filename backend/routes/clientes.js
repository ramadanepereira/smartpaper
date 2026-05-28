const express = require('express');
const db      = require('../database');

const router = express.Router();

// GET /api/clientes
router.get('/', (req, res) => {
  const { search } = req.query;
  let clientes;

  if (search) {
    clientes = db.prepare(`
      SELECT * FROM clientes
      WHERE ativo = 1 AND (nome LIKE ? OR telefone LIKE ? OR email LIKE ?)
      ORDER BY nome ASC
    `).all(`%${search}%`, `%${search}%`, `%${search}%`);
  } else {
    clientes = db.prepare('SELECT * FROM clientes WHERE ativo = 1 ORDER BY nome ASC').all();
  }

  res.json(clientes);
});

// GET /api/clientes/:id
router.get('/:id', (req, res) => {
  const cliente = db.prepare('SELECT * FROM clientes WHERE id = ? AND ativo = 1').get(req.params.id);
  if (!cliente) return res.status(404).json({ erro: 'Cliente não encontrado' });
  res.json(cliente);
});

// POST /api/clientes
router.post('/', (req, res) => {
  const { nome, telefone, email, tipo, nuit, endereco, notas } = req.body;
  if (!nome) return res.status(400).json({ erro: 'Nome é obrigatório' });

  const result = db.prepare(`
    INSERT INTO clientes (nome, telefone, email, tipo, nuit, endereco, notas)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(nome, telefone || null, email || null, tipo || 'particular', nuit || null, endereco || null, notas || null);

  const novo = db.prepare('SELECT * FROM clientes WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(novo);
});

// PUT /api/clientes/:id
router.put('/:id', (req, res) => {
  const { nome, telefone, email, tipo, nuit, endereco, notas } = req.body;
  if (!nome) return res.status(400).json({ erro: 'Nome é obrigatório' });

  db.prepare(`
    UPDATE clientes SET nome=?, telefone=?, email=?, tipo=?, nuit=?, endereco=?, notas=?
    WHERE id = ?
  `).run(nome, telefone || null, email || null, tipo || 'particular', nuit || null, endereco || null, notas || null, req.params.id);

  const atualizado = db.prepare('SELECT * FROM clientes WHERE id = ?').get(req.params.id);
  res.json(atualizado);
});

// DELETE /api/clientes/:id (soft delete)
router.delete('/:id', (req, res) => {
  db.prepare('UPDATE clientes SET ativo = 0 WHERE id = ?').run(req.params.id);
  res.json({ mensagem: 'Cliente removido com sucesso' });
});

module.exports = router;