import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);
const API = 'http://localhost:3001/api';

export function AuthProvider({ children }) {
  const [utilizador, setUtilizador] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [darkMode, setDarkMode]     = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('sp_token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      axios.get(`${API}/auth/me`)
        .then(res => setUtilizador(res.data))
        .catch(() => {
          localStorage.removeItem('sp_token');
          delete axios.defaults.headers.common['Authorization'];
        })
        .finally(() => setCarregando(false));
    } else {
      setCarregando(false);
    }
  }, []);

  async function login(username, password) {
    const res = await axios.post(`${API}/auth/login`, { username, password });
    const { token, utilizador } = res.data;
    localStorage.setItem('sp_token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUtilizador(utilizador);
    return utilizador;
  }

  function logout() {
    localStorage.removeItem('sp_token');
    delete axios.defaults.headers.common['Authorization'];
    setUtilizador(null);
  }

  function toggleDarkMode() {
    setDarkMode(prev => !prev);
  }

  return (
    <AuthContext.Provider value={{ utilizador, carregando, login, logout, darkMode, toggleDarkMode }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export default AuthContext;