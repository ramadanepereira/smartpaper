import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { AuthProvider } from './context/AuthContext';

import Login      from './pages/Login';
import Dashboard  from './pages/Dashboard';
import Clientes   from './pages/Clientes';
import Servicos   from './pages/Servicos';
import Pedidos    from './pages/Pedidos';
import Pagamentos from './pages/Pagamentos';
import Relatorios from './pages/Relatorios';
import Sidebar    from './components/Sidebar';
import Topbar     from './components/Topbar';

function Layout({ children }) {
  const { darkMode } = useAuth();
  const [sidebarAberta, setSidebarAberta] = useState(true);

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {/* Overlay mobile */}
      {!sidebarAberta ? null : (
        <div
          onClick={() => setSidebarAberta(false)}
          style={{
            display: 'none',
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.5)', zIndex: 40
          }}
          className="sidebar-overlay"
        />
      )}

      {/* Sidebar */}
      <div style={{
        width: sidebarAberta ? 220 : 0,
        overflow: 'hidden',
        transition: 'width 0.25s ease',
        flexShrink: 0
      }}>
        <Sidebar />
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
        <Topbar onToggleSidebar={() => setSidebarAberta(!sidebarAberta)} />
        <main style={{
          flex: 1, overflowY: 'auto', padding: '24px',
          background: darkMode ? '#0F172A' : '#F8FAFC'
        }}>
          {children}
        </main>
      </div>
    </div>
  );
}

function RotaProtegida({ children }) {
  const { utilizador, carregando } = useAuth();
  if (carregando) return <div>A carregar...</div>;
  if (!utilizador) return <Navigate to="/login" replace />;
  return <Layout>{children}</Layout>;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<RotaProtegida><Dashboard /></RotaProtegida>} />
          <Route path="/clientes" element={<RotaProtegida><Clientes /></RotaProtegida>} />
          <Route path="/servicos" element={<RotaProtegida><Servicos /></RotaProtegida>} />
          <Route path="/pedidos" element={<RotaProtegida><Pedidos /></RotaProtegida>} />
          <Route path="/pagamentos" element={<RotaProtegida><Pagamentos /></RotaProtegida>} />
          <Route path="/relatorios" element={<RotaProtegida><Relatorios /></RotaProtegida>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;