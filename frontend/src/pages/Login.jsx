import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import operador from '../assets/operador.png';
import logo from '../assets/logo.png';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [erro, setErro] = useState('');
    const [carregando, setCarregando] = useState(false);
    const [mostrarPassword, setMostrarPassword] = useState(false);
    const [lembrar, setLembrar] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    const [mostraEsqueceu, setMostraEsqueceu] = useState(false);
    const [usernameRecuperar, setUsernameRecuperar] = useState('');
    const [mensagemRecuperar, setMensagemRecuperar] = useState('');

    const { login } = useAuth();
    const navigate = useNavigate();

    async function handleLogin(e) {
        e.preventDefault();
        if (!username || !password) { setErro('Username e password são obrigatórios'); return; }
        setErro(''); setCarregando(true);
        try {
            await login(username, password);
            if (lembrar) localStorage.setItem('sp_username', username);
            navigate('/');
        } catch (err) {
            setErro(err.response?.data?.erro || 'Credenciais inválidas');
        } finally { setCarregando(false); }
    }

    const [mostraModalAdmin, setMostraModalAdmin] = useState(false);
    const [senhaAdmin, setSenhaAdmin] = useState('');
    const [erroAdmin, setErroAdmin] = useState('');

    async function acessarComoAdmin() {
        setErroAdmin('');
        if (!senhaAdmin) { setErroAdmin('Insere a senha de administrador.'); return; }
        setCarregando(true);
        try {
            await login('admin', senhaAdmin);
            setMostraModalAdmin(false);
            navigate('/');
        } catch {
            setErroAdmin('Senha incorrecta.');
        } finally { setCarregando(false); }
    }

    function handleEsqueceu(e) {
        e.preventDefault();
        if (!usernameRecuperar) { setMensagemRecuperar('Insere o nome de utilizador.'); return; }
        setMensagemRecuperar('Pedido enviado. O administrador será notificado para repor a tua senha.');
    }

    return (
        <div style={{
            width: '100vw', height: '100vh', display: 'flex',
            fontFamily: "'Inter', sans-serif", overflow: 'hidden',
            background: darkMode ? '#0A1628' : '#0A1628'
        }}>

            {/* ── TOGGLE MODO ESCURO — canto sup direito ── */}
            <div style={{
                position: 'fixed', top: 5, right: 15, zIndex: 999,
                display: 'flex', alignItems: 'center', gap: 3,
                background: 'rgba(255,255,255,0.12)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: 30, padding: '1px 1px',
                backdropFilter: 'blur(8px)'
            }}>
                <span style={{ fontSize: 20 }}>🌙</span>
                <span style={{ color: '#0e0d0d', fontSize: 12, fontWeight: 500 }}></span>
                <div
                    onClick={() => setDarkMode(!darkMode)}
                    style={{
                        width: 38, height: 20, borderRadius: 10,
                        background: '#3B82F6', cursor: 'pointer',
                        position: 'relative', flexShrink: 0
                    }}
                >
                    <div style={{
                        position: 'absolute', top: 2,
                        left: darkMode ? 20 : 2,
                        width: 16, height: 16, borderRadius: '50%',
                        background: '#fff', transition: 'left 0.2s'
                    }} />
                </div>
            </div>

            {/* ── PAINEL ESQUERDO ── */}
            <div style={{
                flex: 1, position: 'relative', overflow: 'hidden',
                background: 'linear-gradient(160deg, #081830 0%, #0D2545 40%, #1a3a6b 100%)',
            }}>

                {/* Círculos decorativos */}
                <div style={{
                    position: 'absolute', top: -100, right: -100,
                    width: 350, height: 350, borderRadius: '50%',
                    border: '1px solid rgba(59,130,246,0.15)', pointerEvents: 'none'
                }} />
                <div style={{
                    position: 'absolute', top: -50, right: -50,
                    width: 220, height: 220, borderRadius: '50%',
                    border: '1px solid rgba(59,130,246,0.1)', pointerEvents: 'none'
                }} />

                {/* Pontos decorativos */}
                <div style={{
                    position: 'absolute', top: 50, left: 40,
                    display: 'grid', gridTemplateColumns: 'repeat(6, 10px)', gap: 8,
                    pointerEvents: 'none'
                }}>
                    {Array(30).fill(0).map((_, i) => (
                        <div key={i} style={{
                            width: 3, height: 3, borderRadius: '50%',
                            background: 'rgba(59,130,246,0.4)'
                        }} />
                    ))}
                </div>

                {/* Texto + features */}
                <div style={{
                    position: 'absolute', top: '50%', left: 60,
                    transform: 'translateY(-50%)',
                    zIndex: 3, maxWidth: 360,
                }}>
                    <h1 style={{
                        color: '#fff', fontSize: 28, fontWeight: 700,
                        lineHeight: 1.4, margin: '0 0 14px'
                    }}>
                        Tudo o que você precisa<br />
                        para{' '}
                        <span style={{ color: '#3B82F6' }}>gerir melhor seu negócio.</span>
                    </h1>
                    <p style={{
                        color: 'rgba(255,255,255,0.6)', fontSize: 13,
                        lineHeight: 1.6, margin: '0 0 36px'
                    }}>
                        Automatize processos, ganhe tempo e tenha controle<br />
                        total da sua reprografia ou papelaria.
                    </p>

                    {[
                        { icon: '🛡️', t: 'Segurança Total', d: 'Seus dados protegidos com\ncriptografia avançada.' },
                        { icon: '📊', t: 'Controle em Tempo Real', d: 'Acompanhe pedidos, clientes e\nfaturamento ao vivo.' },
                        { icon: '🎧', t: 'Suporte Dedicado', d: 'Conte com nosso suporte\nsempre que precisar.' },
                    ].map(item => (
                        <div key={item.t} style={{ display: 'flex', gap: 14, marginBottom: 20, alignItems: 'flex-start' }}>
                            <div style={{
                                width: 40, height: 40, borderRadius: '50%',
                                border: '1.5px solid rgba(255,255,255,0.2)',
                                background: 'rgba(255,255,255,0.06)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: 16, flexShrink: 0
                            }}>{item.icon}</div>
                            <div>
                                <div style={{ color: '#fff', fontWeight: 600, fontSize: 13, marginBottom: 2 }}>{item.t}</div>
                                <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: 12, lineHeight: 1.5, whiteSpace: 'pre-line' }}>{item.d}</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Imagem do operador — UMA SÓ DIV, sem duplicação */}
                <div style={{
                    position: 'absolute', bottom: 0, right: 0,
                    width: '50%', height: '100%',
                    display: 'flex', alignItems: 'flex-end',
                    justifyContent: 'center',
                    pointerEvents: 'none',
                    overflow: 'hidden',
                }}>
                    <div style={{
                        position: 'absolute', bottom: 0, left: 0, right: 0,
                        height: 200,
                        background: 'linear-gradient(to top, #0D2545 0%, transparent 100%)',
                        zIndex: 2,
                    }} />
                    <div style={{
                        position: 'absolute', top: 0, left: 0, bottom: 0,
                        width: 100,
                        background: 'linear-gradient(to right, #0D2545 0%, transparent 100%)',
                        zIndex: 2,
                    }} />
                    <div style={{
                        position: 'absolute', top: 0, right: 0, bottom: 0,
                        width: 60,
                        background: 'linear-gradient(to left, #081830 0%, transparent 100%)',
                        zIndex: 2,
                    }} />
                    <div style={{
                        position: 'absolute', top: 0, left: 0, right: 0,
                        height: 120,
                        background: 'linear-gradient(to bottom, #081830 0%, transparent 100%)',
                        zIndex: 2,
                    }} />
                    <img
                        src={operador}
                        alt="Operador SmartPaper"
                        style={{
                            height: '100%',
                            width: '100%',
                            objectFit: 'cover',
                            objectPosition: 'center top',
                            position: 'relative', zIndex: 1,
                            opacity: 0.85,
                        }}
                    />
                </div>

                {/* Footer */}
                <div style={{
                    position: 'absolute', bottom: 16, left: 0, right: 0,
                    textAlign: 'center', fontSize: 11,
                    color: 'rgba(255,255,255,0.3)', letterSpacing: 0.2,
                    zIndex: 4,
                }}>
                    © 2026 SmartPaper - Gestão Inteligente de Impressão e Papelaria. Todos os direitos reservados.
                </div>

            </div>
            {/* ── FIM PAINEL ESQUERDO ── */}

            {/* ── PAINEL DIREITO — */}
            <div style={{
                width: 500, flexShrink: 0,
                background: darkMode ? '#111827' : '#F0F4F8',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '32px 28px', overflowY: 'auto'
            }}>

                {/* Modal Esqueceu Senha */}
                {mostraEsqueceu && (
                    <div style={{
                        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 500
                    }}>
                        <div style={{
                            background: darkMode ? '#1E293B' : '#fff', borderRadius: 12,
                            padding: '32px', width: 360, boxShadow: '0 8px 40px rgba(0,0,0,0.25)'
                        }}>
                            <h3 style={{ color: darkMode ? '#F1F5F9' : '#1E293B', fontSize: 16, margin: '0 0 8px' }}>
                                Recuperar acesso
                            </h3>
                            <p style={{ color: darkMode ? '#94A3B8' : '#64748B', fontSize: 13, margin: '0 0 16px', lineHeight: 1.5 }}>
                                Insere o teu nome de utilizador e o administrador será notificado para repor a tua senha.
                            </p>
                            <input
                                type="text"
                                placeholder="Nome de utilizador"
                                value={usernameRecuperar}
                                onChange={e => setUsernameRecuperar(e.target.value)}
                                style={{
                                    width: '100%', padding: '10px 12px', borderRadius: 8,
                                    border: '1px solid #E2E8F0', fontSize: 13, marginBottom: 10,
                                    boxSizing: 'border-box', outline: 'none',
                                    background: darkMode ? '#0F172A' : '#fff',
                                    color: darkMode ? '#F1F5F9' : '#1E293B'
                                }}
                            />
                            {mensagemRecuperar && (
                                <div style={{
                                    background: '#D1FAE5', color: '#065F46', borderRadius: 8,
                                    padding: '8px 12px', fontSize: 12, marginBottom: 12
                                }}>{mensagemRecuperar}</div>
                            )}
                            <div style={{ display: 'flex', gap: 8 }}>
                                <button onClick={handleEsqueceu} style={{
                                    flex: 1, padding: '10px', background: '#3B82F6', color: '#fff',
                                    border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600
                                }}>Enviar pedido</button>
                                <button onClick={() => { setMostraEsqueceu(false); setMensagemRecuperar(''); setUsernameRecuperar(''); }} style={{
                                    flex: 1, padding: '10px', background: 'transparent',
                                    color: darkMode ? '#94A3B8' : '#64748B',
                                    border: '1px solid #E2E8F0', borderRadius: 8, cursor: 'pointer', fontSize: 13
                                }}>Cancelar</button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Modal senha Admin */}
                {mostraModalAdmin && (
                    <div style={{
                        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 600
                    }}>
                        <div style={{
                            background: darkMode ? '#1E293B' : '#fff', borderRadius: 12,
                            padding: 32, width: 360, boxShadow: '0 8px 40px rgba(0,0,0,0.3)'
                        }}>
                            <div style={{ textAlign: 'center', marginBottom: 16 }}>
                                <div style={{ fontSize: 36, marginBottom: 8 }}>🔐</div>
                                <h3 style={{ color: darkMode ? '#F1F5F9' : '#1E293B', fontSize: 16, margin: '0 0 6px' }}>
                                    Acesso Administrador
                                </h3>
                                <p style={{ color: darkMode ? '#94A3B8' : '#64748B', fontSize: 13, margin: 0 }}>
                                    Insere a senha de administrador para continuar.
                                </p>
                            </div>
                            <input
                                type="password"
                                placeholder="Senha do administrador"
                                value={senhaAdmin}
                                onChange={e => setSenhaAdmin(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && acessarComoAdmin()}
                                autoFocus
                                style={{
                                    width: '100%', padding: '11px 12px', borderRadius: 8,
                                    border: `1px solid ${erroAdmin ? '#EF4444' : '#E2E8F0'}`,
                                    fontSize: 13, marginBottom: 10, boxSizing: 'border-box',
                                    outline: 'none', background: darkMode ? '#0F172A' : '#fff',
                                    color: darkMode ? '#F1F5F9' : '#1E293B'
                                }}
                            />
                            {erroAdmin && (
                                <div style={{
                                    background: '#FEE2E2', color: '#DC2626', borderRadius: 8,
                                    padding: '8px 12px', fontSize: 12, marginBottom: 10
                                }}>{erroAdmin}</div>
                            )}
                            <div style={{ display: 'flex', gap: 8 }}>
                                <button onClick={acessarComoAdmin} disabled={carregando} style={{
                                    flex: 1, padding: '11px', background: '#2563EB', color: '#fff',
                                    border: 'none', borderRadius: 8, cursor: 'pointer',
                                    fontSize: 13, fontWeight: 600, opacity: carregando ? 0.7 : 1
                                }}>
                                    {carregando ? 'A entrar...' : '→ Entrar'}
                                </button>
                                <button onClick={() => { setMostraModalAdmin(false); setSenhaAdmin(''); setErroAdmin(''); }} style={{
                                    flex: 1, padding: '11px', background: 'transparent',
                                    color: darkMode ? '#94A3B8' : '#64748B',
                                    border: `1px solid ${darkMode ? '#334155' : '#E2E8F0'}`,
                                    borderRadius: 8, cursor: 'pointer', fontSize: 13
                                }}>Cancelar</button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Card de login */}
                <div style={{
                    background: darkMode ? '#1E293B' : '#fff',
                    borderRadius: 16, padding: '20px 28px',
                    width: '100%', boxShadow: '0 4px 32px rgba(0,0,0,0.10)'
                }}>

                    {/* Logo dentro do card */}
                    <div style={{ textAlign: 'center', marginBottom: 10 }}>
                        <div style={{ display: 'inline-block', marginBottom: 4 }}>
                            <img
                                src={logo} alt="SmartPaper"
                                style={{
                                    height: 80, width: 'auto',
                                    objectFit: 'contain',
                                    display: 'block', margin: '0 auto'
                                }}
                            />
                        </div>
                        <p style={{ color: darkMode ? '#64748B' : '#94A3B8', fontSize: 12, fontStyle: 'italic', margin: 0 }}>
                            Gestão inteligente de impressão e papelaria
                        </p>
                    </div>

                    <div style={{ textAlign: 'center', marginBottom: 14 }}>
                        <h2 style={{ fontSize: 20, fontWeight: 700, color: darkMode ? '#F1F5F9' : '#1E293B', margin: '0 0 6px' }}>
                            Bem vindo de volta 👋
                        </h2>
                        <p style={{ color: darkMode ? '#94A3B8' : '#64748B', fontSize: 13, margin: 0, lineHeight: 1.5 }}>
                            Acesse a sua conta para continuar<br />gerenciando seu negócio de forma inteligente.
                        </p>
                    </div>

                    <form onSubmit={handleLogin}>
                        {/* Username */}
                        <div style={{ marginBottom: 10 }}>
                            <label style={{
                                display: 'block', fontSize: 13, fontWeight: 600,
                                color: darkMode ? '#F1F5F9' : '#1E293B', marginBottom: 6,
                                textAlign: 'left'
                            }}>
                                Nome de utilizador
                            </label>
                            <div style={{ position: 'relative' }}>
                                <span style={{
                                    position: 'absolute', left: 12, top: '50%',
                                    transform: 'translateY(-50%)',
                                    color: darkMode ? '#475569' : '#94A3B8', fontSize: 15
                                }}>👤</span>
                                <input
                                    type="text"
                                    placeholder="seu_utilizador"
                                    value={username}
                                    onChange={e => setUsername(e.target.value)}
                                    style={{
                                        width: '100%', padding: '11px 12px 11px 38px',
                                        borderRadius: 8, border: `1px solid ${darkMode ? '#334155' : '#E2E8F0'}`,
                                        fontSize: 13, outline: 'none', boxSizing: 'border-box',
                                        background: darkMode ? '#0F172A' : '#fff',
                                        color: darkMode ? '#F1F5F9' : '#1E293B'
                                    }}
                                />
                            </div>
                        </div>

                        {/* Senha */}
                        <div style={{ marginBottom: 10 }}>
                            <label style={{
                                display: 'block', fontSize: 13, fontWeight: 600,
                                color: darkMode ? '#F1F5F9' : '#1E293B', marginBottom: 6,
                                textAlign: 'left'
                            }}>
                                Senha
                            </label>
                            <div style={{ position: 'relative' }}>
                                <span style={{
                                    position: 'absolute', left: 12, top: '50%',
                                    transform: 'translateY(-50%)',
                                    color: darkMode ? '#475569' : '#94A3B8', fontSize: 15
                                }}>🔒</span>
                                <input
                                    type={mostrarPassword ? 'text' : 'password'}
                                    placeholder="••••••••••"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    style={{
                                        width: '100%', padding: '11px 40px 11px 38px',
                                        borderRadius: 8, border: `1px solid ${darkMode ? '#334155' : '#E2E8F0'}`,
                                        fontSize: 13, outline: 'none', boxSizing: 'border-box',
                                        background: darkMode ? '#0F172A' : '#fff',
                                        color: darkMode ? '#F1F5F9' : '#1E293B'
                                    }}
                                />
                                <span
                                    onClick={() => setMostrarPassword(!mostrarPassword)}
                                    style={{
                                        position: 'absolute', right: 12, top: '50%',
                                        transform: 'translateY(-50%)',
                                        cursor: 'pointer', fontSize: 15,
                                        color: darkMode ? '#475569' : '#94A3B8'
                                    }}
                                >
                                    {mostrarPassword ? '🙈' : '🙉'}
                                </span>
                            </div>
                        </div>

                        {/* Lembrar + Esqueceu */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                            <label style={{
                                display: 'flex', alignItems: 'center', gap: 6,
                                fontSize: 13, color: darkMode ? '#94A3B8' : '#64748B', cursor: 'pointer'
                            }}>
                                <input
                                    type="checkbox" checked={lembrar}
                                    onChange={e => setLembrar(e.target.checked)}
                                    style={{ width: 14, height: 14 }}
                                />
                                Lembrar-me
                            </label>
                            <span
                                onClick={() => setMostraEsqueceu(true)}
                                style={{ fontSize: 13, color: '#3B82F6', cursor: 'pointer', fontWeight: 500 }}
                            >
                                Esqueceu o nome de utilizador ou senha?
                            </span>
                        </div>

                        {/* Erro */}
                        {erro && (
                            <div style={{
                                background: '#FEE2E2', color: '#DC2626', borderRadius: 8,
                                padding: '10px 12px', fontSize: 13, marginBottom: 14
                            }}>{erro}</div>
                        )}

                        {/* Botão Entrar */}
                        <button type="submit" disabled={carregando} style={{
                            width: '100%', padding: '13px',
                            background: '#2563EB', color: '#fff',
                            border: 'none', borderRadius: 8, fontSize: 14,
                            fontWeight: 600, cursor: carregando ? 'not-allowed' : 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                            opacity: carregando ? 0.7 : 1, marginBottom: 10
                        }}>
                            <span>⇒</span> {carregando ? 'A entrar...' : 'Entrar'}
                        </button>
                    </form>

                    {/* Divisor */}
                    <div style={{ position: 'relative', textAlign: 'center', marginBottom: 10 }}>
                        <div style={{
                            position: 'absolute', top: '50%', left: 0, right: 0,
                            height: 1, background: darkMode ? '#334155' : '#E2E8F0'
                        }} />
                        <span style={{
                            position: 'relative', background: darkMode ? '#1E293B' : '#fff',
                            padding: '0 12px', fontSize: 13,
                            color: darkMode ? '#475569' : '#94A3B8'
                        }}>ou</span>
                    </div>

                    {/* Acesso rápido Admin */}
                    <div onClick={() => { setMostraModalAdmin(true); setSenhaAdmin(''); setErroAdmin(''); }} style={{
                        border: `1px solid ${darkMode ? '#334155' : '#E2E8F0'}`,
                        borderRadius: 8, padding: '12px 16px',
                        display: 'flex', alignItems: 'center', gap: 12,
                        cursor: 'pointer', marginBottom: 12,
                        background: darkMode ? '#0F172A' : '#fff'
                    }}>
                        <span style={{ fontSize: 22 }}>👤</span>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 11, color: darkMode ? '#64748B' : '#94A3B8' }}>Acesso rápido</div>
                            <div style={{ fontSize: 13, fontWeight: 600, color: darkMode ? '#F1F5F9' : '#1E293B' }}>
                                Acessar como Administrador
                            </div>
                        </div>
                        <span style={{ color: darkMode ? '#64748B' : '#94A3B8', fontSize: 20 }}>›</span>
                    </div>

                    {/* Nota segurança */}
                    <div style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        gap: 6, fontSize: 12, color: darkMode ? '#475569' : '#94A3B8',
                        textAlign: 'center', lineHeight: 1.5
                    }}>
                        <span>🛡️Para obter acesso ao sistema, entre em contato<br />com o administrador responsável.</span>
                    </div>
                </div>
            </div>

        </div>
    );
}