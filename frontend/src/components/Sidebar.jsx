import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { path: '/',            icon: '🏠', label: 'Dashboard'    },
  { path: '/clientes',    icon: '👥', label: 'Clientes'     },
  { path: '/servicos',    icon: '🖨️', label: 'Serviços'     },
  { path: '/pedidos',     icon: '📋', label: 'Pedidos'      },
  { path: '/pagamentos',  icon: '💳', label: 'Pagamentos'   },
  { path: '/relatorios',  icon: '📊', label: 'Relatórios'   },
];

export default function Sidebar() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { logout, utilizador } = useAuth();

  return (
    <div style={{
      width: 220, background: '#1E3A5F', display: 'flex',
      flexDirection: 'column', flexShrink: 0, height: '100vh'
    }}>
      {/* Logo */}
      <div style={{ padding: '20px 16px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36, background: '#3B82F6', borderRadius: 8,
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18
          }}>🖨️</div>
          <div>
            <div style={{ color: '#fff', fontWeight: 700, fontSize: 15 }}>SmartPaper</div>
            <div style={{ color: '#93C5FD', fontSize: 10 }}>Gestão Inteligente</div>
          </div>
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

        <div onClick={() => navigate('/relatorios')} style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '9px 16px', margin: '1px 8px', borderRadius: 8,
          cursor: 'pointer', color: 'rgba(255,255,255,0.6)', fontSize: 13
        }}>
          <span>💾</span> Backup
        </div>
      </nav>

      {/* Utilizador + Sair */}
      <div style={{ padding: '12px 16px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11, marginBottom: 8 }}>
          {utilizador?.nome}
        </div>
        <div onClick={logout} style={{
          display: 'flex', alignItems: 'center', gap: 8,
          cursor: 'pointer', color: 'rgba(255,255,255,0.6)', fontSize: 13
        }}>
          <span>🚪</span> Sair
        </div>
      </div>
    </div>
  );
}