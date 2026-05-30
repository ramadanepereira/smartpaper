import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Topbar({ onToggleSidebar }) {
  const { utilizador, darkMode, toggleDarkMode } = useAuth();

  return (
    <div style={{
      height: 56,
      background: darkMode ? '#1E293B' : '#fff',
      borderBottom: `1px solid ${darkMode ? '#334155' : '#E2E8F0'}`,
      display: 'flex', alignItems: 'center', padding: '0 24px',
      gap: 16, flexShrink: 0
    }}>

      {/* Hamburguer — responsivo */}
      <div onClick={onToggleSidebar} style={{
        fontSize: 20, cursor: 'pointer',
        color: darkMode ? '#94A3B8' : '#64748B',
        display: 'flex', alignItems: 'center', padding: '4px'
      }}>☰</div>

      {/* Pesquisa — funcional */}
      <div style={{
        flex: 1, maxWidth: 400,
        background: darkMode ? '#0F172A' : '#F1F5F9',
        border: `1px solid ${darkMode ? '#334155' : '#E2E8F0'}`,
        borderRadius: 8, padding: '7px 12px',
        display: 'flex', alignItems: 'center', gap: 8, fontSize: 13
      }}>
        <span>🔍</span>
        <input
          type="text"
          placeholder="Pesquisar clientes, pedidos, serviços..."
          style={{
            border: 'none', outline: 'none', background: 'transparent',
            fontSize: 13, width: '100%',
            color: darkMode ? '#F1F5F9' : '#1E293B',
          }}
        />
      </div>

      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 16 }}>
        {/* Dark mode toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: darkMode ? '#94A3B8' : '#64748B' }}>
          <span>🌙 Modo escuro</span>
          <div onClick={toggleDarkMode} style={{
            width: 40, height: 22, borderRadius: 11,
            background: darkMode ? '#3B82F6' : '#CBD5E1',
            cursor: 'pointer', position: 'relative', transition: 'background 0.2s'
          }}>
            <div style={{
              position: 'absolute', top: 3,
              left: darkMode ? 21 : 3,
              width: 16, height: 16, borderRadius: '50%',
              background: '#fff', transition: 'left 0.2s'
            }} />
          </div>
        </div>

        {/* Notificações */}
        <div style={{ position: 'relative', cursor: 'pointer' }}>
          <span style={{ fontSize: 18 }}>🔔</span>
          <div style={{
            position: 'absolute', top: -4, right: -4,
            background: '#EF4444', color: '#fff', borderRadius: '50%',
            width: 16, height: 16, fontSize: 10,
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>3</div>
        </div>

        {/* Perfil */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
          <div style={{
            width: 32, height: 32, borderRadius: '50%', background: '#3B82F6',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: 700, fontSize: 13
          }}>
            {utilizador?.nome?.charAt(0) || 'A'}
          </div>
          <div>
            <div style={{ color: darkMode ? '#F1F5F9' : '#1E293B', fontWeight: 600, fontSize: 13, lineHeight: 1 }}>
              {utilizador?.nome || 'Administrador'}
            </div>
            <div style={{ color: '#64748B', fontSize: 11 }}>
              {utilizador?.perfil || 'Admin'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}