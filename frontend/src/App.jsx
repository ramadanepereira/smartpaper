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
  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Topbar />
        <main style={{ flex: 1, overflowY: 'auto', background: '#F8FAFC', padding: '24px' }}>
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