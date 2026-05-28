const express = require('express');
const db      = require('../database');

const router = express.Router();

// GET /api/servicos
router.get('/', (req, res) => {
  const { search, categoria } = req.query;
  let query = 'SELECT * FROM servicos WHERE ativo = 1';
  const params = [];

  if (search) {
    query += ' AND nome LIKE ?';
    params.push(`%${search}%`);
  }

  if (categoria) {
    query += ' AND categoria = ?';
    params.push(categoria);
  }

  query += ' ORDER BY categoria ASC, nome ASC';
  const servicos = db.prepare(query).all(...params);
  res.json(servicos);
});

// GET /api/servicos/:id
router.get('/:id', (req, res) => {
  const servico = db.prepare('SELECT * FROM servicos WHERE id = ? AND ativo = 1').get(req.params.id);
  if (!servico) return res.status(404).json({ erro: 'Serviço não encontrado' });
  res.json(servico);
});

// POST /api/servicos
router.post('/', (req, res) => {
  const { nome, descricao, preco, unidade, categoria } = req.body;
  if (!nome)  return res.status(400).json({ erro: 'Nome é obrigatório' });
  if (!preco) return res.status(400).json({ erro: 'Preço é obrigatório' });

  const result = db.prepare(`
    INSERT INTO servicos (nome, descricao, preco, unidade, categoria)
    VALUES (?, ?, ?, ?, ?)
  `).run(nome, descricao || null, preco, unidade || 'unidade', categoria || 'impressao');

  const novo = db.prepare('SELECT * FROM servicos WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(novo);
});

// PUT /api/servicos/:id
router.put('/:id', (req, res) => {
  const { nome, descricao, preco, unidade, categoria } = req.body;
  if (!nome)  return res.status(400).json({ erro: 'Nome é obrigatório' });
  if (!preco) return res.status(400).json({ erro: 'Preço é obrigatório' });

  db.prepare(`
    UPDATE servicos SET nome=?, descricao=?, preco=?, unidade=?, categoria=?
    WHERE id = ?
  `).run(nome, descricao || null, preco, unidade || 'unidade', categoria || 'impressao', req.params.id);

  const atualizado = db.prepare('SELECT * FROM servicos WHERE id = ?').get(req.params.id);
  res.json(atualizado);
});

// DELETE /api/servicos/:id (soft delete)
router.delete('/:id', (req, res) => {
  db.prepare('UPDATE servicos SET ativo = 0 WHERE id = ?').run(req.params.id);
  res.json({ mensagem: 'Serviço removido com sucesso' });
});

module.exports = router;