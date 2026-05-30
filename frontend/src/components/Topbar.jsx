import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Topbar() {
  const { utilizador } = useAuth();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div style={{
      height: 56, background: '#fff', borderBottom: '1px solid #E2E8F0',
      display: 'flex', alignItems: 'center', padding: '0 24px',
      gap: 16, flexShrink: 0
    }}>
      {/* Pesquisa */}
      <div style={{
        flex: 1, maxWidth: 400, background: '#F1F5F9', border: '1px solid #E2E8F0',
        borderRadius: 8, padding: '7px 12px', display: 'flex',
        alignItems: 'center', gap: 8, color: '#64748B', fontSize: 13
      }}>
        <span>🔍</span>
        <span>Pesquisar clientes, pedidos, serviços...</span>
        <span style={{
          marginLeft: 'auto', background: '#E2E8F0',
          borderRadius: 4, padding: '1px 6px', fontSize: 11
        }}>Ctrl+K</span>
      </div>

      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 16 }}>
        {/* Dark mode toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#64748B' }}>
          <span>🌙 Modo escuro</span>
          <div onClick={() => setDarkMode(!darkMode)} style={{
            width: 40, height: 22, borderRadius: 11,
            background: darkMode ? '#3B82F6' : '#CBD5E1',
            cursor: 'pointer', position: 'relative'
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
            <div style={{ color: '#1E293B', fontWeight: 600, fontSize: 13, lineHeight: 1 }}>
              {utilizador?.nome || 'Administrador'}
            </div>
            <div style={{ color: '#64748B', fontSize: 11 }}>{utilizador?.perfil || 'Admin'}</div>
          </div>
        </div>
      </div>
    </div>
  );
}