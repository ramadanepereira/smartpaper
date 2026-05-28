const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'smartpaper.db'));

// Activar foreign keys
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// ─── TABELAS ────────────────────────────────────────────────────────────────

db.exec(`
  CREATE TABLE IF NOT EXISTS utilizadores (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    nome        TEXT    NOT NULL,
    username    TEXT    NOT NULL UNIQUE,
    password    TEXT    NOT NULL,
    perfil      TEXT    NOT NULL DEFAULT 'operador', -- admin | operador
    ativo       INTEGER NOT NULL DEFAULT 1,
    criado_em   TEXT    NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS clientes (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    nome        TEXT    NOT NULL,
    telefone    TEXT,
    email       TEXT,
    tipo        TEXT    NOT NULL DEFAULT 'particular', -- particular | empresa
    nuit        TEXT,
    endereco    TEXT,
    notas       TEXT,
    ativo       INTEGER NOT NULL DEFAULT 1,
    criado_em   TEXT    NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS servicos (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    nome        TEXT    NOT NULL,
    descricao   TEXT,
    preco       REAL    NOT NULL DEFAULT 0,
    unidade     TEXT    NOT NULL DEFAULT 'unidade', -- unidade | pagina | folha
    categoria   TEXT    NOT NULL DEFAULT 'impressao', -- impressao | copia | acabamento | outro
    ativo       INTEGER NOT NULL DEFAULT 1,
    criado_em   TEXT    NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS pedidos (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    numero        TEXT    NOT NULL UNIQUE,
    cliente_id    INTEGER REFERENCES clientes(id),
    nome_cliente  TEXT,
    status        TEXT    NOT NULL DEFAULT 'pendente', -- pendente | em_andamento | concluido | entregue | cancelado
    total         REAL    NOT NULL DEFAULT 0,
    observacoes   TEXT,
    criado_por    INTEGER REFERENCES utilizadores(id),
    criado_em     TEXT    NOT NULL DEFAULT (datetime('now')),
    atualizado_em TEXT    NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS pedido_itens (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    pedido_id   INTEGER NOT NULL REFERENCES pedidos(id) ON DELETE CASCADE,
    servico_id  INTEGER REFERENCES servicos(id),
    nome        TEXT    NOT NULL,
    quantidade  INTEGER NOT NULL DEFAULT 1,
    preco_unit  REAL    NOT NULL DEFAULT 0,
    subtotal    REAL    NOT NULL DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS pagamentos (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    pedido_id   INTEGER NOT NULL REFERENCES pedidos(id),
    valor       REAL    NOT NULL,
    metodo      TEXT    NOT NULL DEFAULT 'dinheiro', -- dinheiro | mpesa | emola | cartao
    referencia  TEXT,
    notas       TEXT,
    criado_por  INTEGER REFERENCES utilizadores(id),
    criado_em   TEXT    NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS tarefas (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo      TEXT    NOT NULL,
    descricao   TEXT,
    prazo       TEXT,
    concluida   INTEGER NOT NULL DEFAULT 0,
    criado_por  INTEGER REFERENCES utilizadores(id),
    criado_em   TEXT    NOT NULL DEFAULT (datetime('now'))
  );
`);

// ─── DADOS INICIAIS ──────────────────────────────────────────────────────────

const bcrypt = require('bcryptjs');

// Criar admin padrão se não existir
const adminExiste = db.prepare('SELECT id FROM utilizadores WHERE username = ?').get('admin');
if (!adminExiste) {
  const hash = bcrypt.hashSync('admin123', 10);
  db.prepare(`
    INSERT INTO utilizadores (nome, username, password, perfil)
    VALUES (?, ?, ?, ?)
  `).run('Administrador', 'admin', hash, 'admin');
  console.log('✅ Utilizador admin criado (username: admin | password: admin123)');
}

// Criar serviços base se não existirem
const servicosExistem = db.prepare('SELECT id FROM servicos LIMIT 1').get();
if (!servicosExistem) {
  const inserirServico = db.prepare(`
    INSERT INTO servicos (nome, descricao, preco, unidade, categoria)
    VALUES (?, ?, ?, ?, ?)
  `);

  const servicosBase = [
    ['Impressão A4 Preto e Branco', 'Impressão simples A4 frente', 5, 'pagina', 'impressao'],
    ['Impressão A4 Colorida',       'Impressão colorida A4 frente', 15, 'pagina', 'impressao'],
    ['Impressão A3 Preto e Branco', 'Impressão simples A3 frente', 10, 'pagina', 'impressao'],
    ['Impressão A3 Colorida',       'Impressão colorida A3 frente', 25, 'pagina', 'impressao'],
    ['Fotocópia A4',                'Cópia simples A4', 3, 'pagina', 'copia'],
    ['Fotocópia A3',                'Cópia simples A3', 6, 'pagina', 'copia'],
    ['Plastificação A4',            'Plastificação formato A4', 30, 'unidade', 'acabamento'],
    ['Plastificação A3',            'Plastificação formato A3', 50, 'unidade', 'acabamento'],
    ['Encadernação',                'Encadernação com espiral', 80, 'unidade', 'acabamento'],
    ['Digitalização',               'Digitalização de documento', 10, 'pagina', 'outro'],
  ];

  servicosBase.forEach(s => inserirServico.run(...s));
  console.log('✅ Serviços base criados');
}

module.exports = db;
