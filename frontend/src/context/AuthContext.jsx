import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const AuthContext = createContext(null);

function readStoredUser() {
  const value = sessionStorage.getItem('taskflow_user');
  if (!value) return null;

  try {
    return JSON.parse(value);
  } catch {
    sessionStorage.removeItem('taskflow_user');
    return null;
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => sessionStorage.getItem('taskflow_token'));
  const [user, setUser] = useState(readStoredUser);
  const [sessionNotice, setSessionNotice] = useState('');

  const clearSession = useCallback((notice = '') => {
    sessionStorage.removeItem('taskflow_token');
    sessionStorage.removeItem('taskflow_user');
    setToken(null);
    setUser(null);
    setSessionNotice(notice);
  }, []);

  useEffect(() => {
    const handleUnauthorized = () => {
      clearSession('Tu sesión expiró. Inicia sesión nuevamente.');
    };
    window.addEventListener('taskflow:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('taskflow:unauthorized', handleUnauthorized);
  }, [clearSession]);

  const startSession = useCallback((response) => {
    const nextToken = response?.data?.token;
    const nextUser = response?.data?.user;
    if (!nextToken || !nextUser) throw new Error('Respuesta de autenticación inválida');

    sessionStorage.setItem('taskflow_token', nextToken);
    sessionStorage.setItem('taskflow_user', JSON.stringify(nextUser));
    setToken(nextToken);
    setUser(nextUser);
    setSessionNotice('');
  }, []);

  const consumeSessionNotice = useCallback(() => {
    setSessionNotice('');
  }, []);

  const value = useMemo(() => ({
    token,
    user,
    isAuthenticated: Boolean(token && user),
    startSession,
    logout: clearSession,
    sessionNotice,
    consumeSessionNotice,
  }), [token, user, startSession, clearSession, sessionNotice, consumeSessionNotice]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe utilizarse dentro de AuthProvider');
  return context;
}
