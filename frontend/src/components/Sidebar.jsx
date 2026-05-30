import logo from '../assets/logo.png';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { path: '/', icon: '🏠', label: 'Dashboard' },
  { path: '/clientes', icon: '👥', label: 'Clientes' },
  { path: '/servicos', icon: '🖨️', label: 'Serviços' },
  { path: '/pedidos', icon: '📋', label: 'Pedidos' },
  { path: '/pagamentos', icon: '💳', label: 'Pagamentos' },
  { path: '/relatorios', icon: '📊', label: 'Relatórios' },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, utilizador, darkMode } = useAuth();
  return (
    <div style={{
      width: 220,
      background: darkMode ? '#0F172A' : '#1E3A5F',
      display: 'flex', flexDirection: 'column',
      flexShrink: 0, height: '100vh',
      borderRight: `1px solid ${darkMode ? '#1E293B' : 'transparent'}`
    }}>

      {/* Logo */}
      <div style={{ padding: '16px', borderBottom: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>
        <img src={logo} alt="SmartPaper" style={{ height: 48, objectFit: 'contain', marginBottom: 4 }} />
        <div style={{ color: '#93C5FD', fontSize: 9, lineHeight: 1.4 }}>
          Gestão inteligente de impressão e papelaria
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '12px 0', overflowY: 'auto' }}>
        {navItems.map(item => {
          const active = location.pathname === item.path;
          return (
            <div key={item.path} onClick={() => navigate(item.path)} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '9px 16px', margin: '1px 8px', borderRadius: 8,
              cursor: 'pointer', fontSize: 13, fontWeight: active ? 600 : 400,
              background: active ? '#3B82F6' : 'transparent',
              color: active ? '#fff' : 'rgba(255,255,255,0.7)',
            }}>
              <span style={{ fontSize: 15 }}>{item.icon}</span>
              {item.label}
            </div>
          );
        })}

        <div style={{ margin: '12px 16px 4px', fontSize: 10, color: 'rgba(255,255,255,0.35)', letterSpacing: 1 }}>
          EXTRAS
        </div>

        {[
          { icon: '💾', label: 'Backup de Dados' },
          { icon: '❓', label: 'Ajuda' },
        ].map(item => (
          <div key={item.label} style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '9px 16px', margin: '1px 8px', borderRadius: 8,
            cursor: 'pointer', color: 'rgba(255,255,255,0.6)', fontSize: 13
          }}>
            <span>{item.icon}</span> {item.label}
          </div>
        ))}
      </nav>
      {/* Utilizador + Sair */}
      <div style={{ padding: '10px 16px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <div onClick={logout} style={{
          display: 'flex', alignItems: 'center', gap: 10,
          cursor: 'pointer', color: '#F87171', fontSize: 13,
          padding: '8px 10px', borderRadius: 8,
          background: 'rgba(248,113,113,0.08)',
          transition: 'background 0.15s'
        }}>
          <span style={{ fontSize: 16 }}>↪️</span> Sair da conta
        </div>
      </div>

      {/* Dica Rápida */}
      <div style={{ margin: '8px 10px 14px', background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.25)', borderRadius: 10, padding: '12px' }}>
        <div style={{ color: '#93C5FD', fontWeight: 600, fontSize: 12, marginBottom: 4 }}>💡 Dica Rápida</div>
        <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: 11, lineHeight: 1.5, marginBottom: 8 }}>
          Use relatórios para acompanhar o crescimento do seu negócio.
        </div>
        <div style={{ textAlign: 'center', fontSize: 28 }}>📈</div>
      </div>
    </div>
  );
}