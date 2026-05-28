require('dotenv').config();
const express = require('express');
const cors    = require('cors');

// Inicializar base de dados (cria tabelas e dados iniciais)
require('./database');

// Rotas
const authRouter       = require('./routes/auth');
const clientesRouter   = require('./routes/clientes');
const servicosRouter   = require('./routes/servicos');
const pedidosRouter    = require('./routes/pedidos');
const pagamentosRouter = require('./routes/pagamentos');

const app  = express();
const PORT = process.env.PORT || 3001;

// ─── MIDDLEWARES ─────────────────────────────────────────────────────────────

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// ─── ROTAS ───────────────────────────────────────────────────────────────────

app.use('/api/auth',        authRouter);
app.use('/api/clientes',    clientesRouter);
app.use('/api/servicos',    servicosRouter);
app.use('/api/pedidos',     pedidosRouter);
app.use('/api/pagamentos',  pagamentosRouter);

// Rota de teste
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    sistema: 'SmartPaper API',
    versao: '1.0.0',
    hora: new Date().toISOString()
  });
});

// ─── ERRO 404 ────────────────────────────────────────────────────────────────

app.use((req, res) => {
  res.status(404).json({ erro: 'Rota não encontrada' });
});

// ─── ERRO GLOBAL ─────────────────────────────────────────────────────────────

app.use((err, req, res, next) => {
  console.error('Erro:', err.message);
  res.status(500).json({ erro: 'Erro interno do servidor' });
});

// ─── INICIAR SERVIDOR ────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`\n🚀 SmartPaper API a correr em http://localhost:${PORT}`);
  console.log(`📋 Health check: http://localhost:${PORT}/api/health\n`);
});