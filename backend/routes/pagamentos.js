const express = require('express');
const db      = require('../database');

const router = express.Router();

// GET /api/pagamentos
router.get('/', (req, res) => {
  const { pedido_id, metodo } = req.query;
  let query = `
    SELECT pg.*, p.numero as pedido_numero, p.total as pedido_total
    FROM pagamentos pg
    LEFT JOIN pedidos p ON pg.pedido_id = p.id
    WHERE 1=1
  `;
  const params = [];

  if (pedido_id) {
    query += ' AND pg.pedido_id = ?';
    params.push(pedido_id);
  }

  if (metodo) {
    query += ' AND pg.metodo = ?';
    params.push(metodo);
  }

  query += ' ORDER BY pg.id DESC';
  const pagamentos = db.prepare(query).all(...params);
  res.json(pagamentos);
});

// GET /api/pagamentos/:id
router.get('/:id', (req, res) => {
  const pagamento = db.prepare(`
    SELECT pg.*, p.numero as pedido_numero, p.total as pedido_total
    FROM pagamentos pg
    LEFT JOIN pedidos p ON pg.pedido_id = p.id
    WHERE pg.id = ?
  `).get(req.params.id);

  if (!pagamento) return res.status(404).json({ erro: 'Pagamento não encontrado' });
  res.json(pagamento);
});

// POST /api/pagamentos
router.post('/', (req, res) => {
  const { pedido_id, valor, metodo, referencia, notas, criado_por } = req.body;

  if (!pedido_id) return res.status(400).json({ erro: 'pedido_id é obrigatório' });
  if (!valor)     return res.status(400).json({ erro: 'valor é obrigatório' });

  const metodosValidos = ['dinheiro', 'mpesa', 'emola', 'cartao'];
  if (metodo && !metodosValidos.includes(metodo))
    return res.status(400).json({ erro: 'Método de pagamento inválido' });

  const pedido = db.prepare('SELECT * FROM pedidos WHERE id = ?').get(pedido_id);
  if (!pedido) return res.status(404).json({ erro: 'Pedido não encontrado' });

  const result = db.prepare(`
    INSERT INTO pagamentos (pedido_id, valor, metodo, referencia, notas, criado_por)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(
    pedido_id,
    valor,
    metodo || 'dinheiro',
    referencia || null,
    notas || null,
    criado_por || null
  );

  // Verificar se pedido está totalmente pago
  const totalPago = db.prepare('SELECT SUM(valor) as total FROM pagamentos WHERE pedido_id = ?')
    .get(pedido_id).total || 0;

  if (totalPago >= pedido.total) {
    db.prepare(`UPDATE pedidos SET status = 'concluido', atualizado_em = datetime('now') WHERE id = ?`)
      .run(pedido_id);
  }

  const novo = db.prepare('SELECT * FROM pagamentos WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(novo);
});

// GET /api/pagamentos/resumo/hoje
router.get('/resumo/hoje', (req, res) => {
  const hoje = new Date().toISOString().split('T')[0];

  const total = db.prepare(`
    SELECT SUM(valor) as total FROM pagamentos
    WHERE date(criado_em) = ?
  `).get(hoje).total || 0;

  const porMetodo = db.prepare(`
    SELECT metodo, SUM(valor) as total, COUNT(*) as quantidade
    FROM pagamentos WHERE date(criado_em) = ?
    GROUP BY metodo
  `).all(hoje);

  res.json({ total, porMetodo, data: hoje });
});

module.exports = router;