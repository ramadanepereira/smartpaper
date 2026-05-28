const express = require('express');
const db      = require('../database');

const router = express.Router();

// Gerar número de pedido automático: REP-2026-XXXX
function gerarNumeroPedido() {
  const ano = new Date().getFullYear();
  const ultimo = db.prepare(`
    SELECT numero FROM pedidos
    WHERE numero LIKE ? ORDER BY id DESC LIMIT 1
  `).get(`REP-${ano}-%`);

  if (!ultimo) return `REP-${ano}-0001`;

  const partes = ultimo.numero.split('-');
  const seq = parseInt(partes[2]) + 1;
  return `REP-${ano}-${String(seq).padStart(4, '0')}`;
}

// GET /api/pedidos
router.get('/', (req, res) => {
  const { status, search } = req.query;
  let query = `
    SELECT p.*, c.nome as cliente_nome
    FROM pedidos p
    LEFT JOIN clientes c ON p.cliente_id = c.id
    WHERE 1=1
  `;
  const params = [];

  if (status) {
    query += ' AND p.status = ?';
    params.push(status);
  }

  if (search) {
    query += ' AND (p.numero LIKE ? OR p.nome_cliente LIKE ? OR c.nome LIKE ?)';
    params.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }

  query += ' ORDER BY p.id DESC';
  const pedidos = db.prepare(query).all(...params);
  res.json(pedidos);
});

// GET /api/pedidos/:id
router.get('/:id', (req, res) => {
  const pedido = db.prepare(`
    SELECT p.*, c.nome as cliente_nome, c.telefone as cliente_telefone
    FROM pedidos p
    LEFT JOIN clientes c ON p.cliente_id = c.id
    WHERE p.id = ?
  `).get(req.params.id);

  if (!pedido) return res.status(404).json({ erro: 'Pedido não encontrado' });

  const itens = db.prepare('SELECT * FROM pedido_itens WHERE pedido_id = ?').all(req.params.id);
  const pagamentos = db.prepare('SELECT * FROM pagamentos WHERE pedido_id = ?').all(req.params.id);

  res.json({ ...pedido, itens, pagamentos });
});

// POST /api/pedidos
router.post('/', (req, res) => {
  const { cliente_id, nome_cliente, itens, observacoes, criado_por } = req.body;

  if (!itens || itens.length === 0)
    return res.status(400).json({ erro: 'O pedido precisa de pelo menos um item' });

  const numero = gerarNumeroPedido();
  const total  = itens.reduce((sum, item) => sum + (item.quantidade * item.preco_unit), 0);

  const inserirPedido = db.prepare(`
    INSERT INTO pedidos (numero, cliente_id, nome_cliente, total, observacoes, criado_por)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  const inserirItem = db.prepare(`
    INSERT INTO pedido_itens (pedido_id, servico_id, nome, quantidade, preco_unit, subtotal)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  const transacao = db.transaction(() => {
    const result = inserirPedido.run(
      numero,
      cliente_id || null,
      nome_cliente || null,
      total,
      observacoes || null,
      criado_por || null
    );

    const pedidoId = result.lastInsertRowid;
    itens.forEach(item => {
      inserirItem.run(
        pedidoId,
        item.servico_id || null,
        item.nome,
        item.quantidade,
        item.preco_unit,
        item.quantidade * item.preco_unit
      );
    });

    return pedidoId;
  });

  const pedidoId = transacao();
  const novoPedido = db.prepare('SELECT * FROM pedidos WHERE id = ?').get(pedidoId);
  const novosItens = db.prepare('SELECT * FROM pedido_itens WHERE pedido_id = ?').all(pedidoId);

  res.status(201).json({ ...novoPedido, itens: novosItens });
});

// PUT /api/pedidos/:id/status
router.put('/:id/status', (req, res) => {
  const { status } = req.body;
  const statusValidos = ['pendente', 'em_andamento', 'concluido', 'entregue', 'cancelado'];

  if (!statusValidos.includes(status))
    return res.status(400).json({ erro: 'Status inválido' });

  db.prepare(`
    UPDATE pedidos SET status = ?, atualizado_em = datetime('now') WHERE id = ?
  `).run(status, req.params.id);

  const atualizado = db.prepare('SELECT * FROM pedidos WHERE id = ?').get(req.params.id);
  res.json(atualizado);
});

// DELETE /api/pedidos/:id
router.delete('/:id', (req, res) => {
  db.prepare('UPDATE pedidos SET status = ? WHERE id = ?').run('cancelado', req.params.id);
  res.json({ mensagem: 'Pedido cancelado com sucesso' });
});

module.exports = router;